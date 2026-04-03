import { CheckCircle, ArrowRight, Cpu, Zap, Wrench, Package, FlameKindling, Scissors, MonitorSmartphone, TestTube } from 'lucide-react';
import ToolCard from './ToolCard';
import ToolsQuoteButton from './ToolsQuoteButton';

/* ─── Tool Catalog Data ─── */

const PROGRAMMERS = [
  { name: 'JC V1SE True Tone Programmer', desc: 'True Tone, battery health & Face ID data transfer. Supports iPhone 7–16 series.', priceFrom: 45, badge: 'Best Seller', badgeColor: 'bg-orange-500' },
  { name: 'i2C i6S Programmer', desc: 'Multi-function programmer for True Tone, battery, vibrator & Face ID. iPhone 7–16 PM.', priceFrom: 55 },
  { name: 'JCID V1SE Programmer', desc: 'Original color, True Tone & battery calibration. Compact design with OTA updates.', priceFrom: 50 },
  { name: 'JC V1S Pro Full Set', desc: 'All-in-one kit: True Tone + Face ID + battery + LCD boards. Covers iPhone 7–16 PM.', priceFrom: 120, badge: 'Full Kit', badgeColor: 'bg-purple-600' },
  { name: 'i2C Face ID V8 Programmer', desc: 'Dedicated Face ID dot projector repair. Supports iPhone X–15 PM.', priceFrom: 65 },
  { name: 'JCID BGA110 Nand Programmer', desc: 'Hard disk read/write & purple screen repair for iPhone & iPad.', priceFrom: 85 },
];

const TESTERS = [
  { name: 'iPhone LCD Tester Board', desc: 'Basic screen test for iPhone 6–14. Tests touch, display & 3D Touch.', priceFrom: 35, badge: 'Budget Pick', badgeColor: 'bg-green-600' },
  { name: 'DL S300 Multi-Function Tester', desc: 'Tests LCD/OLED, True Tone, touch, 3D Touch for iPhone 6–16 series. Built-in battery.', priceFrom: 85, badge: 'Best Seller', badgeColor: 'bg-orange-500' },
  { name: 'Universal LCD/OLED Tester', desc: 'Supports iPhone + Samsung screens. Tests display, touch, backlight & digitizer.', priceFrom: 120 },
  { name: 'Samsung Screen Tester Board', desc: 'Dedicated Samsung Galaxy S/Note/A series screen testing. OLED & LCD support.', priceFrom: 75 },
  { name: 'Motherboard Diagnostic Tool', desc: 'PCB fault detection for iPhone logic boards. Tests power, charging & signal circuits.', priceFrom: 45 },
];

const SOLDERING = [
  { name: 'Quick 861DW Hot Air Station', desc: '1000W lead-free hot air rework station. Digital display, ESD-safe. For BGA/SMD work.', priceFrom: 95, badge: 'Popular', badgeColor: 'bg-blue-600' },
  { name: 'SUGON T26 Soldering Station', desc: 'Rapid-heat soldering station with C210 tips. 2-second heat-up, sleep mode.', priceFrom: 55 },
  { name: 'PPD 120L Preheater Platform', desc: 'PCB preheating station for chip removal. Adjustable 50–400°C, even heat distribution.', priceFrom: 85 },
  { name: 'Trinocular Stereo Microscope', desc: '7–45x zoom with LED ring light. Essential for motherboard-level repair & inspection.', priceFrom: 150 },
  { name: 'BGA Reballing Kit (Complete)', desc: 'Stencils, solder balls, flux & jig for BGA chip reballing. iPhone & Android sets.', priceFrom: 25 },
  { name: 'MHP30 Mini Hot Plate', desc: 'Portable PCB preheater, 350°C max. USB-C powered. Ideal for flex & chip work.', priceFrom: 35 },
];

