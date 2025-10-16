'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase/client';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const supabase = getBrowserClient();
        await supabase.auth.signOut();
        
        // Clear all local storage and session storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
        
        // Force redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if logout fails
        window.location.href = '/';
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Logging out...</p>
      </div>
    </div>
  );
}
