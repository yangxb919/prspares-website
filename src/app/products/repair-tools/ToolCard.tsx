'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';
import { trackEvent } from '@/lib/analytics';

interface ToolCardProps {
  name: string;
  desc: string;
  priceFrom: number;
  badge?: string;
  badgeColor?: string;
}

export default function ToolCard({ name, desc, priceFrom, badge, badgeColor = 'bg-blue-600' }: ToolCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent('quote_cta_click', { event_label: `Tool: ${name}` });
          setOpen(true);
        }}
        className="group block rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden text-left w-full"
      >
        {badge && (
          <div className={`${badgeColor} text-white px-4 py-1.5 text-xs font-bold`}>
            {badge}
          </div>
        )}
        <div className="p-4">
          <h4 className="font-bold text-gray-900 mb-1 text-sm">{name}</h4>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-500">From ${priceFrom}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:text-orange-600">
              Quote <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </button>
      <QuoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={name}
      />
    </>
  );
}
