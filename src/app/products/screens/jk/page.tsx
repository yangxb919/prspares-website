import type { Metadata } from 'next';
import BrandScreenPage from '@/components/products/BrandScreenPage';
import { SCREEN_BRAND_BY_KEY } from '@/data/screen-brands';

const brand = SCREEN_BRAND_BY_KEY.jk;

export const metadata: Metadata = {
  title: brand.metaTitle,
  description: brand.metaDescription,
  keywords: brand.keywords,
  openGraph: {
    title: brand.metaTitle,
    description: brand.metaDescription,
    type: 'website',
    url: '/products/screens/jk',
    images: [{ url: '/PRSPARES1.png', width: 1200, height: 630, alt: 'JK iPhone Screens Wholesale - PRSPARES' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.metaTitle,
    description: brand.metaDescription,
    images: ['/PRSPARES1.png'],
  },
  alternates: {
    canonical: '/products/screens/jk',
  },
};

export default function JkScreensPage() {
  return <BrandScreenPage brand={brand} />;
}
