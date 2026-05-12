'use client';

export interface RfqInput {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  productInterest?: string;
  pageUrl?: string;
  ip?: string;
  submittedAt?: string;
  /** Cloudflare Turnstile token from the widget. Required in production. */
  turnstileToken?: string;
  /** Honeypot field — must be empty. Bots tend to fill every input. */
  honeypot?: string;
}

export interface RfqPayload {
  name: string;
  email: string;
  company: string;
  phone: string;
  productInterest: string;
  message: string;
  pageUrl: string;
  ip: string;
  submittedAt: string;
  turnstileToken?: string;
  honeypot?: string;
}

function normalizeIp(ip?: string): string {
  if (!ip) return '';
  const normalized = ip.trim();
  if (!normalized) return '';
  if (normalized.toLowerCase() === 'unknown' || normalized.toLowerCase() === 'unable to get') {
    return '';
  }
  return normalized;
}

function validate(payload: RfqPayload) {
  if (!payload.name) {
    throw new Error('Name is required');
  }
  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    throw new Error('A valid email is required');
  }
  if (!payload.message) {
    throw new Error('Message is required');
  }
}

export async function notifyRfqByEmail(payload: RfqPayload): Promise<void> {
  const response = await fetch('/api/send-rfq-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    let errorText = `HTTP ${response.status}`;
    try {
      const result = await response.json();
      if (result?.error) {
        errorText = result.error;
      }
    } catch {
      // Keep fallback error text.
    }
    throw new Error(`Email notification failed: ${errorText}`);
  }
}

export async function submitRfqAndNotify(input: RfqInput): Promise<RfqPayload> {
  const payload: RfqPayload = {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company?.trim() || '',
    phone: input.phone?.trim() || '',
    productInterest: input.productInterest?.trim() || '',
    message: input.message.trim(),
    pageUrl: input.pageUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    ip: normalizeIp(input.ip),
    submittedAt: input.submittedAt || new Date().toISOString(),
    turnstileToken: input.turnstileToken,
    honeypot: input.honeypot,
  };

  validate(payload);

  // Persistence + email both happen server-side in /api/send-rfq-email
  // (writes contact_submissions via service-role, then sends SMTP). Earlier
  // client-side .from('rfqs') insert pointed at a non-existent table and
  // silently swallowed errors — removed.
  await notifyRfqByEmail(payload);
  return payload;
}
