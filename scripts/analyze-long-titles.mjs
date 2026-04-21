import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});

const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});
const { data } = await c.from('posts').select('slug,title,meta').eq('status','publish').limit(200);

const buckets = {
  hasGoodSeoTitle: 0,        // seo.title exists and ≤ 60 chars
  hasLongSeoTitle: 0,        // seo.title exists but > 60 chars
  noSeoTitle: 0,             // no seo.title at all
  seoEqualsTitle: 0,         // seo.title == title (useless)
};

const needWork = [];

for (const p of data) {
  const title = p.title || '';
  const seoTitle = p.meta?.seo?.title;
  if (title.length <= 70) continue;  // Only care about long titles

  if (!seoTitle) {
    buckets.noSeoTitle++;
    needWork.push({slug: p.slug, title, reason: 'no seo.title'});
  } else if (seoTitle === title) {
    buckets.seoEqualsTitle++;
    needWork.push({slug: p.slug, title, reason: 'seo=title'});
  } else if (seoTitle.length > 60) {
    buckets.hasLongSeoTitle++;
    needWork.push({slug: p.slug, title, seoTitle, reason: 'seo>60', len: seoTitle.length});
  } else {
    buckets.hasGoodSeoTitle++;
  }
}

console.log('=== 102 篇过长 title 的 SEO title 状况 ===');
console.log('Good (has seo.title ≤ 60):', buckets.hasGoodSeoTitle);
console.log('Long seo.title (> 60):    ', buckets.hasLongSeoTitle);
console.log('No seo.title:             ', buckets.noSeoTitle);
console.log('seo.title == title (废):  ', buckets.seoEqualsTitle);
console.log('\n需要处理:', needWork.length, '篇\n');

console.log('=== 需要起草新 SEO title 的样本（前 20 篇）===');
needWork.slice(0,20).forEach(w => {
  console.log(`[${w.reason}]`, w.slug);
  console.log('  title:', w.title);
  if (w.seoTitle) console.log('  cur seo:', w.seoTitle);
});

fs.writeFileSync('scripts/long-title-posts.json', JSON.stringify(needWork, null, 2));
console.log('\n→ scripts/long-title-posts.json saved');
