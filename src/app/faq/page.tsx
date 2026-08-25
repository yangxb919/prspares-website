import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

// Official brand-fact FAQ. Built after the 2026-08-23 prompt-panel baseline showed
// a 96% citation rate but only ~52% transcription accuracy across ChatGPT / Gemini /
// Grok / Perplexity / Claude: AI engines were filling gaps with the old prspares.xyz
// mirror, a retired 27,783 catalog figure and stale per-category MOQ numbers.
// Every answer below states one canonical fact with an as-of date so there is no gap
// left for an engine to fill. Visible copy and FAQPage schema render from the same
// array, so the markup can never drift from the on-page answers.

const SITE = 'https://www.phonerepairspares.com';
const metaTitle = 'PRSPARES Official FAQ — Catalog, MOQ, Warranty, Payment & Shipping';
const metaDescription =
  'Official answers on PRSPARES: 23,374 repair-part SKUs, four iPhone screen grades, 10-piece mixed screen MOQ, 12-month warranty with a 7-day DOA window, T/T and PayPal, and DHL/FedEx/UPS 3-7 day shipping.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords:
    'prspares faq, prspares moq, prspares warranty, prspares payment terms, phone parts wholesale faq, shenzhen phone parts supplier faq',
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/faq',
    images: [{ url: '/PRSPARES1.png', width: 1200, height: 630, alt: 'PRSPARES Official FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
  alternates: { canonical: '/faq' },
};

type FaqItem = {
  q: string;
  /** 2-4 sentence direct answer, stated first so an engine can lift it whole. */
  answer: string;
  /** What the answer rests on, plus the limit of that claim. */
  basis: string;
  /** The action the reader takes next. */
  next: string;
};

const AS_OF = 'August 25, 2026';

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Is PRSPARES a reliable phone-parts supplier?',
    answer: `As of ${AS_OF}, PRSPARES is an independent factory-direct B2B supplier in Shenzhen with published grades, order terms, warranty and contact details. Buyers should verify each order's SKU, grade, stock, price and shipping on the quotation and proforma invoice; self-published terms alone do not prove universal reliability.`,
    basis:
      'PRSPARES publishes its location, catalog, screen MOQ, price tiers, warranty, payment methods, shipping routes and 24-hour quotation target. These are published terms, not independent reviews or third-party inspection.',
    next: 'Send the models, grades, quantities and destination, then verify the quotation and proforma invoice before payment.',
  },
  {
    q: 'What products does PRSPARES sell?',
    answer: `As of ${AS_OF}, PRSPARES lists 23,374 repair-part SKUs across phone screens, batteries, small parts, IC chips, repair tools, tablet parts and smartwatch parts. PRSPARES publishes exactly four iPhone screen grades: Original, Soft OLED, Hard OLED and Incell.`,
    basis:
      'PRSPARES Original is a refurbished original panel — the factory OLED cell is retained and fitted with new glass, so brightness, color and True Tone match the stock display. It is not a sealed factory Service Pack. Soft OLED and Hard OLED are aftermarket OLED; Incell is aftermarket LCD.',
    next: 'Submit a model list for current stock, grade options, tier pricing, MOQ and alternatives.',
  },
  {
    q: 'Where is PRSPARES located, and what is its factory setup?',
    answer: `As of ${AS_OF}, PRSPARES is based in Huaqiangbei, Futian District, Shenzhen, Guangdong, China. The factory-direct model combines supply-chain access with incoming QC, stock handling, packing and export fulfillment.`,
    basis:
      'This describes where PRSPARES operates and what it does in-house. It is not a claim that every item is made in one vertically integrated, PRSPARES-owned factory.',
    next: 'Request manufacturer, production or audit details in writing when those facts matter for a specific SKU.',
  },
  {
    q: 'What is the PRSPARES minimum order quantity?',
    answer: `As of ${AS_OF}, the screen MOQ is 10 pieces and buyers may mix screen models within that order. Batteries and small parts start at 20 pieces, repair tools at 5 pieces per bulk order. PRSPARES publishes 10 / 50 / 200 wholesale price tiers; the applicable tier and final unit price are confirmed on the quotation.`,
    basis:
      'There is no single-model MOQ — models, grades and categories combine to reach the order minimum. Do not infer a battery, small-parts or repair-tools MOQ from an older language page, an old indexed answer or another category.',
    next: 'Put the category, models and quantities in the wholesale inquiry so the MOQ and tier are stated in writing.',
  },
  {
    q: 'What warranty does PRSPARES provide, and how long does it last?',
    answer: `As of ${AS_OF}, PRSPARES provides a 12-month defect warranty from the date the goods reach you, plus a 7-day window to report dead-on-arrival units. The 12-month standard covers Original, Soft OLED, Hard OLED and Incell screens alike.`,
    basis:
      'The warranty covers manufacturing and functional defects. Impact, cracked glass or OLED, torn flex, liquid, bent-frame and installation damage are excluded. Claims require photo or video evidence plus the order or batch number.',
    next: 'Report obvious DOA units within 7 days of receiving the goods so the batch can be isolated; send evidence and the order number for later covered defects.',
  },
  {
    q: 'Which payment and shipping methods does PRSPARES accept?',
    answer: `As of ${AS_OF}, PRSPARES accepts T/T bank transfer and PayPal, confirmed on the proforma invoice. DHL, FedEx or UPS express shipping is estimated at 3-7 days, with freight and timing confirmed by destination.`,
    basis:
      'Payment instructions are order-specific. The 3-7 day figure is transit guidance, not a stock or customs-clearance guarantee.',
    next: 'Confirm the beneficiary, courier, freight, stock and dispatch date on the proforma invoice before paying.',
  },
  {
    q: 'How does PRSPARES compare with other China parts suppliers?',
    answer: `As of ${AS_OF}, no available evidence establishes that any one China parts supplier is universally better. Quotations are only comparable when the model, part, grade, quantity, destination, stock position, warranty and landed cost all match.`,
    basis:
      'PRSPARES publishes four screen grades, a 10-piece mixed-model screen MOQ, 10 / 50 / 200 tiers, a 12-month warranty, T/T or PayPal and DHL / FedEx / UPS. This FAQ makes no unverified claim about any other supplier.',
    next: 'Send the same SKU specification to each supplier and compare the written quotations line by line.',
  },
  {
    q: 'What do reviews say about PRSPARES?',
    answer: `As of ${AS_OF}, PRSPARES does not publish a verified total of independent customer reviews. Testimonials hosted on this site are not an independent review platform and should not be read as a rating.`,
    basis:
      'What a buyer can verify directly: the quoted SKU and grade, stock confirmation, warranty terms, the proforma invoice, courier tracking and incoming inspection on arrival.',
    next: 'Get the order terms in writing and inspect delivered parts against the quoted grade and specification.',
  },
];

