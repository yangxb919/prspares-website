/**
 * GA4 event tracking via GTM dataLayer — with bot-proof engagement gates
 *
 * Standard events:
 *   generate_lead   — form submitted successfully (GA4 recommended event)
 *   quote_cta_click — click on "Get Wholesale Quote" CTA buttons
 *   whatsapp_click  — click on WhatsApp links/buttons
 *   begin_form      — first focus on any form field
 *   contact_click   — click on email/phone contact links
 *
 * Bot mitigation:
 *   Events only fire after the user demonstrates real engagement signals
 *   (mouse movement, scroll, keyboard input, or touch). Bots that script
 *   click/focus events without actual human interaction will not trigger
 *   GA4 events, keeping analytics data clean.
 */

// ─── Human engagement detection ──────────────────────────────────
let _humanVerified = false;
let _scrollDepth = 0;
let _timeOnPage = 0;
let _engagementListenersAttached = false;
let _pageLoadTime = 0;

/** Signals that count as "human-like" behaviour */
function markHuman() {
  _humanVerified = true;
}

function attachEngagementListeners() {
  if (_engagementListenersAttached || typeof window === 'undefined') return;
  _engagementListenersAttached = true;
  _pageLoadTime = Date.now();

  // Real mouse movement (not just a single programmatic moveTo)
  let mouseMoves = 0;
  window.addEventListener('mousemove', () => {
    mouseMoves++;
    if (mouseMoves >= 3) markHuman();
  }, { passive: true });

  // Keyboard input
  window.addEventListener('keydown', () => markHuman(), { passive: true, once: true });

  // Touch (mobile)
  window.addEventListener('touchstart', () => markHuman(), { passive: true, once: true });

  // Scroll tracking
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      _scrollDepth = Math.max(_scrollDepth, Math.round((window.scrollY / docHeight) * 100));
    }
    // Scrolling at all is a human signal
    if (_scrollDepth > 5) markHuman();
  }, { passive: true });

  // Time on page tracker (updates every 5s)
  setInterval(() => {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }, 5000);
}

// Auto-attach when module loads on client
if (typeof window !== 'undefined') {
  // Attach on first idle or immediately
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(attachEngagementListeners);
  } else {
    setTimeout(attachEngagementListeners, 100);
  }
}

// ─── Engagement requirements per event ───────────────────────────
interface EngagementGate {
  /** Must have detected human interaction signals */
  requireHuman?: boolean;
  /** Minimum seconds on page before event can fire */
  minTimeOnPage?: number;
  /** Minimum scroll depth (%) before event can fire */
  minScrollDepth?: number;
}

const EVENT_GATES: Record<string, EngagementGate> = {
  // High-value conversion events — require strong engagement proof
  generate_lead:   { requireHuman: true, minTimeOnPage: 5 },
  form_submit:     { requireHuman: true, minTimeOnPage: 5 },
  request_quote:   { requireHuman: true, minTimeOnPage: 5 },

  // Interaction events — require basic human proof
  quote_cta_click: { requireHuman: true, minTimeOnPage: 3 },
  contact_click:   { requireHuman: true, minTimeOnPage: 2 },
  whatsapp_click:  { requireHuman: true, minTimeOnPage: 2 },
  chat_start:      { requireHuman: true, minTimeOnPage: 3 },

  // Browsing events — require scroll engagement
  browse_products: { requireHuman: true, minScrollDepth: 15 },
  begin_form:      { requireHuman: true },

  // Page view — requires human proof to filter bot traffic
  page_view:       { requireHuman: true, minTimeOnPage: 3 },
};

function passesEngagementGate(eventName: string): boolean {
  const gate = EVENT_GATES[eventName];

  // No gate defined → allow (backward compatibility for custom events)
  if (!gate) return true;

  if (gate.requireHuman && !_humanVerified) return false;
  if (gate.minTimeOnPage && _timeOnPage < gate.minTimeOnPage) return false;
  if (gate.minScrollDepth && _scrollDepth < gate.minScrollDepth) return false;

  return true;
}

