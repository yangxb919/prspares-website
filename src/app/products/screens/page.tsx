import JsonLd from '@/components/JsonLd';
import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import WholesaleScreenTable from '@/components/products/WholesaleScreenTable';
import { productCategoryPages } from '@/data/product-category-pages';

// FAQ/Breadcrumb schema live here (not in layout.tsx) so they render on the
// screens hub only — the layout cascades to /products/screens/gx|jk, which emit
// their own FAQPage/BreadcrumbList and must not inherit a second set.

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
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
    {
      '@type': 'Question',
      name: 'How much does iPhone screen replacement cost at wholesale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wholesale pricing depends on model and grade (July 2026 price list). iPhone 16 Pro Max runs $30 (Incell) to $242 (Original) per unit at the 10+ tier. iPhone 14 Pro Max: $15 to $130. iPhone 13: $11 to $57. Tiered 10/50/200 pricing applies, with 200-unit prices typically 2-4% below 10-unit prices. All 188 iPhone screen SKUs are listed with live prices on this page.',
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
    </>
  );
}
