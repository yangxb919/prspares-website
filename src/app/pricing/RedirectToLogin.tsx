'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    // Clear any existing session data
    if (typeof window !== 'undefined') {
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
    }

    // Force redirect to login with pricing as next page
    router.replace('/login?next=/pricing');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-gray-400 mb-4">
          You need to be logged in to view product pricing. Redirecting to login page...
        </p>
        <div className="text-sm text-gray-500">
          <p>If you don't have an account, you can register for free.</p>
        </div>
      </div>
    </div>
  );
}
