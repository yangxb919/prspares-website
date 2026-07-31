/**
 * 8月主线 A1/A2：内链权重重排 —— 从站内高流量页（已收录）向未被抓取的页放上下文相关链接。
 *
 * 根因（07-31 实测）：hub156 的 22 篇内链、grade-guide 的 57 篇内链没有一篇来自高流量页；
 * 全站最大入口 id188（7月 98 点击）连一条询盘表单链接都没有（只链了 /contact）。
 *
 * 每条规则强制「命中且仅命中 1 次」，任一条不过则整批不写入。
 * 默认 dry-run，加 --apply 写入（写入时同步刷新 updated_at → 触发 sitemap lastmod 变化）。
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
const APPLY = process.argv.includes('--apply');

const HUB = '/blog/moq-sample-orders-lead-time-wholesale';
const LIST = '/blog/top-10-phone-parts-suppliers-in-china';
const GRADE = '/products/screens-grade-guide';

const RULES = [
  // ---------- id188 boot-loop（7月 98 点击，全站第一入口）----------
  // A1-1 → 榜单文：Cause #3 里那个「换了新供应商结果整批坏」的真实案例，是榜单文最自然的语境
  [188,
   '**Symptoms:** Boot loop that only occurs with the new screen. Original screen (if available) boots fine.',
   'That is a sourcing failure, not a bench failure. Batch-to-batch IC consistency is what separates one supplier channel from another, and "China phone parts supplier" is not one category — it is roughly ten distinct channel types, each with different batch behaviour. Our [transparent map of the ten supplier channels](' + LIST + ') covers what to verify before the first batch lands.\n\n' +
   '**Symptoms:** Boot loop that only occurs with the new screen. Original screen (if available) boots fine.'],

  // A1-2 → grade-guide：IC 可否转移本身就是等级属性，接在 Fix options 之后
  [188,
   '**ROI note:** An EEPROM programmer at $100–$300 pays for itself in 2–5 repairs by eliminating screen-related boot loop callbacks.',
   '**Grade decides whether the IC transfer is even an option.** True Tone data lives on the original screen IC, and Original, Soft OLED and Hard OLED assemblies all accept a transfer with a programmer such as JC V1SE, i2C or JCID — on Incell SKUs support varies by batch. "IC Swappable" is therefore a property of the grade you bought, not a universal feature of aftermarket screens. The [four-grade reference](' + GRADE + ') puts Original, Soft OLED, Hard OLED and Incell side by side on IC transfer, True Tone and wholesale price.\n\n' +
   '**ROI note:** An EEPROM programmer at $100–$300 pays for itself in 2–5 repairs by eliminating screen-related boot loop callbacks.'],

  // A2-1 → 询盘表单：全站最大入口原本只链 /contact（要多跳一次才到表单）
  [188,
   '[request a wholesale quote from PRSPARES](/contact)',
   '[request a wholesale quote from PRSPARES](/wholesale-inquiry)'],

  // A2-2 → hub156：首单流程，接在 Next Steps 的能力陈述之后
  [188,
   'all at wholesale pricing with lifetime warranty.',
   'all at wholesale pricing with lifetime warranty.\n\n' +
   'Ordering from China for the first time? [What a first order actually involves](' + HUB + ') covers MOQ, sample orders and lead time — there is no single-model MOQ, and the published 10+ tier price applies once a mixed order of any models and categories totals 10 pieces.'],

  // ---------- id128 S23/S24（7月 36 点击）----------
  [128,
   'For a complete inventory framework including Samsung, see our [small repair shop stock guide](/blog/phone-parts-small-repair-shop-stock-2026).',
   'For a complete inventory framework including Samsung, see our [small repair shop stock guide](/blog/phone-parts-small-repair-shop-stock-2026). If this would be your first order from a China supplier, [what a first order actually involves](' + HUB + ') covers MOQ, samples and lead time — there is no single-model MOQ, so Samsung and iPhone lines count toward the same 10-piece order threshold.'],

  [128,
   'test Samsung-specific screens from your supplier before committing to volume orders.',
   'test Samsung-specific screens from your supplier before committing to volume orders. If you are still choosing that supplier, our [map of the ten China supplier channels](' + LIST + ') explains why the same S23 Ultra panel legitimately sells at very different prices depending on which channel it came from.'],

  // ---------- id126 iPhone 11（7月 18 点击，新进曝光池 4,805）----------
  [126,
   'For a broader inventory strategy, see our [small repair shop stock guide](/blog/phone-parts-small-repair-shop-stock-2026).',
   'For a broader inventory strategy, see our [small repair shop stock guide](/blog/phone-parts-small-repair-shop-stock-2026). And if this would be your first China order, [what a first order actually involves](' + HUB + ') covers MOQ, samples and lead time — those 3–5 iPhone 11 units do not need to clear a minimum of their own, they simply count toward the 10-piece order threshold.'],

  // ---------- id11 best-value（7月 31 点击）→ JK / GX 品牌页 ----------
  [11,
   'Browse the [iPhone screen assemblies catalog](/products/screens) or submit a [wholesale inquiry](/wholesale-inquiry) to get current per-grade pricing for your volume.',
   'Browse the [iPhone screen assemblies catalog](/products/screens) or submit a [wholesale inquiry](/wholesale-inquiry) to get current per-grade pricing for your volume. If you are comparing panel brands rather than grades, the [JK screen line](/products/screens/jk) and [GX screen line](/products/screens/gx) pages list what each factory actually supplies by model.'],

  // ---------- id10 14PM 后盖（7月 26 点击）→ 榜单文 ----------
  [10,
   'For sourcing, see our [complete iPhone back glass replacement guide](/blog/back-glass-replacement-iphone-guide) for model-by-model parts pricing, or [request wholesale pricing](/wholesale-inquiry) for batch quotes on 14 Pro Max rear glass and housings.',
   'For sourcing, see our [complete iPhone back glass replacement guide](/blog/back-glass-replacement-iphone-guide) for model-by-model parts pricing, or [request wholesale pricing](/wholesale-inquiry) for batch quotes on 14 Pro Max rear glass and housings. Both defects above are supplier-quality problems rather than technique problems, so it pays to know which kind of supplier you are buying from — our [map of the ten China supplier channels](' + LIST + ') explains why the same housing legitimately sells at very different prices.'],
];

const ids=[...new Set(RULES.map(r=>r[0]))];
const {data:posts,error}=await sb.from('posts').select('id,slug,content,meta').in('id',ids);
if(error){console.error(error);process.exit(1);}
const byId=Object.fromEntries(posts.map(p=>[p.id,p]));
if(APPLY){
  fs.writeFileSync('Analytics/_backups_link-authority-pre-2026-07-31.json', JSON.stringify(posts,null,2));
  console.log('✓ 备份 Analytics/_backups_link-authority-pre-2026-07-31.json');
}

const edited={}; let fail=0;
for(const [id,oldS,newS] of RULES){
  const p=byId[id]; if(!p){console.log(`✗ id${id} 不存在`); fail++; continue;}
  const cur=edited[id]!==undefined?edited[id]:(p.content||'');
  const n=cur.split(oldS).length-1;
  if(n!==1){ console.log(`✗ id${id} 命中 ${n} 次（期望 1）: "${oldS.slice(0,64)}…"`); fail++; continue; }
  edited[id]=cur.replace(oldS,newS);
  console.log(`✓ id${id} ${p.slug.slice(0,46)}`);
}
if(fail){ console.log(`\n❌ ${fail} 条规则未通过校验，未写入任何改动`); process.exit(1); }
if(!APPLY){ console.log('\n(预演模式。加 --apply 写入)'); process.exit(0); }

for(const [id,content] of Object.entries(edited)){
  const wc=content.replace(/!\[[^\]]*\]\([^)]*\)/g,' ').replace(/[#*`>|\-]/g,' ').split(/\s+/).filter(Boolean).length;
  const meta={...(byId[id].meta||{})}; meta.seo={...(meta.seo||{}), wordCount:wc};
  const {error:e}=await sb.from('posts').update({content,meta,updated_at:new Date().toISOString()}).eq('id',Number(id));
  if(e){console.error('id'+id,e);process.exit(1);}
  console.log(`  写入 id${id} wordCount=${wc}`);
}
console.log(`\n✓ 已更新 ${Object.keys(edited).length} 篇文章（updated_at 已刷新 → sitemap lastmod 将随下次构建更新）`);
