import Link from 'next/link';
import Image from 'next/image';

// Static, script-free migration (English only)
// No <script>, no inline events, no inline styles.

export const metadata = {
  title: 'Professional Mobile Phone Battery Guide | Bulk Selection, Warranty & iPad Battery Replacement',
  description:
    'Comprehensive mobile phone battery guide covering bulk selection strategies, warranty policies, and professional iPad battery replacement solutions.',
};

export default function MobilePhoneBatteryGuidePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header / Breadcrumb */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-green-700">News</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Mobile Phone Battery Guide</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/news/mobile-phone-battery-guide-cover.jpg"
            alt="Professional mobile phone battery guide cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Professional Mobile Phone Battery Guide
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-8">
              Comprehensive guide to bulk selection, warranty policies, and iPad battery replacement solutions
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">Battery Technology</span>
              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Bulk Procurement</span>
              <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">iPad Replacement</span>
              <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full">Warranty Guide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Overview</a>
                  <a href="#battery-types" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Battery Types & Technical Analysis</a>
                  <a href="#selection-factors" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Bulk Selection Key Factors</a>
                  <a href="#warranty" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Warranty Policy & Rights</a>
                  <a href="#ipad-replacement" className="block text-sm text-gray-600 hover:text-blue-600 py-1">iPad Battery Replacement Guide</a>
                  <a href="#maintenance" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Battery Usage & Maintenance</a>
                  <a href="#cost-analysis" className="block text-sm text-gray-600 hover:text-blue-600 py-1">Cost-Benefit Analysis</a>
                  <a href="#faq" className="block text-sm text-gray-600 hover:text-blue-600 py-1">FAQ & Troubleshooting</a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">

        {/* Overview Section */}
        <section id="overview" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Mobile Phone Battery Guide Overview</h2>
          
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-8 mb-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-blue-600 mr-3">🔋</span>
                    Energy Core of the Digital Age
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In the mobile internet era, phone batteries serve as the "heart" of devices, directly impacting user experience. With the proliferation of 5G technology and the rise of foldable devices, battery technology is undergoing unprecedented transformation.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This guide provides comprehensive analysis of battery technology evolution, bulk procurement strategies, warranty rights, and professional replacement solutions to help you make informed decisions in the complex battery market.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <Image 
                    src="/images/news/battery-technology.jpg" 
                    alt="Mobile phone battery technology" 
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technology Innovation Highlights */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Technology Innovation Highlights</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                  <span className="text-4xl text-blue-600 mb-3 block">🔬</span>
                  <h4 className="text-xl font-semibold text-gray-800">Silicon-Carbon Anode Revolution</h4>
                </div>
                <p className="text-gray-600 text-center">
                  By 2025, mainstream silicon content reaches 15%, with theoretical capacity of 4200mAh/g, enabling 6500-7000mAh high-capacity batteries.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                  <span className="text-4xl text-yellow-500 mb-3 block">⚡</span>
                  <h4 className="text-xl font-semibold text-gray-800">Ultra-Fast Charging Breakthrough</h4>
                </div>
                <p className="text-gray-600 text-center">
                  120W fast charging technology can fully charge a 7000mAh battery in 25 minutes, with Realme introducing 320W ultra-fast charging.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                  <span className="text-4xl text-green-600 mb-3 block">🛡️</span>
                  <h4 className="text-xl font-semibold text-gray-800">Solid-State Battery Validation</h4>
                </div>
                <p className="text-gray-600 text-center">
                  In 2025, companies like CATL begin validation, with semi-solid-state batteries already applied in mid-range phones.
                </p>
              </div>
            </div>
          </div>

          {/* Global Market Overview */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Global Market Overview</h3>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">2024 Market Size</h4>
                    <p className="text-2xl font-bold text-blue-600">$25.24 Billion</p>
                    <p className="text-gray-600 text-sm">Global mobile phone battery market size</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">2029 Projection</h4>
                    <p className="text-2xl font-bold text-yellow-600">$44 Billion</p>
                    <p className="text-gray-600 text-sm">5.6% compound annual growth rate</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-green-600">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Market Concentration</h4>
                    <p className="text-2xl font-bold text-green-600">82%</p>
                    <p className="text-gray-600 text-sm">ATL, LG, Samsung market share</p>
                  </div>
                </div>
                <div>
                  <Image 
                    src="/images/news/battery-market.jpg" 
                    alt="Global battery market analysis" 
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="text-center mb-16">
            <Link 
              href="/contact" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Quote for Battery Solutions
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* Battery Types Section */}
        <section id="battery-types" className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Battery Types & Technical Parameter Analysis</h2>
          
          {/* Battery Type Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl text-blue-600">🔋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Lithium-Ion Battery (Li-ion)</h3>
              </div>
              <Image 
                src="/images/news/lithium-ion-battery.jpg" 
                alt="Lithium-ion battery structure" 
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Liquid electrolyte, rigid metal casing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Energy density: 250-300 Wh/L</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Cycle life: 500-1000 cycles</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">$</span>
                  <span className="text-gray-700">Relatively lower cost</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl text-purple-600">🔋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Lithium Polymer Battery (Li-Po)</h3>
              </div>
              <Image 
                src="/images/news/lithium-polymer-battery.jpg" 
                alt="Lithium polymer battery" 
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Gel/solid electrolyte, soft pouch packaging</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Mass energy density: 200-250 Wh/kg</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">🛡️</span>
                  <span className="text-gray-700">Higher safety, 60% lower combustion risk</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">↑</span>
                  <span className="text-gray-700">Cost premium 10-30%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Parameter Comparison Table */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center">
              <span className="text-blue-600 mr-3">📊</span>Core Technical Parameter Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 border-b font-semibold">Technical Parameter</th>
                    <th className="text-center p-4 border-b font-semibold">Lithium-Ion (Li-ion)</th>
                    <th className="text-center p-4 border-b font-semibold">Lithium Polymer (Li-Po)</th>
                    <th className="text-center p-4 border-b font-semibold">Advantage Comparison</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Energy Density</td>
                    <td className="text-center p-4">250-300 Wh/L</td>
                    <td className="text-center p-4">200-250 Wh/kg</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Li-ion Volume Advantage</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Nominal Voltage</td>
                    <td className="text-center p-4">3.6V/3.7V</td>
                    <td className="text-center p-4">3.7V</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Similar</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Operating Voltage Range</td>
                    <td className="text-center p-4">3.0V-4.2V</td>
                    <td className="text-center p-4">2.5V-4.2V</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Li-Po Wider Range</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Typical Capacity</td>
                    <td className="text-center p-4">2000-5000mAh</td>
                    <td className="text-center p-4">3000-7000mAh</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Li-Po Higher Capacity</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Cycle Life</td>
                    <td className="text-center p-4">500-1000 cycles</td>
                    <td className="text-center p-4">300-800 cycles</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Li-ion Longer Life</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Safety Performance</td>
                    <td className="text-center p-4">Medium</td>
                    <td className="text-center p-4">Higher</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Li-Po Safer</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Relative Cost</td>
                    <td className="text-center p-4">Lower</td>
                    <td className="text-center p-4">Higher (+10-30%)</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Li-ion More Economic</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bulk Selection Factors */}
        <section id="selection-factors" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Considerations for Bulk Battery Selection</h2>

          {/* Introduction */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              In the digital age, bulk procurement of mobile phone batteries has become a key component of enterprise operations. From supplier qualifications to technical certifications, every detail directly impacts product quality and user experience. This section provides in-depth analysis of core elements in bulk procurement.
            </p>
          </div>

          {/* Core Consideration Factors Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="text-blue-600 text-4xl mb-4 text-center">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Safety Certification</h3>
              <p className="text-gray-700 text-center">International certification standards like UL, CE, CCC are fundamental guarantees for product safety</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="text-green-600 text-4xl mb-4 text-center">🏭</div>
              <h3 className="text-xl font-bold mb-3 text-green-800 text-center">Supplier Qualifications</h3>
              <p className="text-gray-700 text-center">ISO 9001 quality system and production capacity assessment are the foundation of cooperation</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="text-purple-600 text-4xl mb-4 text-center">⚖️</div>
              <h3 className="text-xl font-bold mb-3 text-purple-800 text-center">Price-Quality Balance</h3>
              <p className="text-gray-700 text-center">Establish total lifecycle cost model to achieve optimal value allocation</p>
            </div>
          </div>

          {/* Supplier Qualification Assessment */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center">
              <span className="text-blue-600 mr-3">📋</span>Supplier Qualification Assessment System
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/news/battery-supplier-factory.jpg"
                  alt="Battery supplier factory"
                  width={500}
                  height={300}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <h4 className="text-xl font-bold mb-3 text-blue-800 flex items-center">
                    <span className="mr-2">✅</span>Quality System Audit
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>ISO 9001 quality management system certification</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Production manufacturing and process standardization</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Supplier quality management and storage/transport compliance</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                  <h4 className="text-xl font-bold mb-3 text-green-800 flex items-center">
                    <span className="mr-2">⚙️</span>Product System Audit
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Key material inspection (battery cells, BMS chips)</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Key process quality control (welding, packaging processes)</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Finished product full inspection and laboratory reliability testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* International Safety Certification Standards */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center">
              <span className="text-yellow-500 mr-3">🏆</span>International Safety Certification Standards
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-l-4 border-red-500">
                  <h4 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                    <span className="mr-3">🇺🇸</span>UL Certification Standards
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>Applicable Standards:</strong> UL 1642 (lithium battery cells), UL 2054 (commercial batteries)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-orange-500 mr-1">🔨</span>Mechanical Testing
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-yellow-500 mr-1">⚡</span>Electrical Testing
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-blue-500 mr-1">🌡️</span>Environmental Testing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <h4 className="text-xl font-bold mb-4 text-blue-800 flex items-center">
                    <span className="mr-3">🇪🇺</span>CE Certification Standards
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>Regulatory Background:</strong> 2023 EU Battery Regulation mandates CE marking</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-green-500 mr-1">🛡️</span>Electrical Safety
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-gray-500 mr-1">⚙️</span>Mechanical Safety
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <span className="text-green-600 mr-1">🌿</span>Environmental Adaptability
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Image
                  src="/images/news/battery-safety-certification.jpg"
                  alt="Battery safety certification"
                  width={500}
                  height={300}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2025 Technology Trends */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
              <span className="mr-3">🚀</span>2025 Technology Development Trends
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h4 className="font-bold mb-2">Silicon-Carbon Anode Breakthrough</h4>
                <p className="text-sm opacity-90">Capacity reaches 7000mAh+, energy density 859Wh/L</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧊</span>
                </div>
                <h4 className="font-bold mb-2">Solid-State Battery Industrialization</h4>
                <p className="text-sm opacity-90">Semi-solid-state already applied, full solid-state expected mass production in 2027</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-bold mb-2">Fast Charging Technology Upgrade</h4>
                <p className="text-sm opacity-90">100W+ popularization, gallium nitride technology application</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛤️</span>
                </div>
                <h4 className="font-bold mb-2">Multi-Technology Routes</h4>
                <p className="text-sm opacity-90">LiFePO4 reaches 250Wh/kg, sodium-ion 30% cost reduction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Warranty Policy & Rights Section */}
        <section id="warranty" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Warranty Policy & Consumer Rights Analysis</h2>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Global Warranty Standards Overview</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Understanding warranty policies and consumer rights is crucial for bulk battery procurement. Different regions have varying standards and requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-red-600 mr-2">🇨🇳</span>China Standards
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• GB 31241-2022 mandatory implementation</li>
                  <li>• CCC certification required from August 2024</li>
                  <li>• 12-month minimum warranty period</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-blue-600 mr-2">🇺🇸</span>US Standards
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• UL 1642/2054 certification required</li>
                  <li>• FTC warranty disclosure rules</li>
                  <li>• State-level lemon laws apply</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-green-600 mr-2">🇪🇺</span>EU Standards
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 2-year legal guarantee minimum</li>
                  <li>• CE marking mandatory</li>
                  <li>• WEEE directive compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* iPad Battery Replacement Guide */}
        <section id="ipad-replacement" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Professional iPad Battery Replacement Guide</h2>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/news/ipad-battery-replacement.jpg"
                  alt="iPad battery replacement process"
                  width={500}
                  height={300}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Cost Comparison Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-800">Official Apple Service</h4>
                      <p className="text-sm text-gray-600">Authorized repair centers</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">$120</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-800">Third-party Professional</h4>
                      <p className="text-sm text-gray-600">Certified repair shops</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">$45-85</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-orange-800">DIY Replacement</h4>
                      <p className="text-sm text-gray-600">Self-service with tools</p>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">$25-45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Battery Usage & Maintenance */}
        <section id="maintenance" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Battery Usage & Maintenance Best Practices</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">✅</span>Best Practices
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Keep battery charge between 20-80% for optimal lifespan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Avoid extreme temperatures (below 0°C or above 35°C)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Use original or certified chargers for fast charging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Enable battery optimization features in device settings</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">❌</span>Common Mistakes
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>Leaving device plugged in overnight regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>Using device while fast charging frequently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>Letting battery drain to 0% regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>Exposing device to direct sunlight while charging</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cost-Benefit Analysis */}
        <section id="cost-analysis" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Comprehensive Cost-Benefit Analysis</h2>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Total Cost of Ownership (TCO) Model</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Procurement Cost</span>
                    <span className="font-bold text-green-600">40-50%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Warranty Cost</span>
                    <span className="font-bold text-blue-600">20-25%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Maintenance Cost</span>
                    <span className="font-bold text-orange-600">15-20%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Storage & Logistics</span>
                    <span className="font-bold text-purple-600">10-15%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Volume Pricing Strategy</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                    <div className="flex justify-between">
                      <span>1,000-5,000 units</span>
                      <span className="font-bold">Base Price</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                    <div className="flex justify-between">
                      <span>5,000-20,000 units</span>
                      <span className="font-bold">8-12% Discount</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                    <div className="flex justify-between">
                      <span>20,000+ units</span>
                      <span className="font-bold">15-20% Discount</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Q: How do I determine the right battery capacity for bulk orders?</h3>
              <p className="text-gray-600">A: Consider your target device specifications, user usage patterns, and market positioning. For flagship devices, aim for 4500-6000mAh capacity. For mid-range devices, 3500-4500mAh is typically sufficient.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Q: What certifications are absolutely necessary for international sales?</h3>
              <p className="text-gray-600">A: UL certification for US markets, CE marking for EU, CCC for China, and UN38.3 for international shipping. PSE certification is required for Japan, and KC certification for South Korea.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Q: How can I verify supplier quality before placing large orders?</h3>
              <p className="text-gray-600">A: Request sample testing, conduct factory audits, verify certifications, check references from existing customers, and start with smaller trial orders to assess quality consistency.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Q: What's the typical warranty period for bulk battery purchases?</h3>
              <p className="text-gray-600">A: Standard warranty ranges from 12-24 months depending on the supplier and battery type. Premium suppliers often offer extended warranties up to 36 months for large volume orders.</p>
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <div className="text-center mb-16">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Our Battery Products
            <span className="ml-2">→</span>
          </Link>
        </div>

        </div> {/* End of main content area */}
        </div> {/* End of flex container */}
      </div>
    </main>
  );
}
