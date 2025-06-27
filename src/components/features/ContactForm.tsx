'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

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

  // Get user IP address
  const getUserIP = async (): Promise<string> => {
    try {
      // Try multiple IP API services for better success rate
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

          // Different APIs return different field names, need to adapt
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

    // Clear validation errors for corresponding field
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Send to backend API (saves to database)
    submitToAPI();

    // Alternative: Use EmailJS to send email (template ID fixed, includes IP address)
    // submitWithEmailJS();

    // Development test: simulate submission
    // simulateSubmission();
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
        alert('EmailJS configuration incomplete, please check environment variables');
        simulateSubmission();
        return;
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: contactEmail,
        reply_to: formData.email,
        user_ip: currentIP,  // 🆕 Add user IP address
        submission_time: new Date().toLocaleString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })  // 🆕 Add submission time
      };

      console.log('Email parameters:', templateParams);

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log('Email sent successfully!');
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

  // Real API submission
  const submitToAPI = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Message sent successfully!');
        // Redirect to thank you page
        router.push('/thank-you');
      } else {
        console.error('Failed to send message');
        // Error handling can be added here
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Error handling can be added here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate submission (for demo)
  const simulateSubmission = () => {
    setTimeout(() => {
      console.log('Form data:', formData);
      setIsSubmitting(false);

      // Redirect to thank you page
      router.push('/thank-you');
    }, 1500);
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

      {/* Configuration instructions - Hidden */}
      {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
        <p><strong>💡 Configuration Tip:</strong> To enable email sending functionality, please visit <a href="https://www.emailjs.com/" target="_blank" className="text-blue-600 hover:underline">EmailJS.com</a> to register an account and get configuration keys.</p>
      </div> */}

      {/* IP address display - Hidden */}
      {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>📍 Your IP Address:</span>
          <span className="font-mono font-medium text-gray-800">
            {userIP || 'Getting...'}
          </span>
        </div>
        {userIP && userIP !== 'Unable to get' && (
          <span className="text-green-600 text-xs">✅ Retrieved</span>
        )}
        {userIP === 'Unable to get' && (
          <span className="text-orange-600 text-xs">⚠️ Failed to get</span>
        )}
      </div> */}
    </div>
  );
};

export default ContactForm;
