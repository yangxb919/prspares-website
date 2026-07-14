// WhatsApp deep-link helper — one place for the number + prefilled openers.
// Prefill texts carry page/product context so inquiries arrive qualified
// (source + intent), instead of a blank chat the buyer has to compose.
export const WHATSAPP_NUMBER = '85363902425';

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Section-specific openers for the 5 pilot pages (W29 batch 1). */
export const WA_PREFILL = {
  screens:
    "Hi, I'm looking at your wholesale iPhone screen catalog (Original / Soft OLED / Hard OLED / Incell). Please send your current 10/50/200+ tier price list.",
  batteries:
    "Hi, I'm interested in wholesale phone batteries. Please send your current tier price list and MOQ details.",
  wholesaleInquiry:
    "Hi, I'd like a wholesale quote. I'll send my model list and quantities here.",
  contact:
    "Hi, I have a wholesale question about phone repair parts. Could you connect me with sales?",
} as const;

/** Per-product opener used on catalog cards / product pages. */
export function waProductPrefill(productName: string, priceFrom?: number): string {
  const price = priceFrom ? ` (from $${priceFrom}/unit)` : '';
  return `Hi, I'm interested in wholesale ${productName}${price}. Please send your current tier pricing.`;
}