const TOOL_KITS = [
  { name: '25-in-1 Precision Screwdriver Set', desc: 'Pentalobe, tri-point, Phillips, Torx bits. CRV steel with magnetic driver.', priceFrom: 5, badge: 'Budget Pick', badgeColor: 'bg-green-600' },
  { name: 'Professional 45-Piece Repair Kit', desc: 'Screwdrivers, spudgers, suction cups, pry tools, tweezers & anti-static mat.', priceFrom: 12, badge: 'Best Value', badgeColor: 'bg-orange-500' },
  { name: 'ESD Tweezers Set (6 pcs)', desc: 'Anti-static stainless steel tweezers. Pointed, curved, flat tip styles.', priceFrom: 8 },
  { name: 'Suction Cup & Opening Tools', desc: 'Heavy-duty suction cup, metal spudgers, plastic pry tools for screen removal.', priceFrom: 3 },
  { name: 'Anti-Static ESD Mat (Large)', desc: '600×400mm heat-resistant silicone mat. Magnetic screw pad & grounding wire.', priceFrom: 15 },
  { name: 'Screen Protector Alignment Jig', desc: 'Universal alignment tool for tempered glass installation. Fits iPhone 12–16 series.', priceFrom: 8 },
];

const SPOT_WELDERS = [
  { name: '737A Battery Spot Welder', desc: 'Pulse spot welding machine for 18650/battery tab connections. 1.5kW, LED display.', priceFrom: 65, badge: 'Entry Level', badgeColor: 'bg-blue-600' },
  { name: '788H LED Dual Pulse Welder', desc: 'Dual-pulse spot welder with soldering iron function. For battery pack assembly.', priceFrom: 95, badge: 'Popular', badgeColor: 'bg-orange-500' },
  { name: 'Nickel Strip Roll (100m)', desc: '0.15×8mm pure nickel strip for battery tab welding. 99.6% purity.', priceFrom: 8 },
  { name: 'Battery Holder & Fixtures', desc: 'Adjustable battery holding jigs for spot welding. Fits 18650/21700 cells.', priceFrom: 12 },
];

const SEPARATORS = [
  { name: 'TBK-568R LCD Separator Machine', desc: 'Built-in vacuum pump, 7-inch heating plate. Separates LCD from glass for refurbishment.', priceFrom: 120, badge: 'Popular', badgeColor: 'bg-blue-600' },
  { name: 'Laser Back Glass Remover', desc: 'Fiber laser machine for iPhone back glass removal. Safe, no heat damage to internals.', priceFrom: 350, badge: 'Pro Equipment', badgeColor: 'bg-purple-600' },
  { name: 'OCA Laminating Machine', desc: '5-in-1 OCA vacuum laminator with debubbler. For screen refurbishment & OCA repair.', priceFrom: 280 },
  { name: 'Autoclave Bubble Remover', desc: 'High-pressure bubble removal machine. Essential for OCA/LOCA lamination quality.', priceFrom: 150 },
  { name: 'Separator Wire & Consumables', desc: 'Molybdenum cutting wire, OCA glue sheets, UV LOCA glue & removal tools.', priceFrom: 5 },
];

