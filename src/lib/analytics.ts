/**
 * GA4 event tracking via GTM dataLayer — with bot-proof engagement gates
 * and traffic quality scoring for data separation.
 *
 * Standard events:
 *   generate_lead   — form submitted successfully (GA4 recommended event)
 *   quote_cta_click — click on "Get Wholesale Quote" CTA buttons
 *   whatsapp_click  — click on WhatsApp links/buttons
 *   begin_form      — first focus on any form field
 *   contact_click   — click on email/phone contact links
 *
 * Traffic quality scoring:
 *   Every event carries traffic_quality (0-100) and traffic_quality_label
 *   (clean/uncertain/suspect) as GA4 custom dimensions. This allows
 *   filtering suspect bot traffic in reports without losing data.
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

// ─── Traffic quality signal collectors ───────────────────────────
const MOUSE_BUFFER_SIZE = 20;
const INTERACTION_BUFFER_SIZE = 10;

/** Mouse position buffer for entropy calculation */
const _mousePositions: Array<{ x: number; y: number; t: number }> = [];

/** Timestamps of interaction events for timing jitter analysis */
const _interactionTimestamps: number[] = [];

/** Scroll velocity samples for naturalness scoring */
let _scrollReversals = 0;
let _lastScrollY = 0;
let _lastScrollDir = 0; // 1=down, -1=up, 0=none
let _scrollVelocityChanges = 0;
let _lastScrollSpeed = 0;
let _scrollSamples = 0;

function attachEngagementListeners() {
  if (_engagementListenersAttached || typeof window === 'undefined') return;
  _engagementListenersAttached = true;
  _pageLoadTime = Date.now();

  // ── Mouse movement: human detection + trajectory collection ──
  let mouseMoves = 0;
  window.addEventListener('mousemove', (e: MouseEvent) => {
    mouseMoves++;
    if (mouseMoves >= 3) markHuman();

    // Collect for entropy analysis (ring buffer)
    if (_mousePositions.length >= MOUSE_BUFFER_SIZE) _mousePositions.shift();
    _mousePositions.push({ x: e.clientX, y: e.clientY, t: Date.now() });

    // Record as interaction event
    recordInteraction();
  }, { passive: true });

  // ── Keyboard input ──
  window.addEventListener('keydown', () => {
    markHuman();
    recordInteraction();
  }, { passive: true });

  // ── Touch (mobile) ──
  window.addEventListener('touchstart', () => {
    markHuman();
    recordInteraction();
  }, { passive: true });

  // ── Click ──
  window.addEventListener('click', () => {
    recordInteraction();
  }, { passive: true });

  // ── Scroll tracking: depth + naturalness signals ──
  _lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      _scrollDepth = Math.max(_scrollDepth, Math.round((window.scrollY / docHeight) * 100));
    }
    if (_scrollDepth > 5) markHuman();

    // Scroll naturalness: direction reversals + speed changes
    const currentY = window.scrollY;
    const delta = currentY - _lastScrollY;
    const currentDir = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    const currentSpeed = Math.abs(delta);

    if (currentDir !== 0 && _lastScrollDir !== 0 && currentDir !== _lastScrollDir) {
      _scrollReversals++;
    }
    if (_lastScrollSpeed > 0 && currentSpeed > 0) {
      const ratio = currentSpeed / _lastScrollSpeed;
      if (ratio > 2 || ratio < 0.5) _scrollVelocityChanges++;
    }
    _scrollSamples++;

    if (currentDir !== 0) _lastScrollDir = currentDir;
    _lastScrollSpeed = currentSpeed;
    _lastScrollY = currentY;

    recordInteraction();
  }, { passive: true });

  // ── Time on page tracker (updates every 5s) ──
  setInterval(() => {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }, 5000);
}

function recordInteraction() {
  if (_interactionTimestamps.length < INTERACTION_BUFFER_SIZE) {
    _interactionTimestamps.push(Date.now());
  }
}

// Auto-attach when module loads on client
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(attachEngagementListeners);
  } else {
    setTimeout(attachEngagementListeners, 100);
  }
}

// ─── Traffic quality scoring ────────────────────────────────────

/**
 * Compute mouse trajectory entropy (0-20).
 * Low variance in distances/angles = scripted replay. High = human.
 */
