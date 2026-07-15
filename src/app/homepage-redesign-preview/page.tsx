import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
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
  { value: '500+', label: 'SKUs ready', detail: 'Screens, batteries, cameras, tools' },
  { value: '95%+', label: 'in-stock rate', detail: 'Popular models kept on shelf' },
  { value: '3-7d', label: 'global express', detail: 'DHL, FedEx, UPS routes' },
  { value: '10pcs', label: 'MOQ from', detail: 'Mix models in one order' },
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
    stock: '70+ models',
    detail: 'OEM, soft OLED, hard OLED and Incell LCD grades',
    items: ['iPhone 6-16 series', 'Samsung S/A/Z series', 'True Tone support'],
  },
  {
    name: 'Batteries',
    href: '/products/batteries',
    image: '/images/home-redesign/category-batteries.png',
    from: 'From $5',
    stock: '45+ models',
    detail: 'Standard and high-capacity options with compliant packing',
    items: ['iPhone batteries', 'Samsung batteries', 'UN38.3 support'],
  },
  {
    name: 'Small Parts',
    href: '/products/small-parts',
    image: '/images/home-redesign/category-small-parts.png',
    from: 'From $2',
    stock: '65+ items',
    detail: 'Cameras, charging ports, flex cables and speakers',
    items: ['Camera modules', 'Charging ports', 'Back covers'],
  },
  {
    name: 'Repair Tools',
    href: '/products/repair-tools',
    image: '/images/home-redesign/category-repair-tools.png',
    from: 'From $3',
    stock: '45+ tools',
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
    text: 'Screens, batteries and small parts are checked before packing to keep RMA below 1%.',
  },
  {
    icon: CircleDollarSign,
    title: 'Wholesale price logic',
    text: 'Multiple grade choices help repair shops match budget, margin and customer expectations.',
  },
  {
    icon: PackageCheck,
    title: 'Export-ready packing',
    text: 'Foam, anti-static bags and courier labels are handled for mixed model orders.',
  },
  {
    icon: Zap,
    title: 'Same-day dispatch window',
    text: 'Orders confirmed before 3 PM China time can move into packing the same day.',
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
  },
  {
    src: '/images/home-redesign/proof-packing-station.png',
    alt: 'PRSPARES packing station for wholesale phone repair parts orders',
    label: 'Packing station',
  },
  {
    src: '/images/home-redesign/proof-sku-coverage.png',
    alt: 'Complete mobile repair parts SKU coverage for multiple brands',
    label: 'Complete SKU coverage',
  },
];

export default function HomepageRedesignPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <section className="relative min-h-[calc(100svh-150px)] overflow-hidden bg-[#101820] text-white">
        <Image
          src="/images/home-redesign/hero-warehouse-stock.png"
          alt="PRSPARES warehouse stock shelves"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.92),rgba(10,16,24,0.68)_42%,rgba(10,16,24,0.24)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,177,64,0.22),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(255,139,47,0.2),transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-150px)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl pt-8 md:pt-14">
            <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
              PRSPARES / Shenzhen Huaqiangbei sourcing partner
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl">
              Mobile Phone Repair Parts, Ready for Wholesale Orders
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl">
              500+ stocked SKUs for repair shops, wholesalers and sourcing teams. Mix screens, batteries, small parts and tools in one shipment.
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
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className="mt-10 grid border-y border-white/20 bg-black/20 backdrop-blur md:grid-cols-4">
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

      <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1.1fr_1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#0b6b45]">Fast stock check</p>
            <h2 className="mt-1 text-2xl font-black text-[#18212c]">Send a mixed parts list and get exact wholesale pricing.</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#3c4652] sm:grid-cols-4">
            {['iPhone OLED', 'Samsung AMOLED', 'Battery DG packing', 'Screen tester'].map((item) => (
              <span key={item} className="rounded-md border border-[#e4d8c2] bg-white px-3 py-2 font-semibold">
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/wholesale-inquiry"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#18212c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2a3440]"
          >
            Start Inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Who we serve</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Built for buyers who reorder often.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              The homepage should answer three questions fast: can PRSPARES cover my models, can they ship quickly, and can they protect my margin?
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
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
            {productCategories.map((category) => (
              <Link key={category.name} href={category.href} className="group rounded-lg border border-[#e4e0d8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#ff8a2a] hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image src={category.image} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" />
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
          <div>
            <p className="text-sm font-bold text-[#ffb36b]">Why PRSPARES</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Wholesale buying should feel predictable.</h2>
            <p className="mt-5 text-base leading-7 text-slate-200">
              The redesigned homepage keeps the proof close to the purchase decision: stock, quality, dispatch and support.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ['12 mo', 'warranty'],
                ['<1%', 'RMA rate'],
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
            {advantages.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <item.icon className="h-7 w-7 text-[#51d88a]" />
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
                <div key={step.title} className="relative rounded-lg border border-[#ded6c8] bg-white p-5 shadow-sm">
                  <div className="font-mono text-sm font-black text-[#ff8a2a]">0{index + 1}</div>
                  <step.icon className="mt-4 h-7 w-7 text-[#0b6b45]" />
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
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Trust proof</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Show the stock, packing and SKU depth.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              Visual proof replaces vague claims. Buyers can immediately see inventory organization, dispatch handling and category coverage.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {proofImages.map((image, index) => (
              <div key={image.src} className={index === 0 ? 'lg:col-span-2' : ''}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#18212c]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="eager"
                    className="object-cover"
                    sizes={index === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">{image.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#bff2d0]">Final CTA</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Ready to check wholesale stock?</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
              Send your model list today. PRSPARES can return exact pricing, MOQ, grade options and shipping route.
            </p>
          </div>
          <Link
            href="/wholesale-inquiry"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]"
          >
            Get Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
