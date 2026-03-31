'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Cloudflare Turnstile — invisible or managed human verification widget.
 *
 * Usage:
 *   <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onVerify={setToken} />
 *
 * After verification, pass the token to your API route which calls
 * /api/turnstile/verify to validate server-side.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  /** 'interaction-only' shows when needed; 'always' always shows; 'execute' for invisible */
  appearance?: 'always' | 'execute' | 'interaction-only';
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Size */
  size?: 'normal' | 'compact';
  className?: string;
}

let scriptLoaded = false;
let scriptLoading = false;
const pendingCallbacks: (() => void)[] = [];

function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    if (scriptLoading) {
      pendingCallbacks.push(resolve);
      return;
    }
    scriptLoading = true;

    window.onTurnstileLoad = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      pendingCallbacks.forEach((cb) => cb());
      pendingCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export default function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  appearance = 'interaction-only',
  theme = 'light',
  size = 'normal',
  className = '',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;

    // Remove existing widget
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token);
      },
      'error-callback': () => {
        onError?.();
      },
      'expired-callback': () => {
        onExpire?.();
      },
      appearance,
      theme,
      size,
    });
  }, [siteKey, onVerify, onError, onExpire, appearance, theme, size]);

  useEffect(() => {
    loadTurnstileScript().then(() => {
      setIsReady(true);
      renderWidget();
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [renderWidget]);

  // Re-render if siteKey changes
  useEffect(() => {
    if (isReady) renderWidget();
  }, [isReady, renderWidget]);

  return <div ref={containerRef} className={className} />;
}

/**
 * Hook for using Turnstile in forms.
 *
 * Returns { token, isVerified, TurnstileWidget, resetTurnstile }
 */
export function useTurnstile(siteKey: string) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleVerify = useCallback((t: string) => {
    setToken(t);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setToken(null);
    setError(true);
  }, []);

  const handleExpire = useCallback(() => {
    setToken(null);
  }, []);

  const TurnstileWidget = useCallback(
    ({ className }: { className?: string } = {}) => (
      <Turnstile
        siteKey={siteKey}
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        className={className}
      />
    ),
    [siteKey, handleVerify, handleError, handleExpire]
  );

  return {
    token,
    isVerified: !!token,
    hasError: error,
    TurnstileWidget,
    resetToken: () => setToken(null),
  };
}
