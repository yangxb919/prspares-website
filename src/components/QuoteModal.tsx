'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, User, Mail, Phone, Building2, Package, MessageSquare, CheckCircle } from 'lucide-react';
import { submitRfqAndNotify } from '@/lib/rfq-client';
import { trackEvent } from '@/lib/analytics';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  articleTitle?: string;
}

export default function QuoteModal({ isOpen, onClose, productName, articleTitle }: QuoteModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: productName || '',
    quantity: '',
    message: '',
  });

  // Sync product field when productName prop changes (e.g. PartCategoryCard clicking different items)
  useEffect(() => {
    if (productName) {
      setFormData(prev => ({ ...prev, product: productName }));
    }
  }, [productName]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

      // Format message like wholesale-inquiry
      const msgParts = [
        `[Quote Request${articleTitle ? ` - Article: ${articleTitle}` : ''}]`,
        `Product: ${formData.product || productName || 'Not specified'}`,
        formData.quantity ? `Quantity: ${formData.quantity}` : '',
        formData.message ? `Details: ${formData.message}` : '',
      ].filter(Boolean).join('\n');

      await submitRfqAndNotify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        productInterest: formData.product || productName || '',
        message: msgParts,
        pageUrl,
        submittedAt: new Date().toISOString(),
      });

      // GA4 conversion
      trackEvent('generate_lead', { currency: 'USD', value: 100 });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', phone: '', company: '', product: productName || '', quantity: '', message: '' });
        setSubmitStatus('idle');
        router.push('/thank-you');
      }, 1200);
    } catch (error) {
      console.error('[RFQ] Error submitting form:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMsg(`Failed to submit: ${msg}`);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7a] px-6 py-5 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
          <h2 className="text-xl font-bold text-white">Request a Free Quote</h2>
          <p className="text-blue-200 text-sm mt-1">Get personalized wholesale pricing within 24 hours</p>
        </div>

        {/* Success State */}
        {submitStatus === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quote Request Sent!</h3>
            <p className="text-gray-600 text-sm">We&apos;ll get back to you within 24 hours with your personalized pricing.</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Product — pre-filled, editable */}
            {(productName || formData.product) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center gap-3">
                <Package className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-orange-600 font-medium">Product Interest</div>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 border-none p-0 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Name & Company — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="modal-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="modal-company" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="modal-company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all"
                    placeholder="Company name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="modal-email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone & Quantity — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    id="modal-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all"
                    placeholder="+1 555-123-4567"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="modal-quantity" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Quantity (pcs)
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="modal-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="modal-message" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Additional Details
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  id="modal-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent focus:bg-white transition-all resize-none"
                  placeholder="Quality grade preference, target price, shipping destination..."
                />
              </div>
            </div>

            {/* Error message */}
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {errorMsg || 'Failed to send. Please try again.'}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get My Free Quote
                </>
              )}
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Reply in 24h</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> No spam</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Free quote</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
