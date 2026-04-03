import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale Phone Screens | iPhone & Samsung LCD/OLED Bulk Supplier - PRSPARES',
  description: 'B2B wholesale phone screens from $19/unit. iPhone 12-16 & Samsung S-series LCD/OLED displays in 5 quality grades. Factory-direct Shenzhen, MOQ 10pcs, 12-month warranty. Request bulk pricing.',
  keywords: 'wholesale phone screens, iPhone screen wholesale, bulk iPhone screens, cell phone screen wholesale, wholesale iPhone LCD, phone LCD wholesale, iPhone replacement screen wholesale, cell phone parts wholesale',
  openGraph: {
    title: 'Wholesale Phone Screens | iPhone & Samsung LCD/OLED Bulk Supplier - PRSPARES',
    description: 'B2B wholesale phone screens from $19/unit. iPhone & Samsung LCD/OLED in 5 quality grades. Factory-direct, MOQ 10pcs, 12-month warranty.',
    type: 'website',
    url: '/products/screens',
    images: [
      {
        url: '/PRSPARES1.png',
        width: 1200,
        height: 630,
        alt: 'Wholesale Phone Screens - PRSPARES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Screens | iPhone & Samsung LCD/OLED Bulk Supplier - PRSPARES',
    description: 'B2B wholesale phone screens from $19/unit. iPhone & Samsung LCD/OLED in 5 quality grades. Factory-direct, MOQ 10pcs, 12-month warranty.',
    images: ['/PRSPARES1.png'],
  },
  alternates: {
    canonical: '/products/screens',
  },
};

export default function ScreensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "iPhone Screen Replacements - Wholesale",
      "description": "Wholesale iPhone LCD and OLED screen assemblies in multiple quality grades: OEM Original, Soft OLED, Hard OLED, and Incell. Compatible with iPhone 12 through iPhone 16 series.",
      "brand": { "@type": "Brand", "name": "PRSPARES" },
      "category": "Phone Replacement Screens",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "19.00",
        "highPrice": "339.00",
        "priceCurrency": "USD",
        "offerCount": "50",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "PRSPARES" }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Samsung Screen Replacements - Wholesale",
      "description": "Wholesale Samsung Galaxy OLED and TFT screen assemblies. Galaxy S24, S23, S22 Ultra and standard models. OEM and aftermarket options available.",
      "brand": { "@type": "Brand", "name": "PRSPARES" },
      "category": "Phone Replacement Screens",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "35.00",
        "highPrice": "290.00",
        "priceCurrency": "USD",
        "offerCount": "20",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "PRSPARES" }
      }
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the difference between OLED, Soft OLED, Hard OLED, and Incell LCD screens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OEM Original uses the genuine factory display with perfect color accuracy. Soft OLED is the best aftermarket option — flexible OLED panel achieving 90-95% of OEM color quality with 120Hz support. Hard OLED uses a rigid OLED panel, slightly lower contrast but very durable. Incell LCD is a budget option using LCD technology — no deep blacks, standard refresh rate, but works perfectly for basic repairs."
        }
      },
      {
        "@type": "Question",
        "name": "Will True Tone still work after replacing the screen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "True Tone data is stored on the original screen's IC chip. When you replace the screen, True Tone needs to be transferred using a programmer (JC V1SE, i2C, or JCID). Soft OLED, Hard OLED, and OEM grade screens all support True Tone transfer."
        }
      },
      {
        "@type": "Question",
        "name": "Does iPhone screen replacement affect Face ID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — Face ID uses the front-facing TrueDepth camera system, which is separate from the display. As long as you transfer the original earpiece/proximity sensor flex cable to the new screen, Face ID will work normally on all screen grades."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between OEM, aftermarket, and refurbished screens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OEM Original screens are genuine parts pulled from new devices. OEM Refurbished uses the original LCD/OLED panel with a new glass and touch digitizer — near-OEM quality at 40-60% lower cost. Aftermarket screens (Soft OLED, Hard OLED, Incell) are newly manufactured to match original specs."
        }
      },
      {
        "@type": "Question",
        "name": "How much does iPhone screen replacement cost at wholesale?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wholesale pricing depends on model and grade. iPhone 16 Pro Max: $39 (Incell) to $259 (OEM). iPhone 14 Pro Max: $29 (Incell) to $179 (OEM). iPhone 13: $19 (Incell) to $89 (OEM). Volume discounts of 8-15% for 50+ units."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchemas)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      {children}
    </>
  );
}
