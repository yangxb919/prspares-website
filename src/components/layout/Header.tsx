'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import Image from 'next/image';
import { Menu, X, MessageSquare } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 h-[70px] w-full sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-6">
        {/* Mobile Layout */}
        <div className="md:hidden h-full flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
          </button>

          {/* Mobile Logo - centered */}
          <div className="flex-1 flex justify-center px-2">
            <Link href="/" className="hover:scale-105 transition-transform duration-200">
              <Image
                src="/PRSPARES1.png"
                alt="PRSPARES"
                width={140}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/wholesale-inquiry"
              className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              onClick={() => trackEvent('quote_cta_click', { event_label: 'Header Mobile' })}
            >
              <MessageSquare size={12} />
              Quote
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-full">
          {/* Desktop Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="hover:scale-105 transition-transform duration-200">
              <Image
                src="/PRSPARES1.png"
                alt="PRSPARES - Mobile Phone Repair Parts"
                width={200}
                height={65}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            <Navigation />
          </div>

          {/* Desktop CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/wholesale-inquiry"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              onClick={() => trackEvent('quote_cta_click', { event_label: 'Header Desktop' })}
            >
              <MessageSquare size={16} />
              Get Wholesale Quote
            </Link>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[70px] bg-white z-40 p-6 border-t border-gray-100 shadow-lg">
            <Navigation orientation="vertical" onMenuItemClick={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
