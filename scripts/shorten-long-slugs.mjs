import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

// Slug renames. Skipped 2 high-impression articles (back-glass, screen-value)
// to avoid ranking volatility during the 301 transition — can do in 2-3 weeks
// once their rewritten SEO title/desc stabilise in the index.
const renames = [
  { old: 'are-substandard-mobile-batteries-killing-your-repair-business-the-complete-guide-to-sourcing-certified-mobile-phone-batteries-for-professional-success',
    new: 'substandard-battery-sourcing-certified-repair-shops' },
  { old: 'how-can-you-find-trustworthy-wholesale-suppliers-for-mobile-phone-repair-parts-the-complete-quality-control-guide',
    new: 'trustworthy-wholesale-phone-parts-suppliers-qc' },
  { old: 'why-are-mobile-phone-battery-replacement-safety-standards-critical-for-your-device-and-personal-safety',
    new: 'phone-battery-replacement-safety-standards' },
  { old: 'are-chinese-phone-parts-suppliers-really-worth-the-risk-the-truth-about-quality-vs-cost-trade-offs',
    new: 'china-phone-parts-suppliers-quality-vs-cost' },
  { old: 'iphone-15-screen-replacement-the-real-cost-quality-grades-what-repair-shops-wont-tell-you',
    new: 'iphone-15-screen-replacement-cost-quality' },
  { old: 'how-can-you-capitalize-on-the-4552b-mobile-repair-boom-with-premium-wholesale-strategies',
    new: 'mobile-repair-wholesale-growth-strategies' },
  { old: 'how-are-mobile-phone-screens-made-complete-production-process-analysis-from-lcd-to-oled',
    new: 'how-phone-screens-are-made-lcd-oled' },
  { old: 'iphone-14-screen-replacement-the-design-change-that-breaks-screens-and-how-to-avoid-it',
    new: 'iphone-14-screen-replacement-design-fix' },
  { old: 'cell-phone-screen-replacement-wholesale-oem-vs-aftermarket-quality-the-insiders-guide',
    new: 'phone-screen-wholesale-oem-vs-aftermarket' },
];

// Validate new slugs: length, no clashes
const existingSlugs = new Set((await c.from('posts').select('slug').limit(500)).data?.map(r => r.slug));
for (const r of renames) {
  if (r.new.length > 65) console.log(`⚠ new slug too long [${r.new.length}]:`, r.new);
  if (existingSlugs.has(r.new)) console.log(`❌ new slug clashes with existing:`, r.new);
}

console.log(`Processing ${renames.length} slug renames...\n`);
let ok = 0, err = 0;

for (const r of renames) {
  // Read row
  const { data: row } = await c.from('posts').select('slug,title,meta,status').eq('slug', r.old).maybeSingle();
  if (!row) { console.log(`❌ NOT FOUND: ${r.old}`); err++; continue; }
  if (row.status !== 'publish') { console.log(`⚠ non-publish skip: ${r.old}`); continue; }

  // Clear meta.canonical (if it was pinning to old URL) and keep seo.title/desc
  const newMeta = { ...(row.meta || {}) };
  if (newMeta.canonical) delete newMeta.canonical;
  if (newMeta.open_graph?.url) delete newMeta.open_graph.url;

  const { error } = await c.from('posts').update({ slug: r.new, meta: newMeta }).eq('slug', r.old);
  if (error) { console.log(`❌ ${r.old} → ${error.message}`); err++; continue; }
  console.log(`✅ [${r.old.length}→${r.new.length}字] ${r.new}`);
  ok++;
}

console.log(`\nDone. ok=${ok} err=${err}`);
console.log('\n// Paste into next.config.js redirects():');
renames.forEach(r => {
  console.log(`      { source: '/blog/${r.old}', destination: '/blog/${r.new}', permanent: true },`);
});
