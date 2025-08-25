const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用压缩优化
  compress: true,

  // 使用 SWC 压缩器 (比 Terser 更快更高效)
  swcMinify: true,

  // 生产环境优化
  productionBrowserSourceMaps: false, // 禁用生产环境 source maps 以减小文件大小

  // 实验性功能
  experimental: {
    // 优化包导入 (Tree Shaking)
    optimizePackageImports: [
      'react-icons',
      'lucide-react',
      'date-fns',
      'lodash'
    ],
  },

  // Webpack 配置优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境额外优化
    if (!dev && !isServer) {
      // 启用更激进的压缩
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,

        // 分割代码块
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },

  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eiikisplpnbeiscunkap.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'pplx-res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],

    // 图片优化配置
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1年缓存
  },

  // 头部配置 (安全和性能)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 启用 Gzip/Brotli 压缩
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
          },
          // 缓存静态资源
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          // API 响应压缩
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
