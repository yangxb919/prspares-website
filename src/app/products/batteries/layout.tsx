import type { Metadata } from 'next';

const metaTitle = 'Wholesale Phone Batteries iPhone Samsung | PRSPARES';
const metaDescription =
  'Wholesale iPhone and Samsung batteries from Shenzhen. MOQ 20 pcs, UN38.3 packing, QC, warranty support and fast quote for repair shops worldwide.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: 'iphone battery replacement, wholesale phone batteries, samsung battery wholesale, OEM iphone battery, high capacity iphone battery, bulk phone batteries, phone battery supplier, iphone 13 battery replacement, iphone battery health replacement',
  alternates: {
    canonical: '/products/batteries',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/batteries',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
};

export default function BatteriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const iphoneBatterySchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale iPhone Replacement Batteries",
    "description": "OEM original, high-capacity, and standard replacement batteries for iPhone 13–16 series. TI/ATL cells with UN38.3 safety certification.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "iPhone Batteries",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "5",
      "highPrice": "42",
      "offerCount": "33",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "PRSPARES" },
    },
  };

  const samsungBatterySchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale Samsung Replacement Batteries",
    "description": "OEM original, high-capacity, and standard replacement batteries for Samsung Galaxy S23–S24 series. High-quality lithium polymer cells.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "Samsung Batteries",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "6",
      "highPrice": "22",
      "offerCount": "12",
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
        "name": "Is it worth replacing an iPhone battery at 80% health?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes — 80% is Apple's threshold where performance degrades noticeably. Users experience unexpected shutdowns and shorter screen-on time. Replacing at 80% restores full-day battery life. iPhone 13-15 series account for the majority of replacement demand." },
      },
      {
        "@type": "Question",
        "name": "Why does iPhone show 'Unable to determine battery health' after replacement?",
        "acceptedAnswer": { "@type": "Answer", "text": "Since iOS 15.2, Apple pairs batteries to the motherboard via an encrypted chip. Third-party batteries trigger a non-genuine warning. This does NOT affect performance or charging. Use OEM Original batteries or a battery programmer (JC V1SE) to transfer health data." },
      },
      {
        "@type": "Question",
        "name": "What is the difference between OEM, high-capacity, and standard batteries?",
        "acceptedAnswer": { "@type": "Answer", "text": "OEM Original: genuine TI/ATL cells, shows correct battery health in iOS. High-Capacity: 10-20% larger capacity for longer battery life, may trigger iOS warnings. Standard: same capacity as original with certified cells, most cost-effective for high-volume shops." },
      },
      {
        "@type": "Question",
        "name": "How long does a replacement phone battery last?",
        "acceptedAnswer": { "@type": "Answer", "text": "A quality replacement battery is designed for 800-1,000 full charge cycles retaining 80%+ capacity — typically 2-3 years of normal use. Keep charge between 20-80% for optimal longevity." },
      },
      {
        "@type": "Question",
        "name": "What safety certifications should wholesale phone batteries have?",
        "acceptedAnswer": { "@type": "Answer", "text": "Legitimate wholesale batteries must carry: UN38.3 (mandatory for shipping), UL 2054 or IEC 62133 (safety standards), CE marking (EU compliance), and FCC (US). All PRSPARES batteries carry these certifications." },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phonerepairspares.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.phonerepairspares.com/products" },
      { "@type": "ListItem", "position": 3, "name": "Phone Batteries", "item": "https://www.phonerepairspares.com/products/batteries" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([iphoneBatterySchema, samsungBatterySchema, faqSchema, breadcrumbSchema]),
        }}
      />
      {children}
    </>
  );
}
