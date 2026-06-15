import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

const WHOLESALE_INQUIRY_URL = absoluteUrl('/wholesale-inquiry');

export const metadata: Metadata = {
  title: 'Wholesale Phone Parts — Factory Direct Pricing | PRSPARES',
  description:
    'Request a wholesale quote for phone repair parts from Shenzhen. MOQ support, OEM quality options, price tiers, QC, warranty and fast B2B response.',
  alternates: {
    canonical: '/wholesale-inquiry',
    languages: {
      en: '/wholesale-inquiry',
      'id-ID': '/id/wholesale',
      'th-TH': '/th/wholesale',
      'x-default': '/wholesale-inquiry',
    },
  },
  openGraph: {
    title: 'Wholesale Phone Parts — Factory Direct Pricing | PRSPARES',
    description:
      'Request wholesale quote for phone repair parts. Factory-direct from Shenzhen. OEM quality, flexible MOQ.',
    type: 'website',
    url: '/wholesale-inquiry',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Phone Parts — Factory Direct Pricing | PRSPARES',
    description:
      'Request wholesale quote for phone repair parts. Factory-direct from Shenzhen. OEM quality, flexible MOQ.',
    images: ['/PRSPARES1.png'],
  },
};

const offerCategories = [
  'LCD/OLED screen assemblies',
  'Phone batteries',
  'Small repair parts',
  'IC chips and repair tools',
  'Mixed-model wholesale orders',
];

const procurementFaqItems = [
  {
    q: 'How should a repair business choose a wholesale phone parts supplier in China?',
    a: 'Before comparing only unit price, buyers should check model coverage, available quality grades, stock confirmation process, defect handling, shipping route options and how clearly the supplier can quote mixed-model lists.',
  },
  {
    q: 'What information should I prepare before requesting a wholesale phone parts quote?',
    a: 'Prepare the phone models, part categories, estimated quantity range, target quality grade, destination country and any packing or shipping requirements. This lets the supplier confirm stock, alternatives and freight constraints faster.',
  },
  {
    q: 'How do I compare screen or battery quality grades before a bulk order?',
    a: 'Ask the supplier to separate original, premium aftermarket and standard aftermarket options instead of mixing them in one quote. Compare compatibility, warranty handling, visible defects, packaging and route limitations for batteries.',
  },
  {
    q: 'What should I check before placing a first order with a phone parts wholesaler?',
    a: 'Start by confirming exact model compatibility, replacement policy, test process, shipping route and whether the supplier can quote the same SKU list repeatedly. A sample or smaller first batch can reduce procurement risk.',
  },
  {
    q: 'When is a mixed-model order better than a single-SKU wholesale order?',
    a: 'Mixed-model orders fit repair shops and distributors that need coverage across common repairs. They help test supplier responsiveness and stock breadth before committing to deeper volume on one model or grade.',
  },
];

const wholesaleInquiryJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${WHOLESALE_INQUIRY_URL}#webpage`,
    name: 'Wholesale Phone Parts Quote',
    url: WHOLESALE_INQUIRY_URL,
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/wholesale-inquiry.jpg'),
    mainEntity: [
      { '@id': `${WHOLESALE_INQUIRY_URL}#quote-service` },
      { '@id': `${WHOLESALE_INQUIRY_URL}#faq` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${WHOLESALE_INQUIRY_URL}#quote-service`,
    name: 'Wholesale phone repair parts sourcing and quotation',
    serviceType: 'B2B wholesale phone repair parts quotation',
    provider: {
      '@type': 'Organization',
      name: 'PRSPARES',
      url: SITE_URL,
    },
    areaServed: 'Worldwide',
    audience: {
      '@type': 'Audience',
      audienceType: 'Repair shops, parts distributors and refurbishment teams',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wholesale phone repair parts categories',
      itemListElement: offerCategories.map((name, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          // Category buckets of a B2B quotation Service — NOT priced retail products.
          // Typed as Service (not Product) so Google's Product-snippet validator does
          // not require offers/review/aggregateRating on each bare category node.
          '@type': 'Service',
          name,
        },
      })),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Wholesale Inquiry',
        item: WHOLESALE_INQUIRY_URL,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${WHOLESALE_INQUIRY_URL}#faq`,
    mainEntity: procurementFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  },
];

export default function WholesaleInquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={wholesaleInquiryJsonLd} />
      {children}
    </>
  );
}
