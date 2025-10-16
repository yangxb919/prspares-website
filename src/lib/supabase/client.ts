"use client";

import { createBrowserClient } from "@supabase/ssr";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
}

function setCookie(name: string, value: string, options: any = {}) {
  if (typeof document === "undefined") return;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=/`,
    `SameSite=Lax`,
  ];
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${new Date(options.expires).toUTCString()}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  const isHttps = typeof window !== "undefined" && window.location?.protocol === "https:";
  if (options.secure ?? isHttps) parts.push(`Secure`);
  document.cookie = parts.join("; ");
}

function removeCookie(name: string, options: any = {}) {
  setCookie(name, "", { ...options, maxAge: 0 });
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: getCookie,
        set: setCookie,
        remove: removeCookie,
      },
    }
  );
  return browserClient;
}
