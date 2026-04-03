import { CheckCircle, ArrowRight, Monitor, Smartphone } from 'lucide-react';
import ScreensQuoteButton from './ScreensQuoteButton';
import ProductCard from './ProductCard';

/* ─── Product catalog data ─── */

type ScreenProduct = {
  model: string;
  grade: string;
  gradeLabel: string;
  gradeColor: string;
  priceFrom: number;
  features: string[];
  query: string;
};

const IPHONE_SCREENS: ScreenProduct[] = [
  // iPhone 16 Pro Max
  { model: 'iPhone 16 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 259, features: ['LTPO Super Retina XDR', '120Hz ProMotion', 'True Tone'], query: 'iPhone+16+Pro+Max+OEM+Screen' },
  { model: 'iPhone 16 Pro Max', grade: 'soft-oled', gradeLabel: 'Soft OLED', gradeColor: 'bg-blue-600', priceFrom: 85, features: ['OLED Display', '120Hz Support', 'True Tone Compatible'], query: 'iPhone+16+Pro+Max+Soft+OLED+Screen' },
  { model: 'iPhone 16 Pro Max', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 75, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+16+Pro+Max+Hard+OLED+Screen' },
  { model: 'iPhone 16 Pro Max', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 39, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+16+Pro+Max+Incell+Screen' },
  // iPhone 16 Pro
  { model: 'iPhone 16 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 239, features: ['LTPO Super Retina XDR', '120Hz ProMotion', 'True Tone'], query: 'iPhone+16+Pro+OEM+Screen' },
  { model: 'iPhone 16 Pro', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 69, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+16+Pro+Hard+OLED+Screen' },
  { model: 'iPhone 16 Pro', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 35, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+16+Pro+Incell+Screen' },
  // iPhone 15 Pro Max
  { model: 'iPhone 15 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 199, features: ['Super Retina XDR OLED', '120Hz ProMotion', 'True Tone'], query: 'iPhone+15+Pro+Max+OEM+Screen' },
  { model: 'iPhone 15 Pro Max', grade: 'soft-oled', gradeLabel: 'Soft OLED', gradeColor: 'bg-blue-600', priceFrom: 59, features: ['OLED Display', '120Hz Support', 'True Tone Compatible'], query: 'iPhone+15+Pro+Max+Soft+OLED+Screen' },
  { model: 'iPhone 15 Pro Max', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 55, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+15+Pro+Max+Hard+OLED+Screen' },
  { model: 'iPhone 15 Pro Max', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 19, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+15+Pro+Max+Incell+Screen' },
  // iPhone 15 Pro
  { model: 'iPhone 15 Pro', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 179, features: ['Super Retina XDR OLED', '120Hz ProMotion', 'True Tone'], query: 'iPhone+15+Pro+OEM+Screen' },
  { model: 'iPhone 15 Pro', grade: 'soft-oled', gradeLabel: 'Soft OLED', gradeColor: 'bg-blue-600', priceFrom: 55, features: ['OLED Display', '120Hz Support', 'True Tone Compatible'], query: 'iPhone+15+Pro+Soft+OLED+Screen' },
  { model: 'iPhone 15 Pro', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 49, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+15+Pro+Hard+OLED+Screen' },
  { model: 'iPhone 15 Pro', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 19, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+15+Pro+Incell+Screen' },
  // iPhone 14 Pro Max
  { model: 'iPhone 14 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 145, features: ['Super Retina XDR OLED', '120Hz ProMotion', 'True Tone'], query: 'iPhone+14+Pro+Max+OEM+Screen' },
  { model: 'iPhone 14 Pro Max', grade: 'soft-oled', gradeLabel: 'Soft OLED', gradeColor: 'bg-blue-600', priceFrom: 55, features: ['OLED Display', '120Hz Support', 'True Tone Compatible'], query: 'iPhone+14+Pro+Max+Soft+OLED+Screen' },
  { model: 'iPhone 14 Pro Max', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 49, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+14+Pro+Max+Hard+OLED+Screen' },
  { model: 'iPhone 14 Pro Max', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 19, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+14+Pro+Max+Incell+Screen' },
  // iPhone 13 Pro Max
  { model: 'iPhone 13 Pro Max', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 109, features: ['Super Retina XDR OLED', '120Hz ProMotion', 'True Tone'], query: 'iPhone+13+Pro+Max+OEM+Screen' },
  { model: 'iPhone 13 Pro Max', grade: 'soft-oled', gradeLabel: 'Soft OLED', gradeColor: 'bg-blue-600', priceFrom: 45, features: ['OLED Display', '120Hz Support', 'True Tone Compatible'], query: 'iPhone+13+Pro+Max+Soft+OLED+Screen' },
  { model: 'iPhone 13 Pro Max', grade: 'hard-oled', gradeLabel: 'Hard OLED', gradeColor: 'bg-cyan-600', priceFrom: 42, features: ['OLED Display', '120Hz Support', 'IC Transfer Compatible'], query: 'iPhone+13+Pro+Max+Hard+OLED+Screen' },
  { model: 'iPhone 13 Pro Max', grade: 'incell', gradeLabel: 'Incell LCD', gradeColor: 'bg-green-600', priceFrom: 19, features: ['LCD Display', 'Standard Refresh', 'Budget Option'], query: 'iPhone+13+Pro+Max+Incell+Screen' },
];

const SAMSUNG_SCREENS: ScreenProduct[] = [
  // Galaxy S24 Ultra
  { model: 'Galaxy S24 Ultra', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 239, features: ['Dynamic AMOLED 2X', 'S Pen Support', '120Hz'], query: 'Samsung+S24+Ultra+OEM+Screen' },
  { model: 'Galaxy S24 Ultra', grade: 'oled', gradeLabel: 'OLED Aftermarket', gradeColor: 'bg-blue-600', priceFrom: 99, features: ['OLED Display', 'With Frame', 'Fingerprint OK'], query: 'Samsung+S24+Ultra+OLED+Screen' },
  { model: 'Galaxy S24 Ultra', grade: 'tft', gradeLabel: 'TFT LCD', gradeColor: 'bg-green-600', priceFrom: 35, features: ['TFT Display', 'With Frame', 'No Fingerprint'], query: 'Samsung+S24+Ultra+TFT+Screen' },
  // Galaxy S23 Ultra
  { model: 'Galaxy S23 Ultra', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 225, features: ['Dynamic AMOLED 2X', 'S Pen Support', '120Hz'], query: 'Samsung+S23+Ultra+OEM+Screen' },
  { model: 'Galaxy S23 Ultra', grade: 'oled', gradeLabel: 'OLED Aftermarket', gradeColor: 'bg-blue-600', priceFrom: 85, features: ['OLED Display', 'With Frame', 'Fingerprint OK'], query: 'Samsung+S23+Ultra+OLED+Screen' },
  { model: 'Galaxy S23 Ultra', grade: 'tft', gradeLabel: 'TFT LCD', gradeColor: 'bg-green-600', priceFrom: 35, features: ['TFT Display', 'With Frame', 'No Fingerprint'], query: 'Samsung+S23+Ultra+TFT+Screen' },
  // Galaxy S22 Ultra
  { model: 'Galaxy S22 Ultra', grade: 'oem', gradeLabel: 'OEM Original', gradeColor: 'bg-purple-600', priceFrom: 189, features: ['Dynamic AMOLED 2X', 'S Pen Support', '120Hz'], query: 'Samsung+S22+Ultra+OEM+Screen' },
  { model: 'Galaxy S22 Ultra', grade: 'oled', gradeLabel: 'OLED Aftermarket', gradeColor: 'bg-blue-600', priceFrom: 69, features: ['OLED Display', 'With Frame', 'Fingerprint OK'], query: 'Samsung+S22+Ultra+OLED+Screen' },
  // Galaxy A Series
  { model: 'Galaxy A54 / A53', grade: 'oled', gradeLabel: 'OLED Aftermarket', gradeColor: 'bg-blue-600', priceFrom: 29, features: ['AMOLED Display', 'With Frame', 'Fingerprint OK'], query: 'Samsung+A54+A53+OLED+Screen' },
  { model: 'Galaxy A34 / A33', grade: 'oled', gradeLabel: 'OLED Aftermarket', gradeColor: 'bg-blue-600', priceFrom: 25, features: ['AMOLED Display', 'With Frame', 'Budget Model'], query: 'Samsung+A34+A33+OLED+Screen' },
  { model: 'Galaxy A14 / A13', grade: 'lcd', gradeLabel: 'LCD', gradeColor: 'bg-green-600', priceFrom: 15, features: ['LCD Display', 'With Frame', 'Budget Model'], query: 'Samsung+A14+A13+LCD+Screen' },
];

/* ─── Helper: group products by model ─── */
function groupByModel(products: ScreenProduct[]) {
  const groups: Record<string, ScreenProduct[]> = {};
  for (const p of products) {
    if (!groups[p.model]) groups[p.model] = [];
    groups[p.model].push(p);
  }
  return Object.entries(groups);
}

/* ─── Quality grade comparison data ─── */
const GRADE_COMPARISON = [
  { grade: 'OEM Original', tech: 'OLED / LTPO', color: '100%', brightness: '100%', fingerprint: true, trueTone: true, price: '$$$$$', desc: 'Genuine pulled/refurb parts. Highest quality for premium repairs.' },
  { grade: 'OEM Refurbished', tech: 'OLED', color: '95%', brightness: '95%', fingerprint: true, trueTone: true, price: '$$$$', desc: 'Original LCD with new glass and frame. Near-OEM quality.' },
  { grade: 'Soft OLED', tech: 'OLED (Flexible)', color: '90%', brightness: '90%', fingerprint: true, trueTone: true, price: '$$$', desc: 'Best aftermarket. Flexible OLED panel, closest to OEM.' },
  { grade: 'Hard OLED', tech: 'OLED (Rigid)', color: '85%', brightness: '85%', fingerprint: true, trueTone: true, price: '$$', desc: 'Mid-high aftermarket. Rigid OLED, great price-performance.' },
  { grade: 'Incell LCD', tech: 'LCD', color: '75%', brightness: '80%', fingerprint: false, trueTone: false, price: '$', desc: 'Budget-friendly. Reliable for cost-conscious repairs.' },
];

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  { q: 'What is the difference between OLED, Soft OLED, Hard OLED, and Incell LCD screens?', a: 'OEM Original uses the genuine factory display with perfect color accuracy. Soft OLED is the best aftermarket option — flexible OLED panel achieving 90-95% of OEM color quality with 120Hz support. Hard OLED uses a rigid OLED panel, slightly lower contrast but very durable. Incell LCD is a budget option using LCD technology — no deep blacks, standard refresh rate, but works perfectly for basic repairs.' },
  { q: 'What is the difference between OEM, aftermarket, and refurbished screens?', a: 'OEM Original screens are genuine parts pulled from new devices — highest quality and price. OEM Refurbished uses the original LCD/OLED panel with a new glass and touch digitizer — near-OEM quality at 40-60% lower cost. Aftermarket (Soft OLED, Hard OLED, Incell) are newly manufactured to match original specs — quality varies by grade, but all are functionally tested.' },
  { q: 'Will True Tone still work after replacing the screen?', a: 'True Tone data is stored on the original screen\'s IC chip. When you replace the screen, True Tone needs to be transferred using a programmer (JC V1SE, i2C, or JCID). Our Soft OLED, Hard OLED, and OEM grade screens all support True Tone transfer. We also sell the programmers separately — from $45.' },
  { q: 'Does iPhone screen replacement affect Face ID?', a: 'No — Face ID uses the front-facing TrueDepth camera system, which is separate from the display. As long as you transfer the original earpiece/proximity sensor flex cable to the new screen, Face ID will work normally on all screen grades. No programmer needed for Face ID.' },
  { q: 'What do screen quality grades like AAA, AA, and A mean?', a: 'Screen grading is not standardized across the industry. At PRSPARES, we use clear grade names: OEM Original, OEM Refurbished, Soft OLED, Hard OLED, and Incell LCD — so you know exactly what you\'re getting. Some suppliers use AAA (original LCD + copy glass), AA (high-quality copy), A (standard copy). Always ask about the actual panel technology, not just the grade letter.' },
  { q: 'How much does iPhone screen replacement cost at wholesale?', a: 'Wholesale pricing depends on model and grade. For example, iPhone 16 Pro Max ranges from $39 (Incell) to $259 (OEM). iPhone 14 Pro Max: $29 (Incell) to $179 (OEM). iPhone 13: $19 (Incell) to $89 (OEM). Volume discounts of 8-15% apply for orders of 50+ units. Request a quote for exact pricing on your model mix.' },
  { q: 'How do I test replacement screens for defects before installing?', a: 'We recommend using a dedicated LCD/OLED tester (like the DL S300 at $85) to check every screen before installation. Test for: touch responsiveness across all zones, display uniformity (no dead pixels, lines, or color patches), 3D Touch / Haptic Touch function, and backlight consistency. We also offer 48-hour DOA replacement on all screens.' },
  { q: 'What is the typical defect rate for wholesale screens?', a: 'Our defect rates by grade: OEM Original <0.5%, Soft OLED <1%, Hard OLED <1.5%, Incell LCD <2%. All screens are pre-tested before shipping. We offer a 12-month warranty covering manufacturing defects and a 48-hour DOA (dead on arrival) replacement policy for any screen that fails out of the box.' },
];

/* ─── Page Component ─── */
export default function ScreensPage() {
  const iphoneGroups = groupByModel(IPHONE_SCREENS);
  const samsungGroups = groupByModel(SAMSUNG_SCREENS);

  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO (Condensed) ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Wholesale Phone Screens{' '}
              <span className="text-orange-400">for Repair Shops &amp; Distributors</span>
            </h1>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              iPhone &amp; Samsung LCD/OLED display assemblies in 5 quality grades.
              Factory-direct from Shenzhen with bulk pricing from $19/unit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <ScreensQuoteButton label="Request Bulk Quote" product="Wholesale Phone Screens" eventLabel="Screens Hero CTA" variant="primary" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 500+ Screen SKUs</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> True Tone Support</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> &lt;1% RMA Rate</span>
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
              <span className="block text-2xl font-bold text-[#1e3a5f]">500+</span>
              <span className="text-gray-600">Screen SKUs</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">5</span>
              <span className="text-gray-600">Quality Grades</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">$19</span>
              <span className="text-gray-600">Starting Price/Unit</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-[#1e3a5f]">10 pcs</span>
              <span className="text-gray-600">Minimum Order</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. PRODUCT CATALOG ═══ */}
      <section id="catalog" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Wholesale Screen Catalog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our iPhone and Samsung screen inventory by model and quality grade. All prices are wholesale — volume discounts available.
            </p>
          </div>

          {/* ── iPhone Screens ── */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a5f]">
              <Smartphone className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-2xl font-bold text-gray-900">iPhone Screens</h3>
              <span className="ml-auto text-sm text-gray-500">{IPHONE_SCREENS.length} products</span>
            </div>

            {iphoneGroups.map(([model, products]) => (
              <div key={model} className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  {model}
                  <span className="text-sm font-normal text-gray-500">— {products.length} grades available</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <ProductCard key={`${p.model}-${p.grade}`} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Samsung Screens ── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a5f]">
              <Smartphone className="w-6 h-6 text-[#1e3a5f]" />
              <h3 className="text-2xl font-bold text-gray-900">Samsung Screens</h3>
              <span className="ml-auto text-sm text-gray-500">{SAMSUNG_SCREENS.length} products</span>
            </div>

            {samsungGroups.map(([model, products]) => (
              <div key={model} className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  {model}
                  <span className="text-sm font-normal text-gray-500">— {products.length} grades available</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <ProductCard key={`${p.model}-${p.grade}`} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* More models CTA */}
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-600 mb-3">
              Looking for other models? We stock screens for <strong>iPhone 6–12 series</strong>, <strong>Galaxy S21/S20</strong>, <strong>Huawei</strong>, <strong>Xiaomi</strong>, and more.
            </p>
            <ScreensQuoteButton label="Inquire About Other Models" product="Other Screen Models" eventLabel="Screens Other Models CTA" variant="secondary" />
          </div>
        </div>
      </section>

      {/* ═══ 4. QUALITY GRADE COMPARISON ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Screen Quality Grades Explained</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Choose the right quality grade for your repair business. Each grade offers different trade-offs between quality and price.
          </p>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-[#1e3a5f] text-white text-sm">
                  <th className="text-left px-5 py-3 font-semibold">Grade</th>
                  <th className="text-left px-5 py-3 font-semibold">Display Tech</th>
                  <th className="text-center px-5 py-3 font-semibold">Color</th>
                  <th className="text-center px-5 py-3 font-semibold">Brightness</th>
                  <th className="text-center px-5 py-3 font-semibold">Fingerprint</th>
                  <th className="text-center px-5 py-3 font-semibold">True Tone</th>
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
                    <td className="px-5 py-3.5 text-sm text-gray-700">{g.tech}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-gray-700">{g.color}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-gray-700">{g.brightness}</td>
                    <td className="px-5 py-3.5 text-center">{g.fingerprint ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-center">{g.trueTone ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
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
                  <div><span className="text-gray-500">Tech:</span> {g.tech}</div>
                  <div><span className="text-gray-500">Color:</span> {g.color}</div>
                  <div><span className="text-gray-500">Brightness:</span> {g.brightness}</div>
                  <div><span className="text-gray-500">Price:</span> <span className="font-bold text-orange-500">{g.price}</span></div>
                  <div><span className="text-gray-500">Fingerprint:</span> {g.fingerprint ? 'Yes' : 'No'}</div>
                  <div><span className="text-gray-500">True Tone:</span> {g.trueTone ? 'Yes' : 'No'}</div>
                </div>
              </div>
            ))}
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
                  <th className="text-right px-6 py-3 font-semibold hidden sm:table-cell">Example: Soft OLED</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">10 – 49 pcs</td>
                  <td className="px-6 py-3.5 text-center text-gray-700">Base price</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$59/unit</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">50 – 99 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-5%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$56/unit</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3.5 font-medium text-gray-900">100 – 499 pcs</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-green-600">-10%</td>
                  <td className="px-6 py-3.5 text-right text-gray-700 hidden sm:table-cell">~$53/unit</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">500+ pcs</td>
                  <td className="px-6 py-3.5 text-center font-bold text-orange-600">Custom Quote</td>
                  <td className="px-6 py-3.5 text-right text-orange-600 font-semibold hidden sm:table-cell">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            * Example prices based on iPhone 15 Pro Max Soft OLED. Actual pricing varies by model and grade.
          </p>
        </div>
      </section>

      {/* ═══ 6. MOQ / SHIPPING / WARRANTY (Condensed) ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Flexible MOQ', items: ['Starting from 10 units', 'Mix models & grades freely', 'Sample orders available'] },
              { title: 'Global Shipping', items: ['Same-day dispatch (in-stock)', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery'] },
              { title: '12-Month Warranty', items: ['All screens warranted', 'RMA rate below 1%', 'Free replacement for defects'] },
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
        <ScreensQuoteButton label="Get Quote" product="Wholesale Phone Screens" eventLabel="Screens Float CTA" variant="float" />
      </div>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-3">Ready to Order Wholesale Screens?</h2>
          <p className="text-blue-200 mb-6 text-lg">
            Get factory-direct pricing on 500+ screen SKUs. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ScreensQuoteButton label="Request Bulk Quote" product="Wholesale Phone Screens" eventLabel="Screens Footer CTA" variant="footer" />
            <ScreensQuoteButton
              label="WhatsApp Sales"
              variant="footer-wa"
              eventLabel="Screens Footer WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg text-lg border border-white/20 transition-all"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
