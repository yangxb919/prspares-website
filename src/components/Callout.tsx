'use client';

import { Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

type CalloutType = 'info' | 'warning' | 'success';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
  },
};

export default function Callout({
  type = 'info',
  title,
  children,
  dismissible = false,
  className = '',
}: CalloutProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = calloutConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-4 my-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          {title && (
            <h4 className={`${config.titleColor} font-semibold mb-1`}>
              {title}
            </h4>
          )}
          <div className="text-gray-700 text-sm">
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// 便捷导出
export const InfoCallout = (props: Omit<CalloutProps, 'type'>) => (
  <Callout type="info" {...props} />
);

export const WarningCallout = (props: Omit<CalloutProps, 'type'>) => (
  <Callout type="warning" {...props} />
);

export const SuccessCallout = (props: Omit<CalloutProps, 'type'>) => (
  <Callout type="success" {...props} />
);
