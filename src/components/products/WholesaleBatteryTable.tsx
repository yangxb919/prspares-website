import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { IPHONE_BATTERY_CATALOG, type BatterySku } from '@/data/iphone-battery-catalog';

// Server-rendered native <table> of real iPhone battery SKUs with tiered
// wholesale pricing. Native HTML keeps it crawlable and AI-extractable — the
// transactional asset that should rank for "iphone battery wholesale".

const TYPE_BADGE: Record<string, string> = {
  Original: 'bg-[#0b6b45] text-white',
  'Li-ion': 'bg-[#f1ede4] text-[#52606d]',
  'Li-Polymer': 'bg-[#fff0dd] text-[#9a5a16]',
};

function quoteHref(row: BatterySku) {
  const params = new URLSearchParams({
    product: `${row.model} Battery${row.capacity !== '—' ? ` ${row.capacity}` : ''}`,
    category: 'Batteries',
  });
  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

const money = (n: number) => `$${n.toFixed(2)}`;

export default function WholesaleBatteryTable() {
  const rows = IPHONE_BATTERY_CATALOG;
  const models = new Set(rows.map((r) => r.model)).size;
  const low = Math.min(...rows.map((r) => r.p10));
  const high = Math.max(...rows.map((r) => r.p10));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Wholesale iPhone Batteries (${rows.length} SKUs)`,
    category: 'Phone Replacement Batteries',
    brand: { '@type': 'Brand', name: 'PRSPARES' },
    description:
      'Factory-direct iPhone replacement battery cells for iPhone 8 through iPhone 16, original-capacity rated, UN38.3-compliant, with tiered 10/50/200 wholesale pricing.',
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
          iPhone Battery Wholesale — {rows.length} SKUs, {models} Models
        </h2>
        {/* Definitional / AI-citable opener */}
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
          iPhone battery wholesale is the bulk supply of replacement lithium-ion batteries to repair shops and distributors.
          PRSPARES stocks factory-direct iPhone battery cells for iPhone 8 through iPhone 16, with original-capacity ratings,
          priced from {money(low)} per unit with tiered 10/50/200 wholesale pricing and a 12-month warranty. Batteries ship in
          neutral packaging with UN38.3-compliant cells; MOQ starts at 10 units.
        </p>

        {/* Price-change disclaimer — prices move frequently and the page may lag */}
        <div className="mt-6 flex items-start gap-3 rounded-lg border-l-4 border-[#ff8a2a] bg-[#fff6ea] p-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a2a]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <p className="text-sm leading-6 text-[#7a4a12]">
            <strong>Please confirm pricing before ordering.</strong> Wholesale phone-part prices change frequently and the
            figures on this page may not reflect the latest rates — they are for reference only. Contact us for a live,
            up-to-date quote on your model mix.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#e4dccb]">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#18212c] text-white">
                <th className="px-4 py-3 font-bold">Model</th>
                <th className="px-4 py-3 font-bold">Capacity</th>
                <th className="px-4 py-3 font-bold">Type</th>
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
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[#52606d]">{row.capacity}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${TYPE_BADGE[row.type] || 'bg-[#f1ede4] text-[#52606d]'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-[#18212c]">{money(row.p10)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[#52606d]">{money(row.p50)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[#0b6b45]">{money(row.p200)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={quoteHref(row)} className="font-bold text-[#ff8a2a] hover:text-[#0b6b45]">Add →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-[#8a94a0]">
          Indicative factory-direct unit pricing (USD), updated from the live wholesale price sheet. Final quote confirms stock,
          batch QC and shipping route (batteries require specific freight handling). Samsung and other-brand batteries available
          on request — this list shows iPhone cells only.
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
