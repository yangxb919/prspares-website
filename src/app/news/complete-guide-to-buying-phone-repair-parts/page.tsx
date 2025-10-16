import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Tag, Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';

export const metadata = {
  title: "2024 Complete Guide to Buying Phone Repair Parts | PRSPARES",
  description: "Comprehensive guide to buying mobile phone repair parts including screens, batteries, cameras, and authentic vs compatible parts comparison.",
  keywords: "phone repair parts guide, mobile repair parts, OEM parts, compatible parts, iPhone repair, Samsung repair, phone accessories",
  openGraph: {
    title: "2024 Complete Guide to Buying Phone Repair Parts | PRSPARES",
    description: "Complete guide to mobile phone repair parts with brand-specific insights and quality comparison.",
    images: ["/images/news/complete-guide-to-buying-phone-repair-parts-cover.jpg"],
  },
};

export default function PhoneRepairPartsGuide() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/news/hero-background.jpg"
            alt="Mobile repair parts market overview"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Tag className="w-4 h-4 mr-2" />
              Featured Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              2024 Complete Guide to Buying Phone Repair Parts
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Comprehensive guide to mobile phone repair parts including screens, batteries, cameras,
              and expert insights on authentic vs compatible parts
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-blue-200">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                September 12, 2024
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                25 min read
              </div>
              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Featured, Guide, Mobile Repair
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Professional Phone Repair Parts?</h2>
          <p className="text-lg mb-6 opacity-90">
            Get premium OEM quality parts with 12-month warranty and global shipping
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Request Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Main Content Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Table of Contents */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-900">Contents</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#introduction" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Market Overview</a>
                  <a href="#screen-parts" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Screen Components</a>
                  <a href="#battery-parts" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Battery Technology</a>
                  <a href="#camera-parts" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Camera & Sensors</a>
                  <a href="#comparison" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Original vs Compatible</a>
                  <a href="#pricing" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Price Analysis</a>
                  <a href="#suppliers" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Supplier Guide</a>
                  <a href="#guide" className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors">Quality Assurance</a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Introduction Section */}
            <section id="introduction" className="bg-gray-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Mobile Phone Repair Parts Market Overview
                </h2>
                <p className="text-lg text-gray-600">
                  Understanding the 2024 mobile repair market and the importance of quality parts selection
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Market Scale Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <TrendingUp className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Market Scale & Growth</h3>
                      <p className="text-gray-600">2024 Global Market Size</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Market Value</span>
                      <span className="text-2xl font-bold text-blue-600">$29.7B</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Annual Growth Rate</span>
                      <span className="text-lg font-semibold text-green-600">6.3% CAGR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Smartphone Repair Growth</span>
                      <span className="text-lg font-semibold text-orange-600">5% Yearly</span>
                    </div>
                  </div>
                </div>

                {/* Consumer Behavior Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <Users className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Consumer Behavior</h3>
                      <p className="text-gray-600">User Behavior Trends</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Prefer Repair Over Replacement</span>
                      <span className="text-2xl font-bold text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Support Right to Repair Legislation</span>
                      <span className="text-lg font-semibold text-blue-600">80%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Average Device Usage Period</span>
                      <span className="text-lg font-semibold text-purple-600">30+ months</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Drivers */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  2024 Market Growth Drivers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <TrendingUp className="text-2xl text-blue-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Increasing Device Complexity</h4>
                    <p className="text-gray-600 text-sm">
                      Advanced technologies like OLED displays and multi-lens camera systems require specialized repair expertise
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Shield className="text-2xl text-green-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Sustainability Awareness</h4>
                    <p className="text-gray-600 text-sm">
                      Environmental consciousness promoting circular economy models, consumers prefer extending device lifespan
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <CheckCircle className="text-2xl text-orange-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">DIY Repair Culture</h4>
                    <p className="text-gray-600 text-sm">
                      Online tutorials and e-commerce platforms development, self-repair becoming a trend
                    </p>
                  </div>
                </div>
              </div>

              {/* Why This Guide */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <Image
                      src="/images/news/repair-market-overview.jpg"
                      alt="Mobile repair parts market overview"
                      width={192}
                      height={128}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      Why Do You Need This Guide?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
                          <Shield className="text-red-600 w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Quality & Safety Risks</h4>
                          <p className="text-gray-600 text-sm">
                            Low-quality or uncertified parts may cause safety hazards like overheating and short circuits
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                          <TrendingUp className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Cost Optimization</h4>
                          <p className="text-gray-600 text-sm">
                            Different repair levels have significant price differences, professional parts can be costly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                          <Tag className="text-purple-600 w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Compatibility Challenges</h4>
                          <p className="text-gray-600 text-sm">
                            Different models and manufacturers have varying parts, mismatched parts may cause functionality issues
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8">
                <div className="flex items-start">
                  <div className="flex-1 mr-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      How This Guide Helps You
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Tag className="text-blue-500 w-5 h-5 mt-1 mr-3" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Quality Identification</h4>
                          <p className="text-gray-600 text-sm">
                            Learn to identify high-quality parts and avoid inferior products
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <TrendingUp className="text-green-500 w-5 h-5 mt-1 mr-3" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Cost vs Quality Trade-offs</h4>
                          <p className="text-gray-600 text-sm">
                            Balance cost and quality to make optimal value choices
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Shield className="text-purple-500 w-5 h-5 mt-1 mr-3" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Brand-Specific Insights</h4>
                          <p className="text-gray-600 text-sm">
                            Professional advice and considerations for different brands
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="text-orange-500 w-5 h-5 mt-1 mr-3" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Market Trends</h4>
                          <p className="text-gray-600 text-sm">
                            Understand latest market trends and consumer behavior changes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/news/phone-parts-collection.jpg"
                      alt="Mobile phone parts collection"
                      width={160}
                      height={128}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Screen Components Section */}
            <section id="screen-parts" className="bg-white rounded-2xl p-8 mb-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Mobile Screen Components Detailed Analysis
                </h2>
                <p className="text-lg text-gray-600">
                  In-depth understanding of various screen technologies, identification methods, and brand characteristics
                </p>
              </div>

              {/* Screen Technology Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <TrendingUp className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">LCD vs OLED Technology Comparison</h3>
                  </div>
                  <Image
                    src="/images/news/lcd-oled-comparison.jpg"
                    alt="LCD vs OLED technology comparison"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800 mb-2">Market Trends (2024)</h4>
                      <p className="text-sm text-gray-700">
                        OLED panels surpassed LCD for the first time, with Q1 shipments reaching 182 million units,
                        expected to reach 56% market share by Q3
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-1">OLED Advantages</h5>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Self-emissive, infinite contrast ratio</li>
                          <li>• High-frequency PWM dimming: 1920Hz</li>
                          <li>• Supports flexible design</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-orange-800 mb-1">LCD Characteristics</h5>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• DC dimming without flicker</li>
                          <li>• Mini LED technology upgrades</li>
                          <li>• Significant cost advantage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <Shield className="text-purple-600 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Screen Assembly Structure</h3>
                  </div>
                  <Image
                    src="/images/news/screen-assembly-structure.jpg"
                    alt="Screen assembly structure"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Three-Layer Structure Composition</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm font-medium">Protective Glass Layer</span>
                          <span className="text-xs text-gray-600">0.3mm tempered glass</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm font-medium">Touch Module</span>
                          <span className="text-xs text-gray-600">Integrated TDDI solution</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm font-medium">Display Module</span>
                          <span className="text-xs text-gray-600">LCD or OLED panel</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-indigo-800 mb-1">TDDI Technology Advantages</h5>
                      <p className="text-xs text-gray-700">
                        Display and touch integration design saves 0.2mm thickness, supports under-display fingerprint recognition
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Screen Features */}
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Mainstream Brand Screen Parts Characteristics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* iPhone Screen */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/images/news/iphone-screen-parts.jpg"
                    alt="iPhone screen components"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-100 p-2 rounded mr-3">
                        <Tag className="text-gray-600 text-xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">iPhone 2024 Models</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">XDR Pro 2.0 Technology</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Peak brightness 1600 nits</li>
                          <li>• Contrast ratio 1,000,000:1</li>
                          <li>• Screen-to-body ratio up to 94.5%</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">ProMotion 3.0</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• 1-120Hz adaptive refresh rate</li>
                          <li>• Gaming touch latency 2.8ms</li>
                          <li>• Anti-glare coating reflectivity &lt;0.5%</li>
                        </ul>
                      </div>
                      <div className="border-t pt-3">
                        <h6 className="font-semibold text-gray-800 mb-1">Common Issues</h6>
                        <p className="text-xs text-gray-600">
                          Cracked screens, touch failure, black screens, display abnormalities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Samsung Screen */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/images/news/samsung-screen.jpg"
                    alt="Samsung Galaxy screen"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded mr-3">
                        <TrendingUp className="text-blue-600 text-xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">Galaxy S24 Series</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-2">Gorilla Armor Technology</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• 75% improved anti-reflection capability</li>
                          <li>• 2600 nits peak brightness</li>
                          <li>• Four-sided black border design</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-yellow-800 mb-2">Vision Booster</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Dynamic brightness contrast adjustment</li>
                          <li>• DXOMARK 155 points global #1</li>
                          <li>• 1-120Hz adaptive refresh rate</li>
                        </ul>
                      </div>
                      <div className="border-t pt-3">
                        <h6 className="font-semibold text-gray-800 mb-1">Common Issues</h6>
                        <p className="text-xs text-gray-600">
                          Screen burn-in, cracked screens, touch failure, display abnormalities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Xiaomi Screen */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/images/news/xiaomi-screen.jpg"
                    alt="Xiaomi screen"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-orange-100 p-2 rounded mr-3">
                        <Users className="text-orange-600 text-xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">Xiaomi Series</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-orange-800 mb-2">Advanced Display Features</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• High-end OLED displays</li>
                          <li>• HDR10+ certification</li>
                          <li>• Professional color calibration</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Market Position</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Leading budget segment</li>
                          <li>• Premium features at lower cost</li>
                          <li>• Wide parts availability</li>
                        </ul>
                      </div>
                      <div className="border-t pt-3">
                        <h6 className="font-semibold text-gray-800 mb-1">Common Issues</h6>
                        <p className="text-xs text-gray-600">
                          Display inconsistencies, touch sensitivity issues, color accuracy problems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Section */}
            <div className="bg-gray-100 py-16">
              <div className="container mx-auto px-4 max-w-4xl text-center">
                <p className="text-gray-600 mb-6">
                  This is a preview of the complete guide. The full version includes detailed sections on:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <Shield className="text-green-600 w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Battery Components</h4>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <Tag className="text-purple-600 w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Camera & Sensors</h4>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <CheckCircle className="text-blue-600 w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Original vs Compatible</h4>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <TrendingUp className="text-orange-600 w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Price Analysis</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Source Quality Phone Repair Parts?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Partner with PRSPARES for OEM quality parts, competitive pricing, and reliable global shipping
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Request Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}