/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('@supabase/supabase-js');

/**
 * 🔴 next-sitemap 是独立进程，**不会**自动加载 .env / .env.production / .env.local
 * （Next.js 只在 `next build` 自己的进程里加载）。项目也没装 dotenv。
 *
 * 后果（2026-07-30 查实）：`process.env.NEXT_PUBLIC_SUPABASE_*` 在生成 sitemap 时
 * 一直是 undefined → fetchPostSlugs / fetchProductSlugs 一直返回空数组 →
 * additionalPaths 长期只贡献 23 条静态路径，线上 sitemap 里的 160 条其实是
 * next-sitemap 自己扫构建产物得到的。直接症状：榜单文（id202）等未被预渲染的
 * 文章根本没进 sitemap，且所有 URL 都没有 lastmod。
 *
 * 这里手工解析 env 文件（零新增依赖，与项目脚本一致的做法），已存在的环境变量优先。
 */
(function loadEnvFiles() {
  const fs = require('fs');
  const path = require('path');
  for (const name of ['.env.production', '.env.local', '.env']) {
    try {
      const p = path.join(__dirname, name);
      if (!fs.existsSync(p)) continue;
      for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!m) continue;
        const key = m[1];
        if (process.env[key]) continue;
        process.env[key] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    } catch (_) {
      /* 读不到就跳过，绝不阻塞构建 */
    }
  }
})();

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

async function fetchPostSlugs() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return [];
    const supabase = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'publish')
      .not('slug', 'is', null);
    if (error) return [];
    return (data || []).map((r) => r.slug).filter(Boolean);
  } catch (_) {
    return [];
  }
}

/**
 * 真实 lastmod 映射（2026-07-30 修）。
 *
 * 为什么必须有：GSC 实测 161 条 URL 全部没有 lastmod（配置里 autoLastmod: false，
 * transform 也没输出该字段）。Google 只用 lastmod 判断哪些页面需要重新抓取，
 * changefreq / priority 是被忽略的 —— 结果就是 sitemap 天天被抓（07-29 20:28
 * 最后一次），但新页和改动过的页迟迟不被抓取，只能靠 GSC 逐个手动请求收录。
 *
 * 这里取数据库真实的 updated_at（回退 published_at），不用 autoLastmod：
 * autoLastmod 会给所有 URL 盖同一个构建时间戳、每次部署都变，Google 会学会
 * 不信任它，反而更糟。查不到记录的静态页宁可不输出 lastmod，也不编时间。
 */
/**
 * 静态路由的额外依赖（2026-07-31 补）。
 *
 * 为什么需要：品牌页 /products/screens/{gx,jk} 的 page.tsx 只有 30 行壳子，真正的
 * 内容全在共享组件与目录数据里。只看路由目录的话，改了组件/价目也不会更新 lastmod，
 * Google 就收不到「这页变了」的信号——JK 页 07-31 补强后 lastmod 仍停在 07-19 就是
 * 这个坑。这里显式登记依赖，git log 会取所有 pathspec 里最新的一次提交。
 */
const ROUTE_EXTRA_DEPS = {
  '/products/screens/gx': [
    'src/components/products/BrandScreenPage.tsx',
    'src/data/screen-brands.ts',
    'src/data/iphone-screen-catalog.ts',
  ],
  '/products/screens/jk': [
    'src/components/products/BrandScreenPage.tsx',
    'src/data/screen-brands.ts',
    'src/data/iphone-screen-catalog.ts',
  ],
  '/products/screens-grade-guide': [
    'src/data/grade-taxonomy.ts',
    'src/data/iphone-screen-catalog.ts',
  ],
};

/**
 * 静态路由（/about、/products/screens/jk、/products/screens-grade-guide 等）在
 * 数据库里没有记录，取该路由源码目录（含 ROUTE_EXTRA_DEPS 登记的共享依赖）的最后一次
 * git 提交时间作为 lastmod。这样改了页面或它依赖的组件/数据就自动更新，不需要有人
 * 手工维护日期表。取不到（无 git / 未找到文件）就不输出 lastmod。
 */
function gitLastmodForRoute(routePath) {
  try {
    const { execFileSync } = require('child_process');
    const fsMod = require('fs');
    const pathMod = require('path');
    const rel =
      routePath === '/' ? 'src/app/page.tsx' : `src/app${routePath}`;
    const abs = pathMod.join(__dirname, rel);
    if (!fsMod.existsSync(abs)) return null;
    const deps = (ROUTE_EXTRA_DEPS[routePath] || []).filter((d) =>
      fsMod.existsSync(pathMod.join(__dirname, d))
    );
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', rel, ...deps], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out).toISOString() : null;
  } catch (_) {
    return null;
  }
}

