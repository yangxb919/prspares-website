import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry Insights | PRSPARES',
  description: 'Industry insights and market analysis for mobile repair professionals.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function IndustryInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
