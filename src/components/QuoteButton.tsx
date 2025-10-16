'use client';

import { useState } from 'react';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import QuoteModalEnhanced from './QuoteModalEnhanced';

interface QuoteButtonProps {
  text?: string;
  productName?: string;
  articleTitle?: string;
  variant?: 'default' | 'cta' | 'inline' | 'banner';
  className?: string;
}

export default function QuoteButton({ 
  text = "Request My Free Quote Now",
  productName,
  articleTitle,
  variant = 'default',
  className = ''
}: QuoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Default button style
  if (variant === 'default') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
        >
          {text}
          <ArrowRight size={18} />
        </button>
        
        <QuoteModalEnhanced
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={productName}
          articleTitle={articleTitle}
        />
      </>
    );
  }

  // Call-to-action banner style
  if (variant === 'cta') {
    return (
      <>
        <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white my-8 ${className}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-4">Get your personalized quote in minutes</p>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <Zap size={16} />
                  <span>Fast Response</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>24h Turnaround</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClick}
              className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              {text}
            </button>
          </div>
        </div>
        
        <QuoteModalEnhanced
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={productName}
          articleTitle={articleTitle}
        />
      </>
    );
  }

  // Inline text link style
  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors ${className}`}
        >
          {text}
        </button>
        
        <QuoteModalEnhanced
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={productName}
          articleTitle={articleTitle}
        />
      </>
    );
  }

  // Banner style for prominent placement
  if (variant === 'banner') {
    return (
      <>
        <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg ${className}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                <Zap size={20} />
                <span>Special Offer</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Get Your Free Quote Today!</h3>
              <p className="text-gray-600">No obligation • Fast response • Best prices guaranteed</p>
            </div>
            <button
              onClick={handleClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              {text}
            </button>
          </div>
        </div>
        
        <QuoteModalEnhanced
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={productName}
          articleTitle={articleTitle}
        />
      </>
    );
  }

  return null;
}

// 导出一些预设的组件变体，方便在文章中使用
export const QuoteButtonDefault = (props: Omit<QuoteButtonProps, 'variant'>) => (
  <QuoteButton {...props} variant="default" />
);

export const QuoteButtonCTA = (props: Omit<QuoteButtonProps, 'variant'>) => (
  <QuoteButton {...props} variant="cta" />
);

export const QuoteButtonInline = (props: Omit<QuoteButtonProps, 'variant'>) => (
  <QuoteButton {...props} variant="inline" />
);

export const QuoteButtonBanner = (props: Omit<QuoteButtonProps, 'variant'>) => (
  <QuoteButton {...props} variant="banner" />
);
