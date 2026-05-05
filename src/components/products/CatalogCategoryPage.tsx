import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  MessageSquare,
  PackageCheck,
  TableProperties,
} from 'lucide-react';
import ScrollAnimator from '@/components/ScrollAnimator';
import HeroFilterChips from '@/components/products/HeroFilterChips';
import type { ProductCategoryPageData, QuoteLine } from '@/data/product-category-pages';
import styles from '@/app/home.module.css';

function QuoteLink({ product, children }: { product: string; children: ReactNode }) {
  return (
    <Link
      href={`/wholesale-inquiry?product=${encodeURIComponent(product)}`}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/10 transition hover:bg-[#e97313] ${styles.ctaSheen}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function productLineId(line: QuoteLine) {
  return `line-${`${line.model}-${line.category}-${line.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)}`;
}

function getQuoteCategory(line: QuoteLine, fallback: string) {
  if (/screen/i.test(line.category)) return 'LCD/OLED Screens';
  if (/battery/i.test(line.category)) return 'Batteries';
  if (/ic|tool|programmer|screwdriver/i.test(`${line.category} ${line.source}`)) {
    return 'IC Chips & Repair Tools';
  }
  if (/small/i.test(fallback)) return 'Small Parts';
  return fallback;
}

function buildLineInquiryHref(line: QuoteLine, pageSlug: string, fallbackCategory: string) {
  const params = new URLSearchParams({
    product: `${line.model} - ${line.name}`,
    category: getQuoteCategory(line, fallbackCategory),
    productUrl: `/products/${pageSlug}#${productLineId(line)}`,
  });

  return `/wholesale-inquiry?${params.toString()}#quote-form`;
}

