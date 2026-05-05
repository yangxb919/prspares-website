import type { Metadata } from 'next';
import { createPublicClient } from '@/utils/supabase-public';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Clock,
  Factory,
  Layers3,
  ListChecks,
  Mail,
  MessageSquare,
  Newspaper,
  PackageCheck,
  Search,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { ArticleCard } from '@/types/blog';
import SafeImage from '@/components/SafeImage';
import BlogNewsletterSubscribe from '@/components/features/BlogNewsletterSubscribe';
import ScrollAnimator from '@/components/ScrollAnimator';
import { BLOG_CATEGORIES } from '@/lib/blog-categories';
import { pickPostDescription } from '@/lib/post-description';

const baseMetadata: Metadata = {
  title: 'Phone Repair Guides & Wholesale Parts Sourcing Tips | PRSPARES',
  description: 'Phone repair guides, wholesale sourcing tips, and parts quality insights for repair shops and distributors — from a Shenzhen factory-direct supplier.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Phone Repair Guides & Wholesale Parts Sourcing Tips | PRSPARES',
    description: 'Phone repair guides, wholesale sourcing tips, and parts quality insights for repair shops and distributors — from a Shenzhen factory-direct supplier.',
    type: 'website',
    url: '/blog',
    siteName: 'PRSPARES',
    images: ['/hero/products.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phone Repair Guides & Wholesale Parts Sourcing Tips | PRSPARES',
    description: 'Phone repair guides, wholesale sourcing tips, and parts quality insights for repair shops and distributors — from a Shenzhen factory-direct supplier.',
    images: ['/hero/products.jpg'],
  },
};

const topicIcons: Record<string, LucideIcon> = {
  'repair-guides': Wrench,
  'parts-knowledge': Smartphone,
  'sourcing-suppliers': PackageCheck,
  'business-tips': Briefcase,
  'industry-insights': Factory,
};

function revealStyle(delay: number): CSSProperties {
  return { '--reveal-delay': `${delay}ms` } as CSSProperties;
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <p className="text-sm font-bold text-[#0b6b45]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">{title}</h2>
      </div>
      {text && <p className="text-base leading-7 text-[#52606d] md:text-lg">{text}</p>}
    </div>
  );
}

