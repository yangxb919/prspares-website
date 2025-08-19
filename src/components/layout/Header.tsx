'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';
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
                src="/PRSPARES1 .png"
                alt="PRSPARES"
                width={140}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile Social Icons - compact */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Link href="https://facebook.com" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" aria-label="Facebook">
              <Facebook size={14} />
            </Link>
            <Link href="https://instagram.com" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all duration-200" aria-label="Instagram">
              <Instagram size={14} />
            </Link>
            <Link href="https://youtube.com" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200" aria-label="YouTube">
              <Youtube size={14} />
            </Link>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-all duration-200" aria-label="Search">
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-full">
          {/* Desktop Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="hover:scale-105 transition-transform duration-200">
              <Image
                src="/PRSPARES1 .png"
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

          {/* Desktop Social media icons and search button */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link href="https://facebook.com" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" aria-label="Facebook">
              <Facebook size={18} />
            </Link>
            <Link href="https://instagram.com" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all duration-200" aria-label="Instagram">
              <Instagram size={18} />
            </Link>
            <Link href="https://youtube.com" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200" aria-label="YouTube">
              <Youtube size={18} />
            </Link>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 ml-2" aria-label="Search">
              <Search size={18} />
            </button>
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
