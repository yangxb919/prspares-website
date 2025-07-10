import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Phone Small Parts - Cameras, Speakers, Charging Ports | PRSPARES',
  description: 'Mobile phone small parts including cameras, speakers, charging ports, flex cables, and connectors. OEM quality components for iPhone, Samsung, and Android devices. Wholesale supplier for repair shops.',
  keywords: 'mobile phone small parts, camera module, speaker, charging port, flex cable, connector, iPhone parts, Samsung parts, Android components, wholesale parts',
  openGraph: {
    title: 'Mobile Phone Small Parts - Cameras, Speakers, Charging Ports | PRSPARES',
    description: 'Mobile phone small parts including cameras, speakers, charging ports, flex cables, and connectors. OEM quality components for all major brands.',
    type: 'website',
    url: 'https://prspares.com/products/small-parts',
    images: [
      {
        url: 'https://prspares.com/images/small-parts-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobile Phone Small Parts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Phone Small Parts - Cameras, Speakers, Charging Ports | PRSPARES',
    description: 'Mobile phone small parts including cameras, speakers, charging ports, flex cables, and connectors. OEM quality components.',
    images: ['https://prspares.com/images/small-parts-hero.jpg'],
  },
  alternates: {
    canonical: 'https://prspares.com/products/small-parts',
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
    "name": "Mobile Phone Small Parts",
    "description": "Mobile phone small parts including cameras, speakers, charging ports, flex cables, and connectors. OEM quality components for iPhone, Samsung, and Android devices.",
    "brand": {
      "@type": "Brand",
      "name": "PRSPARES"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PRSPARES"
    },
    "category": "Mobile Phone Small Parts",
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
      "ratingValue": "4.6",
      "reviewCount": "1580"
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
