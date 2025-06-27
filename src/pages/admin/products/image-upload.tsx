import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import AdminLayout from '@/components/AdminLayout'

interface UploadedImage {
  fileName: string
  url: string
  originalName: string
}

export default function ImageUploadPage() {
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createPublicClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Authentication check failed:', error)
        setError('认证检查失败，请重新登录')
        router.push('/auth/signin')
      }
    }

    checkUser()
  }, [])

  // 批量上传图片到Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const supabase = createPublicClient()
      const uploadedUrls: UploadedImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          console.warn(`跳过不支持的文件格式: ${file.name}`)
          continue
        }

        // 验证文件大小 (10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
          console.warn(`跳过过大的文件: ${file.name}`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error:', error)
          setError(`上传失败: ${error.message}`)
          continue
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        uploadedUrls.push({
          fileName: fileName,
          url: publicUrlData.publicUrl,
          originalName: file.name
        })

        // 更新进度
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls])
      if (uploadedUrls.length > 0) {
        alert(`成功上传 ${uploadedUrls.length} 张图片`)
      }

    } catch (error: any) {
      console.error('批量上传失败:', error)
      setError(`批量上传失败: ${error.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // 复制URL列表到剪贴板
  const copyUrlsToClipboard = () => {
    const urls = uploadedImages.map(img => img.url).join('\n')
    navigator.clipboard.writeText(urls).then(() => {
      alert('图片URL已复制到剪贴板')
    })
  }

  // 生成JSON格式的图片数组
  const generateJsonArray = () => {
    const jsonArray = uploadedImages.map(img => img.url)
    const jsonString = JSON.stringify(jsonArray, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSON格式的图片数组已复制到剪贴板')
    })
  }

  // 清空上传列表
  const clearUploadedImages = () => {
    setUploadedImages([])
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>正在验证用户身份...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">批量图片上传工具</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              上传您的产品图片到Supabase Storage，获取URL用于批量产品导入。
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading ? '上传中...' : '选择图片文件'}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                支持 JPG, PNG, GIF, WebP 格式，单个文件最大 10MB
              </p>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">上传进度: {uploadProgress}%</p>
              </div>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">已上传图片 ({uploadedImages.length})</h2>
                <div className="space-x-2">
                  <button
                    onClick={copyUrlsToClipboard}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    复制URL列表
                  </button>
                  <button
                    onClick={generateJsonArray}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    复制JSON数组
                  </button>
                  <button
                    onClick={clearUploadedImages}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    清空列表
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium truncate">{image.originalName}</p>
                    <p className="text-xs text-gray-500 truncate">{image.url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">使用说明：</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. 选择并上传您的产品图片</li>
              <li>2. 点击"复制JSON数组"获取图片URL数组</li>
              <li>3. 在产品JSON文件中使用这些URL作为images字段的值</li>
              <li>4. 进行批量产品上传</li>
            </ol>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
