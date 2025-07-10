import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Phone Repair Tools - Professional Equipment & Programmers | PRSPARES',
  description: 'Professional mobile phone repair tools including screwdrivers, programmers, soldering stations, and testing equipment. Wholesale supplier for repair shops with technical support and video tutorials.',
  keywords: 'mobile phone repair tools, repair programmers, soldering station, True Tone programmer, JCID programmer, repair equipment, wholesale tools, technical support',
  openGraph: {
    title: 'Mobile Phone Repair Tools - Professional Equipment & Programmers | PRSPARES',
    description: 'Professional mobile phone repair tools including screwdrivers, programmers, soldering stations, and testing equipment. Wholesale supplier for repair shops.',
    type: 'website',
    url: 'https://prspares.com/products/repair-tools',
    images: [
      {
        url: 'https://prspares.com/images/repair-tools-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobile Phone Repair Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Phone Repair Tools - Professional Equipment & Programmers | PRSPARES',
    description: 'Professional mobile phone repair tools including screwdrivers, programmers, soldering stations, and testing equipment.',
    images: ['https://prspares.com/images/repair-tools-hero.jpg'],
  },
  alternates: {
    canonical: 'https://prspares.com/products/repair-tools',
  },
};

export default function RepairToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mobile Phone Repair Tools",
    "description": "Professional mobile phone repair tools including screwdrivers, programmers, soldering stations, and testing equipment. Wholesale supplier for repair shops with technical support.",
    "brand": {
      "@type": "Brand",
      "name": "PRSPARES"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PRSPARES"
    },
    "category": "Mobile Phone Repair Tools",
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
      "ratingValue": "4.9",
      "reviewCount": "890"
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
