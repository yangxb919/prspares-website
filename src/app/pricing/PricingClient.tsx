'use client';

import { useState, useMemo, useEffect } from 'react';

type Product = {
  id: string;
  title: string | null;
  slug?: string | null;
  specs: any;
  images: string[] | null;
  created_at?: string;
};

interface PricingClientProps {
  products: Product[] | null;
  error: any;
  debug: boolean;
}

function formatPrice(specs: any) {
  const price = specs?.price;
  const currency = specs?.currency;
  if (price == null) return "—";

  // If price is already a formatted string, return it
  if (typeof price === 'string') {
    return price;
  }

  const cur = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(price);
  } catch {
    return `${cur} ${price.toFixed(2)}`;
  }
}

// Define categories and their filters
const categories = [
  {
    brand: 'Apple',
    icon: '🍎',
    subcategories: [
      // Based on actual database model values
      { name: 'iPhone 16e Repair Parts', filter: 'iPhone16e' },
      { name: 'iPhone 16 Pro Max Repair Parts', filter: 'iPhone16 Pro Max' },
      { name: 'iPhone 16 Pro Repair Parts', filter: 'iPhone16 Pro' },
      { name: 'iPhone 16 Plus Repair Parts', filter: 'iPhone16 Plus' },
      { name: 'iPhone 16 Repair Parts', filter: 'iPhone16' },
      { name: 'iPhone 13 Mini Repair Parts', filter: 'iPhone13 mini' },
      // Additional models that might be added later
      { name: 'iPhone 15 Pro Max Repair Parts', filter: 'iPhone15 Pro Max' },
      { name: 'iPhone 15 Pro Repair Parts', filter: 'iPhone 15 Pro' },
      { name: 'iPhone 15 Plus Repair Parts', filter: 'iPhone 15 Plus' },
      { name: 'iPhone 15 Repair Parts', filter: 'iPhone 15' },
      { name: 'iPhone 14 Pro Max Repair Parts', filter: 'iPhone14 Pro Max' },
      { name: 'iPhone 14 Pro Repair Parts', filter: 'iPhone14 Pro' },
      { name: 'iPhone 14 Plus Repair Parts', filter: 'iPhone14 Plus' },
      { name: 'iPhone 14 Repair Parts', filter: 'iPhone14' },
      { name: 'iPhone 13 Pro Max Repair Parts', filter: 'iPhone13 Pro Max' },
      { name: 'iPhone 13 Pro Repair Parts', filter: 'iPhone13 Pro' },
      { name: 'iPhone 13 Repair Parts', filter: 'iPhone13' },
      { name: 'iPhone 12 Pro Max Repair Parts', filter: 'iPhone12 Pro Max' },
      { name: 'iPhone 12 Pro Repair Parts', filter: 'iPhone12 Pro' },
      { name: 'iPhone 12 Repair Parts', filter: 'iPhone12' },
      { name: 'iPhone 11 Pro Max Repair Parts', filter: 'iPhone11 Pro Max' },
      { name: 'iPhone 11 Pro Repair Parts', filter: 'iPhone11 Pro' },
      { name: 'iPhone 11 Repair Parts', filter: 'iPhone11' },
      { name: 'iPhone XS Max Repair Parts', filter: 'iPhoneXS Max' },
      { name: 'iPhone XS Repair Parts', filter: 'iPhoneXS' },
      { name: 'iPhone XR Repair Parts', filter: 'iPhoneXR' },
      { name: 'iPhone X Repair Parts', filter: 'iPhoneX' },
      { name: 'iPhone SE 2020 Repair Parts', filter: 'iPhoneSE2020' },
      { name: 'iPad Pro Series Repair Parts', filter: 'iPadPro' },
      { name: 'iPad Air Series Repair Parts', filter: 'iPadAir' },
      { name: 'iPad Mini Series Repair Parts', filter: 'iPadMini' },
      { name: 'iPad Series Repair Parts', filter: 'iPad' },
      { name: 'Apple Watch Repair Parts', filter: 'AppleWatch' },
      { name: 'AirPods Series Parts', filter: 'AirPods' },
    ]
  },
  {
    brand: 'Samsung',
    icon: '📱',
    subcategories: [
      // Using database-compatible model naming format
      { name: 'Galaxy S25 Ultra Repair Parts', filter: 'GalaxyS25Ultra' },
      { name: 'Galaxy S25+ Repair Parts', filter: 'GalaxyS25Plus' },
      { name: 'Galaxy S25 Repair Parts', filter: 'GalaxyS25' },
      { name: 'Galaxy S24 FE Repair Parts', filter: 'GalaxyS24FE' },
      { name: 'Galaxy S24 Ultra Repair Parts', filter: 'GalaxyS24Ultra' },
      { name: 'Galaxy S24+ Repair Parts', filter: 'GalaxyS24Plus' },
      { name: 'Galaxy S24 Repair Parts', filter: 'GalaxyS24' },
      { name: 'Galaxy S23 FE Repair Parts', filter: 'GalaxyS23FE' },
      { name: 'Galaxy S23 Ultra Repair Parts', filter: 'GalaxyS23Ultra' },
      { name: 'Galaxy S23+ Repair Parts', filter: 'GalaxyS23Plus' },
      { name: 'Galaxy S23 Repair Parts', filter: 'GalaxyS23' },
      { name: 'Galaxy S22 Ultra Repair Parts', filter: 'GalaxyS22Ultra' },
      { name: 'Galaxy S22+ Repair Parts', filter: 'GalaxyS22Plus' },
      { name: 'Galaxy S22 Repair Parts', filter: 'GalaxyS22' },
      { name: 'Galaxy Note Series Repair Parts', filter: 'GalaxyNote' },
      { name: 'Galaxy A Series Repair Parts', filter: 'GalaxyA' },
      { name: 'Galaxy J Series Repair Parts', filter: 'GalaxyJ' },
      { name: 'Galaxy Z Series Repair Parts', filter: 'GalaxyZ' },
      { name: 'Galaxy M Series Repair Parts', filter: 'GalaxyM' },
      { name: 'Galaxy Tab Series Repair Parts', filter: 'GalaxyTab' },
    ]
  },
  {
    brand: 'Xiaomi',
    icon: '📱',
    subcategories: [
      { name: 'Mi 14 Series', filter: 'Mi 14' },
      { name: 'Redmi Note Series', filter: 'Redmi Note' },
      { name: 'POCO Series', filter: 'POCO' },
    ]
  },
  {
    brand: 'Huawei',
    icon: '📱',
    subcategories: [
      { name: 'P60 Series', filter: 'P60' },
      { name: 'Mate 60 Series', filter: 'Mate 60' },
      { name: 'Nova Series', filter: 'Nova' },
    ]
  }
];

