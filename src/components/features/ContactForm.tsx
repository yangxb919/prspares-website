'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { submitRfqAndNotify } from '@/lib/rfq-client';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [userIP, setUserIP] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  // Get user IP address (best effort)
  const getUserIP = async (): Promise<string> => {
    try {
      const ipAPIs = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.ip.sb/jsonip'
      ];

      for (const apiUrl of ipAPIs) {
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          const ip = data.ip || data.IPv4 || data.query || '';
          if (ip) {
            return ip;
          }
        } catch {
          continue;
        }
      }

      throw new Error('All IP APIs failed');
    } catch {
      return 'Unable to get';
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };

    fetchIP();
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your message';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (submitError) {
      setSubmitError('');
    }

    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      let currentIP = userIP;
      if (!currentIP || currentIP === 'Unable to get') {
        currentIP = await getUserIP();
        setUserIP(currentIP);
      }

      const submittedAt = new Date().toISOString();
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '/contact';
      const searchParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
      const productInterest = searchParams.get('product') || '';

      await submitRfqAndNotify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: '',
        phone: '',
        productInterest,
        message: formData.message.trim(),
        pageUrl,
        ip: currentIP,
        submittedAt,
      });

      router.push('/thank-you');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSubmitError(`Failed to submit inquiry: ${errorMessage}`);
      console.error('[RFQ] Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#333333] mb-6">Send Message</h2>

      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B140] ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B140] ${
                validationErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B140] ${
                validationErrors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your message"
            />
            {validationErrors.message && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
            )}
          </div>

          {submitError && (
            <p className="mb-4 text-sm text-red-600">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#00B140] hover:bg-[#008631] text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Send Message <Send size={18} className="ml-2" />
              </>
            )}
          </button>
        </form>
    </div>
  );
};

export default ContactForm;
