import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});

const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const { data, error } = await c.from('posts').select('slug,title,excerpt,meta,content').eq('status','publish').limit(200);
if (error) { console.log('ERR', error.message); process.exit(1); }
console.log('Total published posts:', data.length, '\n');

const longSlug = [], autoGenDesc = [], longTitle = [], noSeoDesc = [], shortContent = [], noCover = [], missingExcerpt = [], longSeoTitle = [];

for (const p of data) {
  const slug = p.slug || '';
  const title = p.title || '';
  const seoTitle = p.meta?.seo?.title || '';
  const seoDesc = p.meta?.seo?.description || '';
  const content = p.content || '';
  const wc = content.split(/\s+/).length;

  if (slug.length > 80) longSlug.push({slug, len: slug.length});
  if (title.length > 70) longTitle.push({slug, title_len: title.length, title});
  if (seoTitle.length > 65) longSeoTitle.push({slug, len: seoTitle.length});
  if (/Learn more from PRSPARES experts|PRSPARES experts\./.test(seoDesc)) autoGenDesc.push({slug, seoDesc: seoDesc.slice(0,120)});
  if (!seoDesc || seoDesc.length < 50) noSeoDesc.push({slug, desc: seoDesc});
  if (wc < 1500) shortContent.push({slug, wc});
  if (!p.meta?.cover_image) noCover.push(slug);
  if (!p.excerpt) missingExcerpt.push(slug);
}

console.log('=== SEO 问题统计 ===');
console.log(`1. Slug > 80 字符:               ${longSlug.length} 篇`);
console.log(`2. Title > 70 字符:              ${longTitle.length} 篇`);
console.log(`3. SEO title > 65 字符:          ${longSeoTitle.length} 篇`);
console.log(`4. SEO desc 是模板(auto-gen):    ${autoGenDesc.length} 篇 🚨`);
console.log(`5. SEO desc 缺失或 < 50 字符:    ${noSeoDesc.length} 篇`);
console.log(`6. 字数 < 1500:                  ${shortContent.length} 篇`);
console.log(`7. 无 cover_image:               ${noCover.length} 篇`);
console.log(`8. 无 excerpt:                   ${missingExcerpt.length} 篇`);

console.log('\n=== auto-gen desc 所有文章（需批量重写）===');
autoGenDesc.forEach(r => console.log('  -', r.slug));

console.log('\n=== long slug > 80 字符 所有文章（需改短 + 301）===');
longSlug.sort((a,b) => b.len - a.len).forEach(r => console.log(`  [${r.len}字]`, r.slug));

console.log('\n=== short content < 1500 词 (前 15) ===');
shortContent.sort((a,b) => a.wc - b.wc).slice(0, 15).forEach(r => console.log(`  [${r.wc}词]`, r.slug));

// Save full detail for follow-up scripts
fs.writeFileSync('scripts/audit-results.json', JSON.stringify({
  total: data.length, longSlug, autoGenDesc, shortContent, noSeoDesc, longSeoTitle, longTitle
}, null, 2));
console.log('\n→ Full details saved to scripts/audit-results.json');
