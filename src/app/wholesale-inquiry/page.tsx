'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle, Factory, Shield, Clock, Award, ChevronDown, ChevronUp,
  Phone, Mail, MessageSquare, Send, Zap, Users,
} from 'lucide-react';
import { submitRfqAndNotify } from '@/lib/rfq-client';

// ─── Types ───────────────────────────────────────────────────────
interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  products: string;
  models: string;
  quantity: string;
  quality: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Metadata (handled via generateMetadata in layout or head) ──
// Since this is a client component, metadata is set via <head> tags below.

// ─── FAQ Data ────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "What's your minimum order quantity (MOQ)?",
    a: "Our MOQ is flexible — starting from just 10 units for screens and 20 units for batteries/small parts. We serve businesses of all sizes — from small repair shops to large distributors.",
  },
  {
    q: "Do you offer sample orders?",
    a: "Yes, we offer sample orders for quality testing before bulk purchases. Contact us for sample pricing and shipping details.",
  },
  {
    q: "What's your typical lead time?",
    a: "Most items ship same-day or next business day. For bulk orders (1000+ units), lead time is typically 3-5 business days.",
  },
  {
    q: "Do you provide OEM/ODM services?",
    a: "Yes, we offer OEM/ODM services including custom branding, packaging, and product customization for bulk orders.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept T/T (bank transfer), PayPal, Western Union, and Alibaba Trade Assurance for your security.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide via DHL, FedEx, UPS, and sea freight. We have experience shipping to USA, Canada, Europe, Australia, and 50+ countries.",
  },
  {
    q: "What's your return/warranty policy?",
    a: "We offer a 12-month warranty on all products. Our RMA rate is below 1%. Defective items are replaced free of charge.",
  },
  {
    q: "Can I visit your factory?",
    a: "Absolutely! We welcome factory visits. Our facility is located in Shenzhen Huaqiangbei. Contact us to schedule a tour.",
  },
];

// ─── Product Categories ──────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  {
    name: 'LCD/OLED Screens',
    image: '/images/screens-hero.jpg',
    items: ['iPhone LCD/OLED', 'Samsung AMOLED', 'Android Screens'],
    href: '/products/screens',
  },
  {
    name: 'Batteries',
    image: '/images/batteries-hero.jpg',
    items: ['High-Capacity', 'Original Quality', 'All Major Brands'],
    href: '/products/batteries',
  },
  {
    name: 'Small Parts',
    image: '/images/small-parts-hero.jpg',
    items: ['Flex Cables', 'Charging Ports', 'Speakers & Buttons'],
    href: '/products/small-parts',
  },
  {
    name: 'Repair Tools',
    image: '/images/repair-tools-hero.jpg',
    items: ['Tool Kits', 'Programmers', 'Testing Equipment'],
    href: '/products/repair-tools',
  },
];

// ─── Trust Stats ─────────────────────────────────────────────────
const TRUST_STATS = [
  { value: '10+', label: 'Years in Business', icon: Award },
  { value: '1000+', label: 'B2B Clients Served', icon: Users },
  { value: '<1%', label: 'Low RMA Rate', icon: Shield },
  { value: '24h', label: 'Response Time', icon: Clock },
];

// ─── GA4 helper ─────────────────────────────────────────────────
import { trackEvent } from '@/lib/analytics';

