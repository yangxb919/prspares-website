// SEO编辑组件 - 允许手动编辑和覆盖自动生成的SEO数据

import { useState, useEffect } from 'react';
import { generateAutoSEO, AutoSEOResult } from '@/utils/auto-seo-generator';
import { reanalyzeSEOWithCustomData } from '@/utils/seo-analyzer';

interface SEOEditorProps {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  initialSEOData?: any;
  onSEOChange?: (seoData: any) => void;
}

const SEOEditor: React.FC<SEOEditorProps> = ({
  title,
  content,
  slug,
  excerpt,
  coverImage,
  author,
  initialSEOData,
  onSEOChange
}) => {
  const [seoData, setSeoData] = useState<AutoSEOResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customSEO, setCustomSEO] = useState({
    title: '',
    description: '',
    keywords: [] as string[],
    focusKeyword: ''
  });
  const [useCustomSEO, setUseCustomSEO] = useState(false);
  const [reanalyzedSEO, setReanalyzedSEO] = useState<any>(null);

  // 生成自动SEO数据
  useEffect(() => {
    if (title && content) {
      try {
        const autoSEO = generateAutoSEO(title, content, slug, excerpt, coverImage, author);
        setSeoData(autoSEO);
        
        // 如果有初始SEO数据，使用它
        if (initialSEOData?.seo) {
          setCustomSEO({
            title: initialSEOData.seo.title || autoSEO.seo.title,
            description: initialSEOData.seo.description || autoSEO.seo.description,
            keywords: initialSEOData.seo.keywords || autoSEO.seo.keywords,
            focusKeyword: initialSEOData.seo.focusKeyword || autoSEO.seo.focusKeyword
          });
          setUseCustomSEO(true);
        } else {
          setCustomSEO({
            title: autoSEO.seo.title,
            description: autoSEO.seo.description,
            keywords: autoSEO.seo.keywords,
            focusKeyword: autoSEO.seo.focusKeyword
          });
        }
      } catch (error) {
        console.error('SEO generation error:', error);
      }
    }
  }, [title, content, slug, excerpt, coverImage, author, initialSEOData]);

  // 当自定义SEO数据变化时重新分析
  useEffect(() => {
    if (useCustomSEO && customSEO.title && content) {
      try {
        const reanalyzed = reanalyzeSEOWithCustomData(title, content, customSEO);
        setReanalyzedSEO(reanalyzed);
      } catch (error) {
        console.error('重新分析SEO失败:', error);
      }
    } else {
      setReanalyzedSEO(null);
    }
  }, [useCustomSEO, customSEO, title, content]);

  // 当SEO数据变化时通知父组件
  useEffect(() => {
    if (seoData && onSEOChange) {
      const finalSEO = useCustomSEO ? {
        ...seoData,
        seo: {
          ...seoData.seo,
          ...customSEO,
          // 使用重新计算的评分和建议
          score: reanalyzedSEO?.seoScore || seoData.seo.score,
          suggestions: reanalyzedSEO?.suggestions || seoData.seo.suggestions,
          keywordDensity: reanalyzedSEO?.keywordDensity || seoData.seo.keywordDensity
        }
      } : seoData;
      onSEOChange(finalSEO);
    }
  }, [seoData, customSEO, useCustomSEO, reanalyzedSEO, onSEOChange]);

  const handleCustomSEOChange = (field: string, value: any) => {
    setCustomSEO(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeywordsChange = (keywordsText: string) => {
    const keywords = keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);
    handleCustomSEOChange('keywords', keywords);
  };

  const resetToAuto = () => {
    if (seoData) {
      setCustomSEO({
        title: seoData.seo.title,
        description: seoData.seo.description,
        keywords: seoData.seo.keywords,
        focusKeyword: seoData.seo.focusKeyword
      });
      setUseCustomSEO(false);
    }
  };

  if (!seoData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">SEO设置</h3>
        <p className="text-gray-500">正在生成SEO数据...</p>
      </div>
    );
  }

  const currentSEO = useCustomSEO ? customSEO : seoData.seo;
  const currentScore = useCustomSEO && reanalyzedSEO ? reanalyzedSEO.seoScore : seoData.seo.score;
  const currentSuggestions = useCustomSEO && reanalyzedSEO ? reanalyzedSEO.suggestions : seoData.seo.suggestions;
  const currentKeywordDensity = useCustomSEO && reanalyzedSEO ? reanalyzedSEO.keywordDensity : seoData.seo.keywordDensity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SEO设置</h3>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentScore >= 80 ? 'text-green-600 bg-green-100' :
            currentScore >= 60 ? 'text-yellow-600 bg-yellow-100' :
            'text-red-600 bg-red-100'
          }`}>
            {currentScore}/100 {useCustomSEO && reanalyzedSEO && <span className="text-xs">(已更新)</span>}
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useCustomSEO}
              onChange={(e) => setUseCustomSEO(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">自定义SEO</span>
          </label>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isEditing ? '收起编辑' : '编辑SEO'}
          </button>
        </div>
      </div>

      {/* SEO预览 */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">搜索结果预览</h4>
        <div className="space-y-2">
          <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
            {currentSEO.title}
          </div>
          <div className="text-green-700 text-sm">
            https://prspares.com/blog/{slug}
          </div>
          <div className="text-gray-600 text-sm leading-relaxed">
            {currentSEO.description}
          </div>
        </div>
      </div>

      {/* SEO编辑表单 */}
      {isEditing && (
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO标题
              <span className="text-gray-500 ml-1">({currentSEO.title.length}/60)</span>
            </label>
            <input
              type="text"
              value={currentSEO.title}
              onChange={(e) => {
                setUseCustomSEO(true);
                handleCustomSEOChange('title', e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={60}
            />
            {currentSEO.title.length > 60 && (
              <p className="text-red-500 text-xs mt-1">标题过长，建议控制在60字符以内</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO描述
              <span className="text-gray-500 ml-1">({currentSEO.description.length}/160)</span>
            </label>
            <textarea
              value={currentSEO.description}
              onChange={(e) => {
                setUseCustomSEO(true);
                handleCustomSEOChange('description', e.target.value);
              }}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={160}
            />
            {currentSEO.description.length > 160 && (
              <p className="text-red-500 text-xs mt-1">描述过长，建议控制在160字符以内</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主要关键词
            </label>
            <input
              type="text"
              value={currentSEO.focusKeyword}
              onChange={(e) => {
                setUseCustomSEO(true);
                handleCustomSEOChange('focusKeyword', e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入主要关键词"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关键词 (用逗号分隔)
            </label>
            <textarea
              value={currentSEO.keywords.join(', ')}
              onChange={(e) => {
                setUseCustomSEO(true);
                handleKeywordsChange(e.target.value);
              }}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="关键词1, 关键词2, 关键词3"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={resetToAuto}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              重置为自动生成
            </button>
            <div className="text-xs text-gray-500">
              {useCustomSEO ? '使用自定义SEO设置' : '使用自动生成的SEO设置'}
            </div>
          </div>
        </div>
      )}

      {/* SEO建议 */}
      {currentSuggestions.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            SEO优化建议 {useCustomSEO && reanalyzedSEO && <span className="text-xs text-blue-600">(基于自定义设置)</span>}
          </h4>
          <ul className="space-y-2">
            {currentSuggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <span className="text-gray-600">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SEO分数 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            SEO分数 {useCustomSEO && reanalyzedSEO && <span className="text-xs text-blue-600">(实时更新)</span>}
          </span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentScore >= 80 ? 'text-green-600 bg-green-100' :
            currentScore >= 60 ? 'text-yellow-600 bg-yellow-100' :
            'text-red-600 bg-red-100'
          }`}>
            {currentScore}/100
          </div>
        </div>
        {useCustomSEO && reanalyzedSEO && (
          <div className="mt-2 text-xs text-gray-500">
            基于您的自定义SEO设置重新计算的分数
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOEditor;
