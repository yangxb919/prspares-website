import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

// Duplicate pairs to merge — {drop: oldSlug, keep: newSlug}
const merges = [
  {
    drop: 'iphone-screen-replacement-cost-uk-complete-price-guide-by-model-2026',
    keep: 'iphone-screen-replacement-cost-uk-guide-2026',
    reason: 'Identical title; newer version is 2384w vs 1418w.',
  },
  {
    drop: 'phone-lcd-parts-wholesale-the-complete-guide-to-quality-grades-pricing-choosing-the-right-supplier',
    keep: 'phone-lcd-parts-wholesale-quality-grades-pricing-supplier-guide',
    reason: 'Same topic; kept version has shorter slug (67 vs 98 chars).',
  },
  {
    drop: 'samsung-a-series-repair-parts-small-buyers-source-first',
    keep: 'samsung-a-series-repair-parts-stock-guide',
    reason: 'Near-identical intent ("source first" vs "stock first"); kept version is older/established.',
  },
];

console.log('Processing', merges.length, 'duplicate pairs...\n');
let ok = 0, err = 0;

for (const m of merges) {
  // Verify both exist as published
  const { data: both } = await c.from('posts').select('slug,status,title').in('slug', [m.drop, m.keep]);
  const dropRow = both?.find(r => r.slug === m.drop);
  const keepRow = both?.find(r => r.slug === m.keep);
  if (!dropRow || !keepRow) {
    console.log(`⚠ skip (missing row): drop=${!!dropRow} keep=${!!keepRow} — ${m.drop}`);
    err++; continue;
  }
  if (dropRow.status !== 'publish') {
    console.log(`⚠ already non-publish: ${m.drop}`);
    continue;
  }

  // Set status=draft on the dropped one; leave meta so we can undo if needed
  const { error } = await c.from('posts').update({ status: 'draft' }).eq('slug', m.drop);
  if (error) {
    console.log(`❌ update err: ${m.drop} — ${error.message}`);
    err++; continue;
  }
  console.log(`✅ ${m.drop}`);
  console.log(`    → 301 to ${m.keep}`);
  console.log(`    reason: ${m.reason}\n`);
  ok++;
}

console.log(`Done. ok=${ok} err=${err}`);
console.log('\n注意：接下来需要在 next.config.js 加 3 条 301 redirect 规则。');
