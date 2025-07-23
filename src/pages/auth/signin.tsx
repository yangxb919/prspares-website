import { useState } from 'react'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createPublicClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      console.log('开始登录流程...')
      
      // 执行登录
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      console.log('登录成功，用户信息:', authData.user)
      
      const userId = authData.user?.id
      
      if (!userId) {
        throw new Error('登录后无法获取用户ID')
      }
      
      // 查询用户的 profile 信息
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', userId)
        .maybeSingle()
      
      // 如果没有找到用户记录，创建一个新的 profile 记录
      if (profileError || !profile) {
        console.log('用户没有 profile 记录，创建新记录')
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId, 
              display_name: email.split('@')[0], 
              role: 'author' 
            }
          ])
          .select()
          .single()
          
        if (insertError) throw insertError
        profile = newProfile
      }
      
      console.log('获取到的用户角色信息:', profile)
      
      // 刷新会话以确保服务器端能识别
      await supabase.auth.refreshSession()
      
      // 保存用户信息到本地存储
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminSessionTime', Date.now().toString())
      localStorage.setItem('userRole', profile?.role || 'author')
      localStorage.setItem('userId', userId)
      localStorage.setItem('userEmail', email)
      
      // 根据用户角色进行跳转
      if (profile && (profile.role === 'admin' || profile.role === 'author')) {
        console.log('用户有管理权限，跳转到管理页面')
        setSuccess('登录成功！正在跳转到管理后台...')
        setLoading(false)
        
        // 直接使用window.location.href进行跳转
        console.log('开始执行跳转，等待2秒确保会话同步...')
        setTimeout(() => {
          console.log('执行跳转到 /admin')
          window.location.href = '/admin'
        }, 2000)
      } else {
        console.log('用户无管理权限，跳转到首页')
        setSuccess('登录成功！正在跳转到首页...')
        setLoading(false)
        setTimeout(() => {
          console.log('执行跳转到首页')
          window.location.href = '/'
        }, 2000)
      }
      
    } catch (error: any) {
      console.error('登录过程中出错:', error)
      setError(error.message || '登录时发生错误')
      setLoading(false)
    }
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-[#00B140] hover:text-[#008631]">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div id="error-message" className="bg-red-50 border-l-4 border-red-500 p-4">
            <p id="error-text" className="text-red-700" dangerouslySetInnerHTML={{ __html: error }}></p>
          </div>
        )}

        {success && (
          <div id="success-message" className="bg-green-50 border-l-4 border-green-500 p-4">
            <p id="success-text" className="text-green-700 mb-3" dangerouslySetInnerHTML={{ __html: success }}></p>
            <div className="flex space-x-2">
              <Link 
                href="/admin" 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
              >
                手动跳转到管理后台
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
              >
                刷新页面
              </button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#00B140] focus:ring-[#00B140] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/reset-password" className="font-medium text-[#00B140] hover:text-[#008631]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
