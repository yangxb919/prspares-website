import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Factory,
  MessageSquare,
  PackageCheck,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import ScrollAnimator from '@/components/ScrollAnimator';
import JsonLd from '@/components/JsonLd';
import { TrackedLink } from '@/components/TrackedLink';
import styles from './home.module.css';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export const metadata: Metadata = {
  title: 'Wholesale Phone Repair Parts Supplier | PRSPARES',
  description:
    'PRSPARES supplies wholesale mobile phone repair parts from Shenzhen: LCD and OLED screens, batteries, small parts, IC chips and repair tools for B2B buyers.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wholesale Phone Repair Parts Supplier | PRSPARES',
    description:
      'Wholesale mobile phone repair parts from Shenzhen for repair shops, wholesalers and sourcing teams.',
    type: 'website',
    url: '/',
    images: ['/hero/home.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Repair Parts Supplier | PRSPARES',
    description:
      'Wholesale mobile phone repair parts from Shenzhen for repair shops, wholesalers and sourcing teams.',
    images: ['/hero/home.jpg'],
  },
};

type Stat = {
  value: string;
  label: string;
  detail: string;
};

type ProductCategory = {
  name: string;
  href: string;
  image: string;
  from: string;
  stock: string;
  detail: string;
  items: string[];
};

type IconBlock = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const heroStats: Stat[] = [
  { value: '27k+', label: 'catalog lines', detail: 'Major phone repair categories' },
  { value: '4.4k+', label: 'screen assemblies', detail: 'LCD, OLED and with-frame options' },
  { value: '1.5k+', label: 'battery lines', detail: 'Standard and high-capacity supply' },
  { value: '10/50/200', label: 'price tiers', detail: 'Wholesale quantity logic' },
];

const audiences: IconBlock[] = [
  {
    icon: Wrench,
    title: 'Repair Shops',
    text: 'Fast restocking for iPhone, Samsung, Huawei, Xiaomi, OPPO and Vivo repair demand.',
  },
  {
    icon: Boxes,
    title: 'Wholesalers',
    text: 'Mixed model orders, tiered pricing and stable supply for regional resale.',
  },
  {
    icon: ClipboardCheck,
    title: 'Sourcing Managers',
    text: 'Pre-tested batches, clear grade options and export-ready packing from Shenzhen.',
  },
];

const productCategories: ProductCategory[] = [
  {
    name: 'LCD & OLED Screens',
    href: '/products/screens',
    image: '/images/home-redesign/category-screens.png',
    from: 'From $19',
    stock: '4,400+ assemblies',
    detail: 'OEM, soft OLED, hard OLED and Incell LCD grades',
    items: ['iPhone 6-16 series', 'Samsung S/A/Z series', 'True Tone support'],
  },
  {
    name: 'Batteries',
    href: '/products/batteries',
    image: '/images/home-redesign/category-batteries.png',
    from: 'From $5',
    stock: '1,500+ battery lines',
    detail: 'Standard and high-capacity options with compliant packing',
    items: ['iPhone batteries', 'Samsung batteries', 'UN38.3 support'],
  },
  {
    name: 'Small Parts',
    href: '/products/small-parts',
    image: '/images/home-redesign/category-small-parts.png',
    from: 'From $2',
    stock: '15,000+ part lines',
    detail: 'Cameras, charging ports, flex cables and speakers',
    items: ['Camera modules', 'Charging ports', 'Back covers'],
  },
  {
    name: 'IC Chips & Repair Tools',
    href: '/products/repair-tools',
    image: '/images/home-redesign/category-repair-tools.png',
    from: 'From $3',
    stock: '2,000+ tool / IC lines',
    detail: 'Testing, programming, soldering and opening tools',
    items: ['Screen testers', 'Programmers', 'Soldering tools'],
  },
];

const advantages: IconBlock[] = [
  {
    icon: Factory,
    title: 'Huaqiangbei sourcing base',
    text: 'Located close to the electronics supply chain, so popular models can be restocked quickly.',
  },
  {
    icon: ShieldCheck,
    title: 'Batch QC before shipment',
    text: 'Screens, batteries and small parts are checked before packing to keep quality stable.',
  },
  {
    icon: CircleDollarSign,
    title: 'Wholesale price logic',
    text: '10, 50 and 200 pcs tiers help buyers plan margin before confirming a mixed order.',
  },
  {
    icon: PackageCheck,
    title: 'Export-ready packing',
    text: 'Foam, anti-static bags and courier labels are handled for mixed model orders.',
  },
  {
    icon: Zap,
    title: 'Fast dispatch window',
    text: 'Popular in-stock items can move into picking and packing quickly after confirmation.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp-first sales support',
    text: 'Quick model checks, quote updates and shipping status for repeat B2B buyers.',
  },
];

