/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * Behavior:
 *  - In production, a token is REQUIRED whenever TURNSTILE_SECRET_KEY is configured.
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
    return { ok: false, reason: 'Missing captcha token' };
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
