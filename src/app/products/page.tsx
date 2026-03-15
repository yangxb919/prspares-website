import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Mobile Repair Parts — Phone Parts Supplier | PRSPARES',
  description: 'Browse wholesale phone repair parts: OEM screens, batteries, cameras, small parts & repair tools. Factory-direct from Shenzhen. Flexible MOQ, global shipping, 12-month warranty.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Wholesale Mobile Repair Parts — Phone Parts Supplier | PRSPARES',
    description: 'Browse wholesale phone repair parts: OEM screens, batteries, cameras, small parts & repair tools. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Mobile Repair Parts — Phone Parts Supplier | PRSPARES',
    description: 'Browse wholesale phone repair parts: OEM screens, batteries, cameras, small parts & repair tools. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

const CATEGORIES = [
  {
    name: 'LCD & OLED Screens',
    href: '/products/screens',
    image: '/images/screens-hero.jpg',
    description: 'iPhone, Samsung, and Android display replacements. OLED, LCD, True Tone supported.',
    items: ['iPhone OLED/LCD', 'Samsung AMOLED', 'Huawei/Xiaomi/OPPO Displays'],
  },
  {
    name: 'Batteries',
    href: '/products/batteries',
    image: '/images/batteries-hero.jpg',
    description: 'High-capacity replacement batteries with safety certifications for all major brands.',
    items: ['OEM Capacity', 'High-Capacity Options', 'CE/UN38.3 Certified'],
  },
  {
    name: 'Small Parts',
    href: '/products/small-parts',
    image: '/images/small-parts-hero.jpg',
    description: 'Cameras, charging ports, speakers, flex cables, and internal components.',
    items: ['Rear Camera Modules', 'Charging Ports', 'Speakers & Flex Cables'],
  },
  {
    name: 'Repair Tools',
    href: '/products/repair-tools',
    image: '/images/repair-tools-hero.jpg',
    description: 'Professional repair equipment, programmers, and tool kits for repair shops.',
    items: ['Screwdriver Kits', 'True Tone Programmers', 'Testing Equipment'],
  },
];

const BRANDS = [
  'Apple iPhone', 'Samsung Galaxy', 'Huawei', 'Xiaomi', 'OPPO', 'Vivo',
  'OnePlus', 'Google Pixel', 'Motorola', 'iPad', 'Realme', 'Honor',
];

const FAQ_ITEMS = [
  { q: "What's your minimum order quantity?", a: 'Our MOQ is flexible — starting from 10 units for screens and 20 units for batteries and small parts. We serve businesses of all sizes — from small repair shops to large distributors.' },
  { q: 'What quality grades do you offer?', a: 'We offer multiple grades: OEM Original, Premium Aftermarket, and Standard. Each batch undergoes TQC quality inspection before shipping.' },
  { q: 'Do you support True Tone for iPhone screens?', a: 'Yes, our iPhone screens support True Tone functionality. We also supply True Tone programmers for repair shops.' },
  { q: 'What are your shipping options?', a: 'We ship worldwide via DHL, FedEx, and UPS. Same-day dispatch for orders placed before 3PM CST. Delivery in 3-7 business days.' },
  { q: 'What is your warranty policy?', a: '12-month warranty on all products. Our RMA rate is below 1%. Defective items are replaced free of charge. Sample orders available before bulk purchase.' },
  { q: 'Can I get samples before ordering in bulk?', a: 'Yes, we offer sample orders for quality testing. Contact us for sample pricing and shipping details.' },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Wholesale Mobile Repair Parts{' '}
              <span className="text-orange-400">from Shenzhen Factory</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              OEM-quality screens, batteries, and components for repair shops, wholesalers, and distributors.
              500+ SKUs in stock. Same-day shipping. 12-month warranty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </Link>
              <a
                href="https://wa.me/8618588999234?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all"
              >
                WhatsApp Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section id="categories" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Product Categories</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Complete mobile phone repair parts covering all major brands and models.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={cat.href} className="group block">
                <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-1">{cat.name}</h3>
                      <p className="text-white/80 text-sm">{cat.description}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <ul className="space-y-2">
                      {cat.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center text-[#1e3a5f] font-semibold text-sm group-hover:text-orange-500 transition-colors">
                      View Products <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SUPPORTED BRANDS ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Supported Brands & Models</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We carry parts for all major smartphone brands — from the latest flagship models to popular older devices.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {BRANDS.map(brand => (
              <span key={brand} className="bg-white px-5 py-3 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUALITY & SOURCING ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality & Sourcing Capability</h2>
              <ul className="space-y-4">
                {[
                  'TQC quality control — every batch inspected before shipping',
                  'OEM-grade components with CE/RoHS certification',
                  'True Tone support for all compatible iPhone models',
                  'Located in Huaqiangbei — direct access to 10,000+ vendors',
                  '500+ SKUs in stock with 95%+ availability',
                  'Dedicated QA team with 10+ years industry experience',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl overflow-hidden h-72 md:h-80">
              <Image src="/images/oem-quality-iphone-screen-wholesale-collection.jpg" alt="PRSPARES quality inspection" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHO WE SERVE ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Who We Serve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Repair Shops', desc: 'Small to mid-size shops needing reliable parts, flexible MOQ, and fast turnaround.' },
              { title: 'Wholesalers & Distributors', desc: 'Regional distributors looking for consistent supply and competitive bulk pricing.' },
              { title: 'Sourcing Managers', desc: 'Procurement professionals seeking factory-direct suppliers with quality certifications.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOQ / SHIPPING / WARRANTY ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">MOQ, Shipping & Warranty</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Flexible MOQ', items: ['From 10 units for screens', 'From 20 units for batteries & small parts', 'Sample orders available', 'Mixed models and categories supported'] },
              { title: 'Global Shipping', items: ['Same-day dispatch for in-stock items', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery', 'Full shipment insurance'] },
              { title: '12-Month Warranty', items: ['All products warranted', 'RMA rate below 1%', 'Free replacement for defects', 'Dedicated after-sales support'] },
            ].map((block, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{block.title}</h3>
                <ul className="space-y-3">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
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

      {/* ═══ FAQ ═══ */}
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

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get factory-direct pricing on OEM-quality phone repair parts. Free quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wholesale-inquiry"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Get Wholesale Quote
            </Link>
            <a
              href="https://wa.me/8618588999234?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
            >
              WhatsApp Sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
