// 客户端图片压缩工具
interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
  maxSizeKB?: number;
}

interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
}

// 压缩单个图片文件
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.85,
    format = 'jpeg',
    maxSizeKB = 500
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'));
      return;
    }

    img.onload = () => {
      try {
        // 计算新的尺寸
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        // 设置 canvas 尺寸
        canvas.width = newWidth;
        canvas.height = newHeight;

        // 绘制图片
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // 转换为 Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('图片压缩失败'));
              return;
            }

            // 检查文件大小，如果还是太大，降低质量重试
            const sizeKB = blob.size / 1024;
            if (sizeKB > maxSizeKB && quality > 0.3) {
              // 递归调用，降低质量
              const newOptions = { ...options, quality: quality - 0.1 };
              compressImage(file, newOptions)
                .then(resolve)
                .catch(reject);
              return;
            }

            // 创建新的 File 对象
            const compressedFile = new File(
              [blob],
              generateCompressedFileName(file.name, format),
              {
                type: `image/${format}`,
                lastModified: Date.now()
              }
            );

            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: ((file.size - blob.size) / file.size) * 100,
              format
            });
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    // 加载图片
    img.src = URL.createObjectURL(file);
  });
};

// 批量压缩图片
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<CompressionResult[]> => {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // 只处理图片文件
      if (!file.type.startsWith('image/')) {
        console.warn(`跳过非图片文件: ${file.name}`);
        continue;
      }

      const result = await compressImage(file, options);
      results.push(result);
      
      // 报告进度
      onProgress?.(((i + 1) / files.length) * 100, i + 1, files.length);
    } catch (error) {
      console.error(`压缩图片失败 ${file.name}:`, error);
      // 继续处理其他文件
    }
  }
  
  return results;
};

// 计算新的图片尺寸
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // 如果图片尺寸小于最大尺寸，不需要缩放
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // 计算缩放比例
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
};

// 生成压缩后的文件名
const generateCompressedFileName = (originalName: string, format: string): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_compressed.${format}`;
};

// 获取图片信息
export const getImageInfo = (file: File): Promise<{
  width: number;
  height: number;
  size: number;
  format: string;
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        format: file.type
      });
    };
    
    img.onerror = () => {
      reject(new Error('无法读取图片信息'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// 预设的压缩配置
export const COMPRESSION_PRESETS = {
  // 高质量（适合产品图片）
  high: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.9,
    format: 'jpeg' as const,
    maxSizeKB: 800
  },
  
  // 中等质量（适合一般展示）
  medium: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.85,
    format: 'jpeg' as const,
    maxSizeKB: 400
  },
  
  // 低质量（适合缩略图）
  low: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 0.8,
    format: 'jpeg' as const,
    maxSizeKB: 150
  },
  
  // WebP 格式（现代浏览器）
  webp: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.85,
    format: 'webp' as const,
    maxSizeKB: 300
  }
};

// 智能压缩（根据文件大小自动选择压缩级别）
export const smartCompress = async (file: File): Promise<CompressionResult> => {
  const sizeKB = file.size / 1024;
  
  let preset: CompressionOptions;
  
  if (sizeKB > 2000) {
    // 大文件使用高压缩
    preset = COMPRESSION_PRESETS.medium;
  } else if (sizeKB > 1000) {
    // 中等文件使用中等压缩
    preset = COMPRESSION_PRESETS.high;
  } else {
    // 小文件使用轻度压缩
    preset = { ...COMPRESSION_PRESETS.high, quality: 0.95 };
  }
  
  return compressImage(file, preset);
};

// 检查浏览器是否支持 WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    resolve(supported);
  });
};

// 检查浏览器是否支持 AVIF
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