export default function PricingClient({ products: initialProducts, error: initialError, debug }: PricingClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[] | null>(initialProducts);
  const [error, setError] = useState<any>(initialError);
  const [loading, setLoading] = useState(false);

  // Pagination settings
  const PRODUCTS_PER_PAGE = 24; // 6 rows × 4 columns

  // Function to fetch products with filters
  const fetchProducts = async (model?: string, search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (model) params.append('model', model);
      if (search) params.append('search', search);

      const response = await fetch(`/api/products?${params.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setProducts(result.products);
        setError(null);
      } else {
        setError({ message: result.error || 'Failed to fetch products' });
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError({ message: 'Failed to fetch products' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations - now using products directly since filtering is done server-side
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products?.slice(startIndex, endIndex) || [];

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleCategoryClick = (filter: string) => {
    const newCategory = selectedCategory === filter ? null : filter;
    setSelectedCategory(newCategory);
    fetchProducts(newCategory || undefined, searchTerm || undefined);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    fetchProducts(selectedCategory || undefined, newSearchTerm || undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageClick = (imageUrl: string, title: string) => {
    setSelectedImage({ url: imageUrl, title });
    setIsModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased">
      <main className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-80 flex-shrink-0 bg-gray-800 p-6 space-y-6 rounded-lg border border-gray-700">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-green-400 mb-4">Product Categories</h2>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  aria-label="Search products"
                />
              </div>
            </div>

            {/* Brand Categories */}
            <div className="space-y-4">
              {categories.map((category, categoryIndex) => (
                <div key={category.brand} className={`${categoryIndex < categories.length - 1 ? 'border-b border-gray-700 pb-4' : 'pb-4'}`}>
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.brand}
                  </h3>
                  <div className="ml-6 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.name}
                        onClick={() => handleCategoryClick(subcategory.filter)}
                        className={`cursor-pointer transition-colors text-sm ${
                          selectedCategory === subcategory.filter
                            ? 'text-green-400 font-medium'
                            : 'text-gray-300 hover:text-green-400'
                        }`}
                      >
                        {subcategory.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex-1 min-w-0" id="products-section">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-white">Product Pricing</h1>
              <div className="text-sm text-gray-400">
                {totalProducts > 0 ? (
                  <>
                    Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                    {totalPages > 1 && (
                      <span className="ml-2 text-gray-500">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </>
                ) : (
                  `Showing 0 of ${products?.length || 0} products`
                )}
                {selectedCategory && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-1 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-gray-400">
                  <svg className="animate-spin mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Loading products...</h3>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <p className="text-red-400 font-medium">Unable to load products. Please try again later.</p>
                {debug && (
                  <pre className="mt-3 text-xs text-gray-400 whitespace-pre-wrap break-words bg-gray-800 p-3 rounded border border-gray-700">
                    {String(error.message || "")}
                  </pre>
                )}
              </div>
            ) : (Array.isArray(currentProducts) && currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProducts.map((p) => {
                  const imageUrl = p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png";
                  return (
                    <div
                      key={p.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg group relative"
                    >
                      <img
                        src={imageUrl}
                        alt={p.title || "Product image"}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                        onClick={() => handleImageClick(imageUrl, p.title || "Product image")}
                      />
                      <div className="p-4">
                        <div className="relative">
                          <h3
                            className="font-semibold text-lg text-white mb-2 line-clamp-2 cursor-help transition-all duration-300"
                            title={p.title ?? "Untitled"}
                          >
                            {p.title ?? "Untitled"}
                          </h3>

                          {/* Enhanced Tooltip for full title on hover */}
                          {(p.title && p.title.length > 40) && (
                            <div className="tooltip absolute bottom-full left-0 mb-2">
                              {p.title}
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-green-400 font-medium text-xl">
                          {formatPrice(p.specs)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        const showEllipsis =
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              currentPage === page
                                ? 'bg-green-600 text-white border border-green-500'
                                : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    {(searchTerm || selectedCategory) ? 'No matching products found' : 'No products yet'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {(searchTerm || selectedCategory) 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Products will appear here once they are imported.'
                    }
                  </p>
                  {!(searchTerm || selectedCategory) && (
                    <p className="mt-2 text-xs text-gray-500">
                      Import CSV using: <code className="bg-gray-700 px-2 py-1 rounded text-green-400">npm run import:products -- path/to/file.csv</code>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm animate-fadeIn p-4"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Close image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image container */}
            <div
              className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden animate-scaleIn flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh' }}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '85vh', maxWidth: '90vw' }}
              />

              {/* Image title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold leading-tight">
                  {selectedImage.title}
                </h3>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mt-4">
              <p className="text-gray-300 text-sm">
                Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> or click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
