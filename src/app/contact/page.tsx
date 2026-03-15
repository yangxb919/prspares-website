import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { TrackedLink } from '@/components/TrackedLink';

export const metadata: Metadata = {
  title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
  description: 'Contact PRSPARES for wholesale phone repair parts inquiries, order support, and technical questions. Located in Shenzhen Huaqiangbei. Email, phone, WhatsApp available.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
    description: 'Reach PRSPARES for wholesale parts inquiries, order support, and technical questions. Shenzhen Huaqiangbei.',
    type: 'website',
    url: '/contact',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
    description: 'Reach PRSPARES for wholesale parts inquiries, order support, and technical questions.',
  },
};

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: 'Email',
    primary: 'parts.info@phonerepairspares.com',
    href: 'mailto:parts.info@phonerepairspares.com',
    note: 'Response within 24 hours',
  },
  {
    icon: Phone,
    title: 'Phone / WhatsApp',
    primary: '+86 185 8899 9234',
    href: 'https://wa.me/8618588999234',
    note: 'WhatsApp preferred for international',
  },
  {
    icon: MapPin,
    title: 'Office',
    primary: 'Huaqiangbei, Futian District',
    href: null,
    note: 'Shenzhen, Guangdong, China',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    primary: 'Mon–Fri: 9:00–18:00 (CST)',
    href: null,
    note: 'UTC+8 · Closed weekends',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <nav className="flex items-center space-x-2 text-sm mb-8 text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Contact</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Have questions about orders, shipping, or technical specs? Our team in Shenzhen is ready to help. Free quote within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedLink
                href="/wholesale-inquiry"
                event="quote_cta_click"
                params={{ event_label: 'Contact Hero CTA' }}
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Get Wholesale Quote
              </TrackedLink>
              <TrackedLink
                href="https://wa.me/8618588999234?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts"
                event="whatsapp_click"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all"
              >
                WhatsApp Sales
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Quote Banner */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Looking to request a wholesale quote?</p>
                <p className="text-sm text-gray-600">Use our dedicated inquiry form for faster response with pricing and MOQ details.</p>
              </div>
            </div>
            <TrackedLink
              href="/wholesale-inquiry"
              event="quote_cta_click"
              params={{ event_label: 'Contact Banner CTA' }}
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap"
            >
              Get Wholesale Quote
              <ArrowRight className="ml-2" size={16} />
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {CONTACT_METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{m.title}</h3>
                        {m.href ? (
                          <a
                            href={m.href}
                            className="text-[#1e3a5f] hover:text-orange-500 font-medium transition-colors"
                            target={m.href.startsWith('http') ? '_blank' : undefined}
                            rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {m.primary}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-medium">{m.primary}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">{m.note}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Which Channel Should I Use? */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Which Channel Should I Use?</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="border border-gray-100 rounded-xl p-5">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Inquiry Form</h4>
                  <p className="text-sm text-gray-600">For wholesale quotes, bulk pricing, and new product sourcing. Free quote within 24 hours.</p>
                  <TrackedLink href="/wholesale-inquiry" event="quote_cta_click" params={{ event_label: 'Contact Channel Card' }} className="inline-flex items-center text-sm font-semibold text-orange-500 mt-3">
                    Get Quote <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </TrackedLink>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">WhatsApp</h4>
                  <p className="text-sm text-gray-600">For urgent sourcing, quick questions, or real-time negotiation. Fastest response.</p>
                  <TrackedLink href="https://wa.me/8618588999234?text=Hi,%20I'm%20interested%20in%20wholesale%20phone%20parts" event="whatsapp_click" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-green-600 mt-3">
                    Chat Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </TrackedLink>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Email</h4>
                  <p className="text-sm text-gray-600">For after-sales support, order tracking, warranty claims, and technical questions.</p>
                  <a href="mailto:parts.info@phonerepairspares.com" className="inline-flex items-center text-sm font-semibold text-blue-600 mt-3">
                    Send Email <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* When to Contact Us vs Inquiry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us For</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                    <span>Order status and tracking updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                    <span>Technical questions about parts compatibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                    <span>Shipping and logistics inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                    <span>Warranty and return requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                    <span>Partnership and distribution inquiries</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#1e3a5f] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Request a Quote For</h3>
                <ul className="space-y-3 text-white/85">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold mt-0.5">•</span>
                    <span>Bulk pricing on screens, batteries, parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold mt-0.5">•</span>
                    <span>Sample orders before bulk purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold mt-0.5">•</span>
                    <span>Mixed models and categories supported</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold mt-0.5">•</span>
                    <span>Same-day dispatch for in-stock items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold mt-0.5">•</span>
                    <span>12-month warranty on all products</span>
                  </li>
                </ul>
                <TrackedLink
                  href="/wholesale-inquiry"
                  event="quote_cta_click"
                  params={{ event_label: 'Contact Quote Section CTA' }}
                  className="mt-6 inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Go to Wholesale Inquiry
                  <ArrowRight className="ml-2" size={16} />
                </TrackedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Us in Huaqiangbei</h2>
            <p className="text-gray-600 mb-8">
              Our office is located in the Huaqiangbei electronics district, Futian, Shenzhen — the world&apos;s largest electronics marketplace. Visits are welcome by appointment.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-md h-[300px] bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1234567890123!2d114.0823!3d22.5467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340391f7b0b0b0b1%3A0x1234567890abcdef!2sHuaqiangbei!5e0!3m2!1sen!2scn!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PRSPARES office location in Huaqiangbei, Shenzhen"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
