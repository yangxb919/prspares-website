'use client';

import { useEffect } from 'react';
import { captureFirstTouch } from '@/lib/attribution';

/**
 * Records first-touch RFQ attribution (landing page + referrer + utm) once per
 * visit. Mounted site-wide in the root layout so the real entry page is
 * captured — even when the visitor lands on a blog post and only later reaches
 * a form. Renders nothing.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}
