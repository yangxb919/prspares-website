'use client';

import { useRouter } from 'next/navigation';
import { contactFormSchema, type ContactFormData } from '@/lib/form-schemas';
import { FormWrapper } from '@/components/common/FormWrapper';
import { FormInput, FormTextarea, FormSelect } from '@/components/common/FormComponents';
import { Mail, Phone, MessageSquare, User, Building } from 'lucide-react';
import emailjs from '@emailjs/browser';

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
      // 1. Save to database via API
      const apiResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!apiResponse.ok) {
        const result = await apiResponse.json();
        throw new Error(result.error || 'Failed to submit contact form');
      }

      // 2. Send email via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

      if (serviceId && templateId && publicKey) {
        const emailParams = {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          to_email: contactEmail,
          reply_to: data.email,
          phone: data.phone || 'Not provided',
          company: data.company || 'Not provided',
          request_type: data.requestType === 'quote' ? 'Quote Request' : 'General Inquiry',
          product_name: data.productName || 'Not applicable',
          product_sku: data.productSku || 'Not applicable',
          submission_time: new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };

        try {
          await emailjs.send(serviceId, templateId, emailParams, publicKey);
          console.log('✅ Email sent successfully via EmailJS');
        } catch (emailError) {
          console.error('EmailJS failed:', emailError);
          // Don't throw error - continue with success response
        }
      } else {
        console.warn('EmailJS configuration incomplete - skipping email sending');
      }

      // 3. Redirect to thank you page
      router.push('/thank-you');

      // 4. Call success callback if provided
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