function scoreMouseEntropy(): number {
  if (_mousePositions.length < 5) return 0;

  const distances: number[] = [];
  const angles: number[] = [];
  for (let i = 1; i < _mousePositions.length; i++) {
    const dx = _mousePositions[i].x - _mousePositions[i - 1].x;
    const dy = _mousePositions[i].y - _mousePositions[i - 1].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
    angles.push(Math.atan2(dy, dx));
  }

  const distVariance = variance(distances);
  const angleVariance = variance(angles);

  // Normalize: high variance = more human-like
  // Typical human distance variance: 500-5000+; bot: 0-100
  const distScore = Math.min(10, (distVariance / 500) * 10);
  // Typical human angle variance: 0.5-3.0; bot: 0-0.1
  const angleScore = Math.min(10, (angleVariance / 0.5) * 10);

  return Math.round(distScore + angleScore);
}

/**
 * Compute interaction timing jitter (0-20).
 * Coefficient of variation of inter-event intervals.
 * Bots have low CV (regular timing); humans have high CV.
 */
function scoreTimingJitter(): number {
  if (_interactionTimestamps.length < 4) return 0;

  const intervals: number[] = [];
  for (let i = 1; i < _interactionTimestamps.length; i++) {
    intervals.push(_interactionTimestamps[i] - _interactionTimestamps[i - 1]);
  }

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (mean === 0) return 0;

  const std = Math.sqrt(variance(intervals));
  const cv = std / mean; // Coefficient of variation

  // Human CV typically 0.5-2.0+; bot CV typically 0.01-0.2
  return Math.round(Math.min(20, (cv / 0.5) * 20));
}

/**
 * Scroll pattern naturalness (0-15).
 * Direction reversals + velocity changes indicate human browsing.
 */
function scoreScrollNaturalness(): number {
  if (_scrollSamples < 5) return 0;

  // Reversals: humans reverse 2-10+ times; bots rarely reverse
  const reversalScore = Math.min(8, _scrollReversals * 2);
  // Velocity changes: humans have jerky scrolling
  const velocityScore = Math.min(7, _scrollVelocityChanges);

  return reversalScore + velocityScore;
}

/**
 * Timezone-geo consistency (0-15).
 * If JS timezone is NOT Asia/Singapore but traffic comes from SG → suspect proxy.
 * If timezone IS Asia/Singapore → neutral (could be real or bot with correct TZ).
 */
function scoreTimezoneGeo(): number {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Singapore timezone: Asia/Singapore (UTC+8)
    // Also accept nearby timezones that share UTC+8
    const sgTimezones = ['Asia/Singapore', 'Asia/Kuala_Lumpur', 'Asia/Makassar',
      'Asia/Hong_Kong', 'Asia/Taipei', 'Asia/Shanghai', 'Asia/Manila'];
    if (sgTimezones.includes(tz)) {
      return 10; // Consistent — mild positive signal
    }
    // Non-SG timezone: suspicious if traffic source is SG
    // We can't check geo here (that's server-side), so we give partial credit
    // for having ANY valid timezone (vs undefined/spoofed)
    return tz ? 5 : 0;
  } catch {
    return 0;
  }
}

/**
 * Viewport/screen anomaly check (0-10).
 * Bot farms often use identical VM configs with unusual ratios.
 */
function scoreViewportAnomaly(): number {
  if (typeof window === 'undefined') return 0;

  let score = 0;
  const dpr = window.devicePixelRatio || 1;
  const sw = window.screen?.width || 0;
  const sh = window.screen?.height || 0;
  const iw = window.innerWidth;
  const ih = window.innerHeight;

  // Real devices have DPR > 1 on mobile, or exactly 1/1.25/1.5/2 on desktop
  if (dpr >= 1 && dpr <= 3) score += 2;

  // Screen dimensions should be reasonable
  if (sw >= 320 && sh >= 480) score += 2;

  // Inner viewport should be smaller than screen
  if (iw <= sw && ih <= sh) score += 2;

  // Touch capability should match mobile screen sizes
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileSize = sw <= 768;
  if ((hasTouch && isMobileSize) || (!hasTouch && !isMobileSize)) {
    score += 2; // Consistent
  }

  // Color depth should be 24 or 32 (normal); 1 or 8 = headless
  const cd = window.screen?.colorDepth || 0;
  if (cd >= 24) score += 2;

  return score;
}

/**
 * Existing engagement signals re-weighted (0-20).
 */
