'use client';

import { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';
import { trackEvent } from '@/lib/analytics';

interface ScreensQuoteButtonProps {
  label?: string;
  product?: string;
  eventLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'nav' | 'float' | 'footer' | 'footer-wa';
  className?: string;
}

export default function ScreensQuoteButton({
  label = 'Request Bulk Quote',
  product = 'Screens',
  eventLabel = 'Screens CTA',
  variant = 'primary',
  className = '',
}: ScreensQuoteButtonProps) {
  const [open, setOpen] = useState(false);

  // WhatsApp link — don't use modal
  if (variant === 'footer-wa') {
    return (
      <a
        href={`https://wa.me/85363902425?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20screens`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { event_label: eventLabel })}
        className={className}
      >
        {label}
      </a>
    );
  }

  const baseStyles: Record<string, string> = {
    primary: 'inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-7 rounded-lg transition-all',
    secondary: 'inline-flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2a4d7a] text-white font-semibold py-2.5 px-6 rounded-lg transition-all text-sm',
    outline: 'inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-lg border border-white/20 transition-all',
    nav: 'inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-lg border border-white/20 transition-all',
    float: 'inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm',
    footer: 'inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg text-lg shadow-lg transition-all hover:-translate-y-0.5',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent('quote_cta_click', { event_label: eventLabel });
          setOpen(true);
        }}
        className={className || baseStyles[variant] || baseStyles.primary}
      >
        {(variant === 'primary' || variant === 'float' || variant === 'footer') && <MessageSquare className="w-5 h-5" />}
        {variant === 'secondary' && <MessageSquare className="w-4 h-4" />}
        {label}
      </button>
      <QuoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={product}
      />
    </>
  );
}
