import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import { convertToProduct, convertToProducts, convertToPost, convertToPosts, convertToContactSubmissions, convertToNewsletterSubscriptions, convertToPostSEOInfos, safeString, safeNumber } from '@/utils/type-converters';

// Article type definition based on Supabase posts table
type Post = {
  id: number
  author_id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'publish' | 'private'
  comment_status: string
  published_at: string | null
  created_at: string
  updated_at: string
  meta: any
}

export default function ArticleManagement() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createPublicClient()

  // Check user authentication status and permissions
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check local storage
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')
        const userEmail = localStorage.getItem('userEmail')
        
        if (isLoggedIn && (userRole === 'admin' || userRole === 'author')) {
          // Use local storage info to set user state first
          setUser({
            email: userEmail,
            id: localStorage.getItem('userId')
          })
          fetchPostsWithLocalUser()
          return
        }
        
        // If no local storage info, try to get from Supabase
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push('/auth/signin')
          return
        }
        
        // Check if user has admin privileges
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        
        if (error || !profile || (profile.role !== 'admin' && profile.role !== 'author')) {
          router.push('/')
          return
        }
        
        setUser(data.user)
        fetchPosts(data.user)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth/signin')
      }
    }
    
    checkUser()
  }, [])

  // Fetch posts using local user info
  const fetchPostsWithLocalUser = async () => {
    const userRole = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')

    console.log('🔍 Fetching posts with local user:', { userRole, userId })

    setLoading(true)

    // 🔧 修改：所有用户都可以看到所有文章
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })

    console.log('👑 Fetching all posts (权限已修改：所有用户都可以看到所有文章)')

    const { data, error } = await query

    if (error) {
      console.error('❌ Failed to fetch articles:', error)
      alert(`Failed to fetch articles: ${error.message}`)
    } else {
      console.log('✅ Fetched posts:', data)
      console.log('📊 Number of posts:', data?.length || 0)
      setPosts((data as any) || [])
    }
    setLoading(false)
  }

  // Fetch article list
  const fetchPosts = async (currentUser?: any) => {
    const targetUser = currentUser || user
    if (!targetUser) {
      console.log('⚠️ No target user, skipping fetch')
      return
    }

    console.log('🔍 Fetching posts with user:', targetUser)

    setLoading(true)

    // 🔧 修改：所有用户都可以看到所有文章
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })

    console.log('👑 Fetching all posts (权限已修改：所有用户都可以看到所有文章)')

    const { data, error } = await query

    if (error) {
      console.error('❌ Failed to fetch articles:', error)
      alert(`Failed to fetch articles: ${error.message}`)
    } else {
      console.log('✅ Fetched posts:', data)
      console.log('📊 Number of posts:', data?.length || 0)
      setPosts((data as any) || [])
    }
    setLoading(false)
  }

  // Delete article
  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', String(id))
    
    if (error) {
      alert(`Failed to delete article: ${error.message}`)
    } else {
      // Refresh article list
      fetchPosts()
    }
  }

  // Update article status (publish/draft)
  const updatePostStatus = async (id: number, newStatus: 'draft' | 'publish' | 'private') => {
    const { error } = await supabase
      .from('posts')
      .update({ 
        status: newStatus,
        ...(newStatus === 'publish' ? { published_at: new Date().toISOString() } : {})
      })
      .eq('id', String(id))
    
    if (error) {
      alert(`Failed to update status: ${error.message}`)
    } else {
      // Refresh article list
      fetchPosts()
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Article Management</h2>
            <p className="text-gray-900">Loading your articles...</p>
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
              <Link href="/admin" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</span>
                  <p className="text-xs text-gray-800">Content Management</p>
                </div>
              </Link>
              
              {/* Navigation tabs */}
              <div className="ml-8 flex space-x-1 bg-gray-100/50 rounded-full p-1 backdrop-blur-sm">
                <Link href="/admin/articles" className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500 text-white shadow-sm transition-all duration-200">
                  Blog Articles
                </Link>
                <Link href="/admin/products" className="px-4 py-2 text-sm font-medium rounded-full text-gray-900 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  Products
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">{user?.email}</span>
              </div>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/auth/signin')
                }}
                className="bg-white/50 hover:bg-white/70 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/30 hover:scale-105"
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
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
                Blog Article Management
              </h1>
              <p className="text-lg text-gray-900">Create, edit, and manage your blog content</p>
            </div>
            <Link 
              href="/admin/articles/new" 
              className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Article
            </Link>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Articles Yet</h3>
                  <p className="text-gray-900 mb-8">Get started by creating your first blog article!</p>
                  <Link 
                    href="/admin/articles/new" 
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Article
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.status === 'publish' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : post.status === 'private' 
                                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {post.status === 'publish' ? 'Published' : post.status === 'private' ? 'Private' : 'Draft'}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            {post.title}
                          </h2>
                          <div className="text-sm text-gray-800 space-y-1">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Created: {formatDate(post.created_at)}
                            </div>
                            {post.status === 'publish' && post.published_at && (
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Published: {formatDate(post.published_at)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-wrap gap-2">
                          {post.status !== 'publish' && (
                            <button 
                              onClick={() => updatePostStatus(post.id, 'publish')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Publish
                            </button>
                          )}
                          {post.status !== 'draft' && (
                            <button 
                              onClick={() => updatePostStatus(post.id, 'draft')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Draft
                            </button>
                          )}
                          <Link 
                            href={`/admin/articles/${post.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <Link
                            href={`/admin/articles/${post.id}/seo`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            SEO
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
