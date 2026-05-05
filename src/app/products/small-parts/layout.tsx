import type { Metadata } from 'next';

const metaTitle = 'Wholesale Phone Small Parts Camera Ports | PRSPARES';
const metaDescription =
  'Wholesale phone small parts for repair shops: cameras, charging ports, flex cables and speakers. MOQ support, broad model coverage and fast B2B quote.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: 'wholesale cell phone parts, cell phone replacement parts wholesale, iphone back glass replacement, iphone charging port replacement, iphone camera replacement, iphone 15 charging port, wholesale phone parts, phone repair parts wholesale, phone parts supplier',
  alternates: {
    canonical: '/products/small-parts',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/small-parts',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
};

export default function SmallPartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale Cell Phone Replacement Parts — Cameras, Charging Ports, Back Glass",
    "description": "Wholesale cell phone replacement parts including cameras, charging ports, back glass panels, speakers, and flex cables for iPhone and Samsung devices.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "Phone Small Parts",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "2",
      "highPrice": "65",
      "offerCount": "65",
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
        "name": "Does my iPhone need a Lightning or USB-C charging port?",
        "acceptedAnswer": { "@type": "Answer", "text": "iPhone 15 and newer use USB-C. iPhone 14 and earlier use Lightning. The ports are NOT cross-compatible. We stock both types for all models from iPhone 8 through iPhone 16." },
      },
      {
        "@type": "Question",
        "name": "What is the best method for iPhone back glass replacement — laser or heat gun?",
        "acceptedAnswer": { "@type": "Answer", "text": "Laser removal is the professional standard with 95%+ success rate and no internal heat damage risk. Heat gun method works but risks damage above 120°C. For shops doing 5+ repairs per week, we recommend laser. We supply both back glass panels (from $2) and laser machines ($350)." },
      },
      {
        "@type": "Question",
        "name": "What is the difference between OEM and aftermarket camera modules?",
        "acceptedAnswer": { "@type": "Answer", "text": "OEM modules are genuine parts with identical autofocus, OIS, and image quality. Aftermarket modules match specs but may show slight differences in color temperature. For Pro models, we recommend OEM. For standard models, quality aftermarket performs very close to OEM." },
      },
      {
        "@type": "Question",
        "name": "Does iPhone water resistance survive after speaker or earpiece replacement?",
        "acceptedAnswer": { "@type": "Answer", "text": "The original IP68 rating is voided when the device is opened. Proper reassembly with new adhesive gaskets restores reasonable water resistance but not certified IP68. We include replacement adhesive with speaker and earpiece parts." },
      },
      {
        "@type": "Question",
        "name": "Are flex cables interchangeable across iPhone models?",
        "acceptedAnswer": { "@type": "Answer", "text": "No — flex cables are strictly model-specific. Even sub-models (e.g., iPhone 13 Pro vs 13 Pro Max) use different flex cables. Always verify the exact model number (A2XXX) before ordering." },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phonerepairspares.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.phonerepairspares.com/products" },
      { "@type": "ListItem", "position": 3, "name": "Small Parts", "item": "https://www.phonerepairspares.com/products/small-parts" }
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
