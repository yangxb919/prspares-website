'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

// 基础输入组件
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  register,
  errors,
  className,
  description,
  autoComplete,
  icon
}: FormInputProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;
  const hasError = !!error;

  const fieldId = name;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={fieldId}
        className={cn(
          'block text-sm font-medium',
          hasError ? 'text-red-600' : 'text-gray-700'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={cn(descriptionId, errorId)}
          className={cn(
            'block w-full border rounded-md shadow-sm',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-10' : 'px-3',
            'py-2',
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          )}
          {...register(name)}
        />
      </div>

      {description && (
        <p
          id={descriptionId}
          className="text-xs text-gray-500"
        >
          {description}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// 文本域组件
interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
  rows?: number;
  maxLength?: number;
  icon?: React.ReactNode;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  required = false,
  disabled = false,
  register,
  errors,
  className,
  description,
  rows = 4,
  maxLength,
  icon
}: FormTextareaProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;
  const hasError = !!error;

  const fieldId = name;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  const characterCountId = maxLength ? `${fieldId}-charcount` : undefined;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={fieldId}
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-red-600' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>

        {maxLength && (
          <span
            id={characterCountId}
            className="text-xs text-gray-500"
            aria-live="polite"
          >
            {maxLength} 字符限制
          </span>
        )}
      </div>

      <div className="relative">
        {icon && (
          <div className="absolute top-3 left-3 pointer-events-none">
            {icon}
          </div>
        )}
        <textarea
          id={fieldId}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={cn(descriptionId, errorId, characterCountId)}
          className={cn(
            'block w-full border rounded-md shadow-sm',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-10 pr-3' : 'px-3',
            'py-2',
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            'resize-vertical'
          )}
          {...register(name)}
        />
      </div>

      {description && (
        <p
          id={descriptionId}
          className="text-xs text-gray-500"
        >
          {description}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// 选择框组件
interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
  placeholder?: string;
}

export function FormSelect({
  label,
  name,
  options,
  required = false,
  disabled = false,
  register,
  errors,
  className,
  description,
  placeholder
}: FormSelectProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={name} className={cn(
        'block text-sm font-medium',
        error ? 'text-red-600' : 'text-gray-700'
      )}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        disabled={disabled}
        className={cn(
          'block w-full px-3 py-2 border rounded-md shadow-sm',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        )}
        {...register(name)}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// 复选框组件
interface FormCheckboxProps {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
}

export function FormCheckbox({
  label,
  name,
  required = false,
  disabled = false,
  register,
  errors,
  className,
  description
}: FormCheckboxProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-start">
        <input
          id={name}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'mt-1 h-4 w-4 rounded border-gray-300',
            'text-blue-600 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-300 focus:ring-red-500'
          )}
          {...register(name)}
        />

        <div className="ml-3">
          <label htmlFor={name} className={cn(
            'block text-sm font-medium',
            error ? 'text-red-600' : 'text-gray-700'
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 ml-7" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// 单选框组件
interface FormRadioProps {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
}

export function FormRadio({
  label,
  name,
  options,
  required = false,
  disabled = false,
  register,
  errors,
  className,
  description
}: FormRadioProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <label className={cn(
        'block text-sm font-medium',
        error ? 'text-red-600' : 'text-gray-700'
      )}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              value={option.value}
              disabled={disabled}
              className={cn(
                'h-4 w-4 border-gray-300',
                'text-blue-600 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-red-300 focus:ring-red-500'
              )}
              {...register(name)}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-3 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// 文件上传组件
interface FormFileUploadProps {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  control: Control<any>;
  errors: FieldErrors;
  className?: string;
  description?: string;
  onFileSelect?: (files: FileList | null) => void;
}

export function FormFileUpload({
  label,
  name,
  accept,
  multiple = false,
  required = false,
  disabled = false,
  control,
  errors,
  className,
  description,
  onFileSelect
}: FormFileUploadProps) {
  const error = errors[name];
  const errorMessage = error?.message as string;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn('space-y-1', className)}>
          <label htmlFor={name} className={cn(
            'block text-sm font-medium',
            error ? 'text-red-600' : 'text-gray-700'
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <input
            id={name}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className={cn(
              'block w-full text-sm text-gray-500',
              'file:mr-4 file:py-2 file:px-4',
              'file:rounded-md file:border-0',
              'file:text-sm file:font-semibold',
              'file:bg-blue-50 file:text-blue-700',
              'hover:file:bg-blue-100',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onChange={(e) => {
              field.onChange(e.target.files);
              onFileSelect?.(e.target.files);
            }}
            onBlur={field.onBlur}
          />

          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    />
  );
}

// 表单错误汇总组件
interface FormErrorSummaryProps {
  errors: FieldErrors;
  title?: string;
}

export function FormErrorSummary({ errors, title = '请修正以下错误：' }: FormErrorSummaryProps) {
  const errorMessages = Object.values(errors)
    .map(error => error?.message as string)
    .filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <div
      className="bg-red-50 border border-red-200 rounded-md p-4 mb-4"
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-sm font-medium text-red-800 mb-2">
        {title}
      </h3>
      <ul className="text-sm text-red-700 space-y-1">
        {errorMessages.map((message, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2" aria-hidden="true">•</span>
            <span>{message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 表单状态提示组件
interface FormStatusProps {
  type: 'loading' | 'success' | 'error';
  message: string;
  className?: string;
}

export function FormStatus({ type, message, className }: FormStatusProps) {
  const baseClasses = 'p-4 rounded-md text-sm font-medium';

  const typeClasses = {
    loading: 'bg-blue-50 text-blue-800 border border-blue-200',
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200'
  };

  const icons = {
    loading: (
      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    success: (
      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className={cn(baseClasses, typeClasses[type], 'flex items-center', className)}>
      {icons[type]}
      {message}
    </div>
  );
}

// 实时表单状态组件
interface LiveFormStatusProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitCount?: number;
  className?: string;
}

export function LiveFormStatus({
  isSubmitting,
  isDirty,
  isValid,
  submitCount = 0,
  className
}: LiveFormStatusProps) {
  const getStatusMessage = () => {
    if (isSubmitting) return '正在提交表单...';
    if (submitCount > 0 && !isDirty && isValid) return '表单提交成功！';
    if (!isValid) return '表单有错误需要修正';
    if (isDirty) return '表单有未保存的更改';
    return '表单已就绪';
  };

  const getStatusType = () => {
    if (isSubmitting) return 'loading';
    if (submitCount > 0 && !isDirty && isValid) return 'success';
    if (!isValid) return 'error';
    return 'idle';
  };

  return (
    <div
      className={cn(
        'text-sm',
        'aria-live',
        'aria-atomic',
        className
      )}
      role="status"
      aria-label="表单状态"
    >
      {getStatusMessage()}
    </div>
  );
}

// 焦点管理工具组件
interface FocusManagerProps {
  formId: string;
  firstFieldRef?: React.RefObject<HTMLElement>;
  lastFieldRef?: React.RefObject<HTMLElement>;
  onError?: (fieldName: string) => void;
}

export function FocusManager({
  formId,
  firstFieldRef,
  lastFieldRef,
  onError
}: FocusManagerProps) {
  useEffect(() => {
    const handleFormError = (event: Event) => {
      const customEvent = event as CustomEvent<{ fieldName: string }>;
      if (customEvent.detail?.fieldName && onError) {
        onError(customEvent.detail.fieldName);
      }
    };

    window.addEventListener(`form-error-${formId}`, handleFormError);
    return () => {
      window.removeEventListener(`form-error-${formId}`, handleFormError);
    };
  }, [formId, onError]);

  return null;
}