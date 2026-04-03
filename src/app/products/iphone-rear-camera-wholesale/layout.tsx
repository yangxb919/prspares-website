import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iPhone Camera Lens Replacement | Rear Camera Module Wholesale — From $29 | PRSPARES',
  description:
    'Wholesale iPhone camera lens replacement: OEM rear camera modules for iPhone 11–16 series. Autofocus tested, optical image stabilization verified. MOQ 20 pcs, 12-month warranty. Factory-direct from Shenzhen.',
  keywords: 'iphone camera lens replacement, iphone camera replacement, iphone rear camera wholesale, iphone 15 camera replacement, iphone 14 camera replacement, iphone 13 camera lens replacement, camera module wholesale, iphone camera lens replacement kit',
  alternates: {
    canonical: '/products/iphone-rear-camera-wholesale',
  },
  openGraph: {
    title: 'iPhone Camera Lens Replacement Wholesale — Rear Camera Modules | PRSPARES',
    description:
      'Wholesale iPhone rear camera modules: OEM quality for iPhone 11–16 series. Autofocus & OIS tested. Factory-direct from Shenzhen.',
    type: 'website',
    url: '/products/iphone-rear-camera-wholesale',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iPhone Camera Lens Replacement Wholesale — Rear Camera Modules | PRSPARES',
    description:
      'Wholesale iPhone rear camera modules for iPhone 11–16 series. OEM quality, factory-direct from Shenzhen.',
    images: ['/PRSPARES1.png'],
  },
};

export default function iPhoneCameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wholesale iPhone Rear Camera Modules — Camera Lens Replacement for iPhone 11–16",
    "description": "OEM quality iPhone rear camera modules for iPhone 11, 12, 13, 14, 15, and 16 series. Autofocus tested, optical image stabilization verified. Factory-direct wholesale.",
    "brand": { "@type": "Brand", "name": "PRSPARES" },
    "category": "iPhone Camera Modules",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "29",
      "highPrice": "65",
      "offerCount": "24",
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
        "name": "How much does iPhone camera replacement cost?",
        "acceptedAnswer": { "@type": "Answer", "text": "Apple charges $169-$249. Third-party shops charge $80-$150 (OEM) or $40-$80 (aftermarket). Wholesale: iPhone 16 Pro Max $65, 15 Pro Max $55, 14 Pro Max $48, 13 Pro Max $42, 11 $29. Bulk discounts from 50+ units." },
      },
      {
        "@type": "Question",
        "name": "What is the difference between camera glass and camera module?",
        "acceptedAnswer": { "@type": "Answer", "text": "Camera glass is the protective cover — replacing it costs $15-$30. The camera module is the actual sensor, lens, autofocus motor, and OIS system — costs $29-$65 wholesale. If only the glass is cracked but camera still works, you may only need the glass." },
      },
      {
        "@type": "Question",
        "name": "Why is my iPhone camera shaking or vibrating after replacement?",
        "acceptedAnswer": { "@type": "Answer", "text": "Usually caused by: OIS motor not seated properly, aftermarket module with weaker OIS magnets, debris between module and housing, or wrong model installed. Always test OIS before returning device to customer." },
      },
      {
        "@type": "Question",
        "name": "Does replacing the iPhone camera affect photo quality?",
        "acceptedAnswer": { "@type": "Answer", "text": "With OEM modules: no difference. With quality aftermarket: very close to OEM, slight differences possible in color temperature on Pro models. The key factor is autofocus calibration — a properly tested module produces identical results." },
      },
      {
        "@type": "Question",
        "name": "Are iPhone camera modules compatible across different models?",
        "acceptedAnswer": { "@type": "Answer", "text": "No — strictly model-specific. Even within the same generation: iPhone 15 Pro and 15 Pro Max use different modules. iPhone 14 and 14 Plus share a module, but 14 Pro and 14 Pro Max do not. Always verify the exact model number." },
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