// ─── UTM parameter tracking ─────────────────────────────────────
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const UTM_STORAGE_KEY = 'prspares_utm';

type UtmParams = Partial<Record<typeof UTM_KEYS[number], string>>;

let _utmParams: UtmParams | null = null;

function captureUtmParams(): UtmParams {
  if (_utmParams) return _utmParams;
  if (typeof window === 'undefined') return {};

  const url = new URL(window.location.href);
  const fromUrl: UtmParams = {};
  let hasUrlUtm = false;

  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) { fromUrl[key] = val; hasUrlUtm = true; }
  }

  if (hasUrlUtm) {
    _utmParams = fromUrl;
    try { sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl)); } catch {}
    return _utmParams;
  }

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) { _utmParams = JSON.parse(stored); return _utmParams!; }
  } catch {}

  _utmParams = {};
  return _utmParams;
}

/** Get current UTM parameters (from URL or sessionStorage). */
export function getUtmParams(): UtmParams {
  return captureUtmParams();
}

if (typeof window !== 'undefined') captureUtmParams();

// ─── Public API ──────────────────────────────────────────────────

/**
 * Track a GA4 event via GTM dataLayer.
 * Events are gated by engagement requirements to filter bot traffic.
 * UTM parameters are automatically attached to all events.
 * Returns true if the event was fired, false if blocked.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): boolean {
  if (typeof window === 'undefined') return false;

  // Ensure listeners are running
  attachEngagementListeners();

  // Update time on page (in case interval hasn't fired yet)
  if (_pageLoadTime > 0) {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }

  // Check engagement gate
  if (!passesEngagementGate(eventName)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[analytics] Event "${eventName}" blocked — engagement gate not met`, {
        humanVerified: _humanVerified,
        timeOnPage: _timeOnPage,
        scrollDepth: _scrollDepth,
      });
    }
    return false;
  }

  // Collect UTM params (only non-empty values)
  const utm = captureUtmParams();
  const utmData: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    if (utm[key]) utmData[key] = utm[key]!;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    ...utmData,
    // Enrich with engagement metadata (useful for debugging in GA4)
    _engagement: {
      human: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] Event "${eventName}" fired`, params, utmData);
  }

  return true;
}

/**
 * Force-mark the current session as human-verified.
 * Call this after a Turnstile/CAPTCHA challenge passes.
 */
export function markAsHumanVerified() {
  _humanVerified = true;
}

/**
 * Get current engagement state (for debugging / conditional UI).
 */
export function getEngagementState() {
  return {
    humanVerified: _humanVerified,
    timeOnPage: _timeOnPage,
    scrollDepth: _scrollDepth,
  };
}

// ─── Delayed page_view (controlled send) ────────────────────────
// Fires page_view after 3s delay. Does NOT block — always sends,
// but attaches `engagement_signals` flag for GA4 analysis.
// This replaces the automatic gtag page_view (disabled via send_page_view:false).
let _delayedPageViewFired = false;

function fireDelayedPageView() {
  if (_delayedPageViewFired) return;
  if (typeof window === 'undefined') return;

  // Ensure listeners are running
  attachEngagementListeners();

  // Update time on page
  if (_pageLoadTime > 0) {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }

  // Must pass engagement gate — blocks bots without human signals
  if (!passesEngagementGate('page_view')) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[analytics] Delayed page_view blocked — engagement gate not met`, {
        humanVerified: _humanVerified,
        timeOnPage: _timeOnPage,
        scrollDepth: _scrollDepth,
      });
    }
    // Retry after 2 more seconds (total 5s) — gives real users more time
    setTimeout(fireDelayedPageView, 2000);
    return;
  }

  _delayedPageViewFired = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_location: window.location.href,
    page_title: document.title,
    engagement_signals: _humanVerified,
    _engagement: {
      human: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] Delayed page_view fired`, {
      engagement_signals: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    });
  }
}

if (typeof window !== 'undefined') {
  // First attempt at 3s, retries at 5s, 7s, 9s... until human verified or page unloads
  setTimeout(fireDelayedPageView, 3000);
}
