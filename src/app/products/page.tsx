import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Globe,
  Layers3,
  MessageSquare,
  PackageCheck,
  Search,
  ShieldCheck,
  TableProperties,
  Truck,
} from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import ScrollAnimator from '@/components/ScrollAnimator';
import CertificationBadges from '@/components/products/CertificationBadges';
import {
  brandCatalogs,
  catalogMetrics,
  categoryLanes,
  modelDepthRows,
  sampleWholesaleLines,
} from '@/data/product-catalog-summary';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

const productsMetaTitle = 'Wholesale Phone Repair Parts Catalog & SKUs | PRSPARES';
const productsMetaDescription =
  'Wholesale phone repair parts catalog with 27,783 SKUs across screens, batteries, small parts, IC chips and tools. MOQ support and 24h quote today.';

export const metadata: Metadata = {
  title: productsMetaTitle,
  description: productsMetaDescription,
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: productsMetaTitle,
    description: productsMetaDescription,
    type: 'website',
    url: '/products',
    images: ['/hero/products.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: productsMetaTitle,
    description: productsMetaDescription,
    images: ['/hero/products.jpg'],
  },
};

const productsJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wholesale Mobile Repair Parts Catalog',
    url: absoluteUrl('/products'),
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/products.jpg'),
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: absoluteUrl('/products'),
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PRSPARES wholesale repair parts categories',
    itemListElement: categoryLanes.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: absoluteUrl(category.href.startsWith('/wholesale-inquiry') ? '/wholesale-inquiry' : category.href),
    })),
  },
];

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
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

