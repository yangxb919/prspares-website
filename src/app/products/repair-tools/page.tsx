'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import InquiryModal from '@/components/InquiryModal';

// Note: metadata export removed due to 'use client' directive

export default function RepairToolsPage() {
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
                  Mobile Phone Repair Tools - <span className="text-blue-600">Wholesale Supplier for Overseas Repair Shops</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover high-quality, affordable mobile phone repair tools from PRSPARES. We specialize in supplying professional repair tools
                  including basic tools, repair programmers, motherboard tools, and testing equipment for overseas repair shops.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Well Selected Brands
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Latest Solutions
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Video Tutorials
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Technical Support
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
                  src="/images/repair-tools-hero.jpg"
                  alt="Mobile Phone Repair Tools Wholesale Supplier"
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

      {/* Basic Repair Tools */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Basic Repair Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Essential tools for safely disassembling smartphones and batteries. Our basic repair tools collection includes precision screwdrivers,
                pry tools, heating pads, tweezers, and more - everything needed for professional mobile phone repair operations.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-blue-800 font-medium">
                  ✓ Precision tools for all phone models &nbsp;|&nbsp;
                  ✓ Anti-static and ESD-safe options &nbsp;|&nbsp;
                  ✓ Professional-grade materials for durability
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/screwdriver-set.jpg"
                    alt="Professional Screwdriver Set"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3D Screwdriver Sets</h3>
                  <p className="text-gray-600 text-sm">Precision screwdrivers for all phone models</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/pry-tools.jpg"
                    alt="Pry Tools"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pry Tools & Spudgers</h3>
                  <p className="text-gray-600 text-sm">Safe opening tools for delicate components</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/heating-pad.jpg"
                    alt="Heating Pad"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Heating Pads</h3>
                  <p className="text-gray-600 text-sm">Controlled heating for adhesive removal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/tweezers.jpg"
                    alt="Precision Tweezers"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Tweezers</h3>
                  <p className="text-gray-600 text-sm">Anti-static tweezers for small components</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/suction-cups.jpg"
                    alt="Suction Cups"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Suction Cups</h3>
                  <p className="text-gray-600 text-sm">Screen lifting and handling tools</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/work-mat.jpg"
                    alt="Anti-static Work Mat"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Mats</h3>
                  <p className="text-gray-600 text-sm">Anti-static mats with magnetic sections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Programmers */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Repair Programmers
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Specialized devices for iPhone True Tone restoration, battery health calibration, Face ID repairs, and NAND data operations.
                Our repair programmers solve software-level issues and eliminate "Unknown Part" messages for professional repair services.
              </p>
              <div className="bg-green-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Key Applications:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• iPhone True Tone restoration and calibration</li>
                  <li>• Battery health calibration and cycle count reset</li>
                  <li>• Face ID dot projector and camera repairs</li>
                  <li>• NAND level data reading and writing operations</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">True Tone restoration and calibration</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Battery health calibration</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Face ID and camera repair</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">NAND level data operations</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/programmer-1.jpg"
                    alt="JCID Programmer"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">JCID V1SE Programmer</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/programmer-2.jpg"
                    alt="EEPROM Programmer"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">EEPROM Chip Programmer</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/watch-tool.jpg"
                    alt="Apple Watch Tool"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">Apple Watch Recovery Tool</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/programmer-3.jpg"
                    alt="RP30 Programmer"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">RP30 Programmer</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motherboard Repair Tools */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Motherboard Repair Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Professional-grade tools for advanced motherboard diagnostics and micro-soldering. Including hot air stations,
                soldering equipment, thermal cameras, and precision instruments for component-level repairs.
              </p>
              <div className="bg-purple-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-purple-800 font-medium">
                  ✓ High-frequency testing equipment &nbsp;|&nbsp;
                  ✓ Precision temperature control &nbsp;|&nbsp;
                  ✓ Advanced diagnostic capabilities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/hot-air-station.jpg"
                    alt="Hot Air Station"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hot Air Stations</h3>
                  <p className="text-gray-600 text-sm">Precision temperature control for component removal</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/soldering-station.jpg"
                    alt="Soldering Station"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Soldering Stations</h3>
                  <p className="text-gray-600 text-sm">Professional soldering with temperature control</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/power-supply.jpg"
                    alt="DC Power Supply"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">DC Power Supply</h3>
                  <p className="text-gray-600 text-sm">Variable voltage and current control</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/thermal-camera.jpg"
                    alt="Thermal Camera"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thermal Cameras</h3>
                  <p className="text-gray-600 text-sm">Heat detection for fault diagnosis</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/microscope.jpg"
                    alt="Digital Microscope"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Microscopes</h3>
                  <p className="text-gray-600 text-sm">High magnification for micro soldering</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/air-gun.jpg"
                    alt="Dust Cleaning Air Gun"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleaning Air Guns</h3>
                  <p className="text-gray-600 text-sm">Dust removal and component cleaning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Functional Testing Tools */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/screen-tester.jpg"
                    alt="Screen Test Box"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">6 in 1 Screen Test Box</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/cable-tester.jpg"
                    alt="Cable Tester"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">Cable/Charger Tester</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/port-tester.jpg"
                    alt="Port Tester"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">Charging Port Tester</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="h-40 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/tools/test-board.jpg"
                    alt="Universal Test Board"
                    width={250}
                    height={188}
                    className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex-grow flex items-center">
                  <h4 className="font-semibold text-gray-900 text-sm">Universal Test Board</h4>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Functional Testing Tools
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Comprehensive testing equipment to verify component functionality after repairs. Ensure quality control and customer satisfaction
                with professional diagnostic and validation tools for all mobile device components.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border h-full">
                  <h4 className="font-semibold text-gray-900 mb-2">Screen Testing</h4>
                  <p className="text-sm text-gray-600">Touch, display, and color accuracy verification</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border h-full">
                  <h4 className="font-semibold text-gray-900 mb-2">Cable Testing</h4>
                  <p className="text-sm text-gray-600">Charging port and cable functionality checks</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border h-full">
                  <h4 className="font-semibold text-gray-900 mb-2">Universal Testing</h4>
                  <p className="text-sm text-gray-600">Multi-model compatibility verification</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border h-full">
                  <h4 className="font-semibold text-gray-900 mb-2">Component Validation</h4>
                  <p className="text-sm text-gray-600">Professional repair quality assurance</p>
                </div>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Professional validation tools ensure every repair meets industry standards and customer expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PRSPARES for Repair Tools? */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose PRSPARES for Repair Tools?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Professional technical support and carefully selected tools to help repair shops operate more efficiently.
              From basic tools to advanced programmers, we provide complete solutions with expert guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Carefully Selected Brands & Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team carefully selects branded repair tools with excellent performance and competitive pricing.
                We maintain close partnerships with leading manufacturers for continuous product development and quality assurance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Repair Solutions & Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead with the latest repair technologies and tools. Our team continuously monitors industry trends
                and provides timely solutions for new smartphone models and emerging repair challenges.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Video Tutorials & Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Access our extensive library of professional video tutorials covering popular repair cases.
                Get step-by-step guidance and technical support to maximize your repair efficiency and success rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Upgrade Your Mobile Phone Repair Tools?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us today for professional repair tools with comprehensive technical support and video tutorials!
              Join thousands of repair shops worldwide who trust PRSPARES for quality tools and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get Tools Quote
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Watch Video Tutorials
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title="Get Repair Tools Quote"
        subtitle="Tell us your repair tool requirements and we'll provide competitive pricing with technical support"
        defaultMessage="I'm interested in mobile phone repair tools for my repair shop. Please provide pricing and availability for:"
      />
    </main>
  );
}
