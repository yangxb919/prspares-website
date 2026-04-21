import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});

const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const slugs = [
  'oled-vs-lcd-comparison-guide',
  'why-are-mobile-phone-battery-replacement-safety-standards-critical-for-your-device-and-personal-safety',
  'why-risk-your-business-on-single-source-display-suppliers',
  'are-chinese-phone-parts-suppliers-really-worth-the-risk-the-truth-about-quality-vs-cost-trade-offs',
  'are-substandard-mobile-batteries-killing-your-repair-business-the-complete-guide-to-sourcing-certified-mobile-phone-batteries-for-professional-success',
  'how-do-you-choose-high-quality-screen-replacement-parts-for-your-phone',
  'how-can-you-capitalize-on-the-4552b-mobile-repair-boom-with-premium-wholesale-strategies',
  'how-can-you-find-trustworthy-wholesale-suppliers-for-mobile-phone-repair-parts-the-complete-quality-control-guide',
  'the-3-minute-iphone-oled-test-that-saved-me-12000-in-bad-screens',
  'iphone-screen-replacement-cost-uk-guide-2026',
  'iphone-se-screen-replacement-budget-friendly-repair-guide',
  'samsung-galaxy-s24-screen-replacement-uk',
];

const { data } = await c.from('posts').select('slug,title,excerpt,meta,content').in('slug', slugs);

for (const p of data) {
  console.log('===============================');
  console.log('SLUG:', p.slug);
  console.log('TITLE:', p.title);
  console.log('EXCERPT:', (p.excerpt||'').slice(0,250).replace(/\n/g,' '));
  console.log('CONTENT_FIRST_300:', (p.content||'').replace(/[#*`]/g,'').replace(/\s+/g,' ').slice(0,300));
  console.log('CUR_SEO_TITLE:', p.meta?.seo?.title || '(none)');
  console.log('CUR_SEO_DESC:', p.meta?.seo?.description || '(none)');
  console.log('WORD_COUNT:', (p.content||'').split(/\s+/).length);
  console.log();
}
