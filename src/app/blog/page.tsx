import type { Metadata } from 'next';
import { createPublicClient } from '@/utils/supabase-public';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleCard } from '@/types/blog';
import BlogHeader from '@/components/features/BlogHeader';
import Breadcrumb from '@/components/shared/Breadcrumb';
import SafeImage from '@/components/SafeImage';

export const metadata: Metadata = {
  title: 'Repair Guides & Insights - PRSPARES',
  description: 'Explore expert mobile repair guides, tips, and the latest news in the mobile parts industry from PRSPARES.',
};

// Force revalidation on each request
export const revalidate = 0;

// Get article data from Supabase
export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // Gracefully handle missing Supabase envs in local dev to avoid runtime crash
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a3.75 3.75 0 10-7.5 0v3.75m11.356 10.5H3.644A1.125 1.125 0 012.52 19.875l1.238-8.663A4.5 4.5 0 018.23 7.5h7.54a4.5 4.5 0 014.472 3.712l1.238 8.663a1.125 1.125 0 01-1.125 1.125z"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Supabase config missing</h2>
        <p className="text-gray-600 max-w-xl">
          Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to load blog posts.
        </p>
      </div>
    );
  }

  const supabase = createPublicClient();
  const category = searchParams.category;

  console.log('Starting repair guides data query...');

  let postsData: any[] = [];
  let error: any = null;

  try {
    let query = supabase
      .from('posts') // Assuming 'posts' table is used for guides/articles
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        status,
        published_at,
        created_at,
        meta,
        author_id
      `)
      .eq('status', 'publish')
      .order('published_at', { ascending: false })
      .limit(20);

    if (category && category !== 'all') {
      query = query.contains('meta', JSON.stringify({ category: category }));
    }

    console.log('Query conditions:', { category });

    const result = await query;
    postsData = result.data || [];
    error = result.error;

    // Fetch author profiles separately for all posts
    if (postsData && postsData.length > 0) {
      const authorIds = [...new Set(postsData.map(p => p.author_id).filter(Boolean))];
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', authorIds);

        // Create a map of profiles by id
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        // Attach profiles to posts
        postsData = postsData.map(post => ({
          ...post,
          profiles: profileMap.get(post.author_id) || null
        }));
      }
    }

    console.log('Query completed:', { success: !error, dataCount: postsData?.length || 0 });

    if (postsData && postsData.length > 0) {
      console.log('Raw guide data retrieved:', postsData.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        published_at: p.published_at
      })));
    } else {
      console.log('No guide data retrieved.');
    }
  } catch (err) {
    console.error('Guide data query exception:', err);
    error = err;
  }

  const articles: ArticleCard[] = postsData.map((post: any) => {
    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
    const publishDate = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US') : '';
    // 为不同类型的文章提供更相关的默认图片
    const getDefaultCoverImage = (post: any) => {
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

    const coverImageRaw = post.meta?.cover_image || getDefaultCoverImage(post);
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
    const authorProfile = post.profiles as any;
    const authorName = authorProfile?.display_name || 'PRSPARES Team';

    return {
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : ''),
      category: post.meta?.category || 'Repair Tips',
      author: authorName,
      date: publishDate,
      readTime: `${readTimeMin} min read`,
      imageSrc: coverImage,
      content: post.content
    };
  });

  const tabs = [
    { id: 'all', label: 'All Guides', href: '/blog' },
    { id: 'screen-repair', label: 'Screen Repair', href: '/blog?category=screen-repair' },
    { id: 'battery', label: 'Battery Issues', href: '/blog?category=battery' },
    { id: 'water-damage', label: 'Water Damage', href: '/blog?category=water-damage' },
    { id: 'troubleshooting', label: 'Troubleshooting', href: '/blog?category=troubleshooting' },
    { id: 'industry-news', label: 'Industry News', href: '/blog?category=industry-news' },
  ];

  // Breadcrumb navigation data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog', isCurrent: true },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <BlogHeader />
      
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      <div className="bg-white sticky top-[70px] z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              {tabs.map(tab => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    (!searchParams.category && tab.id === 'all') || searchParams.category === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench text-gray-400"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l3.5-3.5a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0L14.7 6.3z"/><path d="M9.5 12.5 3 19l-2-2 6.5-6.5"/><path d="m12.5 9.5 6.5 6.5"/><path d="M18 13.5V18c0 1.1.9 2 2 2h1.5"/><path d="M6 6.5h1.5c1.1 0 2 .9 2 2V18"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Repair Guides Found</h2>
            <p className="text-gray-500 mb-8">We are currently working on new guides and tips. Please check back soon!</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group block h-full">
                  <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={article.imageSrc}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300 min-h-[3.5rem] leading-tight">
                        {article.title}
                      </h2>

                      <p className="text-gray-600 mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <span className="font-medium">{article.author}</span>
                          <span>·</span>
                          <span>{article.date}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200">{article.readTime}</span>
                      </div>

                      <div className="mt-5 flex items-center text-[#00B140] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <span className="text-sm font-semibold">Read Guide</span>
                        <svg className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination (Simplified, assuming more complex logic if many articles) */}
            <div className="mt-16 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-[#00B140] text-white rounded-lg font-semibold text-sm shadow-md">1</button>
                {/* Add more page numbers if necessary */}
                <button className="p-2.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with PRSPARES</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Get the latest mobile repair tips, product announcements, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B140] focus:border-transparent bg-white shadow-sm"
              />
              <button className="px-7 py-3.5 bg-[#00B140] text-white rounded-lg font-semibold hover:bg-[#008631] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We value your privacy. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
