/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('@supabase/supabase-js');

async function fetchProductSlugs() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return [];
    const supabase = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('products')
      .select('slug')
      .eq('status', 'publish')
      .not('slug', 'is', null);
    if (error) return [];
    return (data || []).map((r) => r.slug).filter(Boolean);
  } catch (_) {
    return [];
  }
}

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://prspares.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/auth/*',
    '/api/*',
    '/thank-you'
  ],
  additionalPaths: async (config) => {
    const staticPaths = [
      '/products/iphone-rear-camera-wholesale',
      '/products/ipad-battery-replacement-factory',
      '/products/samsung-phone-parts-oem',
      '/products/phone-battery-replacement-manufacturer',
      '/products/iphone-back-glass-repair-factory',
      '/products/cell-phone-spare-parts-wholesale-manufacturer',
      '/products/mobile-phone-parts-odm-supplier',
      '/products/smartphone-screen-replacement-factory-oem',
      '/products/iphone-spare-parts-wholesale-oem',
      '/products/android-phone-parts-manufacturer-supplier',
    ];

    const dynamicSlugs = await fetchProductSlugs();
    const dynamicPaths = dynamicSlugs.map((slug) => `/products/${slug}`);
    const allPaths = [...new Set([...staticPaths, ...dynamicPaths])];
    return Promise.all(allPaths.map((p) => config.transform(config, p)));
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/']
      }
    ],
    additionalSitemaps: [
      'https://prspares.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority for B2B wholesale pages
    if (path.includes('wholesale') || path.includes('factory') || path.includes('manufacturer') || path.includes('supplier') || path.includes('oem') || path.includes('odm')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
