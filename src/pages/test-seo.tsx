// SEO功能测试页面 - 用于测试和演示SEO功能

import { useState } from 'react';
import { generateAutoSEO } from '@/utils/auto-seo-generator';
import SEOEditor from '@/components/admin/SEOEditor';

export default function TestSEO() {
  const [title, setTitle] = useState('iPhone 14 Pro Max Screen Replacement Guide');
  const [content, setContent] = useState(`# iPhone 14 Pro Max Screen Replacement Guide

## Introduction
The iPhone 14 Pro Max features a stunning 6.7-inch Super Retina XDR display with ProMotion technology. When this screen gets damaged, professional replacement is essential to maintain the device's functionality and appearance.

## Tools Required
- Professional repair tools
- Heat gun or hair dryer
- Suction cups
- Plastic prying tools
- Screwdriver set
- Replacement screen assembly

## Step-by-Step Process

### 1. Preparation
Before starting the repair process, ensure you have all necessary tools and a clean workspace. Power off the device completely and remove the SIM card tray.

### 2. Remove the Display
Carefully heat the edges of the screen to soften the adhesive. Use suction cups and plastic tools to gently separate the display from the frame.

### 3. Disconnect Cables
Locate and carefully disconnect the display cables. Take photos for reference during reassembly.

### 4. Install New Screen
Connect the new screen assembly and test functionality before final assembly.

## Quality Assurance
At PRSPARES, we provide OEM quality replacement screens with:
- True Tone support
- Original color accuracy
- Full touch sensitivity
- 12-month warranty

## Conclusion
Professional screen replacement ensures your iPhone 14 Pro Max maintains its premium quality and functionality. Contact PRSPARES for wholesale pricing on high-quality replacement parts.`);
  const [slug, setSlug] = useState('iphone-14-pro-max-screen-replacement-guide');
  const [excerpt, setExcerpt] = useState('Complete guide for iPhone 14 Pro Max screen replacement with professional tools and techniques.');

  const [seoResult, setSeoResult] = useState<any>(null);

  const handleGenerateSEO = () => {
    try {
      const result = generateAutoSEO(title, content, slug, excerpt);
      setSeoResult(result);
    } catch (error) {
      console.error('SEO generation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SEO功能测试页面</h1>
          <p className="text-gray-600">
            这个页面用于测试和演示自动SEO优化功能。您可以修改文章内容，查看SEO分析结果。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">文章内容</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  摘要
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容 (Markdown)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleGenerateSEO}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                生成SEO分析
              </button>
            </div>
          </div>

          {/* SEO编辑器 */}
          <div>
            <SEOEditor
              title={title}
              content={content}
              slug={slug}
              excerpt={excerpt}
              author="PRSPARES Team"
              onSEOChange={(seoData) => setSeoResult(seoData)}
            />
          </div>
        </div>

        {/* SEO结果详情 */}
        {seoResult && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">详细SEO数据</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基础SEO信息 */}
              <div>
                <h3 className="text-lg font-medium mb-3">基础SEO信息</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">优化标题:</span>
                    <p className="text-gray-600 mt-1">{seoResult.seo.title}</p>
                  </div>
                  <div>
                    <span className="font-medium">SEO描述:</span>
                    <p className="text-gray-600 mt-1">{seoResult.seo.description}</p>
                  </div>
                  <div>
                    <span className="font-medium">主要关键词:</span>
                    <p className="text-gray-600 mt-1">{seoResult.seo.focusKeyword}</p>
                  </div>
                  <div>
                    <span className="font-medium">SEO分数:</span>
                    <p className="text-gray-600 mt-1">{seoResult.seo.score}/100</p>
                  </div>
                </div>
              </div>

              {/* 关键词列表 */}
              <div>
                <h3 className="text-lg font-medium mb-3">提取的关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {seoResult.seo.keywords.map((keyword: string, index: number) => (
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
            </div>

            {/* 优化建议 */}
            {seoResult.seo.suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">优化建议</h3>
                <ul className="space-y-2">
                  {seoResult.seo.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-yellow-500 mt-0.5">⚠</span>
                      <span className="text-gray-600">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 结构化数据预览 */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">结构化数据 (JSON-LD)</h3>
              <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(seoResult.structuredData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">如何使用SEO功能</h2>
          <div className="text-blue-800 space-y-2 text-sm">
            <p><strong>1. 自动SEO生成:</strong> 在创建或编辑文章时，系统会自动分析内容并生成SEO数据</p>
            <p><strong>2. SEO管理:</strong> 访问 <code className="bg-blue-100 px-1 rounded">/admin/seo</code> 查看所有文章的SEO状态</p>
            <p><strong>3. 批量优化:</strong> 在SEO管理页面可以为现有文章批量生成SEO数据</p>
            <p><strong>4. 实时预览:</strong> 在文章编辑页面可以实时查看SEO预览和建议</p>
            <p><strong>5. SEO编辑:</strong> 在文章列表页面点击"SEO"按钮，或访问 <code className="bg-blue-100 px-1 rounded">/admin/articles/[id]/seo</code> 专门编辑SEO设置</p>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-3">快速访问链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">管理后台</h3>
              <p className="text-sm text-gray-600 mt-1">访问管理后台，查看SEO管理卡片</p>
            </a>
            <a
              href="/admin/seo"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">SEO管理</h3>
              <p className="text-sm text-gray-600 mt-1">查看所有文章的SEO状态和批量优化</p>
            </a>
            <a
              href="/admin/articles"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">文章管理</h3>
              <p className="text-sm text-gray-600 mt-1">管理文章，每篇文章都有SEO按钮</p>
            </a>
            <a
              href="/admin/articles/new"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">创建文章</h3>
              <p className="text-sm text-gray-600 mt-1">创建新文章时查看实时SEO编辑器</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
