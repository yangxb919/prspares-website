"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import "../superdesign.css";
import Link from "next/link";

function ResetPasswordClientInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checking, setChecking] = useState(true);

  // 检查 URL 参数并验证 token
  useEffect(() => {
    if (!searchParams) {
      setError("Invalid or expired password reset link. Please request a new one.");
      setChecking(false);
      return;
    }

    const type = searchParams.get("type");
    const token = searchParams.get("token");

    console.log("Reset password page loaded with params:", { type, token: token ? "present" : "missing" });

    // 验证是否是密码重置链接
    if (type === "recovery" && token) {
      // 验证 token 并建立会话
      verifyToken(token);
    } else {
      setError("Invalid or expired password reset link. Please request a new one.");
      setChecking(false);
    }
  }, [searchParams]);

  // 验证 token 并建立会话
  const verifyToken = async (token: string) => {
    try {
      console.log("Verifying token and establishing session...");

      const supabase = getBrowserClient();

      // 使用 token 验证并建立会话
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (error) {
        console.error("Token verification error:", error);
        setError("Invalid or expired password reset link. Please request a new one.");
        setValidToken(false);
        setChecking(false);
        return;
      }

      console.log("Token verified successfully, session established:", data);
      setValidToken(true);
      setChecking(false);
    } catch (error: any) {
      console.error("Unexpected error during token verification:", error);
      setError("Failed to verify reset link. Please try again.");
      setValidToken(false);
      setChecking(false);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // 验证密码
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const supabase = getBrowserClient();
      
      console.log("Attempting to update password...");
      
      // 更新密码
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      console.log("Password updated successfully:", data);
      
      setSuccess(true);
      
      // 3秒后跳转到登录页面
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, router]);

  // 请求新的重置链接
  const requestNewLink = useCallback(() => {
    router.push("/forgot-password");
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-gray-400">Verifying reset link...</div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="login-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-red-400">Invalid Link</h1>
            <p className="text-gray-400 mt-2">This password reset link is invalid or has expired</p>
          </div>
          
          {error && (
            <div role="alert" className="text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="button"
              onClick={requestNewLink}
              className="btn-primary w-full py-3 font-semibold"
            >
              Request New Reset Link
            </button>
            
            <p className="text-sm text-center text-gray-400">
              Remember your password? <Link href="/login" className="underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="login-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-green-400">Password Reset Successful!</h1>
            <p className="text-gray-400 mt-2">Your password has been updated successfully</p>
          </div>
          
          <div role="status" className="text-sm text-green-400 text-center" aria-live="polite">
            Redirecting to login page in 3 seconds...
          </div>

          <div>
            <Link href="/login" className="btn-primary w-full py-3 font-semibold block text-center">
              Go to Login
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
          <h1 className="text-3xl font-bold tracking-tight">Reset Your Password</h1>
          <p className="text-gray-400 mt-2">Enter your new password below</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-label="Reset password form">
          {error && (
            <div role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              New Password
            </label>
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
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              autoComplete="new-password"
              className="form-input w-full px-4 py-3 mt-2"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <div>
            <button 
              type="submit" 
              className="btn-primary w-full py-3 font-semibold" 
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ResetPasswordClientInner />
    </Suspense>
  );
}

