"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import "../superdesign.css";

export default function LoginPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const unconfirmed = search.get("unconfirmed");
  const nextUrl = useMemo(() => search.get("next") || "/pricing", [search]);

  useEffect(() => {
    if (unconfirmed) {
      setInfo("Your email is not confirmed yet. Please check your inbox and confirm before logging in.");
    }
  }, [unconfirmed]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Common case: email not confirmed
        if (error.message?.toLowerCase().includes("confirm") || error.message?.toLowerCase().includes("verified")) {
          setError("Email not confirmed. Please confirm via the email we sent.");
        } else {
          setError(error.message);
        }
        return;
      }
      // Defensive check for confirmation status
      const user = data.user;
      const confirmed = (user as any)?.email_confirmed_at || (user as any)?.confirmed_at;
      if (!confirmed) {
        await supabase.auth.signOut();
        setError("Email not confirmed. Please confirm via the email we sent.");
        return;
      }
      // Ensure server sees the new auth cookies and redirect
      console.log('Login successful, redirecting to:', nextUrl);
      window.location.href = nextUrl; // Force full page reload to ensure middleware runs
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [email, password, router, nextUrl]);

  const resend = useCallback(async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      setResending(true);
      const supabase = getBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      } as any);
      if (error) throw error;
      setInfo("Confirmation email resent. Please check your inbox (and spam).");
    } catch (err: any) {
      setError(err?.message || "Failed to resend email");
    } finally {
      setResending(false);
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="login-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to view product pricing</p>
        </div>
        {info && (
          <div role="status" className="text-sm text-green-400" aria-live="polite">{info}</div>
        )}
        {error && (
          <div role="alert" className="text-sm text-red-400">{error}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit} aria-label="Login form">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="form-input w-full px-4 py-3 mt-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="form-input w-full px-4 py-3 mt-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn-primary w-full py-3 font-semibold" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={resend}
              className="w-full py-2 text-sm underline"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend confirmation email"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          No account? <Link href="/register" className="underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
