import { CheckCircle, ArrowRight, Camera, Shield, Zap, Package } from 'lucide-react';
import CameraCard from './CameraCard';
import CameraQuoteButton from './CameraQuoteButton';

/* ─── iPhone Camera Catalog Data ─── */

const IPHONE_16_CAMERAS = [
  { model: 'iPhone 16 Pro Max', spec: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto', priceFrom: 65, badge: 'Latest', badgeColor: 'bg-purple-600' },
  { model: 'iPhone 16 Pro', spec: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto', priceFrom: 60, badge: 'Latest', badgeColor: 'bg-purple-600' },
  { model: 'iPhone 16', spec: '48MP Main + 12MP Ultra Wide', priceFrom: 45 },
  { model: 'iPhone 16 Plus', spec: '48MP Main + 12MP Ultra Wide', priceFrom: 45 },
];

const IPHONE_15_CAMERAS = [
  { model: 'iPhone 15 Pro Max', spec: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto', priceFrom: 55, badge: 'Popular', badgeColor: 'bg-orange-500' },
  { model: 'iPhone 15 Pro', spec: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', priceFrom: 50, badge: 'Popular', badgeColor: 'bg-orange-500' },
  { model: 'iPhone 15', spec: '48MP Main + 12MP Ultra Wide', priceFrom: 40 },
  { model: 'iPhone 15 Plus', spec: '48MP Main + 12MP Ultra Wide', priceFrom: 40 },
];

const IPHONE_14_CAMERAS = [
  { model: 'iPhone 14 Pro Max', spec: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', priceFrom: 48 },
  { model: 'iPhone 14 Pro', spec: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', priceFrom: 45 },
  { model: 'iPhone 14', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 35 },
  { model: 'iPhone 14 Plus', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 35 },
];

const IPHONE_13_CAMERAS = [
  { model: 'iPhone 13 Pro Max', spec: '12MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', priceFrom: 42, badge: 'High Demand', badgeColor: 'bg-blue-600' },
  { model: 'iPhone 13 Pro', spec: '12MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', priceFrom: 40 },
  { model: 'iPhone 13', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 32 },
  { model: 'iPhone 13 mini', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 32 },
];

const IPHONE_12_CAMERAS = [
  { model: 'iPhone 12 Pro Max', spec: '12MP Main + 12MP Ultra Wide + 12MP 2.5x Telephoto', priceFrom: 38 },
  { model: 'iPhone 12 Pro', spec: '12MP Main + 12MP Ultra Wide + 12MP 2x Telephoto', priceFrom: 35 },
  { model: 'iPhone 12', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 30 },
  { model: 'iPhone 12 mini', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 30 },
];

const IPHONE_11_CAMERAS = [
  { model: 'iPhone 11 Pro Max', spec: '12MP Main + 12MP Ultra Wide + 12MP 2x Telephoto', priceFrom: 35 },
  { model: 'iPhone 11 Pro', spec: '12MP Main + 12MP Ultra Wide + 12MP 2x Telephoto', priceFrom: 32 },
  { model: 'iPhone 11', spec: '12MP Main + 12MP Ultra Wide', priceFrom: 29 },
];

/* ─── FAQ ─── */
const FAQ_ITEMS = [
  { q: 'How much does iPhone camera replacement cost?', a: 'Apple charges $169-$249 for rear camera replacement (entire module). Third-party repair shops typically charge $80-$150 for OEM parts or $40-$80 for aftermarket. Our wholesale camera module prices: iPhone 16 Pro Max $65, iPhone 15 Pro Max $55, iPhone 14 Pro Max $48, iPhone 13 Pro Max $42, iPhone 12 Pro Max $38, iPhone 11 $29. Bulk discounts from 50+ units.' },
  { q: 'What is the difference between camera glass and camera module?', a: 'Camera glass (lens cover) is the protective sapphire/glass covering over the camera — it can crack from drops without damaging the camera itself. Replacing just the glass costs $15-$30. The camera module is the actual sensor, lens elements, autofocus motor, and OIS mechanism — this is what you replace when the camera is blurry, won\'t focus, or shows black screen. Module replacement costs $29-$65 wholesale. If only the glass is cracked but the camera still takes perfect photos, you may only need the glass.' },
  { q: 'Why is my iPhone camera shaking or vibrating after replacement?', a: 'Camera shaking after replacement is usually caused by: 1) OIS (optical image stabilization) motor not seated properly — reseat the module and ensure the flex cable is fully connected. 2) Aftermarket module with weaker OIS magnets — try an OEM module instead. 3) Debris between the camera module and housing — clean with compressed air. 4) Incorrect model module installed (e.g., iPhone 14 Pro module in a 14 Pro Max). This is the #1 post-repair complaint — always test OIS function before returning the device to the customer.' },
  { q: 'Why is my iPhone camera not working after replacement?', a: 'Most common causes: 1) Flex cable not fully seated — remove and reconnect firmly until you feel/hear the click. 2) Torn flex cable from improper removal — inspect under magnification. 3) Wrong model module — even Pro vs Pro Max use different cameras. 4) Debris on the connector — clean with isopropyl alcohol. 5) iOS software issue — force restart after installation. 6) Motherboard connector damage — requires micro-soldering repair. Always test the camera immediately after connecting, before fully reassembling the device.' },
  { q: 'Does replacing the iPhone camera affect photo quality?', a: 'With OEM modules: no — photo quality is identical to original. With quality aftermarket modules: very close to OEM, but some users may notice slight differences in color temperature or low-light performance on Pro models. The biggest factor is autofocus calibration — a properly tested module with verified AF performance will produce the same results as the original. We test every module for AF speed, image clarity, and color accuracy before shipping.' },
  { q: 'Can you replace just the camera glass without the whole module?', a: 'Yes, but it requires precision work. You need to: remove the old cracked glass with heat (80-90°C), clean all adhesive residue, and attach the new glass with optical-grade adhesive. The glass must be perfectly aligned or the camera image will be distorted. For repair shops, this is a high-margin service — replacement glass costs $3-$5 wholesale, and shops charge $30-$50 for the repair. We supply individual camera glass covers for iPhone 11 through 16 series.' },
  { q: 'What is the difference between OEM and aftermarket camera modules?', a: 'OEM modules are genuine Apple parts pulled from donor devices — identical sensor, autofocus motor, and OIS system. They guarantee the same photo quality as the original. Aftermarket modules are newly manufactured with equivalent specifications — 20-40% cheaper but may have slight differences in AF speed or low-light noise. For Pro/Pro Max models with advanced camera systems (48MP sensor, 5x telephoto), we strongly recommend OEM. For standard models (iPhone 13, 14, 15 base), quality aftermarket modules perform very close to original.' },
  { q: 'Are iPhone camera modules compatible across different models?', a: 'No — camera modules are strictly model-specific. Even models within the same generation are NOT interchangeable: iPhone 15 Pro and 15 Pro Max use completely different camera modules (different telephoto lens specs). iPhone 14 and 14 Plus share the same module, but 14 Pro and 14 Pro Max do not. Always verify the exact model number before ordering. Our product listings clearly specify compatible models to prevent ordering errors.' },
];

/* ─── Price Summary ─── */
const PRICE_SUMMARY = [
  { series: 'iPhone 16 Series', range: '$45 – $65', models: '4 models', note: 'Pro: triple lens' },
  { series: 'iPhone 15 Series', range: '$40 – $55', models: '4 models', note: 'Pro: 5x telephoto' },
  { series: 'iPhone 14 Series', range: '$35 – $48', models: '4 models', note: 'Pro: 48MP sensor' },
  { series: 'iPhone 13 Series', range: '$32 – $42', models: '4 models', note: 'High repair demand' },
  { series: 'iPhone 12 Series', range: '$30 – $38', models: '4 models', note: 'Dual/triple lens' },
  { series: 'iPhone 11 Series', range: '$29 – $35', models: '3 models', note: 'Budget-friendly' },
];

export default function iPhoneRearCameraWholesalePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-blue-300 mb-6">
              <a href="/products" className="hover:text-white transition-colors">Products</a>
              <span>/</span>
              <a href="/products/small-parts" className="hover:text-white transition-colors">Small Parts</a>
              <span>/</span>
              <span className="text-white">iPhone Rear Cameras</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              iPhone Camera Lens Replacement{' '}
              <span className="text-orange-400">Wholesale — From $29</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              OEM rear camera modules for iPhone 11–16 series — autofocus tested, OIS verified,
              flex cable checked. 24 models in stock, factory-direct from Shenzhen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <CameraQuoteButton label="Get Wholesale Quote" variant="primary" eventLabel="Hero CTA" />
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 24 Camera Models</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> AF + OIS Tested</span>
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
              { value: '24', label: 'Camera Models' },
              { value: '$29', label: 'Starting Price' },
              { value: '<0.5%', label: 'Defect Rate' },
              { value: 'MOQ 20', label: 'Per Model' },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">iPhone Rear Camera Module Catalog</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            OEM quality camera modules for 24 iPhone models — every unit tested for autofocus, OIS, and image quality.
          </p>

          {/* ── iPhone 16 Series ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 16 Series Camera Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_16_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {IPHONE_16_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          {/* ── iPhone 15 Series ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 15 Camera Lens Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_15_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {IPHONE_15_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          {/* ── iPhone 14 Series ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 14 Camera Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_14_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {IPHONE_14_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          {/* ── iPhone 13 Series ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 13 Camera Lens Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_13_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {IPHONE_13_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          {/* ── iPhone 12 Series ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 12 Camera Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_12_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {IPHONE_12_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          {/* ── iPhone 11 Series ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-xl font-bold text-gray-900">iPhone 11 Camera Replacement</h3>
              <span className="text-xs text-gray-400 ml-auto">{IPHONE_11_CAMERAS.length} models</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {IPHONE_11_CAMERAS.map((c) => <CameraCard key={c.model} {...c} />)}
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">Need front cameras or older models? We source those too.</p>
            <CameraQuoteButton label="Request Custom Quote" variant="secondary" eventLabel="Catalog Bottom CTA" />
          </div>
        </div>
      </section>

      {/* ═══ 4. PRICE OVERVIEW ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">iPhone Camera Replacement Cost</h2>
          <p className="text-gray-600 text-center mb-10">
            Wholesale pricing by iPhone series — all OEM quality, autofocus &amp; OIS tested.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="text-left px-6 py-3 font-semibold">Series</th>
                    <th className="text-left px-6 py-3 font-semibold">Price Range</th>
                    <th className="text-left px-6 py-3 font-semibold">Models</th>
                    <th className="text-left px-6 py-3 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PRICE_SUMMARY.map((r) => (
                    <tr key={r.series} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{r.series}</td>
                      <td className="px-6 py-3 text-orange-500 font-bold">{r.range}</td>
                      <td className="px-6 py-3 text-gray-600">{r.models}</td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{r.note}</td>
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
          <p className="text-gray-600 text-center mb-10">Volume discounts per camera model. Mix models in one shipment.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { qty: '20–49 pcs', discount: 'Base Price', note: 'MOQ per model', highlight: false },
              { qty: '50–99 pcs', discount: '8% Off', note: 'Repair shop tier', highlight: false },
              { qty: '100–499 pcs', discount: '12% Off', note: 'Multi-location', highlight: true },
              { qty: '500+ pcs', discount: 'Custom Quote', note: 'Distributor pricing', highlight: false },
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

      {/* ═══ 6. QUALITY & TESTING ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Quality Testing Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <Shield className="w-8 h-8 text-[#1e3a5f] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Multi-Point Testing</h3>
              <ul className="space-y-2">
                {['Autofocus speed & accuracy', 'Optical image stabilization', 'Image clarity & color accuracy', 'Macro mode (where applicable)'].map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <Zap className="w-8 h-8 text-[#1e3a5f] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Flex Cable Verified</h3>
              <ul className="space-y-2">
                {['Signal continuity test', 'Connector pin inspection', 'Bend & stress test', 'ESD protection verified'].map((c) => (
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
                {['Anti-static packaging', 'DHL / FedEx / UPS express', '3–7 days worldwide', '12-month warranty'].map((c) => (
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
        <CameraQuoteButton label="Get Quote" variant="float" eventLabel="Floating CTA" />
      </div>

      {/* ═══ 9. FOOTER CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need iPhone Camera Modules in Bulk?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get wholesale pricing on OEM iPhone rear camera modules. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CameraQuoteButton label="Get Wholesale Quote" variant="footer" eventLabel="Footer CTA" />
            <CameraQuoteButton
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
