/**
 * GA4 event tracking via GTM dataLayer
 *
 * Standard events:
 *   generate_lead   — form submitted successfully (GA4 recommended event)
 *   quote_cta_click — click on "Get Wholesale Quote" CTA buttons
 *   whatsapp_click  — click on WhatsApp links/buttons
 *   begin_form      — first focus on any form field
 *   contact_click   — click on email/phone contact links
 */

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  }
}
