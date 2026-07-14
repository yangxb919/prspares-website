'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Filter, MessageCircle } from 'lucide-react';
import QuoteModal from '@/components/QuoteModalLazy';
import { trackEvent } from '@/lib/analytics';
import { waLink, waProductPrefill } from '@/lib/whatsapp';

interface ProductCardProps {
  model: string;
  grade: string;
  gradeLabel: string;
  gradeColor: string;
  priceFrom: number;
  features: string[];
  query: string;
}

export default function ProductCard({ model, gradeLabel, gradeColor, priceFrom, features, query }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const productName = `${model} ${gradeLabel} Screen`;

  return (
    <>
      <div className="group rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden w-full flex flex-col">
        <button
          type="button"
          onClick={() => {
            trackEvent('quote_cta_click', { event_label: `Product Card: ${productName}` });
            setOpen(true);
          }}
          className="block text-left w-full flex-1"
        >
          <div className={`${gradeColor} text-white px-4 py-2 flex items-center justify-between`}>
            <span className="text-sm font-bold">{gradeLabel}</span>
            <Filter className="w-3.5 h-3.5 opacity-60" />
          </div>
          <div className="p-4 pb-3">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              From <span className="text-orange-500">${priceFrom}</span>
            </div>
            <div className="text-xs text-gray-500 mb-3">per unit · MOQ 10 pcs</div>
            <ul className="space-y-1.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:text-orange-600">
                Request Quote <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </button>
        <a
          href={waLink(waProductPrefill(`${model} ${gradeLabel} screens`, priceFrom))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { event_label: `Product Card WA: ${productName}` })}
          className="mx-4 mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Quick quote on WhatsApp
        </a>
      </div>
      <QuoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={productName}
      />
    </>
  );
}
