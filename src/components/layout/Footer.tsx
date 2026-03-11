'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const Footer = () => {
  const {
    email,
    setEmail,
    isSubmitting,
    isSubscribed,
    errorMessage,
    submit: submitNewsletter,
  } = useNewsletterSubscription({ source: 'footer' });

  const handleSubscribe = async (e: React.FormEvent) => {
    await submitNewsletter(e);
  };

  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Company information */}
          <div className="md:col-span-1 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">PRSPARES</h3>
            <p className="text-sm mb-6 leading-relaxed flex-grow">
              Leading supplier of high-quality mobile repair parts and OEM components based in Shenzhen Huaqiangbei electronics hub.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a href="mailto:parts.info@phonerepairspares.com" className="hover:text-[#00B140] transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
              <a href="tel:+8618588999234" className="hover:text-[#00B140] transition-colors" aria-label="Phone">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3 flex-grow">
              <li>
                <Link href="/" className="text-sm hover:text-[#00B140] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-[#00B140] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-[#00B140] transition-colors">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/products" className="text-sm hover:text-[#00B140] transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* More links */}
          <div className="md:col-span-1 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">More</h3>
            <ul className="space-y-3 flex-grow">
              <li>
                <Link href="/wholesale-inquiry" className="text-sm hover:text-[#00B140] transition-colors">
                  Get Wholesale Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-[#00B140] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm hover:text-[#00B140] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info & Newsletter */}
          <div className="md:col-span-1 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">parts.info@phonerepairspares.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">+8618588999234</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">Huaqiangbei Electronics Market, Shenzhen, China</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="border-t border-gray-700 pt-4 mt-auto">
              <h4 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wide">Newsletter</h4>
              
              {!isSubscribed ? (
                <div className="space-y-2">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 bg-transparent border border-gray-600 rounded-l-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-[#00B140] focus:border-[#00B140] transition-all duration-200 outline-none text-sm"
                      required
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubscribe(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={isSubmitting}
                      className="bg-[#00B140] hover:bg-[#008631] text-white px-3 py-2 rounded-r-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-[#00B140] hover:border-[#008631]"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get product updates and guides
                  </p>
                  {errorMessage && (
                    <p className="text-xs text-red-400">{errorMessage}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#00B140] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <p className="text-[#00B140] text-sm">Subscribed!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PRSPARES Mobile Repair Parts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
