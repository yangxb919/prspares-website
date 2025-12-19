'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Clock, Award, Star, Users, MapPin, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import InquiryModal from '@/components/InquiryModal';
import LatestBlogPosts from '@/components/features/LatestBlogPosts';

// Animation Components
const FadeInSection = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay]);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const CountUpNumber = ({ end, duration = 2000 }: { end: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));
          let start = 0;
          const increment = numericEnd / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= numericEnd) {
              setCount(numericEnd);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, end, duration, isVisible]);

  const formatNumber = (num: number) => {
    if (end.includes('+')) {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
      return `${num}+`;
    }
    if (end.includes('%')) return `${num}%`;
    return num.toString();
  };

  return (
    <div ref={setRef} className="text-3xl font-bold text-[#00B140] mb-2">
      {formatNumber(count)}
    </div>
  );
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    {
      src: '/warehouse-organized-shelves-inventory.png',
      alt: 'PRSPARES Warehouse - Organized shelves with 500+ SKUs mobile phone parts inventory in Shenzhen Huaqiangbei',
      caption: '500+ SKUs Organized Inventory'
    },
    {
      src: '/warehouse-packing-station-orders.png',
      alt: 'Fast packing and shipping station - Same day dispatch for mobile parts orders',
      caption: 'Fast Order Processing & Packing'
    },
    {
      src: '/shipping-boxes-courier-delivery.png',
      alt: 'DHL FedEx express shipping - International courier delivery to 50+ countries',
      caption: 'Express Shipping Worldwide'
    },
    {
      src: '/mobile-parts-complete-sku-coverage.png',
      alt: 'Complete mobile parts SKU coverage - iPhone Samsung Huawei Xiaomi OPPO Vivo',
      caption: 'All Major Brands Available'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);



  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section - Trading Company Version */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden py-12 md:py-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="relative z-10 container mx-auto px-4 max-w-7xl">

          {/* Top Badge - Centered Above Content */}
          <div className={`text-center mb-8 lg:mb-12 transition-all duration-1500 delay-300 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <span className="inline-flex items-center gap-2 bg-white border-2 border-[#00B140] text-[#00B140] px-6 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:bg-[#00B140] hover:text-white transition-all duration-300 hover:scale-105">
              <span className="text-base">🏢</span>
              <span>SHENZHEN HUAQIANGBEI TRADING COMPANY</span>
            </span>
          </div>

          {/* Main Title - Centered Above Content */}
          <h1 className={`text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-[1.15] transition-all duration-1500 delay-500 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-gray-900">
              One-Stop Mobile Parts Wholesaler
            </span>
            <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00B140] to-[#00D155] bg-clip-text text-transparent">
              Serving 10,000+ Repair Shops Worldwide
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-8 lg:mt-12">

            {/* Left Side - 55% Warehouse Images Carousel */}
            <div className={`order-2 lg:order-1 transition-all duration-2000 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
                {/* Image Carousel */}
                <div className="absolute inset-0">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Floating Stock Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-900">500+ SKUs In Stock</span>
                  </div>
                </div>

                {/* Bottom Info Card with Caption */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl z-10">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{carouselImages[currentImageIndex].caption}</p>
                  <p className="text-xs text-gray-600">Real warehouse inventory in Shenzhen Huaqiangbei Electronics Market</p>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentImageIndex
                          ? 'bg-white w-8 h-2'
                          : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Small Image Gallery - Clickable Thumbnails */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {carouselImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                      index === currentImageIndex ? 'ring-4 ring-[#00B140]' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - 45% Value Propositions */}
            <div className={`order-1 lg:order-2 transition-all duration-2000 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Subtitle */}
              <div className={`mb-8 transition-all duration-1500 delay-700 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="bg-gradient-to-r from-[#00B140]/10 to-[#00D155]/10 border-l-4 border-[#00B140] rounded-r-xl p-4 mb-4">
                  <p className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed">
                    📱 From iPhone 6 to iPhone 15 • Samsung S to Z Series • All Major Brands
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 bg-[#00B140] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    <span>✓</span> 500+ SKUs in Stock
                  </span>
                  <span className="inline-flex items-center gap-2 bg-[#00B140] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    <span>✓</span> Mix Orders Welcome
                  </span>
                  <span className="inline-flex items-center gap-2 bg-[#00B140] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    <span>✓</span> Ship Same Day
                  </span>
                </div>
              </div>

              {/* 4 Core Data Cards */}
              <div className={`grid grid-cols-2 gap-3 md:gap-4 mb-8 transition-all duration-1500 delay-900 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {[
                  {
                    icon: '📱',
                    title: '500+ SKUs',
                    subtitle: 'Complete Coverage',
                    description: 'iPhone, Samsung, Huawei, Xiaomi, OPPO, Vivo',
                    color: 'from-blue-50 to-blue-100',
                    borderColor: 'border-blue-300',
                    iconBg: 'bg-blue-500'
                  },
                  {
                    icon: '📦',
                    title: '95%+ In-Stock',
                    subtitle: 'Availability',
                    description: 'No Backorder Delays',
                    color: 'from-green-50 to-green-100',
                    borderColor: 'border-green-300',
                    iconBg: 'bg-green-500'
                  },
                  {
                    icon: '⚡',
                    title: 'Same-Day Ship',
                    subtitle: 'Fast Shipping',
                    description: 'DHL 3-7 days global',
                    color: 'from-yellow-50 to-yellow-100',
                    borderColor: 'border-yellow-300',
                    iconBg: 'bg-yellow-500'
                  },
                  {
                    icon: '💰',
                    title: 'From 10pcs',
                    subtitle: 'Flexible MOQ',
                    description: 'Small Shop Friendly',
                    color: 'from-purple-50 to-purple-100',
                    borderColor: 'border-purple-300',
                    iconBg: 'bg-purple-500'
                  }
                ].map((card, index) => (
                  <div key={index} className={`bg-gradient-to-br ${card.color} p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${card.borderColor} hover:scale-105 group relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-16 h-16 ${card.iconBg} opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className="relative">
                      <div className="text-3xl mb-2">{card.icon}</div>
                      <div className="font-black text-base md:text-lg text-gray-900 mb-1">
                        {card.title}
                      </div>
                      <div className="text-xs md:text-sm font-bold text-gray-700 mb-2">
                        {card.subtitle}
                      </div>
                      <div className="text-xs text-gray-600 leading-snug">
                        {card.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className={`flex flex-col gap-3 mb-6 transition-all duration-1500 delay-1100 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Primary CTA - Full Width */}
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="group w-full bg-gradient-to-r from-[#00B140] to-[#00D155] hover:from-[#008631] hover:to-[#00B140] text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center text-sm md:text-base shadow-2xl hover:shadow-[#00B140]/50 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="mr-2">🔍</span>
                  <span>Check Stock & Get Quote</span>
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Secondary CTAs - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/8618588999234?text=Hi,%20I'm%20interested%20in%20your%20mobile%20parts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white hover:bg-[#25D366] text-gray-900 hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-500 flex items-center justify-center text-sm shadow-lg hover:shadow-2xl border-2 border-[#25D366] transform hover:-translate-y-1"
                  >
                    <Phone size={16} className="mr-2" />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    href="/products"
                    className="group bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all duration-500 flex items-center justify-center text-sm shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300 transform hover:-translate-y-1"
                  >
                    <span className="mr-2">📦</span>
                    <span>Browse 500+ SKUs</span>
                  </Link>
                </div>
              </div>

              {/* Trust Indicators - Trading Style */}
              <div className={`bg-gradient-to-r from-gray-50 to-white rounded-2xl p-5 border border-gray-200 transition-all duration-1500 delay-1300 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: CheckCircle, text: '10 Years in Huaqiangbei' },
                    { icon: Shield, text: '95%+ In-Stock Rate' },
                    { icon: Clock, text: 'Same-Day Shipping' },
                    { icon: Award, text: 'Every Batch Tested' },
                    { icon: Users, text: 'MOQ from 10pcs' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-800 group hover:text-[#00B140] transition-colors duration-300">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#00B140] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="text-white" size={14} />
                      </div>
                      <span className="text-xs font-semibold">✓ {item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Advantages - Trading Company Version */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-[#00B140]/5 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Why Choose PRSPARES as Your Sourcing Partner?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                <strong className="text-gray-900">10 Years in Shenzhen Huaqiangbei Electronics Market</strong><br />
                Your Trusted One-Stop Mobile Parts Wholesaler
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {[
              {
                icon: '📱',
                title: 'SKU Coverage',
                stat: '500+ SKUs',
                description: 'Complete model coverage from iPhone 6 to iPhone 15, Samsung, Huawei, Xiaomi, OPPO, Vivo - all major brands',
                features: ['iPhone 6-15 Series', 'Samsung Galaxy All Series', 'All Chinese Brands'],
                delay: 0
              },
              {
                icon: '📦',
                title: 'Stock Sufficient',
                stat: '95% Rate',
                description: 'Real-time inventory updated daily. 95%+ in-stock rate on popular models. No backorder delays.',
                features: ['Real Warehouse Stock', 'Updated Daily', '24-48h Restocking'],
                delay: 200
              },
              {
                icon: '⚡',
                title: 'Fast Shipping',
                stat: 'Same Day',
                description: 'Order before 3PM, ship same day. Located in Huaqiangbei - can restock any part within hours.',
                features: ['DHL/FedEx Express', '3-7 Days Global', 'Full Insurance'],
                delay: 400
              },
              {
                icon: '💰',
                title: 'Small Order Friendly',
                stat: '10pcs MOQ',
                description: 'Mix & match orders welcome. No minimum order value. Credit terms for regular customers.',
                features: ['MOQ from 10pcs', 'Mix Different Models', 'Flexible Payment'],
                delay: 600
              }
            ].map((advantage, index) => (
              <FadeInSection key={index} delay={advantage.delay}>
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#00B140]/30 transform hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00B140] to-[#00D155] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{advantage.icon}</div>
                    <div className="text-2xl font-black text-[#00B140] mb-1 group-hover:text-[#00D155] transition-colors">
                      {advantage.stat}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {advantage.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center flex-grow">
                    {advantage.description}
                  </p>

                  <ul className="space-y-2 mt-auto">
                    {advantage.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300 text-xs">
                        <CheckCircle className="w-3 h-3 text-[#00B140] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Huaqiangbei Advantage Banner */}
          <FadeInSection delay={800}>
            <div className="mt-16 bg-gradient-to-r from-[#00B140] to-[#00D155] rounded-3xl p-10 text-white shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-black mb-4">📍 Shenzhen Huaqiangbei Advantage</h3>
                  <p className="text-lg mb-6 opacity-95">
                    Why Location Matters in Mobile Parts Business
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                      <span><strong>10,000+ electronics vendors</strong> in walking distance - if we don't have it, we can get it within hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                      <span><strong>Best Prices</strong> - direct access to source, no middleman markup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                      <span><strong>Latest Products</strong> - new iPhone launched? Parts available same week</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-6xl mb-4">🏢</div>
                    <div className="text-4xl font-black mb-2">10 Years</div>
                    <div className="text-xl opacity-90">In Huaqiangbei Market</div>
                    <div className="text-sm opacity-80 mt-4">The Silicon Valley of Hardware</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Shop by Category - 500+ SKUs in Stock
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Complete Mobile Parts Coverage • iPhone to Android • All Models • Mix & Match Orders Welcome
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'LCD & OLED Screens',
                image: 'prspares-mobile-phone-lcd-oled-display-screens-replacement-parts.jpg',
                count: '500+',
                description: 'Complete screen coverage for iPhone, Samsung, Huawei, Xiaomi - All grades available (Original/OEM/Copy) with quality guarantee',
                features: ['iPhone 6-15 All Models', 'Samsung Galaxy Series', 'Huawei P/Mate Series', 'Xiaomi Mi/Redmi'],
                delay: 0,
                link: '/products/screens'
              },
              {
                name: 'Phone Batteries',
                image: 'prspares-smartphone-battery-high-capacity-lithium-original-replacement.jpg',
                count: '300+',
                description: 'High-capacity replacement batteries in stock - Original capacity & enhanced versions for all major brands with safety certification',
                features: ['Original Capacity', 'Safety Certified', 'All Major Brands', 'In Stock Ready'],
                delay: 150,
                link: '/products/batteries'
              },
              {
                name: 'Cameras & Small Parts',
                image: 'prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg',
                count: '800+',
                description: 'Complete range of smartphone components - Rear cameras, speakers, charging ports, flex cables for all popular models',
                features: ['Rear Camera Modules', 'Charging Ports', 'Speaker Components', 'Flex Cables'],
                delay: 300,
                link: '/products/iphone-rear-camera-wholesale'
              },
              {
                name: 'Repair Tools & Equipment',
                image: 'prspares-professional-phone-repair-tools-screwdriver-heat-gun-equipment.jpg',
                count: '100+',
                description: 'Professional repair tools in stock - Complete toolkits, opening tools, heat guns, and specialized equipment for phone repair',
                features: ['Screwdriver Sets', 'Opening Tool Kits', 'Heat Guns', 'Suction Cups'],
                delay: 450,
                link: '/products/repair-tools'
              }
            ].map((category, index) => (
              <FadeInSection key={index} delay={category.delay} className="h-full">
                <Link href={category.link} className="group cursor-pointer h-full block">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#00B140]/30 transform hover:-translate-y-3 h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={`/${category.image}`}
                        alt={`${category.name} - Professional mobile repair parts from PRSPARES`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-[#00B140] to-[#00D155] text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                        {category.count}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-black text-2xl text-white mb-2 group-hover:text-[#00D155] transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <p className="text-gray-600 text-base mb-6 leading-relaxed flex-grow">
                        {category.description}
                      </p>

                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-2">
                          {category.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                              <div className="w-1.5 h-1.5 bg-[#00B140] rounded-full mr-2 flex-shrink-0"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-[#00B140] font-semibold group-hover:text-[#00D155] transition-colors duration-300">
                          {category.name}
                        </span>
                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#00B140] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <ArrowRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={800}>
            <div className="text-center mt-16">
              <Link
                href="/products"
                className="inline-flex items-center bg-gradient-to-r from-[#00B140] to-[#00D155] hover:from-[#008631] hover:to-[#00B140] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-500 text-lg shadow-2xl hover:shadow-[#00B140]/50 transform hover:-translate-y-2 hover:scale-105"
              >
                View All Products <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Social Proof and Success Stories */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-[#00B140]/3 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Trusted by Global Repair Experts
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Join thousands of successful repair shops and technicians who trust us to grow their business
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 items-stretch">
            {[
              { number: '10000+', label: 'Partner Repair Shops', icon: Users, delay: 0 },
              { number: '1000000+', label: 'Parts Sold Worldwide', icon: Award, delay: 200 },
              { number: '50+', label: 'Countries Served', icon: MapPin, delay: 400 },
              { number: '99.8%', label: 'Customer Satisfaction', icon: Star, delay: 600 }
            ].map((stat, index) => (
              <FadeInSection key={index} delay={stat.delay}>
                <div className="text-center group h-full">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-[#00B140]/30 transform hover:-translate-y-2 h-full flex flex-col">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00B140]/10 to-[#00D155]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="text-[#00B140] group-hover:text-[#00D155] transition-colors duration-300" size={40} />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <CountUpNumber end={stat.number} />
                      <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {[
              {
                name: 'Marcus Johnson',
                role: 'Mobile Repair Shop Owner, London UK',
                content: 'Outstanding quality and incredibly fast international shipping. PRSPARES has become our go-to supplier for all OEM parts. Their technical support is exceptional.',
                rating: 5,
                avatar: '/avatars/prspares-customer-marcus-johnson-mobile-repair-shop-owner-london-uk-testimonial.jpg',
                delay: 0
              },
              {
                name: 'Hiroshi Tanaka',
                role: 'Electronics Repair Chain, Tokyo Japan',
                content: 'Reliable partner for authentic mobile parts. Their quality control is excellent and delivery to Japan is always on time. Highly recommended!',
                rating: 5,
                avatar: '/avatars/prspares-customer-hiroshi-tanaka-electronics-repair-chain-tokyo-japan-testimonial.jpg',
                delay: 200
              },
              {
                name: 'Klaus Mueller',
                role: 'Smartphone Repair Specialist, Berlin Germany',
                content: 'Professional service and genuine OEM components. PRSPARES understands European market needs perfectly. Their parts quality is consistently excellent.',
                rating: 5,
                avatar: '/avatars/prspares-customer-klaus-mueller-smartphone-repair-specialist-berlin-germany-testimonial.jpg',
                delay: 400
              }
            ].map((review, index) => (
              <FadeInSection key={index} delay={review.delay}>
                <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-[#00B140]/30 transform hover:-translate-y-2 group h-full flex flex-col">
                  <div className="flex items-center mb-8">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current hover:scale-125 transition-transform duration-200" size={20} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg italic flex-grow">
                    "{review.content}"
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={review.avatar}
                        alt={`${review.name} customer testimonial - ${review.role} - PRSPARES mobile repair parts review`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900">{review.name}</div>
                      <div className="text-gray-500">{review.role}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Articles */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Industry Insights & Expert Knowledge
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Stay updated with the latest trends, sourcing strategies, and quality control tips for mobile phone parts wholesale
              </p>
            </div>
          </FadeInSection>

          <LatestBlogPosts />

          <FadeInSection delay={600}>
            <div className="text-center mt-16">
              <Link
                href="/blog"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#00B140] to-[#00D155] text-white font-bold rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Read More Articles
                <ArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300" size={24} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Powerful Call to Action */}
      <section className="py-24 bg-gradient-to-br from-[#00B140] via-[#00C145] to-[#00D155] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl text-center relative">
          <FadeInSection>
            <div className="mb-16">
              <h2 className="text-6xl font-black mb-8 leading-tight">
                Ready to Transform Your Repair Business?
              </h2>
              <p className="text-2xl mb-12 opacity-95 max-w-4xl mx-auto leading-relaxed">
                Join thousands of successful repair professionals who trust us for premium parts and exceptional service
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="group bg-white text-[#00B140] px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center text-lg shadow-2xl hover:shadow-white/20 transform hover:-translate-y-2 hover:scale-105"
              >
                Request Quote
                <Send className="ml-3 transform group-hover:rotate-12 transition-transform duration-300" size={24} />
              </button>
              <Link
                href="/products"
                className="group border-3 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-[#00B140] transition-all duration-300 flex items-center text-lg transform hover:-translate-y-2 hover:scale-105"
              >
                Browse Products
                <ArrowRight className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Free Shipping',
                subtitle: 'Orders over $100',
                icon: '🚚',
                delay: 300
              },
              {
                title: '90-Day Warranty',
                subtitle: 'All genuine parts',
                icon: '🛡️',
                delay: 400
              },
              {
                title: '24/7 Support',
                subtitle: 'Expert technical assistance',
                icon: '🎧',
                delay: 500
              }
            ].map((feature, index) => (
              <FadeInSection key={index} delay={feature.delay}>
                <div className="group text-center transform hover:-translate-y-3 transition-all duration-500">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="text-2xl font-bold mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                      {feature.title}
                    </div>
                    <div className="opacity-90 text-lg">
                      {feature.subtitle}
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />


    </main>
  );
}
