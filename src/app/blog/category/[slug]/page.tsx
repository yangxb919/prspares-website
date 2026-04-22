import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/utils/supabase-public';
import Breadcrumb from '@/components/shared/Breadcrumb';
import SafeImage from '@/components/SafeImage';
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
} from '@/lib/blog-categories';
import { pickPostDescription } from '@/lib/post-description';
import type { ArticleCard } from '@/types/blog';

export const revalidate = 3600;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return { title: 'Category Not Found | PRSPARES' };

  const canonical = `/blog/category/${cat.slug}`;
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical },
    openGraph: {
      title: cat.title,
      description: cat.description,
      type: 'website',
      url: canonical,
      siteName: 'PRSPARES',
      images: ['/PRSPARES1.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: cat.title,
      description: cat.description,
      images: ['/PRSPARES1.png'],
    },
  };
}

function getDefaultCoverImage(post: any) {
  const title = (post.title || '').toLowerCase();
  const content = (post.content || '').toLowerCase();
  if (/screen|display|lcd|oled/.test(title)) {
    return '/prspares-mobile-phone-lcd-oled-display-screens-replacement-parts.jpg';
  }
  if (/battery/.test(title) || /battery/.test(content)) {
    return '/prspares-smartphone-battery-high-capacity-lithium-original-replacement.jpg';
  }
  if (/repair|tool/.test(title) || /repair/.test(content)) {
    return '/prspares-professional-phone-repair-tools-screwdriver-heat-gun-equipment.jpg';
  }
  if (/parts|component/.test(title) || /parts/.test(content)) {
    return '/prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg';
  }
  return '/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg';
}

function normalizeCoverImage(input: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let origin = '';
  try {
    origin = base ? new URL(base).origin : '';
  } catch {}
  let url = String(input || '').trim();
  if (!url) return url;
  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('http://')) url = `https://${url.slice(7)}`;
  if (/^\/?storage\/v1\//i.test(url) && origin)
    url = `${origin}/${url.replace(/^\//, '')}`;
  if (/^\/?post-images\//i.test(url) && origin)
    url = `${origin}/storage/v1/object/public/${url.replace(/^\//, '')}`;
  try {
    url = encodeURI(url);
  } catch {}
  return url;
}

export default async function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) notFound();

  const supabase = createPublicClient();
  const { data: postsDataRaw } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, content, published_at, meta, author_id',
    )
    .eq('status', 'publish')
    .contains('meta', JSON.stringify({ category: cat.slug }))
    .order('published_at', { ascending: false })
    .limit(100);

  const postsData: any[] = postsDataRaw || [];

  // Attach author display names
  const authorIds = Array.from(
    new Set(postsData.map((p: any) => p.author_id).filter(Boolean)),
  );
  const profileMap = new Map<string, any>();
  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', authorIds);
    (profiles as any[] | null)?.forEach((p: any) => profileMap.set(p.id, p));
  }

  const articles: ArticleCard[] = postsData.map((post: any) => {
    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
    const publishDate = post.published_at
      ? new Date(post.published_at).toLocaleDateString('en-US')
      : '';
    const coverRaw = post.meta?.cover_image || getDefaultCoverImage(post);
    const authorProfile = profileMap.get(post.author_id);
    return {
      id: String(post.id),
      slug: post.slug,
      title: post.title,
      excerpt: pickPostDescription(
        post.meta,
        post.excerpt,
        post.content ? post.content.substring(0, 150) + '...' : '',
      ),
      category: post.meta?.category || cat.slug,
      author: authorProfile?.display_name || 'PRSPARES Team',
      date: publishDate,
      readTime: `${readTimeMin} min read`,
      imageSrc: normalizeCoverImage(coverRaw),
      content: post.content,
    };
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: cat.label, href: `/blog/category/${cat.slug}`, isCurrent: true },
  ];

  const otherCategories = BLOG_CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2440] text-white py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-sm text-blue-200 mb-3">
            <Link href="/blog" className="hover:text-white">
              ← All Blog Posts
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl leading-tight">
            {cat.h1}
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl leading-relaxed">
            {cat.intro}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      {/* Article grid */}
      <div className="max-w-[1200px] mx-auto px-4 pb-12">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No articles in this category yet
            </h2>
            <p className="text-gray-500 mb-8">
              New guides are added every week. Browse all blog posts in the meantime.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-500">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'} in{' '}
              <span className="font-medium text-gray-700">{cat.label}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block h-full"
                >
                  <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={article.imageSrc}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300 min-h-[3.5rem] leading-tight">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                        <span className="font-medium">{article.author}</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Other topics — internal linking */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore other topics
          </h2>
          <p className="text-gray-600 mb-8">
            More content hubs for repair shops and wholesale buyers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className="group block rounded-xl border border-gray-100 p-5 hover:border-[#00B140] hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{c.emoji}</div>
                <div className="font-semibold text-gray-900 group-hover:text-[#00B140] mb-1">
                  {c.label}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {c.card}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2440]">
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Source Phone Repair Parts?
            </h2>
            <p className="text-blue-200 mb-8 text-lg leading-relaxed">
              Factory-direct from Shenzhen. OEM quality, flexible MOQ, 12-month
              warranty. Get a free quote within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/wholesale-inquiry"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg transition-colors shadow-lg text-lg"
              >
                Get Wholesale Quote
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors text-lg"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
