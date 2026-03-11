/** @type {import('next').NextConfig} */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname = 'eiikisplpnbeiscunkap.supabase.co';
try {
  if (url) supabaseHostname = new URL(url).hostname;
} catch (_) {
  // keep default if env is malformed
}

const nextConfig = {
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
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'pplx-res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // 添加常见的图床域名支持
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.phonerepairspares.com' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: 'https://www.phonerepairspares.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'phonerepairspares.com' }],
        destination: 'https://www.phonerepairspares.com/:path*',
        permanent: true,
      },
      {
        source: '/product-category/for-iwatch-reapir-parts',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/product-category/for-ipad-repair-parts',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/product-category/:path*',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/product/for-ipad-mini-2-repair-parts',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/product/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
      {
        source:
          '/blog/top-10-best-selling-repair-parts-in-2024-a-must-have-guide-for-mobile-phone-repair-shops-and-wholesalers',
        destination:
          '/blog/best-cell-phone-parts-supplier-checklist-2025',
        permanent: true,
      },
      {
        source:
          '/blog/10-best-selling-repair-parts-in-2024-a-must-have-guide-for-mobile-phone-repair-shops-and-wholesalers',
        destination:
          '/blog/best-cell-phone-parts-supplier-checklist-2025',
        permanent: true,
      },
      { source: '/seo', destination: '/blog', permanent: true },
    ];
  },
};

module.exports = nextConfig;
