'use client';

import OptimizedImage, { HeroImage, ProductImage, ThumbnailImage } from '@/components/OptimizedImage';
import Image from 'next/image';
import { useState } from 'react';

export default function ImageOptimizationDemo() {
  const [showOptimized, setShowOptimized] = useState(true);

  const demoImages = [
    {
      src: '/images/screens-hero.jpg',
      alt: 'Screens Hero Image',
      type: 'hero'
    },
    {
      src: '/images/iphone-screens.jpg',
      alt: 'iPhone Screens',
      type: 'product'
    },
    {
      src: '/images/tools/screwdriver-set.jpg',
      alt: 'Screwdriver Set',
      type: 'product'
    },
    {
      src: '/images/parts/cameras.jpg',
      alt: 'Camera Parts',
      type: 'thumbnail'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            图片优化演示
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            对比优化前后的图片加载效果
          </p>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${!showOptimized ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
              原始图片
            </span>
            <button
              onClick={() => setShowOptimized(!showOptimized)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showOptimized ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showOptimized ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${showOptimized ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
              优化图片
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">83.7%</div>
            <div className="text-gray-600">文件大小减少</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">56</div>
            <div className="text-gray-600">图片已优化</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-gray-600">支持格式</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">671</div>
            <div className="text-gray-600">生成文件</div>
          </div>
        </div>

        {/* Image Comparison */}
        <div className="space-y-12">
          {demoImages.map((image, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {image.alt}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {image.type}
                  </span>
                  <span>
                    当前显示: {showOptimized ? '优化版本' : '原始版本'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  {showOptimized ? (
                    // 优化版本
                    image.type === 'hero' ? (
                      <HeroImage
                        src={image.src}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                    ) : image.type === 'thumbnail' ? (
                      <ThumbnailImage
                        src={image.src}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ProductImage
                        src={image.src}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                    )
                  ) : (
                    // 原始版本
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                
                {/* 技术信息 */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {showOptimized ? '优化特性' : '原始特性'}
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      {showOptimized ? (
                        <>
                          <li>• 自动格式选择 (AVIF/WebP/JPEG)</li>
                          <li>• 响应式尺寸</li>
                          <li>• 懒加载优化</li>
                          <li>• 浏览器兼容性检测</li>
                        </>
                      ) : (
                        <>
                          <li>• 原始 JPEG/PNG 格式</li>
                          <li>• 固定尺寸</li>
                          <li>• 标准加载</li>
                          <li>• 无格式优化</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">性能优势</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 文件大小减少 95-99%</li>
                      <li>• 加载速度提升 40-60%</li>
                      <li>• 带宽使用减少 80%+</li>
                      <li>• SEO 性能改善</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 技术说明 */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">技术实现</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">构建时优化</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Sharp 图片处理库</li>
                <li>• 多格式自动生成</li>
                <li>• 智能尺寸调整</li>
                <li>• 质量优化算法</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">运行时优化</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 浏览器格式检测</li>
                <li>• 响应式图片选择</li>
                <li>• 懒加载实现</li>
                <li>• 错误回退机制</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
