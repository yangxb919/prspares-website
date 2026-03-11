import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MessageSquare, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Phone Small Parts — Camera, Flex Cable, Charging Port Supplier | PRSPARES',
  description:
    'B2B wholesale phone small parts supplier. Cameras, charging ports, speakers, buttons, flex cables, NFC modules for iPhone, Samsung, Android. Factory-direct from Shenzhen.',
  alternates: {
    canonical: '/products/small-parts',
  },
  openGraph: {
    title: 'Wholesale Phone Small Parts — Camera, Flex Cable, Charging Port Supplier | PRSPARES',
    description:
      'B2B wholesale small parts: cameras, charging ports, speakers, buttons, flex cables. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products/small-parts',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Small Parts — Camera, Flex Cable, Charging Port Supplier | PRSPARES',
    description:
      'B2B wholesale small parts: cameras, charging ports, speakers, buttons, flex cables. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

const PRODUCT_TYPES = [
  { name: 'Front & Rear Cameras', desc: 'Camera modules for all iPhone, Samsung, and Android models. OEM and aftermarket grades available.' },
  { name: 'Charging Ports & Flex', desc: 'Lightning, USB-C, and Micro USB charging assemblies with flex cables. Includes mic and antenna integration.' },
  { name: 'Speakers & Earpieces', desc: 'Loudspeakers and earpiece modules. Drop-in replacements with original sound quality.' },
  { name: 'Buttons & Flex Cables', desc: 'Power, volume, home buttons, and connecting flex cables. Touch ID and Face ID components.' },
  { name: 'NFC & Wireless Charging', desc: 'NFC antenna modules and wireless charging coils for iPhone 8+ and compatible Android devices.' },
  { name: 'Back Covers & Frames', desc: 'Glass back panels, mid-frames, and housing components. Multiple colors for popular models.' },
];

const BRANDS = [
  { name: 'Apple iPhone', models: '6 / 7 / 8 / X / 11 / 12 / 13 / 14 / 15 / 16 series' },
  { name: 'Samsung Galaxy', models: 'S / A / Note / Z Fold & Flip series' },
  { name: 'Huawei', models: 'P / Mate / Nova series' },
  { name: 'Xiaomi', models: 'Mi / Redmi / POCO series' },
  { name: 'OPPO / Vivo / OnePlus', models: 'Reno, Find, V, iQOO, Nord series' },
  { name: 'iPad & MacBook', models: 'Cameras, keyboards, trackpads, flex cables' },
  { name: 'Game Consoles', models: 'Nintendo Switch, PlayStation controller parts' },
  { name: 'Wearables', models: 'Apple Watch glass, bands, AirPods components' },
];

const PART_CATEGORIES = [
  { title: 'Phone Small Parts', items: ['Front cameras', 'Rear cameras', 'Charging ports', 'Earpieces & loudspeakers', 'Power / volume / home buttons', 'NFC modules', 'Wireless charging coils', 'Back covers & frames'] },
  { title: 'Tablet & Laptop Parts', items: ['iPad front glass & touch panels', 'iPad / Samsung Tab cameras', 'Tablet charging port flex cables', 'MacBook keyboards', 'MacBook trackpads', 'MacBook cameras & covers'] },
  { title: 'Accessories & Wearables', items: ['Apple Watch glass', 'Apple Watch bands', 'AirPods case components', 'Nintendo Switch Joy-Con parts', 'PlayStation controller parts', 'Smart wearable modules'] },
];

const BUYERS = [
  { title: 'Repair Shops', desc: 'One-stop sourcing for all small parts. Flexible MOQ, fast restocking, and mixed-category orders to keep your shop fully stocked.' },
  { title: 'Wholesalers & Distributors', desc: 'Full catalog access with volume pricing. Dedicated account support and priority stock allocation for repeat orders.' },
  { title: 'Refurbishment Centers', desc: 'Bulk small parts for device refurbishment lines. Custom kits and packaging options for high-volume operations.' },
];

const FAQ_ITEMS = [
  { q: 'What types of small parts do you supply?', a: 'We supply a comprehensive range: cameras (front & rear), charging ports, speakers, earpieces, buttons, flex cables, NFC modules, wireless charging coils, back covers, frames, and more — for phones, tablets, laptops, and wearables.' },
  { q: 'Can I mix small parts with screens and batteries in one order?', a: 'Absolutely. We encourage mixed-category orders. You can combine small parts with screens, batteries, and repair tools in a single shipment to save on shipping costs.' },
  { q: 'What is the MOQ for small parts?', a: 'MOQ varies by part type — typically starting from 20-50 units per SKU. Contact us for specific MOQ details on the parts you need.' },
  { q: 'Are your small parts tested before shipment?', a: 'Yes. Every part undergoes functional testing and visual inspection. Camera modules are tested for focus and image quality, charging ports for connectivity, speakers for audio output, etc.' },
  { q: 'Do you supply parts for older phone models?', a: 'Yes. We maintain stock for models dating back to iPhone 6 and Samsung Galaxy S7 series. For less common models, we can source parts on request with 3-5 days lead time.' },
];

const GUIDES = [
  { title: 'Phone Camera Module Guide', desc: 'How to identify and select the right camera replacement for iPhone and Android.', href: '/blog/phone-camera-module-guide' },
  { title: 'Charging Port Replacement Tips', desc: 'Common issues and solutions when replacing charging port assemblies.', href: '/blog/charging-port-replacement-tips' },
  { title: 'Back Cover Color Matching', desc: 'Guide to selecting the correct color and finish for back glass replacements.', href: '/blog/back-cover-color-matching-guide' },
];

export default function SmallPartsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Wholesale Phone Small Parts{' '}
              <span className="text-orange-400">One-Stop Sourcing</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Cameras, charging ports, speakers, buttons, flex cables and more.
              Complete small parts catalog for phone, tablet, and wearable repairs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </Link>
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 1000+ SKUs</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 100% Tested</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Mixed Orders OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHAT WE SUPPLY ═══ */}
      <section id="products" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Supply</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Complete range of phone small parts — from cameras and charging ports to back covers and frames.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_TYPES.map((item) => (
              <div key={item.name} className="rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <Wrench className="w-8 h-8 text-[#1e3a5f] mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. COMPATIBLE BRANDS & DEVICES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Compatible Brands &amp; Devices</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Small parts for phones, tablets, laptops, game consoles, and wearable devices.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-100">
                <span className="font-semibold text-gray-900">{brand.name}</span>
                <p className="text-gray-500 text-sm mt-1">{brand.models}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. AVAILABLE OPTIONS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Full Parts Catalog</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Source all your repair shop needs from one trusted supplier.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {PART_CATEGORIES.map((cat) => (
              <div key={cat.title} className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#1e3a5f] text-white px-6 py-4">
                  <h3 className="text-lg font-bold">{cat.title}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2.5">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. BUYER TYPES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Who Buys Our Small Parts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {BUYERS.map((buyer) => (
              <div key={buyer.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{buyer.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{buyer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. MOQ / SHIPPING / WARRANTY ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">MOQ, Shipping &amp; Warranty</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Flexible MOQ', items: ['20-50 units per SKU', 'Mix across categories freely', 'Sample orders available', 'Combine with screens & batteries'] },
              { title: 'Global Shipping', items: ['Same-day dispatch before 3PM CST', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery', 'Full shipment insurance'] },
              { title: '12-Month Warranty', items: ['All parts functionally tested', 'Free replacement for defects', 'Low RMA rate guarantee', 'Dedicated after-sales support'] },
            ].map((block) => (
              <div key={block.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
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
      <section className="py-16 md:py-20 bg-gray-50">
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

      {/* ═══ 8. RELATED GUIDES ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Related Guides</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {GUIDES.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group block rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a5f] transition-colors">{guide.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{guide.desc}</p>
                <span className="inline-flex items-center text-sm font-semibold text-orange-500">
                  Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Source Small Parts?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            One-stop wholesale sourcing for all your repair shop needs. Free quote within 24 hours.
          </p>
          <Link
            href="/wholesale-inquiry"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5" />
            Get Wholesale Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
