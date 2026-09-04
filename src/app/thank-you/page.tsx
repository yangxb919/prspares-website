import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThankYouClient from './ThankYouClient';

export const metadata: Metadata = {
  title: 'Thank You - PRSPARES',
  description: 'Thank you for contacting PRSPARES. We will get back to you within 24 hours.',
  robots: { index: false, follow: true },
};

export default function ThankYou() {
  // ThankYouClient 用了 useSearchParams()，静态预渲染时必须包 Suspense，
  // 否则整页构建失败（2026-09-04 全站恢复静态渲染后暴露出来的）。
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
} 