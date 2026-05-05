'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ExternalLink,
  Mail,
  MessageSquare,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useTurnstile } from '@/components/common/Turnstile';
import Honeypot from '@/components/common/Honeypot';
import { markAsHumanVerified, trackEvent } from '@/lib/analytics';
import { submitRfqAndNotify } from '@/lib/rfq-client';

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

type SelectedProductLine = {
  name: string;
  url: string;
};

const productCategories = [
  {
    name: 'LCD/OLED Screens',
    image: '/images/home-redesign/category-screens.png',
    metric: '4,400+ assemblies',
    items: ['OEM / Soft OLED / Hard OLED', 'iPhone and Samsung focus', 'True Tone support'],
    href: '/products/screens',
  },
  {
    name: 'Batteries',
    image: '/images/home-redesign/category-batteries.png',
    metric: '1,500+ battery lines',
    items: ['Standard and high-capacity', 'DG packing support', 'UN38.3 support'],
    href: '/products/batteries',
  },
  {
    name: 'Small Parts',
    image: '/images/home-redesign/category-small-parts.png',
    metric: '15,000+ part lines',
    items: ['Cameras and charging ports', 'Flex cables and speakers', 'Back covers and SIM trays'],
    href: '/products/small-parts',
  },
  {
    name: 'IC Chips & Repair Tools',
    image: '/images/home-redesign/category-repair-tools.png',
    metric: '2,000+ tool / IC lines',
    items: ['Screen testers', 'Programmers', 'Soldering tools'],
    href: '/products/repair-tools',
  },
];

const quoteSteps = [
  ['1', 'Pick category', 'Screens, batteries, small parts, tools or mixed order.'],
  ['2', 'List models', 'Paste model names, brands, SKUs or a short procurement note.'],
  ['3', 'Confirm quote', 'Sales returns stock, grade choices, price tiers and shipping route.'],
];

const trustStats = [
  ['24h', 'quote response', 'Price, MOQ and lead time'],
  ['10pcs', 'screen MOQ', 'Mixed models accepted'],
  ['3-7d', 'express shipping', 'DHL, FedEx, UPS'],
  ['12mo', 'warranty', 'Defect replacement support'],
];

const faqItems = [
  {
    q: "What's your minimum order quantity?",
    a: 'MOQ starts from 10 units for screens and around 20 units for batteries or small parts. Mixed models and categories are supported.',
  },
  {
    q: 'Can I send a mixed model list?',
    a: 'Yes. This page is designed for model-list buying. Paste the models into the form and the sales team will confirm stock, grades and price tiers.',
  },
  {
    q: 'Do you provide sample orders?',
    a: 'Yes. Sample orders are available for quality checking before larger wholesale orders.',
  },
  {
    q: 'How fast can PRSPARES ship?',
    a: 'Popular in-stock items can move to packing quickly. Express routes usually take 3-7 days depending on destination and cargo type.',
  },
];

