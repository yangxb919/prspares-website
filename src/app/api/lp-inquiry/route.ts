import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { sendRfqEmail } from '@/lib/email/sendRfqEmail';
import { verifyTurnstileToken } from '@/lib/security/verifyTurnstile';
import { checkSubmission } from '@/lib/security/spam-checks';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface LpInquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productInterest?: string;
  message?: string;
  /** Optional qualifiers mirroring /wholesale-inquiry — never required (06-17 leak lesson). */
  monthlyVolume?: string;
  heardAbout?: string;
  pageUrl?: string;
  source?: string;
  turnstileToken?: string;
  honeypot?: string;
  /** First-touch content attribution captured client-side (best-effort). */
  attribution?: Record<string, unknown> | null;
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return request.ip || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LpInquiryPayload>;
    const ip = getClientIP(request);

    // Rate limit, honeypot/content, then captcha — fail fast before DB/email work.
    const rl = checkRateLimit(`lp:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions, please try again in a minute.' },
        { status: 429 }
      );
    }

    const spam = checkSubmission({
      honeypot: body.honeypot,
      email: body.email,
      message: body.message,
    });
    if (!spam.ok) {
      console.warn('[LP Inquiry] spam check rejected:', spam.reason, 'ip:', ip);
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const turnstile = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: turnstile.reason || 'Captcha verification failed' },
        { status: 403 }
      );
    }

    const name = body.name?.trim();
    const email = body.email?.trim();
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || '';
    const message = body.message?.trim() || '';
    const source = body.source?.trim() || '';
    const pageUrl = body.pageUrl?.trim() || '';
    const company = body.company?.trim() || '';
    const phone = body.phone?.trim() || '';
    const productInterest = body.productInterest?.trim() || '';
    const monthlyVolume = body.monthlyVolume?.trim() || '';
    const heardAbout = body.heardAbout?.trim() || '';
    const attribution =
      body.attribution && typeof body.attribution === 'object' ? body.attribution : null;

    // Build a structured message that preserves all fields, since contact_submissions
    // only has name/email/message columns.
    const structuredMessage = [
      message || `[Landing Page Inquiry] ${source || pageUrl}`,
      '',
      '--- Lead details ---',
      `company: ${company || 'N/A'}`,
      `phone: ${phone || 'N/A'}`,
      `productInterest: ${productInterest || 'N/A'}`,
      `monthly purchase volume: ${monthlyVolume || 'N/A'}`,
      `heard about us: ${heardAbout || 'N/A'}`,
      `source: ${source || 'N/A'}`,
      `pageUrl: ${pageUrl || 'N/A'}`,
      `submittedAt: ${now}`,
    ].join('\n');

    let dbOk = false;
    let emailOk = false;
    let dbError: string | null = null;
    let emailError: string | null = null;

    // 1. Persist to Supabase contact_submissions (service-role bypasses RLS)
    try {
      const supabase = getAdminClient();
      const baseRow = {
        name,
        email,
        message: structuredMessage, // keep structured text for back-compat
        company: company || null,
        phone: phone || null,
        product_interest: productInterest || null,
        source: source || null,
        page_url: pageUrl || null,
        ip_address: ip || null,
        user_agent: userAgent || null,
      };
      let { error } = await supabase
        .from('contact_submissions')
        .insert({ ...baseRow, attribution });
      // If the attribution column hasn't been migrated yet, never drop the lead.
      if (error && /attribution/i.test(error.message || '')) {
        ({ error } = await supabase.from('contact_submissions').insert(baseRow));
      }
      if (error) throw error;
      dbOk = true;
    } catch (err: any) {
      dbError = err?.message || err?.code || JSON.stringify(err) || String(err);
      console.error('[LP Inquiry] Supabase insert failed:', dbError, err);
    }

    // 2. Send email notification directly (no internal HTTP fetch — middleware would 403 it)
    try {
      await sendRfqEmail({
        name,
        email,
        company,
        phone,
        productInterest: productInterest || source,
        // 邮件正文也带上两个限定字段——买家规模信号要在收件箱直接可见（大单插队判断依赖它）
        message: [
          message || `Landing page inquiry from: ${source || pageUrl}`,
          monthlyVolume ? `Monthly purchase volume: ${monthlyVolume}` : '',
          heardAbout ? `Heard about us: ${heardAbout}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        pageUrl,
        ip,
        submittedAt: now,
      });
      emailOk = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error('[LP Inquiry] Email send failed:', emailError);
    }

    // If at least one channel succeeded the lead is captured -> success.
    // If BOTH failed, surface a 5xx so the frontend stops firing fake conversions.
    if (!dbOk && !emailOk) {
      return NextResponse.json(
        {
          error: 'Failed to record inquiry',
          dbError,
          emailError,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, dbOk, emailOk });
  } catch (error) {
    console.error('[LP Inquiry] Failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
