import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import { Mail, Calendar, User, MessageSquare, Eye, EyeOff, Trash2, RefreshCw, Package, Phone } from 'lucide-react'
import { convertToProduct, convertToProducts, convertToPost, convertToPosts, convertToContactSubmissions, convertToNewsletterSubscriptions, convertToPostSEOInfos, safeString, safeNumber } from '@/utils/type-converters';

interface ContactSubmission {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  ip_address: string
  user_agent: string
  status: 'unread' | 'read' | 'replied'
  request_type?: 'contact' | 'quote'
  product_name?: string
  product_sku?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export default function ContactsAdmin() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createPublicClient()

  // 检查用户权限
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        const userRole = localStorage.getItem('userRole')

        if (!isLoggedIn || (userRole !== 'admin' && userRole !== 'author')) {
          router.push('/auth/signin')
          return
        }

        const userEmail = localStorage.getItem('userEmail')
        setUser({ email: userEmail, role: userRole })

        await loadContacts()
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setError('Authentication failed')
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 加载联系表单数据
  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading contacts:', error)
        setError('Failed to load contact submissions')
        return
      }

      setContacts((data as any) || [])
      setFilteredContacts((data as any) || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
      setError('Failed to load contact submissions')
    }
  }

  // 过滤和搜索
  useEffect(() => {
    let filtered = contacts

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    // 类型过滤
    if (typeFilter !== 'all') {
      filtered = filtered.filter(contact => 
        contact.request_type === typeFilter || 
        (!contact.request_type && typeFilter === 'contact')
      )
    }

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.product_name && contact.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.product_sku && contact.product_sku.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredContacts(filtered)
  }, [contacts, statusFilter, typeFilter, searchTerm])

  // 更新状态
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', String(id))

      if (error) {
        console.error('Error updating status:', error)
        return
      }

      // 更新本地状态
      setContacts(prev => prev.map(contact =>
        contact.id === id
          ? { ...contact, status: newStatus as any, updated_at: new Date().toISOString() }
          : contact
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // 删除联系表单
  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', String(id))

      if (error) {
        console.error('Error deleting contact:', error)
        return
      }

      // 更新本地状态
      setContacts(prev => prev.filter(contact => contact.id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取请求类型颜色
  const getTypeColor = (requestType?: string) => {
    switch (requestType) {
      case 'quote': return 'bg-blue-100 text-blue-800'
      case 'contact': 
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取请求类型显示文本
  const getTypeText = (requestType?: string) => {
    switch (requestType) {
      case 'quote': return 'Quote Request'
      case 'contact': 
      default: return 'Contact'
    }
  }

  // 统计数据
  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => c.status === 'unread').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    quotes: contacts.filter(c => c.request_type === 'quote').length,
    contacts: contacts.filter(c => !c.request_type || c.request_type === 'contact').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Loading contact submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
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
                  <p className="text-xs text-gray-800">Contact Management</p>
                </div>
              </Link>
              
              {/* Navigation tabs */}
              <div className="ml-8 flex space-x-1 bg-gray-100/50 rounded-full p-1 backdrop-blur-sm">
                <Link href="/admin/articles" className="px-4 py-2 text-sm font-medium rounded-full text-gray-900 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  Blog Articles
                </Link>
                <Link href="/admin/products" className="px-4 py-2 text-sm font-medium rounded-full text-gray-900 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  Products
                </Link>
                <Link href="/admin/contacts" className="px-4 py-2 text-sm font-medium rounded-full bg-orange-500 text-white shadow-sm transition-all duration-200">
                  Contacts
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">{user?.email}</span>
              </div>
              <button 
                onClick={async () => {
                  localStorage.removeItem('adminLoggedIn')
                  localStorage.removeItem('userRole')
                  localStorage.removeItem('userEmail')
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

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和统计 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
              <button
                onClick={loadContacts}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <EyeOff className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Unread</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Read</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Replied</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.quotes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-gray-900" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contacts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 过滤器和搜索 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, message, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="contact">Contact</option>
                  <option value="quote">Quote Request</option>
                </select>
              </div>
            </div>
          </div>

          {/* 联系表单列表 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            {filteredContacts.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions found</h3>
                <p className="text-gray-800">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Contact submissions will appear here when users submit the contact form.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Type & Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              <div className="text-sm text-gray-800">{contact.email}</div>
                              {contact.phone && (
                                <div className="text-xs text-gray-900 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {contact.phone}
                                </div>
                              )}
                              {contact.ip_address && (
                                <div className="text-xs text-gray-900">IP: {contact.ip_address}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(contact.request_type)}`}>
                              {getTypeText(contact.request_type)}
                            </span>
                            {contact.product_name && (
                              <div className="text-xs text-gray-900">
                                <div className="font-medium">{contact.product_name}</div>
                                {contact.product_sku && (
                                  <div className="text-gray-900">SKU: {contact.product_sku}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            <p className="truncate" title={contact.message}>
                              {contact.message.length > 100
                                ? `${contact.message.substring(0, 100)}...`
                                : contact.message}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(contact.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {contact.status === 'unread' && (
                            <button
                              onClick={() => updateStatus(contact.id, 'read')}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {contact.status === 'read' && (
                            <button
                              onClick={() => updateStatus(contact.id, 'replied')}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Mark as replied"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}