/**
 * Lightweight server-side anti-spam checks for public form endpoints.
 *
 * These are cheap heuristics that complement (not replace) Turnstile +
 * rate limiting. They mainly catch crude bots and copy-paste link spam
 * that real B2B buyers never produce.
 */

// Honeypot field name. Bots fill every input they see; legitimate users
// never see this field (rendered visually hidden / off-screen).
export const HONEYPOT_FIELD = 'website';

export interface SpamCheckInput {
  honeypot?: string | null;
  email?: string | null;
  message?: string | null;
}

export interface SpamCheckResult {
  ok: boolean;
  reason?: string;
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
  'discard.email',
  'fakeinbox.com',
]);

const URL_REGEX = /\bhttps?:\/\/|www\./gi;
const MAX_URLS_IN_MESSAGE = 4;

/**
 * Returns { ok:true } if the submission looks legit, otherwise the reason
 * the caller should reject it with (a generic 400 is fine — don't echo
 * the reason to the client to avoid teaching spammers our heuristics).
 */
export function checkSubmission(input: SpamCheckInput): SpamCheckResult {
  // 1. Honeypot — a real browser never fills this hidden field.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: false, reason: 'honeypot triggered' };
  }

  // 2. Disposable email domain
  const email = (input.email || '').trim().toLowerCase();
  const at = email.lastIndexOf('@');
  if (at > 0) {
    const domain = email.slice(at + 1);
    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return { ok: false, reason: 'disposable email domain' };
    }
  }

  // 3. Message link-spam heuristic
  const message = input.message || '';
  if (message) {
    const urls = message.match(URL_REGEX) || [];
    if (urls.length > MAX_URLS_IN_MESSAGE) {
      return { ok: false, reason: 'too many urls in message' };
    }
  }

  return { ok: true };
}
