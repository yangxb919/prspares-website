import { createPublicClient } from '@/utils/supabase-public';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Post, Profile } from '@/types/blog';
import TableOfContents from '@/components/features/TableOfContents';
import RelatedPosts from '@/components/features/RelatedPosts';
import SafeImage from '@/components/SafeImage';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// 定义Meta类型
interface PostMeta {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  open_graph?: any;
  twitter?: any;
  cover_image?: string;
}

// 定义查询返回的Post类型
interface QueryPost {
  title: string;
  excerpt: string | null;
  meta: any;
}

// 定义RelatedPost类型
interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  meta?: {
    cover_image?: string;
  };
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return {
      title: 'Guide - PRSPARES',
      description: 'Repair guide details'
    };
  }

  const supabase = createPublicClient();

  try {
    const { data: postData } = await supabase
      .from('posts')
      .select('title,excerpt,meta')
      .eq('slug', params.slug)
      .eq('status', 'publish')
      .single();

    if (!postData) {
      return {
        title: 'Guide Not Found - PRSPARES',
        description: 'Sorry, the repair guide or article you requested does not exist.'
      };
    }

    // 类型断言确保数据类型正确
    const post = postData as QueryPost;

    // 使用存储的SEO数据（如果有）
    const meta = post.meta as PostMeta | null;
    const seoData = meta?.seo;
    const openGraphData = meta?.open_graph;
    const twitterData = meta?.twitter;

    return {
      title: seoData?.title || `${post.title} - PRSPARES Repair Guides`,
      description: seoData?.description || post.excerpt || `Read our expert guide on ${post.title}`,
      keywords: seoData?.keywords?.join(', '),
      openGraph: openGraphData ? {
        title: openGraphData.title,
        description: openGraphData.description,
        type: 'article',
        url: openGraphData.url,
        images: openGraphData.image ? [{ url: openGraphData.image }] : undefined,
      } : undefined,
      twitter: twitterData ? {
        card: 'summary_large_image',
        title: twitterData.title,
        description: twitterData.description,
        images: twitterData.image ? [twitterData.image] : undefined,
      } : undefined,
      alternates: {
        canonical: post.meta?.canonical
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Guide - PRSPARES',
      description: 'Repair guide details'
    };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    notFound();
  }
  const supabase = createPublicClient();
  
  try {
    // First, fetch the post without the relationship
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        status,
        published_at,
        meta,
        author_id
      `)
      .eq('slug', params.slug)
      .eq('status', 'publish')
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      throw error;
    }

    if (!post) {
      notFound();
    }

    // Then fetch the author profile separately if author_id exists
    let authorProfile: Profile | null = null;
    if (post.author_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', post.author_id)
        .single();
      authorProfile = profile as Profile | null;
    }

    const typedPost = post as unknown as Post;
    // Attach the profile to the post object for compatibility
    if (authorProfile) {
      (typedPost as any).profiles = authorProfile;
    }

    const wordCount = typedPost.content ? typedPost.content.split(/\s+/).length : 0;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
    const publishDate = typedPost.published_at ? new Date(typedPost.published_at).toLocaleDateString('en-US') : '';
    // 为不同类型的文章提供更相关的默认图片
    const getDefaultCoverImage = (post: Post) => {
      const title = post.title.toLowerCase();
      const content = post.content?.toLowerCase() || '';

      if (title.includes('screen') || title.includes('display') || title.includes('lcd') || title.includes('oled')) {
        return '/prspares-mobile-phone-lcd-oled-display-screens-replacement-parts.jpg';
      } else if (title.includes('battery') || content.includes('battery')) {
        return '/prspares-smartphone-battery-high-capacity-lithium-original-replacement.jpg';
      } else if (title.includes('repair') || title.includes('tool') || content.includes('repair')) {
        return '/prspares-professional-phone-repair-tools-screwdriver-heat-gun-equipment.jpg';
      } else if (title.includes('parts') || title.includes('component') || content.includes('parts')) {
        return '/prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg';
      } else {
        return '/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg';
      }
    };

    const coverImageRaw = typedPost.meta?.cover_image || getDefaultCoverImage(typedPost);
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const origin = (() => { try { return base ? new URL(base).origin : ''; } catch { return ''; } })();
    const normalizeCover = (input: string) => {
      let url = String(input || '').trim();
      if (!url) return url;
      if (url.startsWith('//')) url = `https:${url}`;
      if (url.startsWith('http://')) url = `https://${url.slice(7)}`;
      if (/^\/?storage\/v1\//i.test(url) && origin) url = `${origin}/${url.replace(/^\//,'')}`;
      if (/^\/?post-images\//i.test(url) && origin) url = `${origin}/storage/v1/object/public/${url.replace(/^\//,'')}`;
      try { url = encodeURI(url); } catch {}
      return url;
    };
    const coverImage = normalizeCover(coverImageRaw);
    const authorName = authorProfile?.display_name || 'PRSPARES Team';
    const authorAvatar = authorProfile?.avatar_url;

    const { data: relatedPostsData } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, published_at, meta')
      .eq('status', 'publish')
      .neq('id', post.id)
      .limit(3)
      .order('published_at', { ascending: false });

    // 类型断言确保数据类型正确
    const relatedPosts = relatedPostsData as RelatedPost[] | null;
    
    // 获取结构化数据
    const structuredData = typedPost.meta?.structured_data;

    return (
      <>
        {/* 结构化数据 */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}

        <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[55vh] min-h-[450px] overflow-hidden shadow-lg">
          <div className="absolute inset-0">
            <SafeImage
              src={coverImage}
              alt={typedPost.title}
              fill
              style={{objectFit: 'cover'}}
              priority
              sizes="100vw"
              className="transform scale-105 group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-16">
            <div className="max-w-[850px] mx-auto px-4 w-full">
              <nav className="mb-4 md:mb-6">
                <div className="flex items-center text-sm text-white/80 space-x-2">
                  <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
                  <span>/</span>
                  <Link href="/blog" className="hover:text-white transition-colors duration-200">Guides</Link>
                  <span>/</span>
                  <span className="text-white font-medium truncate max-w-xs md:max-w-sm">{typedPost.title}</span>
                </div>
              </nav>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight shadow-text">
                {typedPost.title}
              </h1>
              <div className="flex items-center text-white/90">
                {authorAvatar && (
                  <Image 
                    src={authorAvatar} 
                    alt={authorName} 
                    width={52} 
                    height={52} 
                    className="rounded-full border-2 border-white/30 shadow-md mr-4"
                  />
                )}
                {!authorAvatar && (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-semibold mr-4 border-2 border-white/30 shadow-md">
                        {authorName.charAt(0)}
                    </div>
                )}
                <div>
                  <p className="font-semibold text-lg text-white">{authorName}</p>
                  <div className="flex items-center text-sm text-white/80 space-x-2">
                    <span>{publishDate}</span>
                    <span className="opacity-50">•</span>
                    <span>{readTimeMin} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
              {/* Main Content */}
              <div className="lg:w-[calc(66.666%-1.25rem)] xl:w-[calc(66.666%-1.5rem)]">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <article className="p-6 md:p-8 lg:p-12">
                    {/* 优化的文章内容样式 - 专注于阅读舒适性 */}
                    <div className="prose prose-lg max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-headings:scroll-mt-20
                      prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:leading-snug
                      prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-16 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4 prose-h2:leading-snug
                      prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12 prose-h3:leading-snug
                      prose-h4:text-xl prose-h4:mb-4 prose-h4:mt-8 prose-h4:leading-snug
                      prose-h5:text-lg prose-h5:mb-3 prose-h5:mt-6
                      prose-h6:text-base prose-h6:mb-2 prose-h6:mt-4
                      prose-p:text-gray-700 prose-p:leading-8 prose-p:mb-8 prose-p:text-[17px] prose-p:font-normal
                      prose-a:text-[#00B140] prose-a:font-medium hover:prose-a:text-[#008631] prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
                      prose-strong:font-semibold prose-strong:text-gray-900
                      prose-em:italic prose-em:text-gray-700
                      prose-ul:my-8 prose-ul:space-y-3 prose-ul:pl-6
                      prose-ol:my-8 prose-ol:space-y-3 prose-ol:pl-6
                      prose-li:text-gray-700 prose-li:leading-8 prose-li:text-[17px] prose-li:my-2 prose-li:marker:text-[#00B140]
                      prose-blockquote:border-l-4 prose-blockquote:border-[#00B140] prose-blockquote:bg-gradient-to-r prose-blockquote:from-green-50 prose-blockquote:to-transparent prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-10 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg prose-blockquote:shadow-sm
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:border prose-img:border-gray-200
                      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-[15px] prose-code:font-mono prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-lg
                      prose-table:my-10 prose-table:border prose-table:border-gray-200 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm
                      prose-thead:bg-gray-50
                      prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:border-b prose-th:border-gray-200
                      prose-td:p-4 prose-td:border-b prose-td:border-gray-100 prose-td:text-gray-700
                      prose-hr:my-12 prose-hr:border-gray-200
                      first-letter:text-7xl first-letter:font-bold first-letter:text-[#00B140] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none
                    ">
                      <MarkdownRenderer
                        content={typedPost.content || 'Content not available.'}
                        articleTitle={typedPost.title}
                      />
                    </div>
                  </article>
                  
                  {/* Tags Section */}
                  {typedPost.meta?.tags && Array.isArray(typedPost.meta.tags) && typedPost.meta.tags.length > 0 && (
                    <div className="px-6 md:px-8 lg:px-12 pb-8 border-t border-gray-100">
                      <div className="pt-8">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Related Tags</h3>
                        <div className="flex flex-wrap gap-3">
                          {typedPost.meta.tags.map((tag: string) => (
                            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`} className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 hover:text-green-800 transition-colors duration-200 shadow-sm">
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar - Table of Contents */}
              <aside className="lg:w-[calc(33.333%-1.25rem)] xl:w-[calc(33.333%-1.5rem)]">
                <TableOfContents content={typedPost.content || ''} />
              </aside>
            </div>
          </div>
        </div>
        
        {/* Related Posts Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-[1200px] mx-auto px-4">
            <RelatedPosts posts={relatedPosts || []} />
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-br from-green-500 via-[#00B140] to-teal-600 py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Need Specific Parts or Expert Advice?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
              Can't find what you're looking for or need professional help? Contact PRSPARES today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/products" className="bg-white hover:bg-gray-100 text-[#00B140] font-semibold py-3.5 px-8 rounded-lg transition-colors duration-200 shadow-md text-lg">
                Browse All Parts
              </Link>
              <Link href="/contact" className="border-2 border-white hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors duration-200 text-lg">
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </main>
      </>
    );
  } catch (error) {
    console.error('Guide page rendering error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    notFound();
  }
}
