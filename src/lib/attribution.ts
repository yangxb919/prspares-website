'use client';

/**
 * First-party RFQ attribution.
 *
 * Problem this solves: contact_submissions only stored `page_url` (the form
 * page, almost always /wholesale-inquiry or an LP), so an RFQ could never be
 * traced back to the content that brought the buyer in. That made it impossible
 * to judge which blog post / landing page actually drives inquiries — the core
 * "are we doing useful work?" question.
 *
 * Approach: on the FIRST page of a visit we record where the visitor landed and
 * who referred them, into a first-party cookie. The cookie survives the
 * blog → /wholesale-inquiry navigation, so when the form submits we can attach
 * `{ first_landing, first_referrer, utm_*, gclid }` plus the submit page.
 *
 * First-touch (not last-touch) is intentional: it credits the content that
 * actually pulled the buyer to the site. `submit_page` is added at submit time
 * as a cheap last-touch signal.
 */

const COOKIE = 'prspares_attr';
const MAX_AGE_DAYS = 90;

export interface Attribution {
  /** Path + query of the first page of the visit (the entry content). */
  first_landing?: string;
  /** document.referrer at first touch (external source, e.g. google / chatgpt). */
  first_referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Google Ads click id, if present. */
  gclid?: string;
  /** ISO timestamp of first touch. */
  first_ts?: string;
  /** Path + query of the page the form was submitted from (last-touch). */
  submit_page?: string;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Record first-touch attribution if not already captured this visit.
 * Safe to call on every page load; only the FIRST call (no existing cookie)
 * actually writes. Mount it site-wide so the entry page is captured even when
 * the visitor never reaches a form.
 */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return;
  if (readCookie(COOKIE)) return; // already captured — keep the real first touch

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    first_landing: window.location.pathname + window.location.search,
    first_referrer: document.referrer || '',
    first_ts: new Date().toISOString(),
  };
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
  for (const key of utm) {
    const v = params.get(key);
    if (v) (attr as Record<string, string>)[key] = v;
  }
  const gclid = params.get('gclid');
  if (gclid) attr.gclid = gclid;

  try {
    writeCookie(COOKIE, JSON.stringify(attr));
  } catch {
    // Cookie write can fail (private mode, blocked) — attribution is best-effort.
  }
}

/**
 * Read the captured first-touch attribution and stamp the current page as the
 * submit (last-touch) page. Returns undefined if nothing was captured.
 */
export function getAttribution(): Attribution | undefined {
  if (typeof window === 'undefined') return undefined;
  let attr: Attribution = {};
  const raw = readCookie(COOKIE);
  if (raw) {
    try {
      attr = JSON.parse(raw) as Attribution;
    } catch {
      attr = {};
    }
  }
  attr.submit_page = window.location.pathname + window.location.search;
  return attr;
}
