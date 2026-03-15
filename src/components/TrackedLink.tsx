'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

/** Link that fires a GA4 event on click (works in Server Component pages) */
export function TrackedLink({
  href,
  event,
  params,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  event: string;
  params?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:');

  if (isExternal) {
    return (
      <a href={href} onClick={() => trackEvent(event, params)} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={() => trackEvent(event, params)} {...(rest as Record<string, unknown>)}>
      {children}
    </Link>
  );
}
