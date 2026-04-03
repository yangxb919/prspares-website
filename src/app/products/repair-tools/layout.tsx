import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phone Repair Tools Wholesale | iPhone Screen Tester, Programmers, Spot Welder — From $3 | PRSPARES',
  description:
    'Wholesale phone repair tools: iPhone screen testers, True Tone programmers, battery spot welders, soldering stations, LCD separators. 200+ SKUs, 12-month warranty. Factory-direct from Shenzhen.',
  keywords: 'phone repair tools, iphone screen tester, battery spot welder, lcd screen tester, phone repair tool kit, true tone programmer, tools for mobile phone repair, wholesale repair tools, repair equipment supplier',
  alternates: {
    canonical: '/products/repair-tools',
  },
  openGraph: {
    title: 'Phone Repair Tools Wholesale — Testers, Programmers, Soldering Equipment | PRSPARES',
    description:
      'Wholesale phone repair tools: screen testers, True Tone programmers, battery spot welders, soldering stations. 200+ SKUs from Shenzhen.',
    type: 'website',
    url: '/products/repair-tools',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phone Repair Tools Wholesale — Testers, Programmers, Soldering Equipment | PRSPARES',
    description:
      'Wholesale phone repair tools: screen testers, programmers, spot welders, soldering stations. Factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
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
    "name": "Wholesale Phone Repair Tools — Screen Testers, Programmers, Soldering Equipment",
    "description": "Professional phone repair tools including iPhone screen testers, True Tone programmers, battery spot welders, soldering stations, and LCD separator machines for repair shops and refurbishment factories.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "Phone Repair Tools",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "3",
      "highPrice": "350",
      "offerCount": "45",
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
        "name": "What essential tools do I need to start a phone repair shop?",
        "acceptedAnswer": { "@type": "Answer", "text": "Basic starter kit: precision screwdriver set ($5-12), ESD tweezers ($8), opening tools ($3), anti-static mat ($15), True Tone programmer JC V1SE ($45), and screen tester ($35-85). Total under $200. Add hot air station ($95), microscope ($150), and LCD separator ($120) as volume grows." },
      },
      {
        "@type": "Question",
        "name": "JC V1SE vs i2C i6S — which True Tone programmer is better?",
        "acceptedAnswer": { "@type": "Answer", "text": "Both support iPhone 7-16 for True Tone, battery health, and Face ID data transfer. JC V1SE ($45) is more affordable with faster firmware updates. i2C i6S ($55) has a compact design. For most shops, JC V1SE offers best value. High-volume shops should consider JC V1S Pro Full Set ($120)." },
      },
      {
        "@type": "Question",
        "name": "Can an aftermarket iPhone screen have True Tone?",
        "acceptedAnswer": { "@type": "Answer", "text": "Aftermarket screens don't come with True Tone data. You need a programmer (JC V1SE, i2C, or JCID) to read data from the original screen and write it to the new one. Takes about 30 seconds. Soft OLED, Hard OLED, and OEM screens support True Tone transfer." },
      },
      {
        "@type": "Question",
        "name": "What hot air station temperature should I use for iPhone chip removal?",
        "acceptedAnswer": { "@type": "Answer", "text": "Shield removal: 280-300°C. Small IC chips: 340-360°C. CPU/NAND: 365-400°C with preheater at 150-180°C. Always use a preheater for BGA work. Start low and increase gradually. Quick 861DW ($95) recommended." },
      },
      {
        "@type": "Question",
        "name": "LCD separator machine vs heat gun — which is better for screen refurbishment?",
        "acceptedAnswer": { "@type": "Answer", "text": "LCD separator machines provide even, controlled heat with built-in vacuum — much safer than heat guns. For shops doing 3+ refurbishments per day, a separator (TBK-568R, $120) is essential. It pays for itself within a week." },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, faqSchema]),
        }}
      />
      {children}
    </>
  );
}
