// SEO生成API - 为文章内容生成SEO数据

import { NextRequest, NextResponse } from 'next/server';
import { generateAutoSEO, validateSEOData } from '@/utils/auto-seo-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, slug, excerpt, coverImage, author, publishedAt } = body;

    // 验证必需字段
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // 生成SEO数据
    const seoData = generateAutoSEO(
      title,
      content,
      slug || '',
      excerpt,
      coverImage,
      author,
      publishedAt
    );

    // 验证生成的SEO数据
    const validation = validateSEOData(seoData);

    return NextResponse.json({
      success: true,
      data: seoData,
      validation
    });

  } catch (error) {
    console.error('SEO generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO data' },
      { status: 500 }
    );
  }
}

// 预览SEO数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const content = searchParams.get('content');
  const slug = searchParams.get('slug');

  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content parameters are required' },
      { status: 400 }
    );
  }

  try {
    const seoData = generateAutoSEO(title, content, slug || '');
    const validation = validateSEOData(seoData);

    return NextResponse.json({
      success: true,
      preview: {
        title: seoData.seo.title,
        description: seoData.seo.description,
        keywords: seoData.seo.keywords.slice(0, 5),
        score: seoData.seo.score,
        suggestions: seoData.seo.suggestions
      },
      validation
    });

  } catch (error) {
    console.error('SEO preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO preview' },
      { status: 500 }
    );
  }
}
