import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, XCircle, FileCheck2, PackageCheck } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

const metaTitle = 'Warranty & After-Sales Standard — 12-Month Coverage | PRSPARES';
const metaDescription =
  'PRSPARES backs every wholesale phone part with a 12-month warranty from receipt of goods and a sub-1% RMA target. See what is covered, what is not, the per-model screen coverage list, and the RMA claim process.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: '/warranty-and-rma' },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/warranty-and-rma',
    images: ['/hero/trust-qc-bench.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/hero/trust-qc-bench.jpg'],
  },
};

// Covered (manufacturing / DOA / functional) vs not covered (physical / accidental).
const COVERED = [
  'Dead on arrival (DOA) — no power, no display out of the box',
  'No display, abnormal display, or bright line from an internal panel defect',
  'Touch not registering due to a manufacturing fault',
  'Flex connector or IC failure not caused by physical force',
  'Frame loose while the assembly is otherwise functional',
];
const NOT_COVERED = [
  'Cracked or shattered glass / OLED from impact, drops, or pressure',
  'Flex cable torn or burst during installation or mishandling',
  'Liquid or moisture damage from misuse',
  'Frame bent or deformed by drops or crushing',
  'Damage from incorrect installation or use of non-standard tools',
];

// Representative subset of the screen catalog the 12-month warranty applies to.
// Model / grade / size are real catalog data; coverage is PRSPARES's standard terms.
const MODEL_ROWS: [string, string, string][] = [
  ['iPhone 11 Pro', 'Hard OLED', '5.8 in'],
  ['iPhone 11 Pro Max', 'Hard OLED', '6.5 in'],
  ['iPhone 12 Pro', 'Hard OLED', '6.1 in'],
  ['iPhone 12 Pro Max', 'Hard OLED', '6.7 in'],
  ['iPhone 13', 'Hard OLED', '6.1 in'],
  ['iPhone 13 Pro Max', 'Soft OLED', '6.7 in'],
  ['iPhone 14', 'Hard OLED', '6.1 in'],
  ['iPhone 14 Pro Max', 'Soft OLED', '6.7 in'],
  ['iPhone 15 Pro', 'Soft OLED', '6.1 in'],
  ['iPhone 15 Pro Max', 'Soft OLED', '6.7 in'],
  ['iPhone 16 Pro', 'Hard OLED', '6.1 in'],
  ['iPhone 16 Pro Max', 'Soft OLED', '6.7 in'],
];

const RMA_STEPS = [
  {
    icon: FileCheck2,
    title: '1. Report within the warranty window',
    text: 'Within 12 months of receiving the goods, send photos or a short video of the defect plus the order or batch number. Report obvious DOA units within 7 days of receiving the goods so we can isolate the batch.',
  },
  {
    icon: ShieldCheck,
    title: '2. Defect verification',
    text: 'We confirm the defect type against this standard — a manufacturing / functional fault is covered; physical or liquid damage is not. Random defects are treated as normal; defects concentrated in one batch are flagged as a supplier QC issue.',
  },
  {
    icon: PackageCheck,
    title: '3. Resolution',
    text: 'Covered units are resolved by replacement or credit on your next order. If a single batch exceeds the expected defect rate, we process the affected batch together rather than unit by unit.',
  },
];

const FAQ = [
  {
    q: 'How long is the PRSPARES warranty and when does it start?',
    a: 'Every PRSPARES part carries a 12-month warranty that starts from the date you receive the goods, not the order date. Our target RMA rate across all grades is under 1%.',
  },
  {
    q: 'What screen defects are covered under warranty?',
    a: 'The warranty covers manufacturing and functional defects: dead-on-arrival units, no or abnormal display, bright lines from an internal panel fault, touch failure from a manufacturing fault, and flex-connector or IC failure not caused by physical force. A loose frame on an otherwise functional assembly is repaired free.',
  },
  {
    q: 'What is not covered?',
    a: 'Physical and accidental damage is not covered: cracked or shattered glass/OLED from impact, flex cable torn during installation, liquid or moisture damage, a bent frame, and damage from incorrect installation. These are outside any screen warranty because they are caused after the part leaves QC.',
  },
  {
    q: 'How do I file an RMA claim as a wholesale buyer?',
    a: 'Within the 12-month window, send photos or video of the defect with your order or batch number. We verify the defect type, then resolve covered units by replacement or credit on your next order. Batch-concentrated defects are handled together.',
  },
  {
    q: 'Does the warranty apply to all screen grades?',
    a: 'Yes. Coverage applies across every grade we supply — Original, Soft OLED, Hard OLED (including DD-brand panels), and Incell — under the same 12-month standard.',
  },
];

