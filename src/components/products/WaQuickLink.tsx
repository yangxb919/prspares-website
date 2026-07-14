'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';
import { waLink } from '@/lib/whatsapp';

interface WaQuickLinkProps {
  message: string;
  eventLabel: string;
  className?: string;
  children: ReactNode;
}

/** WhatsApp deep link with prefilled text + GA4 whatsapp_click event (usable from server components). */
export default function WaQuickLink({ message, eventLabel, className = '', children }: WaQuickLinkProps) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { event_label: eventLabel })}
      className={className}
    >
      {children}
    </a>
  );
}
