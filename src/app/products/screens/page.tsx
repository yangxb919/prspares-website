import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MessageSquare, Monitor } from 'lucide-react';
import { TrackedLink } from '@/components/TrackedLink';

export const metadata: Metadata = {
  title: 'Wholesale Phone Screens — LCD & OLED Display Supplier | PRSPARES',
  description:
    'B2B wholesale phone screen replacement supplier. OEM & aftermarket LCD/OLED displays for iPhone, Samsung, Huawei, Xiaomi. Factory-direct from Shenzhen with flexible MOQ and 12-month warranty.',
  alternates: {
    canonical: '/products/screens',
  },
  openGraph: {
    title: 'Wholesale Phone Screens — LCD & OLED Display Supplier | PRSPARES',
    description:
      'B2B wholesale phone screen replacement: OEM & aftermarket LCD/OLED displays. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products/screens',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Screens — LCD & OLED Display Supplier | PRSPARES',
    description:
      'B2B wholesale phone screen replacement: OEM & aftermarket LCD/OLED displays. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

const PRODUCT_TYPES = [
  { name: 'iPhone OLED/LCD', desc: 'Full range from iPhone 6 to iPhone 16 series. Supports True Tone with programmer.', query: 'iPhone+Screens' },
  { name: 'Samsung AMOLED', desc: 'Galaxy S, A, Note, and Z Fold/Flip series. Original and aftermarket options.', query: 'Samsung+Screens' },
  { name: 'Huawei/Xiaomi/OPPO Displays', desc: 'P, Mate, Nova, Mi, Redmi, POCO, Reno, and Find series screens.', query: 'Android+Screens' },
  { name: 'iPad Screens', desc: 'iPad, iPad Air, iPad Pro, and iPad Mini LCD and digitizer assemblies.', query: 'iPad+Screens' },
];

const BRANDS = [
  { name: 'Apple iPhone', models: '6 / 7 / 8 / X / 11 / 12 / 13 / 14 / 15 / 16 series' },
  { name: 'Samsung Galaxy', models: 'S / A / Note / Z Fold & Flip series' },
  { name: 'Huawei', models: 'P / Mate / Nova series' },
  { name: 'Xiaomi', models: 'Mi / Redmi / POCO series' },
  { name: 'OPPO / Vivo / OnePlus', models: 'Reno, Find, V, iQOO, Nord series' },
  { name: 'Google Pixel', models: 'Pixel 4–9 series' },
  { name: 'iPad', models: 'iPad / Air / Pro / Mini' },
];

const GRADES = [
  { title: 'OEM Original', desc: 'Pulled from original devices. Highest color accuracy, touch sensitivity, and durability. Ideal for premium repairs.', badge: 'Highest Quality' },
  { title: 'Premium Aftermarket', desc: 'Best aftermarket grade with True Tone support. Near-OEM display quality at a competitive price point.', badge: 'Best Value' },
  { title: 'Standard Aftermarket', desc: 'Budget-friendly option for cost-conscious repairs. Reliable performance with solid color reproduction.', badge: 'Budget Friendly' },
];

const BUYERS = [
  { title: 'Repair Shops', desc: 'Need reliable screens with consistent quality. Flexible MOQ from 10 units, fast restocking, and mixed-model orders.' },
  { title: 'Wholesalers & Distributors', desc: 'Consistent supply chain with competitive bulk pricing. Volume discounts and dedicated account management.' },
  { title: 'Refurbishment Centers', desc: 'High-volume orders with mixed quality grades. Custom packaging and labeling options available.' },
];

const FAQ_ITEMS = [
  { q: 'Do your screens support True Tone?', a: 'Yes. Our Premium Aftermarket and OEM Original iPhone screens support True Tone when paired with a True Tone programmer. We also supply the programmers separately.' },
  { q: "What's the difference between OEM and aftermarket screens?", a: 'OEM screens are pulled from original devices and offer the highest quality. Premium Aftermarket screens are newly manufactured to near-OEM specs. Standard Aftermarket screens are budget-friendly with reliable performance.' },
  { q: 'What is the MOQ for screens?', a: 'Our MOQ for screens starts from just 10 units. You can mix across different models and quality grades within a single order.' },
  { q: 'Do you support mixed orders?', a: 'Absolutely. You can combine different screen models, brands, and quality grades in one order. We also allow mixing screens with other product categories.' },
  { q: 'How are screens packaged?', a: 'Each screen is individually packed in anti-static bags with foam protection inserts. Bulk orders are secured in reinforced cartons to prevent transit damage.' },
];

const GUIDES = [
  { title: 'iPhone Screen Quality Guide', desc: 'How to evaluate LCD & OLED quality grades for iPhone repairs.', href: '/blog/iphone-screen-quality-guide' },
  { title: 'OEM vs Aftermarket Screens', desc: 'A detailed comparison to help you choose the right grade for your business.', href: '/blog/oem-vs-aftermarket-screens' },
  { title: 'True Tone Programming Guide', desc: 'Step-by-step guide to transferring True Tone data on replacement screens.', href: '/blog/true-tone-programming-guide' },
];

export default function ScreensPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Wholesale LCD &amp; OLED Screens{' '}
              <span className="text-orange-400">from Shenzhen Factory</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              OEM-quality display replacements for iPhone, Samsung, and Android devices.
              Trusted by repair shops and distributors in 50+ countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <TrackedLink href="/wholesale-inquiry" event="quote_cta_click" params={{ event_label: 'Screens Hero CTA' }} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </TrackedLink>
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 500+ SKUs</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> True Tone Support</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> &lt;1% RMA Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHAT WE SUPPLY ═══ */}
      <section id="products" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Supply</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Complete range of LCD and OLED display assemblies for all major smartphone and tablet brands.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_TYPES.map((item) => (
              <Link key={item.name} href={`/wholesale-inquiry?product=${item.query}`} className="group rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <Monitor className="w-8 h-8 text-[#1e3a5f] mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:text-orange-600">
                  Get Quote <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. COMPATIBLE BRANDS & MODELS ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Compatible Brands &amp; Models</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We stock screens for the latest flagships and popular older models across all major brands.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {BRANDS.map((brand) => (
              <Link key={brand.name} href={`/wholesale-inquiry?product=${encodeURIComponent(brand.name + ' Screens')}`} className="group bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{brand.name}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-gray-500 text-sm mt-1">{brand.models}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. QUALITY GRADES ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Quality Grades</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Three quality tiers to match every budget and business requirement.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {GRADES.map((grade) => (
              <Link key={grade.title} href={`/wholesale-inquiry?product=${encodeURIComponent(grade.title + ' Screens')}`} className="group rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{grade.title}</h3>
                  <span className="text-xs bg-orange-500 px-2.5 py-1 rounded-full font-medium">{grade.badge}</span>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{grade.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:text-orange-600">
                    Request {grade.title} Pricing <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. BUYER TYPES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Who Buys Our Screens</h2>
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
              { title: 'Flexible MOQ', items: ['Starting from 10 units for screens', 'Mix across models & grades', 'Sample orders available', 'No minimum order value'] },
              { title: 'Global Shipping', items: ['Same-day dispatch for in-stock items', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery', 'Full shipment insurance'] },
              { title: '12-Month Warranty', items: ['All screens warranted', 'RMA rate below 1%', 'Free replacement for defects', 'Dedicated after-sales support'] },
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

      {/* ═══ FLOATING QUOTE BUTTON ═══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <Link
          href="/wholesale-inquiry?product=Screens"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          Get Quote
        </Link>
      </div>

      {/* ═══ 9. CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Source Premium Screens?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get factory-direct pricing on OEM and aftermarket display replacements. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackedLink
              href="/wholesale-inquiry"
              event="quote_cta_click"
              params={{ event_label: 'Screens Footer CTA' }}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Get Wholesale Quote
            </TrackedLink>
            <TrackedLink
              href="https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20screens"
              event="whatsapp_click"
              params={{ event_label: 'Screens Footer WhatsApp' }}
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
