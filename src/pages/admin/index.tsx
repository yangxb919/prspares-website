import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import Image from 'next/image'

// Admin dashboard main component
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [authDebug, setAuthDebug] = useState<string>('Checking authentication...')
  const [stats, setStats] = useState({ articles: 0, products: 0, contacts: 0, newsletter: 0 })
  const router = useRouter()
  const supabase = createPublicClient()

  // Function to fetch dashboard statistics
  const fetchStats = async () => {
    try {
      // Fetch articles count
      const { count: articlesCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'publish')

      // Fetch products count (all products including draft and publish)
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch contact forms count
      const { count: contactsCount } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })

      // Fetch newsletter subscriptions count
      const { count: newsletterCount } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      setStats({
        articles: articlesCount || 0,
        products: productsCount || 0,
        contacts: contactsCount || 0,
        newsletter: newsletterCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Keep default values if fetch fails
    }
  }

  // User authentication logic - simplified version
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Loading admin page...')
        setAuthDebug('Checking login status...')

        // First check local storage for login information
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')
        const userEmail = localStorage.getItem('userEmail')
        const userId = localStorage.getItem('userId')

        if (isLoggedIn && (userRole === 'admin' || userRole === 'author') && userId) {
          console.log('Loading user info from local storage')
          setUser({
            email: userEmail,
            role: userRole,
            display_name: userEmail?.split('@')[0] || 'Admin User'
          })
          setLoading(false)
          setAuthDebug('Login successful, admin page loaded')
          
          // Fetch dashboard statistics
          fetchStats()

          // Verify session validity in background without blocking UI
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
              console.log('Session expired, need to re-login')
              localStorage.clear()
              setError('Login has expired, please login again. <a href="/auth/signin" class="font-bold text-blue-600 hover:underline">Click here to login</a>')
              setUser(null)
            }
          }).catch(err => {
            console.error('Error verifying session:', err)
          })

          return
        }

        // If no login info in local storage, try to get session from Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          console.log('Loading user info from Supabase session')

          // Get user profile information
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, display_name')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profileData && (profileData.role === 'admin' || profileData.role === 'author')) {
            // Update local storage
            localStorage.setItem('adminLoggedIn', 'true')
            localStorage.setItem('adminSessionTime', Date.now().toString())
            localStorage.setItem('userRole', profileData.role)
            localStorage.setItem('userId', session.user.id)
            localStorage.setItem('userEmail', session.user.email || '')

            setUser({
              email: session.user.email,
              role: profileData.role,
              display_name: profileData.display_name || session.user.email?.split('@')[0] || 'Admin User'
            })

            setError(null)
            setAuthDebug('Login successful, admin page loaded')
            setLoading(false)
            
            // Fetch dashboard statistics
            fetchStats()
            return
          } else {
            setError('You do not have admin privileges. <a href="/" class="font-bold text-blue-600 hover:underline">Return to homepage</a>')
          }
        } else {
          setError('Please login first to access the admin page. <a href="/auth/signin" class="font-bold text-blue-600 hover:underline">Click here to login</a>')
        }

        setLoading(false)

      } catch (error) {
        console.error('Error verifying user:', error)
        setError(`Verification failed. <a href="/auth/signin" class="font-bold text-blue-600 hover:underline">Click here to re-login</a>`)
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600 mb-6">Verifying your identity...</p>
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm">
              <p className="font-medium">Authentication Status:</p>
              <p className="text-blue-600">{authDebug}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentication Failed</h2>
            <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: error }}></div>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm mb-6">
              <p className="font-medium">Debug Information:</p>
              <p className="text-blue-600">{authDebug}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={async () => {
                  try {
                    await supabase.auth.refreshSession();
                    window.location.reload();
                  } catch (e) {
                    console.error('Failed to refresh session:', e);
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Refresh Session
              </button>
              <div className="flex space-x-3">
                <Link href="/auth/signin" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center">
                  Re-login
                </Link>
                <Link href="/" className="flex-1 border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 text-center">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern top navigation */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</span>
                  <p className="text-xs text-gray-500">Content Management</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.display_name || user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{user?.display_name || user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/auth/signin')
                }}
                className="bg-white/50 hover:bg-white/70 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/30 hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-8">
        {/* Header section */}
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-4">
                Welcome Back!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage your content and monitor your platform performance from this dashboard.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.articles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Contact Forms</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contacts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.newsletter}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Management cards */}
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Blog Management Card */}
              <Link href="/admin/articles" className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Blog Management
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Create, edit, and manage your blog articles. Control your content publishing workflow.
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <span>Manage Articles</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Product Management Card */}
              <Link href="/admin/products" className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-green-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    Product Management
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Add, edit, and organize your product catalog. Manage inventory and product details.
                  </p>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <span>Manage Products</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Contact Management Card */}
              <Link href="/admin/contacts" className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-orange-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    Contact Management
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    View and manage contact form submissions from your website visitors. Track inquiries and responses.
                  </p>
                  <div className="flex items-center text-sm text-orange-600 font-medium">
                    <span>Manage Contacts</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Newsletter Management Card */}
              <Link href="/admin/newsletter" className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-purple-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    Newsletter Management
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    View and manage newsletter subscriptions. Export subscriber lists and track engagement.
                  </p>
                  <div className="flex items-center text-sm text-purple-600 font-medium">
                    <span>Manage Subscribers</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* SEO Management Card */}
              <Link href="/admin/seo" className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-indigo-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    SEO Management
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Monitor and optimize SEO performance. Manage meta tags, keywords, and search engine visibility.
                  </p>
                  <div className="flex items-center text-sm text-indigo-600 font-medium">
                    <span>Manage SEO</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