// ─── FAQ Accordion Item ──────────────────────────────────────────
function FaqItem({ item, defaultOpen }: { item: typeof FAQ_ITEMS[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────
export default function WholesaleInquiryPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    company: '', name: '', email: '', phone: '', country: '',
    products: '', models: '', quantity: '', quality: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [userIP, setUserIP] = useState('');
  const [formStarted, setFormStarted] = useState(false);

  // Get user IP
  useEffect(() => {
    (async () => {
      const apis = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
      ];
      for (const url of apis) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          const ip = data.ip || data.IPv4 || '';
          if (ip) { setUserIP(ip); return; }
        } catch { continue; }
      }
    })();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('quote_cta_click', { event_label: 'Request Quote Button' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (submitError) setSubmitError('');
    // Track form start
    if (!formStarted) {
      setFormStarted(true);
      trackEvent('begin_form', { form_name: 'wholesale_inquiry' });
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.name.trim()) errs.name = 'Contact person is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Please enter a valid email';
    if (!formData.products) errs.products = 'Please select a product category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const productLabel = formData.products;
      const qtyLabel = formData.quantity ? ` | Qty: ${formData.quantity}` : '';
      const qualityLabel = formData.quality ? ` | Quality: ${formData.quality}` : '';
      const modelsLabel = formData.models ? `\nModels/Brands: ${formData.models}` : '';
      const countryLabel = formData.country ? `\nCountry: ${formData.country}` : '';
      const msgParts = [
        `[Wholesale Inquiry]`,
        `Products: ${productLabel}${qtyLabel}${qualityLabel}`,
        modelsLabel,
        countryLabel,
        formData.message ? `\nDetails: ${formData.message}` : '',
      ].filter(Boolean).join('\n');

      await submitRfqAndNotify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        productInterest: formData.products,
        message: msgParts,
        pageUrl: window.location.href,
        ip: userIP,
        submittedAt: new Date().toISOString(),
      });

      // GA4 conversion
      trackEvent('generate_lead', { currency: 'USD', value: 100 });

      // Google Ads conversion tracking
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-1000630085/WkULCKmYx6UZEMXOkd0D',
        });
      }

      router.push('/thank-you');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSubmitError(`Failed to submit: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1a365d] to-[#0f2440] text-white overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  Wholesale Phone Parts{' '}
                  <span className="text-orange-400">Direct from Shenzhen Factory</span>
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-6 leading-relaxed">
                  OEM Quality — <strong className="text-white">Save 30–40% Compared to Regional Distributors</strong>. 10-Year Manufacturer Serving 1000+ B2B Clients Worldwide
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {['<1% RMA Rate', 'Same-Day Dispatch', 'MOQ from 10 Units', '12-Month Warranty'].map(badge => (
                    <span key={badge} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {badge}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Request Wholesale Quote
                  </button>
                  <a
                    href="https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
                  >
                    WhatsApp Sales
                  </a>
                </div>
                <p className="mt-3 text-sm text-blue-200">Free quote within 24 hours — No commitment required</p>
              </div>

              {/* Right: Hero image */}
              <div className="hidden lg:block relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/oem-quality-iphone-screen-wholesale-collection.jpg"
                    alt="OEM quality phone repair parts wholesale collection"
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

        {/* ═══ WHY CHOOSE US ═══ */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Why 1000+ Businesses Choose PRSPARES
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We&apos;re not just a supplier — we&apos;re your manufacturing partner in Shenzhen&apos;s electronics hub.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                  <Factory className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Factory Direct Pricing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Buy directly from our Shenzhen Huaqiangbei factory. No middlemen markup — save 30–40% compared to regional distributors.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium OEM Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  TQC quality control with &lt;1% RMA rate. True Tone support for iPhone screens. CE/RoHS certified components.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast &amp; Flexible Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Same-day dispatch for in-stock items. Flexible MOQ — from 10 units for screens, 20 units for batteries and small parts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PRODUCT RANGE ═══ */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Our Product Range
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Comprehensive phone repair parts covering all major brands and models.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCT_CATEGORIES.map(cat => (
                <a key={cat.name} href={cat.href} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
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
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MOQ / PAYMENT / SHIPPING / WARRANTY ═══ */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              How We Work With You
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Transparent terms designed for B2B partners — no hidden fees, no surprises.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Flexible MOQ', items: ['From 10 units (screens)', 'From 20 units (batteries/parts)', 'Mix across categories', 'Sample orders welcome'] },
                { title: 'Payment Methods', items: ['T/T (bank transfer)', 'PayPal', 'Western Union', 'Alibaba Trade Assurance'] },
                { title: 'Fast Shipping', items: ['Same-day dispatch', 'DHL / FedEx / UPS', '3-7 days worldwide', 'Sea freight for bulk'] },
                { title: '12-Month Warranty', items: ['All products covered', '<1% RMA rate', 'Free defect replacement', '24h response guarantee'] },
              ].map(block => (
                <div key={block.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">{block.title}</h3>
                  <ul className="space-y-2.5">
                    {block.items.map(item => (
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

        {/* ═══ INQUIRY FORM + TRUST SIGNALS ═══ */}
        <section ref={formRef} className="py-16 md:py-20" id="quote-form">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-10">
              {/* Left: Form (3 cols) */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Get Your Wholesale Quote in 24 Hours</h2>
                  <p className="text-gray-600 mb-4">Fill out the form and our sales team will send you a customized quote.</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 mb-8">
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Free quote within 24 hours</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Sample orders available</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Mixed models &amp; categories supported</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> 12-month warranty</span>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
                      <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.company ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="Your Company Ltd." />
                      {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="John Smith" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="john@company.com" />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone / WhatsApp</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">Country / Region</label>
                        <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="United States" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1.5">Products Interested <span className="text-red-500">*</span></label>
                        <select id="products" name="products" value={formData.products} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.products ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                          <option value="">Select category</option>
                          <option value="LCD/OLED Screens">LCD/OLED Screens</option>
                          <option value="Batteries">Batteries</option>
                          <option value="Small Parts">Small Parts</option>
                          <option value="Repair Tools">Repair Tools</option>
                          <option value="Multiple Categories">Multiple Categories</option>
                        </select>
                        {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
                      </div>
                      <div>
                        <label htmlFor="models" className="block text-sm font-medium text-gray-700 mb-1.5">Model / Brand</label>
                        <input type="text" id="models" name="models" value={formData.models} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="iPhone 15 Pro, Samsung S24..." />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Order Quantity</label>
                        <select id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select quantity range</option>
                          <option value="10-50 units">10-50 units</option>
                          <option value="50-100 units">50-100 units</option>
                          <option value="100-500 units">100-500 units</option>
                          <option value="500-1000 units">500-1,000 units</option>
                          <option value="1000+ units">1,000+ units</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1.5">Quality Requirement</label>
                        <select id="quality" name="quality" value={formData.quality} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select quality grade</option>
                          <option value="OEM Original">OEM Original</option>
                          <option value="Premium Aftermarket">Premium Aftermarket</option>
                          <option value="Standard Aftermarket">Standard Aftermarket</option>
                          <option value="Mixed Grades">Mixed Grades</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Additional Requirements</label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Specify models, quality requirements, shipping preferences..." />
                    </div>
                    {submitError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{submitError}</p>}
                    <button type="submit" disabled={isSubmitting} className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-md shadow-orange-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-orange-500/30'}`}>
                      {isSubmitting ? (
                        <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Submitting...</>
                      ) : (
                        <><Send className="w-5 h-5" /> Request Wholesale Quote</>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center">We&apos;ll respond within 24 hours. Your information is kept confidential.</p>
                  </form>
                </div>
              </div>
              {/* Right: Trust Signals (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> Quality Guarantee</h3>
                  <ul className="space-y-3">
                    {['TQC Quality Control System', 'CE & RoHS Certified', 'True Tone Support (iPhone)', '12-Month Warranty on All Products'].map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-4">By the Numbers</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {TRUST_STATS.map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
                        <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Prefer to Talk Directly?</h3>
                  <div className="space-y-3">
                    <a href="https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors" onClick={() => trackEvent('whatsapp_click')}><MessageSquare className="w-4 h-4" /> WhatsApp: +853 6390 2425</a>
                    <a href="mailto:parts.info@phonerepairspares.com" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors" onClick={() => trackEvent('contact_click', { method: 'email' })}><Mail className="w-4 h-4" /> parts.info@phonerepairspares.com</a>
                    <a href="tel:+8618312589439" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors" onClick={() => trackEvent('contact_click', { method: 'phone' })}><Phone className="w-4 h-4" /> +86 183 1258 9439</a>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden h-48">
                  <Image src="/images/oled_factory_hero.jpg" alt="PRSPARES factory in Shenzhen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <p className="text-white text-sm font-medium">Our Shenzhen Manufacturing Facility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TRUST BAR ═══ */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {TRUST_STATS.map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="w-8 h-8 text-[#1e3a5f] mx-auto mb-2" />
                    <div className="text-3xl font-bold text-[#1e3a5f]">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FAQ SECTION ═══ */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 mb-10">
              Everything you need to know about working with PRSPARES.
            </p>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} item={item} defaultOpen={i < 3} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-200 mb-8 text-lg">
              Join 1000+ businesses that trust PRSPARES for quality phone repair parts at factory-direct prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5" />
                Request Wholesale Quote
              </button>
              <a
                href="https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-white/20 transition-all"
              >
                WhatsApp Sales
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
