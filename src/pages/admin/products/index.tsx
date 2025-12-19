import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import Image from 'next/image'
import { convertToProducts } from '@/utils/type-converters'

// Product type definition based on Supabase products table
type Product = {
  id: string
  author_id: string
  name: string
  slug: string
  sku: string
  type: 'simple' | 'variable' | 'virtual'
  short_desc: string
  description: string
  regular_price: number
  sale_price: number | null
  sale_start: string | null
  sale_end: string | null
  tax_status: string
  stock_status: 'instock' | 'outofstock'
  stock_quantity: number | null
  weight: number | null
  dim_length: number | null
  dim_width: number | null
  dim_height: number | null
  attributes: any[]
  images: any[]
  status: 'draft' | 'publish'
  created_at: string
  updated_at: string
  meta: any
}

export default function ProductManagement() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'publish' | 'draft'>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all')
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
          fetchProductsWithLocalUser()
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
        fetchProducts(data.user)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth/signin')
      }
    }
    
    checkUser()
  }, [])

  // Fetch products using local user info
  const fetchProductsWithLocalUser = async () => {
    const userRole = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')
    
    setLoading(true)
    
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    
    // If author, can only see their own products
    if (userRole === 'author') {
      query = query.eq('author_id', String(userId))
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Failed to fetch products:', error)
    } else {
      setProducts((data as any) || [])
    }
    setLoading(false)
  }

  // Fetch product list
  const fetchProducts = async (currentUser?: any) => {
    const targetUser = currentUser || user
    if (!targetUser) return
    
    setLoading(true)
    
    // Admin can see all products, author can only see their own
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', targetUser.id)
      .single()

    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    
    // If author, can only see their own products
    if (profile?.role === 'author') {
      query = query.eq('author_id', targetUser.id)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Failed to fetch products:', error)
    } else {
      setProducts((data as any) || [])
    }
    setLoading(false)
  }

  // Delete product
  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', String(id))
    
    if (error) {
      alert(`Failed to delete product: ${error.message}`)
    } else {
      // Refresh product list
      fetchProducts()
    }
  }

  // Update product status (publish/draft)
  const updateProductStatus = async (id: string, newStatus: 'draft' | 'publish') => {
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', String(id))
    
    if (error) {
      alert(`Failed to update status: ${error.message}`)
    } else {
      // Refresh product list
      fetchProducts()
    }
  }

  // Format price
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get product image
  const getProductImage = (images: any[]) => {
    if (!images || images.length === 0) return '/placeholder-product.jpg'
    return images[0]?.url || '/placeholder-product.jpg'
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesStock = stockFilter === 'all' || product.stock_status === stockFilter
    
    return matchesSearch && matchesStatus && matchesStock
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Management</h2>
            <p className="text-gray-900">Loading your products...</p>
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
                <Link href="/admin/articles" className="px-4 py-2 text-sm font-medium rounded-full text-gray-900 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  Blog Articles
                </Link>
                <Link href="/admin/products" className="px-4 py-2 text-sm font-medium rounded-full bg-green-500 text-white shadow-sm transition-all duration-200">
                  Products
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
                  Product Management
                </h1>
                <p className="text-lg text-gray-900">Create, edit, and manage your product catalog</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/products/new"
                  className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Product
                </Link>
                <Link
                  href="/admin/products/image-helper"
                  className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image Helper
                </Link>
                <Link
                  href="/admin/products/bulk-upload"
                  className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Bulk Upload
                </Link>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Search Products</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Stock Status</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Stock</option>
                    <option value="instock">In Stock</option>
                    <option value="outofstock">Out of Stock</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setStockFilter('all')
                    }}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-all duration-200 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {products.length === 0 ? 'No Products Yet' : 'No Products Found'}
                  </h3>
                  <p className="text-gray-900 mb-8">
                    {products.length === 0 
                      ? 'Get started by creating your first product!' 
                      : 'Try adjusting your search criteria.'}
                  </p>
                  {products.length === 0 && (
                    <Link 
                      href="/admin/products/new" 
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create New Product
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    {/* Product Image */}
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-t-2xl">
                      <Image
                        src={getProductImage(product.images)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'publish' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {product.status === 'publish' ? 'Published' : 'Draft'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock_status === 'instock' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-800">SKU: {product.sku || 'N/A'}</p>
                        {product.short_desc && (
                          <p className="text-sm text-gray-900 mt-2 line-clamp-2">{product.short_desc}</p>
                        )}
                      </div>

                      {/* Price and Stock */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            {product.sale_price ? (
                              <>
                                <span className="text-lg font-bold text-green-600">{formatPrice(product.sale_price)}</span>
                                <span className="text-sm text-gray-800 line-through">{formatPrice(product.regular_price)}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">{formatPrice(product.regular_price)}</span>
                            )}
                          </div>
                          {product.stock_quantity !== null && (
                            <p className="text-xs text-gray-800">Stock: {product.stock_quantity}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-800">Created</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(product.created_at)}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {product.status !== 'publish' && (
                          <button 
                            onClick={() => updateProductStatus(product.id, 'publish')}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Publish
                          </button>
                        )}
                        {product.status !== 'draft' && (
                          <button 
                            onClick={() => updateProductStatus(product.id, 'draft')}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Draft
                          </button>
                        )}
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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
