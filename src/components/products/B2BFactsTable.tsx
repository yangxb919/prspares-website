import Link from 'next/link';
import { B2B_FACTS } from '@/data/b2b-facts';

// Trade-facts card shared by all catalog category pages (competitor action #4).
// Visible content only — no schema output here; Product/AggregateOffer authority
// stays on /products/screens (0.8 schema audit discipline).

export default function B2BFactsTable() {
  return (
    <section className="border-t border-[#e4dccb] bg-[#f5f3ee] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-[#0b6b45]">Wholesale buying facts</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">
          The answers a buyer checks before sending a list.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
          MOQ, pricing structure, QC, warranty, shipping and payment — stated up front so you can
          compare us against any other supplier without sending a single message.
        </p>
        <div className="mt-8 overflow-hidden rounded-lg border border-[#e4dccb] bg-white">
          <dl className="divide-y divide-[#efe9dc]">
            {B2B_FACTS.map((fact) => (
              <div key={fact.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="text-sm font-black text-[#18212c]">{fact.label}</dt>
                <dd className="text-sm leading-6 text-[#52606d]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#52606d]">
          Full grade definitions with live wholesale prices:{' '}
          <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
            iPhone Screen Grade Guide →
          </Link>
        </p>
      </div>
    </section>
  );
}
