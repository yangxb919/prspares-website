import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import WholesaleScreenTable from '@/components/products/WholesaleScreenTable';
import WaQuickLink from '@/components/products/WaQuickLink';
import { waProductPrefill } from '@/lib/whatsapp';
import { IPHONE_SCREEN_CATALOG, BASE_CATALOG_DATE } from '@/data/screen-catalog';
import { GRADE_TAXONOMY } from '@/data/grade-taxonomy';
import { B2B_FACTS } from '@/data/b2b-facts';
import { SCREEN_MODEL_PAGE_BY_SLUG, type ScreenModelPage } from '@/data/screen-model-pages';

// Model-level screen page (category → model, grades as sections). Same
// zero-fake contract as the brand pages: every price, count and stock state is
// computed from the live catalog at build time; per-model facts come from
// screen-model-pages.ts with their sources; FAQ text and FAQPage schema render
// from one array.

const SITE = 'https://www.phonerepairspares.com';
const money = (n: number) => `$${n.toFixed(2)}`;
const fact = (label: string) => B2B_FACTS.find((f) => f.label === label)?.value ?? '';

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function modelRows(model: string) {
  return IPHONE_SCREEN_CATALOG.filter((r) => r.model === model);
}

export default function ModelScreenPage({ page }: { page: ScreenModelPage }) {
  const rows = modelRows(page.model);
  const inStockRows = rows.filter((r) => r.inStock !== false);
  const priced = inStockRows.length ? inStockRows : rows;
  const low = Math.min(...priced.map((r) => r.p10));
  const high = Math.max(...priced.map((r) => r.p10));
  const checkedAt = rows.map((r) => r.checkedAt).filter(Boolean).sort().pop() ?? BASE_CATALOG_DATE;
  const url = `${SITE}/products/screens/${page.slug}`;

  const grades = GRADE_TAXONOMY.filter((g) => rows.some((r) => r.grade === g.label)).map((g) => {
    const gr = rows.filter((r) => r.grade === g.label);
    const available = gr.filter((r) => r.inStock !== false);
    const pool = available.length ? available : gr;
    const cheapest = [...pool].sort((a, b) => a.p10 - b.p10)[0];
    return {
      def: g,
      count: gr.length,
      inStock: available.length,
      brands: [...new Set(gr.map((r) => r.brand).filter(Boolean))],
      from: cheapest.p10,
      from200: Math.min(...pool.map((r) => r.p200)),
    };
  });
  const outOfStock = rows.filter((r) => r.inStock === false);
  const cheapestOled = rows
    .filter((r) => (r.grade === 'Soft OLED' || r.grade === 'Hard OLED') && r.inStock !== false)
    .sort((a, b) => a.p10 - b.p10)[0];
  const cheapestIncell = rows
    .filter((r) => r.grade === 'Incell' && r.inStock !== false)
    .sort((a, b) => a.p10 - b.p10)[0];

  // Grade price ladder — computed per model, so every model page states its own
  // trade-offs in numbers instead of shared template prose.
  const fromOf = (label: string) => grades.find((g) => g.def.label === label)?.from;
  const ladder: string[] = [];
  const incellFrom = fromOf('Incell');
  const softFrom = fromOf('Soft OLED');
  const hardFrom = fromOf('Hard OLED');
  const originalFrom = fromOf('Original');
  if (incellFrom && hardFrom)
    ladder.push(`Moving an ${page.model} repair from Incell to Hard OLED adds ${money(hardFrom - incellFrom)} per unit (${money(incellFrom)} → ${money(hardFrom)}).`);
  if (hardFrom && softFrom)
    ladder.push(
      softFrom >= hardFrom
        ? `Soft OLED costs ${money(softFrom - hardFrom)} more than Hard OLED for this model.`
        : `For this model the cheapest Soft OLED is ${money(hardFrom - softFrom)} below the cheapest Hard OLED.`
    );
  if (originalFrom && (softFrom || hardFrom)) {
    const bestOled = Math.min(...[softFrom, hardFrom].filter((n): n is number => !!n));
    ladder.push(`Original runs ${(originalFrom / bestOled).toFixed(1)}× the cheapest OLED (${money(originalFrom)} vs ${money(bestOled)}).`);
  }
  const tierSaving = priced.map((r) => ((r.p10 - r.p200) / r.p10) * 100);
  ladder.push(
    `Across the ${priced.length} in-stock ${page.model} assemblies, the 200+ price is ${Math.min(...tierSaving).toFixed(1)}–${Math.max(...tierSaving).toFixed(1)}% below the 10+ price.`
  );

  const faqs: { q: string; a: string }[] = [
    {
      q: `How much is a wholesale ${page.model} screen?`,
      a: `${page.model} screen assemblies are listed at ${money(low)}–${money(high)} per unit for 10+ pcs, depending on grade and panel brand (${grades
        .map((g) => `${g.def.label} from ${money(g.from)}`)
        .join(', ')}). Listed prices apply from 10 pcs; larger volumes are quoted separately. Prices were last checked on ${checkedAt}.`,
    },
    ...(cheapestOled && cheapestIncell
      ? [
          {
            q: `What is the cheapest OLED option for ${page.model}, and how does it compare with incell?`,
            a: `The lowest-priced OLED assembly in stock for ${page.model} is the ${cheapestOled.title} (${cheapestOled.grade}) at ${money(
              cheapestOled.p10
            )} for 10+ pcs, against ${money(cheapestIncell.p10)} for the cheapest incell assembly — a difference of ${money(
              cheapestOled.p10 - cheapestIncell.p10
            )} per unit.`,
          },
        ]
      : []),
    {
      q: `Is there a minimum order for ${page.model} screens?`,
      a: fact('MOQ'),
    },
    ...(outOfStock.length
      ? [
          {
            q: `Which ${page.model} screens are out of stock right now?`,
            a: `At the last check (${checkedAt}) ${outOfStock.length} of ${rows.length} listed ${page.model} assemblies were out of stock: ${outOfStock
              .map((r) => `${r.title} (${r.grade})`)
              .join('; ')}. Ask us for the nearest in-stock alternative in the same grade.`,
          },
        ]
      : []),
    { q: 'What warranty applies?', a: fact('Warranty') },
    { q: 'How do I pay and how is it shipped?', a: `${fact('Payment')} ${fact('Shipping')}` },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE}/products` },
      { '@type': 'ListItem', position: 3, name: 'Phone Screens', item: `${SITE}/products/screens` },
      { '@type': 'ListItem', position: 4, name: `${page.model} Screens`, item: url },
    ],
  };
  // Only prices visible in the table on this page; no brand, no ratings.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${page.model} Replacement Screen Assembly (wholesale)`,
    category: 'Phone Replacement Screens',
    image: rows[0].image,
    url,
    description: `Wholesale ${page.model} screen assemblies in ${grades.map((g) => g.def.label).join(', ')} grades, priced per unit for 10+ pcs.`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: low.toFixed(2),
      highPrice: high.toFixed(2),
      offerCount: priced.length,
      availability: inStockRows.length ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: addDays(checkedAt, 30),
      url,
      seller: { '@type': 'Organization', name: 'PRSPARES' },
    },
  };

  const related = page.related.map((s) => SCREEN_MODEL_PAGE_BY_SLUG[s]).filter(Boolean);

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />

      <section className="bg-[#18212c] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#7ee2b0]">
            <Link href="/products/screens" className="hover:text-white">
              Phone Screens
            </Link>{' '}
            › {page.model} · prices checked {checkedAt}
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-5xl">
            {page.model} Screen Wholesale — {grades.map((g) => g.def.label).join(', ')}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c3ccd6]">
            PRSPARES lists {rows.length} {page.model} screen assemblies across {grades.length} grade
            {grades.length > 1 ? 's' : ''}, from {money(low)} to {money(high)} per unit for 10+ pcs
            {inStockRows.length < rows.length ? ` (${inStockRows.length} in stock at the last check)` : ''}. Listed prices apply
            from 10 pcs; larger volumes are quoted separately. Mix {page.model} screens with any other models or parts to
            reach the 10-piece order minimum.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#price-list"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
            >
              See {page.model} Prices
            </Link>
            <Link
              href={`/wholesale-inquiry?${new URLSearchParams({ product: `${page.model} Screen Assembly`, category: 'LCD/OLED Screens' })}#quote-form`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a4656] bg-transparent px-6 py-3 text-base font-bold text-white transition hover:border-[#7ee2b0]"
            >
              Get a Wholesale Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Grade sections — anchors double as deep links from brand pages / the grade guide */}
      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">{page.model} Screens by Grade</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
            Grade names follow our{' '}
            <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] underline decoration-2 underline-offset-2">
              four-grade standard
            </Link>
            . Prices below are the lowest in-stock 10+ unit price in each grade.
          </p>
          <ul className="mt-6 max-w-3xl list-disc space-y-1 pl-5 text-base leading-7 text-[#52606d]">
            {ladder.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {grades.map((g) => (
              <div key={g.def.key} id={g.def.key} className="scroll-mt-24 rounded-lg border border-[#e4dccb] bg-white p-6">
                <h3 className="text-xl font-black text-[#18212c]">
                  {page.model} {g.def.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">
                  {g.def.note}.
                  {page.gradeAdvice[g.def.label] ? ` ${page.gradeAdvice[g.def.label]}` : ''}
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-[#18212c]">Listed SKUs</dt>
                    <dd className="text-[#52606d]">
                      {g.count} ({g.inStock} in stock){g.brands.length ? ` · ${g.brands.join(' / ')}` : ''}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-[#18212c]">From (10+ / 200+)</dt>
                    <dd className="font-mono font-bold text-[#0b6b45]">
                      {money(g.from)} / {money(g.from200)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <WaQuickLink
                    message={waProductPrefill(`${page.model} ${g.def.label} screens`, g.from)}
                    eventLabel={`Model Page WA: ${page.model} ${g.def.label}`}
                    className="text-sm font-bold text-[#0b6b45] hover:text-[#1f7a52]"
                  >
                    WhatsApp for {page.model} {g.def.label} stock
                  </WaQuickLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WholesaleScreenTable model={page.model} />

      {(page.facts.length > 0 || page.afterInstall.length > 0) && (
        <section className="bg-[#faf8f3] py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">{page.model} Display: What Repair Shops Should Know</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {[
                { title: 'Original display and compatibility', items: page.facts },
                { title: 'After fitting a non-Apple screen', items: page.afterInstall },
              ]
                .filter((b) => b.items.length)
                .map((b) => (
                  <div key={b.title} className="rounded-lg border border-[#e4dccb] bg-white p-6">
                    <h3 className="text-lg font-black text-[#18212c]">{b.title}</h3>
                    <dl className="mt-4 space-y-4 text-sm">
                      {b.items.map((f) => (
                        <div key={f.label}>
                          <dt className="font-bold text-[#18212c]">{f.label}</dt>
                          <dd className="mt-1 leading-6 text-[#52606d]">
                            {f.value}{' '}
                            <a
                              href={f.sourceUrl}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="text-xs font-bold text-[#0b6b45] underline"
                            >
                              source
                            </a>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">{page.model} Screen Buying Questions</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-[#e4dccb] bg-white p-6">
                <h3 className="text-lg font-bold text-[#18212c]">{f.q}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-[#52606d]">
            Also see:{' '}
            {related.map((r) => (
              <span key={r.slug}>
                <Link href={`/products/screens/${r.slug}`} className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
                  {r.model} screens
                </Link>
                {' · '}
              </span>
            ))}
            <Link href="/products/screens#price-list" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              all iPhone screen prices
            </Link>
            {' · '}
            <Link href="/products/batteries" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              iPhone batteries
            </Link>
            {' · '}
            <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              grade guide
            </Link>
          </p>
          <p className="mt-6 text-xs leading-5 text-[#8a94a0]">
            Apple and iPhone are trademarks of Apple Inc. PRSPARES is an independent wholesale supplier, not affiliated
            with Apple; model names identify part compatibility only.
          </p>
        </div>
      </section>
    </main>
  );
}
