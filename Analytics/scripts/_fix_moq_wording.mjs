import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
const APPLY = process.argv.includes('--apply');

// 统一口径（用户 2026-07-30 拍板）：跨品类可凑 10 件；试单 5 件起、单价仍按 10+ 档、运费另计
const RULES = [
  [13,  'low minimum orders, and lightning-fast delivery',
        'no single-model MOQ (mix models and categories to reach the 10-piece order minimum), and lightning-fast delivery'],
  [108, 'PRSPARES sets no fixed MOQ, so shops can start small and scale.',
        'PRSPARES applies no single-model MOQ — mix models and categories, and the published 10+ tier price applies once the order totals 10 pieces — so shops can start small and scale.'],
  [109, '— no minimum for sample orders, and pricing gets better at volume.',
        '— trial orders start at 5 pieces (same published 10+ tier unit price, freight billed separately), and the 10-piece order minimum can be reached by mixing models and categories.'],
  [115, 'with flexible MOQ for small shops',
        'with no single-model MOQ — mix models and categories to reach the 10-piece order minimum'],
  [115, 'We offer flexible MOQ, multiple quality grades, and sample orders so you can test before committing.',
        'We apply no single-model MOQ (mix models and categories to reach 10 pieces), stock multiple quality grades, and accept trial orders from 5 pieces so you can test before committing.'],
  [129, 'We specialize in low MOQ mixed orders for repair shops',
        'We apply no single-model MOQ — mix models and categories, and the published 10+ tier price applies once the order totals 10 pieces — for repair shops'],
  [142, 'no minimum contract, just better per-unit rates as quantity increases.',
        'no minimum contract and no single-model MOQ — mix models and categories to reach the 10-piece order minimum, then better per-unit rates as quantity increases.'],
  [156, "we'll match MOQ to your current business volume and ship samples within 48 hours.",
        'trial orders start at 5 pieces (same published 10+ tier unit price, freight billed separately) and we ship samples within 48 hours.'],
  [159, 'with MOQs starting at 10 units for mixed orders',
        'with no single-model MOQ — mix models and categories, and the published 10+ tier applies once the order totals 10 units'],
  [161, 'Minimum order starts at 10 units, and we support mixed-model orders so you can stock exactly what your shop needs.',
        'There is no single-model MOQ: mix models and categories, and the published 10+ tier price applies once the order totals 10 units — so you can stock exactly what your shop needs.'],
  [166, 'with no minimum on battery-only line items when combined with other parts.',
        'and battery line items count toward the same 10-piece order minimum — there is no separate battery MOQ.'],
  [167, 'with flexible MOQ on individual models when bundled with other parts.',
        'with no single-model MOQ — individual models count toward the same 10-piece order minimum.'],
  [168, 'with flexible minimums for first-time buyers.',
        'with no single-model MOQ — mix models and categories to reach the 10-piece order minimum, and trial orders from 5 pieces for first-time buyers.'],
  [169, 'We include small parts at no additional MOQ when combined with screen and battery orders from Shenzhen.',
        'Small parts count toward the same 10-piece order minimum as screens and batteries — there is no separate small-parts MOQ.'],
  [189, 'with bulk pricing starting at MOQ 5.',
        'with trial orders from 5 pieces at the published 10+ tier price (freight billed separately).'],
  [189, 'at bulk pricing starting at MOQ 5. Stop the callback before it starts.',
        'at the published 10+ tier price, with trial orders accepted from 5 pieces. Stop the callback before it starts.'],
  [191, 'We ship to UK repair shops with no minimum order requirement on first trial orders.',
        'We ship to UK repair shops with trial orders accepted from 5 pieces (same published 10+ tier unit price, freight billed separately); regular orders reach the 10-piece minimum by mixing models and categories.'],
];

const ids=[...new Set(RULES.map(r=>r[0]))];
const {data:posts,error}=await sb.from('posts').select('id,slug,content,meta').in('id',ids);
if(error){console.error(error);process.exit(1);}
const byId=Object.fromEntries(posts.map(p=>[p.id,p]));
if(APPLY){ fs.writeFileSync('Analytics/_backups_moq-wording-pre-2026-07-30.json', JSON.stringify(posts,null,2)); console.log('✓ 备份 Analytics/_backups_moq-wording-pre-2026-07-30.json'); }

const edited={}; let fail=0;
for(const [id,oldS,newS] of RULES){
  const p=byId[id]; if(!p){console.log(`✗ id${id} 不存在`); fail++; continue;}
  const cur=edited[id]!==undefined?edited[id]:(p.content||'');
  const n=cur.split(oldS).length-1;
  if(n!==1){ console.log(`✗ id${id} 命中 ${n} 次（期望 1）: "${oldS.slice(0,60)}…"`); fail++; continue; }
  edited[id]=cur.replace(oldS,newS);
  console.log(`✓ id${id} ${p.slug.slice(0,44)}`);
}
if(fail){ console.log(`\n❌ ${fail} 条规则未通过校验，未写入任何改动`); process.exit(1); }
if(!APPLY){ console.log('\n(预演模式。加 --apply 写入)'); process.exit(0); }
for(const [id,content] of Object.entries(edited)){
  const wc=content.replace(/!\[[^\]]*\]\([^)]*\)/g,' ').replace(/[#*`>|\-]/g,' ').split(/\s+/).filter(Boolean).length;
  const meta={...(byId[id].meta||{})}; meta.seo={...(meta.seo||{}), wordCount:wc};
  const {error:e}=await sb.from('posts').update({content,meta,updated_at:new Date().toISOString()}).eq('id',Number(id));
  if(e){console.error('id'+id,e);process.exit(1);}
}
console.log(`\n✓ 已更新 ${Object.keys(edited).length} 篇文章`);
