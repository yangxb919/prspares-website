import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
const APPLY = process.argv.includes('--apply');

// 统一口径（用户 2026-09-10 拍板，取代 07-30「跨品类凑 10 + 试单 5」与 08-24「纯分品类」）：
//   含屏幕的混单：整单满 10 件即可，机型/等级/品类随意混；
//   单品类单独下单：屏 10 / 电池 20 / 小件 20 / 工具 5；
//   不再写「试单 5 件」；运费另计。
// 只改「声称我方政策」的句子；描述别家供应商或市场行情的一律不动。
const RULES = [
  [13,  'no single-model MOQ (mix models and categories to reach the 10-piece order minimum), and lightning-fast delivery',
        'no single-model MOQ (battery-only orders from 20 pieces, or 10 pieces in total in a mixed order that includes screens), and lightning-fast delivery'],
  [71,  'Typical MOQ is **10–50 units**, and PRSPARES supports a low 10-unit entry so smaller shops can buy factory-direct and run a quality test before scaling to the 50+ or 200+ tiers.',
        'Typical MOQ is **10–50 units**. PRSPARES starts battery-only orders at 20 units with models mixed freely, and a mixed order that includes screens at 10 units in total, so smaller shops can buy factory-direct and run a quality test before scaling to the 50+ or 200+ tiers.'],
  [81,  'Volume pricing starts at 5 units.',
        'Volume pricing starts at 10 units, models mixed freely.'],
  [109, '— trial orders start at 5 pieces (same published 10+ tier unit price, freight billed separately), and the 10-piece order minimum can be reached by mixing models and categories.',
        '— a mixed order that includes screens qualifies at 10 pieces in total at the published 10+ tier unit price (freight billed separately).'],
  [115, 'We apply no single-model MOQ (mix models and categories to reach 10 pieces), stock multiple quality grades, and accept trial orders from 5 pieces so you can test before committing.',
        'We apply no single-model MOQ (a mixed order that includes screens qualifies at 10 pieces; battery-only or small-parts-only orders start at 20), stock multiple quality grades, and quote your model list within 24 hours so you can test before committing.'],
  [129, "The minimum is $100 total order value. There's no per-SKU minimum — you can order as few as 5 units of any single part. This means a $200 order could include 10 different part types across 3 categories without any MOQ issue.",
        "PRSPARES sets minimums in pieces, not dollars, and there is no per-SKU minimum. A battery-only or small-parts-only order starts at 20 pieces in total, and a mixed order that includes screens qualifies at 10 pieces in total — so a 20-piece order could include 10 different part types across 3 categories without any MOQ issue."],
  [129, 'Most Shenzhen suppliers, including PRSPARES, set minimums at $100–$300 for mixed orders. If your total is below the threshold, increase quantities on your fastest-moving battery models first',
        'Most Shenzhen suppliers set minimums at $100–$300 for mixed orders; PRSPARES counts pieces instead — 20 pieces for a battery and small-parts order, or 10 pieces if the order also includes screens. If your total is below the threshold, increase quantities on your fastest-moving battery models first'],
  [129, 'We apply no single-model MOQ — mix models and categories, and the published 10+ tier price applies once the order totals 10 pieces — for repair shops and small distributors worldwide.',
        'We apply no single-model MOQ — battery-only or small-parts-only orders start at 20 pieces, a mixed order that includes screens qualifies at 10 pieces, and the published 10+ tier price applies to every line — for repair shops and small distributors worldwide.'],
  [156, '— trial orders start at 5 pieces (same published 10+ tier unit price, freight billed separately) and we ship samples within 48 hours.',
        '— a mixed order that includes screens qualifies at 10 pieces in total at the published 10+ tier unit price (freight billed separately), and we dispatch within 48 hours.'],
  [156, 'PRSPARES applies no single-model minimum order quantity — you can mix models and categories, and the published 10+ tier price applies once the order totals 10 pieces.',
        'PRSPARES applies no single-model minimum order quantity — a mixed order that includes screens qualifies once it totals 10 pieces across models, grades and categories, and the published 10+ tier price applies to every line. Ordered on their own, screens start at 10 pieces, batteries and small parts at 20, repair tools at 5.'],
  [156, 'You can mix categories and models freely, and once the order reaches **10 pieces in total**, the published 10+ tier price applies to every line on it.',
        'A mixed order that includes screens qualifies once it reaches **10 pieces in total**, models and categories mixed freely, and the published 10+ tier price applies to every line on it. Ordered on their own, screens start at 10 pieces, batteries and small parts at 20, repair tools at 5.'],
  [161, 'There is no single-model MOQ: mix models and categories, and the published 10+ tier price applies once the order totals 10 units — so you can stock exactly what your shop needs.',
        'There is no single-model MOQ: battery-only orders start at 20 units with models mixed freely, a mixed order that includes screens qualifies at 10 units in total, and the published 10+ tier price applies to every line — so you can stock exactly what your shop needs.'],
  [166, ', and battery line items count toward the same 10-piece order minimum — there is no separate battery MOQ.',
        ': in a mixed order that includes screens, battery lines count toward the 10-piece total, while battery-only orders start at 20 pieces with models mixed freely.'],
  [168, 'with no single-model MOQ — mix models and categories to reach the 10-piece order minimum, and trial orders from 5 pieces for first-time buyers.',
        'with no single-model MOQ — a mixed order that includes screens qualifies at 10 pieces in total, and battery-only or small-parts-only orders start at 20 pieces.'],
  [169, 'Small parts count toward the same 10-piece order minimum as screens and batteries — there is no separate small-parts MOQ.',
        'In a mixed order that includes screens, small parts count toward the 10-piece total; small-parts-only orders start at 20 pieces with models mixed freely.'],
  [167, 'with no single-model MOQ — individual models count toward the same 10-piece order minimum.',
        'with no single-model MOQ — in a mixed order that includes screens, individual models count toward the 10-piece total; battery-only or small-parts-only orders start at 20 pieces.'],
  [188, 'once a mixed order of any models and categories totals 10 pieces.',
        'once a mixed order that includes screens totals 10 pieces.'],
  [189, 'with trial orders from 5 pieces at the published 10+ tier price (freight billed separately).',
        'at the published 10+ tier price — from 20 pieces on their own, or 10 pieces in total in a mixed order that includes screens (freight billed separately).'],
  [189, 'at the published 10+ tier price, with trial orders accepted from 5 pieces. Stop the callback before it starts.',
        'at the published 10+ tier price — from 20 pieces on their own, or 10 pieces in total in a mixed order that includes screens. Stop the callback before it starts.'],
  [191, 'We ship to UK repair shops with trial orders accepted from 5 pieces (same published 10+ tier unit price, freight billed separately); regular orders reach the 10-piece minimum by mixing models and categories.',
        'We ship to UK repair shops at the published 10+ tier unit price (freight billed separately): a mixed order that includes screens qualifies at 10 pieces in total, while charging-port-only or other small-parts-only orders start at 20 pieces.'],
  [201, '(for PRSPARES and many Shenzhen direct: **10 pieces per model, models can be mixed freely**)',
        '(for PRSPARES: **no per-model minimum — 10 pieces in total for a mixed order that includes screens, 20 for batteries or small parts on their own**)'],
];

