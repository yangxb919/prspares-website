'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import InquiryModal from '@/components/InquiryModal';

// Note: metadata export removed due to 'use client' directive

export default function BatteriesPage() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Premium Replacement Batteries - <span className="text-blue-600">Wholesale Sourcing Solutions</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  PRSPARES provides high-quality replacement batteries for iPhone, Android phones, tablets, laptops, 
                  smart watches, game consoles and more devices. Professional wholesale solutions for repair shops worldwide.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    CE Certified
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    UN38.3 Safety
                  </div>
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
                    Fast Shipping
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Bulk Pricing
                </button>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m6 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2h10z" />
                  </svg>
                  Contact Our Team
                </button>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Product Catalog
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-3 aspect-h-2 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/batteries-hero.jpg"
                  alt="Premium Replacement Batteries - PRSPARES Wholesale Solutions"
                  width={1200}
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  iPhone Battery Product Line
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  PRSPARES provides various batteries and cells for the majority of iPhone models, including original capacity 
                  and high capacity, OEM, TI, ZY and other aftermarket solutions, as well as diagnostic-compatible batteries.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    OEM Battery
                  </h4>
                  <p className="text-sm text-gray-600">Original specifications with exact matching parameters</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    High Capacity Battery
                  </h4>
                  <p className="text-sm text-gray-600">Extended battery life for enhanced user experience</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    Aftermarket Battery
                  </h4>
                  <p className="text-sm text-gray-600">TI, ZY and other premium alternative options</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                    Diagnostic Compatible Battery
                  </h4>
                  <p className="text-sm text-gray-600">Supports health monitoring and cycle count features</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Supported Models</h4>
                <p className="text-sm text-gray-700">
                  iPhone 6, 6 Plus, 6S, 6S Plus, 7, 7 Plus, 8, 8 Plus, X, XR, XS, XS Max, 11, 11 Pro, 11 Pro Max,
                  12, 12 Mini, 12 Pro, 12 Pro Max, 13, 13 Mini, 13 Pro, 13 Pro Max, 14, 14 Plus, 14 Pro, 14 Pro Max,
                  15, 15 Plus, 15 Pro, 15 Pro Max - Complete Series Coverage
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/iphone-batteries.jpg"
                  alt="iPhone Battery Product Line - PRSPARES Wholesale"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Battery Product Line */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-w-4 aspect-h-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/android-batteries.jpg"
                  alt="Android Battery Product Line - PRSPARES Wholesale"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Android Battery Product Line
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Various batteries and cells from PRSPARES are available for popular Android phones such as Samsung A, J, M, N, 
                  and S series, plus Huawei, Xiaomi, and other major brands.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Samsung Series
                  </h4>
                  <p className="text-sm text-gray-600">Galaxy A, J, M, N, S series, Note series, Galaxy Z Fold/Flip series</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Huawei Series
                  </h4>
                  <p className="text-sm text-gray-600">P, Mate, Nova series and other mainstream models</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Xiaomi Series
                  </h4>
                  <p className="text-sm text-gray-600">Mi, Redmi series with comprehensive coverage</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Other Major Brands
                  </h4>
                  <p className="text-sm text-gray-600">Oppo, Vivo, OnePlus and other leading brands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laptop and Tablet Product Line */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Laptop and Tablet Product Line
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              The PRSPARES battery service covers MacBook, iPad and other leading laptop and tablet brands 
              with certified quality and performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-w-4 aspect-h-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/laptop-batteries.jpg"
                  alt="MacBook Battery - PRSPARES Wholesale"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">MacBook Battery</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">MacBook Air & MacBook Pro complete series support</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Cycle count optimization technology</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Safety certified and tested guarantee</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="aspect-w-4 aspect-h-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/tablet-batteries.jpg"
                  alt="iPad Battery - PRSPARES Wholesale"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">iPad Battery</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">iPad Air, Pro, Mini series complete coverage</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Includes professional adhesive strip accessories</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Professional installation guides provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Watches, Game Consoles & More */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Smart Watches, Game Consoles & More
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We offer batteries for Apple watches, game consoles, wireless headphones, fitness trackers, 
                  and more smart devices.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Smartwatch Battery</h4>
                  <p className="text-sm text-gray-600">Apple Watch Series 1-9, Ultra, SE and other smartwatch brands</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Game Console Battery</h4>
                  <p className="text-sm text-gray-600">Nintendo Switch, PlayStation controllers, Xbox controllers</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wireless Headphone Battery</h4>
                  <p className="text-sm text-gray-600">AirPods, Beats, Sony, Bose and other wireless audio devices</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Devices</h4>
                  <p className="text-sm text-gray-600">Fitness trackers, smart rings, VR headsets and more</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Features
                </h4>
                <p className="text-blue-800">
                  ✓ Wide selection for popular models &nbsp;|&nbsp; ✓ Compact battery solutions &nbsp;|&nbsp; ✓ Professional installation support
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/smart-device-batteries.jpg"
                  alt="Smart Devices Battery - PRSPARES Wholesale"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Safety & Quality Assurance */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Safety & Quality Assurance
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Every battery undergoes appearance, durability, charge/discharge cycles, and accelerated usage testing. 
              Certified with CE, ROHS, UN38.3, IEC62133 and more, ensuring safe packaging and transportation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safety Certification</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• CE, ROHS, UN38.3 certified</li>
                <li>• IEC62133, MSDS, SDS compliant</li>
                <li>• PSE and international safety standards</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Testing</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Appearance and durability testing</li>
                <li>• Charge/discharge cycle testing</li>
                <li>• Accelerated usage life testing</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safe Packaging</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Individual shock-absorbing packaging</li>
                <li>• UN38.3 compliant shipping</li>
                <li>• Voltage ≥3.85V maintained</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Storage Guide & Safety Solutions */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Storage Guide & Safety Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Learn about battery storage conditions (0-45°C, 65±20% RH), safe packaging requirements, 
              and how to maintain battery health during transportation and storage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Battery Recharging Solutions</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Check voltage every 3 months</li>
                <li>• Customized charging solutions</li>
                <li>• Professional maintenance guides</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Battery Storage Guide</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Temperature: 0-45°C</li>
                <li>• Humidity: 65±20% RH</li>
                <li>• Proper ventilation required</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Safe Packaging</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Individual shock-absorbing packaging</li>
                <li>• UN38.3 compliant shipping</li>
                <li>• Maintain voltage ≥3.85V</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Safety Certifications</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• CE, ROHS, UN38.3 certified</li>
                <li>• IEC62133, MSDS compliant</li>
                <li>• International safety standards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Professional Wholesale Services
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Direct factory sourcing, global fast shipping, professional technical support and comprehensive after-sales service 
              provide comprehensive support for repair shops.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Wholesale Purchasing Advantages
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Direct Factory Sourcing</h4>
                    <p className="text-sm text-gray-600">Direct partnerships with leading battery manufacturers ensure optimal prices and stable supply chain</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Global Fast Shipping</h4>
                    <p className="text-sm text-gray-600">Rapid global shipping service with customized battery solutions</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Bulk Service</h4>
                    <p className="text-sm text-gray-600">Professional repair shop support with bulk purchase discount policies</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Technical Support & After-Sales
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Technical Support</h4>
                    <p className="text-sm text-gray-600">Installation tutorial videos, technical specification matching, troubleshooting support</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">After-Sales Service Guarantee</h4>
                    <p className="text-sm text-gray-600">Quality assurance policy, return and exchange service, 24/7 customer support</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Customized Services</h4>
                    <p className="text-sm text-gray-600">Provide customized battery solutions according to customer requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Display */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Certification Standards
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All battery products meet international safety standards and certification requirements, 
              ensuring reliable and safe operation in all applications.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mt-12">
              {[
                { name: 'IEC62133', color: 'blue' },
                { name: 'CE', color: 'green' },
                { name: 'FCC', color: 'purple' },
                { name: 'ROHS', color: 'orange' },
                { name: 'MSDS', color: 'red' },
                { name: 'UN38.3', color: 'indigo' },
                { name: 'SDS', color: 'pink' },
                { name: 'PSE', color: 'yellow' },
              ].map((cert) => (
                <div key={cert.name} className={`bg-${cert.color}-50 border border-${cert.color}-200 rounded-lg p-4 text-center`}>
                  <span className={`text-lg font-semibold text-${cert.color}-700`}>{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Source Premium Replacement Batteries?
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Contact us today for bulk battery pricing or to discuss your specific requirements! Join thousands of repair shops worldwide 
              who trust PRSPARES for certified, high-quality replacement batteries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Get Bulk Pricing
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m6 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2h10z" />
                </svg>
                Contact Our Team
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Product Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title="Get Battery Wholesale Quote"
        subtitle="Tell us your battery requirements and we'll provide competitive bulk pricing"
        defaultMessage="I'm interested in replacement batteries wholesale for my repair shop. Please provide pricing and availability for:"
      />
    </main>
  );
}
