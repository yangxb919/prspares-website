import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ModelScreenPage from '@/components/products/ModelScreenPage';
import { SCREEN_MODEL_PAGES, SCREEN_MODEL_PAGE_BY_SLUG } from '@/data/screen-model-pages';

// Only the model pages listed in screen-model-pages.ts exist; any other slug 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return SCREEN_MODEL_PAGES.map((p) => ({ model: p.slug }));
}

export function generateMetadata({ params }: { params: { model: string } }): Metadata {
  const page = SCREEN_MODEL_PAGE_BY_SLUG[params.model];
  if (!page) return {};
  const path = `/products/screens/${page.slug}`;
  // Self-referencing canonical + own OG url: the screens layout sets
  // canonical '/products/screens', which this page must not inherit.
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
      url: path,
      images: [{ url: '/PRSPARES1.png', width: 1200, height: 630, alt: `${page.model} Screens Wholesale - PRSPARES` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['/PRSPARES1.png'],
    },
    alternates: { canonical: path },
  };
}

export default function ModelScreensRoute({ params }: { params: { model: string } }) {
  const page = SCREEN_MODEL_PAGE_BY_SLUG[params.model];
  if (!page) notFound();
  return <ModelScreenPage page={page} />;
}
