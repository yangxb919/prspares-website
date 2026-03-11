'use client';

import ReadingProgress from '@/components/ReadingProgress';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
