'use client';

import { LucideIcon } from 'lucide-react';

interface StatBlockProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export default function StatBlock({
  value,
  label,
  icon: Icon,
  trend,
  className = '',
}: StatBlockProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow ${className}`}
    >
      {Icon && (
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-green-50 rounded-full">
            <Icon className="text-primary" size={24} />
          </div>
        </div>
      )}
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {label}
      </div>
      {trend && (
        <div
          className={`text-xs font-medium ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend.positive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  );
}

// 便捷组件：多个统计数字块横向排列
interface StatGridProps {
  stats: StatBlockProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ stats, columns = 4, className = '' }: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 my-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatBlock key={index} {...stat} />
      ))}
    </div>
  );
}
