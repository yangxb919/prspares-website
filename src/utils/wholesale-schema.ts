/**
 * Shared schema.org fragments for PRSPARES wholesale product pages.
 *
 * P1 (GEO/SEO): mark every product category as factory-direct B2B wholesale with
 * a minimum order quantity and 10+/50+/200+ volume pricing tiers, so Google
 * Shopping/rich-results and AI engines can extract these B2B facts directly.
 *
 * Grounded in .agents/product-marketing.md: tiers 10+/50+/200+, 12-month
 * warranty, factory-direct from Shenzhen. MOQ is per-category when ordered alone
 * (screens 10, batteries 20, small parts 20, repair tools 5; a mixed order with
 * screens qualifies at 10 total — user decision 2026-09-10). Do not add fabricated
 * per-tier absolute prices — the AggregateOffer price range stays per-page.
 */

/** Minimum order quantity for a wholesale offer (schema.org QuantitativeValue). */
export function wholesaleMoq(minValue = 10) {
  return {
    '@type': 'QuantitativeValue',
    minValue,
    unitText: 'units',
  } as const;
}

/** B2B wholesale facts surfaced as Product.additionalProperty (PropertyValue list). */
export function wholesaleProductProperties(moq = 10) {
  return [
    { '@type': 'PropertyValue', name: 'Business Model', value: 'Factory-direct wholesale (B2B)' },
    { '@type': 'PropertyValue', name: 'Minimum Order Quantity', value: `${moq} units` },
    { '@type': 'PropertyValue', name: 'Volume Pricing Tiers', value: '10+, 50+, 200+ units' },
    { '@type': 'PropertyValue', name: 'Warranty', value: '12-month warranty' },
    { '@type': 'PropertyValue', name: 'Origin', value: 'Shenzhen / Huaqiangbei, China' },
  ] as const;
}
