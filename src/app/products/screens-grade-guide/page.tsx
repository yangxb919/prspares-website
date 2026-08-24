import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import ScreenGradeTable, { computeGradeStats } from '@/components/products/ScreenGradeTable';
import WaQuickLink from '@/components/products/WaQuickLink';
import { waProductPrefill } from '@/lib/whatsapp';
import { IPHONE_SCREEN_CATALOG } from '@/data/iphone-screen-catalog';
import { GRADE_TAXONOMY } from '@/data/grade-taxonomy';

// W2 grade hub (Notion plan 点二 / execution plan 2.1). Canonical explainer for
// the four screen grades; all prices and counts computed from the live catalog.

const metaTitle = 'iPhone Screen Grades: Original vs Soft OLED vs Hard OLED vs Incell | PRSPARES';
const metaDescription =
  'Compare all four iPhone replacement screen grades — Original (refurbished original panel), Soft OLED, Hard OLED and Incell — with live wholesale price ranges, True Tone notes and grade-by-grade buying guidance for repair shops and distributors.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords:
    'iphone screen grades, soft oled vs hard oled, incell vs oled iphone screen, original iphone screen wholesale, aftermarket iphone screen quality, screen grade comparison',
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/screens-grade-guide',
    images: [{ url: '/PRSPARES1.png', width: 1200, height: 630, alt: 'iPhone Screen Grade Guide - PRSPARES' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
  alternates: {
    canonical: '/products/screens-grade-guide',
  },
};

const money = (n: number) => `$${n.toFixed(2)}`;

function quoteHref(gradeLabel: string) {
  const params = new URLSearchParams({
    product: `${gradeLabel} iPhone Screen Assemblies`,
    category: 'LCD/OLED Screens',
  });
  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

export default function ScreenGradeGuidePage() {
  const stats = computeGradeStats();
  const totalSkus = IPHONE_SCREEN_CATALOG.length;
  const allMin = Math.min(...IPHONE_SCREEN_CATALOG.map((r) => r.p10));
  const allMax = Math.max(...IPHONE_SCREEN_CATALOG.map((r) => r.p10));

  // Real same-model price spread for the FAQ (cheapest Incell vs Original, iPhone 13).
  const i13 = IPHONE_SCREEN_CATALOG.filter((r) => r.model === 'iPhone 13');
  const i13Incell = Math.min(...i13.filter((r) => r.grade === 'Incell').map((r) => r.p10));
  const i13Original = Math.min(...i13.filter((r) => r.grade === 'Original').map((r) => r.p10));
  const i13SavingPct = Math.round((1 - i13Incell / i13Original) * 100);

  const gradeSummary = GRADE_TAXONOMY.map((g) => g.definition).join(' ');

  // Visible FAQ and FAQPage schema are generated from this single array so the
  // markup can never drift from the on-page answers.
  const faqs: { q: string; a: string }[] = [
    {
      q: 'What is the difference between Original, Soft OLED, Hard OLED and Incell iPhone screens?',
      a: gradeSummary,
    },
    {
      q: 'Are Original grade iPhone screens brand new?',
      a: 'No. Original grade is a refurbished original panel: the factory OLED cell is kept and fitted with new glass, so brightness, color and True Tone match the stock display. It is not a sealed factory Service Pack — we state this openly so buyers know exactly what they are pricing.',
    },
    {
      q: 'Which iPhone screen grade is best for a repair shop?',
      a: 'Soft OLED is the most popular balance of quality and margin for customer-facing repairs, at roughly 90-95% of original display quality. Price-sensitive markets and trade-in refurbishing usually run Incell, while insurance and warranty jobs specify Original grade. Most wholesale orders start at 10-50 units and mix grades in one shipment.',
    },
    {
      q: 'Do aftermarket OLED screens support True Tone?',
      a: 'Yes. True Tone data lives on the original screen IC, and Original, Soft OLED and Hard OLED screens all accept a True Tone transfer using a programmer such as JC V1SE, i2C or JCID. On Incell SKUs True Tone support varies by batch, so confirm it with us before ordering.',
    },
    {
      q: 'How much cheaper is Incell than Original grade?',
      a: `On the price list reviewed August 2026 an iPhone 13 Incell assembly starts at ${money(i13Incell)} at the 10-unit tier versus ${money(i13Original)} for Original grade — about ${i13SavingPct}% less on the same model. Across all iPhone models, Incell runs ${money(stats[3].minP10)}-${money(stats[3].maxP10)} while Original runs ${money(stats[0].minP10)}-${money(stats[0].maxP10)}.`,
    },
    {
      q: 'Can I mix screen grades and models in one wholesale order?',
      a: 'Yes. There is no single-model MOQ — combine any models, grades and product categories in one order, and the published 10+ tier price applies per line once the order totals 10 pcs. Mixed-grade orders are the norm: shops typically pair Soft OLED for premium repairs with Incell for budget jobs. Trial orders start at 5 pcs at the same 10+ unit price, with freight billed separately.',
    },
    {
      q: 'Is JK or GX Soft OLED more expensive?',
      a: 'Neither brand is always more expensive. In the PRSPARES wholesale index, JK Soft OLED sits above GX on the iPhone 16 Pro Max (about $73-75 vs about $59-64), while GX sits above JK on the iPhone 15 Pro Max (about $54-59 vs about $40-44), across the same 10/50/200 tiers and the same canonical grade. Source rows are valid through May 27, 2026. Compare the exact model and request a current quotation — price alone does not establish display quality.',
    },
    {
      q: 'What warranty applies to each screen grade?',
      a: 'All four grades — Original, Soft OLED, Hard OLED and Incell — ship with a 12-month warranty and RMA support. Every batch passes outgoing QC (touch, brightness, True Tone where applicable) before dispatch.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.phonerepairspares.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.phonerepairspares.com/products' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Screen Grade Guide',
        item: 'https://www.phonerepairspares.com/products/screens-grade-guide',
      },
    ],
  };

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero + short answer */}
      <section className="bg-[#18212c] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#7ee2b0]">Screen grade guide · updated August 2026</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-5xl">
            iPhone Screen Grades Explained — Original vs Soft OLED vs Hard OLED vs Incell
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c3ccd6]">
            iPhone replacement screens are sold in four wholesale quality grades. Original is a refurbished original
            panel (factory OLED cell with new glass), Soft OLED and Hard OLED are aftermarket OLED panels, and Incell
            is the budget in-cell LCD tier. PRSPARES stocks {totalSkus} iPhone screen SKUs across all four grades at{' '}
            {money(allMin)}–{money(allMax)} per unit with tiered 10/50/200 pricing and a 12-month warranty. Grade is the starting point, not the whole answer — within a single grade the price order between brands can reverse from one model to the next, so compare the exact model and tier rather than a brand-wide ranking.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products/screens#price-list"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
            >
              See Live Wholesale Prices
            </Link>
            <Link
              href="/wholesale-inquiry#quote-form"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a4656] bg-transparent px-6 py-3 text-base font-bold text-white transition hover:border-[#7ee2b0]"
            >
              Get a Mixed-Grade Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison matrix */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#0b6b45]">Side-by-side comparison</p>
          <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">The Four Grades at a Glance</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
            One standard, used everywhere on this site: every SKU in our{' '}
            <Link href="/products/screens" className="font-bold text-[#0b6b45] underline decoration-2 underline-offset-2">
              live price list
            </Link>{' '}
            is labeled with exactly one of these four grades. Prices below are computed from the current wholesale
            sheet, not typed in by hand.
          </p>
          <div className="mt-8">
            <ScreenGradeTable />
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8a94a0]">
            Indicative 10+ unit pricing (USD) from the July 2026 sheet; ranges span all iPhone models in stock. Confirm
            live pricing before ordering — wholesale rates move frequently.
          </p>
        </div>
      </section>

      {/* Per-grade detail */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">Grade-by-Grade Details</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {stats.map(({ def, skuCount, modelCount, minP10, maxP10 }) => (
              <div key={def.key} className="rounded-lg border border-[#e4dccb] bg-white p-6">
                <h3 className="text-xl font-black text-[#18212c]">{def.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{def.definition}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-[#18212c]">Best for</dt>
                    <dd className="text-right text-[#52606d]">{def.bestFor}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-[#18212c]">In stock</dt>
                    <dd className="text-[#52606d]">
                      {skuCount} SKUs · {modelCount} iPhone models
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-[#18212c]">Price (10+ units)</dt>
                    <dd className="font-mono font-bold text-[#0b6b45]">
                      {money(minP10)} – {money(maxP10)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-center gap-4">
                  <Link href={quoteHref(def.label)} className="text-sm font-bold text-[#ff8a2a] hover:text-[#0b6b45]">
                    Quote {def.label} →
                  </Link>
                  <WaQuickLink
                    message={waProductPrefill(`${def.label} iPhone screens`, minP10)}
                    eventLabel={`Grade Guide WA: ${def.label}`}
                    className="text-sm font-bold text-[#0b6b45] hover:text-[#1f7a52]"
                  >
                    WhatsApp
                  </WaQuickLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to choose */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">How Buyers Match Grades to Jobs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-[#e4dccb] p-6">
              <h3 className="text-lg font-black text-[#18212c]">Independent repair shops</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Stock Soft OLED for customer-facing repairs and Incell for budget quotes. Most of our wholesale orders
                start at 10–50 units and mix both in one shipment.
              </p>
            </div>
            <div className="rounded-lg border border-[#e4dccb] p-6">
              <h3 className="text-lg font-black text-[#18212c]">Refurbishers &amp; trade-in</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Incell keeps unit economics working on older models; step up to Hard OLED where resale price supports
                it. Tiered 200+ pricing applies per line.
              </p>
            </div>
            <div className="rounded-lg border border-[#e4dccb] p-6">
              <h3 className="text-lg font-black text-[#18212c]">Insurance &amp; warranty work</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Original grade matches stock brightness, color and True Tone — the spec-first choice when the job sheet
                requires original display quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — visible content mirrors FAQPage schema exactly */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-[#e4dccb] bg-white p-6">
                <h3 className="text-lg font-bold text-[#18212c]">{f.q}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">Ready to Price Your Grade Mix?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#52606d]">
            Send your model list and quantities — we quote all four grades side by side with live 10/50/200 tier
            pricing, batch QC and a 12-month warranty.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/wholesale-inquiry#quote-form"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
            >
              Get a Wholesale Quote
            </Link>
            <Link
              href="/products/screens#price-list"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#ded6c8] bg-white px-6 py-3 text-base font-bold text-[#18212c] transition hover:border-[#0b6b45]"
            >
              Browse the Live Price List
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
