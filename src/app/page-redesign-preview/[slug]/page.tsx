import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Factory,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';

type PageParams = {
  params: {
    slug: string;
  };
};

type InfoCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const pageLinks = [
  { label: 'Products', href: '/page-redesign-preview/products' },
  { label: 'Screens', href: '/page-redesign-preview/screens' },
  { label: 'Inquiry', href: '/page-redesign-preview/wholesale-inquiry' },
  { label: 'About', href: '/page-redesign-preview/about' },
  { label: 'Contact', href: '/page-redesign-preview/contact' },
];

const categoryCards = [
  {
    name: 'LCD & OLED Screens',
    href: '/products/screens',
    image: '/images/home-redesign/category-screens.png',
    metric: '70+ models',
    price: 'From $19',
    text: 'OEM, soft OLED, hard OLED and Incell LCD grades for iPhone and Samsung repairs.',
    items: ['iPhone 6-16 series', 'Samsung S/A/Z series', 'True Tone support'],
  },
  {
    name: 'Batteries',
    href: '/products/batteries',
    image: '/images/home-redesign/category-batteries.png',
    metric: '45+ models',
    price: 'From $5',
    text: 'Standard and high-capacity replacement batteries with compliant export packing.',
    items: ['iPhone batteries', 'Samsung batteries', 'UN38.3 support'],
  },
  {
    name: 'Small Parts',
    href: '/products/small-parts',
    image: '/images/home-redesign/category-small-parts.png',
    metric: '65+ items',
    price: 'From $2',
    text: 'Cameras, charging ports, flex cables, speakers and internal components.',
    items: ['Camera modules', 'Charging ports', 'Back covers'],
  },
  {
    name: 'Repair Tools',
    href: '/products/repair-tools',
    image: '/images/home-redesign/category-repair-tools.png',
    metric: '45+ tools',
    price: 'From $3',
    text: 'Testing, programming, soldering and opening tools for repair benches.',
    items: ['Screen testers', 'Programmers', 'Soldering tools'],
  },
];

const screenProducts = [
  ['iPhone 16 Pro Max', 'Soft OLED', '$85', '120Hz / True Tone'],
  ['iPhone 15 Pro Max', 'OEM Original', '$199', 'Super Retina XDR'],
  ['iPhone 14 Pro Max', 'Incell LCD', '$29', 'Budget repair'],
  ['Samsung S24 Ultra', 'OLED Assembly', '$189', 'With frame'],
  ['Galaxy A54 / A53', 'AMOLED', '$29', 'Popular stock'],
  ['iPhone 13 Pro Max', 'Hard OLED', '$42', 'IC transfer'],
];

const gradeRows = [
  ['OEM Original', '100%', '100%', 'Premium repairs', '$$$$$'],
  ['OEM Refurbished', '95%', '95%', 'Balanced margin', '$$$$'],
  ['Soft OLED', '90%', '90%', 'Best aftermarket', '$$$'],
  ['Hard OLED', '85%', '85%', 'Durable value', '$$'],
  ['Incell LCD', '75%', '80%', 'Budget orders', '$'],
];

const serviceCards: InfoCard[] = [
  {
    icon: Wrench,
    title: 'Repair Shops',
    text: 'Small and chain repair shops that reorder popular models every week.',
  },
  {
    icon: Boxes,
    title: 'Wholesalers',
    text: 'Regional distributors needing mixed model supply and clear price tiers.',
  },
  {
    icon: ClipboardCheck,
    title: 'Sourcing Teams',
    text: 'Procurement buyers who need QC, packing, warranty and logistics visibility.',
  },
];

const trustCards: InfoCard[] = [
  {
    icon: ShieldCheck,
    title: 'Batch QC',
    text: 'Screens, batteries and small parts checked before shipment.',
  },
  {
    icon: Truck,
    title: 'Fast Dispatch',
    text: 'Popular in-stock orders move to packing the same day.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Support',
    text: 'Quick model checks, stock updates and order follow-up.',
  },
];

