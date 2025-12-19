"use client";

import { useCallback, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import "../superdesign.css";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getBrowserClient();
      const origin = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      console.log("Sending password reset email to:", email);
      console.log("Redirect URL:", `${origin}/reset-password`);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }

      console.log("Password reset email sent successfully");
      setSent(true);
    } catch (err: any) {
      console.error("Failed to send reset email:", err);
      setError(err?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const resendEmail = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const supabase = getBrowserClient();
      const origin = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) throw error;

      setError(null);
      alert("Reset email resent successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  }, [email]);

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="login-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-green-400">Check Your Email</h1>
            <p className="text-gray-400 mt-2">We've sent a password reset link to</p>
            <p className="text-white font-medium mt-1">{email}</p>
          </div>

          <div role="status" className="text-sm text-gray-300 text-center space-y-2" aria-live="polite">
            <p>Click the link in the email to reset your password.</p>
            <p className="text-gray-500">The link will expire in 1 hour.</p>
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={resendEmail}
              className="w-full py-2 text-sm underline text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              {loading ? "Resending..." : "Didn't receive the email? Resend"}
            </button>

            <Link 
              href="/login" 
              className="block text-center btn-primary w-full py-3 font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="login-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-label="Forgot password form">
          {error && (
            <div role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email address
            </label>
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
            <button 
              type="submit" 
              className="btn-primary w-full py-3 font-semibold" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-400">
          Remember your password? <Link href="/login" className="underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

