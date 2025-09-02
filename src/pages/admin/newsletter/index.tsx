import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPublicClient } from '@/utils/supabase-public'
import Link from 'next/link'
import { Mail, Calendar, User, Eye, EyeOff, Trash2, RefreshCw, Download } from 'lucide-react'
import { convertToProduct, convertToProducts, convertToPost, convertToPosts, convertToContactSubmissions, convertToNewsletterSubscriptions, convertToPostSEOInfos, safeString, safeNumber } from '@/utils/type-converters';

interface NewsletterSubscription {
  id: number
  email: string
  status: 'active' | 'unsubscribed'
  ip_address: string
  user_agent: string
  subscribed_at: string
  resubscribed_at?: string
  unsubscribed_at?: string
  created_at: string
  updated_at: string
}

export default function NewsletterAdmin() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0
  })
  const router = useRouter()

  const supabase = createPublicClient()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setSubscriptions((data as any) || [])
      
      // Calculate stats
      const total = data?.length || 0
      const active = data?.filter(sub => sub.status === 'active').length || 0
      const unsubscribed = data?.filter(sub => sub.status === 'unsubscribed').length || 0
      
      setStats({ total, active, unsubscribed })

    } catch (err: any) {
      console.error('Error fetching newsletter subscriptions:', err)
      setError(err.message || 'Failed to load newsletter subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', String(id))

      if (error) throw error

      await fetchSubscriptions()
      alert('Subscription updated successfully')
    } catch (err: any) {
      console.error('Error updating subscription:', err)
      alert('Failed to update subscription: ' + err.message)
    }
  }

  const handleReactivate = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to reactivate ${email}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'active',
          resubscribed_at: new Date().toISOString()
        })
        .eq('id', String(id))

      if (error) throw error

      await fetchSubscriptions()
      alert('Subscription reactivated successfully')
    } catch (err: any) {
      console.error('Error reactivating subscription:', err)
      alert('Failed to reactivate subscription: ' + err.message)
    }
  }

  const exportSubscriptions = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
    const csvContent = [
      'Email,Status,Subscribed Date,IP Address',
      ...activeSubscriptions.map(sub => 
        `${sub.email},${sub.status},${new Date(sub.subscribed_at).toLocaleDateString()},${sub.ip_address}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatIPAddress = (ip: string) => {
    if (!ip || ip === 'unknown') return 'Unknown';
    if (ip === '::1') return '127.0.0.1 (localhost)';
    if (ip === '127.0.0.1') return '127.0.0.1 (localhost)';
    if (ip.includes('localhost')) return ip;
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return `${ip} (private)`;
    }
    return ip;
  }

  const formatUserAgent = (userAgent: string) => {
    if (!userAgent || userAgent === 'unknown') return 'Unknown';

    // Extract browser name and version
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      const match = userAgent.match(/Chrome\/([0-9.]+)/);
      return `Chrome ${match ? match[1].split('.')[0] : ''}`;
    } else if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/([0-9.]+)/);
      return `Firefox ${match ? match[1].split('.')[0] : ''}`;
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const match = userAgent.match(/Version\/([0-9.]+)/);
      return `Safari ${match ? match[1].split('.')[0] : ''}`;
    } else if (userAgent.includes('Edg')) {
      const match = userAgent.match(/Edg\/([0-9.]+)/);
      return `Edge ${match ? match[1].split('.')[0] : ''}`;
    }

    return 'Other Browser';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading newsletter subscriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h1>
              <p className="text-gray-600">Manage newsletter subscribers</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportSubscriptions}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={fetchSubscriptions}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <Link
                href="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Mail className="text-blue-500" size={24} />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="text-green-500" size={24} />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <EyeOff className="text-red-500" size={24} />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unsubscribed</p>
                <p className="text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscription.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(subscription.subscribed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatIPAddress(subscription.ip_address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span title={subscription.user_agent}>
                        {formatUserAgent(subscription.user_agent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscription.status === 'active' ? (
                        <button
                          onClick={() => handleUnsubscribe(subscription.id, subscription.email)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(subscription.id, subscription.email)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {subscriptions.length === 0 && (
            <div className="text-center py-12">
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No newsletter subscriptions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