function PreviewNav({ active }: { active: string }) {
  return (
    <div className="border-b border-[#ddd4c6] bg-[#fffaf0]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <span className="mr-2 text-xs font-black uppercase text-[#0b6b45]">Preview Pages</span>
        {pageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
              link.href.endsWith(active)
                ? 'border-[#0b6b45] bg-[#0b6b45] text-white'
                : 'border-[#e4d8c2] bg-white text-[#27313c] hover:border-[#ff8a2a]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  children?: React.ReactNode;
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
        {children}
      </div>
    </section>
  );
}

function MetricStrip({ items }: { items: Array<[string, string, string]> }) {
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

function CategoryGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categoryCards.map((category) => (
        <div key={category.name} className="rounded-lg border border-[#e4e0d8] bg-white shadow-sm">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            <Image src={category.image} alt={category.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <h3 className="text-lg font-black leading-6 text-white">{category.name}</h3>
              <span className="shrink-0 rounded-md bg-[#ff8a2a] px-2 py-1 text-xs font-black text-white">{category.price}</span>
            </div>
          </div>
          <div className="p-5">
            <div className="font-mono text-xs font-bold text-[#0b6b45]">{category.metric}</div>
            <p className="mt-2 min-h-14 text-sm leading-6 text-[#52606d]">{category.text}</p>
            <ul className="mt-4 space-y-2">
              {category.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#27313c]">
                  <CheckCircle2 className="h-4 w-4 text-[#0b6b45]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
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
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">PRSPARES can return stock status, price tiers, grade options and shipping route within 24 hours.</p>
        </div>
        <Link href="/wholesale-inquiry" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]">
          Get Wholesale Quote
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

function ProductsPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <PreviewNav active="products" />
      <PageHero
        eyebrow="Product catalog / 500+ stocked SKUs"
        title="Wholesale Mobile Repair Parts, Organized for Fast Buying"
        text="A products page that behaves like a procurement landing page: category coverage, stock depth, grade options and quote entry are all visible before the buyer gets lost."
        image="/images/home-redesign/hero-warehouse-stock.png"
      >
        <div className="hidden rounded-lg border border-white/20 bg-black/25 p-5 backdrop-blur lg:block">
          <Image src="/images/home-redesign/proof-sku-coverage.png" alt="SKU coverage" width={620} height={390} className="rounded-md object-cover" />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {['Screens', 'Batteries', 'Small Parts'].map((item) => (
              <div key={item} className="border border-white/15 bg-white/10 p-3 text-sm font-bold">{item}</div>
            ))}
          </div>
        </div>
      </PageHero>
      <MetricStrip items={[['500+', 'SKUs ready', 'Core repair demand covered'], ['95%+', 'in-stock rate', 'Popular models on shelf'], ['10pcs', 'MOQ from', 'Small shops can reorder'], ['50+', 'countries', 'Global express shipping']]} />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Category architecture" title="One page, four buying paths." text="Each category block shows stock depth, price entry and the specific parts buyers expect to source from that page." />
          <CategoryGrid />
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#ffb36b]">Supplier capability</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Buyers need proof before they browse.</h2>
            <p className="mt-5 text-base leading-7 text-slate-200">The page leads with warehouse reality, then makes category browsing feel like a quote workflow.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {trustCards.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <item.icon className="h-7 w-7 text-[#51d88a]" />
                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

function ScreensPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <PreviewNav active="screens" />
      <PageHero
        eyebrow="Screens category / LCD, OLED, Incell"
        title="Wholesale Phone Screens with Clear Grade Choices"
        text="The screen page should help buyers compare model, grade and price quickly, while still showing real product photography and QC credibility."
        image="/images/home-redesign/category-screens.png"
      >
        <div className="hidden rounded-lg border border-white/20 bg-black/25 p-5 backdrop-blur lg:block">
          <div className="grid grid-cols-2 gap-3">
            {['OEM Original', 'Soft OLED', 'Hard OLED', 'Incell LCD'].map((grade) => (
              <div key={grade} className="border border-white/15 bg-white/10 p-4">
                <div className="font-bold">{grade}</div>
                <div className="mt-1 text-xs text-slate-300">Bulk quote available</div>
              </div>
            ))}
          </div>
        </div>
      </PageHero>
      <MetricStrip items={[['500+', 'screen SKUs', 'iPhone and Samsung focus'], ['5', 'quality grades', 'OEM to budget'], ['$19', 'starting price', 'Incell wholesale entry'], ['<1%', 'RMA target', 'Batch QC before shipping']]} />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Screen catalog" title="Model, grade and price visible at a glance." text="The design avoids overwhelming buyers with endless SKU tables at the top, but still gives enough commercial data to move them toward inquiry." />
          <div className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm">
            <div className="grid grid-cols-[1.1fr_0.9fr_0.45fr_1fr] bg-[#18212c] px-5 py-4 text-sm font-black text-white">
              <span>Model</span><span>Grade</span><span>From</span><span>Notes</span>
            </div>
            {screenProducts.map(([model, grade, price, note]) => (
              <div key={`${model}-${grade}`} className="grid grid-cols-[1.1fr_0.9fr_0.45fr_1fr] border-t border-[#ece5da] px-5 py-4 text-sm">
                <span className="font-bold text-[#18212c]">{model}</span>
                <span className="text-[#52606d]">{grade}</span>
                <span className="font-mono font-black text-[#ff8a2a]">{price}</span>
                <span className="text-[#52606d]">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Grade comparison" title="Make quality tradeoffs easy to understand." text="Repair shops can pick the right screen grade for premium, balanced or budget customer jobs." />
          <div className="grid gap-3 md:grid-cols-5">
            {gradeRows.map(([grade, color, brightness, use, price]) => (
              <div key={grade} className="rounded-lg border border-[#ded6c8] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-[#18212c]">{grade}</h3>
                <div className="mt-4 space-y-2 text-sm text-[#52606d]">
                  <p><span className="font-bold text-[#18212c]">Color:</span> {color}</p>
                  <p><span className="font-bold text-[#18212c]">Bright:</span> {brightness}</p>
                  <p><span className="font-bold text-[#18212c]">Use:</span> {use}</p>
                </div>
                <div className="mt-5 font-mono text-xl font-black text-[#ff8a2a]">{price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

function InquiryPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <PreviewNav active="wholesale-inquiry" />
      <PageHero
        eyebrow="Wholesale inquiry / quote workflow"
        title="A Faster Quote Page for Mixed Parts Lists"
        text="The inquiry page should feel like a purchasing tool, not a generic contact form. It asks for model, grade, quantity and category in a compact, confident flow."
        image="/images/home-redesign/proof-packing-station.png"
      >
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
              <div key={field} className="rounded-md border border-[#ded6c8] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#52606d]">{field}</div>
            ))}
            <button className="mt-1 rounded-md bg-[#ff8a2a] px-4 py-3 text-sm font-black text-white">Submit Quote Request</button>
          </div>
        </div>
      </PageHero>
      <MetricStrip items={[['24h', 'quote response', 'Price, MOQ and lead time'], ['10pcs', 'screen MOQ', 'Mixed models accepted'], ['3-7d', 'express shipping', 'DHL, FedEx, UPS'], ['12mo', 'warranty', 'Defect replacement support']]} />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Form logic" title="Ask only what sales needs to quote." text="The page uses procurement-oriented form fields and places trust proof right beside the form, reducing hesitation before submission." />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ['1', 'Pick category', 'Screens, batteries, small parts, tools or mixed order.'],
              ['2', 'List models', 'Paste model names or upload/order by conversation later.'],
              ['3', 'Confirm quote', 'Sales returns price tiers, stock and route.'],
            ].map(([num, title, text]) => (
              <div key={title} className="rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6">
                <div className="font-mono text-sm font-black text-[#ff8a2a]">0{num}</div>
                <h3 className="mt-4 text-xl font-black text-[#18212c]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

function AboutPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <PreviewNav active="about" />
      <PageHero
        eyebrow="About PRSPARES / Huaqiangbei sourcing base"
        title="A Shenzhen Parts Partner Built Around Stock, QC and Speed"
        text="The About page should not feel like a generic company story. It should prove why PRSPARES is a reliable sourcing partner for repair businesses."
        image="/images/home-redesign/proof-stock-shelves.png"
      />
      <MetricStrip items={[['10+', 'years', 'Huaqiangbei experience'], ['50+', 'countries', 'B2B shipping reach'], ['500+', 'SKUs', 'Core repair categories'], ['<1%', 'RMA rate', 'QC-driven supply']]} />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#0b6b45]">Company narrative</p>
            <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">From local sourcing to global repair supply.</h2>
            <p className="mt-5 text-base leading-7 text-[#52606d]">The redesigned page frames PRSPARES around operational proof: inventory, packing, QC, logistics and account support.</p>
          </div>
          <CardGrid cards={[
            { icon: Factory, title: 'Huaqiangbei access', text: 'Close to first-tier electronics vendors and fast restocking channels.' },
            { icon: ShieldCheck, title: 'Pre-shipment QC', text: 'Parts are checked by batch before packing and dispatch.' },
            { icon: Users, title: 'B2B account support', text: 'Repeat buyers get practical help on model mixes and grade choices.' },
          ]} />
        </div>
      </section>

      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Visual proof" title="Use real operational photos instead of vague claims." />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ['/images/home-redesign/proof-stock-shelves.png', 'Inventory shelves'],
              ['/images/home-redesign/proof-packing-station.png', 'Packing station'],
              ['/images/home-redesign/proof-sku-coverage.png', 'SKU coverage'],
            ].map(([src, label]) => (
              <div key={label} className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <Image src={src} alt={label} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-sm font-black text-[#18212c]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

function ContactPreview() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <PreviewNav active="contact" />
      <PageHero
        eyebrow="Contact / sales support"
        title="Contact PRSPARES for Stock, Quote and Order Support"
        text="The Contact page should route buyers to the right channel: quote form for pricing, WhatsApp for urgent model checks, email for after-sales support."
        image="/images/home-redesign/proof-packing-station.png"
      />
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Contact routing" title="Help buyers choose the fastest channel." text="This page turns contact information into a clear decision surface instead of a static address block." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquare, title: 'Inquiry Form', text: 'Best for wholesale pricing and mixed model quotes.', action: 'Get Quote' },
              { icon: Phone, title: 'WhatsApp', text: 'Best for urgent stock checks and quick negotiation.', action: 'Chat Now' },
              { icon: Mail, title: 'Email', text: 'Best for order support, warranty and documents.', action: 'Send Email' },
              { icon: MapPin, title: 'Shenzhen Office', text: 'Huaqiangbei electronics supply chain base.', action: 'View Details' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[#52606d]">{item.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a]">{item.action}<ArrowRight className="h-4 w-4" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#ffb36b]">Support expectations</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">What happens after a buyer contacts you?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Clock, title: '24h response', text: 'Sales confirms stock, quantity and model details.' },
              { icon: Search, title: 'Model check', text: 'Team verifies compatibility and grade options.' },
              { icon: PackageCheck, title: 'Quote ready', text: 'Buyer receives price tiers and shipping route.' },
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
      <FinalCta />
    </main>
  );
}

export default function PageRedesignPreview({ params }: PageParams) {
  if (params.slug === 'products') return <ProductsPreview />;
  if (params.slug === 'screens') return <ScreensPreview />;
  if (params.slug === 'wholesale-inquiry') return <InquiryPreview />;
  if (params.slug === 'about') return <AboutPreview />;
  if (params.slug === 'contact') return <ContactPreview />;
  notFound();
}
