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
                  Professional Mobile Repair Tools - <span className="text-blue-600">Complete Repair Solutions</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  PRSPARES offers products for the full repair process, which consists of the following major categories: basic repair tools, repair programmers, motherboard repair tools and functional testing tools.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Precision Tools
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ESD-Safe Options
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional Grade
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
                  Get Professional Tools
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/repair-tools-hero.jpg"
                  alt="Professional Mobile Repair Tools - Complete Repair Solutions"
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
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Essential tools utilized in disassembling cell phones and batteries, as well as other essential tools required for the repair process.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-blue-800 font-medium">
                  ✓ Precision tools for all phone models &nbsp;|&nbsp;
                  ✓ ESD-safe options &nbsp;|&nbsp;
                  ✓ Professional-grade materials
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Disassembly Tools</h4>
                  <p className="text-sm text-gray-600">Precision screwdrivers, pry tools, suction cups</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Soldering Tools</h4>
                  <p className="text-sm text-gray-600">Professional soldering equipment and accessories</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Measurement Tools</h4>
                  <p className="text-sm text-gray-600">Digital multimeters and testing equipment</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/screwdriver-set.jpg"
                    alt="Professional Screwdriver Set"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Screwdriver Sets</h3>
                  <p className="text-gray-600 text-sm">Professional screwdrivers for all phone models and sizes</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/pry-tools.jpg"
                    alt="Pry Tools"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pry Tools & Spudgers</h3>
                  <p className="text-gray-600 text-sm">Safe opening tools for delicate components and screens</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/heating-pad.jpg"
                    alt="Heating Pad"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Heating Pads</h3>
                  <p className="text-gray-600 text-sm">Controlled heating for safe adhesive removal</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/tweezers.jpg"
                    alt="Precision Tweezers"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Tweezers</h3>
                  <p className="text-gray-600 text-sm">Anti-static tweezers for handling small components</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/suction-cups.jpg"
                    alt="Suction Cups"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Suction Cups</h3>
                  <p className="text-gray-600 text-sm">Screen lifting and safe handling tools</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/work-mat.jpg"
                    alt="Anti-static Work Mat"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Mats</h3>
                  <p className="text-gray-600 text-sm">Anti-static mats with magnetic component sections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Programmers */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Repair Programmers
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Specialized devices used for iPhone true tone restoration, battery health calibration, Face ID dot projector repair, unknown part message repair on camera, and other software/program level issues, as well as NAND level data reading and writing.
              </p>
              <div className="bg-green-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-green-800 font-medium">
                  ✓ True Tone restoration &nbsp;|&nbsp;
                  ✓ Battery health calibration &nbsp;|&nbsp;
                  ✓ Face ID repair &nbsp;|&nbsp;
                  ✓ NAND-level data operations
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">True Tone Restoration</h4>
                  <p className="text-sm text-gray-600">iPhone display calibration and color accuracy</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Battery Health Calibration</h4>
                  <p className="text-sm text-gray-600">Cycle count reset and health optimization</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Face ID Repair</h4>
                  <p className="text-sm text-gray-600">Dot projector and camera restoration</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">NAND Operations</h4>
                  <p className="text-sm text-gray-600">Data reading, writing, and recovery</p>
                </div>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/tools/programmer-1.jpg"
                  alt="Professional Repair Programmers in Operation"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-2">Professional Programming Equipment</h3>
                <p className="text-sm opacity-90">Advanced tools for software-level repairs and data operations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/programmer-1.jpg"
                    alt="JCID V1SE Programmer"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">JCID V1SE Programmer</h3>
                  <p className="text-gray-600 text-sm">Professional iPhone repair programming solution</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/programmer-2.jpg"
                    alt="EEPROM Programmer"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">EEPROM Programmer</h3>
                  <p className="text-gray-600 text-sm">Professional chip programming and data recovery</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/programmer-3.jpg"
                    alt="RP30 Programmer"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">RP30 Programmer</h3>
                  <p className="text-gray-600 text-sm">Advanced programming solutions for mobile devices</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/watch-tool.jpg"
                    alt="Apple Watch Recovery Tool"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Apple Watch Recovery Tool</h3>
                  <p className="text-gray-600 text-sm">Specialized programming for Apple Watch repairs</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/programmer-2.jpg"
                    alt="Universal Chip Programmer"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Universal Chip Programmer</h3>
                  <p className="text-gray-600 text-sm">Multi-device programming and calibration tool</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/programmer-1.jpg"
                    alt="True Tone Programmer"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">True Tone Programmer</h3>
                  <p className="text-gray-600 text-sm">Specialized True Tone restoration and calibration</p>
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
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                High frequency tools for testing and troubleshooting motherboard problems. Professional-grade equipment for advanced motherboard diagnostics and micro-soldering operations.
              </p>
              <div className="bg-purple-50 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-purple-800 font-medium">
                  ✓ Hot air stations &nbsp;|&nbsp;
                  ✓ Soldering equipment &nbsp;|&nbsp;
                  ✓ Diagnostic devices &nbsp;|&nbsp;
                  ✓ Precision instruments
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Hot Air Stations</h4>
                  <p className="text-sm text-gray-600">Precision temperature control systems</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Soldering Equipment</h4>
                  <p className="text-sm text-gray-600">Professional micro-soldering tools</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Diagnostic Devices</h4>
                  <p className="text-sm text-gray-600">Advanced testing and analysis tools</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-gray-900 mb-2">Precision Instruments</h4>
                  <p className="text-sm text-gray-600">High-accuracy measurement tools</p>
                </div>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/tools/hot-air-station.jpg"
                  alt="Professional Motherboard Repair Workstation"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-2">Professional Motherboard Repair Workstation</h3>
                <p className="text-sm opacity-90">Advanced equipment for component-level diagnostics and repairs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/soldering-station.jpg"
                    alt="Soldering Station"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Soldering Stations</h3>
                  <p className="text-gray-600 text-sm">Professional soldering with precise temperature control</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/power-supply.jpg"
                    alt="DC Power Supply"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">DC Power Supply</h3>
                  <p className="text-gray-600 text-sm">Variable voltage and current control systems</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/thermal-camera.jpg"
                    alt="Thermal Camera"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thermal Cameras</h3>
                  <p className="text-gray-600 text-sm">Heat detection for advanced fault diagnosis</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/microscope.jpg"
                    alt="Digital Microscope"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Microscopes</h3>
                  <p className="text-gray-600 text-sm">High magnification for precision micro-soldering</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/air-gun.jpg"
                    alt="Cleaning Air Gun"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleaning Air Guns</h3>
                  <p className="text-gray-600 text-sm">Professional dust removal and component cleaning</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden h-48">
                  <Image
                    src="/images/tools/soldering-station.jpg"
                    alt="Precision Soldering Iron"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Soldering Iron</h3>
                  <p className="text-gray-600 text-sm">High-precision soldering for micro components</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Functional Testing Tools */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quality Assurance
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Functional Testing Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive testing equipment that tests the status of the device and its functionality. Suitable for multiple models and ensures quality control after repairs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Screen Testing</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Port Testing</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Universal Testing</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Component Verification</span>
              </div>
            </div>
          </div>

          {/* Modern Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cable Tester Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/cable-tester.jpg"
                    alt="Professional Cable Tester"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Professional Cable Tester
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced cable and charger functionality testing with comprehensive diagnostic capabilities for all mobile device types.
                </p>
              </div>
            </div>

            {/* Charging Port Tester Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/port-tester.jpg"
                    alt="Charging Port Tester"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Charging Port Tester
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive charging port functionality verification with multi-connector compatibility and diagnostic reporting.
                </p>
              </div>
            </div>

            {/* Universal Test Board Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/test-board.jpg"
                    alt="Universal Test Board"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Universal Test Board
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Multi-model device testing and validation platform with comprehensive component verification capabilities.
                </p>
              </div>
            </div>

            {/* Screen Test Box Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/screen-tester.jpg"
                    alt="6 in 1 Screen Test Box"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  6 in 1 Screen Test Box
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive screen testing solution for multiple device types with advanced touch, display, and color accuracy verification.
                </p>
              </div>
            </div>

            {/* Multi-Function Tester Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/cable-tester.jpg"
                    alt="Multi-Function Tester"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Multi-Function Tester
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All-in-one testing solution for various components with comprehensive diagnostic and validation capabilities.
                </p>
              </div>
            </div>

            {/* Component Validator Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src="/images/tools/test-board.jpg"
                    alt="Component Validator"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Quality Assured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Component Validator
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional component verification and quality control system for comprehensive repair validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Advantages Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Product Advantages
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Professional technical support and comprehensive training resources with quality assurance & certification for complete repair process support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Technical Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Expert technical assistance and guidance for all repair tools and equipment. Our team provides comprehensive support to ensure optimal tool performance and repair success.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Training & Educational Resources</h3>
              <p className="text-gray-600 leading-relaxed">
                Access extensive training materials, video tutorials, and educational resources. Learn proper tool usage and advanced repair techniques from industry professionals.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance & Certification</h3>
              <p className="text-gray-600 leading-relaxed">
                All tools meet professional standards with quality certifications. Rigorous testing ensures reliability and performance for professional repair operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Showcase */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Solutions Showcase
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Complete repair process support with multi-brand device compatibility for professional repair operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Complete Repair Process Support</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  From basic disassembly to advanced programming and testing, our tools cover every step of the mobile repair process for comprehensive service capabilities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Multi-Brand Device Compatibility</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Universal tools and specialized equipment compatible with iPhone, Android, iPad, and other mobile devices for versatile repair shop operations.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/tools/test-board.jpg"
                  alt="Multi-Brand Device Compatibility Solutions"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-lg font-bold mb-2">Universal Testing Solutions</h3>
                <p className="text-sm opacity-90">Compatible with multiple device brands and models</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Upgrade Your Mobile Phone Repair Tools?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Contact us today for professional repair tools with comprehensive technical support and training resources!
              Join repair professionals worldwide who trust PRSPARES for quality tools and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Get Professional Tools
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Request Technical Support
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Tool Catalog
              </button>
            </div>
            <div className="mt-8 text-blue-100 text-sm">
              <p>Contact us: <a href="mailto:service.team@phonerepairspares.com" className="underline hover:text-white">service.team@phonerepairspares.com</a> | <a href="mailto:parts.info@phonerepairspares.com" className="underline hover:text-white">parts.info@phonerepairspares.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title="Get Professional Repair Tools Quote"
        subtitle="Tell us your repair tool requirements and we'll provide competitive pricing with comprehensive technical support"
        defaultMessage="I'm interested in professional mobile phone repair tools for my repair shop. Please provide pricing and availability for:"
      />
    </main>
  );
}
