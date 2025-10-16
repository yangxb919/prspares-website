'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface NavigationProps {
  orientation?: 'horizontal' | 'vertical';
  onMenuItemClick?: () => void;
}

const Navigation = ({ orientation = 'horizontal', onMenuItemClick }: NavigationProps) => {
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const productCategories = [
    { name: 'Screens', path: '/products/screens' },
    { name: 'Repair Tools', path: '/products/repair-tools' },
    { name: 'Batteries', path: '/products/batteries' },
    { name: 'Small Parts', path: '/products/small-parts' },
  ];

  const isProductsActive = pathname?.startsWith('/products') ?? false;

  const handleMenuItemClick = () => {
    if (orientation === 'vertical' && onMenuItemClick) {
      onMenuItemClick();
    }
  };

  return (
    <nav className={`flex ${orientation === 'vertical' ? 'flex-col space-y-3' : 'space-x-8'}`}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`
              ${orientation === 'vertical'
                ? `w-full py-3 px-4 rounded-lg text-left transition-all duration-200 bg-white border border-gray-100 shadow-sm ${
                    isActive
                      ? 'text-[#00B140] bg-green-50 border-green-200 font-semibold'
                      : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50 hover:border-gray-200'
                  }`
                : `relative py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#00B140] bg-green-50'
                      : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50'
                  }`
              }
            `}
            onClick={handleMenuItemClick}
          >
            {item.name}
            {isActive && orientation === 'horizontal' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#00B140] rounded-full"></div>
            )}
          </Link>
        );
      })}

      {/* Products Dropdown */}
      <div
        className={`relative ${orientation === 'vertical' ? 'w-full' : ''}`}
        onMouseEnter={() => orientation === 'horizontal' && setIsProductsOpen(true)}
        onMouseLeave={() => orientation === 'horizontal' && setIsProductsOpen(false)}
      >
        {orientation === 'horizontal' ? (
          <Link
            href="/products"
            className={`
              relative py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 ${
                isProductsActive
                  ? 'text-[#00B140] bg-green-50'
                  : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50'
              }
            `}
          >
            <span>Products</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
            {isProductsActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#00B140] rounded-full"></div>
            )}
          </Link>
        ) : (
          <button
            className={`
              w-full py-3 px-4 rounded-lg text-left transition-all duration-200 bg-white border border-gray-100 shadow-sm flex items-center justify-between ${
                isProductsActive
                  ? 'text-[#00B140] bg-green-50 border-green-200 font-semibold'
                  : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50 hover:border-gray-200'
              }
            `}
            onClick={() => setIsProductsOpen(!isProductsOpen)}
          >
            <span>Products</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Dropdown Menu */}
        {isProductsOpen && orientation === 'horizontal' && (
          <>
            {/* Invisible bridge to prevent menu from closing */}
            <div className="absolute top-full left-0 w-48 h-1 z-40"></div>
            <div
              className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
            >
              {productCategories.map((category) => {
                const isCategoryActive = pathname === category.path;
                return (
                  <Link
                    key={category.path}
                    href={category.path}
                    className={`
                      block px-4 py-2 text-sm transition-all duration-200 ${
                        isCategoryActive
                          ? 'text-[#00B140] bg-green-50 font-medium'
                          : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setIsProductsOpen(false)}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Vertical Menu for Mobile */}
        {isProductsOpen && orientation === 'vertical' && (
          <div className="mt-2 ml-4 space-y-2 bg-white rounded-lg border border-gray-200 p-3 shadow-md">
            {productCategories.map((category) => {
              const isCategoryActive = pathname === category.path;
              return (
                <Link
                  key={category.path}
                  href={category.path}
                  className={`
                    block py-2 px-4 rounded-lg text-sm transition-all duration-200 ${
                      isCategoryActive
                        ? 'text-[#00B140] bg-green-50 font-medium'
                        : 'text-gray-700 hover:text-[#00B140] hover:bg-gray-50'
                    }
                  `}
                  onClick={() => {
                    setIsProductsOpen(false);
                    handleMenuItemClick();
                  }}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
