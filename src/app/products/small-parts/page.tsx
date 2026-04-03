import { CheckCircle, ArrowRight, Camera, Plug, Volume2, Smartphone, SquareStack, Cpu } from 'lucide-react';
import SmallPartsQuoteButton from './SmallPartsQuoteButton';
import PartCategoryCard from './PartCategoryCard';

/* ─── Part catalog data by category ─── */

const REAR_CAMERAS = [
  // Sunsky: iPhone 16 Pro $46.43, iPhone 15 Pro Max $40.69, iPhone 14 Pro $47.15
  { name: 'Rear Camera Module', model: 'iPhone 16 Pro Max', priceFrom: 65 },
  { name: 'Rear Camera Module', model: 'iPhone 16 Pro', priceFrom: 60 },
  { name: 'Rear Camera Module', model: 'iPhone 15 Pro Max', priceFrom: 53 },
  { name: 'Rear Camera Module', model: 'iPhone 15 Pro', priceFrom: 45 },
  { name: 'Rear Camera Module', model: 'iPhone 14 Pro Max', priceFrom: 55 },
  { name: 'Rear Camera Module', model: 'iPhone 14 Pro', priceFrom: 49 },
  { name: 'Rear Camera Module', model: 'iPhone 14', priceFrom: 33 },
  { name: 'Rear Camera Module', model: 'iPhone 13 Pro Max', priceFrom: 29 },
  { name: 'Rear Camera Module', model: 'Galaxy S24 Ultra', priceFrom: 59 },
  { name: 'Rear Camera Module', model: 'Galaxy S23 Ultra', priceFrom: 41 },
];

const FRONT_CAMERAS = [
  // Sunsky: iPhone 16 Pro $24.69, iPhone 15 $9.25, iPhone 14 Pro $18.68, Samsung S24 $7.49
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 16 Pro Max', priceFrom: 35 },
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 16 Pro', priceFrom: 32 },
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 15 Pro Max', priceFrom: 15 },
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 15', priceFrom: 12 },
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 14 Pro', priceFrom: 24 },
  { name: 'Front Camera + Sensor Flex', model: 'iPhone 14', priceFrom: 16 },
  { name: 'Front Camera Module', model: 'Galaxy S24 / S24+ / S24 Ultra', priceFrom: 10 },
  { name: 'Front Camera Module', model: 'Galaxy S23 Ultra', priceFrom: 8 },
];

const CHARGING_PORTS = [
  // Sunsky: iPhone 16 PM non-orig $3.68, orig $13.92; iPhone 15 orig $13.89-16.24; Samsung S24U $6.32-11.19
  { name: 'USB-C Charging Port Flex', model: 'iPhone 16 Pro Max', priceFrom: 5 },
  { name: 'USB-C Charging Port Flex', model: 'iPhone 16 Pro', priceFrom: 5 },
  { name: 'USB-C Charging Port Flex', model: 'iPhone 15 Pro Max', priceFrom: 5 },
  { name: 'USB-C Charging Port Flex', model: 'iPhone 15', priceFrom: 5 },
  { name: 'Lightning Charging Port Flex', model: 'iPhone 14 Pro Max', priceFrom: 6 },
  { name: 'Lightning Charging Port Flex', model: 'iPhone 14 Pro', priceFrom: 5 },
  { name: 'Lightning Charging Port Flex', model: 'iPhone 14', priceFrom: 5 },
  { name: 'Lightning Charging Port Flex', model: 'iPhone 13', priceFrom: 3 },
  { name: 'USB-C Charging Port Board', model: 'Galaxy S24 Ultra', priceFrom: 8 },
  { name: 'USB-C Charging Port Board', model: 'Galaxy S23 Ultra', priceFrom: 7 },
];

const SPEAKERS_EARPIECES = [
  { name: 'Loudspeaker', model: 'iPhone 16 Pro Max', priceFrom: 5 },
  { name: 'Loudspeaker', model: 'iPhone 15 Pro Max', priceFrom: 4 },
  { name: 'Loudspeaker', model: 'iPhone 14 Pro Max', priceFrom: 3 },
  { name: 'Loudspeaker', model: 'iPhone 13 Pro Max', priceFrom: 2 },
  { name: 'Earpiece Speaker', model: 'iPhone 16 Pro Max', priceFrom: 4 },
  { name: 'Earpiece Speaker', model: 'iPhone 15 Pro Max', priceFrom: 3 },
  { name: 'Earpiece Speaker', model: 'iPhone 14 Pro Max', priceFrom: 2 },
  { name: 'Loudspeaker', model: 'Galaxy S24 Ultra', priceFrom: 4 },
  { name: 'Loudspeaker', model: 'Galaxy S23 Ultra', priceFrom: 3 },
];

