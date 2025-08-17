// 自动SEO生成器 - 为博客文章自动生成完整的SEO数据

import { analyzeSEO, SEOAnalysis } from './seo-analyzer';

export interface AutoSEOResult {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    focusKeyword: string;
    keywordDensity: number;
    score: number;
    suggestions: string[];
    readabilityScore: number;
    wordCount: number;
    readingTime: number;
  };
  structuredData: any;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url?: string;
    image?: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  canonical?: string;
}

/**
 * 为博客文章生成完整的SEO数据
 */
export function generateAutoSEO(
  title: string,
  content: string,
  slug: string,
  excerpt?: string,
  coverImage?: string,
  author?: string,
  publishedAt?: string
): AutoSEOResult {
  // 进行SEO分析
  const analysis: SEOAnalysis = analyzeSEO(title, content);

  // 生成结构化数据 (JSON-LD)
  const structuredData = generateStructuredData({
    title: analysis.seoTitle,
    description: analysis.seoDescription,
    content,
    slug,
    author: author || 'PRSPARES Team',
    publishedAt: publishedAt || new Date().toISOString(),
    coverImage,
    keywords: analysis.keywords,
    wordCount: analysis.wordCount,
    readingTime: analysis.readingTime
  });

  // 生成Open Graph数据
  const openGraph = {
    title: analysis.seoTitle,
    description: analysis.seoDescription,
    type: 'article',
    url: `https://prspares.com/blog/${slug}`,
    image: coverImage || getDefaultSEOImage(analysis.keywords)
  };

  // 生成Twitter卡片数据
  const twitter = {
    card: 'summary_large_image',
    title: analysis.seoTitle.length > 70 ? analysis.seoTitle.substring(0, 67) + '...' : analysis.seoTitle,
    description: analysis.seoDescription.length > 200 ? analysis.seoDescription.substring(0, 197) + '...' : analysis.seoDescription,
    image: coverImage || getDefaultSEOImage(analysis.keywords)
  };

  return {
    seo: {
      title: analysis.seoTitle,
      description: analysis.seoDescription,
      keywords: analysis.keywords,
      focusKeyword: analysis.focusKeyword,
      keywordDensity: analysis.keywordDensity,
      score: analysis.seoScore,
      suggestions: analysis.suggestions,
      readabilityScore: analysis.readabilityScore,
      wordCount: analysis.wordCount,
      readingTime: analysis.readingTime
    },
    structuredData,
    openGraph,
    twitter,
    canonical: `https://prspares.com/blog/${slug}`
  };
}

/**
 * 生成结构化数据 (JSON-LD)
 */
function generateStructuredData(data: {
  title: string;
  description: string;
  content: string;
  slug: string;
  author: string;
  publishedAt: string;
  coverImage?: string;
  keywords: string[];
  wordCount: number;
  readingTime: number;
}) {
  const baseUrl = 'https://prspares.com';
  const articleUrl = `${baseUrl}/blog/${data.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.coverImage || `${baseUrl}/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg`,
    author: {
      '@type': 'Organization',
      name: data.author,
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'PRSPARES',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/PRSPARES1.png`,
        width: 600,
        height: 60
      }
    },
    datePublished: data.publishedAt,
    dateModified: data.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    url: articleUrl,
    keywords: data.keywords.join(', '),
    wordCount: data.wordCount,
    timeRequired: `PT${data.readingTime}M`,
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Mobile Phone Repair',
      description: 'Mobile phone repair parts, guides, and industry insights'
    },
    mentions: data.keywords.slice(0, 5).map(keyword => ({
      '@type': 'Thing',
      name: keyword
    })),
    isPartOf: {
      '@type': 'Blog',
      name: 'PRSPARES Repair Guides & Insights',
      url: `${baseUrl}/blog`
    }
  };
}

/**
 * 根据关键词选择默认SEO图片
 */
