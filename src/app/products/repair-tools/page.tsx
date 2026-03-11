import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MessageSquare, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Phone Repair Tools — Programmers, Testing & Soldering Equipment | PRSPARES',
  description:
    'B2B wholesale phone repair tools supplier. True Tone programmers, motherboard soldering stations, battery spot welders, LCD testing equipment. Factory-direct from Shenzhen.',
  alternates: {
    canonical: '/products/repair-tools',
  },
  openGraph: {
    title: 'Wholesale Phone Repair Tools — Programmers, Testing & Soldering Equipment | PRSPARES',
    description:
      'B2B wholesale repair tools: programmers, soldering stations, testing equipment. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products/repair-tools',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Repair Tools — Programmers, Testing & Soldering Equipment | PRSPARES',
    description:
      'B2B wholesale repair tools: programmers, soldering stations, testing equipment. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

const PRODUCT_TYPES = [
  { name: 'Screen Programmers', desc: 'True Tone, Face ID, and battery health data transfer programmers. Compatible with latest iPhone models.' },
  { name: 'LCD/OLED Testers', desc: 'Multi-function screen testing machines for iPhone and Android. Test touch, display, and 3D Touch before installation.' },
  { name: 'Soldering & Rework', desc: 'Hot air stations, soldering irons, preheaters, and BGA rework stations for motherboard-level repair.' },
  { name: 'Basic Repair Tool Kits', desc: 'Screwdriver sets, spudgers, suction cups, opening tools, and ESD-safe tweezers for daily repair operations.' },
  { name: 'Battery Spot Welders', desc: 'Precision spot welding machines for battery tab connections. Essential for battery pack assembly and replacement.' },
  { name: 'Laser & Separator Machines', desc: 'Back glass removal lasers, LCD separator machines, and laminating equipment for screen refurbishment.' },
];

const TOOL_CATEGORIES = [
  { title: 'Programmers & Testers', items: ['True Tone programmers (JC, i2C, JCID)', 'Face ID / dot projector programmers', 'Battery health data transfer tools', 'LCD / OLED multi-function testers', 'Motherboard diagnostic tools'] },
  { title: 'Soldering & Rework', items: ['Hot air rework stations', 'Precision soldering irons', 'PCB preheaters', 'BGA reballing kits', 'Microscopes & magnifiers'] },
  { title: 'Workshop Equipment', items: ['Laser back glass removers', 'LCD separator machines', 'OCA laminating machines', 'Battery spot welders', 'Ultrasonic cleaners'] },
];

const BUYERS = [
  { title: 'Repair Shops', desc: 'Essential tools for daily device repair. From basic tool kits to advanced programmers — everything to run an efficient repair operation.' },
  { title: 'Training Centers', desc: 'Complete equipment packages for repair training facilities. Bulk pricing on tool kits and practice equipment.' },
  { title: 'Refurbishment Factories', desc: 'Production-grade equipment for high-volume refurbishment. Laser machines, laminators, and automated testing stations.' },
];

const FAQ_ITEMS = [
  { q: 'Which True Tone programmer do you recommend?', a: 'For most repair shops, we recommend the JC V1SE or i2C i6S programmer. Both support the latest iPhone models and offer reliable data transfer for True Tone, battery health, and Face ID calibration.' },
  { q: 'Do you provide training or documentation with tools?', a: 'Yes. All programmers and testing equipment come with English user manuals and video tutorials. For complex equipment like laser machines, we provide remote setup assistance.' },
  { q: 'What is the warranty on repair tools?', a: 'Most repair tools carry a 12-month warranty. Consumable items (soldering tips, separator wires) are excluded. We stock replacement parts for all tools we sell.' },
  { q: 'Can I order sample tools before committing to bulk?', a: 'Absolutely. We offer single-unit sample orders for most tools so you can evaluate quality and functionality before placing a larger order.' },
  { q: 'Do you ship tools internationally?', a: 'Yes. Tools ship via standard express carriers (DHL, FedEx, UPS) with no DG restrictions. Typical delivery is 3-7 business days worldwide.' },
];

const GUIDES = [
  { title: 'True Tone Programmer Comparison', desc: 'JC vs i2C vs JCID — which programmer is right for your repair shop?', href: '/blog/true-tone-programmer-comparison' },
  { title: 'Setting Up a Repair Workshop', desc: 'Essential tools and equipment checklist for starting a phone repair business.', href: '/blog/repair-workshop-setup-guide' },
  { title: 'Motherboard Repair Tools Guide', desc: 'Advanced soldering and rework equipment for board-level phone repair.', href: '/blog/motherboard-repair-tools-guide' },
];

export default function RepairToolsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ═══ 1. HERO ═══ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Professional Repair Tools{' '}
              <span className="text-orange-400">for Every Workshop</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Programmers, testing equipment, soldering stations, and essential tools
              for phone, tablet, and laptop repair professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </Link>
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all">
                Browse Tools <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 200+ Tool SKUs</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Latest Model Support</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 12-Month Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHAT WE SUPPLY ═══ */}
      <section id="products" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Supply</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Complete repair tool ecosystem — from basic hand tools to advanced programming and testing equipment.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_TYPES.map((item) => (
              <div key={item.name} className="rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <Cpu className="w-8 h-8 text-[#1e3a5f] mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. TOOL CATEGORIES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Full Tool Catalog</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Products for the full repair process — from diagnostics to assembly.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {TOOL_CATEGORIES.map((cat) => (
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

      {/* ═══ 4. BUYER TYPES ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Who Buys Our Tools</h2>
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

      {/* ═══ 5. MOQ / SHIPPING / WARRANTY ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">MOQ, Shipping &amp; Warranty</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Flexible MOQ', items: ['Single-unit samples available', 'Bulk pricing from 5+ units', 'Mix tools with parts orders', 'No minimum order value'] },
              { title: 'Global Shipping', items: ['Same-day dispatch before 3PM CST', 'DHL / FedEx / UPS express', '3-7 days worldwide delivery', 'No DG restrictions on tools'] },
              { title: '12-Month Warranty', items: ['All tools and equipment warranted', 'Free firmware updates for programmers', 'Replacement parts stocked', 'Remote technical support'] },
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

      {/* ═══ 6. FAQ ═══ */}
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

      {/* ═══ 7. RELATED GUIDES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Related Guides</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {GUIDES.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group block rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 bg-white">
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

      {/* ═══ 8. CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Equip Your Workshop?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get wholesale pricing on professional repair tools and equipment. Free quote within 24 hours.
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
