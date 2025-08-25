import { useState, useEffect } from 'react';

interface ImageFormat {
  src: string;
  format: 'avif' | 'webp' | 'jpeg';
  width: number;
}

interface OptimizedImageOptions {
  src: string;
  width?: number;
  quality?: number;
  formats?: ('avif' | 'webp' | 'jpeg')[];
}

interface OptimizedImageResult {
  src: string;
  srcSet: string;
  formats: ImageFormat[];
  isLoading: boolean;
  error: string | null;
}

// 检测浏览器支持的图片格式
const detectSupportedFormats = (): Promise<{
  avif: boolean;
  webp: boolean;
}> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve({ avif: false, webp: false });
      return;
    }
    
    // 检测 WebP 支持
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // 检测 AVIF 支持 (简化检测)
    const avifSupported = 'createImageBitmap' in window;
    
    resolve({
      avif: avifSupported,
      webp: webpSupported
    });
  });
};

// 获取图片类型
const getImageType = (src: string): string => {
  if (src.includes('hero')) return 'hero';
  if (src.includes('tool')) return 'tool';
  if (src.includes('thumb')) return 'thumbnail';
  return 'product';
};

// 获取可用的尺寸
const getAvailableSizes = (imageType: string): number[] => {
  const sizes = {
    hero: [1200, 800, 600, 400],
    product: [800, 600, 400, 300],
    tool: [600, 400, 300, 200],
    thumbnail: [300, 200, 150]
  };
  
  return sizes[imageType as keyof typeof sizes] || sizes.product;
};

// 生成优化后的图片路径
const generateOptimizedPath = (originalSrc: string, width: number, format: string): string => {
  // 如果是外部链接，直接返回
  if (originalSrc.startsWith('http')) {
    return originalSrc;
  }
  
  // 移除开头的 /
  const cleanSrc = originalSrc.startsWith('/') ? originalSrc.slice(1) : originalSrc;
  
  // 提取文件名（不含扩展名）
  const pathParts = cleanSrc.split('/');
  const filename = pathParts[pathParts.length - 1];
  const baseName = filename.split('.')[0];
  
  // 生成优化后的路径
  return `/images/optimized/${baseName}-${width}w.${format}`;
};

// 检查图片是否存在
const checkImageExists = async (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

export const useOptimizedImage = ({
  src,
  width = 800,
  quality = 85,
  formats = ['avif', 'webp', 'jpeg']
}: OptimizedImageOptions): OptimizedImageResult => {
  const [result, setResult] = useState<OptimizedImageResult>({
    src,
    srcSet: '',
    formats: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const optimizeImage = async () => {
      try {
        setResult(prev => ({ ...prev, isLoading: true, error: null }));

        // 检测浏览器支持
        const browserSupport = await detectSupportedFormats();
        
        // 获取图片类型和可用尺寸
        const imageType = getImageType(src);
        const availableSizes = getAvailableSizes(imageType);
        
        // 过滤出适合的尺寸（小于等于请求的宽度）
        const suitableSizes = availableSizes.filter(size => size <= width * 1.5);
        const targetSizes = suitableSizes.length > 0 ? suitableSizes : [availableSizes[availableSizes.length - 1]];
        
        // 确定要使用的格式
        let supportedFormats = formats.filter(format => {
          if (format === 'avif') return browserSupport.avif;
          if (format === 'webp') return browserSupport.webp;
          return true; // jpeg 总是支持
        });
        
        // 如果没有支持的现代格式，至少保留 jpeg
        if (supportedFormats.length === 0) {
          supportedFormats = ['jpeg'];
        }

        // 生成所有可能的图片格式
        const imageFormats: ImageFormat[] = [];
        let bestSrc = src;
        let srcSetParts: string[] = [];

        // 检查优化后的图片是否存在
        for (const format of supportedFormats) {
          for (const size of targetSizes) {
            const optimizedSrc = generateOptimizedPath(src, size, format);
            const exists = await checkImageExists(optimizedSrc);
            
            if (exists) {
              imageFormats.push({
                src: optimizedSrc,
                format: format as 'avif' | 'webp' | 'jpeg',
                width: size
              });
              
              // 使用最佳格式作为主要 src
              if (format === supportedFormats[0] && size === targetSizes[0]) {
                bestSrc = optimizedSrc;
              }
              
              // 添加到 srcSet
              srcSetParts.push(`${optimizedSrc} ${size}w`);
            }
          }
        }

        // 如果没有找到优化后的图片，使用原始图片
        if (imageFormats.length === 0) {
          console.warn(`未找到优化后的图片: ${src}，使用原始图片`);
          bestSrc = src;
          srcSetParts = [src];
        }

        if (!isMounted) return;

        setResult({
          src: bestSrc,
          srcSet: srcSetParts.join(', '),
          formats: imageFormats,
          isLoading: false,
          error: null
        });

      } catch (error) {
        if (!isMounted) return;
        
        console.error('图片优化失败:', error);
        setResult({
          src, // 回退到原始图片
          srcSet: src,
          formats: [],
          isLoading: false,
          error: error instanceof Error ? error.message : '未知错误'
        });
      }
    };

    optimizeImage();

    return () => {
      isMounted = false;
    };
  }, [src, width, quality, formats]);

  return result;
};

// 简化版本的 Hook，用于快速使用
export const useResponsiveImage = (src: string, width?: number) => {
  return useOptimizedImage({
    src,
    width,
    formats: ['avif', 'webp', 'jpeg']
  });
};

// 预加载图片的工具函数
export const preloadOptimizedImage = async (src: string, width = 800): Promise<void> => {
  const imageType = getImageType(src);
  const availableSizes = getAvailableSizes(imageType);
  const targetSize = availableSizes.find(size => size >= width) || availableSizes[0];
  
  const browserSupport = await detectSupportedFormats();
  const formats = [];
  
  if (browserSupport.avif) formats.push('avif');
  if (browserSupport.webp) formats.push('webp');
  formats.push('jpeg');
  
  // 预加载最佳格式
  for (const format of formats) {
    const optimizedSrc = generateOptimizedPath(src, targetSize, format);
    const exists = await checkImageExists(optimizedSrc);
    
    if (exists) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      document.head.appendChild(link);
      break;
    }
  }
};
