# 图片优化系统使用指南

## 概述

我们的图片优化系统采用 **Next.js + Sharp 构建时压缩** 方案，结合客户端智能压缩，为网站提供最佳的图片加载性能。

## 🎯 优化效果

- **文件大小减少**: 83.7% (从 102.93 MB 到 16.75 MB)
- **处理图片数量**: 56 张原始图片
- **生成优化文件**: 671 个不同格式和尺寸的图片
- **支持格式**: AVIF、WebP、JPEG
- **响应式尺寸**: 每张图片生成 4 种尺寸

## 📁 文件结构

```
public/images/
├── optimized/           # 优化后的图片
│   ├── image-map.json  # 图片映射文件
│   ├── screens-hero-1200w.avif
│   ├── screens-hero-1200w.webp
│   ├── screens-hero-1200w.jpeg
│   └── ...
├── backup/             # 原始图片备份
└── [原始图片文件]
```

## 🔧 使用方法

### 1. 构建时优化（静态图片）

#### 运行优化脚本
```bash
# 优化所有图片
npm run optimize:images

# 强制重新优化（删除现有优化文件）
npm run optimize:images:force
```

#### 在组件中使用优化图片
```tsx
import OptimizedImage, { HeroImage, ProductImage, ThumbnailImage } from '@/components/OptimizedImage';

// Hero 图片（1200x800）
<HeroImage
  src="/images/hero-banner.jpg"
  alt="Hero Banner"
  className="object-cover w-full h-full"
  priority
/>

// 产品图片（800x600）
<ProductImage
  src="/images/product.jpg"
  alt="Product Image"
  className="object-cover w-full h-full"
/>

// 缩略图（300x200）
<ThumbnailImage
  src="/images/thumbnail.jpg"
  alt="Thumbnail"
  className="object-cover w-full h-full"
/>

// 自定义尺寸
<OptimizedImage
  src="/images/custom.jpg"
  alt="Custom Image"
  width={600}
  height={400}
  className="object-cover"
/>
```

### 2. 动态图片压缩（Supabase 上传）

#### 在上传前压缩
```tsx
import { compressImages, COMPRESSION_PRESETS, smartCompress } from '@/utils/imageCompression';

// 批量压缩
const results = await compressImages(
  files,
  COMPRESSION_PRESETS.high,
  (progress, current, total) => {
    console.log(`压缩进度: ${progress}% (${current}/${total})`);
  }
);

// 智能压缩（自动选择压缩级别）
const result = await smartCompress(file);

// 自定义压缩
const result = await compressImage(file, {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 0.85,
  format: 'webp',
  maxSizeKB: 500
});
```

## 🎨 组件特性

### OptimizedImage 组件
- **自动格式检测**: 根据浏览器支持自动选择 AVIF、WebP 或 JPEG
- **响应式图片**: 根据屏幕尺寸加载合适的图片大小
- **懒加载**: 自动实现图片懒加载
- **错误回退**: 优化图片加载失败时自动回退到原始图片
- **加载状态**: 提供加载和错误状态的视觉反馈

### 预设组件
- **HeroImage**: 适用于横幅图片（1200x800）
- **ProductImage**: 适用于产品展示（800x600）
- **ThumbnailImage**: 适用于缩略图（300x200）
- **ToolImage**: 适用于工具图片（600x450）

## ⚙️ 配置选项

### 压缩预设
```tsx
export const COMPRESSION_PRESETS = {
  // 高质量（适合产品图片）
  high: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.9,
    format: 'jpeg',
    maxSizeKB: 800
  },
  
  // 中等质量（适合一般展示）
  medium: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.85,
    format: 'jpeg',
    maxSizeKB: 400
  },
  
  // 低质量（适合缩略图）
  low: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 0.8,
    format: 'jpeg',
    maxSizeKB: 150
  },
  
  // WebP 格式（现代浏览器）
  webp: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.85,
    format: 'webp',
    maxSizeKB: 300
  }
};
```

### 构建时配置
```javascript
// scripts/optimize-images.js
const CONFIG = {
  inputDir: 'public/images',
  outputDir: 'public/images/optimized',
  backupDir: 'public/images/backup',
  formats: ['webp', 'avif', 'jpeg'],
  quality: {
    jpeg: 85,
    webp: 85,
    avif: 80
  },
  sizes: {
    hero: [1200, 800, 600, 400],
    product: [800, 600, 400, 300],
    tool: [600, 400, 300, 200],
    thumbnail: [300, 200, 150]
  }
};
```

## 🚀 性能优化建议

### 1. 图片命名规范
- Hero 图片: `*-hero.jpg`
- 工具图片: `*-tool.jpg` 或放在 `tools/` 目录
- 缩略图: `*-thumb.jpg`
- 其他: 默认为产品图片

### 2. 最佳实践
- 使用 `priority` 属性标记首屏图片
- 为不同用途选择合适的预设组件
- 定期运行 `npm run optimize:images` 优化新增图片
- 监控图片加载性能和用户体验

### 3. 浏览器兼容性
- **AVIF**: Chrome 85+, Firefox 93+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **JPEG**: 所有浏览器（回退格式）

## 🔍 调试和监控

### 查看优化统计
```bash
npm run optimize:images
```

### 浏览器开发者工具
1. Network 面板查看实际加载的图片格式
2. Performance 面板分析图片加载性能
3. Console 查看优化组件的调试信息

### 演示页面
访问 `/image-optimization-demo` 查看优化前后的对比效果。

## 📝 注意事项

1. **首次运行**: 第一次运行优化脚本会创建备份，后续运行会跳过备份步骤
2. **存储空间**: 优化后的图片会占用额外存储空间，但总体仍然节省空间
3. **构建时间**: 图片优化会增加构建时间，但运行时性能大幅提升
4. **缓存策略**: 优化后的图片建议设置长期缓存（1年）

## 🆘 故障排除

### 常见问题
1. **图片不显示**: 检查优化图片是否生成成功
2. **加载缓慢**: 确认是否使用了正确的组件和尺寸
3. **格式不支持**: 检查浏览器兼容性，组件会自动回退

### 重新优化
```bash
# 删除优化文件并重新生成
npm run optimize:images:force
```
