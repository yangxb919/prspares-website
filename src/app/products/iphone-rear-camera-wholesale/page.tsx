import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'iPhone Rear Camera Wholesale | OEM Factory Direct Supplier - PRSPARES',
  description: 'Professional iPhone rear camera wholesale supplier. OEM quality camera modules for iPhone 11, 12, 13, 14, 15 series. Factory direct pricing, bulk orders welcome.',
};

export default function iPhoneRearCameraWholesalePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#00B140]">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-[#00B140]">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">iPhone Rear Camera Wholesale</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-[#00B140] to-[#00D155] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              iPhone Rear Camera Wholesale
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              OEM Quality iPhone Rear Camera Modules - Factory Direct Wholesale Supplier for iPhone 11, 12, 13, 14, 15 Series Camera Components
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span>OEM Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>Fast Wholesale Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} />
                <span>Factory Direct Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Professional iPhone Rear Camera Wholesale Supplier
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                PRSPARES is your trusted iPhone rear camera wholesale supplier, offering OEM quality camera modules for all iPhone series. 
                As a professional mobile phone parts manufacturer based in Shenzhen Huaqiangbei, we provide factory direct pricing 
                for bulk orders and wholesale purchases.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Available iPhone Camera Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  'iPhone 15 Pro Max Rear Camera',
                  'iPhone 15 Pro Rear Camera',
                  'iPhone 15 Rear Camera',
                  'iPhone 14 Pro Max Rear Camera',
                  'iPhone 14 Pro Rear Camera',
                  'iPhone 14 Rear Camera',
                  'iPhone 13 Pro Max Rear Camera',
                  'iPhone 13 Pro Rear Camera',
                  'iPhone 13 Rear Camera',
                  'iPhone 12 Pro Max Rear Camera',
                  'iPhone 12 Pro Rear Camera',
                  'iPhone 12 Rear Camera',
                  'iPhone 11 Pro Max Rear Camera',
                  'iPhone 11 Pro Rear Camera',
                  'iPhone 11 Rear Camera',
                  'iPhone XS Max Rear Camera'
                ].map((model, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-[#00B140] rounded-full mr-3"></div>
                    <span className="font-medium">{model}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-900">Wholesale Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Shield className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">OEM Quality</h4>
                  <p className="text-gray-600">Original specifications and quality standards</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Clock className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">Fast Shipping</h4>
                  <p className="text-gray-600">Quick wholesale delivery worldwide</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Award className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">Factory Direct</h4>
                  <p className="text-gray-600">Best wholesale pricing from manufacturer</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-[#00B140] to-[#00D155] text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Request Wholesale Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
