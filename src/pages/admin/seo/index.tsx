// SEO管理页面 - 查看和管理所有文章的SEO状态

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createPublicClient } from '@/utils/supabase-public';
import Link from 'next/link';
import { convertToProduct, convertToProducts, convertToPost, convertToPosts, convertToContactSubmissions, convertToNewsletterSubscriptions, convertToPostSEOInfos, safeString, safeNumber } from '@/utils/type-converters';

interface SEOStats {
  total: number;
  optimized: number;
  needsOptimization: number;
  optimizationRate: number;
}

interface PostSEOInfo {
  id: number;
  title: string;
  slug: string;
  status: string;
  published_at: string;
  meta?: {
    seo?: {
      title: string;
      description: string;
      score: number;
      keywords: string[];
    };
  };
}

export default function SEOManagement() {
  const [stats, setStats] = useState<SEOStats | null>(null);
  const [posts, setPosts] = useState<PostSEOInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchOptimizing, setBatchOptimizing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'optimized' | 'needs-optimization'>('all');
  
  const router = useRouter();
  const supabase = createPublicClient();

  // 检查用户权限
  useEffect(() => {
    const checkUser = async () => {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');

      if (!userRole || !userId) {
        router.push('/auth/signin');
        return;
      }

      if (userRole !== 'admin' && userRole !== 'author') {
        router.push('/admin/articles');
        return;
      }

      setUser({ id: userId, role: userRole });
    };

    checkUser();
  }, [router]);

  // 获取SEO统计数据
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/seo/batch-optimize');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch SEO stats:', error);
    }
  };

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('id, title, slug, status, published_at, meta')
        .eq('status', 'publish')
        .order('published_at', { ascending: false });

      if (filter === 'optimized') {
        query = query.not('meta->seo', 'is', null);
      } else if (filter === 'needs-optimization') {
        query = query.is('meta->seo', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch posts:', error);
        return;
      }

      setPosts((data as any) || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (user) {
      Promise.all([fetchStats(), fetchPosts()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, filter]);

  // 批量优化SEO
  const handleBatchOptimize = async () => {
    setBatchOptimizing(true);
    
    try {
      const response = await fetch('/api/seo/batch-optimize', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`批量优化完成！处理了 ${data.results.successful} 篇文章`);
        // 刷新数据
        await Promise.all([fetchStats(), fetchPosts()]);
      } else {
        alert('批量优化失败：' + data.error);
      }
    } catch (error) {
      console.error('Batch optimization error:', error);
      alert('批量优化失败');
    } finally {
      setBatchOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO管理</h1>
              <p className="text-gray-900 mt-2">管理所有文章的SEO优化状态</p>
            </div>
            <Link
              href="/admin/articles"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回文章管理
            </Link>
          </div>
        </div>

        {/* SEO统计卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-900">总文章数</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">{stats.optimized}</div>
              <div className="text-gray-900">已优化</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-red-600">{stats.needsOptimization}</div>
              <div className="text-gray-900">需要优化</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.optimizationRate}%</div>
              <div className="text-gray-900">优化率</div>
            </div>
          </div>
        )}

        {/* 操作栏 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-900">筛选:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">所有文章</option>
                <option value="optimized">已优化</option>
                <option value="needs-optimization">需要优化</option>
              </select>
            </div>
            
            {stats && stats.needsOptimization > 0 && (
              <button
                onClick={handleBatchOptimize}
                disabled={batchOptimizing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {batchOptimizing ? '优化中...' : `批量优化 (${stats.needsOptimization}篇)`}
              </button>
            )}
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">文章SEO状态</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    文章
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    SEO状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    SEO分数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    关键词
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-800">/{post.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.meta?.seo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已优化
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          需要优化
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.meta?.seo?.score ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(post.meta.seo.score)}`}>
                          {post.meta.seo.score}/100
                        </span>
                      ) : (
                        <span className="text-gray-900 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {post.meta?.seo?.keywords ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {post.meta.seo.keywords.slice(0, 3).map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              {keyword}
                            </span>
                          ))}
                          {post.meta.seo.keywords.length > 3 && (
                            <span className="text-xs text-gray-800">
                              +{post.meta.seo.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-900 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(post.published_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/articles/${post.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        编辑
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-900"
                      >
                        查看
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-800">没有找到文章</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
