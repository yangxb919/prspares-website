import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Phone Batteries - High Capacity Lithium Replacements | PRSPARES',
  description: 'High-capacity mobile phone batteries for iPhone, Samsung, and Android devices. Original quality lithium-ion batteries with safety certifications. Wholesale supplier for repair shops worldwide.',
  keywords: 'mobile phone battery, iPhone battery, Samsung battery, Android battery, lithium-ion battery, battery replacement, high capacity, wholesale batteries, OEM quality',
  openGraph: {
    title: 'Mobile Phone Batteries - High Capacity Lithium Replacements | PRSPARES',
    description: 'High-capacity mobile phone batteries for iPhone, Samsung, and Android devices. Original quality lithium-ion batteries with safety certifications.',
    type: 'website',
    url: 'https://prspares.com/products/batteries',
    images: [
      {
        url: 'https://prspares.com/images/batteries-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobile Phone Batteries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Phone Batteries - High Capacity Lithium Replacements | PRSPARES',
    description: 'High-capacity mobile phone batteries for iPhone, Samsung, and Android devices. Original quality lithium-ion batteries.',
    images: ['https://prspares.com/images/batteries-hero.jpg'],
  },
  alternates: {
    canonical: 'https://prspares.com/products/batteries',
  },
};

export default function BatteriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mobile Phone Batteries",
    "description": "High-capacity mobile phone batteries for iPhone, Samsung, and Android devices. Original quality lithium-ion batteries with safety certifications.",
    "brand": {
      "@type": "Brand",
      "name": "PRSPARES"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PRSPARES"
    },
    "category": "Mobile Phone Batteries",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PRSPARES"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "2100"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      {children}
    </>
  );
}