function scoreExistingSignals(): number {
  let score = 0;
  if (_humanVerified) score += 10;
  if (_timeOnPage > 10) score += 5;
  else if (_timeOnPage > 5) score += 3;
  if (_scrollDepth > 25) score += 5;
  else if (_scrollDepth > 10) score += 3;
  return score;
}

/** Compute variance of a number array */
function variance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
}

type TrafficQualityLabel = 'clean' | 'uncertain' | 'suspect';

/**
 * Compute overall traffic quality score (0-100).
 * Higher = more likely a real human.
 */
function computeTrafficQuality(): { score: number; label: TrafficQualityLabel } {
  const score = Math.min(100,
    scoreMouseEntropy() +
    scoreTimingJitter() +
    scoreScrollNaturalness() +
    scoreTimezoneGeo() +
    scoreViewportAnomaly() +
    scoreExistingSignals()
  );

  const label: TrafficQualityLabel =
    score >= 70 ? 'clean' :
    score >= 30 ? 'uncertain' :
    'suspect';

  return { score, label };
}

// ─── Engagement requirements per event ───────────────────────────
interface EngagementGate {
  requireHuman?: boolean;
  minTimeOnPage?: number;
  minScrollDepth?: number;
}

const EVENT_GATES: Record<string, EngagementGate> = {
  generate_lead:   { requireHuman: true, minTimeOnPage: 5 },
  form_submit:     { requireHuman: true, minTimeOnPage: 5 },
  request_quote:   { requireHuman: true, minTimeOnPage: 5 },
  quote_cta_click: { requireHuman: true, minTimeOnPage: 3 },
  contact_click:   { requireHuman: true, minTimeOnPage: 2 },
  whatsapp_click:  { requireHuman: true, minTimeOnPage: 2 },
  chat_start:      { requireHuman: true, minTimeOnPage: 3 },
  browse_products: { requireHuman: true, minScrollDepth: 15 },
  begin_form:      { requireHuman: true },
  page_view:       { requireHuman: true, minTimeOnPage: 3 },
};

function passesEngagementGate(eventName: string): boolean {
  const gate = EVENT_GATES[eventName];
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
 * UTM parameters and traffic quality score are automatically attached.
 * Returns true if the event was fired, false if blocked.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): boolean {
  if (typeof window === 'undefined') return false;

  attachEngagementListeners();

  if (_pageLoadTime > 0) {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }

  if (!passesEngagementGate(eventName)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[analytics] Event "${eventName}" blocked — engagement gate not met`, {
        humanVerified: _humanVerified, timeOnPage: _timeOnPage, scrollDepth: _scrollDepth,
      });
    }
    return false;
  }

  const utm = captureUtmParams();
  const utmData: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    if (utm[key]) utmData[key] = utm[key]!;
  }

  const tq = computeTrafficQuality();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    ...utmData,
    traffic_quality: tq.score,
    traffic_quality_label: tq.label,
    _engagement: {
      human: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] Event "${eventName}" fired`, { ...params, tq }, utmData);
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

/**
 * Get current traffic quality score (for debugging).
 */
export function getTrafficQuality() {
  return computeTrafficQuality();
}

// ─── Delayed page_view (controlled send) ────────────────────────
let _delayedPageViewFired = false;

function fireDelayedPageView() {
  if (_delayedPageViewFired) return;
  if (typeof window === 'undefined') return;

  attachEngagementListeners();

  if (_pageLoadTime > 0) {
    _timeOnPage = Math.round((Date.now() - _pageLoadTime) / 1000);
  }

  if (!passesEngagementGate('page_view')) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[analytics] Delayed page_view blocked — engagement gate not met`, {
        humanVerified: _humanVerified, timeOnPage: _timeOnPage, scrollDepth: _scrollDepth,
      });
    }
    setTimeout(fireDelayedPageView, 2000);
    return;
  }

  _delayedPageViewFired = true;

  const tq = computeTrafficQuality();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_location: window.location.href,
    page_title: document.title,
    engagement_signals: _humanVerified,
    traffic_quality: tq.score,
    traffic_quality_label: tq.label,
    _engagement: {
      human: _humanVerified,
      timeOnPage: _timeOnPage,
      scrollDepth: _scrollDepth,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] Delayed page_view fired`, {
      engagement_signals: _humanVerified, tq,
      timeOnPage: _timeOnPage, scrollDepth: _scrollDepth,
    });
  }
}

if (typeof window !== 'undefined') {
  setTimeout(fireDelayedPageView, 3000);
}
