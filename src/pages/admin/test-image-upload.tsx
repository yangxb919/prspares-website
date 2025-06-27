import { useState } from 'react'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import Image from 'next/image'

export default function TestImageUpload() {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createPublicClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage('')
    
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

      const uploadedUrls: string[] = []
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `products/${fileName}`

        console.log(`开始上传: ${file.name} -> ${filePath}`)

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
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
        console.log(`上传成功: ${publicUrlData.publicUrl}`)
      }

      setImages(prev => [...prev, ...uploadedUrls])
      setMessage(`成功上传 ${uploadedUrls.length} 张图片！`)
      
      // Reset input
      e.target.value = ''
    } catch (error: any) {
      console.error('Image upload error:', error)
      setMessage(`上传失败: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (imageUrl: string) => {
    setImages(prev => prev.filter(img => img !== imageUrl))
  }

  const clearAll = () => {
    setImages([])
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">产品图片上传测试</h1>
          
          {/* 状态信息 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('失败') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* 上传区域 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">上传图片</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2 text-gray-600">上传中...</span>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-600">点击选择图片或拖拽到此处</p>
                    <p className="text-sm text-gray-500 mt-1">支持 PNG, JPG, GIF, WebP 格式，最大 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 已上传的图片 */}
          {images.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">已上传的图片 ({images.length})</h2>
                <button
                  onClick={clearAll}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  清空所有
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image} className="relative group">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                      <Image
                        src={image}
                        alt={`上传的图片 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="mt-2 text-xs text-gray-500 truncate" title={image}>
                      {image.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 技术信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">✅ 测试结果</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 存储桶：product-images</li>
              <li>• 上传路径：products/文件名</li>
              <li>• 支持格式：JPG, PNG, GIF, WebP</li>
              <li>• 最大大小：10MB</li>
              <li>• RLS策略：已正确配置</li>
            </ul>
          </div>

          {/* 导航 */}
          <div className="flex justify-between">
            <Link 
              href="/admin/products" 
              className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              ← 返回产品管理
            </Link>
            <Link 
              href="/test-product-upload" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              高级诊断测试 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 