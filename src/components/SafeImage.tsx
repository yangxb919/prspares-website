'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  style?: React.CSSProperties;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  style,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || ''}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      sizes={sizes}
      quality={quality}
      style={style}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
      {...props}
    />
  );
}
