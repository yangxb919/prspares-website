'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Clock, Award, Star, Users, MapPin, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import InquiryModal from '@/components/InquiryModal';
import LatestBlogPosts from '@/components/features/LatestBlogPosts';

// 动画组件
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

  useEffect(() => {
    setIsLoaded(true);
  }, []);



  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg"
            alt="PRSPARES Professional Mobile Repair Parts - OEM Quality Components and Expert Technical Support"
            fill
            className="object-cover scale-105 hover:scale-110 transition-transform duration-[3000ms] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#00B140]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          <div className={`max-w-4xl transition-all duration-2000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className={`mb-6 transition-all duration-1500 delay-300 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <span className="inline-block bg-gradient-to-r from-[#00B140] to-[#00D155] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                ⚡ TRUSTED BY 10,000+ REPAIR SHOPS
              </span>
            </div>

            <h1 className={`text-6xl md:text-7xl font-black text-white mb-8 leading-tight transition-all duration-1500 delay-500 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Transform Your
              <span className="bg-gradient-to-r from-[#00B140] to-[#00D155] bg-clip-text text-transparent block hover:from-[#00D155] hover:to-[#00B140] transition-all duration-1000">
                Repair Business
              </span>
            </h1>

            <p className={`text-2xl md:text-3xl text-white/95 mb-12 leading-relaxed font-light transition-all duration-1500 delay-700 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              From Shenzhen Huaqiangbei to the World • Premium OEM Parts
              <br />
              <span className="text-[#00D155] font-medium">Boost Your Profits • Delight Your Customers • Grow Your Reputation</span>
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 mb-12 transition-all duration-1500 delay-1000 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Link
                href="/products"
                className="group bg-gradient-to-r from-[#00B140] to-[#00D155] hover:from-[#008631] hover:to-[#00B140] text-white font-bold py-5 px-10 rounded-xl transition-all duration-500 flex items-center justify-center text-xl shadow-2xl hover:shadow-[#00B140]/50 transform hover:-translate-y-2 hover:scale-105"
              >
                Browse Products
                <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="group bg-white/15 backdrop-blur-md border-2 border-white/30 hover:bg-white hover:text-gray-900 text-white font-bold py-5 px-10 rounded-xl transition-all duration-500 flex items-center justify-center text-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Request Quote
                <Send size={24} className="ml-3 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={`flex flex-wrap gap-8 text-white/90 transition-all duration-1500 delay-1200 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {[
                { icon: CheckCircle, text: 'Decade of Excellence' },
                { icon: Shield, text: 'Guaranteed Authentic' },
                { icon: Clock, text: 'Lightning Fast Delivery' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 group hover:text-[#00D155] transition-colors duration-300">
                  <item.icon className="text-[#00B140] group-hover:text-[#00D155] group-hover:scale-110 transition-all duration-300" size={24} />
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 优雅的浮动效果 */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00B140]/60 rounded-full gentle-float"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${25 + Math.random() * 50}%`,
                animationDelay: `${Math.random() * 6}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-[#00B140]/5 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Why Choose PRSPARES?
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                More than just a parts supplier - we're your trusted partner for repair business success
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                icon: Shield,
                title: 'OEM Quality Guarantee',
                description: 'Direct partnerships with brand manufacturers. Every part undergoes strict quality control with authenticity certificates and warranty service.',
                features: ['Apple, Samsung, Huawei & More', 'Factory Quality Assurance', '90-Day Warranty Promise'],
                delay: 0
              },
              {
                icon: Clock,
                title: 'Lightning Fast Shipping',
                description: 'In-stock inventory with same-day shipping. Domestic delivery in 2-3 days, international shipping in 7-15 days.',
                features: ['Physical Warehouse Stock', 'Global Express Network', 'Real-Time Tracking'],
                delay: 200
              },
              {
                icon: Users,
                title: 'Expert Technical Support',
                description: '10+ years repair experience team providing professional guidance, repair tutorials, and troubleshooting support.',
                features: ['24/7 Online Support', 'Free Technical Guidance', 'Professional Tool Recommendations'],
                delay: 400
              }
            ].map((advantage, index) => (
              <FadeInSection key={index} delay={advantage.delay}>
                <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#00B140]/30 transform hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00B140] to-[#00D155] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                  <div className="w-20 h-20 bg-gradient-to-br from-[#00B140]/10 to-[#00D155]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <advantage.icon className="text-[#00B140] group-hover:text-[#00D155] transition-colors duration-300" size={40} />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300 text-center">
                    {advantage.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed text-center flex-grow">
                    {advantage.description}
                  </p>

                  <ul className="space-y-3 mt-auto">
                    {advantage.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300 text-sm">
                        <div className="w-2 h-2 bg-[#00B140] rounded-full mr-3 group-hover:bg-[#00D155] transition-colors duration-300 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Popular Product Categories
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Covering all major brands to meet every repair need
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Phone LCD',
                image: 'prspares-mobile-phone-lcd-oled-display-screens-replacement-parts.jpg',
                count: '500+',
                description: 'Premium OLED & LCD displays for iPhone, Samsung, Huawei and all major brands',
                features: ['iPhone Series', 'Samsung Galaxy', 'Huawei P/Mate', 'Xiaomi Mi'],
                delay: 0,
                link: '/products/screens'
              },
              {
                name: 'Phone Battery',
                image: 'prspares-smartphone-battery-high-capacity-lithium-original-replacement.jpg',
                count: '300+',
                description: 'High-capacity lithium batteries with original specifications and safety certifications',
                features: ['Original Capacity', 'Safety Certified', 'Long Lifespan', 'Easy Installation'],
                delay: 150,
                link: '/products/batteries'
              },
              {
                name: 'Phone Parts',
                image: 'prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg',
                count: '800+',
                description: 'Complete range of smartphone components including cameras, speakers, charging ports',
                features: ['Camera Modules', 'Charging Ports', 'Speakers', 'Flex Cables'],
                delay: 300,
                link: '/products/small-parts'
              },
              {
                name: 'Phone Repair Tools',
                image: 'prspares-professional-phone-repair-tools-screwdriver-heat-gun-equipment.jpg',
                count: '100+',
                description: 'Professional repair equipment and tools for smartphone disassembly and repair',
                features: ['Screwdriver Sets', 'Opening Tools', 'Heat Guns', 'Suction Cups'],
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
                          View Products
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

      {/* Repair Guides and Tutorials */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Free Repair Guides & Tutorials
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Master professional repair techniques with our expert guides and video tutorials
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
                View More Tutorials
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
