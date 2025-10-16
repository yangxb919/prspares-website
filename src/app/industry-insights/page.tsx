'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowUp, Tag, TrendingUp, Globe, Smartphone, Factory } from 'lucide-react';

const IndustryInsightsPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'overview', title: 'Market Overview', icon: '📊' },
    { id: 'manufacturers', title: 'Key Manufacturers', icon: '🏭' },
    { id: 'production', title: 'Production Capacity', icon: '⚡' },
    { id: 'technology', title: 'Technology Specs', icon: '🔬' },
    { id: 'market-share', title: 'Market Share', icon: '📈' },
    { id: 'supply-chain', title: 'Supply Chain', icon: '🔗' },
    { id: 'future-trends', title: 'Future Trends', icon: '🚀' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
        offset: document.getElementById(section.id)?.getBoundingClientRect().top || 0
      }));

      const currentSection = sectionElements.find(section =>
        section.offset >= -100 && section.offset <= 200
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/news/oled_factory_hero.jpg"
            alt="East Asia OLED Manufacturing"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              East Asian OLED Market Analysis
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Comprehensive insights into the world's leading OLED display manufacturing hub
            </p>
            <button
              onClick={() => scrollToSection('overview')}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Explore Market Insights
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="space-y-16">
              {/* Market Overview Section */}
              <section id="overview" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">📊</span>
                  East Asian OLED Display Market Overview
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  East Asia has emerged as the absolute core of the global OLED display industry, with China, Japan, South Korea, and Taiwan forming a complete industrial ecosystem.
                </p>

                {/* Core Statistics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-blue-800">60%</div>
                        <div className="text-sm text-blue-600">2024 Global OLED Capacity Share</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center mb-3">
                      <Smartphone className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-green-800">55%</div>
                        <div className="text-sm text-green-600">2024 Smartphone OLED Penetration</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center mb-3">
                      <Factory className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-purple-800">50.7%</div>
                        <div className="text-sm text-purple-600">Chinese Manufacturers 2024 Global Share</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center mb-3">
                      <Globe className="w-8 h-8 text-orange-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-orange-800">$60B</div>
                        <div className="text-sm text-orange-600">Projected 2025 Market Size (USD)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Source Premium OLED Displays?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Connect with verified East Asian OLED manufacturers and get competitive quotes for your mobile repair business.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Browse OLED Screens
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      Get Quote
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Key Manufacturers Section */}
              <section id="manufacturers" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">🏭</span>
                  Key Manufacturers & Market Leaders
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  East Asia brings together the world's most important OLED display manufacturers, forming an industrial landscape characterized by South Korea's technological leadership, China's capacity expansion, Japan's technological accumulation, and Taiwan's niche advantages.
                </p>

                {/* South Korean Manufacturers */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-red-600 mb-6 text-center">🇰🇷 South Korea: Technology Leaders</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Samsung Display */}
                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                      <Image
                        src="/images/news/samsung_display_factory.jpg"
                        alt="Samsung Display Factory"
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-blue-600 mb-3">Samsung Display</h4>
                        <div className="mb-4">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Global #1</span>
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded ml-2">Market Share 42.2%</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Founded in 2012, headquartered in Yongin, Gyeonggi Province, South Korea, with approximately 58,000 employees. As the absolute leader in the global display panel industry, Samsung Display has overwhelming advantages in small and medium-sized OLED fields.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">Core Technology:</span>
                            <span className="text-right">QD-OLED, 8.6G Large OLED, Flexible Foldable</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Major Clients:</span>
                            <span className="text-right">Apple, Samsung Electronics, Xiaomi</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Strategic Investment:</span>
                            <span className="text-right">4.1T KRW Asan 8.6G Line</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LG Display */}
                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                      <Image
                        src="/images/news/lg_display_headquarters.jpg"
                        alt="LG Display Headquarters"
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-purple-600 mb-3">LG Display</h4>
                        <div className="mb-4">
                          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">Global #2</span>
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded ml-2">Market Share 23.9%</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          South Korea's leading display technology company, strategically transforming from traditional LCD business to high-end OLED fields. Focuses on large-size OLED TV panels, maintaining global leadership in this segment.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">Core Technology:</span>
                            <span className="text-right">Large OLED, Transparent OLED, Flexible Display</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Major Clients:</span>
                            <span className="text-right">LG Electronics, Sony, Philips TV Brands</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Strategic Investment:</span>
                            <span className="text-right">1.26T KRW Paju OLED Factory</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chinese Manufacturers */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-red-600 mb-6 text-center">🇨🇳 China: Rapid Rise</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* BOE */}
                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                      <Image
                        src="/images/news/boe_company.jpg"
                        alt="BOE Technology Group"
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-blue-600 mb-2">BOE Technology</h4>
                        <div className="mb-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">China #1</span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded ml-1">Global #3</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Founded in 1993, headquartered in Beijing, is a leading global semiconductor display company. Flexible AMOLED shipments have ranked first domestically and second globally for consecutive years.
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="font-semibold">Core Tech:</span>
                            <span className="text-right">f-OLED Flexible, Foldable, Automotive</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Clients:</span>
                            <span className="text-right">Apple, Huawei, Honor, Xiaomi</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visionox */}
                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                      <Image
                        src="/images/news/visionox_oled.jpg"
                        alt="Visionox OLED"
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-green-600 mb-2">Visionox</h4>
                        <div className="mb-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">China OLED Pioneer</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded ml-1">16000+ Patents</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Founded in 2001, formerly Tsinghua University OLED project team, is China's first OLED product supplier. Has significant voice in flexible display technology, with global #1 smart wearable AMOLED shipments.
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="font-semibold">Core Tech:</span>
                            <span className="text-right">pTSF Materials, ViP Smart Pixel</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Clients:</span>
                            <span className="text-right">Honor, Xiaomi, vivo, OPPO</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tianma */}
                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                      <Image
                        src="/images/news/mobile_oled_tech.jpg"
                        alt="Tianma Manufacturing"
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-orange-600 mb-2">Tianma Microelectronics</h4>
                        <div className="mb-3">
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">Professional Display</span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded ml-1">Automotive Champion</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Founded in 1983, affiliated with China Aviation Industry Group. Focuses on customized display solutions, automotive display modules certified as national-level manufacturing single champion products.
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="font-semibold">Core Tech:</span>
                            <span className="text-right">LTPS, AMOLED, Touch Integration</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Clients:</span>
                            <span className="text-right">Huawei, Xiaomi, Automotive Brands</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Partner with Leading OLED Manufacturers</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Access our verified network of East Asian OLED manufacturers for your mobile repair parts sourcing needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      View OLED Products
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
                    >
                      Contact Suppliers
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Production Capacity Section */}
              <section id="production" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">⚡</span>
                  Production Capacity & Technology Specs
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Analysis of production capabilities and technical specifications across East Asian manufacturers
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-lg mb-4 text-blue-800 flex items-center">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-sm">🔧</span>
                      Production Lines
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Gen 6 OLED: 15 production lines</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Gen 8.5 OLED: 8 production lines</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Flexible OLED: 12 production lines</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <h4 className="font-bold text-lg mb-4 text-green-800 flex items-center">
                      <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-2 text-sm">📏</span>
                      Panel Sizes
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Small: 5.5"-6.8" (Smartphone)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Medium: 10"-15" (Tablet/Laptop)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Large: 55"-88" (TV/Display)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-lg mb-4 text-purple-800 flex items-center">
                      <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2 text-sm">🎯</span>
                      Quality Standards
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Pixel Density: 400-500 PPI</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Color Gamut: 100% DCI-P3</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>Lifespan: 50,000+ hours</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Technology Specifications Table */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Specifications Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refresh Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brightness</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Samsung Display</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">QD-OLED</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3200×1440</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120Hz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1000 nits</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LG Display</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">WOLED</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3840×2160</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120Hz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">800 nits</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BOE Technology</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">f-OLED</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2778×1284</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90Hz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">800 nits</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Visionox</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ViP AMOLED</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2400×1080</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90Hz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">600 nits</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Need Technical Specifications?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Get detailed technical specifications and compatibility information for your repair projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Technical Datasheets
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
                    >
                      Request Specs
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Market Share Section */}
              <section id="market-share" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">📈</span>
                  Market Share & Competitive Landscape
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Detailed analysis of market share distribution and competitive dynamics in the East Asian OLED market
                </p>

                {/* Market Share Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">2024 Global OLED Market Share</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-800">Samsung Display (Korea)</span>
                          <span className="text-blue-600 font-bold">42.2%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: '42.2%'}}></div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-purple-800">LG Display (Korea)</span>
                          <span className="text-purple-600 font-bold">23.9%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3">
                          <div className="bg-purple-600 h-3 rounded-full" style={{width: '23.9%'}}></div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-green-800">BOE Technology (China)</span>
                          <span className="text-green-600 font-bold">15.7%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{width: '15.7%'}}></div>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-orange-800">Visionox (China)</span>
                          <span className="text-orange-600 font-bold">8.1%</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-3">
                          <div className="bg-orange-600 h-3 rounded-full" style={{width: '8.1%'}}></div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">Others</span>
                          <span className="text-gray-600 font-bold">10.1%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gray-600 h-3 rounded-full" style={{width: '10.1%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Regional Market Dynamics</h3>
                    <div className="space-y-6">
                      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-bold text-red-800 mb-2">🇰🇷 South Korea</h4>
                        <p className="text-red-700 text-sm mb-2">Combined Market Share: 66.1%</p>
                        <p className="text-gray-600 text-sm">Maintains technological leadership through R&D investment and premium product focus. Strong partnerships with global smartphone brands.</p>
                      </div>

                      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-bold text-yellow-800 mb-2">🇨🇳 China</h4>
                        <p className="text-yellow-700 text-sm mb-2">Combined Market Share: 26.2%</p>
                        <p className="text-gray-600 text-sm">Rapid growth through massive capacity expansion and government support. Focus on cost-competitive solutions and domestic market penetration.</p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-800 mb-2">🇯🇵 Japan & 🇹🇼 Taiwan</h4>
                        <p className="text-blue-700 text-sm mb-2">Combined Market Share: 7.7%</p>
                        <p className="text-gray-600 text-sm">Specialized in niche markets, materials technology, and high-precision manufacturing equipment. Focus on innovation and quality.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Competitive Advantages Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <h4 className="font-bold text-blue-800 mb-3">Technology Leadership</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Samsung: QD-OLED innovation</li>
                        <li>• LG: Large OLED expertise</li>
                        <li>• Visionox: Flexible display patents</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                      <h4 className="font-bold text-green-800 mb-3">Production Scale</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• BOE: Rapid capacity expansion</li>
                        <li>• Samsung: Established infrastructure</li>
                        <li>• LG: TV panel dominance</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                      <h4 className="font-bold text-purple-800 mb-3">Cost Efficiency</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Chinese manufacturers: Lower labor costs</li>
                        <li>• Government subsidies</li>
                        <li>• Vertical integration benefits</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                      <h4 className="font-bold text-orange-800 mb-3">Market Access</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Samsung: Apple partnership</li>
                        <li>• BOE: Domestic brand support</li>
                        <li>• LG: TV brand relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Stay Ahead of Market Trends</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Get real-time market intelligence and competitive analysis for your sourcing decisions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Market Reports
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300"
                    >
                      Subscribe Updates
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Supply Chain Section */}
              <section id="supply-chain" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">🔗</span>
                  Supply Chain & Ecosystem
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Understanding the complex supply chain relationships and ecosystem dependencies in East Asian OLED manufacturing
                </p>

                {/* Supply Chain Flow */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">OLED Supply Chain Flow</h3>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">🧪</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Raw Materials</h4>
                        <p className="text-sm text-gray-600">Organic compounds, substrates, chemicals from Japan & Korea</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">⚙️</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Equipment</h4>
                        <p className="text-sm text-gray-600">Manufacturing equipment from Japan, Korea, and Europe</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">🏭</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Manufacturing</h4>
                        <p className="text-sm text-gray-600">Panel production in Korea, China, and Taiwan facilities</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">📱</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Integration</h4>
                        <p className="text-sm text-gray-600">Device assembly and global distribution</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Suppliers */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Supply Chain Partners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-3">Materials Suppliers</h4>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• Sumitomo Chemical (Japan) - OLED materials</li>
                        <li>• Merck KGaA (Germany) - Organic compounds</li>
                        <li>• DuPont (USA) - Substrate materials</li>
                        <li>• Toray Industries (Japan) - Flexible substrates</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-3">Equipment Suppliers</h4>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• Canon Tokki (Japan) - Evaporation equipment</li>
                        <li>• ULVAC (Japan) - Vacuum systems</li>
                        <li>• Applied Materials (USA) - Processing equipment</li>
                        <li>• SCREEN Holdings (Japan) - Cleaning systems</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h4 className="font-bold text-purple-800 mb-3">Component Suppliers</h4>
                      <ul className="text-sm text-purple-700 space-y-2">
                        <li>• Corning (USA) - Glass substrates</li>
                        <li>• 3M (USA) - Optical films</li>
                        <li>• Nitto Denko (Japan) - Adhesive films</li>
                        <li>• Asahi Kasei (Japan) - Separator films</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Supply Chain Risks */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Supply Chain Risk Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-red-600 mb-4">Risk Factors</h4>
                      <div className="space-y-3">
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <h5 className="font-semibold text-red-800">Geopolitical Tensions</h5>
                          <p className="text-sm text-red-700">Trade restrictions and technology export controls</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                          <h5 className="font-semibold text-orange-800">Material Shortages</h5>
                          <p className="text-sm text-orange-700">Limited suppliers for specialized OLED materials</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                          <h5 className="font-semibold text-yellow-800">Equipment Bottlenecks</h5>
                          <p className="text-sm text-yellow-700">Long lead times for critical manufacturing equipment</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-600 mb-4">Mitigation Strategies</h4>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h5 className="font-semibold text-green-800">Supplier Diversification</h5>
                          <p className="text-sm text-green-700">Multiple sourcing strategies and regional alternatives</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <h5 className="font-semibold text-blue-800">Strategic Partnerships</h5>
                          <p className="text-sm text-blue-700">Long-term contracts and joint ventures</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <h5 className="font-semibold text-purple-800">Vertical Integration</h5>
                          <p className="text-sm text-purple-700">In-house development of critical components</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Optimize Your Supply Chain</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Connect with our supply chain experts to optimize your OLED sourcing strategy and mitigate risks.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Supply Chain Solutions
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300"
                    >
                      Consult Experts
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Future Trends Section */}
              <section id="future-trends" className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-4xl mr-3">🚀</span>
                  Future Trends & Market Outlook
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Analysis of emerging trends and future developments in the East Asian OLED market
                </p>

                {/* Future Trends */}
                <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-8 rounded-2xl mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3 text-2xl">🌟</span>
                    Key Market Trends 2025-2030
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📱</span>
                      </div>
                      <h4 className="font-bold mb-2">Foldable Displays</h4>
                      <p className="text-sm opacity-90">Next-generation flexible OLED technology enabling foldable smartphones and tablets with improved durability</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <h4 className="font-bold mb-2">Production Scale</h4>
                      <p className="text-sm opacity-90">Massive capacity expansion with new Gen 8.5 and Gen 10.5 production lines reducing costs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💡</span>
                      </div>
                      <h4 className="font-bold mb-2">Technology Innovation</h4>
                      <p className="text-sm opacity-90">Advanced materials and manufacturing processes reducing costs and improving efficiency</p>
                    </div>
                  </div>
                </div>

                {/* Market Projections */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Market Projections 2025-2030</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">$85B</div>
                      <div className="text-sm text-blue-800 font-semibold">2030 Market Size</div>
                      <div className="text-xs text-blue-600 mt-1">15% CAGR</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
                      <div className="text-sm text-green-800 font-semibold">Smartphone Penetration</div>
                      <div className="text-xs text-green-600 mt-1">by 2030</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                      <div className="text-sm text-purple-800 font-semibold">Foldable Market Share</div>
                      <div className="text-xs text-purple-600 mt-1">of premium segment</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">55%</div>
                      <div className="text-sm text-orange-800 font-semibold">Chinese Market Share</div>
                      <div className="text-xs text-orange-600 mt-1">projected by 2030</div>
                    </div>
                  </div>
                </div>

                {/* Final Call to Action */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready for the Future of OLED?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Stay ahead of the curve with our comprehensive OLED market intelligence and sourcing solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      Explore OLED Products
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Get Market Intelligence
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default IndustryInsightsPage;