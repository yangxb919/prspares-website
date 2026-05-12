/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * Behavior:
 *  - If a token IS provided, it must verify successfully against Cloudflare.
 *  - If no token is provided (widget failed to load — common in CN/SEA networks
 *    that can't reach challenges.cloudflare.com, or in browsers blocking the
 *    script), soft-pass: rely on upstream honeypot + IP rate-limit + content
 *    checks. Hard-blocking on missing token caused 7 days of silent inquiry
 *    loss (2026-05-05 → 2026-05-12); the front-end already skips Turnstile
 *    when window.turnstile is absent, so backend must match to keep the
 *    pipeline open.
 *  - In development, missing token / missing secret returns ok so local dev
 *    doesn't require the widget to load.
 *
 * Returns { ok: true } on success, otherwise { ok: false, reason }.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface VerifyTurnstileResult {
  ok: boolean;
  reason?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  ip: string | undefined | null
): Promise<VerifyTurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY || '';
  const isDev = process.env.NODE_ENV === 'development';

  if (!secret) {
    if (isDev) return { ok: true };
    console.error('[turnstile] TURNSTILE_SECRET_KEY not configured');
    return { ok: false, reason: 'Server misconfigured: captcha secret missing' };
  }

  if (!token) {
    if (isDev) return { ok: true };
    console.warn('[turnstile] no token from client (widget failed to load); trusting honeypot + rate-limit, ip:', ip);
    return { ok: true };
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ip || undefined,
      }),
    });
    const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (result.success) return { ok: true };

    const codes = result['error-codes']?.join(',') || 'unknown';
    console.warn('[turnstile] verification failed:', codes);
    return { ok: false, reason: `Captcha verification failed (${codes})` };
  } catch (error) {
    console.error('[turnstile] verification error:', error);
    return { ok: false, reason: 'Captcha verification error' };
  }
}
