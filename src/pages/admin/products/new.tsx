import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import { ensureProductImagesSetup } from '@/utils/supabase-storage-setup'
import { compressImages, COMPRESSION_PRESETS } from '@/utils/imageCompression'
import Link from 'next/link'
import Image from 'next/image'

// Product form data type
type ProductFormData = {
  name: string
  slug: string
  sku: string
  type: 'simple' | 'variable' | 'virtual'
  short_desc: string
  description: string
  regular_price: string
  sale_price: string
  sale_start: string
  sale_end: string
  tax_status: string
  stock_status: 'instock' | 'outofstock'
  stock_quantity: string
  weight: string
  dim_length: string
  dim_width: string
  dim_height: string
  images: string[]
  status: 'draft' | 'publish'
}

export default function AddProduct() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const router = useRouter()
  const supabase = createPublicClient()

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    sku: '',
    type: 'simple',
    short_desc: '',
    description: '',
    regular_price: '',
    sale_price: '',
    sale_start: '',
    sale_end: '',
    tax_status: 'taxable',
    stock_status: 'instock',
    stock_quantity: '',
    weight: '',
    dim_length: '',
    dim_width: '',
    dim_height: '',
    images: [],
    status: 'draft'
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      try {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')
        const userEmail = localStorage.getItem('userEmail')
        const userId = localStorage.getItem('userId')
        
        if (isLoggedIn && (userRole === 'admin' || userRole === 'author')) {
          setUser({
            email: userEmail,
            id: userId
          })
          return
        }
        
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push('/auth/signin')
          return
        }
        
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
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth/signin')
      }
    }
    
    checkUser()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: formData.slug === '' ? generateSlug(value) : prev.slug
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Product slug is required'
    if (!formData.regular_price || parseFloat(formData.regular_price) <= 0) {
      newErrors.regular_price = 'Regular price must be greater than 0'
    }
    if (formData.sale_price && parseFloat(formData.sale_price) <= 0) {
      newErrors.sale_price = 'Sale price must be greater than 0'
    }
    if (formData.sale_price && formData.regular_price && 
        parseFloat(formData.sale_price) >= parseFloat(formData.regular_price)) {
      newErrors.sale_price = 'Sale price must be less than regular price'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setImageUploading(true)

    try {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        throw new Error(`不支持的文件格式: ${invalidFiles.map(f => f.name).join(', ')}`)
      }

      // 验证文件大小 (10MB)
      const maxSize = 10 * 1024 * 1024
      const oversizeFiles = Array.from(files).filter(file => file.size > maxSize)

      if (oversizeFiles.length > 0) {
        throw new Error(`文件过大 (最大10MB): ${oversizeFiles.map(f => f.name).join(', ')}`)
      }

      // 压缩图片
      console.log('开始压缩图片...')
      const compressionResults = await compressImages(
        Array.from(files),
        COMPRESSION_PRESETS.high,
        (progress, current, total) => {
          console.log(`压缩进度: ${progress.toFixed(1)}% (${current}/${total})`)
        }
      )

      const uploadedUrls: string[] = []

      for (const result of compressionResults) {
        const fileExt = result.format
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, result.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error:', error)
          throw new Error(`上传失败: ${error.message}`)
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrlData.publicUrl)

        // 显示压缩统计
        console.log(`图片压缩完成: ${result.file.name}`)
        console.log(`原始大小: ${(result.originalSize / 1024).toFixed(1)} KB`)
        console.log(`压缩后大小: ${(result.compressedSize / 1024).toFixed(1)} KB`)
        console.log(`压缩率: ${result.compressionRatio.toFixed(1)}%`)
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      
      // Reset input
      e.target.value = ''
    } catch (error: any) {
      console.error('Image upload error:', error)
      alert(error.message || '图片上传失败')
    } finally {
      setImageUploading(false)
    }
  }

  // Remove image
  const removeImage = (imageId: number | string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageId)
    }))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!user?.id) return
    
    setLoading(true)
    
    try {
      const productData = {
        author_id: user.id,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        sku: formData.sku.trim() || null,
        type: formData.type,
        short_desc: formData.short_desc.trim(),
        description: formData.description.trim(),
        regular_price: parseFloat(formData.regular_price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        sale_start: formData.sale_start || null,
        sale_end: formData.sale_end || null,
        tax_status: formData.tax_status,
        stock_status: formData.stock_status,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dim_length: formData.dim_length ? parseFloat(formData.dim_length) : null,
        dim_width: formData.dim_width ? parseFloat(formData.dim_width) : null,
        dim_height: formData.dim_height ? parseFloat(formData.dim_height) : null,
        images: formData.images,
        status: formData.status,
        attributes: [],
        meta: {}
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
      
      if (error) throw error
      
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert(`Failed to create product: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Loading...</h2>
            <p className="text-gray-900">Checking authentication...</p>
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
              
              {/* Breadcrumb */}
              <div className="ml-8 flex items-center space-x-2 text-sm text-gray-900">
                <Link href="/admin/products" className="hover:text-green-600 transition-colors duration-200">Products</Link>
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-green-600 font-medium">Add New Product</span>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
                  Add New Product
                </h1>
                <p className="text-lg text-gray-900">Create a new product for your catalog</p>
              </div>
              <Link 
                href="/admin/products" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </Link>
            </div>
          </div>
        </header>
        
        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.slug ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="product-slug"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Product SKU"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="simple">Simple Product</option>
                      <option value="variable">Variable Product</option>
                      <option value="virtual">Virtual Product</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Short Description
                    </label>
                    <textarea
                      name="short_desc"
                      value={formData.short_desc}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief description of the product"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Full Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Detailed product description"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Pricing
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Regular Price * ($)
                    </label>
                    <input
                      type="number"
                      name="regular_price"
                      value={formData.regular_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.regular_price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.regular_price && <p className="mt-1 text-sm text-red-600">{errors.regular_price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Sale Price ($)
                    </label>
                    <input
                      type="number"
                      name="sale_price"
                      value={formData.sale_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.sale_price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.sale_price && <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Sale Start Date
                    </label>
                    <input
                      type="date"
                      name="sale_start"
                      value={formData.sale_start}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Sale End Date
                    </label>
                    <input
                      type="date"
                      name="sale_end"
                      value={formData.sale_end}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tax Status
                    </label>
                    <select
                      name="tax_status"
                      value={formData.tax_status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="taxable">Taxable</option>
                      <option value="none">No Tax</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Inventory
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Stock Status
                    </label>
                    <select
                      name="stock_status"
                      value={formData.stock_status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="instock">In Stock</option>
                      <option value="outofstock">Out of Stock</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Shipping
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      name="dim_length"
                      value={formData.dim_length}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      name="dim_width"
                      value={formData.dim_width}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="dim_height"
                      value={formData.dim_height}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Product Images
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Upload Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={imageUploading}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {imageUploading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-2 text-gray-900">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-900 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="text-gray-900">Click to upload images or drag and drop</p>
                            <p className="text-sm text-gray-800 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Uploaded Images ({formData.images.length})
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={image} className="relative group">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                              <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(image)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/admin/products" 
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </Link>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      Save as Draft
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Create Product
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
} 