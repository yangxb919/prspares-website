import { CheckCircle, ArrowRight, Shield, Zap, Package } from 'lucide-react';
import IPadBatteryQuoteButton from './iPadBatteryQuoteButton';
import WholesaleIpadBatteryTable from '@/components/products/WholesaleIpadBatteryTable';
import { IPAD_BATTERY_CATALOG } from '@/data/ipad-battery-catalog';

/* ─── Real price-index stats (auto-derived from src/data/ipad-battery-catalog.ts) ─── */

const SKU_COUNT = IPAD_BATTERY_CATALOG.length;
const PRICE_LOW = Math.min(...IPAD_BATTERY_CATALOG.map((r) => r.p10));

/** Per-series 10+ price ranges computed from the real catalog. */
function seriesRange(match: (model: string) => boolean) {
  const prices = IPAD_BATTERY_CATALOG.filter((r) => match(r.model.toLowerCase())).map((r) => r.p10);
  if (!prices.length) return null;
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return {
    range: lo === hi ? `$${lo.toFixed(2)}` : `$${lo.toFixed(2)} – $${hi.toFixed(2)}`,
    models: `${prices.length} SKU${prices.length > 1 ? 's' : ''}`,
  };
}

const PRICE_SUMMARY = [
  { series: 'iPad Pro 12.9"', ...seriesRange((m) => m.includes('pro 12.9')) },
  { series: 'iPad Pro 11" / 10.5"', ...seriesRange((m) => m.includes('pro 11') || m.includes('pro 10.5')) },
  { series: 'iPad Air', ...seriesRange((m) => m.includes('air')) },
  { series: 'iPad (Standard)', ...seriesRange((m) => !m.includes('pro') && !m.includes('air') && !m.includes('mini')) },
  { series: 'iPad mini', ...seriesRange((m) => m.includes('mini')) },
].filter((r): r is { series: string; range: string; models: string } => Boolean(r.range));

/* ─── FAQ ─── */
const FAQ_ITEMS = [
  { q: 'How much does iPad battery replacement cost?', a: 'Apple charges $99-$149 for iPad battery replacement depending on the model. Third-party repair shops typically charge $79-$119 including labor. Our wholesale battery cost for repair shops: $5.02-$19.84 per unit at the 10+ tier depending on model — giving shops a healthy margin. iPad Pro 12.9" batteries run $11.38-$19.84 wholesale, iPad 7/8/9 batteries cost $6.30, and iPad mini batteries start at $5.02.' },
  { q: 'Is it worth replacing an iPad battery, or should I buy a new iPad?', a: 'If your iPad is less than 4 years old and otherwise functional, battery replacement is absolutely worth it — it costs a fraction of a new iPad and restores full-day battery life. iPads older than 5 years may not receive the latest iPadOS updates, making replacement less cost-effective. For repair shops, iPad battery replacement is a high-margin service — customers pay $79-$119 for a battery that costs you $5-$20 wholesale.' },
  { q: 'How do I check iPad battery health?', a: 'iPadOS 16.5 and newer on supported models: go to Settings > Battery > Battery Health & Charging. For older models that don\'t show battery health, use third-party apps like coconutBattery (Mac) or iMazing (Windows/Mac) connected via USB. Key indicators: Maximum Capacity below 80% means replacement is recommended. Cycle count above 1,000 indicates end-of-life. If the iPad shuts down unexpectedly at 20-30%, the battery definitely needs replacement.' },
  { q: 'Which iPad models are hardest to replace the battery on?', a: 'Difficulty ranking (hardest to easiest): 1) iPad mini — very tight internal clearance, strong adhesive, high risk of display cable damage. 2) iPad Air — thin body requires careful prying. 3) iPad Pro 11" — moderate difficulty with pull-tab adhesive. 4) iPad Pro 12.9" — largest body gives more room to work. 5) Standard iPad (7th-10th gen) — most accessible design. All iPads use strong adhesive that requires heat (80-90°C) to soften. We recommend isopropyl alcohol or adhesive remover for easier removal.' },
  { q: 'How long does an iPad battery last after replacement?', a: 'A quality replacement battery restores the iPad to like-new battery life — typically 10 hours of screen-on time. The battery is designed to retain 80%+ capacity for 1,000 charge cycles, which translates to 3-5 years of normal use. To maximize lifespan, advise customers to: avoid extreme temperatures, keep charge between 20-80%, and use the original charger or a quality USB-C/Lightning charger.' },
  { q: 'What are the signs an iPad needs a battery replacement?', a: 'Common symptoms: 1) Battery drains much faster than when new (less than 6 hours screen time). 2) iPad shuts down unexpectedly at 15-30% charge. 3) Battery percentage jumps erratically (e.g., 40% to 15% suddenly). 4) iPad takes much longer to charge than usual. 5) Battery appears swollen — the screen lifts away from the body. 6) Settings shows Maximum Capacity below 80%. If the battery is swelling, stop using the device immediately — it\'s a safety risk.' },
  { q: 'What capacity (mAh) does each iPad battery have?', a: 'iPad Pro 12.9" (5th-6th gen): 10,758 mAh. iPad Pro 11" (1st-4th gen): 7,538-7,812 mAh. iPad Air (3rd-5th gen): 7,606-8,134 mAh. Standard iPad (7th-10th gen): 7,606-8,557 mAh. iPad mini (5th-6th gen): 5,124 mAh. Always match the exact capacity and model number when ordering replacement batteries — using the wrong capacity can cause charging issues or system warnings.' },
  { q: 'Do you handle shipping for lithium iPad batteries?', a: 'Yes. iPad batteries are larger capacity lithium-ion cells classified as Class 9 Dangerous Goods for air transport. We handle all DG documentation, UN38.3 compliant packaging, and proper labeling. Batteries ship via DHL/FedEx/UPS express (3-7 days worldwide) or sea freight for bulk orders over 100 units (15-25 days, more cost-effective). All packaging meets IATA Packing Instruction 965/966 requirements.' },
];

export default function iPadBatteryReplacementFactoryPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-blue-300 mb-6">
              <a href="/products" className="hover:text-white transition-colors">Products</a>
              <span>/</span>
              <a href="/products/batteries" className="hover:text-white transition-colors">Batteries</a>
              <span>/</span>
              <span className="text-white">iPad</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              iPad Battery Wholesale{' '}
              <span className="text-orange-400">— Tiered Pricing From ${PRICE_LOW.toFixed(2)}/Unit</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              OEM-grade replacement batteries for all iPad models — iPad Pro 12.9&quot;, iPad Pro 11&quot;,
              iPad Air, iPad mini &amp; standard iPad. Original capacity, CE/RoHS certified, factory-direct from Shenzhen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <IPadBatteryQuoteButton label="Get Wholesale Quote" variant="primary" eventLabel="Hero CTA" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> {SKU_COUNT} Battery SKUs In Stock</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 10+ / 50+ / 200+ Tier Pricing</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 12-Month Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. QUICK STATS ═══ */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: String(SKU_COUNT), label: 'Battery SKUs' },
              { value: `$${PRICE_LOW.toFixed(2)}`, label: 'Starting Price (10+)' },
              { value: 'MOQ 10', label: 'Per Model' },
              { value: '12 Mo', label: 'Warranty' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#1e3a5f]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. LIVE WHOLESALE PRICE TABLE (real price-index SKUs) ═══ */}
      <WholesaleIpadBatteryTable />
      <div className="text-center pb-16 -mt-4">
        <p className="text-gray-500 text-sm mb-4">Need older iPad models or a capacity not listed? We can source it.</p>
        <IPadBatteryQuoteButton label="Request Custom Quote" variant="secondary" eventLabel="Catalog Bottom CTA" />
      </div>

      {/* ═══ 4. PRICE OVERVIEW ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">iPad Battery Replacement Cost</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Wholesale iPad batteries cost ${PRICE_LOW.toFixed(2)}–$19.84 per unit at the 10+ tier (July 2026 price
            index), while Apple charges $99–$149 and repair shops bill $79–$119 for the same replacement. Ranges by
            series, from the live table above:
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-6 py-3 font-semibold">iPad Series</th>
                  <th className="text-left px-6 py-3 font-semibold">Price Range</th>
                  <th className="text-left px-6 py-3 font-semibold">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PRICE_SUMMARY.map((r) => (
                  <tr key={r.series} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{r.series}</td>
                    <td className="px-6 py-3 text-orange-500 font-bold">{r.range}</td>
                    <td className="px-6 py-3 text-gray-600">{r.models}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ 5. VOLUME DISCOUNTS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Volume Pricing Tiers</h2>
          <p className="text-gray-600 text-center mb-10">Standard 10+ / 50+ / 200+ tiers — exact per-tier prices are shown in the table above. Mix iPad models in one order.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { qty: '10+ pcs', discount: 'Base Wholesale', note: 'MOQ per model', highlight: false },
              { qty: '50+ pcs', discount: 'Lower Unit Price', note: 'Multi-location shops', highlight: true },
              { qty: '200+ pcs', discount: 'Best Rate', note: 'Distributor tier', highlight: false },
              { qty: 'Mixed order', discount: 'Custom Quote', note: 'Combine models & series', highlight: false },
            ].map((tier) => (
              <div key={tier.qty} className={`rounded-xl p-5 text-center border ${tier.highlight ? 'border-orange-300 bg-orange-50 shadow-md' : 'border-gray-200 bg-white'}`}>
                <div className="text-xs text-gray-500 mb-1">{tier.qty}</div>
                <div className={`text-xl font-bold mb-2 ${tier.highlight ? 'text-orange-500' : 'text-gray-900'}`}>{tier.discount}</div>
                <div className="text-xs text-gray-400">{tier.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. CERTIFICATIONS & QUALITY ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Quality &amp; Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <Shield className="w-8 h-8 text-[#1e3a5f] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Safety Certified</h3>
              <ul className="space-y-2">
                {['CE Certified', 'RoHS Compliant', 'FCC Approved', 'UN38.3 Tested'].map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <Zap className="w-8 h-8 text-[#1e3a5f] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">100% Tested</h3>
              <ul className="space-y-2">
                {['Capacity verification', 'Voltage & impedance test', 'Charge/discharge cycles', '95%+ capacity guaranteed'].map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <Package className="w-8 h-8 text-[#1e3a5f] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Shipping &amp; Warranty</h3>
              <ul className="space-y-2">
                {['DG-compliant battery shipping', 'DHL / FedEx / UPS express', '3–7 days worldwide', '12-month warranty'].map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. FAQ ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-white rounded-lg border border-gray-200 group" open={i < 2}>
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. FLOATING CTA ═══ */}
      <div className="fixed bottom-6 right-6 z-40">
        <IPadBatteryQuoteButton label="Get Quote" variant="float" eventLabel="Floating CTA" />
      </div>

      {/* ═══ 9. FOOTER CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need iPad Batteries in Bulk?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get wholesale pricing on OEM iPad replacement batteries. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <IPadBatteryQuoteButton label="Get Wholesale Quote" variant="footer" eventLabel="Footer CTA" />
            <IPadBatteryQuoteButton
              label="WhatsApp Us"
              variant="footer-wa"
              eventLabel="Footer WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