/* ─── FAQ Data ─── */
const FAQ_ITEMS = [
  { q: 'What essential tools do I need to start a phone repair shop?', a: 'For a basic repair shop, you need: 1) Precision screwdriver set ($5-12), 2) ESD tweezers and spudgers ($8), 3) Suction cups and opening tools ($3), 4) Anti-static mat ($15), 5) True Tone programmer like the JC V1SE ($45) — essential for iPhone screen repairs, 6) Screen tester ($35-85) for quality control. Total starter investment: under $200. As volume grows, add a hot air station ($95), microscope ($150), and LCD separator ($120).' },
  { q: 'JC V1SE vs i2C i6S — which True Tone programmer is better?', a: 'Both support iPhone 7–16 series for True Tone, battery health, and Face ID data transfer. JC V1SE ($45) is more affordable, has a larger user community, and slightly faster firmware updates. i2C i6S ($55) has a more compact design and some users report slightly better stability with newer models. For most repair shops, the JC V1SE offers the best value. If you handle high volume (50+ repairs/day), consider the JC V1S Pro Full Set ($120) which includes all function boards.' },
  { q: 'Can an aftermarket iPhone screen have True Tone? How do I restore it?', a: 'Aftermarket screens do NOT come with True Tone data — it\'s stored on the original screen\'s IC chip. To restore True Tone after a screen replacement, you need a programmer (JC V1SE, i2C, or JCID) to read the data from the original screen and write it to the new one. The process takes about 30 seconds. Our Soft OLED, Hard OLED, and OEM screens all support True Tone transfer. Incell LCD screens have limited True Tone support.' },
  { q: 'Which iPhone screen tester should I buy for my repair shop?', a: 'Depends on your volume: For small shops (5-15 repairs/day), the iPhone LCD Tester Board ($35) handles basic testing. For medium shops (15-30/day), the DL S300 ($85) is the sweet spot — tests touch, display, 3D Touch, True Tone for iPhone 6–16. For high-volume or multi-brand shops, the Universal LCD/OLED Tester ($120) supports both iPhone and Samsung. A dedicated tester pays for itself by catching defective screens before installation — saving time and customer complaints.' },
  { q: 'What hot air station temperature should I use for iPhone chip removal?', a: 'General guidelines: Shield/connector removal: 280-300°C with medium airflow. Small IC chips: 340-360°C. CPU/NAND chips: 365-400°C with preheater at 150-180°C. Always use a preheater for BGA work to prevent board warping. Start with lower temperatures and increase gradually. The Quick 861DW ($95) is our recommended station — 1000W with precise digital temperature control. Pair it with the PPD 120L preheater ($85) for motherboard-level work.' },
  { q: 'What magnification microscope do I need for motherboard repair?', a: 'For phone motherboard-level repair, a 7x-45x trinocular stereo microscope is the standard. 7x is enough for connector work and visual inspection. 20-30x for IC pin inspection and microsoldering. 45x for detail work on tiny components. A built-in LED ring light is essential. We recommend a trinocular model ($150) — the third eyepiece connects to a camera/monitor for customer demonstrations and training.' },
  { q: 'Is a battery spot welder safe for phone repair?', a: 'Yes, when used properly. Battery spot welders for phone repair operate at low voltage (3-5V) and are specifically designed for welding nickel strips to battery tabs. Safety precautions: always wear safety glasses, work in a ventilated area, never weld near flammable materials, and use proper nickel strip (not copper wire). Our 737A ($65) and 788H ($95) welders include adjustable pulse control to prevent overheating. Start with low power settings and test on scrap material first.' },
  { q: 'LCD separator machine vs heat gun — which is better for screen refurbishment?', a: 'LCD separator machines (like the TBK-568R at $120) provide even, controlled heat across the entire screen surface with built-in vacuum — much safer and more consistent than a heat gun. Heat guns risk uneven heating which can damage the LCD or OLED panel. For shops doing 3+ screen refurbishments per day, a separator machine is a must. It pays for itself within a week of use. The separator also works for back glass removal on non-laser equipped shops.' },
];

/* ─── Price Range Overview ─── */
const PRICE_RANGES = [
  { category: 'Screen & Data Programmers', range: '$45 – $120', topItem: 'JC V1SE ($45)' },
  { category: 'LCD / OLED Testers', range: '$35 – $120', topItem: 'DL S300 ($85)' },
  { category: 'Soldering & Rework Stations', range: '$25 – $150', topItem: 'Quick 861DW ($95)' },
  { category: 'Basic Repair Tool Kits', range: '$3 – $15', topItem: '45-Piece Kit ($12)' },
  { category: 'Battery Spot Welders', range: '$8 – $95', topItem: '788H Welder ($95)' },
  { category: 'Separator & Laminating Machines', range: '$5 – $350', topItem: 'TBK-568R ($120)' },
];

