import Image from 'next/image';
import Link from 'next/link';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageSrc: string;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image 
            src={article.imageSrc} 
            alt={article.title} 
            fill 
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded-full">
            {article.category}
          </span>
        </div>
        <Link href={`/blog/${article.slug}`} className="block">
          <h3 className="text-xl font-semibold mb-2 text-[#333333] hover:text-[#00B140] transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4">
          {article.excerpt}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{article.author}</span>
          <div className="flex space-x-4">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
