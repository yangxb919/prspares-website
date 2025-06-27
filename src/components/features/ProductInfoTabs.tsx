'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  compatibility?: string | string[];
}

interface ProductInfoTabsProps {
  product: Product;
}

const ProductInfoTabs = ({ product }: ProductInfoTabsProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'specifications'>('details');

  const handleTabClick = (tab: 'details' | 'specifications') => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('details')}
            >
              Product Details
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'specifications'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('specifications')}
            >
              Specifications
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Product Details Tab */}
          {activeTab === 'details' && (
            <div className="tab-content">
              {product.description ? (
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {product.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-3 last:mb-0 text-sm">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <p>Detailed product information will be available soon.</p>
                </div>
              )}
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="tab-content">
              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    OEM Quality
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Perfect Fit
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Easy Installation
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Tested Quality
                  </div>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Technical Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-600">Compatibility:</dt>
                      <dd className="text-gray-900 font-medium">
                        {Array.isArray(product.compatibility) 
                          ? product.compatibility.join(', ') 
                          : product.compatibility || 'Universal'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="text-gray-900 font-medium">{product.category || 'Mobile Parts'}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-600">Brand:</dt>
                      <dd className="text-gray-900 font-medium">{product.brand || 'Generic'}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-600">Warranty:</dt>
                      <dd className="text-gray-900 font-medium">90 Days</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfoTabs;
