// SEO预览组件 - 显示文章的SEO优化信息和建议

import { useState, useEffect } from 'react';
import { generateAutoSEO, AutoSEOResult } from '@/utils/auto-seo-generator';

interface SEOPreviewProps {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
}

const SEOPreview: React.FC<SEOPreviewProps> = ({
  title,
  content,
  slug,
  excerpt,
  coverImage,
  author
}) => {
  const [seoData, setSeoData] = useState<AutoSEOResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 当内容变化时重新生成SEO数据
  useEffect(() => {
    if (title && content) {
      setIsLoading(true);
      try {
        const data = generateAutoSEO(title, content, slug, excerpt, coverImage, author);
        setSeoData(data);
      } catch (error) {
        console.error('SEO generation error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [title, content, slug, excerpt, coverImage, author]);

  if (!seoData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">SEO预览</h3>
        <p className="text-gray-500">请输入标题和内容以查看SEO预览</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    return '需要改进';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SEO预览</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(seoData.seo.score)}`}>
          {seoData.seo.score}/100 - {getScoreText(seoData.seo.score)}
        </div>
      </div>

      {/* 搜索结果预览 */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">搜索结果预览</h4>
        <div className="space-y-2">
          <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
            {seoData.seo.title}
          </div>
          <div className="text-green-700 text-sm">
            https://prspares.com/blog/{slug}
          </div>
          <div className="text-gray-600 text-sm leading-relaxed">
            {seoData.seo.description}
          </div>
        </div>
      </div>

      {/* SEO详细信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 标题分析 */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">标题分析</h5>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>长度:</span>
              <span className={seoData.seo.title.length > 60 ? 'text-red-600' : 'text-green-600'}>
                {seoData.seo.title.length}/60
              </span>
            </div>
            <div className="flex justify-between">
              <span>主关键词:</span>
              <span className="text-blue-600">{seoData.seo.focusKeyword || '未检测到'}</span>
            </div>
          </div>
        </div>

        {/* 描述分析 */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">描述分析</h5>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>长度:</span>
              <span className={seoData.seo.description.length > 160 ? 'text-red-600' : 'text-green-600'}>
                {seoData.seo.description.length}/160
              </span>
            </div>
            <div className="flex justify-between">
              <span>关键词密度:</span>
              <span className={seoData.seo.keywordDensity > 3 ? 'text-red-600' : 'text-green-600'}>
                {seoData.seo.keywordDensity.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* 内容分析 */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">内容分析</h5>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>字数:</span>
              <span className={seoData.seo.wordCount < 300 ? 'text-red-600' : 'text-green-600'}>
                {seoData.seo.wordCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>阅读时间:</span>
              <span className="text-gray-600">{seoData.seo.readingTime} 分钟</span>
            </div>
          </div>
        </div>

        {/* 可读性分析 */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">可读性</h5>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>可读性分数:</span>
              <span className={seoData.seo.readabilityScore < 50 ? 'text-red-600' : 'text-green-600'}>
                {seoData.seo.readabilityScore.toFixed(0)}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 关键词 */}
      <div className="space-y-2">
        <h5 className="font-medium text-gray-700">检测到的关键词</h5>
        <div className="flex flex-wrap gap-2">
          {seoData.seo.keywords.slice(0, 8).map((keyword, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded text-xs ${
                index === 0 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 优化建议 */}
      {seoData.seo.suggestions.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-gray-700">优化建议</h5>
          <ul className="text-sm space-y-1">
            {seoData.seo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <span className="text-gray-600">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Social Media预览 */}
      <div className="space-y-4">
        <h5 className="font-medium text-gray-700">社交媒体预览</h5>
        
        {/* Facebook/Open Graph预览 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 text-xs text-gray-600">Facebook / Open Graph</div>
          <div className="p-3 space-y-2">
            {seoData.openGraph.image && (
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                图片预览
              </div>
            )}
            <div className="text-blue-600 font-medium text-sm">{seoData.openGraph.title}</div>
            <div className="text-gray-600 text-xs">{seoData.openGraph.description}</div>
            <div className="text-gray-500 text-xs">prspares.com</div>
          </div>
        </div>

        {/* Twitter预览 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 text-xs text-gray-600">Twitter</div>
          <div className="p-3 space-y-2">
            {seoData.twitter.image && (
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                图片预览
              </div>
            )}
            <div className="text-gray-900 font-medium text-sm">{seoData.twitter.title}</div>
            <div className="text-gray-600 text-xs">{seoData.twitter.description}</div>
            <div className="text-gray-500 text-xs">prspares.com</div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-gray-500">正在分析SEO...</div>
        </div>
      )}
    </div>
  );
};

export default SEOPreview;
