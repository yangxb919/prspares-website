import { NextRequest, NextResponse } from 'next/server';
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
    await sendRfqEmail({
      name,
      email,
      company: body.company?.trim() || '',
      phone: body.phone?.trim() || '',
      productInterest: body.productInterest?.trim() || '',
      message,
      pageUrl: body.pageUrl?.trim() || '',
      ip,
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
