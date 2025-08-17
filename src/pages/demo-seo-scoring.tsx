// SEO评分演示页面 - 展示自定义SEO设置后的重新评分功能

import { useState } from 'react';
import { generateAutoSEO } from '@/utils/auto-seo-generator';
import { reanalyzeSEOWithCustomData } from '@/utils/seo-analyzer';

export default function DemoSEOScoring() {
  const [title] = useState('iPhone 15 Pro Max Screen Replacement Tutorial');
  const [content] = useState(`# iPhone 15 Pro Max Screen Replacement Tutorial

## Introduction
The iPhone 15 Pro Max features an advanced Super Retina XDR display with ProMotion technology. When this premium screen gets damaged, professional replacement is crucial to maintain the device's exceptional performance and visual quality.

## Required Tools and Parts
- Professional mobile phone repair tools
- Heat gun or precision heating pad
- Suction cups and plastic prying tools
- Precision screwdriver set
- High-quality replacement screen assembly
- Adhesive strips and cleaning materials

## Step-by-Step Replacement Process

### 1. Device Preparation
Before starting the screen replacement process, ensure you have a clean, well-lit workspace. Power off the iPhone 15 Pro Max completely and remove the SIM card tray using the ejection tool.

### 2. Display Removal
Carefully apply controlled heat to the edges of the damaged screen to soften the adhesive. Use professional suction cups and plastic prying tools to gently separate the display assembly from the device frame.

### 3. Cable Disconnection
Locate and carefully disconnect all display-related cables, including the digitizer, LCD, and True Tone sensor connections. Take reference photos for proper reassembly.

### 4. New Screen Installation
Install the new screen assembly, ensuring all cables are properly connected and the True Tone functionality is preserved.

## Quality Assurance
At PRSPARES, we provide premium OEM-quality replacement screens featuring:
- Original True Tone support
- Perfect color accuracy and brightness
- Full multi-touch sensitivity
- 12-month comprehensive warranty

## Professional Tips
- Always use anti-static precautions
- Test functionality before final assembly
- Ensure proper cable seating
- Verify True Tone operation

## Conclusion
Professional iPhone 15 Pro Max screen replacement ensures your device maintains its premium quality and functionality. Contact PRSPARES for wholesale pricing on high-quality OEM replacement parts and professional repair tools.`);
  
  const [customSEO, setCustomSEO] = useState({
    title: 'iPhone 15 Pro Max Screen Replacement Tutorial - PRSPARES',
    description: 'Complete professional guide for iPhone 15 Pro Max screen replacement with OEM quality parts. Step-by-step tutorial with tools, tips, and warranty.',
    focusKeyword: 'iPhone 15 Pro Max screen replacement',
    keywords: ['iPhone 15 Pro Max', 'screen replacement', 'repair tutorial', 'OEM parts', 'True Tone', 'mobile repair', 'PRSPARES']
  });

  const [autoSEO, setAutoSEO] = useState<any>(null);
  const [reanalyzedSEO, setReanalyzedSEO] = useState<any>(null);

  // 生成自动SEO
  const generateAuto = () => {
    const result = generateAutoSEO(title, content, 'iphone-15-pro-max-screen-replacement-tutorial');
    setAutoSEO(result);
  };

  // 重新分析自定义SEO
  const reanalyzeCustom = () => {
    const result = reanalyzeSEOWithCustomData(title, content, customSEO);
    setReanalyzedSEO(result);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SEO评分演示</h1>
          <p className="text-gray-600">
            演示自定义SEO设置后的重新评分功能。修改SEO设置后，系统会重新计算评分和建议。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 自动SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">自动生成的SEO</h2>
              <button
                onClick={generateAuto}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                生成自动SEO
              </button>
            </div>

            {autoSEO && (
              <div className="space-y-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getScoreColor(autoSEO.seo.score)}`}>
                  自动SEO分数: {autoSEO.seo.score}/100
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">SEO标题</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{autoSEO.seo.title}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">SEO描述</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{autoSEO.seo.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">主要关键词</h3>
                  <p className="text-sm text-gray-600">{autoSEO.seo.focusKeyword}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">关键词密度</h3>
                  <p className="text-sm text-gray-600">{autoSEO.seo.keywordDensity.toFixed(1)}%</p>
                </div>

                {autoSEO.seo.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">优化建议</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {autoSEO.seo.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-500 mt-0.5">⚠</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 自定义SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">自定义SEO设置</h2>
              <button
                onClick={reanalyzeCustom}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                重新评分
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO标题</label>
                <input
                  type="text"
                  value={customSEO.title}
                  onChange={(e) => setCustomSEO(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO描述</label>
                <textarea
                  value={customSEO.description}
                  onChange={(e) => setCustomSEO(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主要关键词</label>
                <input
                  type="text"
                  value={customSEO.focusKeyword}
                  onChange={(e) => setCustomSEO(prev => ({ ...prev, focusKeyword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {reanalyzedSEO && (
              <div className="space-y-4 border-t pt-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getScoreColor(reanalyzedSEO.seoScore)}`}>
                  重新评分: {reanalyzedSEO.seoScore}/100
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">关键词密度</h3>
                  <p className="text-sm text-gray-600">{reanalyzedSEO.keywordDensity.toFixed(1)}%</p>
                </div>

                {reanalyzedSEO.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">新的优化建议</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {reanalyzedSEO.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-500 mt-0.5">⚠</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 对比说明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">功能说明</h2>
          <div className="text-blue-800 space-y-2 text-sm">
            <p><strong>1. 自动SEO生成:</strong> 基于文章标题和内容自动分析生成SEO数据和评分</p>
            <p><strong>2. 自定义SEO设置:</strong> 您可以手动修改SEO标题、描述、关键词等</p>
            <p><strong>3. 重新评分:</strong> 修改自定义SEO设置后，点击"重新评分"按钮获得新的SEO分数和建议</p>
            <p><strong>4. 实时反馈:</strong> 系统会根据您的自定义设置提供针对性的优化建议</p>
          </div>
        </div>

        {/* 评分对比 */}
        {autoSEO && reanalyzedSEO && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">评分对比</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{autoSEO.seo.score}</div>
                <div className="text-sm text-gray-600">自动生成SEO分数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">{reanalyzedSEO.seoScore}</div>
                <div className="text-sm text-gray-600">自定义SEO分数</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className={`text-lg font-medium ${
                reanalyzedSEO.seoScore > autoSEO.seo.score ? 'text-green-600' :
                reanalyzedSEO.seoScore < autoSEO.seo.score ? 'text-red-600' : 'text-gray-600'
              }`}>
                {reanalyzedSEO.seoScore > autoSEO.seo.score ? '✅ 自定义SEO更优' :
                 reanalyzedSEO.seoScore < autoSEO.seo.score ? '⚠️ 自动SEO更优' : '➡️ 分数相同'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
