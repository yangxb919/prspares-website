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