const BACK_COVERS = [
  // Sunsky: iPhone 16 PM easy $2.45, orig $22.81; iPhone 15 PM $5.45; Samsung S24U $1.74-2.74
  { name: 'Back Glass Panel', model: 'iPhone 16 Pro Max', priceFrom: 3 },
  { name: 'Back Glass Panel', model: 'iPhone 16 Pro', priceFrom: 3 },
  { name: 'Back Glass Panel', model: 'iPhone 15 Pro Max', priceFrom: 7 },
  { name: 'Back Glass Panel', model: 'iPhone 15 Plus', priceFrom: 2 },
  { name: 'Back Glass Panel', model: 'iPhone 14 Pro Max', priceFrom: 3 },
  { name: 'Back Glass Panel', model: 'iPhone 14', priceFrom: 4 },
  { name: 'Back Cover + Camera Lens', model: 'Galaxy S24 Ultra', priceFrom: 3 },
  { name: 'Back Cover + Camera Lens', model: 'Galaxy S23 Ultra', priceFrom: 3 },
  { name: 'Back Cover', model: 'Galaxy S23+', priceFrom: 2 },
];

const FLEX_CABLES = [
  { name: 'Power Button Flex Cable', model: 'iPhone 16 Pro Max', priceFrom: 5 },
  { name: 'Power Button Flex Cable', model: 'iPhone 15 Pro Max', priceFrom: 4 },
  { name: 'Volume Button Flex Cable', model: 'iPhone 16 Pro Max', priceFrom: 4 },
  { name: 'Volume Button Flex Cable', model: 'iPhone 15 Pro Max', priceFrom: 3 },
  { name: 'NFC / Wireless Charging Coil', model: 'iPhone 16 Pro Max', priceFrom: 6 },
  { name: 'NFC / Wireless Charging Coil', model: 'iPhone 15 Pro Max', priceFrom: 5 },
  { name: 'NFC / Wireless Charging Coil', model: 'iPhone 14 Pro Max', priceFrom: 4 },
  { name: 'Antenna Flex Cable', model: 'iPhone 15 Pro Max', priceFrom: 3 },
  { name: 'Vibration Motor (Taptic)', model: 'iPhone 15 Pro Max', priceFrom: 3 },
  { name: 'Vibration Motor (Taptic)', model: 'iPhone 14 Pro Max', priceFrom: 2 },
];

/* ─── Category summary for stats ─── */
const ALL_PARTS_COUNT = REAR_CAMERAS.length + FRONT_CAMERAS.length + CHARGING_PORTS.length
  + SPEAKERS_EARPIECES.length + BACK_COVERS.length + FLEX_CABLES.length;

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  { q: 'Does my iPhone need a Lightning or USB-C charging port?', a: 'iPhone 15 and newer (15, 15 Pro, 16 series) use USB-C charging ports. iPhone 14 and all earlier models use Lightning. The ports are NOT cross-compatible — you must order the correct type for each model. We stock both Lightning and USB-C charging ports for all models from iPhone 8 through iPhone 16.' },
  { q: 'What is the best method for iPhone back glass replacement — laser or heat gun?', a: 'Laser removal is the professional standard — 95%+ success rate with no risk of internal heat damage. However, a laser machine costs $300-$800. Heat gun method works but risks damaging internal components above 120°C and has a higher breakage rate. For repair shops doing 5+ back glass repairs per week, we recommend investing in a laser. We supply both the replacement back glass panels (from $2) and laser machines ($350).' },
  { q: 'What is the difference between OEM and aftermarket camera modules?', a: 'OEM camera modules are genuine parts pulled from original devices — identical autofocus, OIS performance, and image quality. Aftermarket modules are manufactured to match specs but may show slight differences in color temperature or autofocus speed. For Pro/Pro Max models with advanced camera systems, we strongly recommend OEM modules. For standard models (iPhone 13, 14, 15 base), quality aftermarket modules perform very close to OEM.' },
  { q: 'Does iPhone water resistance (IP rating) survive after speaker or earpiece replacement?', a: 'No — any time the device is opened, the original factory seal is compromised and the IP68 water resistance rating is voided. However, proper reassembly with new adhesive gaskets can restore a reasonable level of water resistance (not certified IP68). We include replacement adhesive strips with our speaker and earpiece parts. Always inform customers that the original water resistance is not guaranteed after any repair.' },
  { q: 'Are flex cables interchangeable across iPhone models?', a: 'No — flex cables are strictly model-specific. Even within the same generation, different models use different flex cables (e.g., iPhone 13 Pro vs 13 Pro Max have completely different power flex cables). Always verify the exact model number (A2XXX) before ordering. Our product listings clearly specify compatible models to prevent ordering errors.' },
  { q: 'How do I test small parts before installing them?', a: 'We recommend using test flex cable extenders to verify parts before permanent installation. For cameras: check autofocus, image quality, and flash. For charging ports: test both charging and data transfer. For speakers: play audio at various volumes and check for distortion. For flex cables: test all button functions and signal continuity. Pre-testing reduces returns and improves customer satisfaction.' },
  { q: 'What are the most common phone repair parts to keep in stock?', a: 'Based on repair frequency: 1) Screens (highest demand), 2) Batteries, 3) Charging ports (especially iPhone 13-15 Lightning ports), 4) Rear cameras (iPhone 13 Pro Max and 14 Pro are top sellers), 5) Back glass panels (iPhone 12-15 series), 6) Speakers and earpieces. We recommend stocking 2-3 months of inventory for your top 10 repair models.' },
  { q: 'Why are Apple replacement parts so expensive, and are third-party alternatives reliable?', a: 'Apple controls its parts supply chain and does not sell individual components to third-party repair shops — this artificial scarcity drives up OEM part prices. Quality aftermarket alternatives are 30-60% cheaper and manufactured to match original specifications. Our parts are individually tested with a <1% defect rate and carry a 12-month warranty. The key is choosing a reputable supplier who tests every unit.' },
];