let _lastmodPromise = null;
async function loadLastmodMap() {
  if (_lastmodPromise) return _lastmodPromise;
  _lastmodPromise = (async () => {
    const map = new Map();
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !anon) return map;
      const supabase = createClient(url, anon, { auth: { persistSession: false } });
      const [posts, products] = await Promise.all([
        supabase
          .from('posts')
          .select('slug, updated_at, published_at')
          .eq('status', 'publish')
          .not('slug', 'is', null),
        supabase
          .from('products')
          .select('slug, updated_at, created_at')
          .eq('status', 'publish')
          .not('slug', 'is', null),
      ]);
      for (const r of posts.data || []) {
        const ts = r.updated_at || r.published_at;
        if (r.slug && ts) map.set(`/blog/${r.slug}`, new Date(ts).toISOString());
      }
      for (const r of products.data || []) {
        const ts = r.updated_at || r.created_at;
        if (r.slug && ts) map.set(`/products/${r.slug}`, new Date(ts).toISOString());
      }
    } catch (_) {
      // 取不到就退回“无 lastmod”，与修复前行为一致，绝不阻塞构建
    }
    return map;
  })();
  return _lastmodPromise;
}

const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.phonerepairspares.com';

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: false,
  autoLastmod: false,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin',
    '/admin/*',
    '/auth',
    '/auth/*',
    '/api',
    '/api/*',
    '/demo-seo-scoring',
    '/test-seo',
    '/test-input',
    '/test-markdown',
    '/image-optimization-demo',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
    '/thank-you',
    '/pricing',
    '/news',
    '/news/*',
    '/industry-insights',
    // Pages that 301 to a pillar — sourced from src/lib/blog-301-candidates.ts
    // (status=ready_for_301). Posts stay published in DB so a botched 301
    // deploy degrades gracefully, but they must not appear in sitemap.
    '/blog/whats-the-real-difference-between-oled-and-lcd-phone-screens',
    '/blog/oled-vs-lcd-comparison-guide',
    '/blog/oled-vs-lcd-comprehensive-comparison',
    '/blog/substandard-battery-sourcing-certified-repair-shops',
    // Slug-rename source — old URL 301s to the renamed post.
    '/blog/2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen',
    // Cluster consolidation merges (content-arch, 2026-06-23) — stay
    // status=publish in DB for graceful degradation but 301 to a pillar in
    // next.config.js, so they must not appear in the sitemap.
    '/blog/oem-vs-aftermarket-phone-screens', // → phone-screen-wholesale-oem-vs-aftermarket
    '/blog/wholesale-iphone-screens-grades-prices-moq', // → wholesale-iphone-screens-pricing-guide
    '/blog/iphone-screen-replacement-wholesale-repair-business', // → wholesale-iphone-screens-pricing-guide
  ],
  additionalPaths: async (config) => {
    const staticPaths = [
      '/',
      '/about',
      '/contact',
      '/products',
      '/products/screens',
      '/products/screens/gx',
      '/products/screens/jk',
      '/products/screens-grade-guide',
      '/products/batteries',
      '/products/small-parts',
      '/products/repair-tools',
      '/products/tablet-watch',
      '/products/iphone-rear-camera-wholesale',
      '/products/ipad-battery-replacement-factory',
      '/wholesale-inquiry',
      '/warranty-and-rma',
      // '/id/wholesale', // TODO: 部署后恢复（SEA landing — Bahasa Indonesia）
      // '/th/wholesale', // TODO: 部署后恢复（SEA landing — ภาษาไทย）
      '/blog',
      // Blog category hubs — kept in sync with src/lib/blog-categories.ts
      '/blog/category/repair-guides',
      '/blog/category/parts-knowledge',
      '/blog/category/sourcing-suppliers',
      '/blog/category/business-tips',
      '/blog/category/industry-insights',
      '/privacy-policy',
    ];

    const dynamicSlugs = await fetchProductSlugs();
    const dynamicPaths = dynamicSlugs.map((slug) => `/products/${slug}`);

    const postSlugs = await fetchPostSlugs();
    const blogPaths = postSlugs.map((slug) => `/blog/${slug}`);

    // Filter out excluded paths — `exclude` only filters next-sitemap's own
    // page-tree walk, not URLs we feed in via additionalPaths. The two
    // canonical sources of truth (next.config.js redirects and the exclude
    // list above) must agree, but we still apply the filter here so the two
    // do not silently drift.
    const excluded = new Set(config.exclude || []);
    const allPaths = [
      ...new Set([...staticPaths, ...dynamicPaths, ...blogPaths]),
    ].filter((p) => !excluded.has(p));
    return Promise.all(allPaths.map((p) => config.transform(config, p)));
  },
  transform: async (config, path) => {
    // 真实 lastmod（数据库 updated_at）——Google 唯一会用来排抓取优先级的字段。
    // 查不到的静态页不输出该字段，不编时间。
    const lastmodMap = await loadLastmodMap();
    const lastmod = lastmodMap.get(path) || gitLastmodForRoute(path);

    // Custom priority for B2B wholesale pages
    if (path.includes('wholesale') || path.includes('factory') || path.includes('manufacturer') || path.includes('supplier') || path.includes('oem') || path.includes('odm')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        ...(lastmod ? { lastmod } : {}),
      }
    }

    // Default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      ...(lastmod ? { lastmod } : {}),
    }
  },
}
