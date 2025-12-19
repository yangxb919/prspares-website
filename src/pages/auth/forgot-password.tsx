import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createPublicClient } from '@/utils/supabase-public'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  // 在客户端初始化Supabase
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = createPublicClient()
        setSupabase(client)
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        setError('Failed to initialize authentication system')
      }
    }

    initSupabase()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!supabase) {
      setError('Authentication system not ready. Please refresh the page.')
      setLoading(false)
      return
    }

    try {
      const origin = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      console.log('Sending password reset email to:', email)
      console.log('Redirect URL:', `${origin}/auth/reset-password`)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      })

      if (error) throw error

      console.log('Password reset email sent successfully')
      setSuccess(true)
    } catch (error: any) {
      console.error('Failed to send reset email:', error)
      setError(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendEmail = async () => {
    setError(null)
    setLoading(true)

    try {
      const origin = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      })

      if (error) throw error

      setError(null)
      alert('Reset email resent successfully!')
    } catch (error: any) {
      setError(error.message || 'Failed to resend email')
    } finally {
      setLoading(false)
    }
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a password reset link to
            </p>
            <p className="mt-1 text-center text-sm font-medium text-gray-900">{email}</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="text-sm text-blue-700 space-y-2">
              <p>Click the link in the email to reset your password.</p>
              <p className="text-blue-600">The link will expire in 1 hour.</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={resendEmail}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
              disabled={loading}
            >
              {loading ? 'Resending...' : "Didn't receive the email? Resend"}
            </button>

            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
            >
              Back to Login
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

