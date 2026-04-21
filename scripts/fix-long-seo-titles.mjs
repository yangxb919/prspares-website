import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});

const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const titleUpdates = [
  // 6 篇只需去 " - PRSPARES" 后缀
  { slug: 'iphone-13-screen-replacement-worth-it-2026',
    title: 'iPhone 13 Screen Replacement Cost 2026: Worth Repairing?' },
  { slug: 'iphone-battery-quality-repair-shops',
    title: 'iPhone Battery Replacement: Quality Guide for Repair Shops' },
  { slug: 'iphone-14-screen-grade-repair-shops',
    title: 'iPhone 14 Screen Replacement: Best Grade for Repair Shops' },
  { slug: 'iphone-charging-port-replacement-guide',
    title: 'iPhone Charging Port Replacement: Faults & Parts Guide' },
  { slug: 'touch-not-working-after-screen-replacement',
    title: 'Touch Not Working After Screen Replacement: Fix Guide' },
  { slug: 'black-screen-display-vs-board-problem',
    title: 'iPhone Screen Black but Phone Is On: Display vs Board Fix' },
  // 6 篇需要重写缩短
  { slug: 'phone-repair-shop-additional-revenue-streams-2026',
    title: 'Phone Repair Shop: 5 Revenue Streams to Add (2026)' },
  { slug: 'iphone-charging-port-replacement-cost-uk',
    title: 'iPhone Charging Port Repair Cost UK: Shop & Wholesale' },
  { slug: 'iphone-housing-swap-nfc-apple-pay-troubleshooting',
    title: 'iPhone Housing Swap: Fix NFC & Apple Pay Issues' },
  { slug: 'iphone-15-screen-replacement-cost-repair-shops',
    title: 'iPhone 15 Screen Replacement: 2026 Shop Pricing Guide' },
  { slug: 'oem-vs-aftermarket-iphone-15-profit-margin',
    title: 'OEM vs Aftermarket iPhone 15: Profit Margin Data' },
  { slug: 'iphone-16-screen-replacement',
    title: 'iPhone 16 Screen Replacement: Parts, Grades & Stock Guide' },
];

// Validate all are ≤ 60 chars
for (const u of titleUpdates) {
  if (u.title.length > 60) {
    console.log(`⚠ TOO LONG [${u.title.length}]:`, u.title);
  }
}

console.log('Processing', titleUpdates.length, 'posts (只更新 seo.title)...\n');
let ok = 0, err = 0;
for (const u of titleUpdates) {
  const { data: cur } = await c.from('posts').select('meta').eq('slug', u.slug).maybeSingle();
  if (!cur) { console.log('❌ NOT FOUND:', u.slug); err++; continue; }
  const newMeta = {
    ...(cur.meta || {}),
    seo: { ...(cur.meta?.seo || {}), title: u.title },
  };
  const { error } = await c.from('posts').update({ meta: newMeta }).eq('slug', u.slug);
  if (error) { console.log('❌', u.slug, error.message); err++; }
  else { console.log(`✅ [${u.title.length}字]`, u.title); ok++; }
}
console.log(`\nDone. ok=${ok} err=${err}`);
