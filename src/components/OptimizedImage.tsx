import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  style,
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 使用优化图片 Hook
  const { 
    src: optimizedSrc, 
    srcSet, 
    formats, 
    isLoading: isOptimizing,
    error: optimizationError 
  } = useOptimizedImage({
    src,
    width: width || 800,
    quality,
    formats: ['avif', 'webp', 'jpeg']
  });

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // 生成 sizes 属性
  const generateSizes = (): string => {
    if (sizes) return sizes;
    
    if (fill) {
      return '100vw';
    }
    
    if (width) {
      return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`;
    }
    
    return '100vw';
  };

  // 如果有优化错误，回退到原始图片
  const finalSrc = optimizationError || imageError ? src : optimizedSrc;
  const finalSrcSet = optimizationError || imageError ? undefined : srcSet;

  // 生成 picture 元素（用于现代浏览器的格式支持）
  const renderPictureElement = () => {
    if (formats.length === 0 || imageError || optimizationError) {
      return (
        <Image
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
          priority={priority}
          quality={quality}
          sizes={generateSizes()}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          loading={loading}
        />
      );
    }

    // 按格式分组
    const formatGroups = formats.reduce((acc, format) => {
      if (!acc[format.format]) {
        acc[format.format] = [];
      }
      acc[format.format].push(format);
      return acc;
    }, {} as Record<string, typeof formats>);

    return (
      <picture>
        {/* AVIF 格式 */}
        {formatGroups.avif && (
          <source
            srcSet={formatGroups.avif.map(f => `${f.src} ${f.width}w`).join(', ')}
            sizes={generateSizes()}
            type="image/avif"
          />
        )}
        
        {/* WebP 格式 */}
        {formatGroups.webp && (
          <source
            srcSet={formatGroups.webp.map(f => `${f.src} ${f.width}w`).join(', ')}
            sizes={generateSizes()}
            type="image/webp"
          />
        )}
        
        {/* JPEG 格式（回退） */}
        {formatGroups.jpeg && (
          <source
            srcSet={formatGroups.jpeg.map(f => `${f.src} ${f.width}w`).join(', ')}
            sizes={generateSizes()}
            type="image/jpeg"
          />
        )}
        
        {/* 回退的 img 元素 */}
        <Image
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
          priority={priority}
          quality={quality}
          sizes={generateSizes()}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          loading={loading}
        />
      </picture>
    );
  };

  // 加载状态指示器
  const LoadingPlaceholder = () => (
    <div 
      className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style
      }}
    >
      <svg 
        className="w-8 h-8 text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  );

  // 错误状态指示器
  const ErrorPlaceholder = () => (
    <div 
      className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style
      }}
    >
      <div className="text-center text-gray-500">
        <svg 
          className="w-8 h-8 mx-auto mb-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <p className="text-sm">图片加载失败</p>
      </div>
    </div>
  );

  // 如果正在优化且没有错误，显示加载状态
  if (isOptimizing && !optimizationError) {
    return <LoadingPlaceholder />;
  }

  // 如果有严重错误，显示错误状态
  if (imageError && optimizationError) {
    return <ErrorPlaceholder />;
  }

  return renderPictureElement();
};

export default OptimizedImage;

// 导出一些常用的预设组件
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={1200}
    height={800}
    priority={true}
    sizes="100vw"
  />
);

export const ProductImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={800}
    height={600}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={300}
    height={200}
    sizes="(max-width: 768px) 50vw, 300px"
  />
);

export const ToolImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={600}
    height={450}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
  />
);
