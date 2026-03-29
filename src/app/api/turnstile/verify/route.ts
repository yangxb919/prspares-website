import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side Turnstile token verification.
 *
 * POST /api/turnstile/verify
 * Body: { token: string }
 *
 * Returns: { success: boolean, error?: string }
 */

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing turnstile token' },
        { status: 400 }
      );
    }

    if (!TURNSTILE_SECRET) {
      console.error('[turnstile] TURNSTILE_SECRET_KEY not configured');
      // In development, skip verification
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '';

    const verifyResponse = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });

    const result = await verifyResponse.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    console.warn('[turnstile] Verification failed:', result['error-codes']);
    return NextResponse.json(
      { success: false, error: 'Turnstile verification failed' },
      { status: 403 }
    );
  } catch (error) {
    console.error('[turnstile] Verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
