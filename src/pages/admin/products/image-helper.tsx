import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function ImageHelperPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState('')

  // 添加图片URL
  const addImageUrl = () => {
    if (newUrl.trim() && newUrl.startsWith('http')) {
      setImageUrls(prev => [...prev, newUrl.trim()])
      setNewUrl('')
    } else {
      alert('请输入有效的图片URL（以http开头）')
    }
  }

  // 删除图片URL
  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  // 复制JSON数组
  const copyJsonArray = () => {
    const jsonString = JSON.stringify(imageUrls, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSON格式的图片数组已复制到剪贴板')
    })
  }

  // 复制URL列表
  const copyUrlList = () => {
    const urlString = imageUrls.join('\n')
    navigator.clipboard.writeText(urlString).then(() => {
      alert('图片URL列表已复制到剪贴板')
    })
  }

  // 清空列表
  const clearList = () => {
    setImageUrls([])
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">图片URL管理工具</h1>
          
          <div className="mb-6">
            <p className="text-gray-900 mb-4">
              管理您的产品图片URL，生成JSON格式用于批量产品导入。
            </p>
            
            {/* 推荐的免费图床服务 */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">推荐的免费图床服务：</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="https://imgbb.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded border hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-blue-600">ImgBB</div>
                  <div className="text-sm text-gray-900">免费，支持批量上传</div>
                </a>
                <a 
                  href="https://imgur.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded border hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-blue-600">Imgur</div>
                  <div className="text-sm text-gray-900">知名度高，稳定可靠</div>
                </a>
                <a 
                  href="https://cloudinary.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded border hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-blue-600">Cloudinary</div>
                  <div className="text-sm text-gray-900">专业图片处理</div>
                </a>
              </div>
            </div>

            {/* 添加图片URL */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="输入图片URL (https://...)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
              />
              <button
                onClick={addImageUrl}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>

          {/* 图片URL列表 */}
          {imageUrls.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">图片URL列表 ({imageUrls.length})</h2>
                <div className="space-x-2">
                  <button
                    onClick={copyUrlList}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    复制URL列表
                  </button>
                  <button
                    onClick={copyJsonArray}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    复制JSON数组
                  </button>
                  <button
                    onClick={clearList}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    清空列表
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={url}
                      alt={`图片 ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png'
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 truncate">{url}</p>
                    </div>
                    <button
                      onClick={() => removeImageUrl(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">使用说明：</h3>
            <ol className="text-sm text-gray-900 space-y-1">
              <li>1. 选择一个免费图床服务上传您的产品图片</li>
              <li>2. 获取每张图片的直链URL</li>
              <li>3. 在上方输入框中逐个添加图片URL</li>
              <li>4. 点击"复制JSON数组"获取格式化的图片数组</li>
              <li>5. 在产品JSON文件中使用这些URL作为images字段的值</li>
              <li>6. 进行批量产品上传</li>
            </ol>
          </div>

          {/* JSON预览 */}
          {imageUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">JSON预览：</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(imageUrls, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
