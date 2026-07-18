import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import WaQuickLink from '@/components/products/WaQuickLink';
import { waProductPrefill } from '@/lib/whatsapp';
import { IPHONE_SCREEN_CATALOG, type ScreenSku } from '@/data/iphone-screen-catalog';
import { GRADE_BY_LABEL, GRADE_TAXONOMY } from '@/data/grade-taxonomy';

// Server-rendered native <table> of real iPhone screen SKUs with tiered wholesale
// pricing. Native HTML (not a JS grid) keeps it fully crawlable and easy for AI
// engines to extract — the page-type-match play: this is the transactional asset
// that should rank for "iphone screen wholesale", not a blog post.

const GRADE_NOTE: Record<string, string> = Object.fromEntries(
  Object.entries(GRADE_BY_LABEL).map(([label, def]) => [label, def.note])
);

const GRADE_BADGE: Record<string, string> = {
  Original: 'bg-[#0b6b45] text-white',
  'Soft OLED': 'bg-[#1f7a52] text-white',
  'Hard OLED': 'bg-[#2f8f6a] text-white',
  Incell: 'bg-[#fff0dd] text-[#9a5a16]',
};

function quoteHref(row: ScreenSku) {
  const params = new URLSearchParams({
    product: `${row.model} ${row.grade} Screen Assembly`,
    category: 'LCD/OLED Screens',
  });
  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

const money = (n: number) => `$${n.toFixed(2)}`;

export default function WholesaleScreenTable() {
  const rows = IPHONE_SCREEN_CATALOG;
  const models = new Set(rows.map((r) => r.model)).size;
  const grades = Array.from(new Set(rows.map((r) => r.grade)));
  const low = Math.min(...rows.map((r) => r.p10));
  const high = Math.max(...rows.map((r) => r.p10));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Wholesale iPhone Screen Assemblies (${rows.length} SKUs)`,
    category: 'Phone Replacement Screens',
    brand: { '@type': 'Brand', name: 'PRSPARES' },
    description:
      'Factory-direct iPhone LCD/OLED screen assemblies in Original, Soft OLED, Hard OLED and Incell grades for iPhone 11 through iPhone 17, with tiered 10/50/200 wholesale pricing.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: low.toFixed(2),
      highPrice: high.toFixed(2),
      offerCount: rows.length,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'PRSPARES' },
    },
  };

  return (
    <section id="price-list" className="bg-white py-14 md:py-20">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-[#0b6b45]">Live wholesale price list</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">
          iPhone Screen Wholesale — {rows.length} SKUs, {models} Models
        </h2>
        {/* Definitional / AI-citable opener */}
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
          iPhone screen wholesale is the bulk supply of replacement display assemblies to repair shops and distributors.
          PRSPARES stocks {rows.length} factory-direct iPhone screen assemblies across {grades.length} quality grades
          (Original, Soft OLED, Hard OLED and Incell) for iPhone 11 through iPhone 17, priced in {money(low)}–{money(high)}
          per unit with tiered 10/50/200 wholesale pricing and a 12-month warranty. MOQ starts at 10 units; mix models and
          grades in one order.
        </p>

        {/* Compact grade strip — canonical definitions live on the grade guide */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GRADE_TAXONOMY.map((g) => {
            const gradeRows = rows.filter((r) => r.grade === g.label);
            const from = gradeRows.length ? Math.min(...gradeRows.map((r) => r.p10)) : 0;
            return (
              <div key={g.key} className="rounded-lg border border-[#e4dccb] bg-[#faf8f3] p-4">
                <p className="text-sm font-black text-[#18212c]">{g.label}</p>
                <p className="mt-1 text-xs leading-5 text-[#52606d]">{g.note}</p>
                <p className="mt-2 font-mono text-sm font-bold text-[#0b6b45]">from {money(from)}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-[#52606d]">
          Not sure which grade fits your market?{' '}
          <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] underline decoration-2 underline-offset-2">
            Full grade comparison guide →
          </Link>
        </p>

        {/* Price-change disclaimer — prices move frequently and the page may lag */}
        <div className="mt-6 flex items-start gap-3 rounded-lg border-l-4 border-[#ff8a2a] bg-[#fff6ea] p-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a2a]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <p className="text-sm leading-6 text-[#7a4a12]">
            <strong>Please confirm pricing before ordering.</strong> Wholesale phone-part prices change frequently and the
            figures on this page may not reflect the latest rates — they are for reference only. Contact us for a live,
            up-to-date quote on your model and grade mix.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#e4dccb]">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#18212c] text-white">
                <th className="px-4 py-3 font-bold">Model</th>
                <th className="px-4 py-3 font-bold">Grade</th>
                <th className="px-4 py-3 font-bold">Assembly</th>
                <th className="px-4 py-3 text-right font-bold">10+</th>
                <th className="px-4 py-3 text-right font-bold">50+</th>
                <th className="px-4 py-3 text-right font-bold">200+</th>
                <th className="px-4 py-3 text-right font-bold">Quote</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.sku} className={i % 2 ? 'bg-[#faf8f3]' : 'bg-white'}>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-[#18212c]">{row.model}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${GRADE_BADGE[row.grade] || 'bg-[#f1ede4] text-[#52606d]'}`} title={GRADE_NOTE[row.grade] || ''}>
                      {row.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#52606d]">{row.title}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-[#18212c]">{money(row.p10)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[#52606d]">{money(row.p50)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[#0b6b45]">{money(row.p200)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={quoteHref(row)} className="font-bold text-[#ff8a2a] hover:text-[#0b6b45]">Add →</Link>
                    <WaQuickLink
                      message={waProductPrefill(`${row.model} ${row.grade} screens`, row.p10)}
                      eventLabel={`Screens Table WA: ${row.model} ${row.grade}`}
                      className="ml-3 text-xs font-bold text-[#0b6b45] hover:text-[#1f7a52]"
                    >
                      WA
                    </WaQuickLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-[#8a94a0]">
          Indicative factory-direct unit pricing (USD), updated from the live wholesale price sheet. Final quote confirms stock,
          batch QC and shipping route. Samsung, iPad and other-brand screens available on request — this list shows iPhone
          assemblies only.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/wholesale-inquiry#quote-form" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]">
            Get a Wholesale Quote
          </Link>
          <Link href="/warranty-and-rma" className="inline-flex items-center justify-center gap-2 rounded-md border border-[#ded6c8] bg-white px-6 py-3 text-base font-bold text-[#18212c] transition hover:border-[#0b6b45]">
            12-Month Warranty &amp; RMA
          </Link>
        </div>
      </div>
    </section>
  );
}
