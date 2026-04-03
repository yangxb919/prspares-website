'use client';

import { useEffect, useState } from 'react';

export default function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 200px 0px' }
    );
    observer.observe(ref);
    const fallback = setTimeout(() => setVisible(true), delay + 2000);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [ref, delay]);

  return (
    <div ref={setRef} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}
