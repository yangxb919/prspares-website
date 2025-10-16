import React from 'react';

// 错误类型定义
export interface FormError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// 错误代码枚举
export enum FormErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 标准错误消息
const ERROR_MESSAGES: Record<FormErrorCode, string> = {
  [FormErrorCode.VALIDATION_ERROR]: '表单验证失败，请检查输入内容',
  [FormErrorCode.NETWORK_ERROR]: '网络连接错误，请检查网络后重试',
  [FormErrorCode.SERVER_ERROR]: '服务器错误，请稍后重试',
  [FormErrorCode.AUTHENTICATION_ERROR]: '认证失败，请重新登录',
  [FormErrorCode.RATE_LIMIT_ERROR]: '请求过于频繁，请稍后重试',
  [FormErrorCode.FILE_UPLOAD_ERROR]: '文件上传失败，请检查文件格式和大小',
  [FormErrorCode.DATABASE_ERROR]: '数据库错误，请稍后重试',
  [FormErrorCode.UNKNOWN_ERROR]: '发生未知错误，请稍后重试'
};

// 类型守卫函数
function isFormError(error: any): error is FormError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

// 错误处理工具类
export class FormErrorHandler {
  // 将错误转换为标准格式
  static normalizeError(error: any): FormError {
    if (isFormError(error)) {
      return error;
    }

    // API 错误响应
    if (error?.response?.data) {
      const apiError = error.response.data;
      return {
        code: apiError.code || FormErrorCode.SERVER_ERROR,
        message: apiError.message || ERROR_MESSAGES[FormErrorCode.SERVER_ERROR],
        field: apiError.field,
        details: apiError.details
      };
    }

    // 网络错误
    if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
      return {
        code: FormErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES[FormErrorCode.NETWORK_ERROR]
      };
    }

    // 验证错误
    if (error?.message?.includes('validation') || error?.name === 'ValidationError') {
      return {
        code: FormErrorCode.VALIDATION_ERROR,
        message: ERROR_MESSAGES[FormErrorCode.VALIDATION_ERROR],
        details: error.details
      };
    }

    // 默认未知错误
    return {
      code: FormErrorCode.UNKNOWN_ERROR,
      message: ERROR_MESSAGES[FormErrorCode.UNKNOWN_ERROR],
      details: error
    };
  }

  // 获取用户友好的错误消息
  static getUserMessage(error: FormError): string {
    return error.message;
  }

  // 检查是否为可重试错误
  static isRetryable(error: FormError): boolean {
    return [
      FormErrorCode.NETWORK_ERROR,
      FormErrorCode.SERVER_ERROR,
      FormErrorCode.RATE_LIMIT_ERROR,
      FormErrorCode.DATABASE_ERROR
    ].includes(error.code as FormErrorCode);
  }

  // 记录错误
  static logError(error: FormError, context?: any): void {
    console.group(`🚨 Form Error [${error.code}]`);
    console.error('Message:', error.message);
    console.error('Field:', error.field);
    console.error('Details:', error.details);
    console.error('Context:', context);
    console.groupEnd();
  }
}

// 重试机制
export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: FormError) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffFactor = 2,
    onRetry
  } = options;

  let lastError: FormError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (rawError) {
      const error = FormErrorHandler.normalizeError(rawError);
      lastError = error;

      if (attempt === maxAttempts || !FormErrorHandler.isRetryable(error)) {
        throw error;
      }

      const retryDelay = delay * Math.pow(backoffFactor, attempt - 1);

      if (onRetry) {
        onRetry(attempt, error);
      }

      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError!;
}

// 表单提交包装器
export interface FormSubmissionOptions<T> {
  data: T;
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  retries?: RetryOptions;
  timeout?: number;
  headers?: Record<string, string>;
  onSuccess?: (response: any) => void;
  onError?: (error: FormError) => void;
  onRetry?: (attempt: number, error: FormError) => void;
}

export async function submitForm<T>(
  options: FormSubmissionOptions<T>
): Promise<any> {
  const {
    data,
    endpoint,
    method = 'POST',
    retries = { maxAttempts: 2 },
    timeout = 30000,
    headers = {},
    onSuccess,
    onError,
    onRetry
  } = options;

  try {
    const response = await withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            response,
            data: errorData,
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`
          };
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }, {
      ...retries,
      onRetry
    });

    if (onSuccess) {
      onSuccess(response);
    }

    return response;
  } catch (rawError) {
    const error = FormErrorHandler.normalizeError(rawError);
    FormErrorHandler.logError(error, { endpoint, method, data });

    if (onError) {
      onError(error);
    }

    throw error;
  }
}

// 错误边界组件
export class FormErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Form Error Boundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            表单出现错误
          </h3>
          <p className="text-sm text-red-600 mb-3">
            {this.state.error?.message || '发生未知错误'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 表单性能监控
export class FormPerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  // 开始计时
  startTimer(key: string): void {
    this.metrics.set(key, Date.now());
  }

  // 结束计时并返回耗时
  endTimer(key: string): number {
    const startTime = this.metrics.get(key);
    if (!startTime) {
      console.warn(`No timer found for key: ${key}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.metrics.delete(key);

    // 记录性能指标
    if (duration > 1000) { // 超过1秒的操作
      console.log(`⏱️ Form Performance [${key}]: ${duration}ms`);
    }

    return duration;
  }

  // 清理所有计时器
  clearAll(): void {
    this.metrics.clear();
  }
}

// 导出单例实例
export const formPerformanceMonitor = new FormPerformanceMonitor();