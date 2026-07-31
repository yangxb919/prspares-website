import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import WholesaleScreenTable from '@/components/products/WholesaleScreenTable';
import WaQuickLink from '@/components/products/WaQuickLink';
import { waProductPrefill } from '@/lib/whatsapp';
import { IPHONE_SCREEN_CATALOG } from '@/data/iphone-screen-catalog';
import { GRADE_TAXONOMY } from '@/data/grade-taxonomy';
import { SCREEN_BRANDS, type ScreenBrandDef } from '@/data/screen-brands';

// W3-4 panel-brand landing page (GX / JK pilot). Same zero-fake contract as the
// grade guide: every count and price is computed from the live catalog at build
// time; FAQ answers and FAQPage schema render from one array so they never drift.
// No Product/AggregateOffer schema here — /products/screens stays the single
// price-authority page.

const money = (n: number) => `$${n.toFixed(2)}`;

function brandRows(label: string) {
  return IPHONE_SCREEN_CATALOG.filter((r) => r.brand === label);
}

function gradeList(label: string) {
  const rows = brandRows(label);
  return GRADE_TAXONOMY.filter((g) => rows.some((r) => r.grade === g.label)).map((g) => {
    const gr = rows.filter((r) => r.grade === g.label);
    return {
      def: g,
      skuCount: gr.length,
      modelCount: new Set(gr.map((r) => r.model)).size,
      minP10: Math.min(...gr.map((r) => r.p10)),
      maxP10: Math.max(...gr.map((r) => r.p10)),
    };
  });
}

/** e.g. "24 soft OLED and 16 incell SKUs" — computed, reused in prose + FAQ */
function gradeMixSentence(label: string) {
  return gradeList(label)
    .map((s) => `${s.skuCount} ${s.def.label} SKU${s.skuCount > 1 ? 's' : ''}`)
    .join(', ')
    .replace(/, ([^,]+)$/, ' and $1');
}

