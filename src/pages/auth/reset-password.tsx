import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checking, setChecking] = useState(true)
  const supabase = createPublicClient()

  // 检查 URL 参数并验证 token
  useEffect(() => {
    if (!router.isReady) return

    const { type, token } = router.query

    console.log('Reset password page loaded with params:', { type, token: token ? 'present' : 'missing' })

    // 验证是否是密码重置链接
    if (type === 'recovery' && token) {
      // 验证 token 并建立会话
      verifyToken(token as string)
    } else {
      setError('Invalid or expired password reset link. Please request a new one.')
      setChecking(false)
    }
  }, [router.isReady, router.query])

  // 验证 token 并建立会话
  const verifyToken = async (token: string) => {
    try {
      console.log('Verifying token and establishing session...')

      // 使用 token 验证并建立会话
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      })

      if (error) {
        console.error('Token verification error:', error)
        setError('Invalid or expired password reset link. Please request a new one.')
        setValidToken(false)
        setChecking(false)
        return
      }

      console.log('Token verified successfully, session established:', data)
      setValidToken(true)
      setChecking(false)
    } catch (error: any) {
      console.error('Unexpected error during token verification:', error)
      setError('Failed to verify reset link. Please try again.')
      setValidToken(false)
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 验证密码
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      console.log('Attempting to update password...')

      // 更新密码
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        console.error('Password update error:', error)
        throw error
      }

      console.log('Password updated successfully:', data)

      setSuccess(true)

      // 3秒后跳转到登录页面
      setTimeout(() => {
        router.push('/auth/signin')
      }, 3000)

    } catch (error: any) {
      console.error('Password reset error:', error)
      setError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Verifying reset link...</div>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/PRSPARES1 .png"
                alt="PRSPARES Logo"
                width={240}
                height={78}
                className="mx-auto h-16 w-auto"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">Invalid Link</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              This password reset link is invalid or has expired
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/auth/forgot-password"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
            >
              Request New Reset Link
            </Link>

            <p className="text-sm text-center text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/signin" className="font-medium text-[#00B140] hover:text-[#008631]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/PRSPARES1 .png"
                alt="PRSPARES Logo"
                width={240}
                height={78}
                className="mx-auto h-16 w-auto"
              />
            </Link>
            <div className="mt-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">Password Reset Successful!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been updated successfully
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700">Redirecting to login page in 3 seconds...</p>
          </div>

          <div>
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/PRSPARES1 .png"
              alt="PRSPARES Logo"
              width={240}
              height={78}
              className="mx-auto h-16 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/auth/signin" className="font-medium text-[#00B140] hover:text-[#008631]">
              Remember your password? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
