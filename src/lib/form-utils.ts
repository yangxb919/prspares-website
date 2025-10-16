import { useEffect, useRef, useState } from 'react';

// 表单持久化工具
export class FormPersistence {
  private storageKey: string;

  constructor(formId: string) {
    this.storageKey = `form_data_${formId}`;
  }

  // 保存表单数据到 localStorage
  saveData(data: Record<string, any>): void {
    try {
      const saveData = {
        ...data,
        _timestamp: Date.now(),
        _version: '1.0'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }

  // 从 localStorage 恢复表单数据
  loadData(): Record<string, any> | null {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData);

      // 检查数据是否过期（7天）
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parsed._timestamp > sevenDays) {
        this.clearData();
        return null;
      }

      // 移除内部字段
      const { _timestamp, _version, ...formData } = parsed;
      return formData;
    } catch (error) {
      console.warn('Failed to load form data:', error);
      return null;
    }
  }

  // 清除保存的表单数据
  clearData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  }

  // 检查是否有保存的数据
  hasSavedData(): boolean {
    return this.loadData() !== null;
  }
}

// 表单自动保存 Hook
export function useFormAutoSave(formId: string, data: Record<string, any>, delay = 2000) {
  const persistence = useRef(new FormPersistence(formId));
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // 延迟保存，避免频繁写入
    timeoutRef.current = setTimeout(() => {
      persistence.current.saveData(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, formId, delay]);

  // 页面卸载时立即保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      persistence.current.saveData(data);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [data]);

  return persistence.current;
}

// 防止页面导航丢失数据的 Hook
export function usePreventDataLoss(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '您有未保存的更改，确定要离开吗？';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}

// 表单恢复工具
export function useFormRecovery<T>(formId: string, defaultValues: T) {
  const persistence = useRef(new FormPersistence(formId));

  const getSavedData = (): T | null => {
    const saved = persistence.current.loadData();
    return saved as T || null;
  };

  const clearSavedData = () => {
    persistence.current.clearData();
  };

  const hasSavedData = persistence.current.hasSavedData();

  return {
    savedData: getSavedData(),
    clearSavedData,
    hasSavedData
  };
}

// 检测表单更改
export function useFormChanges(defaultValues: Record<string, any>) {
  const initialValuesRef = useRef(defaultValues);

  const hasChanges = (currentValues: Record<string, any>): boolean => {
    const initial = initialValuesRef.current;
    return JSON.stringify(initial) !== JSON.stringify(currentValues);
  };

  const resetToInitial = (setValue: (values: any) => void) => {
    setValue(initialValuesRef.current);
  };

  return {
    hasChanges,
    resetToInitial
  };
}

// 表单提交状态管理
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  successMessage: string | null;
}

export function useFormSubmission() {
  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    successMessage: null
  });

  const setSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting: isSubmitting }));
  };

  const setSuccess = (message: string) => {
    setState(prev => ({
      ...prev,
      isSuccess: true,
      isError: false,
      error: null,
      successMessage: message
    }));
  };

  const setError = (error: string) => {
    setState(prev => ({
      ...prev,
      isSuccess: false,
      isError: true,
      error,
      successMessage: null
    }));
  };

  const reset = () => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      error: null,
      successMessage: null
    });
  };

  return {
    state,
    setSubmitting,
    setSuccess,
    setError,
    reset
  };
}