const trustPhotos = [
  { image: '/hero/trust-qc-bench.jpg', alt: 'Phone screen quality inspection bench before shipment', caption: 'Display, touch and fit-check on every batch before it ships' },
  { image: '/hero/trust-packing.jpg', alt: 'B2B export packing station with anti-static phone parts', caption: 'Anti-static + UN38.3 packaging for screens and batteries' },
  { image: '/hero/trust-huaqiangbei.jpg', alt: 'Shenzhen Huaqiangbei electronics market sourcing aisle', caption: 'Factory-direct sourcing from Shenzhen Huaqiangbei' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PRSPARES Warranty & After-Sales Standard',
    url: `${SITE_URL}/warranty-and-rma`,
    description: metaDescription,
    primaryImageOfPage: `${SITE_URL}/hero/trust-qc-bench.jpg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Warranty & After-Sales', item: `${SITE_URL}/warranty-and-rma` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function WarrantyPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#101820] text-white">
        <Image src="/hero/trust-qc-bench.jpg" alt="PRSPARES incoming QC bench" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.95),rgba(10,16,24,0.8)_50%,rgba(10,16,24,0.35))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#51d88a]">Warranty &amp; After-Sales Standard</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.05] sm:text-5xl">
            A 12-month warranty on every part — from the day it reaches you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
            PRSPARES is a Shenzhen factory-direct B2B wholesale supplier. Every screen, battery and small part is checked by
            incoming QC before it ships and is backed by a <strong>12-month warranty from receipt of goods</strong>, with a target
            RMA rate <strong>under 1%</strong>.
          </p>
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            {[['12 mo', 'warranty from receipt'], ['<1%', 'RMA target'], ['All grades', 'Original→Incell']].map(([v, l]) => (
              <div key={l} className="border border-white/15 bg-white/[0.06] p-3">
                <div className="font-mono text-2xl font-black text-[#ffb36b]">{v}</div>
                <div className="mt-1 text-xs font-semibold text-slate-200">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage principle */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-3xl font-black md:text-4xl">What the warranty covers</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#52606d]">
          The warranty covers <strong>manufacturing and functional defects</strong> — faults that exist when the part leaves our
          QC bench. <strong>Physical and accidental damage</strong> that happens after the part is in your hands is outside any
          screen warranty.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#bfe6cf] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#0b6b45]"><CheckCircle2 className="h-6 w-6" /><h3 className="text-xl font-black">Covered</h3></div>
            <ul className="mt-4 space-y-3">
              {COVERED.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-[#27313c]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b6b45]" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[#f0cfcf] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#b42318]"><XCircle className="h-6 w-6" /><h3 className="text-xl font-black">Not covered</h3></div>
            <ul className="mt-4 space-y-3">
              {NOT_COVERED.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-[#27313c]"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b42318]" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Per-model coverage list */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black md:text-4xl">Per-model screen warranty (selected models)</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#52606d]">
            The 12-month standard applies to every iPhone screen grade we stock. A representative selection is shown below; the
            full catalog spans iPhone X through the iPhone 16 series plus Samsung Galaxy and other Android models. For pricing and
            stock, browse the <Link href="/products/screens" className="font-bold text-[#0b6b45] underline">wholesale screen catalog</Link>.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#e4d8c2] bg-[#fffaf0] text-[#18212c]">
                  <th className="px-4 py-3 font-black">Model</th>
                  <th className="px-4 py-3 font-black">Grade</th>
                  <th className="px-4 py-3 font-black">Size</th>
                  <th className="px-4 py-3 font-black">Warranty</th>
                  <th className="px-4 py-3 font-black">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_ROWS.map(([model, grade, size]) => (
                  <tr key={model + grade} className="border-b border-[#ede7da]">
                    <td className="px-4 py-3 font-bold">{model}</td>
                    <td className="px-4 py-3 text-[#52606d]">{grade}</td>
                    <td className="px-4 py-3 text-[#52606d]">{size}</td>
                    <td className="px-4 py-3 font-semibold text-[#0b6b45]">12 months from receipt</td>
                    <td className="px-4 py-3 text-[#52606d]">Manufacturing / functional defects</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8a94a0]">
            &ldquo;IC Transplanted&rdquo; assemblies (original IC reballed onto a refurbished panel) carry the same 12-month
            coverage. Coverage is for manufacturing and functional defects only; physical, liquid and installation damage is
            excluded as listed above.
          </p>
        </div>
      </section>

      {/* RMA process */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-3xl font-black md:text-4xl">How to file an RMA</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {RMA_STEPS.map((step) => (
            <div key={step.title} className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
              <step.icon className="h-8 w-8 text-[#0b6b45]" />
              <h3 className="mt-4 text-lg font-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#52606d]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black md:text-4xl">Why the RMA rate stays low</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#52606d]">The warranty is the safety net; incoming QC is what keeps you from needing it.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trustPhotos.map((photo) => (
              <article key={photo.image} className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-[#18212c]">
                  <Image src={photo.image} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <p className="p-4 text-sm font-semibold leading-6 text-[#27313c]">{photo.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-3xl font-black md:text-4xl">Frequently asked questions</h2>
        <div className="mt-8 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-[#e4d8c2] pb-6">
              <h3 className="text-lg font-black">{f.q}</h3>
              <p className="mt-2 text-sm leading-7 text-[#52606d]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">Source parts backed by a real warranty.</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#e4fff0]">Browse the factory-direct catalog or send a parts list for tier pricing, stock and shipping.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]">Browse Catalog</Link>
            <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-6 py-4 text-base font-black text-white transition hover:bg-white/20">Get a Wholesale Quote<ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
