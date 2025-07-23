'use client';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Mail, Clock, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThankYouClient() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#00B140]/10 to-[#00D155]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#00D155]/10 to-[#00B140]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-[#00B140]/5 to-transparent rounded-full blur-lg"></div>
      </div>

      <div className={`max-w-3xl w-full transition-all duration-1000 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Success Icon */}
        <div className={`text-center mb-12 transition-all duration-1200 delay-300 transform ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00B140] to-[#00D155] rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-[#00B140]" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#00D155] animate-bounce" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Thank You!
          </h1>

          <p className="text-2xl text-gray-600 leading-relaxed font-light">
            Your message has been successfully sent to our expert team.
          </p>
        </div>

        {/* Main Content Card */}
        <div className={`bg-white rounded-3xl shadow-2xl p-10 md:p-12 border border-gray-100 relative overflow-hidden transition-all duration-1000 delay-500 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Card decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00B140] to-[#00D155]"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              We've Received Your Inquiry
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto">
              Thank you for reaching out to PRSPARES. Our expert team has received your message and will review it carefully to provide you with the best solution.
            </p>
          </div>

          {/* Response Time Info */}
          <div className="bg-gradient-to-br from-[#00B140]/5 via-[#00D155]/5 to-[#00B140]/5 rounded-2xl p-8 mb-10 border border-[#00B140]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00B140]/5 to-[#00D155]/5"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00B140] to-[#00D155] rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Response Time</span>
                </div>
              </div>
              <p className="text-center text-gray-800 text-xl font-semibold mb-3">
                We will respond to your email within <span className="text-[#00B140] font-black text-2xl">24 hours</span>
              </p>
              <p className="text-center text-gray-600 text-lg">
                Please check your email (including spam folder) for our response
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="group text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#00B140]/30 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00B140]/10 to-[#00D155]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-[#00B140] group-hover:text-[#00D155] transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-[#00B140] transition-colors duration-300">Email Confirmation</h3>
              <p className="text-gray-600 leading-relaxed">Check your inbox for a confirmation email with your inquiry details</p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#00B140]/30 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00B140]/10 to-[#00D155]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-[#00B140] group-hover:text-[#00D155] transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-[#00B140] transition-colors duration-300">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">Our experienced technical team will provide personalized assistance</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/"
              className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#00B140] to-[#00D155] text-white font-bold rounded-2xl hover:from-[#008631] hover:to-[#00B140] transition-all duration-500 shadow-2xl hover:shadow-[#00B140]/50 transform hover:-translate-y-2 hover:scale-105 text-lg"
            >
              <ArrowLeft className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
              Return to Home
            </Link>

            <Link
              href="/products"
              className="group inline-flex items-center justify-center px-10 py-5 bg-white text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-[#00B140] hover:bg-gray-50 hover:text-[#00B140] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
            >
              Browse Products
              <ArrowLeft className="w-6 h-6 ml-3 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
            <p className="text-gray-600 text-lg mb-2">
              Need immediate assistance?
            </p>
            <p className="text-gray-700 text-xl">
              Call us at{' '}
              <a
                href="tel:+8618588999234"
                className="text-[#00B140] hover:text-[#00D155] font-bold transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
              >
                +8618588999234
              </a>
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Available Monday to Friday, 9:00 AM - 6:00 PM (GMT+8)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