type BlogSearchParams = {
  category?: string;
  tag?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: BlogSearchParams;
}): Promise<Metadata> {
  const hasArchiveFilter = Boolean(searchParams?.category || searchParams?.tag);

  if (!hasArchiveFilter) {
    return baseMetadata;
  }

  return {
    ...baseMetadata,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

// ISR: regenerate the list page at most every hour
export const revalidate = 3600;
export const fetchCache = 'force-no-store';

// Get article data from Supabase
export default async function BlogPage({
  searchParams,
}: {
  searchParams: BlogSearchParams;
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
      .limit(200);

    if (category && category !== 'all') {
      query = query.contains('meta', JSON.stringify({ category: category }));
    }

    console.log('Query conditions:', { category });

    const result = await query;
    postsData = result.data || [];
    error = result.error;

    // Fetch author profiles separately for all posts
    if (postsData && postsData.length > 0) {
      const authorIds = [...new Set(postsData.map((p: any) => p.author_id).filter(Boolean))];
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', authorIds);

        // Create a map of profiles by id
        const profileMap = new Map((profiles as any[] | null)?.map((p: any) => [p.id, p]) || []);

        // Attach profiles to posts
        postsData = postsData.map((post: any) => ({
          ...post,
          profiles: profileMap.get(post.author_id) || null
        }));
      }
    }

    console.log('Query completed:', { success: !error, dataCount: postsData?.length || 0 });

    if (postsData && postsData.length > 0) {
      console.log('Raw guide data retrieved:', postsData.map((p: any) => ({
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
      excerpt: pickPostDescription(
        post.meta,
        post.excerpt,
        post.content ? post.content.substring(0, 150) + '...' : '',
      ),
      category: post.meta?.category || 'parts-knowledge',
      author: authorName,
      date: publishDate,
      readTime: `${readTimeMin} min read`,
      imageSrc: coverImage,
      content: post.content
    };
  });

  const categoryLabels: Record<string, string> = Object.fromEntries(
    BLOG_CATEGORIES.map((c) => [c.slug, c.label]),
  );

  // Tabs now link to the indexable hub routes (/blog/category/<slug>) rather than
  // the non-indexed `?category=` filter. Keeping the query-string filter working
  // for deep links but internal navigation stays SEO-clean.
  const tabs = [
    { id: 'all', label: 'All Articles', href: '/blog', icon: BookOpen },
    ...BLOG_CATEGORIES.map((c) => ({
      id: c.slug,
      label: c.label,
      href: `/blog/category/${c.slug}`,
      icon: topicIcons[c.slug] || ListChecks,
    })),
  ];

  const activeTopicLabel = searchParams.category
    ? categoryLabels[searchParams.category] || 'Articles'
    : 'Latest Articles';

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <ScrollAnimator />

      <section className="relative overflow-hidden bg-[#101820] text-white">
        <Image
          src="/hero/products.jpg"
          alt="PRSPARES repair parts editorial workbench"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.95),rgba(10,16,24,0.78)_48%,rgba(10,16,24,0.32))]" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
              PRSPARES repair parts knowledge base
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Phone Repair Guides for Wholesale Buyers
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              Practical sourcing notes, QC checklists and repair-shop buying guides for teams that stock screens, batteries, small parts, IC chips and tools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#latest-guides"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313]"
              >
                Read Latest Guides
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border border-white/20 bg-black/30 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <div className="text-sm font-bold text-[#bff2d0]">Editorial map</div>
                  <div className="mt-1 text-2xl font-black text-white">Repair · QC · Sourcing</div>
                </div>
                <Newspaper className="h-9 w-9 text-[#ffb36b]" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ['Screen quality', 'OLED, Incell, frame fit and callback risk'],
                  ['Battery buying', 'Capacity, packing, route and MOQ notes'],
                  ['Supplier checks', 'Factory-direct sourcing and QC questions'],
                ].map(([title, text]) => (
                  <div key={title} className="border border-white/12 bg-white/[0.07] p-3">
                    <div className="text-sm font-black text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-300">{text}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-white/60">Built for repair shops, distributors and sourcing teams.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d9d2c4] bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            [String(articles.length), 'published guides', 'Live repair and sourcing articles'],
            [String(BLOG_CATEGORIES.length), 'topic hubs', 'Repair, sourcing and shop operations'],
            ['24h', 'quote context', 'Content tied to wholesale buying workflows'],
            ['B2B', 'reader focus', 'Repair shops, wholesalers and distributors'],
          ].map(([value, label, detail]) => (
            <div key={label} className="border border-[#e4d8c2] bg-white px-4 py-4">
              <div className="font-mono text-2xl font-black text-[#ff8a2a]">{value}</div>
              <div className="mt-1 text-sm font-black text-[#18212c]">{label}</div>
              <div className="mt-1 text-xs leading-5 text-[#52606d]">{detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sticky top-[70px] z-20 border-b border-[#ded6c8] bg-[#FBF7F0]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto">
            {tabs.map((tab) => {
              const active = (!searchParams.category && tab.id === 'all') || searchParams.category === tab.id;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-black transition ${
                    active
                      ? 'border-[#0b6b45] bg-[#0b6b45] text-white'
                      : 'border-[#e4d8c2] bg-white text-[#27313c] hover:border-[#ff8a2a] hover:text-[#0b6b45]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Editorial purpose"
              title="Built for repair shops and wholesale buyers."
              text="The blog is organized around real decisions: how to compare screen grades, avoid callback risk, buy batteries safely, qualify suppliers and prepare better mixed-parts quote lists."
            />
          </div>

          {!searchParams.category && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {BLOG_CATEGORIES.map((categoryItem, index) => {
                const Icon = topicIcons[categoryItem.slug] || ListChecks;
                return (
                  <Link
                    key={categoryItem.slug}
                    href={`/blog/category/${categoryItem.slug}`}
                    data-scroll-reveal="scale"
                    style={revealStyle(index * 55)}
                    className="group min-h-full rounded-lg border border-[#ded6c8] bg-[#fbfaf7] p-5 shadow-sm transition hover:border-[#ff8a2a] hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#0b6b45] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#18212c] group-hover:text-[#0b6b45]">{categoryItem.label}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#52606d]">{categoryItem.card}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="latest-guides" className="scroll-mt-36 bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal>
            <SectionTitle
              eyebrow="Latest articles"
              title={activeTopicLabel}
              text="Scan current repair guides, sourcing notes and wholesale buying playbooks from the PRSPARES content library."
            />
          </div>

          {articles.length === 0 ? (
            <div className="border border-[#ded6c8] bg-white px-6 py-16 text-center shadow-sm">
              <Search className="mx-auto h-10 w-10 text-[#0b6b45]" />
              <h2 className="mt-5 text-2xl font-black text-[#18212c]">No repair guides found</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#52606d]">
                New guides and sourcing notes are being prepared. Check another topic hub or return to the full article list.
              </p>
              <Link href="/blog" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-[#18212c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#27313c]">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group block h-full">
                  <article
                    data-scroll-reveal="scale"
                    style={revealStyle(index < 9 ? index * 45 : 0)}
                    className="flex h-full flex-col overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm transition hover:border-[#ff8a2a] hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#18212c]">
                      <SafeImage
                        src={article.imageSrc}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/8 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-md bg-white px-3 py-1 text-xs font-black text-[#18212c] shadow-sm">
                        {categoryLabels[article.category] || article.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#52606d]">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {article.author}
                        </span>
                        {article.date && <span>{article.date}</span>}
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#fffaf0] px-2 py-1 text-[#0b6b45]">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                      <h2 className="mt-4 min-h-[3.5rem] text-xl font-black leading-7 text-[#18212c] transition group-hover:text-[#0b6b45]">
                        {article.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#52606d]">{article.excerpt}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a]">
                        Read Guide
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div data-scroll-reveal="left">
            <p className="text-sm font-bold text-[#ffb36b]">Buyer notes by email</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Keep sourcing decisions close to the quote workflow.</h2>
            <p className="mt-5 text-base leading-7 text-slate-200">
              Get repair-parts buying notes, QC reminders and sourcing ideas written for B2B repair businesses.
            </p>
          </div>
          <div data-scroll-reveal="right" className="rounded-lg border border-white/15 bg-white/[0.06] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Mail className="h-7 w-7 text-[#51d88a]" />
              <div>
                <h3 className="text-xl font-black text-white">PRSPARES field notes</h3>
                <p className="mt-1 text-sm text-slate-300">Occasional practical updates, no fake urgency.</p>
              </div>
            </div>
            <BlogNewsletterSubscribe />
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#bff2d0]">Ready for next step</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Turn the guide into a quote list.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
              Send model, category, grade and quantity. PRSPARES can reply with price tiers, stock status and shipping route.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/wholesale-inquiry" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]">
              Get Wholesale Quote
              <MessageSquare className="h-5 w-5" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-black text-white transition hover:bg-white/20">
              Browse Catalog
              <Layers3 className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
