import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import { ensureStorageSetup } from '@/utils/supabase-storage-setup'
import { compressImage, COMPRESSION_PRESETS, supportsWebP } from '@/utils/imageCompression'
import { readErrorMessage, readJsonResponse } from '@/utils/fetchResponse'
import Link from 'next/link'
import Image from 'next/image'
import { generateAutoSEO } from '@/utils/auto-seo-generator'
import SEOEditor from '@/components/admin/SEOEditor'

export default function NewArticle() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'publish' | 'private'>('draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 })
  const [customSEOData, setCustomSEOData] = useState<any>(null)
  const [category, setCategory] = useState<string>('parts-knowledge')

  const router = useRouter()
  const supabase = createPublicClient()

  // 分类选项 - 方案A
  const categoryOptions = [
    { value: 'sourcing-suppliers', label: '📦 Sourcing & Suppliers', description: 'Supplier selection, quality control, wholesale strategies' },
    { value: 'repair-guides', label: '🔧 Repair Guides', description: 'Screen replacement, battery replacement, troubleshooting' },
    { value: 'parts-knowledge', label: '📱 Parts Knowledge', description: 'Technology comparison, safety standards, manufacturing' },
    { value: 'business-tips', label: '💼 Business Tips', description: 'Market trends, pricing strategies, inventory management' },
    { value: 'industry-insights', label: '🏭 Industry Insights', description: 'Market reports, technology trends, industry news' },
  ]

  // 检查用户身份验证状态和权限
  useEffect(() => {
    const checkUser = async () => {
      try {
        // 首先检查本地存储
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')
        const userEmail = localStorage.getItem('userEmail')
        const userId = localStorage.getItem('userId')

        if (isLoggedIn && (userRole === 'admin' || userRole === 'author') && userId) {
          // 使用本地存储的信息设置用户状态
          setUser({
            email: userEmail,
            id: userId
          })

          // 确保存储设置正确
          await ensureStorageSetup()

          setInitialLoad(false)
          return
        }

        // 如果本地存储没有信息，尝试从Supabase获取
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push('/auth/signin')
          return
        }

        // 检查用户是否有管理员或作者权限
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()

        if (error || !profile || (profile.role !== 'admin' && profile.role !== 'author')) {
          router.push('/')
          return
        }

        setUser(data.user)

        // 确保存储设置正确
        await ensureStorageSetup()

        setInitialLoad(false)
      } catch (error) {
        console.error('认证检查失败:', error)
        router.push('/auth/signin')
      }
    }

    checkUser()
  }, [])

  // 自动生成slug
  useEffect(() => {
    if (!title) return

    // 从标题生成slug (小写，替换空格为连字符，移除特殊字符)
    const generatedSlug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    setSlug(generatedSlug)
  }, [title])

  // 处理特色图片上传
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFeaturedImage(file)
      const imageUrl = URL.createObjectURL(file)
      setFeaturedImagePreview(imageUrl)
    }
  }

  // 上传图片到Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      let uploadFile = file
      if (file.type.startsWith('image/') && file.size > 300 * 1024) {
        try {
          const useWebP = await supportsWebP()
          const preset = useWebP
            ? { ...COMPRESSION_PRESETS.webp, maxWidth: 1400, maxHeight: 1400, maxSizeKB: 600 }
            : { ...COMPRESSION_PRESETS.high, maxWidth: 1400, maxHeight: 1400, maxSizeKB: 600 }
          const compressed = await compressImage(file, preset)
          uploadFile = compressed.file
        } catch (compressionError) {
          console.warn('Image compression failed, uploading original file:', compressionError)
        }
      }
      if (uploadFile.size > 900 * 1024) {
        throw new Error('图片压缩后仍超过 1MB（可能会触发 413）。请换更小的图片或提高服务器上传限制。')
      }
      const fileExt = file.name.split('.').pop()
      const randomString = Math.random().toString(36).substring(2, 15)
      // 我们希望最终文件也是 webp，所以我们在这里预设文件名，但实际上 API 会转换格式
      // 传递完整的 path 给 API，API 将使用它作为文件名（如果提供了 path）
      // 注意：API 总是转为 webp，所以最好我们在这里就指定 .webp 后缀，或者让 API 处理后缀
      // API 代码：const fileName = customPath || ... 
      // 我们可以传递没有后缀的 path，API 目前没有自动添加后缀如果是 customPath
      // 让我们修改 API 以更智能地处理，或者在这里处理。
      // 当前 API 逻辑：
      // const fileName = customPath || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      // 并在 upload 时 contentType: 'image/webp'

      // 为了安全起见，我们在这里指定 .webp 后缀，因为 sharp 会输出 webp
      const fileName = `${randomString}.webp`
      const filePath = `${user.id}/${fileName}`

      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('bucket', 'post-images')
      formData.append('path', filePath)

      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(await readErrorMessage(response))
      }

      const data = await readJsonResponse<{ url: string }>(response)

      return data.url
    } catch (error: any) {
      console.error('上传图片失败:', error.message)
      setError(`上传图片失败: ${error.message}`)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // 记录光标位置
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // 记录当前光标位置
    setCursorPosition({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    })
  }

  // 处理光标位置变化
  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setCursorPosition({
      start: target.selectionStart,
      end: target.selectionEnd
    })
  }

  // 在指定位置插入图片（避免异步回调拿到旧的 cursorPosition）
  const insertImageAtCursor = (imageUrl: string, pos?: { start: number; end: number }) => {
    const textarea = contentTextareaRef.current
    if (!textarea) {
      setContent(prev => prev + `\n![图片描述](${imageUrl})\n`)
      return
    }

    const start = pos?.start ?? textarea.selectionStart
    const end = pos?.end ?? textarea.selectionEnd
    const imageMarkdown = `![图片描述](${imageUrl})`

    setContent(prev => {
      const newContent = prev.substring(0, start) + imageMarkdown + prev.substring(end)
      return newContent
    })

    // 设置新的光标位置
    setTimeout(() => {
      const newPosition = start + imageMarkdown.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
      // 更新光标位置记录
      setCursorPosition({ start: newPosition, end: newPosition })
    }, 100)
  }

  // 提交表单创建文章
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      setError('文章标题不能为空')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 上传特色图片（如果有）
      let featuredImageUrl = null
      if (featuredImage) {
        featuredImageUrl = await uploadImageToStorage(featuredImage)
        if (!featuredImageUrl) {
          throw new Error('上传特色图片失败')
        }
      }

      // 使用自定义SEO数据或生成自动SEO数据
      const seoData = customSEOData || generateAutoSEO(
        title,
        content,
        slug,
        excerpt,
        featuredImageUrl || undefined,
        user.display_name || 'PRSPARES Team',
        status === 'publish' ? new Date().toISOString() : undefined
      );

      const newPost = {
        author_id: user.id,
        title,
        slug,
        content,
        excerpt,
        status,
        published_at: status === 'publish' ? new Date().toISOString() : null,
        meta: {
          category: category,
          cover_image: featuredImageUrl,
          seo: seoData.seo,
          structured_data: seoData.structuredData,
          open_graph: seoData.openGraph,
          twitter: seoData.twitter,
          canonical: seoData.canonical
        }
      }

      // 检查slug是否已存在
      const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (existingPost) {
        setError('此URL别名已被使用，请更换一个')
        setLoading(false)
        return
      }

      // 创建新文章
      const { error: insertError } = await supabase
        .from('posts')
        .insert([newPost])

      if (insertError) throw insertError

      // 创建成功，重定向回文章列表
      router.push('/admin/articles')
    } catch (error: any) {
      setError(error.message || '创建文章时发生错误')
    } finally {
      setLoading(false)
    }
  }

  // 无需编辑器配置

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-[#00B140] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold">载入中...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-[#00B140]">
                  MoldAll 管理后台
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link href="/admin/articles" className="border-[#00B140] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  博客文章
                </Link>
                <Link href="/admin/products" className="border-transparent text-gray-800 hover:border-gray-300 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  产品
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-900">{user?.email}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/auth/signin')
                }}
                className="text-gray-900 hover:text-[#00B140]"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900">添加新文章</h1>
              </div>
              <div className="mt-4 flex md:mt-0">
                <Link
                  href="/admin/articles"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  返回文章列表
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 文章标题 */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                        标题
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="shadow-sm focus:ring-[#00B140] focus:border-[#00B140] block w-full sm:text-sm border-gray-300 rounded-md text-gray-800"
                          placeholder="文章标题"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* URL别名 */}
                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-900">
                        URL别名
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="slug"
                          id="slug"
                          className="shadow-sm focus:ring-[#00B140] focus:border-[#00B140] block w-full sm:text-sm border-gray-300 rounded-md text-gray-800"
                          placeholder="url-alias"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-800">
                        URL别名将用于文章的永久链接，如果留空将自动从标题生成
                      </p>
                    </div>

                    {/* 文章摘要 */}
                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900">
                        摘要
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          rows={3}
                          className="shadow-sm focus:ring-[#00B140] focus:border-[#00B140] block w-full sm:text-sm border-gray-300 rounded-md text-gray-800"
                          placeholder="文章摘要（可选）"
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-800">
                        简要描述文章内容，将显示在文章列表和分享链接中
                      </p>
                    </div>

                    {/* 文章分类 */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                        文章分类 *
                      </label>
                      <div className="space-y-3">
                        {categoryOptions.map((option) => (
                          <div key={option.value} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={`category-${option.value}`}
                                name="category"
                                type="radio"
                                value={option.value}
                                checked={category === option.value}
                                onChange={(e) => setCategory(e.target.value)}
                                className="focus:ring-[#00B140] h-4 w-4 text-[#00B140] border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={`category-${option.value}`} className="font-medium text-gray-900 cursor-pointer">
                                {option.label}
                              </label>
                              <p className="text-gray-800">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-800">
                        选择最适合这篇文章的分类，帮助读者快速找到相关内容
                      </p>
                    </div>

                    {/* 特色图片上传 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        特色图片
                      </label>
                      <div className="mt-1 flex items-center">
                        <div className="flex-shrink-0">
                          {featuredImagePreview ? (
                            <div className="relative h-32 w-32 rounded-md overflow-hidden">
                              <Image
                                src={featuredImagePreview}
                                alt="特色图片预览"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                              <svg className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-5">
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFeaturedImageChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
                          >
                            选择图片
                          </button>
                          {featuredImagePreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setFeaturedImage(null);
                                setFeaturedImagePreview(null);
                              }}
                              className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              移除
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-800">
                        上传一张图片作为文章的特色图片，将显示在文章列表和文章页面顶部
                      </p>
                    </div>

                    {/* 文章内容 */}
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
                        内容
                      </label>
                      <div className="mt-1">
                        {/* 工具栏 */}
                        <div className="mb-2 flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-300 rounded-t-md">
                          <span className="text-sm text-gray-800">格式:</span>

                          <button
                            type="button"
                            onClick={() => {
                              const textarea = contentTextareaRef.current
                              if (textarea) {
                                // 使用记录的光标位置
                                const start = cursorPosition.start || textarea.selectionStart
                                const end = cursorPosition.end || textarea.selectionEnd
                                const selectedText = content.substring(start, end)
                                const boldText = `**${selectedText || '粗体文本'}**`
                                setContent(prev =>
                                  prev.substring(0, start) + boldText + prev.substring(end)
                                )
                                // 设置新的光标位置并更新记录
                                setTimeout(() => {
                                  const newPosition = start + boldText.length
                                  textarea.setSelectionRange(newPosition, newPosition)
                                  textarea.focus()
                                  setCursorPosition({ start: newPosition, end: newPosition })
                                }, 50)
                              }
                            }}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
                            title="粗体"
                          >
                            <strong>B</strong>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const textarea = contentTextareaRef.current
                              if (textarea) {
                                // 使用记录的光标位置
                                const start = cursorPosition.start || textarea.selectionStart
                                const end = cursorPosition.end || textarea.selectionEnd
                                const selectedText = content.substring(start, end)
                                const italicText = `*${selectedText || '斜体文本'}*`
                                setContent(prev =>
                                  prev.substring(0, start) + italicText + prev.substring(end)
                                )
                                // 设置新的光标位置并更新记录
                                setTimeout(() => {
                                  const newPosition = start + italicText.length
                                  textarea.setSelectionRange(newPosition, newPosition)
                                  textarea.focus()
                                  setCursorPosition({ start: newPosition, end: newPosition })
                                }, 50)
                              }
                            }}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
                            title="斜体"
                          >
                            <em>I</em>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const textarea = contentTextareaRef.current
                              if (textarea) {
                                // 使用记录的光标位置
                                const start = cursorPosition.start || textarea.selectionStart
                                const end = cursorPosition.end || textarea.selectionEnd
                                const selectedText = content.substring(start, end)
                                const linkText = `[链接文本](https://example.com)`
                                setContent(prev =>
                                  prev.substring(0, start) + linkText + prev.substring(start)
                                )
                                // 设置新的光标位置并更新记录
                                setTimeout(() => {
                                  const newPosition = start + linkText.length
                                  textarea.setSelectionRange(newPosition, newPosition)
                                  textarea.focus()
                                  setCursorPosition({ start: newPosition, end: newPosition })
                                }, 50)
                              }
                            }}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
                            title="插入链接"
                          >
                            🔗
                          </button>

                          <div className="border-l border-gray-300 h-6 mx-1"></div>

                          <button
                            type="button"
                            disabled={uploadingImage}
                            onClick={async () => {
                              try {
                                const textarea = contentTextareaRef.current
                                const selection = textarea
                                  ? { start: textarea.selectionStart, end: textarea.selectionEnd }
                                  : { start: content.length, end: content.length }

                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.click();

                                input.onchange = async (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    // 检查文件大小（限制为20MB），实际上传前会自动压缩
                                    if (file.size > 20 * 1024 * 1024) {
                                      setError('图片文件大小不能超过20MB');
                                      return;
                                    }

                                    const imageUrl = await uploadImageToStorage(file);
                                    if (imageUrl) {
                                      insertImageAtCursor(imageUrl, selection);
                                    }
                                  }
                                };
                              } catch (error) {
                                console.error('插入图片失败:', error);
                                setError('插入图片失败，请重试');
                              }
                            }}
                            className={`inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="插入图片"
                          >
                            {uploadingImage ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                上传中
                              </>
                            ) : (
                              <>
                                📷 插入图片
                              </>
                            )}
                          </button>

                          <div className="ml-auto text-xs text-gray-800">
                            支持 Markdown 格式
                          </div>
                        </div>

                        <textarea
                          id="content"
                          name="content"
                          rows={15}
                          className="shadow-sm focus:ring-[#00B140] focus:border-[#00B140] block w-full sm:text-sm border-gray-300 rounded-b-md text-gray-800"
                          placeholder="文章内容 (支持Markdown格式)"
                          value={content}
                          onChange={handleTextareaChange}
                          ref={contentTextareaRef}
                          onKeyDown={handleCursorChange}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-800">提示: 可以使用 ![描述](图片URL) 语法插入图片，或点击工具栏中的插入图片按钮</p>
                      </div>
                    </div>

                    {/* 文章状态 */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                        状态
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00B140] focus:border-[#00B140] sm:text-sm rounded-md"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'publish' | 'private')}
                      >
                        <option value="draft">草稿</option>
                        <option value="publish">已发布</option>
                        <option value="private">私密</option>
                      </select>
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end">
                      <Link
                        href="/admin/articles"
                        className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140]"
                      >
                        取消
                      </Link>
                      <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00B140] hover:bg-[#008631] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B140] ${(loading || uploadingImage) ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading || uploadingImage ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {uploadingImage ? '上传图片中...' : '保存中...'}
                          </>
                        ) : '保存文章'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* SEO编辑器 */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <SEOEditor
                    title={title}
                    content={content}
                    slug={slug}
                    excerpt={excerpt}
                    coverImage={featuredImagePreview || undefined}
                    author={user?.display_name}
                    onSEOChange={setCustomSEOData}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
