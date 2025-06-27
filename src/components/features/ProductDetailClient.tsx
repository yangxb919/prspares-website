'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MessageCircle, FileText, Phone, Mail, User } from 'lucide-react';
import InquiryModal from '@/components/InquiryModal';
import ChatModal from '@/components/ChatModal';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  compatibility: string[];
  specifications: Record<string, string>;
  stock_status: string;
}

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };







  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Image Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
                      {/* Main Image */}
          <div className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Image navigation arrows - show on hover */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="relative">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-[#00B140]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
              
              {/* Thumbnail navigation arrows */}
              {product.images.length > 5 && (
                <>
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-50"
                    aria-label="Scroll thumbnails left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-50"
                    aria-label="Scroll thumbnails right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Right Card - Product Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Product Category Tag */}
            {product.category && (
              <div>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                  MOBILE PART - GENERIC
                </span>
              </div>
            )}

            {/* Product Title and Basic Info */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Price */}
              {product.price && !isNaN(product.price) && product.price > 0 && (
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through">$19.11</span>
                </div>
              )}

              {/* Additional Info */}
              <div className="text-sm text-gray-600 mb-4">
                <p>Free Opening Tool! Please review our Disclaimer, before purchase!</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Usually ships in 1-2 days</span>
                </div>
              </div>

              {/* Action Buttons - Side by Side */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  Request Quote
                </button>

                <button
                  onClick={() => setShowChatModal(true)}
                  className="flex-1 bg-white border border-green-600 text-green-600 hover:bg-green-50 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  Ask a Question
                </button>
              </div>

              {/* Guarantee Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Our Guarantee:</h3>
                <p className="text-sm text-gray-700">
                  100% Satisfaction Guarantee. All parts are tested and backed by our warranty.
                  Quality Parts, Expert Repairs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Request Quote Modal */}
      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
      />

      {/* AI Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  );
};

export default ProductDetailClient; 