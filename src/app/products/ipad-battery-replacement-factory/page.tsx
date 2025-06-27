import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, Award, Battery } from 'lucide-react';

export const metadata: Metadata = {
  title: 'iPad Battery Replacement Factory | OEM Wholesale Supplier - PRSPARES',
  description: 'Professional iPad battery replacement factory. OEM quality lithium batteries for all iPad models. Wholesale supplier with factory direct pricing and global shipping.',
};

export default function iPadBatteryReplacementFactoryPage() {
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
            <span className="text-gray-900">iPad Battery Replacement Factory</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-[#00B140] to-[#00D155] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              iPad Battery Replacement Factory
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              OEM Quality iPad Battery Replacement Manufacturer - Factory Direct Wholesale Supplier for All iPad Models with Original Capacity & Safety Certifications
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span>OEM Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery size={20} />
                <span>Original Capacity</span>
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
                Professional iPad Battery Replacement Factory
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                PRSPARES is your trusted iPad battery replacement factory, manufacturing OEM quality lithium batteries for all iPad models. 
                As a professional mobile device battery manufacturer based in Shenzhen Huaqiangbei, we provide factory direct wholesale 
                pricing with original capacity specifications and comprehensive safety certifications.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Available iPad Battery Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  'iPad Pro 12.9" (6th Gen) Battery',
                  'iPad Pro 11" (4th Gen) Battery',
                  'iPad Air (5th Gen) Battery',
                  'iPad (10th Gen) Battery',
                  'iPad mini (6th Gen) Battery',
                  'iPad Pro 12.9" (5th Gen) Battery',
                  'iPad Pro 11" (3rd Gen) Battery',
                  'iPad Air (4th Gen) Battery',
                  'iPad (9th Gen) Battery',
                  'iPad Pro 12.9" (4th Gen) Battery',
                  'iPad Pro 11" (2nd Gen) Battery',
                  'iPad Air (3rd Gen) Battery',
                  'iPad (8th Gen) Battery',
                  'iPad mini (5th Gen) Battery',
                  'iPad Pro 12.9" (3rd Gen) Battery',
                  'iPad Pro 11" (1st Gen) Battery'
                ].map((model, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Battery className="w-5 h-5 text-[#00B140] mr-3" />
                    <span className="font-medium">{model}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-900">Factory Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Shield className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">OEM Quality</h4>
                  <p className="text-gray-600">Original capacity and safety standards</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Clock className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">Fast Production</h4>
                  <p className="text-gray-600">Quick manufacturing and delivery</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Award className="w-12 h-12 text-[#00B140] mx-auto mb-4" />
                  <h4 className="font-bold mb-2">Factory Direct</h4>
                  <p className="text-gray-600">Best wholesale pricing from manufacturer</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality Certifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {['CE Certified', 'RoHS Compliant', 'FCC Approved', 'ISO 9001'].map((cert, index) => (
                  <div key={index} className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-green-800">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-[#00B140] to-[#00D155] text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Request Factory Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
