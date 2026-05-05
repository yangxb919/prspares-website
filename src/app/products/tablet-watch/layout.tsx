import type { Metadata } from 'next';

const metaTitle = 'Wholesale Tablet & Smartwatch Parts — iPad, Apple Watch | PRSPARES';
const metaDescription =
  'Wholesale tablet and smartwatch repair parts: iPad screens, batteries, flex cables; Apple Watch and Galaxy Watch displays. 1,800+ SKUs, 24h quote.';

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords:
    'wholesale tablet repair parts, iPad parts wholesale, Galaxy Tab parts wholesale, Apple Watch screen wholesale, smartwatch repair parts wholesale',
  alternates: {
    canonical: '/products/tablet-watch',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    url: '/products/tablet-watch',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: ['/PRSPARES1.png'],
  },
};

export default function TabletWatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wholesale Tablet and Smartwatch Repair Parts',
    description: metaDescription,
    url: 'https://www.phonerepairspares.com/products/tablet-watch',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: 1800,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'iPad Screens and Batteries' },
        { '@type': 'ListItem', position: 2, name: 'Galaxy Tab Displays and Flex Cables' },
        { '@type': 'ListItem', position: 3, name: 'Apple Watch Displays and Batteries' },
        { '@type': 'ListItem', position: 4, name: 'Galaxy Watch and Huawei Watch Parts' },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.phonerepairspares.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.phonerepairspares.com/products' },
      { '@type': 'ListItem', position: 3, name: 'Tablet & Watch Parts', item: 'https://www.phonerepairspares.com/products/tablet-watch' },
    ],
  };

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
