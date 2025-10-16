"use client";

import { useCallback, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import "../superdesign.css";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="login-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Register to view product pricing</p>
        </div>
        {sent ? (
          <div className="space-y-4">
            <div role="status" className="text-sm text-green-400" aria-live="polite">
              Confirmation email sent. Please check your inbox and verify your email.
            </div>
            <button
              type="button"
              className="underline text-sm"
              onClick={async () => {
                try {
                  setError(null);
                  setResending(true);
                  const supabase = getBrowserClient();
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  const { error } = await supabase.auth.resend({
                    type: "signup",
                    email,
                    options: { emailRedirectTo: `${origin}/auth/callback` },
                  } as any);
                  if (error) throw error;
                } catch (err: any) {
                  setError(err?.message || "Failed to resend email");
                } finally {
                  setResending(false);
                }
              }}
              disabled={resending}
            >
              {resending ? "Resending..." : "Didn’t get it? Resend confirmation"}
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={onSubmit} aria-label="Register form">
            {error && <div role="alert" className="text-sm text-red-400">{error}</div>}
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
                autoComplete="new-password"
                className="form-input w-full px-4 py-3 mt-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="btn-primary w-full py-3 font-semibold" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
        )}
        <p className="text-sm text-center text-gray-400">
          Already have an account? <Link href="/login" className="underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