function getDefaultSEOImage(keywords: string[]): string {
  const baseUrl = 'https://prspares.com';
  const keywordString = keywords.join(' ').toLowerCase();

  if (keywordString.includes('screen') || keywordString.includes('display') || 
      keywordString.includes('lcd') || keywordString.includes('oled')) {
    return `${baseUrl}/prspares-mobile-phone-lcd-oled-display-screens-replacement-parts.jpg`;
  } else if (keywordString.includes('battery')) {
    return `${baseUrl}/prspares-smartphone-battery-high-capacity-lithium-original-replacement.jpg`;
  } else if (keywordString.includes('repair') || keywordString.includes('tool')) {
    return `${baseUrl}/prspares-professional-phone-repair-tools-screwdriver-heat-gun-equipment.jpg`;
  } else if (keywordString.includes('parts') || keywordString.includes('component')) {
    return `${baseUrl}/prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg`;
  } else {
    return `${baseUrl}/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg`;
  }
}

/**
 * 生成内部链接建议
 */
export function generateInternalLinkSuggestions(
  content: string,
  keywords: string[],
  existingPosts: Array<{ title: string; slug: string; excerpt?: string }>
): Array<{ anchor: string; url: string; relevance: number }> {
  const suggestions: Array<{ anchor: string; url: string; relevance: number }> = [];
  
  // 分析内容中可能的链接机会
  const contentLower = content.toLowerCase();
  
  existingPosts.forEach(post => {
    const postTitle = post.title.toLowerCase();
    const postExcerpt = (post.excerpt || '').toLowerCase();
    
    // 计算相关性分数
    let relevance = 0;
    
    // 检查关键词匹配
    keywords.forEach(keyword => {
      if (postTitle.includes(keyword.toLowerCase()) || 
          postExcerpt.includes(keyword.toLowerCase())) {
        relevance += 2;
      }
    });
    
    // 检查内容中是否提到相关主题
    const postKeywords = postTitle.split(' ').filter(word => word.length > 3);
    postKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        relevance += 1;
      }
    });
    
    if (relevance > 2) {
      suggestions.push({
        anchor: post.title,
        url: `/blog/${post.slug}`,
        relevance
      });
    }
  });
  
  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
}

/**
 * 生成SEO友好的URL slug
 */
export function generateSEOSlug(title: string, keywords: string[]): string {
  const focusKeyword = keywords[0] || '';
  
  // 基础slug生成
  let slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // 如果slug不包含主要关键词，尝试添加
  if (focusKeyword && !slug.includes(focusKeyword.replace(/\s+/g, '-'))) {
    const keywordSlug = focusKeyword.toLowerCase().replace(/\s+/g, '-');
    slug = `${keywordSlug}-${slug}`;
  }

  // 限制长度
  if (slug.length > 60) {
    slug = slug.substring(0, 60).replace(/-[^-]*$/, '');
  }

  return slug;
}

/**
 * 验证SEO数据质量
 */
export function validateSEOData(seoData: AutoSEOResult): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 必需字段检查
  if (!seoData.seo.title) {
    errors.push('SEO标题不能为空');
  }
  if (!seoData.seo.description) {
    errors.push('SEO描述不能为空');
  }
  if (!seoData.seo.keywords.length) {
    errors.push('至少需要一个关键词');
  }

  // 长度检查
  if (seoData.seo.title.length > 60) {
    warnings.push('SEO标题可能过长');
  }
  if (seoData.seo.description.length > 160) {
    warnings.push('SEO描述可能过长');
  }

  // 质量检查
  if (seoData.seo.score < 60) {
    warnings.push('SEO分数较低，建议优化');
  }
  if (seoData.seo.readabilityScore < 50) {
    warnings.push('文章可读性较低');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 为现有文章批量生成SEO数据
 */
export async function batchGenerateSEO(
  posts: Array<{
    id: number;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    meta?: any;
  }>
): Promise<Array<{ id: number; seoData: AutoSEOResult }>> {
  const results: Array<{ id: number; seoData: AutoSEOResult }> = [];

  for (const post of posts) {
    try {
      const seoData = generateAutoSEO(
        post.title,
        post.content,
        post.slug,
        post.excerpt,
        post.meta?.cover_image
      );
      
      results.push({
        id: post.id,
        seoData
      });
    } catch (error) {
      console.error(`Failed to generate SEO for post ${post.id}:`, error);
    }
  }

  return results;
}
