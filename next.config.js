/** @type {import('next').NextConfig} */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname = 'eiikisplpnbeiscunkap.supabase.co';
try {
  if (url) supabaseHostname = new URL(url).hostname;
} catch (_) {
  // keep default if env is malformed
}

const nextConfig = {
  // Use Next 14's native package import optimisation. modularizeImports
  // (the previous approach) over-fragmented lucide-react into per-icon
  // chunks and tripled Desktop TBT (300ms → 930ms in Lighthouse).
  // optimizePackageImports does the same tree-shake at compile time
  // without breaking the runtime module graph.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      // Long-cache pre-optimized images and hero originals (1 year, immutable).
      {
        source: '/images/optimized/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/hero/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Site-wide security headers (closes PSI Best Practices warnings on
      // HSTS / COOP / XFO / X-Content-Type-Options).
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
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
        hostname: 'pub-3d088e9c8cac4da89ab00382fa664592.r2.dev',
        port: '',
        pathname: '/products/**',
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
      // --- 竞品文案清理 / 薄页合并 (2026-09-02) ---
      // /products/iphone-12-rear-camera 是早年导入的残留：正文、meta description、
      // og:description 三处都带竞品 Fixez 的电话与邮箱。GSC 近 4 个月 0 点击、
      // 1~2 次曝光/月，而同主题自建页 /products/iphone-rear-camera-wholesale 有
      // 339 次曝光；标价 $19.11 还是零售价，与批发定位冲突 —— 所以合并而非改写。
      // 数据库里该行已同步改 draft 并清掉抄来的文案；next-sitemap 的
      // fetchProductSlugs() 只取 status='publish'，下次构建自动从 sitemap 剔除。
      // 旧版 WooCommerce 路径 /product/... 直接指向终点，避免走两跳。
      {
        source: '/product/iphone-12-rear-camera',
        destination: '/products/iphone-rear-camera-wholesale',
        permanent: true,
      },
      {
        source: '/products/iphone-12-rear-camera',
        destination: '/products/iphone-rear-camera-wholesale',
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

      // --- Missing /blog prefix (2026-09-04) ---
      // GSC「未找到 (404)」里这 3 条是历史外链/旧站残留写成了根路径。
      // 目标页线上均为 200，补前缀即可回收这些链接的权重。
      // 前一批 2 条已在 bafebf4 处理，这是剩下的。
      {
        source: '/iphone-charging-port-replacement-guide',
        destination: '/blog/iphone-charging-port-replacement-guide',
        permanent: true,
      },
      {
        source: '/phone-screen-repair-pricing-strategy',
        destination: '/blog/phone-screen-repair-pricing-strategy',
        permanent: true,
      },
      {
        source: '/wholesale-phone-parts-supplier-uk',
        destination: '/blog/wholesale-phone-parts-supplier-uk',
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
      // P7 follow-up — `oled-vs-lcd-comprehensive-comparison` (38 imp / 0 clk)
      // was missed in the original P7 block. Same merge pattern as
      // `oled-vs-lcd-comparison-guide` (above) — both are generic OLED/LCD
      // overviews now consolidated into the repair-shop pillar.
      {
        source: '/blog/oled-vs-lcd-comprehensive-comparison',
        destination: '/blog/lcd-vs-oled-hard-soft-oled-repair-shops',
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

      // --- Cluster consolidation 301s (content-arch, 2026-06-21) ---
      // OEM-vs-aftermarket cannibalization: id89 (pos9) + id74 (pos7) both ranked
      // for the same term, splitting authority. id74 is deeper (4868w, citability-
      // done) and is already the pillar for this topic (the long-form insiders-guide
      // slug above 301s into it). Merge id89 → id74; id89's unique "Common
      // Misconceptions" section was grafted into id74 before this redirect. 28
      // inbound internal links repointed id89 → id74 in the same change.
      {
        source: '/blog/oem-vs-aftermarket-phone-screens',
        destination: '/blog/phone-screen-wholesale-oem-vs-aftermarket',
        permanent: true,
      },

      // wholesale-iphone-screens over-fragmentation (HUB3): 6 posts all targeting
      // the 90-vol "wholesale iphone screens" term, all 0 impressions. id90
      // (pricing, best commercial slug) kept as pillar; id102 (MOQ/compare-quotes)
      // and id101 (by-business-type) merged in — their unique sections ("5-Point
      // Quote Comparison Framework", "Options by Business Type") grafted into id90
      // first. id104/id155/id103 kept as distinct spokes. Inbound links repointed.
      {
        source: '/blog/wholesale-iphone-screens-grades-prices-moq',
        destination: '/blog/wholesale-iphone-screens-pricing-guide',
        permanent: true,
      },
      {
        source: '/blog/iphone-screen-replacement-wholesale-repair-business',
        destination: '/blog/wholesale-iphone-screens-pricing-guide',
        permanent: true,
      },

      // --- Missing /blog prefix (2026-08-02) ---
      // GSC「未找到 404」里这两条各被 Googlebot 抓过（07-22 / 04-30），而两篇文章本身
      // 都在（id170 / id147，均 publish）。grep 过 src/：站内没有任何链接指向这两个
      // 无前缀的 URL —— 所以来源是外部链接或历史索引，意味着**有外链权重正打在 404 上**。
      // 301 回正确路径把它收回来。这是 08-07 观察窗口内允许做的技术 hygiene：
      // 不涉及 cohort 那 20 个 URL 的内容，不污染判据。
      {
        source: '/charging-port-failures-after-replacement',
        destination: '/blog/charging-port-failures-after-replacement',
        permanent: true,
      },
      {
        source: '/iphone-unknown-part-warning-screen-replacement-ic-transfer',
        destination: '/blog/iphone-unknown-part-warning-screen-replacement-ic-transfer',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
