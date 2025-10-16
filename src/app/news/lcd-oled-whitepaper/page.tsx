'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowUp, Tag, Monitor, Microscope, BarChart3, TestTube, Shield, TrendingUp, Settings } from 'lucide-react';

const LCDOLEDWhitepaperPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'overview', title: 'Overview & Executive Summary', icon: '📊' },
    { id: 'technology', title: 'Technology Principles', icon: '🔬' },
    { id: 'history', title: 'Technology Development', icon: '📈' },
    { id: 'parameters', title: 'Quality Parameters', icon: '📏' },
    { id: 'testing', title: 'Testing Methods', icon: '🧪' },
    { id: 'reliability', title: 'Reliability Testing', icon: '🛡️' },
    { id: 'market', title: 'Market Analysis', icon: '💼' },
    { id: 'decision', title: 'Decision Framework', icon: '⚙️' }
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/news" className="hover:text-blue-600">News</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">LCD/OLED Quality & Testing Whitepaper</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/news/hero-display-tech.jpg"
            alt="LCD/OLED Display Technology"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            LCD/OLED Quality & Testing Whitepaper
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90 max-w-4xl mx-auto">
            Comprehensive analysis of display technology principles, evaluation standards, and testing methods for professional equipment procurement decisions
          </p>
          <button
            onClick={() => scrollToSection('overview')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Start Reading
            <ArrowUp className="w-5 h-5 ml-2 rotate-90" />
          </button>
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

              {/* Overview Section */}
              <section id="overview" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">📊</span>
                    Whitepaper Overview & Executive Summary
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Providing comprehensive technical reference for display technology equipment procurement decisions through systematic evaluation of LCD and OLED quality parameters, testing standards, and development trends
                  </p>
                </div>

                {/* Research Purpose */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Monitor className="w-6 h-6 mr-3 text-blue-600" />
                    Research Purpose
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border-l-4 border-blue-500">
                    <p className="text-lg leading-relaxed text-gray-700 mb-4">
                      This whitepaper aims to provide comprehensive technical reference for display technology equipment procurement decisions, helping users make scientific choices through systematic evaluation of LCD and OLED technology quality parameters, testing standards, and development trends.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Technical Parameter Assessment</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Quality Standards Analysis</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Procurement Decision Support</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Cost-Benefit Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technology Principles Section */}
              <section id="technology" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">🔬</span>
                    Display Technology Principles
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Understanding the fundamental working principles of LCD and OLED technologies for informed decision-making
                  </p>
                </div>

                {/* LCD Technology */}
                <div className="mb-16">
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
                    <div className="lg:w-1/2">
                      <div className="bg-white p-8 rounded-lg shadow-lg border">
                        <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                          <Monitor className="w-6 h-6 mr-3" />
                          LCD Display Technology Principles
                        </h3>
                        <p className="text-gray-700 mb-4">
                          LCD (Liquid Crystal Display) achieves display through controlling the refraction characteristics of liquid crystal molecules to light. Its core working principle is based on the molecular rearrangement phenomenon of liquid crystal materials under electric field action.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Key Working Mechanisms:</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Polarized light is twisted 90° when passing through liquid crystal layer</li>
                            <li>• Voltage controls liquid crystal molecular alignment state</li>
                            <li>• Backlight source provides uniform illumination</li>
                            <li>• RGB color filters achieve color display</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2">
                      <Image
                        src="/images/news/lcd-structure.jpg"
                        alt="LCD Structure Diagram"
                        width={600}
                        height={400}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  {/* LCD Core Components */}
                  <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border">
                    <h4 className="text-xl font-bold text-gray-800 mb-6">LCD Core Component Structure</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-semibold text-gray-800">Liquid Crystal Layer</h5>
                          <p className="text-sm text-gray-600">5μm thickness, controls molecular alignment through electric field</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h5 className="font-semibold text-gray-800">Polarizing Filters</h5>
                          <p className="text-sm text-gray-600">Vertically arranged top and bottom, controls light polarization direction</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h5 className="font-semibold text-gray-800">TFT Array</h5>
                          <p className="text-sm text-gray-600">Thin Film Transistors, achieve pixel-level precise control</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h5 className="font-semibold text-gray-800">Backlight Module</h5>
                          <p className="text-sm text-gray-600">LED backlight, saves 30% energy consumption, lifespan &gt;50,000 hours</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <h5 className="font-semibold text-gray-800">Color Filters</h5>
                          <p className="text-sm text-gray-600">RGB three primary color microstructures, achieve 16.77 million color display</p>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                          <h5 className="font-semibold text-gray-800">Drive Circuits</h5>
                          <p className="text-sm text-gray-600">Contains T-CON timing controller and gate/source drivers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LCD Subtypes Comparison */}
                  <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border">
                    <h4 className="text-xl font-bold text-gray-800 mb-6">TFT-LCD Subtype Technology Comparison</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Technology Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Viewing Angle</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Response Time</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Contrast Ratio</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Color Accuracy</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Manufacturing Cost</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Application Scenarios</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600">TN</td>
                            <td className="border border-gray-300 px-4 py-2">≤160°</td>
                            <td className="border border-gray-300 px-4 py-2">1-5ms</td>
                            <td className="border border-gray-300 px-4 py-2">1000:1</td>
                            <td className="border border-gray-300 px-4 py-2">ΔE≥5</td>
                            <td className="border border-gray-300 px-4 py-2">$5/m²</td>
                            <td className="border border-gray-300 px-4 py-2">Gaming displays</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-green-600">IPS</td>
                            <td className="border border-gray-300 px-4 py-2">178°</td>
                            <td className="border border-gray-300 px-4 py-2">≥4ms</td>
                            <td className="border border-gray-300 px-4 py-2">1000:1</td>
                            <td className="border border-gray-300 px-4 py-2">ΔE≤2</td>
                            <td className="border border-gray-300 px-4 py-2">$12/m²</td>
                            <td className="border border-gray-300 px-4 py-2">Professional design displays</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-purple-600">VA</td>
                            <td className="border border-gray-300 px-4 py-2">178°</td>
                            <td className="border border-gray-300 px-4 py-2">8-16ms</td>
                            <td className="border border-gray-300 px-4 py-2">5000:1+</td>
                            <td className="border border-gray-300 px-4 py-2">ΔE≈3</td>
                            <td className="border border-gray-300 px-4 py-2">$8/m²</td>
                            <td className="border border-gray-300 px-4 py-2">Curved displays, 4K TVs</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* OLED Technology */}
                <div className="mb-16">
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
                    <div className="lg:w-1/2">
                      <Image
                        src="/images/news/oled-structure.jpg"
                        alt="OLED Structure Diagram"
                        width={600}
                        height={400}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="lg:w-1/2">
                      <div className="bg-white p-8 rounded-lg shadow-lg border">
                        <h3 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                          <TestTube className="w-6 h-6 mr-3" />
                          OLED Display Technology Principles
                        </h3>
                        <p className="text-gray-700 mb-4">
                          OLED (Organic Light-Emitting Diode) is based on the electroluminescence phenomenon of organic semiconductor materials. Its core characteristic lies in the self-emitting mechanism, achieving high contrast display without requiring a backlight source.
                        </p>
                        <div className="bg-orange-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-orange-800 mb-2">Light Emission Mechanism:</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• Carrier injection: Holes and electrons inject into organic layers</li>
                            <li>• Exciton formation: Carrier recombination forms excited states</li>
                            <li>• Radiative transition: Exciton decay releases photons</li>
                            <li>• Photon output: Direct light emission without backlight</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Technology */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center mt-8">
                  <h3 className="text-2xl font-bold mb-4">Need High-Quality Display Components?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Explore our comprehensive range of LCD and OLED display components with detailed technical specifications.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Browse Display Products
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      Technical Consultation
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Technology Development Section */}
              <section id="history" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">📈</span>
                    Technology Development History & Trends
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Evolution of display technologies from early CRT to modern OLED and emerging Micro-LED solutions
                  </p>
                </div>

                {/* Technology Timeline */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Display Technology Evolution Timeline
                  </h3>

                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

                    <div className="space-y-12">
                      {/* LCD Era */}
                      <div className="relative flex items-center">
                        <div className="flex-1 pr-8 text-right">
                          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                            <h4 className="text-xl font-bold text-blue-800 mb-2">1990s-2000s: LCD Dominance</h4>
                            <p className="text-blue-700 mb-3">TFT-LCD technology maturation and mass production</p>
                            <ul className="text-sm text-blue-600 space-y-1">
                              <li>• Sharp develops first large-size TFT-LCD panels</li>
                              <li>• Cost reduction through Gen 5-8 fab investments</li>
                              <li>• IPS and VA panel technologies introduced</li>
                              <li>• LED backlighting replaces CCFL</li>
                            </ul>
                          </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                        <div className="flex-1 pl-8"></div>
                      </div>

                      {/* OLED Emergence */}
                      <div className="relative flex items-center">
                        <div className="flex-1 pr-8"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                        <div className="flex-1 pl-8">
                          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                            <h4 className="text-xl font-bold text-green-800 mb-2">2010s: OLED Revolution</h4>
                            <p className="text-green-700 mb-3">Samsung and LG Drive OLED commercialization</p>
                            <ul className="text-sm text-green-600 space-y-1">
                              <li>• Samsung launches first AMOLED smartphones</li>
                              <li>• LG develops WOLED TV technology</li>
                              <li>• Flexible OLED displays enable foldable devices</li>
                              <li>• Apple adopts OLED for iPhone X</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Current Era */}
                      <div className="relative flex items-center">
                        <div className="flex-1 pr-8 text-right">
                          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                            <h4 className="text-xl font-bold text-purple-800 mb-2">2020s: Next-Gen Technologies</h4>
                            <p className="text-purple-700 mb-3">Mini-LED, Micro-LED, and QD-OLED emergence</p>
                            <ul className="text-sm text-purple-600 space-y-1">
                              <li>• Apple introduces Mini-LED in iPad Pro and MacBook</li>
                              <li>• Samsung commercializes QD-OLED displays</li>
                              <li>• Micro-LED prototypes reach consumer readiness</li>
                              <li>• 8K resolution becomes mainstream</li>
                            </ul>
                          </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white"></div>
                        <div className="flex-1 pl-8"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Technology Innovations */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Current Technology Innovations (2024-2025)
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* LCD Innovations */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-blue-700">LCD Technology Advances</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Mini-LED Backlight Technology</h5>
                          <p className="text-sm text-blue-700">Achieves HDR effects through zone dimming, improving dynamic contrast ratio. 2025 shipments reach 13.5 million units, surpassing OLED for the first time.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">IGZO Backplane Technology</h5>
                          <p className="text-sm text-blue-700">Power consumption reduced to 1/10 of a-Si, enabling higher resolution displays with improved efficiency.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Quantum Dot Color Filters</h5>
                          <p className="text-sm text-blue-700">QD-CF technology extends color gamut to 120% NTSC, approaching OLED color performance.</p>
                        </div>
                      </div>
                    </div>

                    {/* OLED Innovations */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-orange-700">OLED Technology Advances</h4>
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">Polarizer-Free Technology</h5>
                          <p className="text-sm text-orange-700">Samsung's OCF technology increases brightness to 5000 nits, significantly improving outdoor visibility.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">Inkjet Printing OLED</h5>
                          <p className="text-sm text-orange-700">TCL CSOT's material utilization efficiency improved by 50%, reducing manufacturing costs.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">Flexible Displays</h5>
                          <p className="text-sm text-orange-700">Foldable and rollable devices achieve commercial viability with improved durability and crease reduction.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reliability Testing Section */}
              <section id="reliability" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">🛡️</span>
                    Reliability Testing & Quality Assurance
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Comprehensive reliability testing protocols and quality assurance methodologies for display technology validation
                  </p>
                </div>

                {/* Testing Categories */}
                <div className="mb-16">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Environmental Testing */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-green-600">Environmental Testing</h3>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Validates display performance under various environmental conditions including temperature, humidity, and atmospheric pressure variations.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded">
                          <h4 className="font-semibold text-green-800 text-sm">Temperature Cycling</h4>
                          <p className="text-xs text-green-600">-40°C to +85°C, 1000 cycles minimum</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <h4 className="font-semibold text-green-800 text-sm">Humidity Testing</h4>
                          <p className="text-xs text-green-600">85°C/85% RH, 1000 hours exposure</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <h4 className="font-semibold text-green-800 text-sm">Thermal Shock</h4>
                          <p className="text-xs text-green-600">Rapid temperature transitions, 500 cycles</p>
                        </div>
                      </div>
                    </div>

                    {/* Accelerated Aging */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                          <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-orange-600">Accelerated Aging</h3>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Simulates long-term usage effects through accelerated stress testing to predict display lifespan and performance degradation patterns.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-orange-50 p-3 rounded">
                          <h4 className="font-semibold text-orange-800 text-sm">Burn-in Testing</h4>
                          <p className="text-xs text-orange-600">Static pattern display, 2000+ hours</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <h4 className="font-semibold text-orange-800 text-sm">Backlight Aging</h4>
                          <p className="text-xs text-orange-600">Continuous operation, 50,000 hours</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <h4 className="font-semibold text-orange-800 text-sm">Color Shift Analysis</h4>
                          <p className="text-xs text-orange-600">Chromaticity tracking over time</p>
                        </div>
                      </div>
                    </div>

                    {/* Mechanical Testing */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-blue-600">Mechanical Testing</h3>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Evaluates physical durability and mechanical stress resistance including vibration, shock, and flexural testing for various applications.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <h4 className="font-semibold text-blue-800 text-sm">Vibration Testing</h4>
                          <p className="text-xs text-blue-600">10-2000 Hz, 2G acceleration</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <h4 className="font-semibold text-blue-800 text-sm">Drop Testing</h4>
                          <p className="text-xs text-blue-600">1.2m height, multiple orientations</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <h4 className="font-semibold text-blue-800 text-sm">Flex Testing</h4>
                          <p className="text-xs text-blue-600">100,000+ bend cycles for flexible displays</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Standards */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    International Quality Standards & Certifications
                  </h3>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold mb-4 text-gray-800">Display Standards</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">IEC 62341-6-2</span>
                            <span className="text-sm text-gray-600">OLED Display Modules</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">IEC 61747-30-5</span>
                            <span className="text-sm text-gray-600">LCD Reliability Testing</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">JEITA ED-2521C</span>
                            <span className="text-sm text-gray-600">Measurement Methods</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">VESA DisplayHDR</span>
                            <span className="text-sm text-gray-600">HDR Performance Certification</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mb-4 text-gray-800">Environmental Standards</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">MIL-STD-810H</span>
                            <span className="text-sm text-gray-600">Military Environmental Testing</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">IEC 60068-2</span>
                            <span className="text-sm text-gray-600">Environmental Testing</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">ASTM D4169</span>
                            <span className="text-sm text-gray-600">Shipping Container Testing</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="font-medium">ISO 9241-307</span>
                            <span className="text-sm text-gray-600">Electronic Visual Display</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quality Parameters Section */}
              <section id="parameters" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">📏</span>
                    Display Quality Key Parameters & Evaluation Standards
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Systematic analysis of key technical parameters for display panel quality, including brightness, contrast ratio, color gamut coverage and other core indicators' physical meanings, measurement units and industry standards
                  </p>
                </div>

                {/* Parameter Overview */}
                <div className="mb-16">
                  <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                      Display Quality Assessment Core Dimensions
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Display panel quality assessment requires focus on eight core parameters: resolution, brightness, contrast ratio, response time, refresh rate, color gamut coverage, backlight technology, and interface types. These parameters collectively determine display clarity, color performance, dynamic response capability, and compatibility. Different display technologies (LCD, LED, OLED) show significant differences in these indicators, requiring comprehensive evaluation based on application scenarios.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">☀</span>
                          </div>
                          <h4 className="font-bold text-gray-800">Brightness Parameters</h4>
                        </div>
                        <p className="text-sm text-gray-600">cd/m² (nits) measures luminous intensity, affecting environmental adaptability</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">⚖</span>
                          </div>
                          <h4 className="font-bold text-gray-800">Contrast Ratio</h4>
                        </div>
                        <p className="text-sm text-gray-600">Light-dark level ratio, determines image depth perception</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">🎨</span>
                          </div>
                          <h4 className="font-bold text-gray-800">Color Gamut Coverage</h4>
                        </div>
                        <p className="text-sm text-gray-600">sRGB/DCI-P3/Rec.2020 color range</p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">⚡</span>
                          </div>
                          <h4 className="font-bold text-gray-800">Response Performance</h4>
                        </div>
                        <p className="text-sm text-gray-600">Refresh rate (Hz) and response time (ms)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brightness Measurement Standards */}
                <div className="mb-16">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
                      <h3 className="text-2xl font-bold mb-2 flex items-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-yellow-200">☀</span>
                        </div>
                        Brightness Measurement Standards & Applications
                      </h3>
                      <p className="text-yellow-100">Brightness is the core parameter determining display visibility in different environments</p>
                    </div>

                    <div className="p-8">
                      <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="text-xl font-semibold mb-4 text-gray-800">Standard Brightness Levels</h4>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Indoor Office Environment</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">200-400 cd/m²</span>
                              </div>
                              <p className="text-sm text-gray-600">Standard office lighting, document processing, general computing</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Professional Design</span>
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">300-500 cd/m²</span>
                              </div>
                              <p className="text-sm text-gray-600">Color-critical work, photo editing, graphic design</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Bright Environment</span>
                                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">500-800 cd/m²</span>
                              </div>
                              <p className="text-sm text-gray-600">Near windows, bright retail spaces, medical imaging</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Outdoor/Sunlight</span>
                                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">1000+ cd/m²</span>
                              </div>
                              <p className="text-sm text-gray-600">Direct sunlight, outdoor digital signage, automotive displays</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold mb-4 text-gray-800">Technology Comparison</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 px-3 py-2 text-left">Technology</th>
                                  <th className="border border-gray-300 px-3 py-2 text-left">Typical Range</th>
                                  <th className="border border-gray-300 px-3 py-2 text-left">Peak Capability</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-gray-300 px-3 py-2 font-semibold text-blue-600">Standard LCD</td>
                                  <td className="border border-gray-300 px-3 py-2">250-400 cd/m²</td>
                                  <td className="border border-gray-300 px-3 py-2">600 cd/m²</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 px-3 py-2 font-semibold text-green-600">OLED</td>
                                  <td className="border border-gray-300 px-3 py-2">100-800 cd/m²</td>
                                  <td className="border border-gray-300 px-3 py-2">1000 cd/m²</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 px-3 py-2 font-semibold text-purple-600">Mini-LED</td>
                                  <td className="border border-gray-300 px-3 py-2">600-1500 cd/m²</td>
                                  <td className="border border-gray-300 px-3 py-2">4000 cd/m²</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 px-3 py-2 font-semibold text-orange-600">Micro-LED</td>
                                  <td className="border border-gray-300 px-3 py-2">1000-5000 cd/m²</td>
                                  <td className="border border-gray-300 px-3 py-2">10000+ cd/m²</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Quality Testing */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg text-center mt-8">
                  <h3 className="text-2xl font-bold mb-4">Quality Assurance for Your Projects</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Get access to professionally tested and certified display components with quality guarantees.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Quality Certified Products
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
                    >
                      Quality Consultation
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Testing Methods Section */}
              <section id="testing" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">🧪</span>
                    Display Testing Methods & Equipment
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Comprehensive testing methodologies and professional equipment for display quality assessment and validation
                  </p>
                </div>

                {/* Testing Overview */}
                <div className="mb-16">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                        <Monitor className="w-6 h-6 mr-2" />
                        LCD Testing Characteristics
                      </h3>
                      <p className="text-blue-700 mb-4">
                        LCD testing focuses on backlight source stability, liquid crystal molecular response characteristics, and polarized light properties. Key testing includes full-screen brightness testing, backlight power consumption evaluation, and drive circuit stability verification.
                      </p>
                      <ul className="text-sm text-blue-600 space-y-2">
                        <li>• Backlight uniformity and stability testing</li>
                        <li>• Liquid crystal response time measurement</li>
                        <li>• Viewing angle performance evaluation</li>
                        <li>• Color temperature consistency testing</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                      <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                        <TestTube className="w-6 h-6 mr-2" />
                        OLED Testing Characteristics
                      </h3>
                      <p className="text-orange-700 mb-4">
                        OLED's self-emitting characteristics introduce the 4% window brightness testing concept, focusing on regional power consumption evaluation, burn-in artifacts, and pixel-level response consistency. Testing includes fixed pattern aging and environmental reliability verification.
                      </p>
                      <ul className="text-sm text-orange-600 space-y-2">
                        <li>• Pixel-level brightness uniformity</li>
                        <li>• Burn-in susceptibility testing</li>
                        <li>• Color shift over lifetime</li>
                        <li>• Power efficiency measurement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Core Testing Equipment */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Core Testing Equipment Technical Analysis
                  </h3>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Spectrometer */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-bold text-purple-600">Spectrometer Technology</h4>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Professional spectrometers achieve precise color measurement through spectral analysis, supporting CIE 1931/1976 color space calculations and Delta E color difference evaluation.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-purple-50 p-3 rounded">
                          <h5 className="font-semibold text-purple-800 text-sm">Konica Minolta CS-2000A</h5>
                          <p className="text-xs text-purple-600">Spectral range: 380-780nm, accuracy: ±0.002 xy</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <h5 className="font-semibold text-purple-800 text-sm">Photo Research PR-788</h5>
                          <p className="text-xs text-purple-600">Luminance range: 0.001-100,000 cd/m²</p>
                        </div>
                      </div>
                    </div>

                    {/* Colorimeter */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <Settings className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-lg font-bold text-green-600">Colorimeter Systems</h4>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Colorimeters provide fast, cost-effective color measurement solutions, suitable for production line quality control and routine calibration tasks.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded">
                          <h5 className="font-semibold text-green-800 text-sm">X-Rite i1Display Pro</h5>
                          <p className="text-xs text-green-600">Response time: 2s, repeatability: ±0.5%</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <h5 className="font-semibold text-green-800 text-sm">Datacolor SpyderX Elite</h5>
                          <p className="text-xs text-green-600">Ambient light sensor, flicker detection</p>
                        </div>
                      </div>
                    </div>

                    {/* Pattern Generator */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Monitor className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-blue-600">Pattern Generators</h4>
                      </div>

                      <p className="text-gray-700 mb-4">
                        Signal generators provide standardized test patterns for comprehensive display performance evaluation, supporting multiple interface protocols.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <h5 className="font-semibold text-blue-800 text-sm">Quantum Data 980</h5>
                          <p className="text-xs text-blue-600">4K/8K support, HDR10/Dolby Vision</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <h5 className="font-semibold text-blue-800 text-sm">Murideo SIX-G</h5>
                          <p className="text-xs text-blue-600">18Gbps HDMI 2.1, VRR testing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Market Analysis Section */}
              <section id="market" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">💼</span>
                    Global Display Market Analysis & Trends
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Comprehensive analysis of global display technology market dynamics, competitive landscape, and future development trends
                  </p>
                </div>

                {/* Market Overview */}
                <div className="mb-16">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3" />
                      2024 Global Display Market Overview
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">$173.8B</div>
                        <div className="text-blue-100">Total Market Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">+5.2%</div>
                        <div className="text-blue-100">Annual Growth Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">68%</div>
                        <div className="text-blue-100">LCD Market Share</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Technology Market Share (2024)</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">LCD Technology</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '68%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">68%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">OLED Technology</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '24%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">24%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Mini-LED</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '6%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">6%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Others</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-orange-600 h-2 rounded-full" style={{width: '2%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">2%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Regional Market Distribution</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Asia-Pacific</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-red-600 h-2 rounded-full" style={{width: '58%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">58%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">North America</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '22%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">22%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Europe</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '15%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">15%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Others</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{width: '5%'}}></div>
                            </div>
                            <span className="text-sm font-semibold">5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Market Intelligence */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg text-center mt-8">
                  <h3 className="text-2xl font-bold mb-4">Stay Ahead of Market Trends</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Access the latest market intelligence and industry insights to make informed sourcing decisions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/industry-insights"
                      className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Market Intelligence
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
                    >
                      Market Analysis
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Decision Framework Section */}
              <section id="decision" className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-4xl mr-3">⚙️</span>
                    Technology Selection Decision Framework
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Systematic decision-making framework for display technology selection based on application requirements, budget constraints, and performance priorities
                  </p>
                </div>

                {/* Decision Matrix */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Technology Selection Matrix
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left">Application Scenario</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Recommended Technology</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Key Considerations</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Budget Range</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Performance Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">Office Computing</td>
                          <td className="border border-gray-300 px-4 py-3 text-blue-600">IPS LCD</td>
                          <td className="border border-gray-300 px-4 py-3">Wide viewing angles, color accuracy</td>
                          <td className="border border-gray-300 px-4 py-3">$200-500</td>
                          <td className="border border-gray-300 px-4 py-3">Comfort, Reliability</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">Gaming</td>
                          <td className="border border-gray-300 px-4 py-3 text-green-600">OLED / High-refresh LCD</td>
                          <td className="border border-gray-300 px-4 py-3">Low latency, high refresh rate</td>
                          <td className="border border-gray-300 px-4 py-3">$400-1200</td>
                          <td className="border border-gray-300 px-4 py-3">Response Time, Contrast</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">Professional Design</td>
                          <td className="border border-gray-300 px-4 py-3 text-purple-600">High-end IPS / OLED</td>
                          <td className="border border-gray-300 px-4 py-3">Color accuracy, wide gamut</td>
                          <td className="border border-gray-300 px-4 py-3">$800-3000</td>
                          <td className="border border-gray-300 px-4 py-3">Color Accuracy, Calibration</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">Entertainment</td>
                          <td className="border border-gray-300 px-4 py-3 text-orange-600">OLED / Mini-LED</td>
                          <td className="border border-gray-300 px-4 py-3">High contrast, HDR support</td>
                          <td className="border border-gray-300 px-4 py-3">$600-2000</td>
                          <td className="border border-gray-300 px-4 py-3">Contrast, HDR Performance</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final Recommendations */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border-l-4 border-green-500">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-green-600" />
                    Key Procurement Recommendations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Technical Evaluation Priority</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Brightness requirements based on environment</li>
                        <li>• Color accuracy needs for specific applications</li>
                        <li>• Response time requirements for dynamic content</li>
                        <li>• Viewing angle considerations for multi-user scenarios</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Long-term Considerations</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Technology roadmap and future compatibility</li>
                        <li>• Warranty coverage and service availability</li>
                        <li>• Power consumption and operational costs</li>
                        <li>• Upgrade path and scalability options</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Call to Action */}
              <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-12 rounded-2xl text-center">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl font-bold mb-6">Ready to Source Premium Display Components?</h2>
                  <p className="text-xl mb-8 opacity-90 leading-relaxed">
                    Apply the insights from this comprehensive LCD/OLED whitepaper to your next project.
                    Get access to high-quality display components with technical specifications that meet your exact requirements.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <Monitor className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                      <h3 className="text-lg font-semibold mb-2">Premium Displays</h3>
                      <p className="text-sm opacity-80">LCD & OLED screens with verified quality standards</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <TestTube className="w-12 h-12 mx-auto mb-4 text-green-300" />
                      <h3 className="text-lg font-semibold mb-2">Quality Tested</h3>
                      <p className="text-sm opacity-80">All components undergo rigorous testing protocols</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                      <h3 className="text-lg font-semibold mb-2">Technical Support</h3>
                      <p className="text-sm opacity-80">Expert guidance for optimal component selection</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      href="/products/screens"
                      className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      <Monitor className="w-5 h-5 mr-3" />
                      Browse Display Products
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-900 transition-all duration-300 transform hover:scale-105"
                    >
                      <Tag className="w-5 h-5 mr-3" />
                      Get Custom Quote
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/20">
                    <p className="text-sm opacity-70">
                      Join thousands of professionals who trust our display components for their critical projects
                    </p>
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
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LCDOLEDWhitepaperPage;
