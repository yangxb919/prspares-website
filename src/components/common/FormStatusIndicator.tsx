'use client';

import { useState, useEffect } from 'react';
import { FormPersistence } from '@/lib/form-utils';
import { Save, AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface FormStatusIndicatorProps {
  formId: string;
  formData: Record<string, any>;
  isDirty: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  className?: string;
}

export function FormStatusIndicator({
  formId,
  formData,
  isDirty,
  isSubmitting,
  isSuccess,
  isError,
  className
}: FormStatusIndicatorProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const persistence = new FormPersistence(formId);

  // 检查网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始检查
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 自动保存逻辑
  useEffect(() => {
    if (!isDirty || isSubmitting) return;

    const saveTimer = setTimeout(() => {
      setSaveStatus('saving');

      try {
        persistence.saveData(formData);
        setLastSaved(new Date());
        setSaveStatus('saved');

        // 2秒后恢复到空闲状态
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [formData, isDirty, isSubmitting, formId]);

  // 检查是否有保存的数据
  const hasSavedData = persistence.hasSavedData();

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn(
      'flex items-center justify-between text-xs text-gray-500',
      'bg-gray-50 rounded-md px-3 py-2 border',
      className
    )}>
      {/* 左侧状态指示器 */}
      <div className="flex items-center space-x-4">
        {/* 网络状态 */}
        <div className="flex items-center">
          {isOnline ? (
            <Wifi className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
            {isOnline ? '在线' : '离线'}
          </span>
        </div>

        {/* 表单状态 */}
        {isSubmitting && (
          <div className="flex items-center text-blue-600">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            提交中...
          </div>
        )}

        {isSuccess && !isSubmitting && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            提交成功
          </div>
        )}

        {isError && !isSubmitting && (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            提交失败
          </div>
        )}

        {/* 自动保存状态 */}
        {saveStatus === 'saving' && (
          <div className="flex items-center text-blue-600">
            <Save className="h-3 w-3 mr-1 animate-pulse" />
            自动保存中...
          </div>
        )}

        {saveStatus === 'saved' && lastSaved && (
          <div className="flex items-center text-green-600">
            <Save className="h-3 w-3 mr-1" />
            已保存 {formatTime(lastSaved)}
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            保存失败
          </div>
        )}
      </div>

      {/* 右侧指示器 */}
      <div className="flex items-center space-x-2">
        {/* 未保存更改指示器 */}
        {isDirty && saveStatus === 'idle' && (
          <div className="flex items-center text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
            未保存的更改
          </div>
        )}

        {/* 已保存数据指示器 */}
        {hasSavedData && !isDirty && (
          <div className="text-gray-400">
            已保存数据可用
          </div>
        )}
      </div>
    </div>
  );
}

// 简化版状态指示器，用于小空间
export function CompactFormStatus({
  isDirty,
  isSubmitting,
  isSuccess,
  isError
}: {
  isDirty: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      {isSubmitting && (
        <div className="flex items-center text-blue-600 text-xs">
          <Clock className="h-3 w-3 mr-1 animate-spin" />
          提交中
        </div>
      )}

      {isSuccess && !isSubmitting && (
        <div className="flex items-center text-green-600 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          成功
        </div>
      )}

      {isError && !isSubmitting && (
        <div className="flex items-center text-red-600 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          失败
        </div>
      )}

      {isDirty && !isSubmitting && !isSuccess && !isError && (
        <div className="flex items-center text-orange-600 text-xs">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
          有更改
        </div>
      )}
    </div>
  );
}

// 导航阻止确认对话框
interface NavigationGuardProps {
  when: boolean;
  message?: string;
}

export function NavigationGuard({ when, message }: NavigationGuardProps) {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || '您有未保存的更改，确定要离开吗？';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message]);

  return null;
}

// 增强的无障碍表单字段包装器
interface AccessibleFieldProps {
  children: React.ReactNode;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  id: string;
}

export function AccessibleField({
  children,
  label,
  description,
  error,
  required,
  id
}: AccessibleFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-medium',
          error ? 'text-red-600' : 'text-gray-700'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {children}

      {description && (
        <p
          id={`${id}-description`}
          className="text-xs text-gray-500"
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// 键盘导航提示组件
interface KeyboardShortcutsProps {
  shortcuts: Array<{
    key: string;
    description: string;
    action: () => void;
  }>;
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase());
        if (shortcut) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <div className="sr-only" role="region" aria-label="Keyboard shortcuts">
      <p>Available keyboard shortcuts:</p>
      <ul>
        {shortcuts.map((shortcut, index) => (
          <li key={index}>
            {shortcut.key} - {shortcut.description}
          </li>
        ))}
      </ul>
    </div>
  );
}