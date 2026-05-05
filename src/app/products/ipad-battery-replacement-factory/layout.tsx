import type { Metadata } from 'next';

const metaTitle = 'iPad Battery Wholesale — OEM Replacement from $8 | PRSPARES';
const metaDescription =
  'Wholesale iPad batteries from Shenzhen with OEM replacement options from $8. MOQ support, UN38.3 packing, batch QC and fast quote for shops worldwide.';

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
    "name": "Wholesale iPad Battery Replacement — OEM Batteries for All iPad Models",
    "description": "OEM quality iPad replacement batteries for iPad Pro 12.9, iPad Pro 11, iPad Air, iPad mini, and standard iPad models. Factory-direct wholesale from Shenzhen.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "iPad Batteries",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "8",
      "highPrice": "32",
      "offerCount": "20",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "PRSPARES" },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does iPad battery replacement cost?",
        "acceptedAnswer": { "@type": "Answer", "text": "Apple charges $99-$149 depending on model. Third-party shops charge $79-$119. Wholesale battery cost: $8-$32 per unit. iPad Pro 12.9 batteries cost $22-$32, standard iPad models start at $10." },
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
