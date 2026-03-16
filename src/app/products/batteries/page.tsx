import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MessageSquare, BatteryFull } from 'lucide-react';
import { TrackedLink } from '@/components/TrackedLink';

export const metadata: Metadata = {
  title: 'Wholesale Phone Batteries — Replacement Battery Supplier | PRSPARES',
  description:
    'B2B wholesale phone battery supplier. High-capacity replacement batteries for iPhone, Samsung, Huawei, Xiaomi, iPad & MacBook. Factory-direct from Shenzhen with 12-month warranty.',
  alternates: {
    canonical: '/products/batteries',
  },
  openGraph: {
    title: 'Wholesale Phone Batteries — Replacement Battery Supplier | PRSPARES',
    description:
      'B2B wholesale replacement batteries for iPhone, Samsung, Android devices. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products/batteries',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Batteries — Replacement Battery Supplier | PRSPARES',
    description:
      'B2B wholesale replacement batteries for iPhone, Samsung, Android devices. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

const PRODUCT_TYPES = [
  { name: 'iPhone Batteries', desc: 'Full range from iPhone 6 to iPhone 16 series. TI / ATL cells with original-capacity specs.' },
  { name: 'Samsung Batteries', desc: 'Galaxy S, A, Note, and Z series. High-capacity cells with built-in protection circuits.' },
  { name: 'Android Batteries', desc: 'Huawei, Xiaomi, OPPO, Vivo, OnePlus, Google Pixel — all popular models in stock.' },
  { name: 'Tablet & Laptop Batteries', desc: 'iPad, Samsung Tab, MacBook replacement batteries with cycle-count guarantees.' },
];

const BRANDS = [
  { name: 'Apple iPhone', models: '6 / 7 / 8 / X / 11 / 12 / 13 / 14 / 15 / 16 series' },
  { name: 'Samsung Galaxy', models: 'S / A / Note / Z Fold & Flip series' },
  { name: 'Huawei', models: 'P / Mate / Nova series' },
  { name: 'Xiaomi', models: 'Mi / Redmi / POCO series' },
  { name: 'OPPO / Vivo / OnePlus', models: 'Reno, Find, V, iQOO, Nord series' },
  { name: 'iPad & MacBook', models: 'iPad Air / Pro / Mini, MacBook Air / Pro' },
];

const GRADES = [
  { title: 'OEM Original', desc: 'Genuine pulled batteries from original devices. Highest cycle performance and safety certification. Ideal for premium service centers.', badge: 'Highest Quality' },
  { title: 'High-Capacity', desc: 'Aftermarket batteries with 10-20% extra capacity over original specs. TI/ATL cells with full safety protection.', badge: 'Best Value' },
  { title: 'Standard Replacement', desc: 'Budget-friendly option matching original capacity specs. Reliable performance with built-in protection circuits.', badge: 'Budget Friendly' },
];

const BUYERS = [
  { title: 'Repair Shops', desc: 'Need reliable batteries with consistent quality. Flexible MOQ from 20 units, fast restocking, and mixed-model orders.' },
  { title: 'Wholesalers & Distributors', desc: 'Consistent supply chain with competitive bulk pricing. Volume discounts and private labeling options available.' },
  { title: 'Refurbishment Centers', desc: 'High-volume battery replacement programs. Mixed-grade orders and custom packaging for refurbished device lines.' },
];

const FAQ_ITEMS = [
  { q: 'What battery cells do you use?', a: 'We use TI (Texas Instruments) and ATL cells for iPhone batteries, and high-quality lithium polymer cells from certified manufacturers for Samsung and Android models. All batteries include built-in protection circuits.' },
  { q: 'Do your batteries show health percentage on iPhone?', a: 'Yes. Our iPhone batteries support the battery health feature in iOS Settings. However, Apple may show a "non-genuine" notice on iOS 15.2+ — this does not affect performance or safety.' },
  { q: 'What is the MOQ for batteries?', a: 'Our MOQ for batteries starts from 20 units. You can mix across different models and brands within a single order.' },
  { q: 'Are your batteries safety-certified?', a: 'Yes. All batteries comply with UN38.3, UL, CE, and FCC safety standards. Each battery undergoes individual charge/discharge cycle testing before shipment.' },
  { q: 'How are batteries shipped internationally?', a: 'Batteries are classified as DG (Dangerous Goods) for air freight. We handle all DG documentation and packaging requirements. Shipping is available via DHL, FedEx, and sea freight for bulk orders.' },
];

const GUIDES = [
  { title: 'iPhone Battery Replacement Guide', desc: 'How to choose the right replacement battery for iPhone repair services.', href: '/blog/iphone-battery-replacement-guide' },
  { title: 'Battery Safety & Certification', desc: 'Understanding UN38.3, UL, and other safety certifications for replacement batteries.', href: '/blog/battery-safety-certification-guide' },
  { title: 'High-Capacity vs OEM Batteries', desc: 'Comparing battery grades to help you select the best option for your customers.', href: '/blog/high-capacity-vs-oem-batteries' },
];

export default function BatteriesPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Wholesale Replacement Batteries{' '}
              <span className="text-orange-400">from Certified Factory</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              High-capacity replacement batteries for iPhone, Samsung, and Android devices.
              TI / ATL cells, safety-certified, trusted by repair shops worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <TrackedLink href="/wholesale-inquiry" event="quote_cta_click" params={{ event_label: 'Batteries Hero CTA' }} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </TrackedLink>
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 300+ SKUs</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Safety Certified</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> DG Shipping Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHAT WE SUPPLY ═══ */}
      <section id="products" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Supply</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Complete range of replacement batteries for smartphones, tablets, and laptops from all major brands.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_TYPES.map((item) => (
              <div key={item.name} className="rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <BatteryFull className="w-8 h-8 text-[#1e3a5f] mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. COMPATIBLE BRANDS & MODELS ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Compatible Brands &amp; Models</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We stock batteries for the latest flagships and popular older models across all major brands.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-100">
                <span className="font-semibold text-gray-900">{brand.name}</span>
                <p className="text-gray-500 text-sm mt-1">{brand.models}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. QUALITY GRADES ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Quality Grades</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Three battery tiers to match every budget and business requirement.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {GRADES.map((grade) => (
              <div key={grade.title} className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{grade.title}</h3>
                  <span className="text-xs bg-orange-500 px-2.5 py-1 rounded-full font-medium">{grade.badge}</span>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed">{grade.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. BUYER TYPES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Who Buys Our Batteries</h2>
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
              { title: 'Flexible MOQ', items: ['Starting from 20 units for batteries', 'Mix across models & brands', 'Sample orders available', 'No minimum order value'] },
              { title: 'DG-Compliant Shipping', items: ['Full DG documentation handled', 'DHL / FedEx / sea freight options', '5-10 days worldwide delivery', 'UN38.3 compliant packaging'] },
              { title: '12-Month Warranty', items: ['All batteries warranted', 'Individual charge/discharge tested', 'Free replacement for defects', 'Dedicated after-sales support'] },
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
          <h2 className="text-3xl font-bold mb-4">Ready to Source Quality Batteries?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get factory-direct pricing on certified replacement batteries. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackedLink
              href="/wholesale-inquiry"
              event="quote_cta_click"
              params={{ event_label: 'Batteries Footer CTA' }}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Get Wholesale Quote
            </TrackedLink>
            <TrackedLink
              href="https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20batteries"
              event="whatsapp_click"
              params={{ event_label: 'Batteries Footer WhatsApp' }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
            >
              WhatsApp Sales
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
