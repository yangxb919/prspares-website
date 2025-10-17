'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createPublicClient } from '@/utils/supabase-public';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import { convertToPosts } from '@/utils/type-converters';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  meta: any;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  } | {
    display_name: string;
    avatar_url?: string;
  }[];
}

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection = ({ children, delay = 0, className = '' }: FadeInSectionProps) => {
  return (
    <div className={`fade-in ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default function LatestBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createPublicClient();

      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            content,
            published_at,
            meta,
            profiles:profiles(display_name, avatar_url)
          `)
          .eq('status', 'publish')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching latest blog posts:', error);
          setPosts([]);
        } else {
          // 类型断言确保数据类型正确
          const typedPosts = (postsData as any) || [];
          setPosts(typedPosts || []);
        }
      } catch (err) {
        console.error('Failed to fetch latest blog posts:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Loading状态
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-gray-100 rounded-2xl overflow-hidden h-96 animate-pulse">
            <div className="h-56 bg-gray-200"></div>
            <div className="p-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 如果没有文章，显示默认的静态内容
  if (!posts || posts.length === 0) {
    const defaultGuides = [
      {
        image: 'repair-guide-1',
        title: 'iPhone 15 Complete Screen Replacement Guide',
        description: 'Detailed iPhone 15 screen replacement guide with professional tips and common pitfall prevention methods.',
        type: 'Screen Repair',
        duration: '25 min',
        difficulty: 'Intermediate',
        delay: 0
      },
      {
        image: 'repair-guide-2',
        title: 'Samsung Galaxy S24 Battery Replacement Guide',
        description: 'Learn proper battery removal techniques and safety precautions for various smartphone models.',
        type: 'Battery Repair',
        duration: '18 min',
        difficulty: 'Beginner',
        delay: 200
      },
      {
        image: 'repair-guide-3',
        title: 'Huawei P60 Pro Charging Port Repair Tips',
        description: 'Professional techniques and advanced repair methods for Huawei P60 Pro charging interface.',
        type: 'Port Repair',
        duration: '15 min',
        difficulty: 'Advanced',
        delay: 400
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {defaultGuides.map((guide, index) => (
          <FadeInSection key={index} delay={guide.delay}>
            <div className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-[#00B140]/30 h-full flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <SafeImage
                  src={`https://picsum.photos/seed/${guide.image}/500/400`}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#00B140] to-[#00D155] text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  {guide.type}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
                  {guide.duration}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300">
                  {guide.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{guide.difficulty}</span>
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-[#00B140] font-semibold hover:text-[#00D155] transition-all duration-300 group-hover:translate-x-2"
                  >
                    Watch Tutorial
                    <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    );
  }

  // 显示真实的博客文章
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
      {posts.map((post, index) => {
        const wordCount = post.content ? post.content.split(/\s+/).length : 0;
        const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
        const publishDate = new Date(post.published_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        // 为不同类型的文章提供更相关的默认图片
        const getDefaultCoverImage = (post: BlogPost) => {
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
        let origin = '';
        try { origin = base ? new URL(base).origin : ''; } catch {}
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
        const authorProfile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        const authorName = authorProfile?.display_name || 'PRSPARES Team';
        const category = post.meta?.category || 'Repair Tips';
        const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');

        return (
          <FadeInSection key={post.id} delay={index * 200}>
            <Link 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-[#00B140]/30 h-full flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <SafeImage
                  src={coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#00B140] to-[#00D155] text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  {category}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
                  {readTimeMin} min read
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow line-clamp-3">
                  {excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{authorName}</span>
                    <span>·</span>
                    <span>{publishDate}</span>
                  </div>
                  <div className="inline-flex items-center text-[#00B140] font-semibold hover:text-[#00D155] transition-all duration-300 group-hover:translate-x-2">
                    Read Article
                    <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </FadeInSection>
        );
      })}
    </div>
  );
} 
