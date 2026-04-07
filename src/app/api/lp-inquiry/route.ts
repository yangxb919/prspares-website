import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { sendRfqEmail } from '@/lib/email/sendRfqEmail';

export const runtime = 'nodejs';

interface LpInquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productInterest?: string;
  message?: string;
  pageUrl?: string;
  source?: string;
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

    const name = body.name?.trim();
    const email = body.email?.trim();
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const message = body.message?.trim() || '';
    const source = body.source?.trim() || '';
    const pageUrl = body.pageUrl?.trim() || '';
    const company = body.company?.trim() || '';
    const phone = body.phone?.trim() || '';
    const productInterest = body.productInterest?.trim() || '';

    // Build a structured message that preserves all fields, since contact_submissions
    // only has name/email/message columns.
    const structuredMessage = [
      message || `[Landing Page Inquiry] ${source || pageUrl}`,
      '',
      '--- Lead details ---',
      `company: ${company || 'N/A'}`,
      `phone: ${phone || 'N/A'}`,
      `productInterest: ${productInterest || 'N/A'}`,
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
      const { error } = await supabase.from('contact_submissions').insert({
        name,
        email,
        message: structuredMessage,
        ip_address: ip || null,
        user_agent: userAgent || null,
      });
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
        message: message || `Landing page inquiry from: ${source || pageUrl}`,
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
