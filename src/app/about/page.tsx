import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Factory,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import JsonLd from '@/components/JsonLd';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export const metadata: Metadata = {
  title: 'About PRSPARES | Shenzhen Phone Parts Supplier',
  description:
    'PRSPARES is a B2B wholesale phone repair parts supplier based in Shenzhen Huaqiangbei. Stock, QC, packing and global logistics support for repair businesses.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About PRSPARES — Shenzhen Wholesale Phone Parts Supplier',
    description:
      'A Shenzhen phone repair parts sourcing partner built around stock, QC, packing and fast B2B support.',
    type: 'website',
    url: '/about',
    images: ['/hero/about.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PRSPARES — Shenzhen Wholesale Phone Parts Supplier',
    description:
      'A Shenzhen phone repair parts sourcing partner built around stock, QC, packing and fast B2B support.',
    images: ['/hero/about.jpg'],
  },
};

type InfoCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const capabilityCards: InfoCard[] = [
  {
    icon: Factory,
    title: 'Huaqiangbei access',
    text: 'Close to first-tier electronics vendors and fast restocking channels for phone repair parts.',
  },
  {
    icon: ShieldCheck,
    title: 'Pre-shipment QC',
    text: 'Screens, batteries and small parts are checked by batch before packing and dispatch.',
  },
  {
    icon: Users,
    title: 'B2B account support',
    text: 'Repeat buyers get practical help on model mixes, quality grades, packing and shipping routes.',
  },
];

const aboutJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PRSPARES',
    url: absoluteUrl('/about'),
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/about.jpg'),
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
        name: 'About',
        item: absoluteUrl('/about'),
      },
    ],
  },
];

function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#111922] text-white">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.94),rgba(10,16,24,0.72)_45%,rgba(10,16,24,0.26))]" />
      <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
            {eyebrow}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313]">
              Get Wholesale Quote
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricStrip() {
  const items: Array<[string, string, string]> = [
    ['10+', 'years', 'Huaqiangbei sourcing experience'],
    ['50+', 'countries', 'B2B shipping reach'],
    ['27k+', 'catalog lines', 'Major repair categories covered'],
    ['24h', 'quote response', 'Stock, price and route feedback'],
  ];

  return (
    <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map(([value, label, detail]) => (
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

function CardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((item) => (
        <div key={item.title} className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
          <item.icon className="h-8 w-8 text-[#0b6b45]" />
          <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#0b6b45] py-14 text-white md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold text-[#bff2d0]">Ready for next step</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Send your model list for a quote.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
            PRSPARES can return stock status, price tiers, grade options and shipping route within 24 hours.
          </p>
        </div>
        <Link href="/wholesale-inquiry" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]">
          Get Wholesale Quote
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <JsonLd data={aboutJsonLd} />
      <PageHero
        eyebrow="About PRSPARES / Huaqiangbei sourcing base"
        title="A Shenzhen Parts Partner Built Around Stock, QC and Speed"
        text="PRSPARES supports repair shops, wholesalers and sourcing teams with phone repair parts from Shenzhen's electronics supply chain: screens, batteries, small parts, tools and fast quote support."
        image="/hero/about.jpg"
      />

      <MetricStrip />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#0b6b45]">Company narrative</p>
            <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">From local sourcing to global repair supply.</h2>
            <p className="mt-5 text-base leading-7 text-[#52606d]">
              The company page now focuses on operational proof: inventory access, QC workflow, packing discipline, logistics support and practical account service for repeat buyers.
            </p>
          </div>
          <CardGrid cards={capabilityCards} />
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Operational proof" title="Real supply-chain moments, not vague claims." />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ['/images/home-redesign/proof-stock-shelves.png', 'Inventory shelves'],
              ['/images/home-redesign/proof-packing-station.png', 'Packing station'],
              ['/images/home-redesign/proof-sku-coverage.png', 'SKU coverage'],
            ].map(([src, label]) => (
              <div key={label} className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <Image src={src} alt={label} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="How PRSPARES helps"
            title="Built for repeated B2B buying."
            text="Instead of asking buyers to checkout one SKU at a time, the site guides them toward the faster workflow: send model list, confirm availability, receive quote tiers, ship."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Check', text: 'Confirm compatible models, quality grades and stock availability before quoting.' },
              { icon: Truck, title: 'Pack', text: 'Prepare mixed orders, export packing and battery shipment requirements where needed.' },
              { icon: Users, title: 'Support', text: 'Follow up on reorder lists, warranty questions and urgent repair-shop demand.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6">
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
