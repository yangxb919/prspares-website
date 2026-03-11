import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale Phone Parts — Factory Direct Pricing | PRSPARES',
  description:
    'Request wholesale quote for phone repair parts. 10-year Shenzhen manufacturer. OEM quality, factory pricing, flexible MOQ. Serving 1000+ B2B clients worldwide.',
  alternates: {
    canonical: '/wholesale-inquiry',
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

export default function WholesaleInquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
