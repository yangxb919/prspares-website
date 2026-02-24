'use client';

import { getBrowserClient } from '@/lib/supabase/client';

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

export function notifyRfqByEmail(payload: RfqPayload): void {
  void fetch('/api/send-rfq-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then(async (response) => {
      if (response.ok) return;

      let errorText = `HTTP ${response.status}`;
      try {
        const result = await response.json();
        if (result?.error) {
          errorText = result.error;
        }
      } catch {
        // Keep fallback error text.
      }

      console.error('[RFQ] Email notification failed:', errorText);
    })
    .catch((error) => {
      console.error('[RFQ] Email notification request failed:', error);
    });
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
  };

  validate(payload);

  const supabase = getBrowserClient();
  const { error } = await supabase
    .from('rfqs')
    .insert({
      name: payload.name,
      email: payload.email,
      company: payload.company || null,
      phone: payload.phone || null,
      product_interest: payload.productInterest || null,
      message: payload.message,
      page_url: payload.pageUrl || null,
      ip: payload.ip || null,
      submitted_at: payload.submittedAt,
    });

  if (error) {
    throw new Error(error.message || 'Failed to save inquiry');
  }

  notifyRfqByEmail(payload);
  return payload;
}
