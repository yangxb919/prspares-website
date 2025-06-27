import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'High-Quality Replacement Batteries - Safe & Reliable | PRSPARES',
  description: 'Premium replacement batteries for iPhone, Android, tablets, laptops, and smart devices. Safety certified with quality control and proper storage.',
};

export default function BatteriesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Batteries - <span className="text-blue-600">Sourcing Solution</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  As battery is the energy of electronic portable devices, long battery life and usage security are 
                  important purchasing factors. PRSPARES provides high-quality replacement batteries for iPhone, 
                  Android phones, tablets, laptops, smart watches, game consoles and more devices.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products?category=batteries" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse All Batteries
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
                  src="/images/batteries-hero.jpg"
                  alt="High-Quality Replacement Batteries"
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

      {/* iPhone Battery Product Line */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                iPhone Battery Product Line
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PRSPARES provides various batteries and cells for the majority of iPhone, including original capacity 
                and high capacity, OEM, TI, ZY and other aftermarket solutions, as well as diagnostic-compatible batteries.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Original Capacity</h4>
                  <p className="text-sm text-gray-600">Exact OEM specifications</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">High Capacity</h4>
                  <p className="text-sm text-gray-600">Extended battery life</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">TI & ZY Solutions</h4>
                  <p className="text-sm text-gray-600">Premium aftermarket options</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Diagnostic Compatible</h4>
                  <p className="text-sm text-gray-600">Health monitoring support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/iphone-batteries.jpg"
                  alt="iPhone Battery Replacements"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Battery Product Line */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/android-batteries.jpg"
                  alt="Android Battery Replacements"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Android Battery Product Line
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Various batteries and cells from PRSPARES are available for popular Android phones such as the 
                Samsung A, J, M, N, and S series.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Samsung A, J, M, N, S series batteries</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Huawei, Xiaomi, Oppo, Vivo compatibility</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Multiple capacity options available</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Safety certified and tested</p>
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
              The PRSPARES battery service covers MacBook, iPad and other models.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg mx-auto max-w-md">
                <Image
                  src="/images/laptop-batteries.jpg"
                  alt="Laptop Batteries"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">MacBook Batteries</h3>
              <p className="text-gray-600">High-capacity batteries for all MacBook models with cycle count optimization</p>
            </div>
            <div className="text-center space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg mx-auto max-w-md">
                <Image
                  src="/images/tablet-batteries.jpg"
                  alt="Tablet Batteries"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">iPad Batteries</h3>
              <p className="text-gray-600">Long-lasting batteries for iPad series with proper adhesive strips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Watches and More */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Smart Watches, Game Consoles, More
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We offer batteries for Apple watches, game consoles, wireless headphones, and more.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Apple Watch</h4>
                  <p className="text-sm text-gray-600">Series 1-9 & Ultra batteries</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Game Consoles</h4>
                  <p className="text-sm text-gray-600">Nintendo Switch, PlayStation controllers</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Wireless Headphones</h4>
                  <p className="text-sm text-gray-600">AirPods, Beats, and other brands</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Devices</h4>
                  <p className="text-sm text-gray-600">Fitness trackers, smart rings</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/smart-device-batteries.jpg"
                  alt="Smart Device Batteries"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Advantages */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Unique Advantages of Battery Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment to safety and quality ensures reliable power solutions for all your repair needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Materials Selection</h3>
              <p className="text-gray-600 leading-relaxed">
                Our battery product team will conduct in-depth research on raw materials and solutions used in different
                batteries to meet customer needs.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Various Factories Supply</h3>
              <p className="text-gray-600 leading-relaxed">
                By directly connecting with source factories, we offer high-efficiency and high-quality batteries for
                iPhone, Android phones, tablets, laptops, etc.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safety First & Always</h3>
              <p className="text-gray-600 leading-relaxed">
                To ensure the highest level of quality and safety, we have developed numerous battery safety inspection
                points. These include appearance checks, durability tests, charge and discharge tests, accelerated usage tests, etc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Safety */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Safety
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              As a service provider, PRSPARES provides customers with safety certified batteries, storage guides,
              recharging solutions, and safe transportation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Battery Recharging Solution</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Check voltage every 3 months</li>
                <li>Customized battery recharging solutions</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Battery Quality Control</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Safety-certified batteries</li>
                <li>Strict inspection from procurement to shipment</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Battery Storage Guide</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>0～45℃ temperature</li>
                <li>65±20% RH humidity</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Safe Package and Transportation</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Individually packaged using shock-absorbing materials</li>
                <li>Follow UN38.8, maintaining voltage ≥3.85V during transportation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Certification */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Certification
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 text-lg font-semibold text-gray-600">
              <span className="px-4 py-2 bg-blue-50 rounded-lg">IEC62133</span>
              <span className="px-4 py-2 bg-green-50 rounded-lg">CE</span>
              <span className="px-4 py-2 bg-purple-50 rounded-lg">FCC</span>
              <span className="px-4 py-2 bg-orange-50 rounded-lg">ROHS</span>
              <span className="px-4 py-2 bg-red-50 rounded-lg">MSDS</span>
              <span className="px-4 py-2 bg-indigo-50 rounded-lg">UN38.3</span>
              <span className="px-4 py-2 bg-pink-50 rounded-lg">SDS</span>
              <span className="px-4 py-2 bg-yellow-50 rounded-lg">PSE</span>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              All our batteries meet international safety standards and certifications, ensuring reliable and safe operation
              in all applications.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Power Your Devices?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us to get high-quality, safety-certified batteries with proper storage and transportation solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Get Quote Now
              </Link>
              <Link
                href="/products?category=batteries"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Browse Batteries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