function MetricStrip() {
  return (
    <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8">
        {catalogMetrics.map(([value, label, detail]) => (
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

function productLineId(line: (typeof sampleWholesaleLines)[number]) {
  return `line-${`${line.model}-${line.category}-${line.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)}`;
}

function getQuoteCategory(line: (typeof sampleWholesaleLines)[number]) {
  if (/screen/i.test(line.category)) return 'LCD/OLED Screens';
  if (/battery/i.test(line.category)) return 'Batteries';
  if (/ic|tool|programmer|screwdriver/i.test(`${line.category} ${line.source}`)) {
    return 'IC Chips & Repair Tools';
  }
  return 'Small Parts';
}

function buildLineInquiryHref(line: (typeof sampleWholesaleLines)[number]) {
  const params = new URLSearchParams({
    product: `${line.model} - ${line.name}`,
    category: getQuoteCategory(line),
    productUrl: `/products#${productLineId(line)}`,
  });

  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

const trustWorkPhotos = [
  {
    image: '/hero/trust-qc-bench.jpg',
    alt: 'Phone screen quality inspection bench before shipment',
    caption: 'Display test, touch test, fit-check before every batch',
  },
  {
    image: '/hero/trust-packing.jpg',
    alt: 'B2B export packing station with anti-static phone parts',
    caption: 'Anti-static + UN38.3 packaging for screens, batteries and small parts',
  },
  {
    image: '/hero/trust-huaqiangbei.jpg',
    alt: 'Shenzhen Huaqiangbei electronics market sourcing aisle',
    caption: 'Direct access to multiple Shenzhen suppliers — 24h sourcing',
  },
] as const;

const testimonialPlaceholders = [
  {
    quote: '[TODO: real testimonial from a US repair shop owner — focus on QC + speed]',
    name: '[Name placeholder]',
    role: 'Repair shop owner, [Country]',
  },
  {
    quote: '[TODO: real testimonial from EU/UK distributor — focus on MOQ + mixed orders]',
    name: '[Name placeholder]',
    role: 'Repair shop owner, [Country]',
  },
] as const;

function StarRating() {
  return (
    <div className="flex gap-1" aria-label="Testimonial rating placeholder">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="fill-[#ff8a2a]">
          <path d="M10 1.8l2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <ScrollAnimator />
      <JsonLd data={productsJsonLd} />

      <section className="relative overflow-hidden bg-[#101820] text-white">
        <Image
          src="/hero/products.jpg"
          alt="PRSPARES mobile repair parts SKU coverage"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.95),rgba(10,16,24,0.78)_48%,rgba(10,16,24,0.28))]" />
        <div className="relative mx-auto grid min-h-[540px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <ClipboardCheck className="h-4 w-4 text-[#51d88a]" />
              Updated April 2026 inventory
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Wholesale Phone Repair Parts — 27,000+ SKUs Across 8 Brands
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              The product section is organized for wholesale buying: 27,783 repair-part SKUs across screens, batteries, small parts, IC chips, tools, tablets and smartwatch parts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/wholesale-inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313]"
              >
                Get Wholesale Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border border-white/20 bg-black/28 p-5 backdrop-blur">
              <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/15 pb-4">
                <div>
                  <div className="text-sm font-bold text-[#bff2d0]">Wholesale tiers</div>
                  <div className="mt-1 text-2xl font-black text-white">10+ / 50+ / 200+</div>
                </div>
                <TableProperties className="h-9 w-9 text-[#ffb36b]" />
              </div>
              <div className="mt-4 space-y-3">
                {sampleWholesaleLines.slice(0, 4).map((line) => (
                  <div key={`${line.model}-${line.category}`} className="grid grid-cols-[1fr_auto] gap-4 border border-white/12 bg-white/[0.07] p-3">
                    <div>
                      <div className="text-sm font-black text-white">{line.model}</div>
                      <div className="mt-1 text-xs text-slate-300">{line.category}</div>
                    </div>
                    <div className="font-mono text-sm font-black text-[#ffb36b]">{line.tiers[0]}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-white/60">Filters available on quote: Brand · Model · Part Type</p>
            </div>
          </div>
        </div>
      </section>

      <MetricStrip />

      <section id="catalog" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Catalog architecture"
              title="Five buying lanes, not a retail store."
              text="The catalog is too deep for a checkout grid. The better product page groups buyers by procurement intent, then pushes them to send a model list for exact price, stock and shipping route."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {categoryLanes.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties}
                className="group flex min-h-full cursor-pointer flex-col rounded-lg border border-[#e4e0d8] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#ff8a2a] hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-[#18212c]">
                  <Image src={category.image} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-black leading-6 text-white">{category.name}</h3>
                    <div className="mt-2 inline-flex rounded-md bg-[#ff8a2a] px-2 py-1 text-xs font-black text-white">{category.rows}</div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="font-mono text-xs font-bold text-[#0b6b45]">{category.range}</div>
                  <p className="mt-3 text-sm leading-6 text-[#52606d]">{category.text}</p>
                  <ul className="mt-4 space-y-2">
                    {category.bullets.map((item) => (
                      <li key={item} className="flex gap-2 text-sm font-semibold leading-5 text-[#27313c]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b6b45]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 text-right text-sm font-black text-[#ff8a2a] transition group-hover:translate-x-1">View Category →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Brand coverage"
              title="The catalog depth is strongest by brand family."
              text="The product architecture should surface model coverage first, because repeat buyers usually start with brand and model families before they choose part categories."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {brandCatalogs.map((brand, index) => (
              <div
                key={brand.name}
                data-scroll-reveal
                style={{ '--reveal-delay': `${index * 55}ms` } as React.CSSProperties}
                className="rounded-lg border border-[#ded6c8] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-[#18212c]">{brand.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#52606d]">{brand.lead}</p>
                  </div>
                  <Database className="h-7 w-7 shrink-0 text-[#0b6b45]" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="border border-[#e4d8c2] bg-[#fffaf0] p-3">
                    <div className="font-mono text-xl font-black text-[#ff8a2a]">{brand.rows}</div>
                    <div className="text-xs font-bold text-[#52606d]">SKUs</div>
                  </div>
                  <div className="border border-[#e4d8c2] bg-[#fffaf0] p-3">
                    <div className="font-mono text-xl font-black text-[#ff8a2a]">{brand.models}</div>
                    <div className="text-xs font-bold text-[#52606d]">models</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {brand.top.map((item) => (
                    <span key={item} className="rounded-md border border-[#e4d8c2] px-2 py-1 text-xs font-bold text-[#27313c]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div data-scroll-reveal="left">
            <p className="text-sm font-bold text-[#ffb36b]">Model depth</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">High-volume series deserve their own landing structure.</h2>
            <p className="mt-5 text-base leading-7 text-slate-200">
              Based on catalog depth, the next product architecture should prioritize Samsung A/S/Tab, iPhone, Xiaomi/Redmi/POCO, Huawei/Honor and OPPO/Vivo pages before long-tail single models.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ['7', 'priority brand hubs'],
                ['8', 'top model groups'],
                ['13', 'catalog modules'],
                ['49', 'part categories'],
              ].map(([value, label]) => (
                <div key={label} className="border border-white/15 bg-white/[0.06] p-4">
                  <div className="font-mono text-3xl font-black text-[#ffb36b]">{value}</div>
                  <div className="mt-1 text-sm font-bold text-slate-200">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div data-scroll-reveal="right" className="overflow-hidden rounded-lg border border-white/15 bg-white/[0.06]">
            <div className="hidden grid-cols-[0.8fr_0.55fr_0.8fr_1fr] bg-white/10 px-5 py-4 text-sm font-black text-white md:grid">
              <span>Series</span>
              <span>Depth</span>
              <span>Buyer intent</span>
              <span>Typical parts</span>
            </div>
            {modelDepthRows.map(([series, depth, intent, parts]) => (
              <div key={series} className="grid gap-2 border-t border-white/10 px-5 py-4 text-sm md:grid-cols-[0.8fr_0.55fr_0.8fr_1fr]">
                <span className="font-black text-white">{series}</span>
                <span className="font-mono font-black text-[#ffb36b]">{depth}</span>
                <span className="text-slate-300">{intent}</span>
                <span className="text-slate-300">{parts}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Brand hot-selling lines"
              title="Show recognizable products before asking for the list."
              text="These SKUs now prioritize brand-demand products from the catalog: iPhone, Samsung Galaxy, OPPO Reno, Google Pixel and common board-level repair items."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sampleWholesaleLines.map((line, index) => (
              <article
                key={`${line.model}-${line.name}`}
                id={productLineId(line)}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties}
                className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#f5f3ee]">
                  <Image src={line.image} alt={`${line.model} ${line.name}`} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute left-4 top-4 rounded-md bg-[#18212c] px-2 py-1 text-xs font-black text-white">{line.category}</div>
                </div>
                <div className="p-5">
                  <div className="font-mono text-xs font-bold text-[#0b6b45]">{line.source}</div>
                  <h3 className="mt-2 text-lg font-black leading-6 text-[#18212c]">{line.model}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#52606d]">{line.name}</p>
                  <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-md border border-[#e4d8c2] text-center">
                    {['10+', '50+', '200+'].map((tier, tierIndex) => (
                      <div key={tier} className="border-r border-[#e4d8c2] last:border-r-0">
                        <div className="bg-[#fffaf0] px-2 py-2 text-xs font-black text-[#52606d]">{tier}</div>
                        <div className="px-2 py-2 font-mono text-sm font-black text-[#18212c]">{line.tiers[tierIndex]}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#52606d]">{line.note}</p>
                  <div className="mt-5">
                    <Link
                      href={buildLineInquiryHref(line)}
                      className="group inline-flex flex-col gap-1 rounded-md border border-[#ffd8b6] bg-[#fffaf0] px-4 py-3 text-left transition hover:border-[#ff8a2a] hover:bg-[#fff3df]"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a] group-hover:text-[#0b6b45]">
                        Ask for a better price
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold leading-5 text-[#52606d]">
                        Send this exact line to the quote form.
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="B2B workflow"
              title="The product page should help buyers prepare a quote request."
              text="The catalog already has the fields a sourcing buyer needs. The site should guide them to send the same fields back to PRSPARES: model, category, version, quantity and target grade."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Search, title: 'Choose model families', text: 'Start from brand and series: iPhone, Galaxy A/S, Redmi Note, OPPO Reno, Huawei Nova and more.' },
              { icon: Layers3, title: 'Mix categories', text: 'Combine screens, batteries, cameras, charging ports, flex cables, IC chips and tools in one request.' },
              { icon: ClipboardCheck, title: 'Confirm tiers', text: 'Use 10+ / 50+ / 200+ quantities so sales can reply with the right wholesale tier.' },
              { icon: PackageCheck, title: 'Plan packing', text: 'Battery, screen and mixed-part orders need different packing, carton and courier handling.' },
            ].map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal
                style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm"
              >
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div data-scroll-reveal="left">
            <p className="text-sm font-bold text-[#0b6b45]">Procurement support</p>
            <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">No cart pressure. No fake instant stock promise.</h2>
            <p className="mt-5 text-base leading-7 text-[#52606d]">
              The site should make PRSPARES feel like a sourcing desk. Buyers can inspect catalog depth, then send a parts list, WhatsApp list or email list for stock and exact route confirmation.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'QC before packing', text: 'Screens, batteries and small parts can be checked by batch before shipment.' },
              { icon: Truck, title: 'Route by cargo type', text: 'Battery and mixed orders need practical freight suggestions, not generic shipping text.' },
              { icon: MessageSquare, title: 'Sales reply within 24h', text: 'The quote response should include model status, tier price, MOQ and alternatives.' },
            ].map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal="right"
                style={{ '--reveal-delay': `${index * 100}ms` } as React.CSSProperties}
                className="rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6"
              >
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7F0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Trust signals"
              title="Buyer proof before the quote."
              text="Repair shops and distributors need to know the supplier can cover quality, routing and replenishment before they send a model list."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: 'Trusted by Repair Shops & Distributors',
                text: 'PRSPARES ships repair parts to repair chains, sourcing teams and resellers across the US, UK, EU, LatAm, MENA and SEA.',
                footprint: [
                  ['🇺🇸', 'United States'],
                  ['🇬🇧', 'United Kingdom'],
                  ['🇩🇪', 'Germany'],
                  ['🇪🇸', 'Spain'],
                  ['🇲🇽', 'Mexico'],
                  ['🇦🇪', 'UAE'],
                ],
                // TODO: Update the 30+ country count if exact CRM/export coverage is available.
                footprintNote: 'Repair shops, distributors and resellers across 30+ countries',
              },
              {
                icon: ShieldCheck,
                title: 'QC Before Every Shipment',
                text: 'Every batch goes through 7-step incoming QC — display test, touch test, fit-check, packing inspection — before it leaves Shenzhen.',
                certifications: true,
              },
              {
                icon: Building,
                title: 'Huaqiangbei Sourcing Floor',
                text: 'Direct access to Shenzhen Huaqiangbei electronics market lets us pull screens, batteries and IC chips from multiple suppliers in 24h.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm"
              >
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
                {item.footprint && (
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
                    {item.footprint.map(([flag, country]) => (
                      <div key={country} className="flex items-center gap-2 rounded-md border border-[#e4d8c2] bg-[#fffaf0] px-3 py-2 text-xs font-black text-[#18212c]">
                        <span aria-hidden="true" className="text-base leading-none">
                          {flag}
                        </span>
                        <span>{country}</span>
                      </div>
                    ))}
                  </div>
                )}
                {item.footprintNote && <p className="mt-4 text-sm leading-6 text-[#52606d]">{item.footprintNote}</p>}
                {item.footprint && (
                  <>
                    {/* TODO: render <CustomerLogos /> here when real logos are licensed */}
                  </>
                )}
                {item.certifications && (
                  <div className="mt-5">
                    {/* TODO: confirm which certifications PRSPARES actually holds before publishing */}
                    <p className="text-sm font-semibold leading-6 text-[#52606d]">
                      Compliance available on request. Inspection logs sent with every wholesale order.
                    </p>
                    <CertificationBadges />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7F0] pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Process evidence"
              title="How We Work"
              text="The process evidence below supports the same quote workflow buyers see above: inspect by batch, pack by cargo type and source quickly from Shenzhen."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {trustWorkPhotos.map((photo, index) => (
              <article
                key={photo.image}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#18212c]">
                  <Image src={photo.image} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-transparent to-transparent" />
                </div>
                <p className="p-4 text-sm font-semibold leading-6 text-[#27313c]">{photo.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: enable testimonials section once we have 2-3 real customer
          testimonials with shop name + country approved for publication */}
      {false && (
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-scroll-reveal>
              <SectionTitle
                eyebrow="Verified testimonials"
                title="What Repair Shops Say"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonialPlaceholders.map((item, index) => (
                <article
                  key={item.quote}
                  data-scroll-reveal="scale"
                  style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                  className="rounded-lg border border-[#ded6c8] bg-[#fbfaf7] p-6 shadow-sm"
                >
                  <StarRating />
                  <p className="mt-5 min-h-24 text-xl font-black leading-8 text-[#18212c]">"{item.quote}"</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-[#d4d4d4] blur-[0.4px]" aria-hidden="true" />
                    <div>
                      <p className="font-black text-[#18212c]">— {item.name}</p>
                      <p className="mt-1 text-sm font-semibold text-[#52606d]">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section data-scroll-reveal className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#bff2d0]">Ready for next step</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Send your wholesale parts list.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
              Include compatible model, product category, color/version and quantity. PRSPARES can reply with price tiers, stock status and shipping route.
            </p>
          </div>
          <Link href="/wholesale-inquiry" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]">
            Get Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