/* ─── Page Component ─── */
export default function SmallPartsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO (Condensed) ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Wholesale Cell Phone Parts{' '}
              <span className="text-orange-400">— Cameras, Charging Ports &amp; Back Glass</span>
            </h1>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              One-stop sourcing for iPhone &amp; Samsung repair parts. Cameras, charging ports,
              speakers, back glass, flex cables — all tested, all wholesale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <SmallPartsQuoteButton label="Request Bulk Quote" product="Wholesale Small Parts" eventLabel="Small Parts Hero CTA" variant="primary" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 1000+ SKUs</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 100% Tested</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Mixed Orders OK</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 12-Month Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. QUICK STATS BAR ═══ */}
      <section className="bg-[#f0f4f8] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">1000+</span>
              <span className="text-gray-600">Part SKUs</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">6</span>
              <span className="text-gray-600">Part Categories</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">$2</span>
              <span className="text-gray-600">Starting Price/Unit</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">20 pcs</span>
              <span className="text-gray-600">Minimum Order</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. PARTS CATALOG BY CATEGORY ═══ */}
      <section id="catalog" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Cell Phone Replacement Parts Catalog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our parts inventory by category. Click any item to request a quote. All prices are wholesale — volume discounts available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Rear Cameras */}
            <PartCategoryCard
              category="Rear Camera Modules"
              icon={<Camera className="w-4 h-4" />}
              items={REAR_CAMERAS}
            />

            {/* Front Cameras */}
            <PartCategoryCard
              category="Front Camera & Sensor Flex"
              icon={<Camera className="w-4 h-4" />}
              items={FRONT_CAMERAS}
            />

            {/* Charging Ports */}
            <PartCategoryCard
              category="Charging Ports & Flex"
              icon={<Plug className="w-4 h-4" />}
              items={CHARGING_PORTS}
            />

            {/* Speakers & Earpieces */}
            <PartCategoryCard
              category="Speakers & Earpieces"
              icon={<Volume2 className="w-4 h-4" />}
              items={SPEAKERS_EARPIECES}
            />

            {/* Back Covers */}
            <PartCategoryCard
              category="Back Glass & Covers"
              icon={<Smartphone className="w-4 h-4" />}
              items={BACK_COVERS}
            />

            {/* Flex Cables & Components */}
            <PartCategoryCard
              category="Flex Cables & Components"
              icon={<Cpu className="w-4 h-4" />}
              items={FLEX_CABLES}
            />
          </div>

          {/* More parts CTA */}
          <div className="text-center py-6 mt-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-600 mb-3">
              Need other parts? We also stock <strong>SIM trays</strong>, <strong>home buttons</strong>, <strong>Face ID modules</strong>, <strong>display connectors</strong>, and parts for <strong>Huawei, Xiaomi, OPPO</strong>.
            </p>
            <SmallPartsQuoteButton label="Request Full Catalog" product="Other Small Parts" eventLabel="Small Parts Other CTA" variant="secondary" />
          </div>
        </div>
      </section>

      {/* ═══ 4. PRICE RANGE OVERVIEW ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Price Range by Category</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Wholesale pricing overview for popular iPhone &amp; Samsung small parts.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e3a5f] text-white text-sm">
                  <th className="text-left px-6 py-3 font-semibold">Part Category</th>
                  <th className="text-center px-6 py-3 font-semibold">iPhone Range</th>
                  <th className="text-center px-6 py-3 font-semibold">Samsung Range</th>
                  <th className="text-center px-6 py-3 font-semibold hidden sm:table-cell">MOQ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { cat: 'Rear Camera Modules', iphone: '$29 – $65', samsung: '$41 – $59', moq: '20 pcs' },
                  { cat: 'Front Camera / Sensor', iphone: '$12 – $35', samsung: '$8 – $10', moq: '20 pcs' },
                  { cat: 'Charging Ports', iphone: '$3 – $6', samsung: '$7 – $8', moq: '20 pcs' },
                  { cat: 'Speakers & Earpieces', iphone: '$2 – $5', samsung: '$3 – $4', moq: '20 pcs' },
                  { cat: 'Back Glass / Covers', iphone: '$2 – $7', samsung: '$2 – $3', moq: '20 pcs' },
                  { cat: 'Flex Cables & Components', iphone: '$2 – $6', samsung: '$2 – $5', moq: '20 pcs' },
                ].map((row, i) => (
                  <tr key={row.cat} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-900">{row.cat}</td>
                    <td className="px-6 py-3.5 text-center text-orange-600 font-semibold">{row.iphone}</td>
                    <td className="px-6 py-3.5 text-center text-orange-600 font-semibold">{row.samsung}</td>
                    <td className="px-6 py-3.5 text-center text-gray-600 hidden sm:table-cell">{row.moq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            * Prices shown are wholesale for iPhone 13–16 and Samsung S23–S24 series. Older models available at lower prices.
          </p>
        </div>
      </section>

      {/* ═══ 5. VOLUME DISCOUNT ═══ */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Volume Discount Pricing</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Order more, save more. All part categories qualify for volume discounts.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e3a5f] text-white text-sm">
                  <th className="text-left px-6 py-3 font-semibold">Order Quantity</th>
                  <th className="text-center px-6 py-3 font-semibold">Discount</th>
                  <th className="text-right px-6 py-3 font-semibold hidden sm:table-cell">Example</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">20 – 99 pcs</td>
                  <td className="px-6 py-3.5 text-center text-gray-700">Base price</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">Charging port ~$5</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">100 – 499 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-8%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$4.60</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">500 – 999 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-12%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$4.40</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">1000+ pcs</td>
                  <td className="px-6 py-3.5 text-center font-bold text-orange-600">Custom Quote</td>
                  <td className="px-6 py-3.5 text-right text-orange-600 font-semibold hidden sm:table-cell">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ 6. MOQ / SHIPPING / WARRANTY ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Flexible MOQ', items: ['Starting from 20 units per part', 'Mix categories & models freely', 'Combine with screens & batteries', 'Sample orders available'] },
              { title: 'Global Shipping', items: ['Same-day dispatch (in-stock)', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery', 'Full shipment insurance'] },
              { title: '12-Month Warranty', items: ['All parts functionally tested', 'RMA rate below 1%', 'Free replacement for defects', 'Dedicated after-sales support'] },
            ].map((block) => (
              <div key={block.title} className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3">{block.title}</h3>
                <ul className="space-y-2">
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
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-white rounded-lg border border-gray-200 group" open={i < 2}>
                <summary className="px-5 py-3.5 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between text-sm">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">&#9662;</span>
                </summary>
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLOATING QUOTE BUTTON ═══ */}
      <div className="fixed bottom-6 right-6 z-50">
        <SmallPartsQuoteButton label="Get Quote" product="Wholesale Small Parts" eventLabel="Small Parts Float CTA" variant="float" />
      </div>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-3">Ready to Source Wholesale Small Parts?</h2>
          <p className="text-blue-200 mb-6 text-lg">
            One-stop sourcing for cameras, charging ports, speakers, and 1000+ more parts. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SmallPartsQuoteButton label="Request Bulk Quote" product="Wholesale Small Parts" eventLabel="Small Parts Footer CTA" variant="footer" />
            <SmallPartsQuoteButton
              label="WhatsApp Sales"
              variant="footer-wa"
              eventLabel="Small Parts Footer WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg text-lg border border-white/20 transition-all"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
