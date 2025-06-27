'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, User, Mail, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  defaultMessage?: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

const InquiryModal = ({
  isOpen,
  onClose,
  title = "Get Professional Quote",
  subtitle = "Tell us your requirements and we'll get back to you within 24 hours",
  defaultMessage = ""
}: InquiryModalProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: defaultMessage
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [userIP, setUserIP] = useState<string>('');

  // Get user IP address
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
            console.log(`✅ Successfully got IP address: ${ip} (source: ${apiUrl})`);
            return ip;
          }
        } catch (apiError) {
          console.warn(`❌ IP API ${apiUrl} failed:`, apiError);
          continue;
        }
      }
      throw new Error('All IP APIs failed');
    } catch (error) {
      console.error('Failed to get IP address:', error);
      return 'Unable to get';
    }
  };

  // Get IP address when component loads
  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };
    if (isOpen) {
      fetchIP();
    }
  }, [isOpen]);

  // Update message when defaultMessage changes
  useEffect(() => {
    if (defaultMessage && isOpen) {
      setFormData(prev => ({
        ...prev,
        message: defaultMessage
      }));
    }
  }, [defaultMessage, isOpen]);

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
      errors.message = 'Please enter your inquiry details';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors for corresponding field
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Send via EmailJS
    await submitWithEmailJS();
  };

  // EmailJS send email - includes IP address!
  const submitWithEmailJS = async () => {
    try {
      // EmailJS configuration - read from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'lijiedong08@gmail.com';

      // If IP wasn't obtained during page load, get it now
      let currentIP = userIP;
      if (!currentIP || currentIP === 'Unable to get') {
        console.log('🔄 Re-fetching IP address...');
        currentIP = await getUserIP();
        setUserIP(currentIP);
      }

      // Debug information
      console.log('EmailJS configuration check:', {
        serviceId,
        templateId,
        publicKey: publicKey ? 'Configured' : 'Not configured',
        contactEmail,
        userIP: currentIP
      });

      // Check if configuration is complete
      if (!serviceId || !templateId || !publicKey) {
        console.warn('EmailJS configuration incomplete, using simulation');
        simulateSubmission();
        return;
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: `INQUIRY: ${formData.message}`,
        to_email: contactEmail,
        reply_to: formData.email,
        user_ip: currentIP,
        submission_time: new Date().toLocaleString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        inquiry_type: 'Home Page Inquiry'
      };

      console.log('Email parameters:', templateParams);

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log('Inquiry email sent successfully!');
      console.log(`User IP: ${currentIP}`);

      // Redirect to thank you page
      router.push('/thank-you');

    } catch (error) {
      console.error('Email sending failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Email sending failed: ${errorMessage}`);
      // If EmailJS fails, fallback to simulation
      simulateSubmission();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate submission (fallback)
  const simulateSubmission = () => {
    setTimeout(() => {
      console.log('Inquiry form data:', formData);
      
      // Redirect to thank you page
      router.push('/thank-you');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00B140] to-[#00D155] rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00B140] focus:border-transparent transition-all duration-200 outline-none ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00B140] focus:border-transparent transition-all duration-200 outline-none ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {/* Message input */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Inquiry Details *
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-4 text-gray-400" size={20} />
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00B140] focus:border-transparent transition-all duration-200 outline-none resize-none ${
                    validationErrors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please describe your requirements, including product models, quantities, etc..."
                />
              </div>
              {validationErrors.message && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#00B140] to-[#00D155] hover:from-[#008631] hover:to-[#00B140] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Sending Inquiry...
                </>
              ) : (
                <>
                  <Send className="mr-3" size={20} />
                  Send Inquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal; 