function FaqItem({ item, defaultOpen }: { item: (typeof faqItems)[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black text-[#18212c] transition hover:bg-[#fffaf0]"
        aria-expanded={open}
      >
        {item.q}
        {open ? <ChevronUp className="h-5 w-5 shrink-0 text-[#0b6b45]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[#0b6b45]" />}
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-6 text-[#52606d]">{item.a}</div>}
    </div>
  );
}

function MetricStrip() {
  return (
    <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8">
        {trustStats.map(([value, label, detail]) => (
          <div key={label} className="border border-[#e4d8c2] bg-white px-4 py-4">
            <div className="font-mono text-2xl font-black text-[#ff8a2a]">{value}</div>
            <div className="mt-1 text-sm font-black text-[#18212c]">{label}</div>
            <div className="mt-1 text-xs leading-5 text-[#52606d]">{detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <p className="text-sm font-bold text-[#0b6b45]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">{title}</h2>
      </div>
      {text && <p className="text-base leading-7 text-[#52606d] md:text-lg">{text}</p>}
    </div>
  );
}

function normalizeProductUrl(value: string | null) {
  if (!value || typeof window === 'undefined') return '';

  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return '';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '';
  }
}

function absoluteProductUrl(value: string) {
  if (!value || typeof window === 'undefined') return '';
  return new URL(value, window.location.origin).toString();
}

export default function WholesaleInquiryPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    company: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    products: '',
    models: '',
    quantity: '',
    quality: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const [showOptional, setShowOptional] = useState(true);
  const [selectedProductLine, setSelectedProductLine] = useState<SelectedProductLine | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const productParam = url.searchParams.get('product');
    const categoryParam = url.searchParams.get('category');
    const productUrl = normalizeProductUrl(url.searchParams.get('productUrl'));

    const cleaned = productParam?.replace(/\+/g, ' ').trim() || '';
    const cleanedCategory = categoryParam?.replace(/\+/g, ' ').trim() || '';
    const mapping: Record<string, string> = {
      Screens: 'LCD/OLED Screens',
      'LCD/OLED Screens': 'LCD/OLED Screens',
      'LCD and OLED Screens': 'LCD/OLED Screens',
      'Screen Assembly': 'LCD/OLED Screens',
      'Screen Assembly with Frame': 'LCD/OLED Screens',
      Batteries: 'Batteries',
      Battery: 'Batteries',
      'Phone Batteries': 'Batteries',
      'Small Parts': 'Small Parts',
      'Repair Tools': 'IC Chips & Repair Tools',
      'Repair Tools and IC Chips': 'IC Chips & Repair Tools',
      Multiple: 'Multiple Categories',
      'Multiple Categories': 'Multiple Categories',
      'IC Chips & Repair Tools': 'IC Chips & Repair Tools',
    };

    const hasSpecificProductLine = Boolean(cleaned && productUrl);

    if (hasSpecificProductLine) {
      setSelectedProductLine({ name: cleaned, url: productUrl });
    }

    const matched = mapping[cleanedCategory] || mapping[cleaned] || '';
    if (matched || hasSpecificProductLine) {
      setFormData((prev) => ({
        ...prev,
        products: matched || prev.products,
        models: hasSpecificProductLine && !prev.models ? cleaned : prev.models,
        message:
          hasSpecificProductLine && !prev.message
            ? `Please quote a better wholesale price for this product line: ${cleaned}`
            : prev.message,
      }));
    }
  }, []);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const {
    token: turnstileToken,
    isVerified: isTurnstileVerified,
    hasError: turnstileError,
    TurnstileWidget,
  } = useTurnstile(turnstileSiteKey);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTurnstileVerified) markAsHumanVerified();
  }, [isTurnstileVerified]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('quote_cta_click', { event_label: 'Wholesale Inquiry Hero CTA' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (submitError) setSubmitError('');
    if (!formStarted) {
      setFormStarted(true);
      trackEvent('begin_form', { form_name: 'wholesale_inquiry' });
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Please enter a valid email';
    if (!formData.products) errs.products = 'Please select a product category';
    if (!formData.quantity) errs.quantity = 'Please select a quantity range';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const turnstileAvailable = turnstileSiteKey && !turnstileError && typeof window !== 'undefined' && !!window.turnstile;
    if (turnstileAvailable && !isTurnstileVerified) {
      setSubmitError('Please complete the verification challenge.');
      return;
    }

    if (turnstileAvailable && turnstileToken) {
      try {
        const verifyRes = await fetch('/api/turnstile/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setSubmitError('Verification failed. Please refresh and try again.');
          return;
        }
      } catch {
        setSubmitError('Verification check failed. Please try again.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const productLabel = formData.products;
      const selectedProductLabel = selectedProductLine?.name
        ? `\nSelected product line: ${selectedProductLine.name}`
        : '';
      const selectedProductUrl = selectedProductLine?.url
        ? `\nProduct source link: ${absoluteProductUrl(selectedProductLine.url)}`
        : '';
      const qtyLabel = formData.quantity ? ` | Qty: ${formData.quantity}` : '';
      const qualityLabel = formData.quality ? ` | Quality: ${formData.quality}` : '';
      const modelsLabel = formData.models ? `\nModels/Brands: ${formData.models}` : '';
      const countryLabel = formData.country ? `\nCountry: ${formData.country}` : '';
      const msgParts = [
        '[Wholesale Inquiry]',
        `Products: ${productLabel}${qtyLabel}${qualityLabel}`,
        selectedProductLabel,
        selectedProductUrl,
        modelsLabel,
        countryLabel,
        formData.message ? `\nDetails: ${formData.message}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await submitRfqAndNotify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        productInterest: selectedProductLine?.name
          ? `${formData.products} | ${selectedProductLine.name}`
          : formData.products,
        message: msgParts,
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString(),
        turnstileToken: turnstileToken || undefined,
        honeypot: honeypotRef.current?.value,
      });

      trackEvent('generate_lead', { currency: 'USD', value: 100 });
      router.push('/thank-you');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSubmitError(`Failed to submit: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <section className="relative overflow-hidden bg-[#111922] text-white">
        <Image src="/hero/wholesale-inquiry.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.94),rgba(10,16,24,0.72)_45%,rgba(10,16,24,0.26))]" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
              Wholesale inquiry / quote workflow
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">A Faster Quote Page for Mixed Parts Lists</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              Send category, model list and quantity tier. PRSPARES returns stock status, grade options, price tiers and shipping route without forcing buyers through a retail cart.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313]"
              >
                Get Wholesale Quote
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="https://wa.me/85363902425?text=Hi,%20I%27m%20interested%20in%20wholesale%20phone%20parts"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { event_label: 'Wholesale Hero WhatsApp' })}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                WhatsApp Sales
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white p-5 text-[#18212c] shadow-xl lg:ml-auto lg:w-[430px]">
            <div className="flex items-center gap-3 border-b border-[#ece5da] pb-4">
              <MessageSquare className="h-8 w-8 text-[#0b6b45]" />
              <div>
                <h2 className="text-xl font-black">Quick Quote Form</h2>
                <p className="text-sm text-[#52606d]">Designed for B2B model lists</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {['Product category', 'Models needed', 'Quantity range', 'Quality grade', 'Destination country'].map((field) => (
                <div key={field} className="rounded-md border border-[#ded6c8] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#52606d]">
                  {field}
                </div>
              ))}
              <button type="button" onClick={scrollToForm} className="mt-1 rounded-md bg-[#ff8a2a] px-4 py-3 text-sm font-black text-white">
                Start Quote Request
              </button>
            </div>
          </div>
        </div>
      </section>

      <MetricStrip />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Form logic"
            title="Ask only what sales needs to quote."
            text="The page uses procurement-oriented fields and trust proof near the form, reducing hesitation before submission."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {quoteSteps.map(([num, title, text]) => (
              <div key={title} className="rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6">
                <div className="font-mono text-sm font-black text-[#ff8a2a]">0{num}</div>
                <h3 className="mt-4 text-xl font-black text-[#18212c]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Product range"
            title="Quote by category, not shopping cart."
            text="Buyers can start from a category, then send model and quantity details for exact stock and price confirmation."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category) => (
              <Link key={category.name} href={category.href} className="group rounded-lg border border-[#e4e0d8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image src={category.image} alt={category.name} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                  <h3 className="absolute bottom-3 left-3 right-3 text-lg font-black leading-6 text-white">{category.name}</h3>
                </div>
                <div className="p-5">
                  <div className="font-mono text-xs font-bold text-[#0b6b45]">{category.metric}</div>
                  <ul className="mt-4 space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#27313c]">
                        <CheckCircle className="h-4 w-4 text-[#0b6b45]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section ref={formRef} id="quote-form" className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 border-b border-[#ece5da] pb-6">
              <p className="text-sm font-bold text-[#0b6b45]">Quote request</p>
              <h2 className="mt-2 text-3xl font-black text-[#18212c]">Get your wholesale quote in 24 hours.</h2>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Required fields are intentionally short. Add model details if you already have a procurement list.
              </p>
            </div>

            {selectedProductLine && (
              <div className="mb-6 rounded-lg border border-[#ffd8b6] bg-[#fffaf0] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0b6b45]">Selected product line</p>
                    <h3 className="mt-2 text-base font-black leading-6 text-[#18212c]">{selectedProductLine.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#52606d]">
                      This line has been added to the form so sales can quote a better wholesale price.
                    </p>
                  </div>
                  {selectedProductLine.url && (
                    <Link
                      href={selectedProductLine.url}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-[#ded6c8] bg-white px-3 py-2 text-xs font-black text-[#18212c] transition hover:border-[#ff8a2a] hover:text-[#ff8a2a]"
                    >
                      View product source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Honeypot ref={honeypotRef} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-black text-[#18212c]">
                    Contact Person <span className="text-[#ff8a2a]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15 ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#ded6c8]'}`}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-black text-[#18212c]">
                    Email Address <span className="text-[#ff8a2a]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15 ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#ded6c8]'}`}
                    placeholder="john@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="products" className="mb-1.5 block text-sm font-black text-[#18212c]">
                    Products Interested <span className="text-[#ff8a2a]">*</span>
                  </label>
                  <select
                    id="products"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15 ${errors.products ? 'border-red-400 bg-red-50' : 'border-[#ded6c8]'}`}
                  >
                    <option value="">Select category</option>
                    <option value="LCD/OLED Screens">LCD/OLED Screens</option>
                    <option value="Batteries">Batteries</option>
                    <option value="Small Parts">Small Parts</option>
                    <option value="IC Chips & Repair Tools">IC Chips & Repair Tools</option>
                    <option value="Multiple Categories">Multiple Categories</option>
                  </select>
                  {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
                </div>
                <div>
                  <label htmlFor="quantity" className="mb-1.5 block text-sm font-black text-[#18212c]">
                    Estimated Quantity <span className="text-[#ff8a2a]">*</span>
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15 ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-[#ded6c8]'}`}
                  >
                    <option value="">Select quantity range</option>
                    <option value="10-50 units">10-50 units</option>
                    <option value="50-100 units">50-100 units</option>
                    <option value="100-500 units">100-500 units</option>
                    <option value="500-1000 units">500-1,000 units</option>
                    <option value="1000+ units">1,000+ units</option>
                  </select>
                  {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#ded6c8]">
                <button
                  type="button"
                  onClick={() => setShowOptional((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 bg-[#fffaf0] px-4 py-3 text-left text-sm font-black text-[#18212c] transition hover:bg-[#fff3df]"
                >
                  <span>More details for a better quote</span>
                  {showOptional ? <Minus className="h-4 w-4 text-[#0b6b45]" /> : <Plus className="h-4 w-4 text-[#0b6b45]" />}
                </button>
                {showOptional && (
                  <div className="space-y-4 border-t border-[#ded6c8] bg-white p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="company" className="mb-1.5 block text-sm font-black text-[#18212c]">Company Name</label>
                        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15" placeholder="Your Company Ltd." />
                      </div>
                      <div>
                        <label htmlFor="country" className="mb-1.5 block text-sm font-black text-[#18212c]">Country / Region</label>
                        <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15" placeholder="United States" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-sm font-black text-[#18212c]">Phone / WhatsApp</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <label htmlFor="models" className="mb-1.5 block text-sm font-black text-[#18212c]">Model / Brand List</label>
                        <input type="text" id="models" name="models" value={formData.models} onChange={handleChange} className="w-full rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15" placeholder="iPhone 15 Pro, Samsung S24..." />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="quality" className="mb-1.5 block text-sm font-black text-[#18212c]">Quality Requirement</label>
                      <select id="quality" name="quality" value={formData.quality} onChange={handleChange} className="w-full rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15">
                        <option value="">Select quality grade</option>
                        <option value="OEM Original">OEM Original</option>
                        <option value="Premium Aftermarket">Premium Aftermarket</option>
                        <option value="Standard Aftermarket">Standard Aftermarket</option>
                        <option value="Mixed Grades">Mixed Grades</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-1.5 block text-sm font-black text-[#18212c]">Additional Requirements</label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full resize-none rounded-md border border-[#ded6c8] bg-white px-4 py-3 text-sm text-[#18212c] outline-none transition focus:border-[#0b6b45] focus:ring-2 focus:ring-[#0b6b45]/15" placeholder="Paste model list, preferred shipping route, packing needs or target quantity..." />
                    </div>
                  </div>
                )}
              </div>

              {turnstileSiteKey && (
                <div className="flex justify-center">
                  <TurnstileWidget />
                </div>
              )}

              {submitError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-black text-white shadow-md shadow-[#ff8a2a]/20 transition hover:bg-[#e97313] ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:shadow-lg'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Get Wholesale Quote
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[#52606d]">We will respond within 24 hours. Your quote request is handled by PRSPARES sales support.</p>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6">
              <ShieldCheck className="h-8 w-8 text-[#0b6b45]" />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">What you receive</h3>
              <ul className="mt-4 space-y-3 text-sm font-semibold text-[#27313c]">
                {['Stock status by model', '10 / 50 / 200 pcs price tiers', 'Grade options and MOQ', 'Shipping route recommendation'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#0b6b45]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#ded6c8] bg-white p-6">
              <ClipboardCheck className="h-8 w-8 text-[#0b6b45]" />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">Prefer direct contact?</h3>
              <div className="mt-4 space-y-3">
                <a href="https://wa.me/85363902425?text=Hi,%20I%27m%20interested%20in%20wholesale%20phone%20parts" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { event_label: 'Inquiry Side WhatsApp' })} className="flex items-center gap-3 text-sm font-semibold text-[#52606d] transition hover:text-[#0b6b45]">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp: +853 6390 2425
                </a>
                <a href="mailto:parts.info@phonerepairspares.com" onClick={() => trackEvent('contact_click', { method: 'email' })} className="flex items-center gap-3 text-sm font-semibold text-[#52606d] transition hover:text-[#0b6b45]">
                  <Mail className="h-4 w-4" />
                  parts.info@phonerepairspares.com
                </a>
                <a href="tel:+8618312589439" onClick={() => trackEvent('contact_click', { method: 'phone' })} className="flex items-center gap-3 text-sm font-semibold text-[#52606d] transition hover:text-[#0b6b45]">
                  <Phone className="h-4 w-4" />
                  +86 183 1258 9439
                </a>
              </div>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-lg">
              <Image src="/images/home-redesign/proof-sku-coverage.png" alt="PRSPARES quote support desk" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">SKU coverage check</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#ffb36b]">Support expectations</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">What happens after submission?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: PackageCheck, title: 'Stock check', text: 'Sales checks availability and compatible models.' },
              { icon: Truck, title: 'Route option', text: 'Team suggests express, battery-compliant or bulk route.' },
              { icon: MessageSquare, title: 'Quote reply', text: 'Buyer receives price tiers and next-step confirmation.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <item.icon className="h-7 w-7 text-[#51d88a]" />
                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="FAQ" title="Wholesale quote questions." />
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FaqItem key={item.q} item={item} defaultOpen={index < 2} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
