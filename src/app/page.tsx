import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Clock, Award, Users, Factory, Truck, Package, Zap, Globe, Star } from 'lucide-react';
import FadeIn from './FadeIn';
import HomeQuoteButton from './HomeQuoteButton';
import BestSellerCard from './BestSellerCard';

/* ─── Best Sellers Data ─── */
const BEST_SELLERS = [
  { name: 'iPhone 16 Pro Max Soft OLED Screen', category: 'Screens', priceFrom: 85, badge: 'Best Seller', badgeColor: 'bg-orange-500', href: '/products/screens' },
  { name: 'iPhone 15 Pro Max OEM Screen', category: 'Screens', priceFrom: 199, badge: 'OEM Quality', badgeColor: 'bg-purple-600', href: '/products/screens' },
  { name: 'iPhone 14 Pro Max Incell LCD', category: 'Screens', priceFrom: 29, badge: 'Budget Pick', badgeColor: 'bg-green-600', href: '/products/screens' },
  { name: 'iPhone 15 OEM Battery', category: 'Batteries', priceFrom: 12, badge: 'Popular', badgeColor: 'bg-blue-600', href: '/products/batteries' },
  { name: 'iPhone 14 Pro Max Rear Camera', category: 'Small Parts', priceFrom: 48, badge: 'High Demand', badgeColor: 'bg-blue-600', href: '/products/small-parts' },
  { name: 'JC V1SE True Tone Programmer', category: 'Repair Tools', priceFrom: 45, badge: 'Essential', badgeColor: 'bg-orange-500', href: '/products/repair-tools' },
  { name: 'Samsung S24 Ultra OLED Screen', category: 'Screens', priceFrom: 189, badge: 'Samsung', badgeColor: 'bg-indigo-600', href: '/products/screens' },
  { name: 'DL S300 Screen Tester', category: 'Repair Tools', priceFrom: 85, badge: 'Must Have', badgeColor: 'bg-blue-600', href: '/products/repair-tools' },
];

/* ─── FAQ Data ─── */
const FAQ_ITEMS = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'MOQ varies by category: 10 units for screens, 20 units for batteries and small parts, no minimum for repair tools. You can mix across different models, grades, and categories in a single order.' },
  { q: 'How do I place a wholesale order?', a: 'Submit a quote request through our website or WhatsApp. Our team sends a detailed quote within 24 hours. After confirming, pay via PayPal, T/T, or Western Union. We dispatch same-day and ship via DHL/FedEx/UPS (3-7 days worldwide).' },
  { q: 'What quality grades do you offer for screens?', a: 'We offer 5 grades: OEM Original (genuine parts), OEM Refurbished (original panel + new glass), Soft OLED (best aftermarket, 90-95% OEM quality), Hard OLED (mid-tier aftermarket), and Incell LCD (budget option). All grades are functionally tested before shipping.' },
  { q: 'Do you offer warranty on wholesale parts?', a: 'Yes — all products carry a 12-month warranty covering manufacturing defects. We also offer 48-hour DOA (dead on arrival) replacement for screens. Our RMA rate is below 1%, one of the lowest in the industry.' },
  { q: 'Which countries do you ship to?', a: 'We ship to 50+ countries worldwide via DHL, FedEx, and UPS express (3-7 business days). For batteries (Class 9 DG goods), we handle all dangerous goods documentation and compliant packaging. Sea freight available for bulk orders over 500 units.' },
  { q: 'Are your parts compatible with True Tone and Face ID?', a: 'Yes. Our Soft OLED, Hard OLED, and OEM screens support True Tone data transfer when paired with a programmer (JC V1SE, $45). Face ID is not affected by any screen replacement. We also sell the programmers and offer guidance on data transfer.' },
];