export default function BrandScreenPage({ brand }: { brand: ScreenBrandDef }) {
  const rows = brandRows(brand.label);
  const stats = gradeList(brand.label);
  const models = new Set(rows.map((r) => r.model)).size;
  const low = Math.min(...rows.map((r) => r.p10));
  const high = Math.max(...rows.map((r) => r.p10));

  // Real price example for the FAQ: iPhone 13 if the brand stocks it, else the
  // model with the most SKUs in this brand's line.
  const exampleModel = rows.some((r) => r.model === 'iPhone 13')
    ? 'iPhone 13'
    : [...new Set(rows.map((r) => r.model))]
        .map((m) => ({ m, n: rows.filter((r) => r.model === m).length }))
        .sort((a, b) => b.n - a.n)[0].m;
  const examplePrice = Math.min(...rows.filter((r) => r.model === exampleModel).map((r) => r.p10));

  const sibling = SCREEN_BRANDS.find((b) => b.key !== brand.key)!;
  const siblingMix = gradeMixSentence(sibling.label);
  const hasOled = stats.some((s) => s.def.key === 'soft-oled' || s.def.key === 'hard-oled');
  const hasIncell = stats.some((s) => s.def.key === 'incell');

  // Model-coverage delta vs the sibling brand — computed, so each brand page
  // renders a different concrete list instead of shared template prose.
  const siblingRows = brandRows(sibling.label);
  const siblingModelSet = new Set(siblingRows.map((r) => r.model));
  const brandModelList = [...new Set(rows.map((r) => r.model))];
  const onlyHere = brandModelList.filter((m) => !siblingModelSet.has(m));
  const siblingLow = Math.min(...siblingRows.map((r) => r.p10));
  const siblingHigh = Math.max(...siblingRows.map((r) => r.p10));
  const topGrade = [...stats].sort((a, b) => b.skuCount - a.skuCount)[0];
  const linePct = Math.round((topGrade.skuCount / rows.length) * 100);

  // Visible FAQ and FAQPage schema render from this single array (no drift).
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is a ${brand.label} iPhone screen?`,
      a: `${brand.definition} PRSPARES currently stocks ${rows.length} ${brand.label} iPhone screen assemblies covering ${models} iPhone models, priced ${money(low)}–${money(high)} per unit at the 10-unit wholesale tier.`,
    },
    {
      q: brand.gradeFaqQ,
      a: `On the current price sheet the ${brand.label} line is ${gradeMixSentence(brand.label)}. ${brand.positioning}`,
    },
    {
      q: `How much do ${brand.label} iPhone screens cost wholesale?`,
      a: `${brand.label} iPhone screens run ${money(low)}–${money(high)} per unit at the 10-unit tier on the July 2026 price sheet — for example, an ${exampleModel} ${brand.label} assembly starts at ${money(examplePrice)}. Prices step down at the 50+ and 200+ tiers, and wholesale rates move frequently, so confirm a live quote before ordering.`,
    },
    {
      q: 'GX vs JK — which should I stock?',
      a: `Both are established aftermarket panel brands and the choice follows your repair menu. GX is ${gradeMixSentence('GX').includes('Soft OLED') ? 'almost entirely soft OLED' : 'mainly soft OLED'} (${gradeMixSentence('GX')}) and suits shops selling "like-original" OLED repairs. JK spans two price points (${gradeMixSentence('JK')}), so it fits shops running a premium OLED tier plus a budget incell tier from one brand. Many buyers stock both and split by job type.`,
    },
    {
      q: `Which iPhone models does ${brand.label} cover that ${sibling.label} does not?`,
      a: onlyHere.length
        ? `On the current price sheet ${onlyHere.length} model${onlyHere.length > 1 ? 's are' : ' is'} available under the ${brand.label} label but not under ${sibling.label}: ${onlyHere.join(', ')}. ${brand.label} spans ${models} iPhone models at ${money(low)}–${money(high)} per unit versus ${siblingModelSet.size} models at ${money(siblingLow)}–${money(siblingHigh)} for ${sibling.label}, so model coverage — not just grade — is often what decides which brand a shop standardises on.`
        : `Every iPhone model we stock under ${brand.label} is also available under ${sibling.label}, so the choice between them comes down to grade mix and price rather than model coverage.`,
    },
    {
      q: `Do ${brand.label} screens support True Tone?`,
      a: `${hasOled ? `${brand.label} soft OLED${stats.some((s) => s.def.key === 'hard-oled') ? ' and hard OLED' : ''} screens accept a True Tone transfer using a programmer such as JC V1SE, i2C or JCID.` : ''}${hasIncell ? ` On ${brand.label} incell SKUs True Tone support varies by batch, so confirm it with us before ordering.` : ''}`.trim(),
    },
    {
      q: `What warranty applies to ${brand.label} screens?`,
      a: `Every ${brand.label} screen ships with the same 12-month warranty and RMA support as the rest of our catalog. Batches pass incoming and outgoing QC (touch, brightness, True Tone where applicable) before dispatch. There is no single-model MOQ: mix ${brand.label} SKUs with any other models, grades and product categories, and the published 10+ tier price applies to every line once the order totals 10 pieces.`,
    },
    {
      q: `Is PRSPARES affiliated with the ${brand.label} factory?`,
      a: `No. ${brand.label} is an independent third-party panel manufacturer. PRSPARES is an independent wholesale supplier: we source ${brand.label} panels factory-direct in Shenzhen, run our own incoming QC and back them with our own 12-month warranty. Brand names are used for compatibility identification only.`,
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
        name: 'iPhone Screens',
        item: 'https://www.phonerepairspares.com/products/screens',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${brand.label} Screens`,
        item: `https://www.phonerepairspares.com/products/screens/${brand.key}`,
      },
    ],
  };

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero + definitional short answer */}
      <section className="bg-[#18212c] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#7ee2b0]">{brand.label} panel brand · updated July 2026</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-5xl">{brand.h1}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c3ccd6]">
            {brand.definition} PRSPARES stocks {rows.length} {brand.label} iPhone screen assemblies covering {models}{' '}
            iPhone models at {money(low)}–{money(high)} per unit, with tiered 10/50/200 wholesale pricing and a
            12-month warranty. There is no single-model MOQ — mix models and categories to reach the 10-piece order
            minimum.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#price-list"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
            >
              See {brand.label} Prices
            </Link>
            <Link
              href="/wholesale-inquiry#quote-form"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a4656] bg-transparent px-6 py-3 text-base font-bold text-white transition hover:border-[#7ee2b0]"
            >
              Get a Wholesale Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Grade breakdown for this brand — computed */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#0b6b45]">What&apos;s in the {brand.label} line</p>
          <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">
            {brand.label} Screens by Grade
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
            {brand.positioning} Grade definitions follow our{' '}
            <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] underline decoration-2 underline-offset-2">
              four-grade standard
            </Link>{' '}
            used across the whole catalog.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {stats.map(({ def, skuCount, modelCount, minP10, maxP10 }) => (
              <div key={def.key} className="rounded-lg border border-[#e4dccb] bg-white p-6">
                <h3 className="text-xl font-black text-[#18212c]">
                  {brand.label} {def.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{def.note}</p>
                <dl className="mt-4 space-y-2 text-sm">
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
                <div className="mt-5">
                  <WaQuickLink
                    message={waProductPrefill(`${brand.label} ${def.label} iPhone screens`, minP10)}
                    eventLabel={`Brand Page WA: ${brand.label} ${def.label}`}
                    className="text-sm font-bold text-[#0b6b45] hover:text-[#1f7a52]"
                  >
                    WhatsApp for {brand.label} {def.label} stock
                  </WaQuickLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full brand price table (no Product schema in brand mode) */}
      <WholesaleScreenTable brand={brand.label} />

      {/* Brand comparison + sibling cross-link */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">
            {brand.label} vs {sibling.label}: Which Fits Your Menu?
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 border-[#0b6b45] bg-white p-6">
              <h3 className="text-lg font-black text-[#18212c]">{brand.label}</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                {gradeMixSentence(brand.label)} across {models} iPhone models, {money(low)}–{money(high)} at the 10+
                tier. {brand.bestFor}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4dccb] bg-white p-6">
              <h3 className="text-lg font-black text-[#18212c]">{sibling.label}</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                {siblingMix}. {sibling.bestFor}
              </p>
              <Link
                href={`/products/screens/${sibling.key}`}
                className="mt-4 inline-block text-sm font-bold text-[#ff8a2a] hover:text-[#0b6b45]"
              >
                See {sibling.label} prices →
              </Link>
            </div>
          </div>

          {/* Model-coverage delta — computed per brand, so this block differs on every brand page */}
          <div className="mt-8 rounded-lg border border-[#e4dccb] bg-white p-6">
            <h3 className="text-lg font-black text-[#18212c]">
              Model coverage: what only {brand.label} covers
            </h3>
            {onlyHere.length > 0 ? (
              <>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">
                  {onlyHere.length} iPhone model{onlyHere.length > 1 ? 's are' : ' is'} currently on our price sheet
                  under the {brand.label} label but not under {sibling.label}. If your repair menu leans on{' '}
                  {onlyHere.length > 1 ? 'these models' : 'this model'}, standardising on {brand.label} keeps one panel
                  brand across the bench instead of splitting suppliers by model.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {onlyHere.map((m) => (
                    <li
                      key={m}
                      className="rounded border border-[#e4dccb] bg-[#faf8f3] px-3 py-1 text-sm font-bold text-[#18212c]"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Every model we stock under {brand.label} is also available under {sibling.label}, so the decision comes
                down to grade mix and price rather than coverage.
              </p>
            )}
            <p className="mt-4 text-sm leading-6 text-[#52606d]">
              Line balance: {linePct}% of the {rows.length} {brand.label} SKUs we stock are {topGrade.def.label}
              {stats.length > 1 ? `, with the rest split across ${stats.length - 1} other grade${stats.length > 2 ? 's' : ''}` : ''}
              . {brand.label} spans {money(low)}–{money(high)} at the 10+ tier; {sibling.label} spans {money(siblingLow)}
              –{money(siblingHigh)}.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — visible content mirrors FAQPage schema exactly */}
      <section className="py-14 md:py-20">
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
          <p className="mt-8 text-xs leading-5 text-[#8a94a0]">
            {brand.label} is an independent third-party panel manufacturer. PRSPARES is an independent wholesale
            supplier and is not affiliated with, endorsed by or authorized by any device or panel maker — brand names
            identify part compatibility and panel origin only.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">
            Ready to Price Your {brand.label} Order?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#52606d]">
            Send your model list and quantities — we quote {brand.label} alongside any other grades with live
            10/50/200 tier pricing, batch QC and a 12-month warranty.
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
              Browse the Full Price List
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
