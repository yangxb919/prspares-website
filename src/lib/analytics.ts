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
  generate_lead:   { requireHuman: true, minTimeOnPage: 10 },
  form_submit:     { requireHuman: true, minTimeOnPage: 10 },
  request_quote:   { requireHuman: true, minTimeOnPage: 5 },

  // Interaction events — require basic human proof
  quote_cta_click: { requireHuman: true, minTimeOnPage: 3 },
  contact_click:   { requireHuman: true, minTimeOnPage: 2 },
  whatsapp_click:  { requireHuman: true, minTimeOnPage: 2 },
  chat_start:      { requireHuman: true, minTimeOnPage: 3 },

  // Browsing events — require scroll engagement
  browse_products: { requireHuman: true, minScrollDepth: 15 },
  begin_form:      { requireHuman: true },

  // Page view — lightweight gate (just time)
  page_view:       { minTimeOnPage: 2 },
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

// ─── Public API ──────────────────────────────────────────────────

/**
 * Track a GA4 event via GTM dataLayer.
 * Events are gated by engagement requirements to filter bot traffic.
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

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    // Enrich with engagement metadata (useful for debugging in GA4)
    _engagement: {
      human: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] Event "${eventName}" fired`, params);
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
