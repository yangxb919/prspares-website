import type { Metadata } from 'next';
import { wholesaleMoq, wholesaleProductProperties } from '@/utils/wholesale-schema';
import { IPAD_BATTERY_CATALOG } from '@/data/ipad-battery-catalog';

const CATALOG_LOW = Math.min(...IPAD_BATTERY_CATALOG.map((r) => r.p10));
const CATALOG_HIGH = Math.max(...IPAD_BATTERY_CATALOG.map((r) => r.p10));

const metaTitle = 'iPad Battery Wholesale — Tiered Pricing from $5.02 | PRSPARES';
const metaDescription =
  'Wholesale iPad batteries from Shenzhen: 16 real SKUs for iPad Pro, Air, mini and standard iPad with 10+/50+/200+ tiered pricing from $5.02, UN38.3 packing and 12-month warranty.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: 'ipad battery replacement, apple ipad battery replacement, ipad pro battery replacement, ipad air battery replacement, ipad battery replacement cost, ipad mini battery, wholesale ipad battery, ipad battery supplier',
  alternates: {
    canonical: '/products/ipad-battery-replacement-factory',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/ipad-battery-replacement-factory',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
};

export default function iPadBatteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale iPad Battery Replacement — Batteries for iPad Pro, Air, mini & Standard",
    "description": "iPad replacement batteries for iPad Pro 12.9, iPad Pro 11, iPad Pro 10.5, iPad Air, iPad mini, and standard iPad models. Factory-direct wholesale from Shenzhen with 10+/50+/200+ tiered pricing.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "additionalProperty": wholesaleProductProperties(10),
    "category": "iPad Batteries",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": CATALOG_LOW.toFixed(2),
      "highPrice": CATALOG_HIGH.toFixed(2),
      "offerCount": String(IPAD_BATTERY_CATALOG.length),
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "PRSPARES" },
      "eligibleQuantity": wholesaleMoq(10)
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does iPad battery replacement cost?",
        "acceptedAnswer": { "@type": "Answer", "text": "Apple charges $99-$149 depending on model. Third-party shops charge $79-$119. Wholesale battery cost: $5.02-$19.84 per unit at the 10+ tier. iPad Pro 12.9 batteries run $11.38-$19.84, iPad 7/8/9 batteries cost $6.30, and iPad mini batteries start at $5.02." },
      },
      {
        "@type": "Question",
        "name": "Is it worth replacing an iPad battery or buying a new iPad?",
        "acceptedAnswer": { "@type": "Answer", "text": "If your iPad is under 4 years old and otherwise functional, replacement is worth it — costs a fraction of a new iPad and restores full-day battery life. iPads over 5 years old may not receive iPadOS updates, making replacement less cost-effective." },
      },
      {
        "@type": "Question",
        "name": "How do I check iPad battery health?",
        "acceptedAnswer": { "@type": "Answer", "text": "iPadOS 16.5+ on supported models: Settings > Battery > Battery Health. For older models, use coconutBattery (Mac) or iMazing via USB. Maximum Capacity below 80% means replacement is recommended." },
      },
      {
        "@type": "Question",
        "name": "Which iPad models are hardest to replace the battery on?",
        "acceptedAnswer": { "@type": "Answer", "text": "Hardest to easiest: iPad mini (tight clearance, high risk), iPad Air (thin body), iPad Pro 11 (moderate), iPad Pro 12.9 (most room), standard iPad (most accessible). All require heat at 80-90°C to soften adhesive." },
      },
      {
        "@type": "Question",
        "name": "What are the signs an iPad needs battery replacement?",
        "acceptedAnswer": { "@type": "Answer", "text": "Key symptoms: battery drains fast (under 6 hours screen time), unexpected shutdowns at 15-30%, percentage jumps erratically, slow charging, battery swelling. If battery is swelling, stop using immediately." },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phonerepairspares.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.phonerepairspares.com/products" },
      { "@type": "ListItem", "position": 3, "name": "iPad Batteries", "item": "https://www.phonerepairspares.com/products/ipad-battery-replacement-factory" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, faqSchema, breadcrumbSchema]),
        }}
      />
      {children}
    </>
  );
}
