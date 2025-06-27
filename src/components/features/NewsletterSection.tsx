'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add actual email subscription logic here
    console.log('Subscription email:', email);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-gray-50 py-12 my-12 rounded-lg">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <Mail size={32} className="text-[#00B140]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
          Subscribe to Our Industry Newsletter
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay updated with the latest developments in injection molding, technology trends, and educational resources from MoldAll
        </p>

        {isSubmitted ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md inline-block">
            Thank you for subscribing! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B140] focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-[#00B140] hover:bg-[#008631] text-white px-6 py-3 rounded-r-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
