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

      // --- Duplicate post merges (T8, 2026-04-21) ---
      {
        source: '/blog/iphone-screen-replacement-cost-uk-complete-price-guide-by-model-2026',
        destination: '/blog/iphone-screen-replacement-cost-uk-guide-2026',
        permanent: true,
      },
      {
        source: '/blog/phone-lcd-parts-wholesale-the-complete-guide-to-quality-grades-pricing-choosing-the-right-supplier',
        destination: '/blog/phone-lcd-parts-wholesale-quality-grades-pricing-supplier-guide',
        permanent: true,
      },
      {
        source: '/blog/samsung-a-series-repair-parts-small-buyers-source-first',
        destination: '/blog/samsung-a-series-repair-parts-stock-guide',
        permanent: true,
      },

      // --- Long slug shortenings (T9, 2026-04-21) ---
      // NOTE: this long-form was originally shortened to
      // `substandard-battery-sourcing-certified-repair-shops`. That short slug
      // is itself now 301-ed to the wholesale-buyer pillar (see P7 block
      // below), so this long-form redirect now points directly at the pillar
      // to avoid a redirect chain.
      {
        source: '/blog/are-substandard-mobile-batteries-killing-your-repair-business-the-complete-guide-to-sourcing-certified-mobile-phone-batteries-for-professional-success',
        destination: '/blog/buying-iphone-batteries-bulk-repair-business',
        permanent: true,
      },
      {
        source: '/blog/how-can-you-find-trustworthy-wholesale-suppliers-for-mobile-phone-repair-parts-the-complete-quality-control-guide',
        destination: '/blog/trustworthy-wholesale-phone-parts-suppliers-qc',
        permanent: true,
      },
      {
        source: '/blog/why-are-mobile-phone-battery-replacement-safety-standards-critical-for-your-device-and-personal-safety',
        destination: '/blog/phone-battery-replacement-safety-standards',
        permanent: true,
      },
      {
        source: '/blog/are-chinese-phone-parts-suppliers-really-worth-the-risk-the-truth-about-quality-vs-cost-trade-offs',
        destination: '/blog/china-phone-parts-suppliers-quality-vs-cost',
        permanent: true,
      },
      {
        source: '/blog/iphone-15-screen-replacement-the-real-cost-quality-grades-what-repair-shops-wont-tell-you',
        destination: '/blog/iphone-15-screen-replacement-cost-quality',
        permanent: true,
      },
      {
        source: '/blog/how-can-you-capitalize-on-the-4552b-mobile-repair-boom-with-premium-wholesale-strategies',
        destination: '/blog/mobile-repair-wholesale-growth-strategies',
        permanent: true,
      },
      {
        source: '/blog/how-are-mobile-phone-screens-made-complete-production-process-analysis-from-lcd-to-oled',
        destination: '/blog/how-phone-screens-are-made-lcd-oled',
        permanent: true,
      },
      {
        source: '/blog/iphone-14-screen-replacement-the-design-change-that-breaks-screens-and-how-to-avoid-it',
        destination: '/blog/iphone-14-screen-replacement-design-fix',
        permanent: true,
      },
      {
        source: '/blog/cell-phone-screen-replacement-wholesale-oem-vs-aftermarket-quality-the-insiders-guide',
        destination: '/blog/phone-screen-wholesale-oem-vs-aftermarket',
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
      // 旧 SEO 落地页 → /products
      {
        source: '/products/android-phone-parts-manufacturer-supplier',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/products/iphone-spare-parts-wholesale-oem',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/products/samsung-phone-parts-oem',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/products/mobile-phone-parts-odm-supplier',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/products/for-ipad-pro-11-2st-repair-parts',
        destination: '/products',
        permanent: true,
      },
      // 已废弃的旧 blog 文章 → 相关替代或 /blog
      {
        source: '/blog/replacement-parts-repeat-orders-repair-shops',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/oled-vs-lcd-ultimate-technical-comparison',
        destination: '/blog/lcd-vs-oled-hard-soft-oled-repair-shops',
        permanent: true,
      },
      {
        source: '/blog/what-are-the-key-standards-for-injection-molded-electronic-casings',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/what-challenges-do-startups-face-in-injection-molding',
        destination: '/blog',
        permanent: true,
      },

      // --- Cluster consolidation 301s (P7, 2026-04-22) ---
      // Sources tracked in src/lib/blog-301-candidates.ts. Each entry below
      // graduated from `canonical-to-pillar` (observation period) to a hard
      // 301 after content review confirmed no salvageable unique value.

      // 2 OLED/LCD legacy generics → repair-shop OLED/LCD pillar
      {
        source: '/blog/whats-the-real-difference-between-oled-and-lcd-phone-screens',
        destination: '/blog/lcd-vs-oled-hard-soft-oled-repair-shops',
        permanent: true,
      },
      {
        source: '/blog/oled-vs-lcd-comparison-guide',
        destination: '/blog/lcd-vs-oled-hard-soft-oled-repair-shops',
        permanent: true,
      },

      // Substandard-battery legacy → wholesale-buyer pillar
      // (Safety-standards intent now lives at `phone-battery-replacement-safety-standards`,
      // so consolidating this one to the buyer pillar does not lose the cert angle.)
      {
        source: '/blog/substandard-battery-sourcing-certified-repair-shops',
        destination: '/blog/buying-iphone-batteries-bulk-repair-business',
        permanent: true,
      },

      // --- Slug-rename housekeeping (P7, 2026-04-22) ---
      // The post itself was renamed in Supabase from
      //   2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen
      //   → iphone-battery-wholesale-sourcing-guide-shenzhen
      // because the title and content had already been updated to "2026" in P4.
      // This 301 catches the old URL.
      {
        source: '/blog/2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen',
        destination: '/blog/iphone-battery-wholesale-sourcing-guide-shenzhen',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
