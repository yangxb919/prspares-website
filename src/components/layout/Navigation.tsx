'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BatteryCharging,
  Boxes,
  ChevronDown,
  Cpu,
  MonitorSmartphone,
  TabletSmartphone,
  type LucideIcon,
  Wrench,
} from 'lucide-react';
import {
  productMenuAllCatalog,
  productMenuCategories,
  productMenuGroups,
  type ProductMenuIcon,
  type ProductMenuItem,
} from '@/data/product-taxonomy';

interface NavigationProps {
  orientation?: 'horizontal' | 'vertical';
  onMenuItemClick?: () => void;
}

const productIconMap: Record<ProductMenuIcon, LucideIcon> = {
  screens: MonitorSmartphone,
  batteries: BatteryCharging,
  smallParts: Boxes,
  tools: Wrench,
  tabletWatch: TabletSmartphone,
  catalog: Cpu,
};

function pathOnly(path: string) {
  return path.split(/[?#]/)[0];
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

  const isProductsActive = pathname?.startsWith('/products') ?? false;
  const isProductLinkActive = (path: string) => {
    const cleanPath = pathOnly(path);
    if (cleanPath === '/products') {
      return pathname === '/products';
    }
    return pathname === cleanPath || Boolean(pathname?.startsWith(`${cleanPath}/`));
  };

  const ProductIcon = ({ icon, className }: { icon: ProductMenuIcon; className?: string }) => {
    const Icon = productIconMap[icon];
    return <Icon className={className} />;
  };

  const renderDesktopProductItem = (item: ProductMenuItem) => {
    const isCategoryActive = isProductLinkActive(item.path);

    return (
      <div
        key={`${item.name}-${item.path}`}
        className={`
          rounded-md border p-4 transition-all duration-200 ${
            isCategoryActive
              ? 'border-green-200 bg-green-50'
              : 'border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/50'
          }
        `}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
            <ProductIcon icon={item.icon} className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <Link
              href={item.path}
              className={`block text-sm font-black leading-5 transition hover:text-[#00B140] ${
                isCategoryActive ? 'text-[#00B140]' : 'text-gray-900'
              }`}
              onClick={() => {
                setIsProductsOpen(false);
                handleMenuItemClick();
              }}
            >
              {item.name}
            </Link>
            <span className="mt-1 block text-xs font-semibold text-[#0b6b45]">{item.count}</span>
            <span className="mt-1 block text-xs leading-5 text-gray-500">{item.detail}</span>
          </span>
        </div>
        {item.children && item.children.length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
            {item.children.map((child) => {
              const isChildActive = isProductLinkActive(child.path);

              return (
                <Link
                  key={`${item.name}-${child.name}-${child.path}`}
                  href={child.path}
                  className={`flex items-center justify-between gap-3 rounded-md px-2 py-2 text-xs font-bold transition ${
                    isChildActive
                      ? 'bg-white text-[#00B140]'
                      : 'text-gray-600 hover:bg-white hover:text-[#00B140]'
                  }`}
                  onClick={() => {
                    setIsProductsOpen(false);
                    handleMenuItemClick();
                  }}
                >
                  <span>{child.name}</span>
                  {child.count && <span className="font-mono text-[11px] text-[#0b6b45]">{child.count}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
        <div
          className={`absolute right-0 top-full z-40 h-2 w-[720px] max-w-[calc(100vw-2rem)] ${
            orientation === 'horizontal' ? '' : 'hidden'
          } ${isProductsOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!isProductsOpen}
        ></div>
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-[720px] max-w-[calc(100vw-2rem)] rounded-lg border border-gray-100 bg-white p-4 shadow-2xl shadow-gray-900/10 transition-all duration-200 ${
            orientation === 'horizontal' ? '' : 'hidden'
          } ${
            isProductsOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          aria-hidden={!isProductsOpen}
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">Product categories</span>
            <Link
              href={productMenuAllCatalog.path}
              className="text-xs font-black text-[#0b6b45] transition hover:text-[#ff8a2a]"
              onClick={() => {
                setIsProductsOpen(false);
                handleMenuItemClick();
              }}
            >
              All catalog · {productMenuAllCatalog.count}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {productMenuCategories.map((item) => renderDesktopProductItem(item))}
          </div>
        </div>

        {/* Vertical Menu for Mobile */}
        <div
          className={`mt-2 space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-md transition-all duration-200 ${
            orientation === 'vertical' ? '' : 'hidden'
          } ${
            isProductsOpen
              ? 'max-h-[1200px] opacity-100'
              : 'max-h-0 border-transparent p-0 opacity-0 shadow-none'
          }`}
          aria-hidden={!isProductsOpen}
        >
          <Link
            href={productMenuAllCatalog.path}
            className={`flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
              isProductLinkActive(productMenuAllCatalog.path)
                ? 'bg-green-50 font-semibold text-[#00B140]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#00B140]'
            }`}
            onClick={() => {
              setIsProductsOpen(false);
              handleMenuItemClick();
            }}
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
              <ProductIcon icon={productMenuAllCatalog.icon} className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-bold leading-5">{productMenuAllCatalog.name}</span>
              <span className="mt-0.5 block text-xs font-semibold text-[#0b6b45]">{productMenuAllCatalog.count}</span>
            </span>
          </Link>
          {productMenuGroups.map((group) => (
            <div key={group.label}>
              <div className="px-2 pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((category) => {
                  const isCategoryActive = isProductLinkActive(category.path);
                  return (
                    <Link
                      key={`${group.label}-${category.name}-${category.path}`}
                      href={category.path}
                      className={`
                        flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
                          isCategoryActive
                            ? 'bg-green-50 font-semibold text-[#00B140]'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#00B140]'
                        }
                      `}
                      onClick={() => {
                        setIsProductsOpen(false);
                        handleMenuItemClick();
                      }}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                        <ProductIcon icon={category.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold leading-5">{category.name}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-[#0b6b45]">{category.count}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-gray-500">{category.detail}</span>
                        {category.children && category.children.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {category.children.slice(0, 3).map((child) => (
                              <span key={`${category.name}-${child.name}`} className="rounded-sm bg-[#fff7ed] px-2 py-1 text-[11px] font-bold text-[#c45a14]">
                                {child.name}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
