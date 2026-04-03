import { CheckCircle, ArrowRight, BatteryFull, Smartphone } from 'lucide-react';
import BatteriesQuoteButton from './BatteriesQuoteButton';
import BatteryCard from './BatteryCard';

/* ─── Product catalog data ─── */

type BatteryProduct = {
  model: string;
  grade: string;
  gradeLabel: string;
  gradeColor: string;
  priceFrom: number;
  features: string[];
  query: string;
};

const IPHONE_BATTERIES: BatteryProduct[] = [
  // iPhone 16 Pro Max — Sunsky Original: $32.39
  { model: 'iPhone 16 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 42, features: ['4685 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+16+Pro+Max+OEM+Battery' },
  { model: 'iPhone 16 Pro Max', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 19, features: ['5200+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+16+Pro+Max+High+Capacity+Battery' },
  { model: 'iPhone 16 Pro Max', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 14, features: ['4685 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+16+Pro+Max+Standard+Battery' },
  // iPhone 16 Pro — Sunsky Original: $24.53
  { model: 'iPhone 16 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 32, features: ['3582 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+16+Pro+OEM+Battery' },
  { model: 'iPhone 16 Pro', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 15, features: ['4000+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+16+Pro+High+Capacity+Battery' },
  { model: 'iPhone 16 Pro', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 11, features: ['3582 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+16+Pro+Standard+Battery' },
  // iPhone 16 — Sunsky Original: $22.37
  { model: 'iPhone 16', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 29, features: ['3561 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+16+OEM+Battery' },
  { model: 'iPhone 16', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 13, features: ['3900+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+16+High+Capacity+Battery' },
  { model: 'iPhone 16', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 9, features: ['3561 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+16+Standard+Battery' },
  // iPhone 15 Pro Max — Sunsky Compatible: $9.67
  { model: 'iPhone 15 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 19, features: ['4422 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+15+Pro+Max+OEM+Battery' },
  { model: 'iPhone 15 Pro Max', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 13, features: ['4900+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+15+Pro+Max+High+Capacity+Battery' },
  { model: 'iPhone 15 Pro Max', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 9, features: ['4422 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+15+Pro+Max+Standard+Battery' },
  // iPhone 15 Pro — Sunsky Compatible: $9.61
  { model: 'iPhone 15 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 18, features: ['3274 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+15+Pro+OEM+Battery' },
  { model: 'iPhone 15 Pro', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 12, features: ['3600+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+15+Pro+High+Capacity+Battery' },
  { model: 'iPhone 15 Pro', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 8, features: ['3274 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+15+Pro+Standard+Battery' },
  // iPhone 15 — Sunsky Compatible: $7.92
  { model: 'iPhone 15', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 16, features: ['3349 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+15+OEM+Battery' },
  { model: 'iPhone 15', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 10, features: ['3700+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+15+High+Capacity+Battery' },
  { model: 'iPhone 15', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 7, features: ['3349 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+15+Standard+Battery' },
  // iPhone 14 Pro Max — Sunsky Compatible: $8.48
  { model: 'iPhone 14 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 17, features: ['4323 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+14+Pro+Max+OEM+Battery' },
  { model: 'iPhone 14 Pro Max', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 11, features: ['4800+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+14+Pro+Max+High+Capacity+Battery' },
  { model: 'iPhone 14 Pro Max', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 7, features: ['4323 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+14+Pro+Max+Standard+Battery' },
  // iPhone 14 Pro — Sunsky Compatible: $10.36
  { model: 'iPhone 14 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 18, features: ['3200 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+14+Pro+OEM+Battery' },
  { model: 'iPhone 14 Pro', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 13, features: ['3500+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+14+Pro+High+Capacity+Battery' },
  { model: 'iPhone 14 Pro', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 8, features: ['3200 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+14+Pro+Standard+Battery' },
  // iPhone 13 Pro Max — Sunsky Compatible: $8.67
  { model: 'iPhone 13 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 16, features: ['4352 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+13+Pro+Max+OEM+Battery' },
  { model: 'iPhone 13 Pro Max', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 11, features: ['4800+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+13+Pro+Max+High+Capacity+Battery' },
  { model: 'iPhone 13 Pro Max', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 7, features: ['4352 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+13+Pro+Max+Standard+Battery' },
  // iPhone 13 Pro — Sunsky Compatible: $8.49, JUXIN 3300mAh: $6.36
  { model: 'iPhone 13 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 15, features: ['3095 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+13+Pro+OEM+Battery' },
  { model: 'iPhone 13 Pro', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 8, features: ['3300+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+13+Pro+High+Capacity+Battery' },
  { model: 'iPhone 13 Pro', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 6, features: ['3095 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+13+Pro+Standard+Battery' },
  // iPhone 13 — Sunsky JUXIN 3530mAh: $4.89
  { model: 'iPhone 13', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 13, features: ['3227 mAh', 'TI/ATL Cell', 'Battery Health OK'], query: 'iPhone+13+OEM+Battery' },
  { model: 'iPhone 13', grade: 'high-cap', gradeLabel: 'High-Capacity', gradeColor: 'bg-blue-600', priceFrom: 6, features: ['3530+ mAh', 'TI Cell', '10-20% Extra'], query: 'iPhone+13+High+Capacity+Battery' },
  { model: 'iPhone 13', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 5, features: ['3227 mAh', 'Protection Circuit', 'Budget Option'], query: 'iPhone+13+Standard+Battery' },
];

const SAMSUNG_BATTERIES: BatteryProduct[] = [
  // Galaxy S24 Ultra — Not yet on sunsky, estimated pricing
  { model: 'Galaxy S24 Ultra', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 22, features: ['5000 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S24+Ultra+OEM+Battery' },
  { model: 'Galaxy S24 Ultra', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 9, features: ['5000 mAh', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S24+Ultra+Standard+Battery' },
  // Galaxy S24+ — Not yet on sunsky, estimated pricing
  { model: 'Galaxy S24+', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 19, features: ['4900 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S24+Plus+OEM+Battery' },
  { model: 'Galaxy S24+', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 8, features: ['4900 mAh', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S24+Plus+Standard+Battery' },
  // Galaxy S24 — Not yet on sunsky, estimated pricing
  { model: 'Galaxy S24', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 16, features: ['4000 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S24+OEM+Battery' },
  { model: 'Galaxy S24', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 7, features: ['4000 mAh', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S24+Standard+Battery' },
  // Galaxy S23 Ultra — Sunsky EB-BS918ABY: $4.51
  { model: 'Galaxy S23 Ultra', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 12, features: ['5000 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S23+Ultra+OEM+Battery' },
  { model: 'Galaxy S23 Ultra', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 6, features: ['5000 mAh · EB-BS918ABY', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S23+Ultra+Standard+Battery' },
  // Galaxy S23+ — Sunsky EB-BS916ABY: $4.48
  { model: 'Galaxy S23+', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 11, features: ['4700 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S23+Plus+OEM+Battery' },
  { model: 'Galaxy S23+', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 6, features: ['4700 mAh · EB-BS916ABY', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S23+Plus+Standard+Battery' },
  // Galaxy S23 — Sunsky EB-BS912ABY: $4.51
  { model: 'Galaxy S23', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 10, features: ['3900 mAh', 'Li-Po Cell', 'Original Spec'], query: 'Samsung+S23+OEM+Battery' },
  { model: 'Galaxy S23', grade: 'standard', gradeLabel: 'Standard', gradeColor: 'bg-green-600', priceFrom: 6, features: ['3900 mAh · EB-BS912ABY', 'Protection Circuit', 'Budget Option'], query: 'Samsung+S23+Standard+Battery' },
];

/* ─── Helper: group products by model ─── */
function groupByModel(products: BatteryProduct[]) {
  const groups: Record<string, BatteryProduct[]> = {};
  for (const p of products) {
    if (!groups[p.model]) groups[p.model] = [];
    groups[p.model].push(p);
  }
  return Object.entries(groups);
}

/* ─── Quality grade comparison data ─── */
const GRADE_COMPARISON = [
  { grade: 'OEM Original', cell: 'TI / ATL', capacity: '100%', cycleLife: '800+', healthDisplay: true, safetyIC: true, price: '$$$', desc: 'Genuine pulled cells from original devices. Highest cycle performance and iOS battery health support.' },
  { grade: 'High-Capacity', cell: 'TI / Quality Li-Po', capacity: '110-120%', cycleLife: '600+', healthDisplay: true, safetyIC: true, price: '$$', desc: 'Aftermarket batteries with 10-20% extra capacity. Best value for repair shops.' },
  { grade: 'Standard Replacement', cell: 'Li-Po', capacity: '100%', cycleLife: '500+', healthDisplay: false, safetyIC: true, price: '$', desc: 'Budget-friendly option matching original specs. Built-in protection circuits.' },
];

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  { q: 'Is it worth replacing an iPhone battery at 80% health?', a: 'Yes — 80% is Apple\'s threshold where battery performance begins to degrade noticeably. Users experience unexpected shutdowns, slower performance, and significantly shorter screen-on time. Replacing at 80% restores full-day battery life. For repair shops, this is the most common customer request — we recommend stocking batteries for iPhone 13-15 series as they account for the majority of replacements.' },
  { q: 'Why does iPhone show "Unable to determine battery health" after replacement?', a: 'Since iOS 15.2, Apple pairs the battery to the motherboard via an encrypted chip. Third-party batteries trigger a "non-genuine part" or "unable to verify" message in Settings > Battery. This does NOT affect battery performance, charging speed, or actual battery life. To minimize customer concerns, use our OEM Original batteries which retain the genuine TI chip, or use a battery programmer (JC V1SE, $45) to transfer health data.' },
  { q: 'What is the difference between OEM, high-capacity, and standard batteries?', a: 'OEM Original: genuine TI/ATL cells with original capacity — shows correct battery health in iOS, highest reliability. High-Capacity: 10-20% larger capacity than original (e.g., 3,349 mAh vs 3,095 mAh for iPhone 14) — longer battery life but may trigger iOS warnings. Standard: same capacity as original, manufactured with certified cells — most cost-effective for high-volume shops.' },
  { q: 'How long does a replacement phone battery last?', a: 'A quality replacement battery is designed for 800-1,000 full charge cycles while retaining 80%+ capacity — that\'s typically 2-3 years of normal use. Our OEM batteries match Apple\'s original cycle count rating. Lifespan depends on usage patterns: heavy gaming/video drains faster. We recommend advising customers to keep charge between 20-80% for optimal longevity.' },
  { q: 'Do I need to calibrate the battery after replacement?', a: 'For best accuracy of the battery percentage indicator, we recommend a single calibration cycle after installation: charge to 100%, use until the device shuts off, then charge uninterrupted to 100% again. This helps iOS recalibrate the fuel gauge. No special tools or software needed. Most modern iPhones (12 and newer) auto-calibrate within 1-2 weeks.' },
  { q: 'What safety certifications should wholesale phone batteries have?', a: 'Legitimate wholesale batteries must carry: UN38.3 (mandatory for lithium battery shipping), UL 2054 or IEC 62133 (safety standards for portable batteries), CE marking (EU compliance), and FCC (US). All PRSPARES batteries are individually tested and carry these certifications. Avoid suppliers who cannot provide UN38.3 test reports — it\'s a legal requirement for air freight.' },
  { q: 'What are the shipping regulations for lithium batteries?', a: 'Lithium batteries are Class 9 Dangerous Goods for air transport under IATA regulations. Requirements include: UN38.3 certified packaging, DG declaration documents, maximum 2 batteries per package for certain carriers, and special labeling. We handle all DG documentation and compliant packaging — batteries ship via DHL/FedEx/UPS express (3-7 days) or sea freight for bulk orders (15-25 days, more cost-effective for 500+ units).' },
  { q: 'How can I verify the actual capacity of a replacement battery?', a: 'Use a battery capacity tester (like the YR1035+) to measure actual mAh. Genuine batteries should test at 95-100% of rated capacity. Red flags: batteries testing below 90%, inconsistent results between units, or swelling after initial charge. We test every battery individually before shipping — our guaranteed minimum is 95% of rated capacity at delivery.' },
];

/* ─── Page Component ─── */
export default function BatteriesPage() {
  const iphoneGroups = groupByModel(IPHONE_BATTERIES);
  const samsungGroups = groupByModel(SAMSUNG_BATTERIES);

  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO (Condensed) ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Wholesale Phone Battery Replacement{' '}
              <span className="text-orange-400">— TI/ATL Cells, Safety Certified</span>
            </h1>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              iPhone &amp; Samsung replacement batteries in 3 quality grades.
              Factory-direct from Shenzhen with bulk pricing from $5/unit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <BatteriesQuoteButton label="Request Bulk Quote" product="Wholesale Phone Batteries" eventLabel="Batteries Hero CTA" variant="primary" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 300+ Battery SKUs</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> UN38.3 Certified</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> DG Shipping Ready</span>
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
              <span className="block text-2xl font-bold text-[#1e3a5f]">300+</span>
              <span className="text-gray-600">Battery SKUs</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">3</span>
              <span className="text-gray-600">Quality Grades</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">$5</span>
              <span className="text-gray-600">Starting Price/Unit</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">20 pcs</span>
              <span className="text-gray-600">Minimum Order</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. PRODUCT CATALOG ═══ */}
      <section id="catalog" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Wholesale Battery Catalog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our iPhone and Samsung battery inventory by model and quality grade. All prices are wholesale — volume discounts available.
            </p>
          </div>

          {/* ── iPhone Batteries ── */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a5f]">
              <Smartphone className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-2xl font-bold text-gray-900">iPhone Batteries</h3>
              <span className="ml-auto text-sm text-gray-500">{IPHONE_BATTERIES.length} products</span>
            </div>

            {iphoneGroups.map(([model, products]) => (
              <div key={model} className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BatteryFull className="w-5 h-5 text-gray-400" />
                  {model}
                  <span className="text-sm font-normal text-gray-500">— {products.length} grades available</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <BatteryCard key={`${p.model}-${p.grade}`} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Samsung Batteries ── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a5f]">
              <Smartphone className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-2xl font-bold text-gray-900">Samsung Batteries</h3>
              <span className="ml-auto text-sm text-gray-500">{SAMSUNG_BATTERIES.length} products</span>
            </div>

            {samsungGroups.map(([model, products]) => (
              <div key={model} className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BatteryFull className="w-5 h-5 text-gray-400" />
                  {model}
                  <span className="text-sm font-normal text-gray-500">— {products.length} grades available</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <BatteryCard key={`${p.model}-${p.grade}`} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* More models CTA */}
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-600 mb-3">
              Looking for other models? We stock batteries for <strong>iPhone 6–12 series</strong>, <strong>Galaxy S22/S21/A series</strong>, <strong>Huawei</strong>, <strong>Xiaomi</strong>, and more.
            </p>
            <BatteriesQuoteButton label="Inquire About Other Models" product="Other Battery Models" eventLabel="Batteries Other Models CTA" variant="secondary" />
          </div>
        </div>
      </section>

      {/* ═══ 4. QUALITY GRADE COMPARISON ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Battery Quality Grades Explained</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Choose the right battery grade for your repair business. Each grade offers different trade-offs between performance, features, and price.
          </p>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-[#1e3a5f] text-white text-sm">
                  <th className="text-left px-5 py-3 font-semibold">Grade</th>
                  <th className="text-left px-5 py-3 font-semibold">Cell Type</th>
                  <th className="text-center px-5 py-3 font-semibold">Capacity</th>
                  <th className="text-center px-5 py-3 font-semibold">Cycle Life</th>
                  <th className="text-center px-5 py-3 font-semibold">iOS Health</th>
                  <th className="text-center px-5 py-3 font-semibold">Safety IC</th>
                  <th className="text-center px-5 py-3 font-semibold">Price Level</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_COMPARISON.map((g, i) => (
                  <tr key={g.grade} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-900">{g.grade}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{g.cell}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-gray-700">{g.capacity}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-gray-700">{g.cycleLife}</td>
                    <td className="px-5 py-3.5 text-center">{g.healthDisplay ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-center">{g.safetyIC ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-orange-500">{g.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {GRADE_COMPARISON.map((g) => (
              <div key={g.grade} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="font-bold text-gray-900 text-lg mb-1">{g.grade}</div>
                <p className="text-xs text-gray-500 mb-3">{g.desc}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Cell:</span> {g.cell}</div>
                  <div><span className="text-gray-500">Capacity:</span> {g.capacity}</div>
                  <div><span className="text-gray-500">Cycle Life:</span> {g.cycleLife}</div>
                  <div><span className="text-gray-500">Price:</span> <span className="font-bold text-orange-500">{g.price}</span></div>
                  <div><span className="text-gray-500">iOS Health:</span> {g.healthDisplay ? 'Yes' : 'No'}</div>
                  <div><span className="text-gray-500">Safety IC:</span> {g.safetyIC ? 'Yes' : 'No'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* iOS Battery Health Notice */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
            <p className="text-sm text-amber-800">
              <strong>iOS Battery Health Note:</strong> Apple may display a &quot;non-genuine part&quot; warning after battery replacement on iOS 15.2+.
              This does not affect battery performance, safety, or health percentage tracking. Our OEM and High-Capacity grades support full battery health reporting.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 5. BULK PRICING TIERS ═══ */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Volume Discount Pricing</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            The more you order, the more you save. All grades qualify for volume discounts.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e3a5f] text-white text-sm">
                  <th className="text-left px-6 py-3 font-semibold">Order Quantity</th>
                  <th className="text-center px-6 py-3 font-semibold">Discount</th>
                  <th className="text-right px-6 py-3 font-semibold hidden sm:table-cell">Example: High-Capacity</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">20 – 99 pcs</td>
                  <td className="px-6 py-3.5 text-center text-gray-700">Base price</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$11/unit</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">100 – 499 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-8%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$10.12/unit</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">500 – 999 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-12%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$9.68/unit</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">1000+ pcs</td>
                  <td className="px-6 py-3.5 text-center font-bold text-orange-600">Custom Quote</td>
                  <td className="px-6 py-3.5 text-right text-orange-600 font-semibold hidden sm:table-cell">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            * Example prices based on iPhone 14 Pro Max High-Capacity battery. Actual pricing varies by model and grade.
          </p>
        </div>
      </section>

      {/* ═══ 6. MOQ / SHIPPING / WARRANTY (Condensed) ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Flexible MOQ', items: ['Starting from 20 units', 'Mix models & brands freely', 'Sample orders available'] },
              { title: 'DG-Compliant Shipping', items: ['Full DG documentation handled', 'DHL / FedEx / sea freight', 'UN38.3 compliant packaging'] },
              { title: '12-Month Warranty', items: ['All batteries warranted', 'Individual cycle-tested', 'Free replacement for defects'] },
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
        <BatteriesQuoteButton label="Get Quote" product="Wholesale Phone Batteries" eventLabel="Batteries Float CTA" variant="float" />
      </div>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-3">Ready to Order Wholesale Batteries?</h2>
          <p className="text-blue-200 mb-6 text-lg">
            Get factory-direct pricing on 300+ battery SKUs. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BatteriesQuoteButton label="Request Bulk Quote" product="Wholesale Phone Batteries" eventLabel="Batteries Footer CTA" variant="footer" />
            <BatteriesQuoteButton
              label="WhatsApp Sales"
              variant="footer-wa"
              eventLabel="Batteries Footer WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg text-lg border border-white/20 transition-all"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
