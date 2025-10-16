'use client';

import { useEffect, useState } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle, RotateCcw, Save } from 'lucide-react';
import { FormErrorSummary, FormStatus } from './FormComponents';
import { useFormAutoSave, useFormRecovery, useFormChanges, useFormSubmission, usePreventDataLoss } from '@/lib/form-utils';

interface FormWrapperProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues: T;
  formId: string;
  onSubmit: (data: T) => Promise<void>;
  children: (props: {
    register: UseFormReturn<T>['register'];
    control: UseFormReturn<T>['control'];
    setValue: UseFormReturn<T>['setValue'];
    watch: UseFormReturn<T>['watch'];
    formState: UseFormReturn<T>['formState'];
    errors: UseFormReturn<T>['formState']['errors'];
    isDirty: boolean;
    isValid: boolean;
  }) => React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  enableAutoSave?: boolean;
  enableRecovery?: boolean;
  successMessage?: string;
  showStatus?: boolean;
  customActions?: React.ReactNode;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  formId,
  onSubmit,
  children,
  title,
  description,
  className,
  enableAutoSave = true,
  enableRecovery = true,
  successMessage,
  showStatus = true,
  customActions
}: FormWrapperProps<T>) {
  // 获取保存的表单数据
  const { savedData, hasSavedData, clearSavedData } = useFormRecovery<T>(
    formId,
    defaultValues
  );

  // 初始化 React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: savedData || defaultValues
  });

  // 表单提交状态管理
  const { state, setSubmitting, setSuccess, setError, reset: resetSubmission } = useFormSubmission();

  // 自动保存表单数据
  const formData = control._formValues as T;
  if (enableAutoSave) {
    useFormAutoSave(formId, formData);
  }

  // 检测表单更改
  const { hasChanges, resetToInitial } = useFormChanges(savedData || defaultValues);

  // 防止数据丢失
  usePreventDataLoss(isDirty);

  // 状态管理
  const [showRecovery, setShowRecovery] = useState(hasSavedData);

  // 处理表单提交
  const onFormSubmit = async (data: T) => {
    setSubmitting(true);

    try {
      await onSubmit(data);
      setSuccess(successMessage || 'Form submitted successfully!');

      // 清除保存的数据
      clearSavedData();

      // 重置表单
      reset(defaultValues);
      resetSubmission();

      setShowRecovery(false);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  // 恢复保存的数据
  const handleRecover = () => {
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key as keyof T, value);
      });
      setShowRecovery(false);
    }
  };

  // 清除保存的数据并重置表单
  const handleClearAndReset = () => {
    clearSavedData();
    reset(defaultValues);
    resetSubmission();
    setShowRecovery(false);
  };

  return (
    <div className={className}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        {/* 恢复数据提示 */}
        {enableRecovery && showRecovery && hasSavedData && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
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
                  onClick={() => setShowRecovery(false)}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  忽略
                </button>
                <button
                  type="button"
                  onClick={handleClearAndReset}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  清除数据
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 表单状态提示 */}
        {showStatus && (
          <div className="mb-6">
            {isSubmitting && (
              <FormStatus
                type="loading"
                message="正在提交表单..."
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
          </div>
        )}

        {/* 错误汇总 */}
        <FormErrorSummary errors={errors} />

        {/* 表单内容 */}
        {children({
          register,
          control,
          setValue,
          watch,
          formState: { errors, isDirty, isValid, isSubmitting },
          errors,
          isDirty,
          isValid
        })}

        {/* 默认操作按钮 */}
        {customActions || (
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <div className="flex items-center space-x-4">
              {/* 表单状态指示器 */}
              {isDirty && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                  有未保存的更改
                </div>
              )}

              {/* 自动保存指示器 */}
              {enableAutoSave && (
                <div className="flex items-center text-sm text-gray-500">
                  <Save className="h-4 w-4 mr-1" />
                  自动保存已启用
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClearAndReset}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                重置表单
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="animate-spin h-4 w-4 mr-2" />
                    提交中...
                  </>
                ) : (
                  '提交表单'
                )}
              </button>
            </div>
          </div>
        )}

        {/* 自动保存说明 */}
        {enableAutoSave && (
          <div className="text-xs text-gray-400 text-center mt-6 pt-4 border-t">
            您的表单数据会自动保存，即使页面刷新或意外关闭也不会丢失。数据将在7天后自动删除。
          </div>
        )}
      </form>
    </div>
  );
}