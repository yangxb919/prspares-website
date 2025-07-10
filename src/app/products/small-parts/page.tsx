'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import InquiryModal from '@/components/InquiryModal';

// Note: metadata export removed due to 'use client' directive

export default function SmallPartsPage() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Small Parts Sourcing Solutions for <span className="text-blue-600">Repair Shops</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Looking for a reliable supplier of high-quality small parts for phone, tablet, and device repairs?
                  PRSPARES offers a comprehensive sourcing solution tailored for overseas repair shops and procurement professionals.
                  From iPhone replacement parts to Samsung components, we provide tested, quality-assured small parts with fast global shipping.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Bulk Purchase
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100% Tested
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Low RMA Rate
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Fast Shipping
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Wholesale Quote
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/small-parts-hero.jpg"
                  alt="Small Parts for Phone Repair - Wholesale Supplier"
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

      {/* Wide Range of Small Parts for Phones */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Wide Range of Small Parts for Phones
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                We supply a full selection of small parts for iPhone, Samsung, and Android phones, including front glass, frames,
                touch panels, OCA, backlights, front and rear cameras, charging ports, NFC modules, earpiece and loudspeakers,
                power/volume/home buttons, back covers, and more. All parts are available for bulk purchase and meet strict quality standards.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-blue-800 font-medium">
                  ✓ iPhone replacement small parts for repair shops &nbsp;|&nbsp;
                  ✓ Android phone repair small parts supplier &nbsp;|&nbsp;
                  ✓ High quality tested small parts for overseas repair shops
                </p>
              </div>
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

      {/* Tablet and MacBook Small Parts Wholesale */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Tablet and MacBook Small Parts Wholesale
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tablet Repair Parts</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    iPad and Samsung tablet front glass, touch panels, cameras, charging port flex cables, and more essential components for professional tablet repairs.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">MacBook Parts</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Keyboards, back covers, cameras, flex cables, and other essential MacBook components for comprehensive repair services.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Source all your repair shop needs from one trusted supplier.
                  </p>
                </div>
              </div>
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

      {/* Game Console & Smart Wearable Device Parts */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Game Console & Smart Wearable Device Parts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Game Console Small Parts</h3>
                  <p className="text-gray-600">
                    Nintendo Switch, PlayStation, and other major gaming console brands. Complete your gaming device repair services with our comprehensive parts inventory.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Wearable Parts</h3>
                  <p className="text-gray-600">
                    Apple Watch glass, bands, and internal components. Expand your repair service offerings with our diverse smart wearable parts inventory.
                  </p>
                </div>
              </div>
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

      {/* Why Choose PRSPARES for Small Parts? */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose PRSPARES for Small Parts?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Your trusted partner for professional small parts wholesale solutions with comprehensive quality control and reliable sourcing expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Centralized Sourcing & Inventory</h3>
              <p className="text-gray-600 leading-relaxed">
                Through our centralized sourcing strategy and robust inventory management, we ensure stable supply and competitive pricing for all small parts.
                Our classified supplier management and strategic inventory construction guarantee consistent availability.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Quality Inspection & Testing</h3>
              <p className="text-gray-600 leading-relaxed">
                Every part undergoes comprehensive testing and inspection using advanced equipment, guaranteeing reliability and a low RMA rate.
                Our self-developed testing procedures ensure accuracy and efficiency through complete quality verification.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Global Shipping & Support</h3>
              <p className="text-gray-600 leading-relaxed">
                With fast international shipping and dedicated customer support, PRSPARES is the preferred partner for overseas repair shops.
                Our global logistics network ensures timely delivery and professional technical assistance.
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
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Source Premium Small Parts for Your Repair Shop?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us today for a quote or to discuss your bulk small parts requirements!
              Join thousands of repair shops worldwide who trust PRSPARES for reliable, tested small parts with fast global shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get Bulk Parts Quote
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title="Get Small Parts Wholesale Quote"
        subtitle="Tell us your small parts requirements and we'll provide competitive bulk pricing"
        defaultMessage="I'm interested in small parts wholesale for my repair shop. Please provide pricing and availability for:"
      />
    </main>
  );
}
