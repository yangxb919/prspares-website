import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Phone Screen Replacements - LCD & OLED Displays | PRSPARES',
  description: 'Premium mobile phone screen replacements for iPhone, Samsung, and Android devices. OEM quality LCD and OLED displays with True Tone support. Wholesale supplier for repair shops worldwide.',
  keywords: 'mobile phone screen replacement, LCD display, OLED screen, iPhone screen, Samsung display, Android screen, True Tone, wholesale, repair parts',
  openGraph: {
    title: 'Mobile Phone Screen Replacements - LCD & OLED Displays | PRSPARES',
    description: 'Premium mobile phone screen replacements for iPhone, Samsung, and Android devices. OEM quality LCD and OLED displays with True Tone support.',
    type: 'website',
    url: 'https://prspares.com/products/screens',
    images: [
      {
        url: 'https://prspares.com/images/screens-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobile Phone Screen Replacements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Phone Screen Replacements - LCD & OLED Displays | PRSPARES',
    description: 'Premium mobile phone screen replacements for iPhone, Samsung, and Android devices. OEM quality LCD and OLED displays with True Tone support.',
    images: ['https://prspares.com/images/screens-hero.jpg'],
  },
  alternates: {
    canonical: 'https://prspares.com/products/screens',
  },
};

export default function ScreensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mobile Phone Screen Replacements",
    "description": "Premium mobile phone screen replacements for iPhone, Samsung, and Android devices. OEM quality LCD and OLED displays with True Tone support.",
    "brand": {
      "@type": "Brand",
      "name": "PRSPARES"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PRSPARES"
    },
    "category": "Mobile Phone Screens",
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
      "ratingValue": "4.8",
      "reviewCount": "1250"
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
