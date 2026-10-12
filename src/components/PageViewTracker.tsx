'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * Pushes a GA4 page_view to the GTM dataLayer on first load and on every
 * client-side route change. De-duplication (same URL twice in a row) lives in
 * trackPageView. Mounted in the root layout inside <Suspense> because
 * useSearchParams would otherwise opt every page out of static rendering.
 * Renders nothing.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';

  useEffect(() => {
    // Let Next.js commit the new <title> before reading document.title.
    const id = window.setTimeout(trackPageView, 0);
    return () => window.clearTimeout(id);
  }, [pathname, search]);

  return null;
}
