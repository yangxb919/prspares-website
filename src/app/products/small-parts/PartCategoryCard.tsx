'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';
import { trackEvent } from '@/lib/analytics';

interface PartItem {
  name: string;
  model: string;
  priceFrom: number;
}

interface PartCategoryCardProps {
  category: string;
  icon: React.ReactNode;
  items: PartItem[];
}

export default function PartCategoryCard({ category, icon, items }: PartCategoryCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(category);

  const handleItemClick = (item: PartItem) => {
    const product = `${item.model} ${item.name}`;
    setSelectedProduct(product);
    trackEvent('quote_cta_click', { event_label: `Part: ${product}` });
    setOpen(true);
  };

  const handleCategoryClick = () => {
    setSelectedProduct(category);
    trackEvent('quote_cta_click', { event_label: `Category: ${category}` });
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="bg-[#1e3a5f] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-bold">{category}</h4>
          </div>
          <span className="text-xs text-blue-200">{items.length} items</span>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleItemClick(item)}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-orange-50 transition-colors text-left group"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500 ml-2">{item.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-orange-500">From ${item.priceFrom}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCategoryClick}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
          >
            Request {category} Quote <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <QuoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={selectedProduct}
      />
    </>
  );
}
