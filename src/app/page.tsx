'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Clock, Award, Users, Factory, Truck, Package, MessageSquare, Zap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

// Fade-in animation on scroll
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setVisible(true), delay); },
      { threshold: 0.1 }
    );
    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay]);

  return (
    <div ref={setRef} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-400 font-semibold text-sm uppercase tracking-wide mb-4">Shenzhen Huaqiangbei — 10+ Years Factory Direct</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Wholesale Phone Repair Parts{' '}
                <span className="text-orange-400">for B2B Buyers Worldwide</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                OEM-quality screens, batteries, and components at factory-direct prices.
                Serving repair shops, wholesalers, and distributors in 50+ countries.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/wholesale-inquiry"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-5 h-5" />
                  Get Wholesale Quote
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {['Flexible MOQ', 'Same-Day Shipping', '12-Month Warranty', '1% RMA Rate'].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-sm text-blue-200">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/oem-quality-iphone-screen-wholesale-collection.jpg"
                  alt="OEM quality phone repair parts wholesale collection from PRSPARES"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white font-semibold">Shenzhen Huaqiangbei — World&apos;s Largest Electronics Market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHO WE SERVE ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Serve</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We supply phone repair parts to businesses of all sizes — from local repair shops to international distributors.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Repair Shops',
                description: 'Independent and chain repair shops that need reliable parts with fast turnaround and flexible MOQ.',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Package,
                title: 'Wholesalers & Distributors',
                description: 'Regional distributors looking for consistent supply, competitive pricing, and large-volume fulfillment.',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: Globe,
                title: 'Sourcing Managers & Buyers',
                description: 'Procurement professionals seeking a certified, factory-direct supplier with quality guarantees and global shipping.',
                color: 'bg-orange-100 text-orange-600',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-5`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. PRODUCT CATEGORIES ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Complete mobile phone repair parts covering iPhone, Samsung, Huawei, Xiaomi, and all major brands.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'LCD & OLED Screens', image: '/images/screens-hero.jpg', href: '/products/screens', items: ['iPhone OLED/LCD', 'Samsung AMOLED', 'Android Displays'] },
              { name: 'Batteries', image: '/images/batteries-hero.jpg', href: '/products/batteries', items: ['High-Capacity', 'OEM Quality', 'Safety Certified'] },
              { name: 'Small Parts', image: '/images/small-parts-hero.jpg', href: '/products/small-parts', items: ['Cameras', 'Charging Ports', 'Flex Cables'] },
              { name: 'Repair Tools', image: '/images/repair-tools-hero.jpg', href: '/products/repair-tools', items: ['Tool Kits', 'Programmers', 'Equipment'] },
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Link href={cat.href} className="group block">
                  <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat.name}</h3>
                    </div>
                    <div className="p-4 bg-white">
                      <ul className="space-y-1.5">
                        {cat.items.map(item => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="text-center mt-10">
              <Link href="/products" className="inline-flex items-center gap-2 text-[#1e3a5f] font-semibold hover:text-orange-500 transition-colors">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. WHY PRSPARES ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why PRSPARES</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                6 reasons why B2B buyers choose us as their phone parts supplier.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Factory, title: 'Factory Direct Pricing', desc: 'Source directly from Shenzhen Huaqiangbei. No middlemen — save 30-40% compared to regional distributors.' },
              { icon: Shield, title: 'OEM Quality Guarantee', desc: 'TQC quality control on every batch. True Tone support for iPhone screens. CE/RoHS certified components.' },
              { icon: Zap, title: 'Same-Day Shipping', desc: 'Order before 3PM CST, ship the same day. DHL/FedEx express delivery to 50+ countries in 3-7 days.' },
              { icon: Package, title: 'Flexible MOQ', desc: 'Start from just 50 units. Mix & match across models and categories. Small shop friendly.' },
              { icon: Award, title: '1% RMA Rate', desc: 'Industry-leading low return rate. 12-month warranty on all products. Free replacement for defective items.' },
              { icon: Clock, title: '24h Quote Response', desc: 'Dedicated sales team responds within 24 hours. WhatsApp support for real-time communication.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#1e3a5f]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. HOW ORDERING WORKS ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Ordering Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From inquiry to delivery — a simple 4-step process.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Inquiry', desc: 'Tell us what you need — product category, models, quantity, and quality requirements.', icon: MessageSquare },
              { step: '02', title: 'Get Quote', desc: 'Our team reviews your request and sends a detailed quote within 24 hours.', icon: Clock },
              { step: '03', title: 'Confirm & Pay', desc: 'Confirm your order and complete payment via T/T, PayPal, or Western Union.', icon: CheckCircle },
              { step: '04', title: 'Fast Delivery', desc: 'We ship same-day via DHL/FedEx. Track your order until it arrives at your door.', icon: Truck },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-sm font-bold text-orange-500 mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <div className="text-center mt-12">
              <Link
                href="/wholesale-inquiry"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Start Your Inquiry
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. TRUST PROOF ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by 1000+ Businesses</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A decade of reliable service from the heart of Shenzhen&apos;s electronics hub.
              </p>
            </div>
          </FadeIn>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '10+', label: 'Years in Business' },
              { value: '1000+', label: 'B2B Clients Served' },
              { value: '50+', label: 'Countries Shipped' },
              { value: '<1%', label: 'RMA Rate' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#1e3a5f] mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Capability grid */}
          <FadeIn delay={400}>
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] rounded-2xl p-8 md:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Our Supply Chain Capabilities</h3>
                  <ul className="space-y-4">
                    {[
                      'Located in Huaqiangbei — access to 10,000+ electronics vendors',
                      'In-house quality inspection before every shipment',
                      'CE/RoHS certified components with full traceability',
                      'Dedicated account manager for every B2B client',
                      'Real warehouse with 500+ SKUs in stock',
                      'Same-day restocking from local supply chain',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden h-64 md:h-80">
                  <Image
                    src="/images/oem-quality-iphone-screen-wholesale-collection.jpg"
                    alt="PRSPARES warehouse and quality inspection in Shenzhen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. FINAL CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Source Phone Parts?</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Get factory-direct pricing on OEM-quality parts. Free quote within 24 hours — no commitment required.
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
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