const orderSteps: IconBlock[] = [
  {
    icon: Search,
    title: 'Check models',
    text: 'Send model, grade and quantity. Mixed lists are welcome.',
  },
  {
    icon: MessageSquare,
    title: 'Get quote',
    text: 'Receive price, MOQ, stock status and shipping route.',
  },
  {
    icon: ClipboardCheck,
    title: 'Confirm order',
    text: 'Approve the list, payment method and delivery details.',
  },
  {
    icon: Truck,
    title: 'Ship fast',
    text: 'Packed, tested and handed to express courier with tracking.',
  },
];

const proofImages = [
  {
    src: '/images/home-redesign/proof-stock-shelves.png',
    alt: 'Organized PRSPARES warehouse shelves with phone parts stock',
    label: 'Organized stock shelves',
    metric: 'Stock',
    text: 'Model-sorted bins for repeat repair demand',
  },
  {
    src: '/images/home-redesign/proof-packing-station.png',
    alt: 'PRSPARES packing station for wholesale phone repair parts orders',
    label: 'Packing station',
    metric: 'Packing',
    text: 'Mixed parts prepared for export shipment',
  },
  {
    src: '/images/home-redesign/proof-sku-coverage.png',
    alt: 'Complete mobile repair parts SKU coverage for multiple brands',
    label: 'Complete SKU coverage',
    metric: 'Coverage',
    text: 'Screens, batteries, small parts and tools',
  },
];

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Wholesale Phone Repair Parts Supplier | PRSPARES',
    url: SITE_URL,
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/home.jpg'),
    about: [
      'wholesale phone repair parts',
      'iPhone and Samsung replacement screens',
      'phone batteries',
      'mobile repair tools',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PRSPARES wholesale phone repair parts categories',
    itemListElement: productCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: absoluteUrl(category.href),
    })),
  },
];

