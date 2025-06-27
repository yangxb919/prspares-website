import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Professional Repair Tools - Complete Solutions | PRSPARES',
  description: 'Professional mobile repair tools including basic tools, programmers, motherboard repair equipment, and testing tools for efficient repair operations.',
};

export default function RepairToolsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Repair Tools - <span className="text-blue-600">Sourcing Solution</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  "We offer products for the full repair process, which consists of the following major categories: 
                  basic repair tools, repair programmers, motherboard repair tools and functional testing tools."
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products?category=tools" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse All Tools
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
                  src="/images/repair-tools-hero.jpg"
                  alt="Professional Repair Tools"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Basic Repair Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tools utilized in disassembling cell phones and batteries, as well as other essential tools required for the repair process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/screwdriver-set.jpg"
                    alt="Professional Screwdriver Set"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3D Screwdriver Sets</h3>
                  <p className="text-gray-600 text-sm">Precision screwdrivers for all phone models</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/pry-tools.jpg"
                    alt="Pry Tools"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pry Tools & Spudgers</h3>
                  <p className="text-gray-600 text-sm">Safe opening tools for delicate components</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/heating-pad.jpg"
                    alt="Heating Pad"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Heating Pads</h3>
                  <p className="text-gray-600 text-sm">Controlled heating for adhesive removal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/tweezers.jpg"
                    alt="Precision Tweezers"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Tweezers</h3>
                  <p className="text-gray-600 text-sm">Anti-static tweezers for small components</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/suction-cups.jpg"
                    alt="Suction Cups"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Suction Cups</h3>
                  <p className="text-gray-600 text-sm">Screen lifting and handling tools</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/work-mat.jpg"
                    alt="Anti-static Work Mat"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Repair Programmers
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Used for iPhone true tone restoration, battery health calibration, Face ID dot projector repair, 
                unknown part message repair on camera, and other software/program level issues, as well as NAND level data reading and writing.
              </p>
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/programmer-1.jpg"
                    alt="JCID Programmer"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">JCID V1SE Programmer</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/programmer-2.jpg"
                    alt="EEPROM Programmer"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">EEPROM Chip Programmer</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/watch-tool.jpg"
                    alt="Apple Watch Tool"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Apple Watch Recovery Tool</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/programmer-3.jpg"
                    alt="RP30 Programmer"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">RP30 Programmer</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motherboard Repair Tools */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Motherboard Repair Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                High frequency tools for testing and troubleshooting motherboard problems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/hot-air-station.jpg"
                    alt="Hot Air Station"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hot Air Stations</h3>
                  <p className="text-gray-600 text-sm">Precision temperature control for component removal</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/soldering-station.jpg"
                    alt="Soldering Station"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Soldering Stations</h3>
                  <p className="text-gray-600 text-sm">Professional soldering with temperature control</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/power-supply.jpg"
                    alt="DC Power Supply"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">DC Power Supply</h3>
                  <p className="text-gray-600 text-sm">Variable voltage and current control</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/thermal-camera.jpg"
                    alt="Thermal Camera"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thermal Cameras</h3>
                  <p className="text-gray-600 text-sm">Heat detection for fault diagnosis</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/microscope.jpg"
                    alt="Digital Microscope"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Microscopes</h3>
                  <p className="text-gray-600 text-sm">High magnification for micro soldering</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/air-gun.jpg"
                    alt="Dust Cleaning Air Gun"
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
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

      {/* Testing Tools */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/screen-tester.jpg"
                    alt="Screen Test Box"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">6 in 1 Screen Test Box</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/cable-tester.jpg"
                    alt="Cable Tester"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Cable/Charger Tester</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/port-tester.jpg"
                    alt="Port Tester"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Charging Port Tester</h4>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/tools/test-board.jpg"
                    alt="Universal Test Board"
                    width={250}
                    height={188}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm">Universal Test Board</h4>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Testing Tools
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tests the status of the device and its functionality. Suitable for multiple models.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Screen functionality testing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Charging port and cable testing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Universal compatibility testing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Component validation tools</p>
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
              Unique Advantages of Repair Tools Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A professional technical support service is available to help customers run their repair businesses more efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Well Selected Brands</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team selected branded repair tools with excellent performance and reasonable prices, and maintain
                close partnerships with brands for better product development.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Repairing Solution</h3>
              <p className="text-gray-600 leading-relaxed">
                Updates and iterations of smartphones are constantly bringing forth new repair technologies and tools,
                our team has always maintained a high level of attention to this trend and outputs repair solutions on time.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Video Tutorial Support</h3>
              <p className="text-gray-600 leading-relaxed">
                We have shot and accumulated a large number of video tutorials addressing hot repair cases that can be
                directly accessed by customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Upgrade Your Repair Tools?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us to get professional repair tools with technical support and training to enhance your repair capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Get Quote Now
              </Link>
              <Link
                href="/products?category=tools"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Browse Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
