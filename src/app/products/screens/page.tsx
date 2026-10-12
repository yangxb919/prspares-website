import JsonLd from '@/components/JsonLd';
import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import WholesaleScreenTable from '@/components/products/WholesaleScreenTable';
import ScreenGradeTable from '@/components/products/ScreenGradeTable';
import Link from 'next/link';
import { productCategoryPages } from '@/data/product-category-pages';
import BuyingQuestions from '@/components/products/BuyingQuestions';
import { screensBuyingFaqs } from '@/data/category-buying-faqs';

const buyingFaqs = screensBuyingFaqs();

// FAQ/Breadcrumb schema live here (not in layout.tsx) so they render on the
// screens hub only — the layout cascades to /products/screens/gx|jk, which emit
// their own FAQPage/BreadcrumbList and must not inherit a second set.

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ...buyingFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
    {
      '@type': 'Question',
      name: 'What is the difference between OLED, Soft OLED, Hard OLED, and Incell LCD screens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Original grade is a refurbished original panel — the factory OLED cell fitted with new glass — matching stock brightness, color and True Tone. Soft OLED is the closest aftermarket match: a flexible OLED panel at roughly 90-95% of original quality. Hard OLED uses a rigid OLED panel with slightly thicker glass — durable and priced for value. Incell is an in-cell LCD assembly, the budget tier: no deep blacks, but works reliably for basic repairs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will True Tone still work after replacing the screen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "True Tone data is stored on the original screen's IC chip. When you replace the screen, True Tone needs to be transferred using a programmer (JC V1SE, i2C, or JCID). Soft OLED, Hard OLED, and Original grade screens all support True Tone transfer.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does iPhone screen replacement affect Face ID?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — Face ID uses the front-facing TrueDepth camera system, which is separate from the display. As long as you transfer the original earpiece/proximity sensor flex cable to the new screen, Face ID will work normally on all screen grades.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between OEM, aftermarket, and refurbished screens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PRSPARES Original grade is a refurbished original panel: the factory OLED cell is kept and fitted with new glass, so brightness, color and True Tone match the stock display. Aftermarket screens (Soft OLED, Hard OLED, Incell) are newly manufactured panels graded by display technology.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.phonerepairspares.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.phonerepairspares.com/products' },
    { '@type': 'ListItem', position: 3, name: 'Phone Screens', item: 'https://www.phonerepairspares.com/products/screens' },
  ],
};

export default function ScreensPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <CatalogCategoryPage data={productCategoryPages.screens} />
      <WholesaleScreenTable />
      <BuyingQuestions title="iPhone screen buying questions" faqs={buyingFaqs} />
      <section className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#18212c] md:text-3xl">iPhone screen grades at a glance</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#52606d]">
            Every SKU in the price list above is labeled with one of four grades. This matrix shows what each
            grade means in practice — panel type, display quality, True Tone and Face ID behaviour, plus the
            live wholesale price range computed from the current catalog.
          </p>
          <div className="mt-8">
            <ScreenGradeTable />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#52606d]">
            Need the full buying guide with per-model comparisons and FAQ?{' '}
            <Link href="/products/screens-grade-guide" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              Read the iPhone Screen Grade Guide →
            </Link>
          </p>
          {/* Sourcing hubs. This category page is one of the strongest internal link
              sources on the site; before 2026-08-28 neither hub had a link from it. */}
          <p className="mt-3 text-sm leading-6 text-[#52606d]">
            First order from China?{' '}
            <Link
              href="/blog/moq-sample-orders-lead-time-wholesale"
              className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]"
            >
              MOQ, samples and lead time
            </Link>{' '}
            covers order minimums and realistic timing, and{' '}
            <Link
              href="/blog/top-10-phone-parts-suppliers-in-china"
              className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]"
            >
              the ten China supplier channel types
            </Link>{' '}
            explains what to verify before a first batch. Order terms are answered on the{' '}
            <Link href="/faq" className="font-bold text-[#0b6b45] hover:text-[#ff8a2a]">
              official FAQ
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
