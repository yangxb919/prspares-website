'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import InquiryModal from '@/components/InquiryModal';

// Note: metadata export removed due to 'use client' directive
// This would normally be handled by a parent server component

export default function ScreensPage() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  Premium Phone Screen 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                    Replacements
                  </span>
                </h1>
                <p className="text-xl text-gray-500 font-light">
                  OEM Quality Mobile LCD & OLED Screen Supplier
                </p>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Professional wholesale supplier for repair shops worldwide. Fast delivery, competitive pricing.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">OEM Quality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Expert Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Bulk Supply</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Wholesale Quote
                </button>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-blue-300 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Browse Catalog
                </button>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 h-[450px]">
                {/* Main large image */}
                <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/screens-hero.jpg"
                    alt="Professional Phone Screen Replacement Parts"
                    width={600}
                    height={280}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
                
                {/* Bottom row images */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/iphone-screens.jpg"
                    alt="iPhone Screen Replacements"
                    width={300}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <p className="text-sm font-medium">iPhone Screens</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/android-screens.jpg"
                    alt="Android Screen Replacements"
                    width={300}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <p className="text-sm font-medium">Android Screens</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                OEM Quality
              </div>
              <div className="absolute top-1/4 -left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-90">
                Fast Shipping
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Navigation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              iPhone Screen Replacements & Samsung Android Screens
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Full range from iPhone 7 to iPhone 16 Pro series, Samsung Galaxy, and all major Android brands.
              OEM quality screens with True Tone support, curved OLED, and competitive wholesale pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "iPhone Screen Replacements",
                description: "Complete iPhone 7-16 Pro series with True Tone support",
                models: "iPhone 7, 8, X, XR, XS, 11, 12, 13, 14, 15, 16 Pro series",
                features: ["True Tone Support", "OEM Quality", "120Hz ProMotion", "Multiple Grades"],
                icon: "📱",
                color: "blue"
              },
              {
                title: "Samsung & Android Screens",
                description: "Galaxy S, Note, A series & major Android brands",
                models: "Samsung Galaxy S21-S24, Note, A series, Huawei, Xiaomi, OnePlus",
                features: ["Curved OLED", "AMOLED Displays", "All Screen Sizes", "Competitive Pricing"],
                icon: "📲",
                color: "purple"
              },
              {
                title: "Tablet & iPad Screens",
                description: "iPad and Android tablet display solutions",
                models: "iPad Air, Pro, Mini, Samsung Tab, Surface Pro",
                features: ["Large Format Displays", "Touch Digitizers", "Professional Grade", "Fast Shipping"],
                icon: "📟",
                color: "green"
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{category.models}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-700">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setIsInquiryModalOpen(true)}
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium transform hover:scale-105`}
                  >
                    Get Wholesale Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LCD vs OLED: Which Is Right for Your Repair Needs? */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              LCD vs OLED: Which Is Right for Your Repair Needs?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              We offer both premium LCD and OLED (soft/hard) screens, each tested for display quality, durability, and energy efficiency.
              Choose the best fit for your customers and budget with our comprehensive screen technology guide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                grade: "LCD Screens",
                subtitle: "Cost-Effective Solution",
                description: "High-quality LCD displays for budget-conscious repair operations",
                features: [
                  "Excellent color reproduction",
                  "Cost-effective pricing",
                  "Wide compatibility range",
                  "Reliable performance"
                ],
                color: "green",
                popular: false
              },
              {
                grade: "Soft OLED",
                subtitle: "Premium Display Technology",
                description: "Superior OLED technology with flexible display characteristics",
                features: [
                  "True black levels",
                  "Energy efficient",
                  "Vibrant color accuracy",
                  "Thin profile design"
                ],
                color: "blue",
                popular: true
              },
              {
                grade: "Hard OLED",
                subtitle: "OEM Quality Standard",
                description: "Premium hard OLED displays matching original specifications",
                features: [
                  "OEM quality guarantee",
                  "True Tone support",
                  "120Hz refresh rate",
                  "Maximum durability"
                ],
                color: "purple",
                popular: false
              }
            ].map((grade, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 ${grade.popular ? 'border-blue-500' : 'border-gray-200'} transform hover:-translate-y-2`}>
                {grade.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{grade.grade}</h3>
                  <p className={`text-lg font-semibold text-blue-600 mb-3`}>{grade.subtitle}</p>
                  <p className="text-gray-600">{grade.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {grade.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className={`w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <button 
                    onClick={() => setIsInquiryModalOpen(true)}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    Get {grade.grade} Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OEM Quality Guarantee & Product Advantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                OEM Quality Guarantee & Bulk Supply Solutions
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                All screens undergo strict QC and are sourced directly from certified factories.
                Flexible order quantities and cost-effective solutions for overseas repair shops with expert technical support.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    OEM Quality Guarantee
                  </h4>
                  <p className="text-sm text-gray-700">All screens undergo strict QC and are sourced directly from certified factories</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Fast Global Shipping
                  </h4>
                  <p className="text-sm text-gray-700">In-stock inventory, same-day dispatch, 7-15 days international delivery</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Bulk Supply & Competitive Pricing
                  </h4>
                  <p className="text-sm text-gray-700">Flexible order quantities and cost-effective solutions for overseas repair shops</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Expert Technical Support
                  </h4>
                  <p className="text-sm text-gray-700">Free repair guides, troubleshooting, and 24/7 online assistance</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/oem-quality-iphone-screen-wholesale-collection.jpg"
                  alt="OEM Quality iPhone Screen Wholesale Supplier - Complete Collection"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Repair Professionals Worldwide */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/samsung-android-oled-screen-replacement-collection.jpg"
                  alt="Samsung Android OLED Screen Replacement Parts - Professional Collection"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Trusted by Repair Professionals Worldwide
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                "Consistent quality and fast shipping – PRSPARES is our go-to for all screen replacements."
                Join thousands of successful repair shops who rely on our expertise and supply chain.
              </p>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-3">
                        "Consistent quality and fast shipping – PRSPARES is our go-to for all screen replacements.
                        Their technical support team is always available to help with any questions."
                      </p>
                      <div className="text-sm text-gray-600">
                        <p className="font-semibold">Mike Johnson</p>
                        <p>TechFix Pro, London UK</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-3">
                        "We've been sourcing screens from PRSPARES for over 2 years.
                        The OEM quality and competitive pricing help us maintain excellent profit margins."
                      </p>
                      <div className="text-sm text-gray-600">
                        <p className="font-semibold">Sarah Chen</p>
                        <p>Mobile Masters, Sydney AU</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-gray-900">Why Repair Shops Choose PRSPARES</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Tested mobile replacement screens with quality guarantee</li>
                  <li>• Fast shipping mobile screens overseas (7-15 days)</li>
                  <li>• Certified OEM phone screens wholesale pricing</li>
                  <li>• 24/7 technical support and repair guides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LCD vs OLED Technology Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              LCD vs OLED Technology Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the differences to make the best choice for your repair business
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="relative w-48 h-32 mx-auto mb-4 bg-white rounded-xl shadow-lg p-4 border border-blue-200">
                  <Image
                    src="/images/LCD display structure.png"
                    alt="LCD Display Structure Diagram"
                    width={180}
                    height={120}
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    LCD
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">LCD Screens</h3>
                <p className="text-blue-700 font-medium">Liquid Crystal Display Technology</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cost Effective</h4>
                    <p className="text-sm text-gray-600">20% lower cost than OLED, better for budget repairs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Longer Lifespan</h4>
                    <p className="text-sm text-gray-600">40,000-60,000 hours, no burn-in issues</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stable Brightness</h4>
                    <p className="text-sm text-gray-600">600-650 nits consistent, better for office work</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Eye Comfort</h4>
                    <p className="text-sm text-gray-600">High-frequency PWM, less eye strain</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <div className="text-xs text-blue-800 space-y-1">
                  <div><strong>Contrast:</strong> 1,200-1,600:1</div>
                  <div><strong>Response:</strong> 4-8ms</div>
                  <div><strong>Viewing Angle:</strong> 178° (IPS)</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="relative w-48 h-32 mx-auto mb-4 bg-white rounded-xl shadow-lg p-4 border border-purple-200">
                  <Image
                    src="/images/OLED display structure.png"
                    alt="OLED Display Structure Diagram"
                    width={180}
                    height={120}
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    OLED
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">OLED Screens</h3>
                <p className="text-purple-700 font-medium">Organic Light Emitting Diode</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Infinite Contrast</h4>
                    <p className="text-sm text-gray-600">≥1,000,000:1 ratio, true blacks, perfect HDR</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ultra-Thin Design</h4>
                    <p className="text-sm text-gray-600">0.3mm thickness, flexible and foldable</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lightning Fast</h4>
                    <p className="text-sm text-gray-600">0.1ms response time, zero motion blur</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Peak Brightness</h4>
                    <p className="text-sm text-gray-600">1,750-2,300 nits HDR, excellent outdoors</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                <div className="text-xs text-purple-800 space-y-1">
                  <div><strong>Typical Brightness:</strong> 1,000-1,200 nits</div>
                  <div><strong>Color Gamut:</strong> DCI-P3 120%</div>
                  <div><strong>Lifespan:</strong> 8,000-30,000 hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Technical Comparison Table */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Professional Technical Specifications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Parameter</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-700">LCD Typical Values</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-purple-700">OLED Typical Values</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Impact on Repair Business</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Static Contrast Ratio</td>
                    <td className="border border-gray-300 px-4 py-3">1,200–1,600:1</td>
                    <td className="border border-gray-300 px-4 py-3">≥1,000,000:1</td>
                    <td className="border border-gray-300 px-4 py-3">OLED provides superior HDR experience</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Typical Brightness</td>
                    <td className="border border-gray-300 px-4 py-3">600–650 nits</td>
                    <td className="border border-gray-300 px-4 py-3">1,000–1,200 nits</td>
                    <td className="border border-gray-300 px-4 py-3">OLED better for outdoor visibility</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Peak Brightness (HDR)</td>
                    <td className="border border-gray-300 px-4 py-3">&lt;900 nits</td>
                    <td className="border border-gray-300 px-4 py-3">1,750–2,300 nits</td>
                    <td className="border border-gray-300 px-4 py-3">OLED excels in premium devices</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Response Time</td>
                    <td className="border border-gray-300 px-4 py-3">4–8 ms</td>
                    <td className="border border-gray-300 px-4 py-3">0.1 ms</td>
                    <td className="border border-gray-300 px-4 py-3">OLED preferred for gaming phones</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Lifespan (50% brightness)</td>
                    <td className="border border-gray-300 px-4 py-3">40,000–60,000 hours</td>
                    <td className="border border-gray-300 px-4 py-3">8,000–30,000 hours</td>
                    <td className="border border-gray-300 px-4 py-3">LCD offers better long-term value</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Manufacturing Cost</td>
                    <td className="border border-gray-300 px-4 py-3">Baseline</td>
                    <td className="border border-gray-300 px-4 py-3">+20% (Rigid), +50% (Flexible)</td>
                    <td className="border border-gray-300 px-4 py-3">LCD more cost-effective for budget repairs</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">PWM Flicker</td>
                    <td className="border border-gray-300 px-4 py-3">High frequency (&gt;1kHz)</td>
                    <td className="border border-gray-300 px-4 py-3">Low frequency (240-480Hz)</td>
                    <td className="border border-gray-300 px-4 py-3">LCD better for eye-sensitive customers</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Thickness</td>
                    <td className="border border-gray-300 px-4 py-3">&gt;3mm (with backlight)</td>
                    <td className="border border-gray-300 px-4 py-3">0.3mm (flexible possible)</td>
                    <td className="border border-gray-300 px-4 py-3">OLED enables thinner device designs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Power Consumption Comparison */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  LCD Power Characteristics
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Consistent power consumption regardless of content</li>
                  <li>• More efficient for white backgrounds and web browsing</li>
                  <li>• Backlight always on, limiting power savings</li>
                  <li>• Better for extended office work scenarios</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  OLED Power Characteristics
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Pixels turn off completely for true black, saving power</li>
                  <li>• High power consumption for bright white content</li>
                  <li>• LTPO technology enables 1-120Hz variable refresh rates</li>
                  <li>• 5-15% power reduction with adaptive refresh rates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Total Quality Control System */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Total Quality Control (TQC) System
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Industry-leading quality assurance that intercepts the 15-20% defect rate common in the industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: "01",
                title: "Multi-stage Testing",
                description: "Comprehensive testing at every production stage",
                icon: "🔬"
              },
              {
                step: "02",
                title: "Supplier Audits",
                description: "Regular quality audits of all manufacturing partners",
                icon: "🏭"
              },
              {
                step: "03",
                title: "Batch Verification",
                description: "Consistency verification across all production batches",
                icon: "✅"
              },
              {
                step: "04",
                title: "Final Inspection",
                description: "100% inspection before shipping to customers",
                icon: "🔍"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <div className="text-blue-300 font-bold text-sm mb-2">{item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center bg-blue-800 bg-opacity-50 rounded-2xl p-8">
            <div className="text-4xl font-bold text-blue-300 mb-2">&lt;1%</div>
            <div className="text-xl font-semibold mb-2">RMA Rate Guarantee</div>
            <p className="text-blue-100">Our TQC system ensures less than 1% return rate, compared to industry average of 15-20%</p>
          </div>
        </div>
      </section>

      {/* Why Choose PRSPARES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PRSPARES for Your Screen Needs?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for professional phone screen wholesale solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Factory Direct Partnership</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Direct relationships with leading manufacturers</li>
                <li>• Bulk purchasing power for better pricing</li>
                <li>• Consistent quality control standards</li>
                <li>• Custom packaging and branding options</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Supply Chain</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Physical inventory in Shenzhen warehouse</li>
                <li>• International shipping in 7-15 days</li>
                <li>• Express delivery options available</li>
                <li>• Real-time tracking for all shipments</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Excellence</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• 10+ years repair industry experience</li>
                <li>• Professional installation guides</li>
                <li>• Troubleshooting support</li>
                <li>• Bulk order technical consultation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get Your Wholesale Quote Now
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Browse our full screen catalog and contact our expert team for support.
            Join thousands of repair shops worldwide who trust PRSPARES for OEM quality screens with fast global shipping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get Your Wholesale Quote Now
            </button>
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Browse Our Full Screen Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title="Get Phone Screen Wholesale Quote"
        subtitle="Tell us your screen requirements and we'll provide competitive OEM quality pricing"
        defaultMessage="I'm interested in phone screen wholesale for my repair shop. Please provide pricing and availability for:"
      />
    </main>
  );
}
