'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Send, User, Mail, Phone, MessageSquare, Package, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { quoteFormSchema, type QuoteFormData } from '@/lib/form-schemas';
import { FormInput, FormTextarea, FormErrorSummary, FormStatus } from '@/components/common/FormComponents';
import { useFormAutoSave, useFormRecovery, useFormChanges, useFormSubmission, usePreventDataLoss } from '@/lib/form-utils';
import emailjs from '@emailjs/browser';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  articleTitle?: string;
}

const defaultValues: QuoteFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  product: '',
  message: '',
  source: 'Website'
};

export default function QuoteModalEnhanced({ isOpen, onClose, productName, articleTitle }: QuoteModalProps) {
  const router = useRouter();

  // 获取保存的表单数据
  const { savedData, hasSavedData, clearSavedData } = useFormRecovery<QuoteFormData>(
    'quote-form',
    defaultValues
  );

  // 初始化 React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema) as any,
    mode: 'onChange', // 实时验证
    defaultValues: (savedData || {
      ...defaultValues,
      product: productName || '',
      source: articleTitle ? `Article: ${articleTitle}` : 'Website'
    }) as any
  });

  // 表单提交状态管理
  const { state, setSubmitting, setSuccess, setError, reset: resetSubmission } = useFormSubmission();

  // 自动保存表单数据
  const formData = control._formValues as QuoteFormData;
  useFormAutoSave('quote-form', formData);

  // 检测表单更改
  const { hasChanges, resetToInitial } = useFormChanges(savedData || defaultValues);

  // 防止数据丢失
  usePreventDataLoss(isDirty);

  // 处理表单提交
  const onSubmit = async (data: QuoteFormData) => {
    setSubmitting(true);

    try {
      // 1. Save to database via API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          subject: `Quote Request${data.product ? ` - ${data.product}` : ''}`,
          requestType: 'quote'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit quote request');
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
          request_type: 'Quote Request',
          product_name: data.product || 'Not specified',
          product_sku: 'Not applicable',
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
          console.log('✅ Quote email sent successfully via EmailJS');
        } catch (emailError) {
          console.error('EmailJS failed for quote:', emailError);
          // Don't throw error - continue with success response
        }
      } else {
        console.warn('EmailJS configuration incomplete - skipping email sending');
      }

      // 3. Set success message and prepare redirect
      setSuccess('Quote request submitted successfully! We will send you a detailed quote within 24 hours.');

      // 4. Clear saved data and reset form
      clearSavedData();
      reset(defaultValues);
      resetSubmission();

      // 5. Close modal and redirect to thank you page
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          router.push('/thank-you');
        }, 300);
      }, 1500);

    } catch (error) {
      console.error('Error submitting quote form:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 恢复保存的数据
  const handleRecover = () => {
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key as keyof QuoteFormData, value);
      });
    }
  };

  // 清除保存的数据并重置表单
  const handleClearAndReset = () => {
    clearSavedData();
    reset({
      ...defaultValues,
      product: productName || '',
      source: articleTitle ? `Article: ${articleTitle}` : 'Website'
    });
    resetSubmission();
  };

  // 模态框关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      resetSubmission();
    }
  }, [isOpen, resetSubmission]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 id="quote-modal-title" className="text-xl font-bold text-gray-900">
              Request Free Quote
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Get personalized pricing for your needs
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-6" noValidate>
          {/* 恢复数据提示 */}
          {hasSavedData && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      发现未完成的表单数据
                    </p>
                    <p className="text-xs text-blue-600">
                      您可以恢复之前填写的内容
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleRecover}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    恢复数据
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAndReset}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    清除数据
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 表单状态提示 */}
          {state.isSubmitting && (
            <FormStatus
              type="loading"
              message="正在提交您的报价请求..."
            />
          )}
          {state.isSuccess && (
            <FormStatus
              type="success"
              message={state.successMessage || '提交成功！'}
            />
          )}
          {state.isError && (
            <FormStatus
              type="error"
              message={state.error || '提交失败，请重试'}
            />
          )}

          {/* 错误汇总 */}
          <FormErrorSummary errors={errors} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <FormInput
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              required
              register={register}
              errors={errors}
              autoComplete="name"
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
            />

            {/* Phone */}
            <FormInput
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 123-4567"
              required
              register={register}
              errors={errors}
              autoComplete="tel"
              description="用于联系您讨论报价详情"
            />

            {/* Company */}
            <FormInput
              label="Company Name"
              name="company"
              placeholder="Your company name"
              required
              register={register}
              errors={errors}
              autoComplete="organization"
            />
          </div>

          {/* Product */}
          <FormInput
            label="Product/Service Interest"
            name="product"
            placeholder="Which product or service are you interested in?"
            required
            register={register}
            errors={errors}
          />

          {/* Message */}
          <FormTextarea
            label="Project Requirements"
            name="message"
            placeholder="Please describe your project requirements, quantity needed, timeline, and any other relevant details..."
            required
            rows={5}
            maxLength={1000}
            register={register}
            errors={errors}
            description="详细的描述有助于我们为您提供更准确的报价"
          />

          {/* Hidden fields */}
          <input type="hidden" {...register('source')} />

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xs text-gray-500">
              {isDirty && (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                  有未保存的更改
                </span>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={state.isSubmitting}
              >
                取消
              </button>

              <button
                type="submit"
                disabled={state.isSubmitting || !isValid}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {state.isSubmitting ? (
                  <>
                    <RotateCcw className="animate-spin h-4 w-4 mr-2" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    提交报价请求
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 自动保存提示 */}
          <div className="text-xs text-gray-400 text-center border-t pt-4">
            您的表单数据会自动保存，即使页面刷新或意外关闭也不会丢失
          </div>
        </form>
      </div>
    </div>
  );
}