import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mobile Screen Replacements - Premium Quality | PRSPARES',
  description: 'High-quality mobile screen replacements for iPhone, Android, and tablets. OEM quality with True Tone support and rigorous testing.',
};

export default function ScreensPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Screens - <span className="text-blue-600">Sourcing Solution</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whatever issues your customers may be experiencing with their phone screens, choosing high-quality, 
                  reliable cell phone screen replacements that are rigorously tested for quality is the right choice. 
                  Our screens support restoring the True Tone function and fixing pop-up messages, providing a silky 
                  smooth touch experience comparable to the original screen at a reasonable price.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products?category=screens" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse All Screens
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Get Quote
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/screens-hero.jpg"
                  alt="Mobile Screen Replacements"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* iPhone Screen Product Line */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                iPhone Screen Product Line
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PRSPARES selected iPhone screen assembly covers from iPhone 7-16 series. Moreover, we support 
                IC transplant which ease the pain for "unknown part" message after screen replacing.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">True Tone function restoration support</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">120Hz high refresh rate screens for Pro models</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Various quality grades: OEM, Aftermarket, Incell</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/iphone-screens.jpg"
                  alt="iPhone Screen Replacements"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Screen Product Line */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/android-screens.jpg"
                  alt="Android Screen Replacements"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Android Phone Product Line
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At PRSPARES, we understand the diverse needs of our customers offering a wide range of Android 
                screens catering specifically to the demands of the Samsung A, J, M, N, and S series, Huawei, 
                Xiaomi, Oppo, Vivo etc. All types of curved screens are available.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Samsung Series</h4>
                  <p className="text-sm text-gray-600">A, J, M, N, S series screens</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Chinese Brands</h4>
                  <p className="text-sm text-gray-600">Huawei, Xiaomi, Oppo, Vivo</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Options</h4>
                  <p className="text-sm text-gray-600">OEM Used, OLED, Incell, Out-cell</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Curved Screens</h4>
                  <p className="text-sm text-gray-600">All curved screen types available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laptop and Tablet Product Line */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Laptop and Tablet Product Line
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              PRSPARES also provides MacBook, iPad and Microsoft Surface screen assembly which covers 
              most models in the market.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg mx-auto max-w-sm">
                <Image
                  src="/images/macbook-screens.jpg"
                  alt="MacBook Screens"
                  width={300}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">MacBook Screens</h3>
              <p className="text-gray-600">Complete LCD assemblies for all MacBook models</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg mx-auto max-w-sm">
                <Image
                  src="/images/ipad-screens.jpg"
                  alt="iPad Screens"
                  width={300}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">iPad Screens</h3>
              <p className="text-gray-600">Touch panels and LCD assemblies for iPad series</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg mx-auto max-w-sm">
                <Image
                  src="/images/surface-screens.jpg"
                  alt="Surface Screens"
                  width={300}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Surface Screens</h3>
              <p className="text-gray-600">Microsoft Surface screen replacements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Advantages */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Unique Advantages of Screen Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment is to deliver the highest level of customer satisfaction through quality control and reliable sourcing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Factory Sources Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                In order to meet customers' diverse needs and reduce supply chain risks, we aggregate high-quality
                manufacturers' sources based on our familiarity and screening of factory sources.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">TQC Quality Control</h3>
              <p className="text-gray-600 leading-relaxed">
                Using TQC (Total Quality Control), we can intercept the 15%-20% defective rate common in the industry
                and require suppliers to return or replace them, ensuring that RMA rates stay around 1%.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Well Controlled Cost</h3>
              <p className="text-gray-600 leading-relaxed">
                According to customers' needs, we match products with the right quality and price. Meanwhile, we negotiate
                with factories to reduce purchasing costs by incorporating similar overseas customer needs in bulk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LCD and OLED Screen Types */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              LCD and OLED Screen Types
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Based on structure, display performance, energy consumption, durability and price, we categorize phone
              screens as LCD and OLED screens (soft OLED and hard OLED).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LCD</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Incell-LCD</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">Touch sensor integrated into LCD panel</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G+G</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">G+G/G+F-LCD</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">Glass+Glass or Glass+Film structure</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G+F</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">G+F-OLED</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">Glass+Film OLED structure</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">OLED</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Oncell-OLED</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">Touch sensor on OLED panel</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Source Quality Screens?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us to get the best screen solutions for your repair business with competitive pricing and reliable quality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Get Quote Now
              </Link>
              <Link
                href="/products?category=screens"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Browse Screens
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
