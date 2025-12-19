import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import Image from 'next/image'

interface UploadedImage {
  fileName: string
  originalName: string
  url: string
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export default function ImageUploadHelper() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const router = useRouter()
  const supabase = createPublicClient()

  // 检查用户权限
  useEffect(() => {
    const checkUser = async () => {
      try {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')

        if (isLoggedIn && (userRole === 'admin' || userRole === 'author')) {
          setUser({ role: userRole })
          return
        }

        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push('/auth/signin')
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

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validFiles = files.filter(file => allowedTypes.includes(file.type))

    if (validFiles.length !== files.length) {
      alert(`${files.length - validFiles.length} 个文件格式不支持，已被过滤`)
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    const sizeValidFiles = validFiles.filter(file => file.size <= maxSize)

    if (sizeValidFiles.length !== validFiles.length) {
      alert(`${validFiles.length - sizeValidFiles.length} 个文件超过5MB大小限制，已被过滤`)
    }

    setSelectedFiles(sizeValidFiles)
  }

  // 批量上传图片
  const handleBatchUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('请先选择图片文件')
      return
    }

    setLoading(true)
    setUploadProgress(0)

    const results: UploadedImage[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      // 注意：这里我们让API决定文件名，或者我们可以传递它。
      // API 能够接受 path 参数
      const filePath = `products/${fileName}`

      const uploadItem: UploadedImage = {
        fileName: fileName,
        originalName: file.name,
        url: '',
        status: 'uploading'
      }

      results.push(uploadItem)
      setUploadedImages([...results])

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'product-images')
        // 我们不传递 path，让 API 生成文件名，或者如果我们需要保持特定路径结构，可以传递
        // 此处我们不传递 path，让 API 生成一个唯一的文件名，或者我们可以像之前一样生成
        // 为了和之前保持一致，我们不传递 'path' 给FormData，让API自己处理，或者我们如果希望控制文件名，
        // 我们需要修改一下API。
        // API 代码: const customPath = formData.get('path')
        // const fileName = customPath || ...

        // 让我们稍微修改一下 logic，为了简单起见，我们直接调用 API，不指定 path，让 API 自动生成带随机数的文件名。
        // 或者，为了保持与之前完全一致的文件名生成逻辑（虽然之前的文件名也是随机的），我们可以生成 path 并传递。
        // API 接收 'path' 参数作为完整文件名（不包含bucket）。

        // 上传到自定义API
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }

        const data = await response.json()

        uploadItem.url = data.url
        uploadItem.status = 'success'
        // 更新fileName为实际保存的文件名
        uploadItem.fileName = data.fileName

      } catch (error: any) {
        uploadItem.status = 'error'
        uploadItem.error = error.message
      }

      // 更新进度
      setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      setUploadedImages([...results])
    }

    setLoading(false)
  }

  // 生成CSV格式的URL列表
  const generateCSVUrls = () => {
    const successImages = uploadedImages.filter(img => img.status === 'success')
    if (successImages.length === 0) return

    // 生成CSV格式：原文件名,上传后URL
    const csvContent = [
      'original_name,url',
      ...successImages.map(img => `"${img.originalName}","${img.url}"`)
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'uploaded-images-urls.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 生成JSON格式的URL列表
  const generateJSONUrls = () => {
    const successImages = uploadedImages.filter(img => img.status === 'success')
    if (successImages.length === 0) return

    const jsonData = successImages.map(img => ({
      original_name: img.originalName,
      url: img.url,
      alt: img.originalName.replace(/\.[^/.]+$/, '') // 移除文件扩展名作为alt
    }))

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'uploaded-images-urls.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 复制所有URL到剪贴板
  const copyAllUrls = () => {
    const successImages = uploadedImages.filter(img => img.status === 'success')
    const urls = successImages.map(img => img.url).join('\n')

    navigator.clipboard.writeText(urls).then(() => {
      alert('所有图片URL已复制到剪贴板')
    }).catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
  }

  if (!user) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部导航 */}
        <div className="mb-8">
          <Link href="/admin/products" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← 返回产品管理
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">图片批量上传助手</h1>
          <p className="text-gray-900 mt-2">将本地图片上传到云存储，获取网络URL用于批量产品导入</p>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p>1. 选择您要上传的本地图片文件（支持JPG、PNG、GIF、WebP格式）</p>
            <p>2. 点击"开始批量上传"将图片上传到云存储</p>
            <p>3. 上传完成后，下载URL列表文件或复制URL</p>
            <p>4. 在批量产品导入时，使用生成的URL替换模板中的图片链接</p>
          </div>
        </div>

        {/* 文件选择区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">选择图片文件</h2>

          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                已选择 {selectedFiles.length} 个文件
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-2">
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-800">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 上传按钮和进度 */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">开始批量上传</h3>
              <button
                onClick={handleBatchUpload}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? `上传中... ${uploadProgress}%` : '开始批量上传'}
              </button>
            </div>

            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* 上传结果 */}
        {uploadedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">上传结果</h3>

              <div className="flex gap-2">
                <button
                  onClick={copyAllUrls}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  复制所有URL
                </button>
                <button
                  onClick={generateCSVUrls}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  下载CSV
                </button>
                <button
                  onClick={generateJSONUrls}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  下载JSON
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {image.status === 'uploading' && (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {image.status === 'success' && (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {image.status === 'error' && (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{image.originalName}</p>
                    {image.status === 'success' && (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={image.url}
                          readOnly
                          className="flex-grow text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(image.url)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          复制
                        </button>
                      </div>
                    )}
                    {image.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{image.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 统计信息 */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {uploadedImages.filter(img => img.status === 'success').length}
                </div>
                <div className="text-sm text-green-700">成功上传</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-red-600">
                  {uploadedImages.filter(img => img.status === 'error').length}
                </div>
                <div className="text-sm text-red-700">上传失败</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {uploadedImages.filter(img => img.status === 'uploading').length}
                </div>
                <div className="text-sm text-blue-700">上传中</div>
              </div>
            </div>
          </div>
        )}

        {/* 使用步骤 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">下一步：在批量产品导入中使用</h3>

          <div className="space-y-4 text-sm text-gray-900">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-xs">1</span>
              </div>
              <div>
                <p className="font-medium">下载图片URL列表</p>
                <p className="text-gray-900">下载CSV或JSON格式的URL列表，包含原文件名和对应的网络URL</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-xs">2</span>
              </div>
              <div>
                <p className="font-medium">准备产品数据</p>
                <p className="text-gray-900">在产品数据中，使用上传后的URL替换图片字段</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-xs">3</span>
              </div>
              <div>
                <p className="font-medium">执行批量导入</p>
                <p className="text-gray-900">前往 <Link href="/admin/products/bulk-upload" className="text-green-600 hover:text-green-700">批量上传页面</Link> 导入产品数据</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">图片URL格式示例：</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>CSV格式：</strong> 在images列中使用 "url1|url2|url3" 格式</p>
              <p><strong>JSON格式：</strong> 在images数组中使用 ["url1", "url2", "url3"] 格式</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 