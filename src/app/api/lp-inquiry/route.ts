import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface LpInquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productInterest?: string;
  message?: string;
  pageUrl?: string;
  source?: string; // landing page identifier, e.g. "wholesale-2024"
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
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const ip = getClientIP(request);
    const message = body.message?.trim() || '';
    const source = body.source?.trim() || '';
    const pageUrl = body.pageUrl?.trim() || '';
    const company = body.company?.trim() || '';
    const phone = body.phone?.trim() || '';
    const productInterest = body.productInterest?.trim() || '';

    // 1. Save to Supabase (same rfqs table as main site)
    try {
      const supabase = createClient();
      await supabase.from('rfqs').insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        product_interest: productInterest || source || null,
        message: message || `[Landing Page Inquiry] ${source}`,
        page_url: pageUrl || null,
        ip: ip || null,
        submitted_at: now,
      });
    } catch (dbError) {
      // Log but don't fail - email notification is more important
      console.error('[LP Inquiry] Supabase insert failed:', dbError);
    }

    // 2. Send email notification via existing SMTP endpoint (internal call)
    const emailPayload = {
      name,
      email,
      company,
      phone,
      productInterest: productInterest || source,
      message: message || `Landing page inquiry from: ${source || pageUrl}`,
      pageUrl,
      ip,
      submittedAt: now,
    };

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const emailResponse = await fetch(`${origin}/api/send-rfq-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({}));
      console.error('[LP Inquiry] Email notification failed:', errorData);
      // Still return success since data is saved to Supabase
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LP Inquiry] Failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
