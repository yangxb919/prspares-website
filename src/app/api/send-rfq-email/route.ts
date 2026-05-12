import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { sendRfqEmail, type RfqEmailInput } from '@/lib/email/sendRfqEmail';
import { verifyTurnstileToken } from '@/lib/security/verifyTurnstile';
import { checkSubmission } from '@/lib/security/spam-checks';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface RfqEmailRequest extends Partial<RfqEmailInput> {
  turnstileToken?: string;
  honeypot?: string;
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

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RfqEmailRequest;
    const ip = getClientIP(request);

    // 1. Rate limit per IP — 5 RFQ submissions per minute is plenty for a real buyer.
    const rl = checkRateLimit(`rfq:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions, please try again in a minute.' },
        { status: 429 }
      );
    }

    // 2. Honeypot + cheap content checks (silent reject — return generic 400)
    const spam = checkSubmission({
      honeypot: body.honeypot,
      email: body.email,
      message: body.message,
    });
    if (!spam.ok) {
      console.warn('[RFQ email] spam check rejected:', spam.reason, 'ip:', ip);
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // 3. Turnstile token verification
    const turnstile = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: turnstile.reason || 'Captcha verification failed' },
        { status: 403 }
      );
    }

    // 4. Field validation (existing)
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Security: always derive IP from request headers. Never trust client-supplied IP
    // (attackers can spoof it, and bouncing client IP via 3rd-party lookup APIs leaks
    // visitor IPs outside our trust boundary — PDPL/PDPA compliance concern for SEA users).
    const company = body.company?.trim() || '';
    const phone = body.phone?.trim() || '';
    const productInterest = body.productInterest?.trim() || '';
    const pageUrl = body.pageUrl?.trim() || '';
    const submittedAt = body.submittedAt?.trim() || new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || '';

    let dbOk = false;
    let emailOk = false;
    let dbError: string | null = null;
    let emailError: string | null = null;

    // 5a. Defensive persistence: write to Supabase first so the lead is never lost
    //     if SMTP fails or the email gets stuck in a spam folder. Service-role key
    //     bypasses RLS. Independent from email delivery — either channel succeeding
    //     captures the inquiry.
    try {
      const supabase = getAdminClient();
      const { error } = await supabase.from('contact_submissions').insert({
        name,
        email,
        message,
        company: company || null,
        phone: phone || null,
        product_interest: productInterest || null,
        source: 'wholesale-inquiry',
        page_url: pageUrl || null,
        ip_address: ip || null,
        user_agent: userAgent || null,
      });
      if (error) throw error;
      dbOk = true;
    } catch (err: any) {
      dbError = err?.message || err?.code || JSON.stringify(err) || String(err);
      console.error('[RFQ email] Supabase insert failed:', dbError, err);
    }

    // 5b. Email notification — independent channel
    try {
      await sendRfqEmail({
        name,
        email,
        company,
        phone,
        productInterest,
        message,
        pageUrl,
        ip,
        submittedAt,
      });
      emailOk = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error('[RFQ email] Email send failed:', emailError);
    }

    // If both channels failed the lead is truly lost — surface a 5xx so the
    // frontend doesn't show "Thank you" and fire a conversion event for a
    // dropped inquiry. Otherwise treat as captured.
    if (!dbOk && !emailOk) {
      return NextResponse.json(
        { error: 'Failed to record inquiry', dbError, emailError },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, dbOk, emailOk });
  } catch (error) {
    console.error('[RFQ email] Failed to send notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send RFQ email' },
      { status: 500 }
    );
  }
}
