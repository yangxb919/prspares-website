/** @type {import('next-sitemap').IConfig} */
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
    '/thank-you',
    '/products/debug'
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/products/iphone-rear-camera-wholesale'),
    await config.transform(config, '/products/ipad-battery-replacement-factory'),
    await config.transform(config, '/products/samsung-phone-parts-oem'),
    await config.transform(config, '/products/phone-battery-replacement-manufacturer'),
    await config.transform(config, '/products/iphone-back-glass-repair-factory'),
    await config.transform(config, '/products/cell-phone-spare-parts-wholesale-manufacturer'),
    await config.transform(config, '/products/mobile-phone-parts-odm-supplier'),
    await config.transform(config, '/products/smartphone-screen-replacement-factory-oem'),
    await config.transform(config, '/products/iphone-spare-parts-wholesale-oem'),
    await config.transform(config, '/products/android-phone-parts-manufacturer-supplier'),
  ],
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
