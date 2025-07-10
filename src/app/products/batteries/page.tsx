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
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Wholesale Replacement Batteries for <span className="text-blue-600">Phones, Laptops, Tablets & More</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  PRSPARES is your trusted global supplier of high-quality replacement batteries for mobile phones, laptops, tablets,
                  smartwatches, game consoles, and more. We specialize in bulk battery sourcing, ensuring fast delivery, competitive pricing,
                  and certified safety for repair shops worldwide.
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
                  src="/images/batteries-hero.jpg"
                  alt="Wholesale Replacement Batteries - Battery Supplier"
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

      {/* Product Line Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Battery Product Line Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Comprehensive battery sourcing solutions covering all major device categories for professional repair shops
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Phone Batteries</h3>
              <p className="text-gray-600">Compatible with iPhone, Samsung, Huawei, Xiaomi, and more major brands</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Laptop & Tablet Batteries</h3>
              <p className="text-gray-600">Including MacBook, iPad, and other leading laptop and tablet brands</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smartwatch, Game Console & Headphone Batteries</h3>
              <p className="text-gray-600">Wide selection for Apple Watch, Nintendo Switch, wireless headphones and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* iPhone Replacement Batteries */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                iPhone Replacement Batteries
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover our full range of iPhone batteries: OEM, original capacity, high-capacity, and diagnostic-compatible options.
                All batteries undergo strict quality control and are safety certified for professional repair shops.
              </p>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Available iPhone Models:</h4>
                <p className="text-sm text-gray-700">
                  iPhone 6, 6 Plus, 6S, 6S Plus, 7, 7 Plus, 8, 8 Plus, X, XR, XS, XS Max, 11, 11 Pro, 11 Pro Max,
                  12, 12 Mini, 12 Pro, 12 Pro Max, 13, 13 Mini, 13 Pro, 13 Pro Max, 14, 14 Plus, 14 Pro, 14 Pro Max,
                  15, 15 Plus, 15 Pro, 15 Pro Max
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">OEM Battery</h4>
                  <p className="text-sm text-gray-600">Original capacity with exact specifications</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">High Capacity</h4>
                  <p className="text-sm text-gray-600">Extended battery life solutions</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Aftermarket Battery</h4>
                  <p className="text-sm text-gray-600">TI, ZY and premium alternatives</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Diagnostic Compatible</h4>
                  <p className="text-sm text-gray-600">Health monitoring and cycle count support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/iphone-batteries.jpg"
                  alt="iPhone Replacement Battery Bulk Supplier"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Phone Batteries */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/android-batteries.jpg"
                  alt="Android Phone Battery Wholesale Supplier"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Android Phone Batteries
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bulk supply for major Android brands. Choose from OEM, aftermarket, and high-performance solutions,
                all with guaranteed compatibility and safety certification for professional repair services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Samsung Series
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5">
                    <li>• Galaxy A, J, M, N, S series</li>
                    <li>• Note series batteries</li>
                    <li>• Galaxy Z Fold/Flip series</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Other Major Brands
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5">
                    <li>• Huawei P, Mate, Nova series</li>
                    <li>• Xiaomi Mi, Redmi series</li>
                    <li>• Oppo, Vivo, OnePlus models</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Multiple capacity options available</li>
                  <li>• Safety certified and rigorously tested</li>
                  <li>• Guaranteed compatibility with original specifications</li>
                  <li>• Bulk purchase discounts for repair shops</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MacBook Battery & iPad Battery */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              MacBook Battery & iPad Battery
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Reliable replacement batteries for MacBook, iPad, and other top brands. Our products meet the highest industry standards and certifications.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/laptop-batteries.jpg"
                  alt="MacBook Battery Wholesale Supplier"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">MacBook Battery</h3>
                <p className="text-gray-600 mb-4">
                  High-capacity batteries for all MacBook models with cycle count optimization and long-lasting performance.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    MacBook Air & MacBook Pro series
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cycle count optimization technology
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Safety certified and tested
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/tablet-batteries.jpg"
                  alt="iPad Battery Wholesale Supplier"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">iPad Battery</h3>
                <p className="text-gray-600 mb-4">
                  Long-lasting batteries for iPad series with proper adhesive strips and professional installation support.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    iPad Air, Pro, Mini series
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Includes proper adhesive strips
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional installation guides
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smartwatch Battery, Game Console Battery & Wireless Headphone Battery */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Smartwatch Battery, Game Console Battery & Wireless Headphone Battery
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                From Apple Watch to Nintendo Switch and wireless headphones, find the batteries you need for every device in your repair shop.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Smartwatch Battery
                  </h4>
                  <p className="text-sm text-gray-600">Apple Watch Series 1-9, Ultra, SE & other smartwatch brands</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Game Console Battery
                  </h4>
                  <p className="text-sm text-gray-600">Nintendo Switch, PlayStation controllers, Xbox controllers</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Wireless Headphone Battery
                  </h4>
                  <p className="text-sm text-gray-600">AirPods, Beats, Sony, Bose and other wireless audio devices</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Smart Devices
                  </h4>
                  <p className="text-sm text-gray-600">Fitness trackers, smart rings, VR headsets, and more</p>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-blue-800 font-medium">
                  ✓ Wide selection for popular models &nbsp;|&nbsp;
                  ✓ Compact battery solutions &nbsp;|&nbsp;
                  ✓ Professional installation support
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/smart-device-batteries.jpg"
                  alt="Smartwatch Game Console Wireless Headphone Battery Supplier"
                  width={500}
                  height={375}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Quality Control & Battery Safety Certification */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Quality Control & Battery Safety Certification
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Every battery is tested for appearance, durability, charge/discharge cycles, and accelerated usage.
              Certified to CE, ROHS, UN38.3, IEC62133, and more. Safe packaging and transportation guaranteed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Direct-from-Factory Sourcing</h3>
              <p className="text-gray-600 leading-relaxed">
                Direct relationships with leading battery manufacturers ensure best prices, consistent quality,
                and reliable supply chain for bulk battery purchase requirements.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Testing & Inspection</h3>
              <p className="text-gray-600 leading-relaxed">
                Rigorous quality control including appearance checks, durability tests, charge/discharge cycles,
                and accelerated usage testing to ensure maximum reliability.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Global Shipping & Custom Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Fast global shipping, custom battery solutions, recharging services, and dedicated support
                for repair shop buyers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Storage Guide & Safe Battery Packaging */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Battery Storage Guide & Safe Battery Packaging
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Learn about battery storage (0–45°C, 65±20% RH), safe packaging, and how to maintain battery health during transit and storage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Battery Recharging Solution</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Check voltage every 3 months</li>
                <li>• Customized recharging solutions</li>
                <li>• Professional maintenance guides</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Battery Storage Guide</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Temperature: 0–45°C</li>
                <li>• Humidity: 65±20% RH</li>
                <li>• Proper ventilation required</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Safe Battery Packaging</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Individual shock-absorbing packaging</li>
                <li>• UN38.3 compliant shipping</li>
                <li>• Voltage ≥3.85V maintained</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Safety Certifications</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• CE, ROHS, UN38.3 certified</li>
                <li>• IEC62133, MSDS compliant</li>
                <li>• International safety standards</li>
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
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Source Premium Replacement Batteries?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us today for bulk battery pricing or to discuss your specific requirements!
              Join thousands of repair shops worldwide who trust PRSPARES for certified, high-quality replacement batteries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get Bulk Battery Quote
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Battery Specialists
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
