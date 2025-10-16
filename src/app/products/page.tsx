import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Mobile Repair Parts - PRSPARES',
  description: 'Browse our extensive catalog of high-quality mobile phone repair parts, including OEM screens, batteries, and components for all major brands.',
};

const productCategories = [
  {
    id: 'screens',
    title: 'Screen Replacements',
    subtitle: 'Premium Display Solutions',
    description: 'High-quality mobile screen assemblies with True Tone support, compatible with iPhone, Android, and all major brands',
    features: ['True Tone Support', 'TQC Quality Control', '1% Low RMA Rate', 'LCD/OLED Coverage'],
    href: '/products/screens',
    imageSrc: '/images/screens-hero.jpg',
    bgGradient: 'from-blue-500 to-blue-600',
    iconColor: 'text-blue-500'
  },
  {
    id: 'repair-tools',
    title: 'Repair Tools',
    subtitle: 'Professional Equipment',
    description: 'Complete professional repair tool sets including basic tools, programmers, motherboard repair equipment, and testing instruments',
    features: ['Professional Tool Sets', 'Programming Devices', 'Motherboard Tools', 'Testing Equipment'],
    href: '/products/repair-tools',
    imageSrc: '/images/repair-tools-hero.jpg',
    bgGradient: 'from-green-500 to-green-600',
    iconColor: 'text-green-500'
  },
  {
    id: 'batteries',
    title: 'Battery Replacements',
    subtitle: 'Certified Power Solutions',
    description: 'Safety-certified batteries for phones, tablets, laptops and more, meeting multiple international safety standards',
    features: ['Safety Certified', 'Original Capacity', 'High Capacity Options', 'Smart Device Support'],
    href: '/products/batteries',
    imageSrc: '/images/batteries-hero.jpg',
    bgGradient: 'from-orange-500 to-orange-600',
    iconColor: 'text-orange-500'
  },
  {
    id: 'small-parts',
    title: 'Small Components',
    subtitle: 'Complete Parts Supply',
    description: 'Comprehensive mobile component supply including cameras, charging ports, speakers, and various small parts',
    features: ['100% Inspection', 'Centralized Sourcing', 'Low RMA Rate', 'Full Category Coverage'],
    href: '/products/small-parts',
    imageSrc: '/images/small-parts-hero.jpg',
    bgGradient: 'from-purple-500 to-purple-600',
    iconColor: 'text-purple-500'
  }
];


export default function ProductsPage() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Mobile Repair Parts
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              Professional mobile repair parts supplier, offering comprehensive products including screens, batteries, repair tools, and small components
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                OEM Quality Guarantee
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Global Fast Shipping
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Professional Tech Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {productCategories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
            >
              {/* Background Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={category.imageSrc}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{objectFit: 'cover'}}
                  priority={index < 2}
                  className="group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.bgGradient} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                  <div className="transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-lg md:text-xl font-medium mb-3 opacity-90">
                      {category.subtitle}
                    </p>
                    <p className="text-sm md:text-base opacity-80 mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center text-white font-semibold group-hover:text-yellow-200 transition-colors">
                      <span className="mr-2">View Products</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We provide bulk purchasing, custom services, and technical support to meet your professional repair needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#00B140] hover:bg-[#008631] text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-colors border border-gray-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}