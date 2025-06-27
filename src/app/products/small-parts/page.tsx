import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Small Parts - Complete Component Solutions | PRSPARES',
  description: 'Comprehensive small parts for mobile devices including cameras, charging ports, speakers, buttons, and flex cables for iPhone, Android, tablets, and more.',
};

export default function SmallPartsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Small Parts - <span className="text-blue-600">Sourcing Solution</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  PRSPARES offers various small parts for iPhones, Android Phones, iPads, Samsung Tablets, and more. 
                  These parts include front glass, frame, touch panel, OCA, backlight, front/rear camera, charging port, 
                  NFC wireless charging, earpiece/loud speaker, power/volume/home button, back cover, and more.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products?category=small-parts" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse All Parts
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
                  src="/images/small-parts-hero.jpg"
                  alt="Mobile Device Small Parts"
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

      {/* Phone Parts */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Phone Parts
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                PRSPARES offers parts for a full range of iPhones and Android phones, including front glass, frame, 
                touch panel, OCA, backlight, front/rear camera, charging port, NFC wireless charging, earpiece/loud speaker, 
                power/volume/home button, and more.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/cameras.jpg"
                    alt="Front and Rear Cameras"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Front & Rear Cameras</h3>
                  <p className="text-gray-600 text-sm">High-quality camera modules for all phone models</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/charging-ports.jpg"
                    alt="Charging Ports"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Charging Ports</h3>
                  <p className="text-gray-600 text-sm">Lightning, USB-C, and Micro USB charging assemblies</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/speakers.jpg"
                    alt="Speakers and Earpieces"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Speakers & Earpieces</h3>
                  <p className="text-gray-600 text-sm">Audio components for clear sound reproduction</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/buttons.jpg"
                    alt="Buttons and Flex Cables"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Buttons & Flex Cables</h3>
                  <p className="text-gray-600 text-sm">Power, volume, home buttons and connecting cables</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/wireless-charging.jpg"
                    alt="Wireless Charging Coils"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">NFC & Wireless Charging</h3>
                  <p className="text-gray-600 text-sm">NFC antennas and wireless charging coils</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/back-covers.jpg"
                    alt="Back Covers and Frames"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Back Covers & Frames</h3>
                  <p className="text-gray-600 text-sm">Housing components and structural frames</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tablet Parts */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Tablet Parts
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PRSPARES offers parts for iPads and Samsung Tablets, such as front glass, touch panel, camera, 
                charging port flex cable, etc.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">iPad front glass and touch panels</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Samsung tablet components</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Camera modules and flex cables</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Charging port assemblies</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/ipad-glass.jpg"
                    alt="iPad Front Glass"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">iPad Front Glass</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/tablet-camera.jpg"
                    alt="Tablet Camera"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Tablet Cameras</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/tablet-charging.jpg"
                    alt="Tablet Charging Port"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Charging Ports</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/tablet-flex.jpg"
                    alt="Tablet Flex Cables"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Flex Cables</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MacBook Parts */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/macbook-keyboard.jpg"
                    alt="MacBook Keyboard"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">MacBook Keyboards</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/macbook-trackpad.jpg"
                    alt="MacBook Trackpad"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Trackpads</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/macbook-camera.jpg"
                    alt="MacBook Camera"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Cameras</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/macbook-cover.jpg"
                    alt="MacBook Back Cover"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Back Covers</h4>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                MacBook Parts
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PRSPARES provides parts for MacBook, including keyboards, back cover, cameras, flex cables, etc.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Butterfly and Magic keyboards</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Force Touch trackpads</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">FaceTime HD cameras</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Top case and bottom covers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Consoles and Smart Wearable Devices Parts */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Game Consoles and Smart Wearable Devices Parts
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Various small parts for game consoles and smart wearable devices can be purchased, including Apple Watch
                glasses, Switch, PlayStation related parts, etc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/apple-watch-glass.jpg"
                    alt="Apple Watch Glass"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Apple Watch Glass</h4>
                  <p className="text-gray-600 text-xs">Sapphire and Ion-X glass</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/switch-parts.jpg"
                    alt="Nintendo Switch Parts"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Nintendo Switch Parts</h4>
                  <p className="text-gray-600 text-xs">Joy-Con and console components</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/playstation-parts.jpg"
                    alt="PlayStation Parts"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">PlayStation Parts</h4>
                  <p className="text-gray-600 text-xs">Controller and console components</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/parts/airpods-parts.jpg"
                    alt="AirPods Parts"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">AirPods Parts</h4>
                  <p className="text-gray-600 text-xs">Cases and internal components</p>
                </div>
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
              Unique Advantages of Small Parts Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive quality control and sourcing expertise ensures reliable small parts for all your repair needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Centralized Purchasing</h3>
              <p className="text-gray-600 leading-relaxed">
                Through classified management and daily maintenance of scattered and complex stall suppliers, along with
                certain inventory construction, we ensure stable supplies and cost advantages.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Inspection System</h3>
              <p className="text-gray-600 leading-relaxed">
                We have a complete set of small parts testing procedures, combined with a self-developed parts testing rack,
                to ensure accuracy and efficiency through 100% full inspection.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Low RMA Rate</h3>
              <p className="text-gray-600 leading-relaxed">
                Over the years, PRSPARES has selected excellent suppliers to purchase high-quality parts for customers and
                conducts strict quality inspections before shipment. This greatly reduces the number of RMAs, saving time and money for customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control Process */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Quality Control Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our rigorous quality control ensures every small part meets the highest standards before reaching our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Supplier Selection</h3>
              <p className="text-gray-600 text-sm">Careful vetting of suppliers based on quality standards and reliability</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Incoming Inspection</h3>
              <p className="text-gray-600 text-sm">100% inspection of all incoming parts using specialized testing equipment</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Functional Testing</h3>
              <p className="text-gray-600 text-sm">Comprehensive functionality tests to ensure proper operation</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Final Packaging</h3>
              <p className="text-gray-600 text-sm">Secure packaging with anti-static protection for safe delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Complete Your Repair Inventory?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us to get high-quality small parts with comprehensive quality control and reliable sourcing for all your repair needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Get Quote Now
              </Link>
              <Link
                href="/products?category=small-parts"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Browse Parts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
