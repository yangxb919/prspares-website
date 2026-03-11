import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MapPin, Users, ShieldCheck, Package, Globe, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About PRSPARES — Shenzhen Wholesale Phone Parts Supplier | Huaqiangbei',
  description: 'PRSPARES is a B2B wholesale phone repair parts supplier based in Shenzhen Huaqiangbei. 10+ years experience, 3-tier QC, OEM/aftermarket screens, batteries & small parts for global repair businesses.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About PRSPARES — Shenzhen Wholesale Phone Parts Supplier',
    description: 'B2B wholesale phone repair parts from Shenzhen Huaqiangbei. 10+ years, 3-tier QC, global shipping.',
    type: 'website',
    url: '/about',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PRSPARES — Shenzhen Wholesale Phone Parts Supplier',
    description: 'B2B wholesale phone repair parts from Shenzhen Huaqiangbei. 10+ years, 3-tier QC, global shipping.',
  },
};

const STATS = [
  { value: '10+', label: 'Years in Business', sub: 'Since 2015 in Huaqiangbei' },
  { value: '50+', label: 'Countries Served', sub: 'Worldwide B2B shipping' },
  { value: '5,000+', label: 'SKUs Available', sub: 'Screens, batteries, parts, tools' },
  { value: '98%', label: 'Order Accuracy', sub: '3-tier quality control' },
];

const CAPABILITIES = [
  {
    icon: MapPin,
    title: 'Shenzhen Huaqiangbei Base',
    desc: 'Located in the world\'s largest electronics marketplace. Direct access to 200+ verified component factories and first-tier suppliers.',
  },
  {
    icon: ShieldCheck,
    title: '3-Tier Quality Control',
    desc: 'Every batch goes through incoming inspection, functional testing, and pre-shipment QC. Defect rate consistently below 1%.',
  },
  {
    icon: Package,
    title: 'Full Product Range',
    desc: 'OEM Original, Premium Aftermarket, and Standard Aftermarket grades. Screens, batteries, small parts, and repair tools — all from one supplier.',
  },
  {
    icon: Globe,
    title: 'Global B2B Logistics',
    desc: 'DHL, FedEx, UPS, and sea freight. DG-compliant battery shipping. Typical delivery 3-7 business days worldwide.',
  },
  {
    icon: Users,
    title: 'Dedicated Account Team',
    desc: 'Each wholesale client gets a dedicated account manager. WeChat, WhatsApp, and email support in English, Chinese, and Spanish.',
  },
  {
    icon: Headphones,
    title: '12-Month Warranty',
    desc: 'Industry-leading warranty on all products. Fast replacement for any quality issues — no complicated claims process.',
  },
];

const BUYERS = [
  'Independent repair shops',
  'Multi-location repair chains',
  'Refurbishment & resale companies',
  'Telecom operators & carriers',
  'IT asset management firms',
  'Repair training academies',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative w-full h-[400px] md:h-[480px]">
        <Image
          src="/prspares-about-us-banner-mobile-repair-parts-supplier-professional.jpg"
          alt="PRSPARES warehouse and quality control team in Shenzhen Huaqiangbei"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 to-[#0f2440]/70 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-orange-400 font-semibold mb-3 text-sm tracking-wider uppercase">
                Shenzhen · Huaqiangbei · Since 2015
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Your Wholesale Partner for Phone Repair Parts
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                PRSPARES supplies OEM and aftermarket phone repair parts to repair businesses in 50+ countries — direct from the heart of Shenzhen&apos;s electronics supply chain.
              </p>
              <Link
                href="/wholesale-inquiry"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Get Wholesale Quote
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#1e3a5f] mb-1">{s.value}</div>
                <div className="font-semibold text-gray-900 mb-1">{s.label}</div>
                <div className="text-sm text-gray-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Built in Huaqiangbei, Serving the World
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                PRSPARES was founded in 2015 in Shenzhen&apos;s Huaqiangbei district — the world&apos;s largest electronics marketplace. What started as a local parts supplier has grown into a trusted B2B wholesale partner for repair businesses across 50+ countries.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our location gives us unmatched access to first-tier component factories, enabling us to offer competitive pricing, fast sourcing, and consistent quality across our full product range: screens, batteries, small parts, and professional repair tools.
              </p>
              <div className="space-y-3">
                {BUYERS.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/prspares-company-team-workspace-mobile-parts-quality-control-professional.jpg"
                alt="PRSPARES team performing quality control on phone repair parts"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Repair Businesses Choose PRSPARES</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From sourcing to shipping, we handle every step of the wholesale supply chain so you can focus on your repair business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="bg-gray-50 rounded-2xl p-8 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{c.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner With Us?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Tell us what you need — our team will respond within 24 hours with pricing, MOQ, and shipping options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wholesale-inquiry"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              Get Wholesale Quote
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl border border-white/20 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
