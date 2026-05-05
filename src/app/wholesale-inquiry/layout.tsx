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

const wholesaleInquiryJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Wholesale Phone Parts Quote',
    url: absoluteUrl('/wholesale-inquiry'),
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/wholesale-inquiry.jpg'),
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
        item: absoluteUrl('/wholesale-inquiry'),
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "What's your minimum order quantity?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MOQ starts from 10 units for screens and around 20 units for batteries or small parts. Mixed models and categories are supported.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I send a mixed model list?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Paste the models into the inquiry form and the sales team will confirm stock, grades and price tiers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide sample orders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Sample orders are available for quality checking before larger wholesale orders.',
        },
      },
      {
        '@type': 'Question',
        name: 'How fast can PRSPARES ship?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Popular in-stock items can move to packing quickly. Express routes usually take 3-7 days depending on destination and cargo type.',
        },
      },
    ],
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
