import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (excerpt: string) => {
    const wordCount = excerpt ? excerpt.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200)); // 英文阅读速度
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8 mt-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Guides</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Continue exploring more professional mobile repair guides and technical articles
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group relative">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* 图片占位符或实际图片 */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                  {post.meta?.cover_image ? (
                    <img 
                      src={post.meta.cover_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00B140]/10 to-[#008631]/10">
                      <div className="text-6xl text-[#00B140]/30 font-bold">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{calculateReadTime(post.excerpt)} min read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00B140] transition-colors duration-200 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-[#00B140] font-medium group-hover:text-[#008631] transition-colors duration-200">
                    <span className="mr-2">Read more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Link 
          href="/blog"
          className="inline-flex items-center px-8 py-3 bg-[#00B140] hover:bg-[#008631] text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <span className="mr-2">View All Articles</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default RelatedPosts; 