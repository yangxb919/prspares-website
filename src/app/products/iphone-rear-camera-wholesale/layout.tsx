import type { Metadata } from 'next';

const metaTitle = 'iPhone Rear Camera Wholesale Module Supply | PRSPARES';
const metaDescription =
  'Wholesale iPhone rear camera modules and lens parts for repair shops. MOQ support, batch QC, mixed-model sourcing and fast B2B quote from Shenzhen.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: 'wholesale iphone camera modules, iphone rear camera wholesale, iphone front camera parts, iphone camera lens replacement, iphone camera ring frame, iphone small parts supplier, phone camera module wholesale',
  alternates: {
    canonical: '/products/iphone-rear-camera-wholesale',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/iphone-rear-camera-wholesale',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
};

export default function iPhoneCameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Wholesale iPhone Camera Modules and Lens Parts",
    "description": "PRSPARES category page for wholesale iPhone rear camera modules, front cameras, camera lens covers and camera ring-frame parts.",
    "url": "https://www.phonerepairspares.com/products/iphone-rear-camera-wholesale",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 6,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Apple iPhone 16 Pro Max Rear Camera" },
        { "@type": "ListItem", "position": 2, "name": "Apple iPhone 16 Pro / 16 Pro Max Rear Camera Lens" },
        { "@type": "ListItem", "position": 3, "name": "Apple iPhone 16 Pro Max Front Camera" },
        { "@type": "ListItem", "position": 4, "name": "Apple iPhone 14 Pro Max Original Rear Camera" },
        { "@type": "ListItem", "position": 5, "name": "Apple iPhone 13 Pro Max Rear Camera" },
        { "@type": "ListItem", "position": 6, "name": "Apple iPhone 16 Pro Max Camera Ring Frame with Lens" }
      ]
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale iPhone Camera Modules and Lens Parts",
    "description": "Wholesale iPhone camera replacement parts including rear camera modules, front cameras, camera lens covers and ring-frame parts for iPhone 11-16 model families.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "Phone Camera Replacement Parts",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0.65",
      "highPrice": "57.13",
      "offerCount": "6",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "PRSPARES" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phonerepairspares.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.phonerepairspares.com/products" },
      { "@type": "ListItem", "position": 3, "name": "iPhone Camera Modules", "item": "https://www.phonerepairspares.com/products/iphone-rear-camera-wholesale" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionSchema, productSchema, breadcrumbSchema]),
        }}
      />
      {children}
    </>
  );
}