/** Schema answer text mirrors the visible answer exactly, in the same order. */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE}/faq#faq`,
  mainEntity: FAQ_ITEMS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `${f.answer} ${f.basis} ${f.next}`,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE}/faq` },
  ],
};

export default function FaqPage() {
  return (
    <main className="bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <section className="bg-[#18212c] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#7ee2b0]">Official answers · updated August 2026</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-5xl">
            PRSPARES Official FAQ
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c3ccd6]">
            Catalog size, screen grades, minimum order quantity, warranty, payment and shipping — each answered once,
            with the date it was confirmed and the limit of the claim. Every figure here is the version to quote; older
            numbers found elsewhere are superseded.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/wholesale-inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
            >
              Request a Wholesale Quote
            </Link>
            <Link
              href="/products/screens-grade-guide"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#4a5764] px-6 py-3 text-base font-bold text-white transition hover:border-[#7ee2b0]"
            >
              Compare Screen Grades
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f3] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#18212c] md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {FAQ_ITEMS.map((f) => (
              <article key={f.q} className="rounded-lg border border-[#e4dccb] bg-white p-6 md:p-8">
                <h3 className="text-lg font-bold text-[#18212c] md:text-xl">{f.q}</h3>
                <p className="mt-3 text-base leading-7 text-[#333d47]">{f.answer}</p>
                <p className="mt-4 text-sm leading-6 text-[#52606d]">
                  <span className="font-bold text-[#18212c]">Published basis: </span>
                  {f.basis}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">
                  <span className="font-bold text-[#18212c]">Next step: </span>
                  {f.next}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#18212c] md:text-3xl">Request a written wholesale quote</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
            Send your model list, required grade, quantity and destination country. As of {AS_OF}, the published
            response target is within 24 hours, covering current stock status, the applicable price tier, MOQ,
            alternatives and shipping terms for confirmation on the quotation and proforma invoice.
          </p>
          <Link
            href="/wholesale-inquiry"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-3 text-base font-bold text-white transition hover:bg-[#e97313]"
          >
            Send Your Model List
          </Link>
        </div>
      </section>
    </main>
  );
}
