'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy entry-point for QuoteModal (legacy product-card modal).
 *
 * The modal pulls in form state, Turnstile, lucide icons and validation,
 * which adds ~80 KB to every product page that renders a "Get Quote"
 * button. None of that is needed until the user actually clicks the
 * button, so we defer the chunk download to interaction time.
 *
 * `ssr: false` is safe — the modal only renders when `isOpen` is true,
 * and that state lives in a client component.
 */
const QuoteModal = dynamic(() => import('./QuoteModal'), { ssr: false });

export default QuoteModal;
