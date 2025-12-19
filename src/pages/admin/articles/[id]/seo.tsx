// 文章SEO专门编辑页面

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createPublicClient } from '@/utils/supabase-public';
import Link from 'next/link';
import SEOEditor from '@/components/admin/SEOEditor';

export default function ArticleSEOEdit() {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [customSEOData, setCustomSEOData] = useState<any>(null);
  
  const router = useRouter();
  const { id } = router.query;
  const supabase = createPublicClient();

  // 检查用户权限并加载文章
  useEffect(() => {
    const loadData = async () => {
      try {
        // 检查用户权限
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

        // 加载文章数据
        if (id) {
          const { data: articleData, error: articleError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

          if (articleError) throw articleError;

          // 检查权限
          if (articleData.author_id !== userId && userRole !== 'admin') {
            setError('您没有权限编辑此文章的SEO设置');
            return;
          }

          setArticle(articleData);
        }
      } catch (error: any) {
        console.error('加载失败:', error);
        setError('加载文章失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      loadData();
    }
  }, [router.isReady, id]);

  // 保存SEO设置
  const handleSaveSEO = async () => {
    if (!customSEOData || !article) return;

    setSaving(true);
    setError(null);

    try {
      const updatedMeta = {
        ...article.meta,
        seo: customSEOData.seo,
        structured_data: customSEOData.structuredData,
        open_graph: customSEOData.openGraph,
        twitter: customSEOData.twitter,
        canonical: customSEOData.canonical
      };

      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          meta: updatedMeta,
          updated_at: new Date().toISOString()
        })
        .eq('id', String(id || ''));

      if (updateError) throw updateError;

      // 更新本地状态
      setArticle((prev: any) => ({
        ...prev,
        meta: updatedMeta
      }));

      alert('SEO设置已保存！');
    } catch (error: any) {
      console.error('保存失败:', error);
      setError('保存SEO设置失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link
            href="/admin/articles"
            className="text-blue-600 hover:text-blue-800"
          >
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800">文章不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO设置</h1>
              <p className="text-gray-900 mt-2">
                编辑文章 "{article.title}" 的SEO设置
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/blog/${article.slug}`}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                查看文章
              </Link>
              <Link
                href={`/admin/articles/${id}`}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                编辑文章
              </Link>
            </div>
          </div>
        </div>

        {/* 文章信息卡片 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">文章信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">标题:</span>
              <p className="text-gray-900 mt-1">{article.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">URL:</span>
              <p className="text-gray-900 mt-1">/blog/{article.slug}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">状态:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                article.status === 'publish' ? 'bg-green-100 text-green-800' :
                article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.status === 'publish' ? '已发布' : 
                 article.status === 'draft' ? '草稿' : '私密'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">发布时间:</span>
              <p className="text-gray-900 mt-1">
                {article.published_at ? 
                  new Date(article.published_at).toLocaleDateString('zh-CN') : 
                  '未发布'
                }
              </p>
            </div>
          </div>
        </div>

        {/* SEO编辑器 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <SEOEditor
              title={article.title}
              content={article.content || ''}
              slug={article.slug}
              excerpt={article.excerpt}
              coverImage={article.meta?.cover_image}
              author={user?.display_name || 'PRSPARES Team'}
              initialSEOData={article.meta}
              onSEOChange={setCustomSEOData}
            />
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/admin/articles"
            className="text-gray-900 hover:text-gray-800"
          >
            ← 返回文章列表
          </Link>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveSEO}
              disabled={saving || !customSEOData}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                saving || !customSEOData
                  ? 'bg-gray-300 text-gray-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? '保存中...' : '保存SEO设置'}
            </button>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">SEO优化提示</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>• <strong>标题优化:</strong> 控制在50-60字符，包含主要关键词</p>
            <p>• <strong>描述优化:</strong> 控制在150-160字符，包含相关关键词和行动召唤</p>
            <p>• <strong>关键词选择:</strong> 选择与内容相关的关键词，避免关键词堆砌</p>
            <p>• <strong>定期检查:</strong> 根据SEO建议定期优化内容</p>
          </div>
        </div>
      </div>
    </div>
  );
}
