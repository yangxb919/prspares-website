import Link from 'next/link';
import { FEATURED_WHOLESALE, type FeaturedSku } from '@/data/featured-wholesale-catalog';

// Cross-category featured wholesale price table for the /products flagship
// ("cell phone parts wholesale"). Native <table>, real SKUs + tiered pricing,
// each category links to its full catalog/data table.

const CATEGORY_LINK: Record<string, string> = {
  Screen: '/products/screens',
  Battery: '/products/batteries',
  'Rear Camera': '/products/small-parts',
  'Front Camera': '/products/small-parts',
  'Charging Port': '/products/small-parts',
  'Back Cover': '/products/small-parts',
};

function quoteHref(row: FeaturedSku) {
  const params = new URLSearchParams({
    product: `${row.model} ${row.category}${row.spec !== '—' ? ` (${row.spec})` : ''}`,
    category: row.category,
  });
  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

const money = (n: number) => `$${n.toFixed(2)}`;

export default function FeaturedWholesaleTable() {
  const rows = FEATURED_WHOLESALE;
  const cats = Array.from(new Set(rows.map((r) => r.category)));

  return (
    <section id="featured-prices" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-[#0b6b45]">Featured wholesale prices</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">Real factory-direct pricing across every category</h2>
        {/* Definitional / AI-citable opener */}
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
          Cell phone parts wholesale is the bulk supply of replacement repair parts — screens, batteries, cameras, charging ports
          and housings — to repair shops and distributors. PRSPARES is a Shenzhen factory-direct supplier with 23,000+ SKUs across
          all major brands, priced in tiered 10/50/200 wholesale bands with a 12-month warranty. A sample of current flagship
          pricing is shown below; browse each category for the full list.
        </p>

        {/* Price-change disclaimer */}
        <div className="mt-6 flex items-start gap-3 rounded-lg border-l-4 border-[#ff8a2a] bg-[#fff6ea] p-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a2a]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <p className="text-sm leading-6 text-[#7a4a12]">
            <strong>Please confirm pricing before ordering.</strong> Wholesale phone-part prices change frequently and the
            figures on this page may not reflect the latest rates — they are for reference only. Contact us for a live quote.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#e4dccb]">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#18212c] text-white">
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Model</th>
                <th className="px-4 py-3 font-bold">Spec</th>
                <th className="px-4 py-3 text-right font-bold">10+</th>
                <th className="px-4 py-3 text-right font-bold">50+</th>
                <th className="px-4 py-3 text-right font-bold">200+</th>
                <th className="px-4 py-3 text-right font-bold">Quote</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${row.category}-${row.model}-${i}`} className={i % 2 ? 'bg-[#faf8f3]' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <Link href={CATEGORY_LINK[row.category] || '/products'} className="font-bold text-[#0b6b45] hover:underline">{row.category}</Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-[#18212c]">{row.model}</td>
                  <td className="px-4 py-3 text-[#52606d]">{row.spec}</td>
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

        <div className="mt-6 flex flex-wrap gap-3">
          {cats.map((c) => (
            <Link key={c} href={CATEGORY_LINK[c] || '/products'} className="inline-flex items-center gap-1 rounded-md border border-[#ded6c8] bg-[#fffaf0] px-4 py-2 text-sm font-bold text-[#18212c] transition hover:border-[#0b6b45]">
              Browse {c} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
