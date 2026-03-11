import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry News & Reports | PRSPARES Mobile Repair Insights',
  description: 'Stay ahead with comprehensive market analysis, technology trends, and industry insights for mobile repair professionals.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Industry News & Reports | PRSPARES',
    description: 'Comprehensive industry reports and market insights for mobile repair professionals',
    images: ['/images/oled_factory_hero.jpg'],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