export default function RepairToolsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Phone Repair Tools{' '}
              <span className="text-orange-400">Wholesale — From $3/Unit</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              iPhone screen testers, True Tone programmers, battery spot welders, soldering stations
              &amp; essential tool kits — factory-direct from Shenzhen with 12-month warranty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <ToolsQuoteButton label="Get Wholesale Quote" variant="primary" eventLabel="Hero CTA" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 200+ Tool SKUs</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> No Minimum Order</span>
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
              { value: '200+', label: 'Tool SKUs' },
              { value: '$3', label: 'Starting Price' },
              { value: '12 Mo', label: 'Warranty' },
              { value: '3–7 Days', label: 'Global Shipping' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#1e3a5f]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. PRODUCT CATALOG ═══ */}
      <section id="catalog" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Phone Repair Tools Catalog</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            45+ professional tools for mobile phone repair — from entry-level kits to production-grade equipment.
          </p>

          {/* ── 3a. Screen & Data Programmers ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">Screen &amp; Data Programmers</h3>
              <span className="text-xs text-gray-400 ml-auto">{PROGRAMMERS.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROGRAMMERS.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── 3b. LCD / OLED Testers ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <MonitorSmartphone className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone Screen Testers &amp; LCD Testers</h3>
              <span className="text-xs text-gray-400 ml-auto">{TESTERS.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TESTERS.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── 3c. Soldering & Rework ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">Soldering &amp; Rework Stations</h3>
              <span className="text-xs text-gray-400 ml-auto">{SOLDERING.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOLDERING.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── 3d. Basic Repair Tool Kits ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">Phone Repair Tool Kits</h3>
              <span className="text-xs text-gray-400 ml-auto">{TOOL_KITS.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOL_KITS.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── 3e. Battery Spot Welders ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <FlameKindling className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">Battery Spot Welders</h3>
              <span className="text-xs text-gray-400 ml-auto">{SPOT_WELDERS.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPOT_WELDERS.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── 3f. Separator & Laminating Machines ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Scissors className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">Separator &amp; Laminating Machines</h3>
              <span className="text-xs text-gray-400 ml-auto">{SEPARATORS.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEPARATORS.map((t) => (
                <ToolCard key={t.name} {...t} />
              ))}
            </div>
          </div>

          {/* ── Full Catalog CTA ── */}
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">Don&apos;t see what you need? We source 200+ tool SKUs.</p>
            <ToolsQuoteButton label="Request Custom Tool Quote" variant="secondary" eventLabel="Catalog Bottom CTA" />
          </div>
        </div>
      </section>

      {/* ═══ 4. PRICE RANGE OVERVIEW ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Price Range Overview</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Wholesale pricing on all phone repair tools — no minimum order, bulk discounts from 5+ units.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="text-left px-6 py-3 font-semibold">Category</th>
                    <th className="text-left px-6 py-3 font-semibold">Price Range</th>
                    <th className="text-left px-6 py-3 font-semibold">Top Seller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PRICE_RANGES.map((r) => (
                    <tr key={r.category} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{r.category}</td>
                      <td className="px-6 py-3 text-orange-500 font-bold">{r.range}</td>
                      <td className="px-6 py-3 text-gray-600">{r.topItem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. VOLUME DISCOUNTS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Bulk Discount Tiers</h2>
          <p className="text-gray-600 text-center mb-10">
            Volume discounts apply per tool model. Mix different tools in a single shipment.
          </p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { qty: '1–4 units', discount: 'Base Price', note: 'Sample orders welcome', highlight: false },
              { qty: '5–19 units', discount: '5% Off', note: 'Small shop tier', highlight: false },
              { qty: '20–49 units', discount: '10% Off', note: 'Multi-location shops', highlight: true },
              { qty: '50+ units', discount: 'Custom Quote', note: 'Training centers & factories', highlight: false },
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

      {/* ═══ 6. MOQ / SHIPPING / WARRANTY ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Ordering, Shipping &amp; Warranty</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'No Minimum Order', items: ['Single-unit samples at listed price', 'Bulk discounts from 5+ units', 'Mix tools with parts & screens', 'PayPal, T/T, Western Union accepted'] },
              { title: 'Global Express Shipping', items: ['Same-day dispatch before 3 PM CST', 'DHL / FedEx / UPS express', '3–7 business days worldwide', 'No dangerous goods restrictions'] },
              { title: '12-Month Warranty', items: ['All tools & equipment covered', 'Free firmware updates (programmers)', 'Replacement parts stocked', 'Remote technical support included'] },
            ].map((block) => (
              <div key={block.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{block.title}</h3>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
        <ToolsQuoteButton label="Get Quote" variant="float" eventLabel="Floating CTA" />
      </div>

      {/* ═══ 9. FOOTER CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Equip Your Workshop?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get wholesale pricing on professional phone repair tools. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ToolsQuoteButton label="Get Wholesale Quote" variant="footer" eventLabel="Footer CTA" />
            <ToolsQuoteButton
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