export default function CatalogCategoryPage({ data }: { data: ProductCategoryPageData }) {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <ScrollAnimator />

      <section className="relative overflow-hidden bg-[#101820] text-white">
        <Image
          src={data.heroImage}
          alt={data.title}
          fill
          priority
          className={`object-cover ${styles.heroImage}`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.95),rgba(10,16,24,0.76)_52%,rgba(10,16,24,0.24))]" />
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,177,64,0.2),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(255,139,47,0.18),transparent_28%)] ${styles.heroAura}`} />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className={styles.heroCopy}>
            <div className={`mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur ${styles.heroBadge}`}>
              <ClipboardCheck className="h-4 w-4 text-[#51d88a]" />
              {data.eyebrow}
            </div>
            <h1 className={`max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl ${styles.heroTitle}`}>
              {data.title}
            </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-8 text-slate-100 ${styles.heroText}`}>{data.intro}</p>
            <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${styles.heroActions}`}>
              <QuoteLink product={data.quoteProduct}>Get Wholesale Quote</QuoteLink>
              <Link
                href="#catalog-skus"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                View Catalog
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className={`border border-white/20 bg-black/30 p-5 backdrop-blur ${styles.motionCard}`}>
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <div className="text-sm font-bold text-[#bff2d0]">Quote structure</div>
                  <div className="mt-1 text-2xl font-black text-white">10+ / 50+ / 200+</div>
                </div>
                <TableProperties className="h-9 w-9 text-[#ffb36b]" />
              </div>
              <HeroFilterChips pageSlug={data.slug} fallbackLines={data.quoteLines.slice(0, 3)} />
              <p className="mt-4 text-sm font-semibold text-white/60">Filters available on quote: Model · Grade · MOQ</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
        <div className={`mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8 ${styles.statRail}`}>
          {data.metrics.map((metric) => (
            <div key={metric.label} className="border border-[#e4d8c2] bg-white px-4 py-4">
              <div className="font-mono text-2xl font-black text-[#ff8a2a]">{metric.value}</div>
              <div className="mt-1 text-sm font-black text-[#18212c]">{metric.label}</div>
              <div className="mt-1 text-xs leading-5 text-[#52606d]">{metric.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Coverage map</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">What buyers should understand first.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              These blocks convert catalog depth into procurement language, so buyers can quickly send the right model list instead of browsing a retail grid.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.coverage.map((item, index) => (
              <div
                key={item.title}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
                className={`min-h-[210px] rounded-lg border border-[#ded8ce] bg-[#fbfaf7] p-5 ${styles.motionCard}`}
              >
                <Layers3 className={`h-6 w-6 text-[#0b6b45] ${styles.iconPulse}`} />
                <h3 className="mt-5 text-lg font-black text-[#18212c]">{item.title}</h3>
                <div className="mt-3 font-mono text-xl font-black text-[#ff8a2a]">{item.value}</div>
                <p className="mt-3 text-sm leading-6 text-[#52606d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog-skus" className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Brand hot-selling SKUs</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Show the products buyers already ask for.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              The examples below are selected around recognizable repair demand, with model names, categories, images and tier pricing kept visible for quote discussions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.quoteLines.map((line, index) => (
              (() => {
                const isLastOddCard = data.quoteLines.length % 2 === 1 && index === data.quoteLines.length - 1;

                return (
                  <article
                    key={`${line.model}-${line.name}`}
                    id={productLineId(line)}
                    data-scroll-reveal="scale"
                    style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
                    className={`overflow-hidden rounded-lg border border-[#ded8ce] bg-white shadow-sm ${styles.motionCard} ${
                      isLastOddCard ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div
                      className={`grid min-h-full ${
                        isLastOddCard ? 'md:grid-cols-[0.34fr_0.66fr]' : 'md:grid-cols-[0.46fr_0.54fr]'
                      }`}
                    >
                      <div className="relative min-h-[260px] bg-[#f2f0eb]">
                        <Image
                          src={line.image}
                          alt={`${line.model} ${line.category}`}
                          fill
                          className="object-contain p-8"
                          sizes={isLastOddCard ? '(max-width: 768px) 100vw, 28vw' : '(max-width: 768px) 100vw, 32vw'}
                        />
                        <div className="absolute left-4 top-4 rounded-md bg-[#18212c] px-3 py-1 text-xs font-black text-white">{line.category}</div>
                      </div>
                      <div className="flex flex-col p-5">
                        <div className="font-mono text-xs font-bold text-[#0b6b45]">{line.source}</div>
                        <h3 className="mt-3 text-xl font-black text-[#18212c]">{line.model}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#52606d]">{line.name}</p>
                        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-md border border-[#e4d8c2] text-center">
                          {['10+', '50+', '200+'].map((tier, tierIndex) => (
                            <div key={tier} className="border-r border-[#e4d8c2] last:border-r-0">
                              <div className="bg-[#fffaf0] px-2 py-2 text-xs font-black text-[#52606d]">{tier}</div>
                              <div className="px-2 py-3 font-mono text-sm font-black text-[#18212c]">{line.tiers[tierIndex]}</div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 flex-1 text-sm leading-6 text-[#52606d]">{line.note}</p>
                        <div className="mt-5">
                          <Link
                            href={buildLineInquiryHref(line, data.slug, data.quoteProduct)}
                            className="group inline-flex flex-col gap-1 rounded-md border border-[#ffd8b6] bg-[#fffaf0] px-4 py-3 text-left transition hover:border-[#ff8a2a] hover:bg-[#fff3df]"
                          >
                            <span className="inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a] group-hover:text-[#0b6b45]">
                              Ask for a better price
                              <ArrowRight className="h-4 w-4" />
                            </span>
                            <span className="text-xs font-semibold leading-5 text-[#52606d]">
                              Send this exact line to the quote form.
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10231d] py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#7de3a4]">Quote workflow</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Designed for wholesale conversations.</h2>
            </div>
            <p className="text-base leading-7 text-slate-200 md:text-lg">
              The page makes the buyer confident about coverage, then moves them to a list-based quote where model, quantity, grade and route can be confirmed.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {data.workflow.map((step, index) => (
              <div
                key={step.title}
                data-scroll-reveal="scale"
                style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
                className={`rounded-lg border border-white/15 bg-white/[0.06] p-6 ${styles.motionCard}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff8a2a] font-mono text-sm font-black text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{step.text}</p>
              </div>
            ))}
          </div>

          <div data-scroll-reveal className="mt-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border border-white/15 bg-white/[0.06] p-6">
              <ClipboardCheck className="h-8 w-8 text-[#7de3a4]" />
              <h3 className="mt-5 text-xl font-black text-white">Buyer notes</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                These notes are the practical rules this category page should teach before the buyer sends an inquiry.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {data.buyingNotes.map((note) => (
                <div key={note} className={`rounded-lg border border-white/15 bg-white/[0.06] p-5 text-sm font-semibold leading-6 text-slate-100 ${styles.motionCard}`}>
                  <CheckCircle2 className="mb-4 h-5 w-5 text-[#7de3a4]" />
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-lg border border-[#ded8ce] bg-[#fffaf0] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-[#0b6b45]">
                <PackageCheck className="h-5 w-5" />
                Ready for a mixed wholesale quote
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#18212c] md:text-3xl">Send the model list, not a shopping cart.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52606d]">
                PRSPARES can return price tiers, stock notes, packing suggestions and dispatch timing based on current catalog coverage.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <QuoteLink product={data.quoteProduct}>
                <MessageSquare className="h-4 w-4" />
                Get Wholesale Quote
              </QuoteLink>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#ded8ce] bg-white px-5 py-3 text-sm font-black text-[#18212c] transition hover:border-[#ff8a2a]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