function revealStyle(delay: number): CSSProperties {
  return { '--reveal-delay': `${delay}ms` } as CSSProperties;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <ScrollAnimator />
      <JsonLd data={homeJsonLd} />
      <section className="relative min-h-[calc(100svh-150px)] overflow-hidden bg-[#101820] text-white">
        <Image
          src="/hero/home.jpg"
          alt="PRSPARES warehouse stock shelves"
          fill
          priority
          className={`object-cover ${styles.heroImage}`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.92),rgba(10,16,24,0.68)_42%,rgba(10,16,24,0.24)_100%)]" />
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,177,64,0.22),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(255,139,47,0.2),transparent_28%)] ${styles.heroAura}`} />

        <div className="relative mx-auto flex min-h-[calc(100svh-150px)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8">
          <div className={`max-w-4xl pt-8 md:pt-14 ${styles.heroCopy}`}>
            <div className={`mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur ${styles.heroBadge}`}>
              <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
              PRSPARES / Shenzhen Huaqiangbei sourcing partner
            </div>
            <h1 className={`max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl ${styles.heroTitle}`}>
              Mobile Phone Repair Parts, Ready for Wholesale Orders
            </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl ${styles.heroText}`}>
              B2B phone repair parts supply for repair shops, wholesalers and sourcing teams. Mix screens, batteries, small parts, IC chips and tools in one quote request.
            </p>

            <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${styles.heroActions}`}>
              <TrackedLink
                href="/wholesale-inquiry"
                event="quote_cta_click"
                params={{ event_label: 'Home Hero CTA' }}
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313] ${styles.ctaSheen}`}
              >
                Get Wholesale Quote
                <ArrowRight className="h-5 w-5" />
              </TrackedLink>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className={`mt-10 grid border-y border-white/20 bg-black/20 backdrop-blur md:grid-cols-4 ${styles.statRail}`}>
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-white/20 px-4 py-5 md:border-r last:md:border-r-0">
                <div className="font-mono text-3xl font-black text-[#ffb36b]">{stat.value}</div>
                <div className="mt-1 text-sm font-bold text-white">{stat.label}</div>
                <div className="mt-1 text-xs leading-5 text-slate-200">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="border-b border-[#d9d2c4] bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1.1fr_1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#0b6b45]">Fast stock check</p>
            <h2 className="mt-1 text-2xl font-black text-[#18212c]">Send a mixed parts list and get exact wholesale pricing.</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#3c4652] sm:grid-cols-4">
            {['iPhone OLED', 'Samsung AMOLED', 'Battery packing', 'Screen tester'].map((item) => (
              <span key={item} className="rounded-md border border-[#e4d8c2] bg-white px-3 py-2 font-semibold">
                {item}
              </span>
            ))}
          </div>
          <TrackedLink
            href="/wholesale-inquiry"
            event="quote_cta_click"
            params={{ event_label: 'Home Fast Stock CTA' }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#18212c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2a3440]"
          >
            Start Inquiry
            <ArrowRight className="h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      <section className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Who we serve</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Built for buyers who reorder often.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              Buyers need to confirm three things quickly: category coverage, quote speed and whether PRSPARES can handle mixed model supply without a retail checkout flow.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {audiences.map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal
                style={revealStyle(index * 110)}
                className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}
              >
                <item.icon className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Core categories</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">One shipment, complete parts coverage.</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                data-scroll-reveal="scale"
                style={revealStyle(index * 90)}
                className={`group rounded-lg border border-[#e4e0d8] bg-white shadow-sm transition hover:border-[#ff8a2a] ${styles.motionCard}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <h3 className="text-lg font-black leading-6 text-white">{category.name}</h3>
                    <span className="shrink-0 rounded-md bg-[#ff8a2a] px-2 py-1 text-xs font-black text-white">{category.from}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-mono text-xs font-bold text-[#0b6b45]">{category.stock}</div>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#52606d]">{category.detail}</p>
                  <ul className="mt-4 space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#27313c]">
                        <CheckCircle2 className="h-4 w-4 text-[#0b6b45]" />
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

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div data-scroll-reveal="left">
            <p className="text-sm font-bold text-[#ffb36b]">Why PRSPARES</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Wholesale buying should feel predictable.</h2>
            <p className="mt-5 text-base leading-7 text-slate-200">
              Stock coverage, grade choices, packing and sales support are placed close to the quote decision.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ['12 mo', 'warranty'],
                ['<1%', 'RMA target'],
                ['24h', 'quote window'],
                ['50+', 'countries shipped'],
              ].map(([value, label]) => (
                <div key={label} className="border border-white/15 bg-white/5 p-4">
                  <div className="font-mono text-3xl font-black text-[#ffb36b]">{value}</div>
                  <div className="mt-1 text-sm font-bold text-slate-200">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {advantages.map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal="right"
                style={revealStyle(index * 70)}
                className={`rounded-lg border border-white/15 bg-white/[0.06] p-5 ${styles.motionCard}`}
              >
                <item.icon className={`h-7 w-7 text-[#51d88a] ${styles.iconPulse}`} />
                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">How ordering works</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">From model list to dispatch in four steps.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {orderSteps.map((step, index) => (
                <div
                  key={step.title}
                  data-scroll-reveal="scale"
                  style={revealStyle(index * 90)}
                  className={`relative rounded-lg border border-[#ded6c8] bg-white p-5 shadow-sm ${styles.motionCard}`}
                >
                  <div className="font-mono text-sm font-black text-[#ff8a2a]">0{index + 1}</div>
                  <step.icon className={`mt-4 h-7 w-7 text-[#0b6b45] ${styles.iconPulse}`} />
                  <h3 className="mt-4 text-lg font-black text-[#18212c]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#52606d]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Trust proof</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Stock, packing and SKU depth at a glance.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              Visual proof replaces vague claims. Buyers can immediately see inventory organization, dispatch handling and category coverage.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div
              data-scroll-reveal="left"
              className={`relative overflow-hidden rounded-lg border border-[#ded6c8] bg-[#18212c] shadow-sm ${styles.mediaFrame} ${styles.proofMain}`}
            >
              <div className="relative aspect-[16/10] lg:h-[460px] lg:aspect-auto">
                <Image
                  src={proofImages[0].src}
                  alt={proofImages[0].alt}
                  fill
                  priority
                  className={`object-cover ${styles.mediaImage}`}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="inline-flex rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">{proofImages[0].label}</div>
                <div className="mt-4 max-w-lg">
                  <div className="font-mono text-3xl font-black text-[#ffb36b]">{proofImages[0].metric}</div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">{proofImages[0].text}</p>
                </div>
              </div>
            </div>

            <div className={`grid gap-4 ${styles.proofSide}`}>
              {proofImages.slice(1).map((image, index) => (
                <div
                  key={image.src}
                  data-scroll-reveal="right"
                  style={revealStyle(index * 120)}
                  className={`relative overflow-hidden rounded-lg border border-[#ded6c8] bg-[#18212c] shadow-sm ${styles.mediaFrame}`}
                >
                  <div className="relative aspect-[16/9] lg:h-[222px] lg:aspect-auto">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="eager"
                      className={`object-cover ${styles.mediaImage}`}
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="inline-flex rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">{image.label}</div>
                    <p className="mt-3 text-sm font-semibold leading-5 text-white">{image.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['Inventory', 'Model bins and labeled stock for frequent reorder items.'],
              ['Dispatch', 'Packing workflow for mixed screens, batteries and small parts.'],
              ['Catalog', 'Category coverage supports quote requests instead of retail checkout.'],
            ].map(([title, text], index) => (
              <div
                key={title}
                data-scroll-reveal
                style={revealStyle(index * 90)}
                className={`border border-[#ded6c8] bg-[#fffaf0] px-4 py-4 ${styles.metricCard}`}
              >
                <div className="text-sm font-black text-[#18212c]">{title}</div>
                <p className="mt-1 text-xs leading-5 text-[#52606d]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#bff2d0]">Ready for next step</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Ready to check wholesale stock?</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
              Send your model list today. PRSPARES can return exact pricing, MOQ, grade options and shipping route.
            </p>
          </div>
          <TrackedLink
            href="/wholesale-inquiry"
            event="quote_cta_click"
            params={{ event_label: 'Home Bottom CTA' }}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd] ${styles.ctaSheen}`}
          >
            Get Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </TrackedLink>
        </div>
      </section>
    </main>
  );
}