const ids=[...new Set(RULES.map(r=>r[0]))];
const {data:posts,error}=await sb.from('posts').select('id,slug,content,meta').in('id',ids);
if(error){console.error(error);process.exit(1);}
const byId=Object.fromEntries(posts.map(p=>[p.id,p]));
const BK='Analytics/_backups_moq-wording-pre-2026-09-10.json';
if(APPLY){ if(fs.existsSync(BK)) console.log('= 备份已存在，不覆盖：'+BK); else { fs.writeFileSync(BK, JSON.stringify(posts,null,2)); console.log('✓ 备份 '+BK); } }

const edited={}; let fail=0;
for(const [id,oldS,newS] of RULES){
  const p=byId[id]; if(!p){console.log(`✗ id${id} 不存在`); fail++; continue;}
  const cur=edited[id]!==undefined?edited[id]:(p.content||'');
  if(cur.includes(newS)){ console.log(`= id${id} 已是新口径，跳过`); continue; }
  const n=cur.split(oldS).length-1;
  if(n!==1){ console.log(`✗ id${id} 命中 ${n} 次（期望 1）: "${oldS.slice(0,70)}…"`); fail++; continue; }
  edited[id]=cur.replace(oldS,newS);
  console.log(`✓ id${id} ${p.slug.slice(0,48)}`);
}
if(fail){ console.log(`\n❌ ${fail} 条规则未通过校验，未写入任何改动`); process.exit(1); }
if(!APPLY){ console.log(`\n(预演模式：${Object.keys(edited).length} 篇待改。加 --apply 写入)`); process.exit(0); }
for(const [id,content] of Object.entries(edited)){
  const wc=content.replace(/!\[[^\]]*\]\([^)]*\)/g,' ').replace(/[#*`>|\-]/g,' ').split(/\s+/).filter(Boolean).length;
  const meta={...(byId[id].meta||{})}; meta.seo={...(meta.seo||{}), wordCount:wc};
  const {error:e}=await sb.from('posts').update({content,meta,updated_at:new Date().toISOString()}).eq('id',Number(id));
  if(e){console.error('id'+id,e);process.exit(1);}
}
console.log(`\n✓ 已更新 ${Object.keys(edited).length} 篇文章`);
