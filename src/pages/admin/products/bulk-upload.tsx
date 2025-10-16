import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'

// 支持的文件格式类型
type FileFormat = 'csv' | 'json'

// 批量上传的产品数据类型
interface BulkProductData {
  name: string
  slug?: string
  sku?: string
  short_desc?: string
  description?: string
  regular_price: number
  sale_price?: number
  stock_status: 'instock' | 'outofstock'
  status: 'draft' | 'publish'
  category?: string
  images?: string[]
  features?: string[]
  applications?: string[]
  materials?: string[]
}

export default function BulkUploadProducts() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileFormat, setFileFormat] = useState<FileFormat>('csv')
  const [parsedData, setParsedData] = useState<BulkProductData[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<{
    success: number
    failed: number
    errors: string[]
  }>({ success: 0, failed: 0, errors: [] })
  
  const router = useRouter()
  const supabase = createPublicClient()

  // 检查用户权限
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

  // 生成slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // 解析CSV文件
  const parseCSV = (content: string): BulkProductData[] => {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data: BulkProductData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const product: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        switch (header.toLowerCase()) {
          case 'name':
            product.name = value
            break
          case 'slug':
            product.slug = value || generateSlug(product.name || '')
            break
          case 'sku':
            product.sku = value
            break
          case 'short_desc':
          case 'short_description':
            product.short_desc = value
            break
          case 'description':
            product.description = value
            break
          case 'regular_price':
          case 'price':
            product.regular_price = parseFloat(value) || 0
            break
          case 'sale_price':
            product.sale_price = value ? parseFloat(value) : undefined
            break
          case 'stock_status':
            product.stock_status = value === 'outofstock' ? 'outofstock' : 'instock'
            break
          case 'status':
            product.status = value === 'draft' ? 'draft' : 'publish'
            break
          case 'category':
            product.category = value
            break
          case 'images':
            product.images = value ? value.split('|').map(img => img.trim()) : []
            break
          case 'features':
            product.features = value ? value.split('|').map(f => f.trim()) : []
            break
          case 'applications':
            product.applications = value ? value.split('|').map(a => a.trim()) : []
            break
          case 'materials':
            product.materials = value ? value.split('|').map(m => m.trim()) : []
            break
        }
      })
      
      if (product.name && product.regular_price > 0) {
        data.push(product as BulkProductData)
      }
    }
    
    return data
  }

  // 解析JSON文件
  const parseJSON = (content: string): BulkProductData[] => {
    try {
      const jsonData = JSON.parse(content)
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON文件必须包含产品数组')
      }
      
      return jsonData.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.name || ''),
        stock_status: item.stock_status === 'outofstock' ? 'outofstock' : 'instock',
        status: item.status === 'draft' ? 'draft' : 'publish'
      })).filter(item => item.name && item.regular_price > 0)
    } catch (error) {
      console.error('JSON解析错误:', error)
      return []
    }
  }

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    
    try {
      const content = await file.text()
      let data: BulkProductData[] = []
      
      if (fileFormat === 'csv') {
        data = parseCSV(content)
      } else if (fileFormat === 'json') {
        data = parseJSON(content)
      }
      
      setParsedData(data)
    } catch (error) {
      console.error('文件解析错误:', error)
      alert('文件解析失败，请检查文件格式')
    }
  }

  // 批量创建产品
  const handleBulkUpload = async () => {
    if (parsedData.length === 0) {
      alert('请先上传并解析文件')
      return
    }

    if (!user) {
      alert('请先登录后再进行批量上传')
      return
    }

    setLoading(true)
    setUploadProgress(0)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < parsedData.length; i++) {
      const product = parsedData[i]
      
      try {
        // 检查slug是否已存在
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('slug', product.slug || generateSlug(product.name))
          .single()

        if (existingProduct) {
          results.failed++
          results.errors.push(`产品 "${product.name}" 的slug已存在`)
          continue
        }

        // 准备产品数据
        const productData = {
          name: product.name,
          slug: product.slug || generateSlug(product.name),
          sku: product.sku,
          short_desc: product.short_desc,
          description: product.description,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          stock_status: product.stock_status || 'instock',
          status: product.status || 'draft', // 默认设置为草稿状态
          images: product.images || [],
          author_id: user?.id, // 添加作者ID
          meta: {
            features: product.features || [],
            applications: product.applications || [],
            materials: product.materials || []
          }
        }

        // 插入产品
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single()

        if (error) throw error

        // 如果有分类，创建关联
        if (product.category && newProduct) {
          const { data: category } = await supabase
            .from('product_categories')
            .select('id')
            .eq('slug', product.category.toLowerCase().replace(/\s+/g, '-'))
            .single()

          if (category) {
            await supabase
              .from('product_to_category')
              .insert([{
                product_id: newProduct.id,
                category_id: category.id
              }])
          }
        }

        results.success++
      } catch (error: any) {
        results.failed++
        console.error('Product creation error:', error)

        // 提供更详细的错误信息
        let errorMessage = `产品 "${product.name}" 创建失败: `
        if (error.message.includes('row-level security policy')) {
          errorMessage += '权限不足，请检查数据库RLS策略配置'
        } else if (error.message.includes('duplicate key')) {
          errorMessage += 'slug重复，请使用不同的产品名称'
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage += '缺少必填字段'
        } else {
          errorMessage += error.message
        }

        results.errors.push(errorMessage)
      }

      // 更新进度
      setUploadProgress(Math.round(((i + 1) / parsedData.length) * 100))
    }

    setUploadResults(results)
    setLoading(false)
  }

  // 下载模板文件
  const downloadTemplate = (format: FileFormat) => {
    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'csv') {
      content = `name,slug,sku,short_desc,description,regular_price,sale_price,stock_status,status,category,images,features,applications,materials
"iPhone 15 LCD Screen","iphone-15-lcd-screen","LCD-IP15-001","High quality LCD replacement screen","Premium LCD screen replacement for iPhone 15 with HD resolution and excellent touch response.",120.00,95.00,"instock","publish","displays","https://example.com/image1.jpg|https://example.com/image2.jpg","HD Resolution|Touch Sensitive|Easy Installation","Screen Repair|Display Replacement","LCD|Glass|Metal"
"Samsung Galaxy S24 Battery","samsung-galaxy-s24-battery","BAT-SGS24-001","Original capacity replacement battery","High capacity lithium-ion battery for Samsung Galaxy S24 with advanced safety features.",45.00,,"instock","publish","batteries","https://example.com/battery1.jpg","High Capacity|Safety Protection|Long Lasting","Battery Replacement|Power Repair","Lithium Ion|Plastic"`
      filename = 'product-template.csv'
      mimeType = 'text/csv'
    } else if (format === 'json') {
      const template = [
        {
          name: "iPhone 15 LCD Screen",
          slug: "iphone-15-lcd-screen",
          sku: "LCD-IP15-001",
          short_desc: "High quality LCD replacement screen",
          description: "Premium LCD screen replacement for iPhone 15 with HD resolution and excellent touch response.",
          regular_price: 120.00,
          sale_price: 95.00,
          stock_status: "instock",
          status: "publish",
          category: "displays",
          images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
          features: ["HD Resolution", "Touch Sensitive", "Easy Installation"],
          applications: ["Screen Repair", "Display Replacement"],
          materials: ["LCD", "Glass", "Metal"]
        },
        {
          name: "Samsung Galaxy S24 Battery",
          slug: "samsung-galaxy-s24-battery",
          sku: "BAT-SGS24-001",
          short_desc: "Original capacity replacement battery",
          description: "High capacity lithium-ion battery for Samsung Galaxy S24 with advanced safety features.",
          regular_price: 45.00,
          stock_status: "instock",
          status: "publish",
          category: "batteries",
          images: ["https://example.com/battery1.jpg"],
          features: ["High Capacity", "Safety Protection", "Long Lasting"],
          applications: ["Battery Replacement", "Power Repair"],
          materials: ["Lithium Ion", "Plastic"]
        }
      ]
      content = JSON.stringify(template, null, 2)
      filename = 'product-template.json'
      mimeType = 'application/json'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold text-gray-900">批量上传产品</h1>
          <p className="text-gray-600 mt-2">支持CSV、JSON格式的批量产品导入</p>
        </div>

        {/* 模板下载区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">下载模板文件</h2>
          <p className="text-gray-600 mb-4">请先下载对应格式的模板文件，填写产品信息后再上传。</p>
          
          <div className="flex gap-4">
            <button
              onClick={() => downloadTemplate('csv')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              下载 CSV 模板
            </button>
            <button
              onClick={() => downloadTemplate('json')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              下载 JSON 模板
            </button>
          </div>
        </div>

        {/* 文件上传区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">上传产品文件</h2>
          
          {/* 格式选择 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">文件格式</label>
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as FileFormat)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* 文件选择 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
            <input
              type="file"
              accept={fileFormat === 'csv' ? '.csv' : '.json'}
              onChange={handleFileUpload}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* 解析结果预览 */}
          {parsedData.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                解析结果 ({parsedData.length} 个产品)
              </h3>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">产品名称</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.slice(0, 10).map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ${product.regular_price}
                          {product.sale_price && (
                            <span className="text-red-600 ml-2">${product.sale_price}</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.status}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.category || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                    还有 {parsedData.length - 10} 个产品...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 上传按钮和进度 */}
        {parsedData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">开始批量上传</h3>
              <button
                onClick={handleBulkUpload}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? `上传中... ${uploadProgress}%` : '开始上传'}
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
        {(uploadResults.success > 0 || uploadResults.failed > 0) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">上传结果</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{uploadResults.success}</div>
                <div className="text-green-700">成功上传</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{uploadResults.failed}</div>
                <div className="text-red-700">上传失败</div>
              </div>
            </div>

            {uploadResults.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">错误详情:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {uploadResults.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 格式说明 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">文件格式说明</h3>
          
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <strong>必填字段:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>name - 产品名称</li>
                <li>regular_price - 常规价格（数字）</li>
              </ul>
            </div>
            
            <div>
              <strong>可选字段:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>slug - 产品别名（自动生成）</li>
                <li>sku - 产品编号</li>
                <li>short_desc - 简短描述</li>
                <li>description - 详细描述</li>
                <li>sale_price - 促销价格</li>
                <li>stock_status - 库存状态 (instock/outofstock)</li>
                <li>status - 发布状态 (draft/publish)</li>
                <li>category - 产品分类</li>
                <li>images - 图片URL（用|分隔多个）</li>
                <li>features - 产品特性（用|分隔多个）</li>
                <li>applications - 应用场景（用|分隔多个）</li>
                <li>materials - 材料信息（用|分隔多个）</li>
              </ul>
            </div>

            <div>
              <strong>注意事项:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>CSV文件中多个值用竖线"|"分隔</li>
                <li>JSON文件中多个值使用数组格式</li>
                <li>图片URL需要是有效的网络地址</li>
                <li>价格必须是有效的数字</li>
                <li>产品别名(slug)必须唯一</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 