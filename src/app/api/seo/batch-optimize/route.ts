// 批量SEO优化API - 为现有文章批量生成SEO数据

import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/utils/supabase-public';
import { batchGenerateSEO } from '@/utils/auto-seo-generator';

// 定义Post类型
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  meta?: any;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createPublicClient();
    
    // 获取所有已发布的文章（没有SEO数据的）
    const { data: postsData, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, content, slug, excerpt, meta')
      .eq('status', 'publish')
      .is('meta->seo', null);

    if (fetchError) {
      console.error('Failed to fetch posts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    if (!postsData || postsData.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts need SEO optimization',
        processed: 0
      });
    }

    // 类型断言确保数据类型正确
    const posts: Post[] = postsData as Post[];

    // 批量生成SEO数据
    const seoResults = await batchGenerateSEO(posts);
    
    // 批量更新数据库
    const updatePromises = seoResults.map(async ({ id, seoData }) => {
      const post = posts.find(p => p.id === id);
      if (!post) return null;

      const updatedMeta = {
        ...post.meta,
        seo: seoData.seo,
        structured_data: seoData.structuredData,
        open_graph: seoData.openGraph,
        twitter: seoData.twitter,
        canonical: seoData.canonical
      };

      const { error } = await supabase
        .from('posts')
        .update({ meta: updatedMeta })
        .eq('id', id);

      if (error) {
        console.error(`Failed to update post ${id}:`, error);
        return { id, success: false, error: error.message };
      }

      return { id, success: true };
    });

    const updateResults = await Promise.all(updatePromises);
    const successful = updateResults.filter(r => r?.success).length;
    const failed = updateResults.filter(r => r && !r.success);

    return NextResponse.json({
      success: true,
      message: `Processed ${posts.length} posts`,
      results: {
        total: posts.length,
        successful,
        failed: failed.length,
        errors: failed
      }
    });

  } catch (error) {
    console.error('Batch SEO optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch SEO optimization' },
      { status: 500 }
    );
  }
}

// 获取需要SEO优化的文章统计
export async function GET(request: NextRequest) {
  try {
    const supabase = createPublicClient();
    
    // 统计需要SEO优化的文章
    const { count: needsOptimization } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'publish')
      .is('meta->seo', null);

    // 统计已优化的文章
    const { count: optimized } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'publish')
      .not('meta->seo', 'is', null);

    // 统计总文章数
    const { count: total } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'publish');

    return NextResponse.json({
      success: true,
      stats: {
        total: total || 0,
        optimized: optimized || 0,
        needsOptimization: needsOptimization || 0,
        optimizationRate: total ? Math.round(((optimized || 0) / total) * 100) : 0
      }
    });

  } catch (error) {
    console.error('SEO stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get SEO statistics' },
      { status: 500 }
    );
  }
}
