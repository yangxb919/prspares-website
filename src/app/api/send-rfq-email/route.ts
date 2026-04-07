import { NextRequest, NextResponse } from 'next/server';
import { sendRfqEmail, type RfqEmailInput } from '@/lib/email/sendRfqEmail';

export const runtime = 'nodejs';

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
    const body = (await request.json()) as Partial<RfqEmailInput>;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    await sendRfqEmail({
      name,
      email,
      company: body.company?.trim() || '',
      phone: body.phone?.trim() || '',
      productInterest: body.productInterest?.trim() || '',
      message,
      pageUrl: body.pageUrl?.trim() || '',
      ip: body.ip?.trim() || getClientIP(request),
      submittedAt: body.submittedAt?.trim() || new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RFQ email] Failed to send notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send RFQ email' },
      { status: 500 }
    );
  }
}