/* ─── Customer Reviews ─── */
const REVIEWS = [
  { name: 'Ahmed K.', country: 'UAE', role: 'Repair Shop Owner', text: 'Been ordering screens from PRSPARES for 8 months. Consistent quality, fast shipping to Dubai. Soft OLED grade is excellent value for money.', rating: 5 },
  { name: 'Carlos M.', country: 'Mexico', role: 'Regional Distributor', text: 'Best pricing I\'ve found for bulk iPhone screens. The MOQ flexibility lets me test new models before committing to large orders.', rating: 5 },
  { name: 'Sarah L.', country: 'USA', role: 'Phone Repair Chain (3 locations)', text: 'Switched from our previous supplier 6 months ago. Lower defect rate, better packaging, and their WhatsApp support is incredibly responsive.', rating: 5 },
];

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ═══ A: ATTENTION — Hero ═══ */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-400 font-semibold text-sm uppercase tracking-wide mb-4">Shenzhen Huaqiangbei — 10+ Years Factory Direct</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Wholesale Phone Repair Parts{' '}
                <span className="text-orange-400">— Screens from $19, Batteries from $5</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                OEM-quality iPhone &amp; Samsung screens, batteries, cameras, and repair tools
                at factory-direct prices. Serving 1,000+ repair shops in 50+ countries.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <HomeQuoteButton label="Get Wholesale Quote" variant="primary" eventLabel="Hero CTA" />
                <HomeQuoteButton
                  label="WhatsApp Sales"
                  variant="footer-wa"
                  eventLabel="Hero WhatsApp"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                {['MOQ from 10 Units', 'Same-Day Dispatch', '12-Month Warranty', '<1% RMA Rate'].map(badge => (
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

      {/* ═══ A: ATTENTION — Quick Stats ═══ */}
      <section className="py-6 bg-gradient-to-r from-[#1e3a5f] to-[#0f2440]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '10+', label: 'Years in Business' },
              { value: '1,000+', label: 'B2B Clients Served' },
              { value: '50+', label: 'Countries Shipped' },
              { value: '<1%', label: 'RMA Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold text-orange-400">{stat.value}</p>
                <p className="text-sm text-blue-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ I: INTEREST — Product Categories with Pricing ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                500+ SKUs covering iPhone, Samsung &amp; Android — all grades from OEM to budget.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'LCD & OLED Screens', image: '/images/screens-hero.jpg', href: '/products/screens', price: 'From $19', count: '70+ models', items: ['iPhone OLED/LCD', 'Samsung AMOLED', '5 Quality Grades'] },
              { name: 'Batteries', image: '/images/batteries-hero.jpg', href: '/products/batteries', price: 'From $5', count: '45+ models', items: ['iPhone & Samsung', 'OEM / High-Capacity', 'CE/UN38.3 Certified'] },
              { name: 'Small Parts', image: '/images/small-parts-hero.jpg', href: '/products/small-parts', price: 'From $2', count: '65+ items', items: ['Cameras & Charging Ports', 'Back Glass & Speakers', 'Flex Cables'] },
              { name: 'Repair Tools', image: '/images/repair-tools-hero.jpg', href: '/products/repair-tools', price: 'From $3', count: '45+ tools', items: ['True Tone Programmers', 'Screen Testers', 'Soldering Equipment'] },
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Link href={cat.href} className="group block">
                  <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-orange-400 font-bold text-sm">{cat.price}</span>
                          <span className="text-blue-200 text-xs">{cat.count}</span>
                        </div>
                      </div>
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
        </div>
      </section>

      {/* ═══ I: INTEREST — Best Sellers with Real Prices ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Best Sellers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular products — click any product to request wholesale pricing.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BEST_SELLERS.map((product, i) => (
              <FadeIn key={i} delay={i * 75}>
                <BestSellerCard {...product} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <div className="text-center mt-10">
              <Link href="/products" className="inline-flex items-center gap-2 text-[#1e3a5f] font-semibold hover:text-orange-500 transition-colors">
                View Full Catalog (500+ SKUs) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ I: INTEREST — Why PRSPARES ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why 1,000+ Repair Shops Choose PRSPARES</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Factory-direct from Shenzhen Huaqiangbei — the world&apos;s largest electronics market.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Factory, title: 'Factory Direct Pricing', desc: 'Source directly from Shenzhen Huaqiangbei. No middlemen — save 30-40% compared to regional distributors. Transparent pricing on every product page.' },
              { icon: Shield, title: 'OEM Quality + 5 Grades', desc: 'From OEM Original to budget Incell — choose the right quality/price balance for your market. True Tone support, CE/RoHS certified components.' },
              { icon: Zap, title: 'Same-Day Dispatch', desc: 'Order before 3 PM CST, ships the same day. DHL/FedEx/UPS express to 50+ countries in 3-7 business days. Full tracking provided.' },
              { icon: Package, title: 'Flexible MOQ', desc: 'Screens from 10 units, batteries from 20. Mix models, grades, and categories in one order. No minimum order value — sample orders welcome.' },
              { icon: Award, title: '<1% RMA Rate', desc: 'Industry-leading quality: every part tested before shipping. 12-month warranty + 48-hour DOA replacement for screens. Free replacement for defects.' },
              { icon: Clock, title: '24h Quote + WhatsApp Support', desc: 'Free quote within 24 hours. Dedicated sales team available on WhatsApp for real-time communication, order tracking, and technical support.' },
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

      {/* ═══ D: DESIRE — Customer Reviews ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real feedback from repair shops and distributors worldwide.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-orange-400 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">&ldquo;{review.text}&rdquo;</p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.role} · {review.country}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ D: DESIRE — Supply Chain & Trust ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
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

      {/* ═══ D: DESIRE — Who We Serve ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Serve</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From local repair shops to international distributors — we scale with your business.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Repair Shops', description: 'Independent and chain shops that need reliable parts with fast turnaround. Flexible MOQ starting from 10 units, mix & match across models.', color: 'bg-blue-100 text-blue-600' },
              { icon: Package, title: 'Wholesalers & Distributors', description: 'Regional distributors looking for competitive pricing and large-volume fulfillment. Custom pricing tiers and priority stock allocation.', color: 'bg-green-100 text-green-600' },
              { icon: Globe, title: 'Sourcing Managers', description: 'Procurement professionals seeking a certified, factory-direct supplier. Quality reports, COA documents, and bulk pricing available.', color: 'bg-orange-100 text-orange-600' },
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

      {/* ═══ A: ACTION — How Ordering Works ═══ */}
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
              { step: '01', title: 'Submit Inquiry', desc: 'Tell us what you need — product, models, quantity, and quality grade. Use our quote form or WhatsApp.', icon: '📋' },
              { step: '02', title: 'Get Quote', desc: 'Our team sends a detailed quote within 24 hours with exact pricing, MOQ, and delivery timeline.', icon: '💰' },
              { step: '03', title: 'Confirm & Pay', desc: 'Confirm your order and pay via PayPal, T/T, or Western Union. We start preparing your shipment immediately.', icon: '✅' },
              { step: '04', title: 'Fast Delivery', desc: 'Same-day dispatch via DHL/FedEx/UPS. Full tracking provided. 3-7 days to your door worldwide.', icon: '🚀' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                    {item.icon}
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
              <HomeQuoteButton label="Start Your Inquiry" variant="primary" eventLabel="How It Works CTA" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={i} delay={i * 75}>
                <details className="bg-white rounded-lg border border-gray-200 group" open={i < 2}>
                  <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">&#9662;</span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{item.a}</div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLOATING CTA ═══ */}
      <div className="fixed bottom-6 right-6 z-40">
        <HomeQuoteButton label="Get Quote" variant="float" eventLabel="Floating CTA" />
      </div>

      {/* ═══ A: ACTION — Final CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Source Phone Parts?</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Get factory-direct pricing on OEM-quality parts. Free quote within 24 hours — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HomeQuoteButton label="Get Wholesale Quote" variant="footer" eventLabel="Footer CTA" />
              <HomeQuoteButton
                label="WhatsApp Sales"
                variant="footer-wa"
                eventLabel="Footer WhatsApp"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
