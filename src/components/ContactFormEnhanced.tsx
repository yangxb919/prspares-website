'use client';

import { useRouter } from 'next/navigation';
import { contactFormSchema, type ContactFormData } from '@/lib/form-schemas';
import { FormWrapper } from '@/components/common/FormWrapper';
import { FormInput, FormTextarea, FormSelect } from '@/components/common/FormComponents';
import { Mail, Phone, MessageSquare, User, Building } from 'lucide-react';
import { submitRfqAndNotify } from '@/lib/rfq-client';

interface ContactFormProps {
  className?: string;
  showTitle?: boolean;
  onSuccess?: () => void;
}

const defaultValues: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  requestType: 'contact',
  productName: '',
  productSku: '',
  company: ''
};

const requestTypeOptions = [
  { value: 'contact', label: 'General Inquiry' },
  { value: 'quote', label: 'Quote Request' }
];

export default function ContactFormEnhanced({ className, showTitle = true, onSuccess }: ContactFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: ContactFormData) => {
    try {
      const submittedAt = new Date().toISOString();
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const productInterest = [data.productName, data.productSku].filter(Boolean).join(' / ');

      await submitRfqAndNotify({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        productInterest: productInterest || data.requestType,
        message: data.message,
        pageUrl,
        submittedAt,
      });

      router.push('/thank-you');

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Form submission error:', error);
      throw error; // Let FormWrapper handle the error display
    }
  };

  return (
    <FormWrapper
      schema={contactFormSchema}
      defaultValues={defaultValues}
      formId="contact-form"
      onSubmit={handleSubmit}
      title={showTitle ? "Contact Us" : undefined}
      description="Please fill out the form below and we'll get back to you as soon as possible."
      className={className}
      successMessage="Message sent successfully! We will reply to you within 24 hours."
    >
      {({ register, errors, control, watch, setValue }) => {
        const requestType = watch('requestType');

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormInput
                label="Full Name"
                name="name"
                placeholder="Please enter your full name"
                required
                register={register}
                errors={errors}
                autoComplete="name"
                icon={<User className="h-4 w-4 text-gray-400" />}
              />

              {/* Email */}
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                register={register}
                errors={errors}
                autoComplete="email"
                icon={<Mail className="h-4 w-4 text-gray-400" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <FormInput
                label="Phone Number"
                name="phone"
                placeholder="+1 (555) 123-4567"
                register={register}
                errors={errors}
                autoComplete="tel"
                description="Optional, helps us contact you faster"
                icon={<Phone className="h-4 w-4 text-gray-400" />}
              />

              {/* Company */}
              <FormInput
                label="Company Name"
                name="company"
                placeholder="Your company name"
                register={register}
                errors={errors}
                autoComplete="organization"
                icon={<Building className="h-4 w-4 text-gray-400" />}
              />
            </div>

            {/* Request Type */}
            <FormSelect
              label="Inquiry Type"
              name="requestType"
              options={requestTypeOptions}
              required
              register={register}
              errors={errors}
              description="Please select the type of service you need"
            />

            {/* Product fields for quote requests */}
            {requestType === 'quote' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Quote Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Product Name"
                    name="productName"
                    placeholder="Product name you're interested in"
                    register={register}
                    errors={errors}
                    description="Tell us which product you need a quote for"
                  />
                  <FormInput
                    label="Product Model/SKU"
                    name="productSku"
                    placeholder="Product model or SKU (if available)"
                    register={register}
                    errors={errors}
                    description="Helps us provide an accurate quote"
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <FormTextarea
              label="Detailed Description"
              name="message"
              placeholder="Please describe your requirements or questions in detail..."
              required
              rows={6}
              maxLength={1000}
              register={register}
              errors={errors}
              description="Please provide as much detail as possible to help us serve you better"
              icon={<MessageSquare className="h-4 w-4 text-gray-400" />}
            />
          </div>
        );
      }}
    </FormWrapper>
  );
}
