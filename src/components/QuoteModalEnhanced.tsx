'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Send, User, Mail, Phone, MessageSquare, Package, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { quoteFormSchema, type QuoteFormData } from '@/lib/form-schemas';
import { FormInput, FormTextarea, FormErrorSummary, FormStatus } from '@/components/common/FormComponents';
import { useFormAutoSave, useFormRecovery, useFormChanges, useFormSubmission, usePreventDataLoss } from '@/lib/form-utils';
import { submitRfqAndNotify } from '@/lib/rfq-client';
import { useTurnstile } from '@/components/common/Turnstile';
import { markAsHumanVerified } from '@/lib/analytics';

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

  // Turnstile human verification
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const { token: turnstileToken, isVerified: isTurnstileVerified, TurnstileWidget } = useTurnstile(turnstileSiteKey);

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

  // Mark analytics as human when Turnstile passes
  useEffect(() => {
    if (isTurnstileVerified) {
      markAsHumanVerified();
    }
  }, [isTurnstileVerified]);

  // 处理表单提交
  const onSubmit = async (data: QuoteFormData) => {
    // Turnstile verification
    if (turnstileSiteKey && !isTurnstileVerified) {
      setError('Please complete the verification challenge.');
      return;
    }
    if (turnstileSiteKey && turnstileToken) {
      try {
        const verifyRes = await fetch('/api/turnstile/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setError('Verification failed. Please refresh and try again.');
          return;
        }
      } catch {
        setError('Verification check failed. Please try again.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const submittedAt = new Date().toISOString();
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const productInterest = [data.product, articleTitle].filter(Boolean).join(' | ');

      await submitRfqAndNotify({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        productInterest,
        message: data.message,
        pageUrl,
        submittedAt,
      });

      setSuccess('Quote request submitted successfully! We will send you a detailed quote within 24 hours.');

      clearSavedData();
      reset(defaultValues);
      resetSubmission();

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          router.push('/thank-you');
        }, 300);
      }, 1500);

    } catch (error) {
      console.error('Error submitting quote form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please check your connection and try again.';
      setError(`Submission failed: ${errorMessage}`);
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

              {/* Turnstile verification */}
              {turnstileSiteKey && (
                <div className="flex justify-center">
                  <TurnstileWidget />
                </div>
              )}

              <button
                type="submit"
                disabled={state.isSubmitting || !isValid || (!!turnstileSiteKey && !isTurnstileVerified)}
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
