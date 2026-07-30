import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
let all=[],from=0;
while(true){
  const {data,error}=await sb.from('posts').select('id,slug,title,content,status').range(from,from+199);
  if(error){console.error(error);process.exit(1);}
  all=all.concat(data); if(data.length<200) break; from+=200;
}
console.log(`总文章 ${all.length} 篇（status: ${[...new Set(all.map(p=>p.status))].join('/')})`);
const re=/[^.\n]*\b(MOQ|minimum order|minimum quantity|order minimum|per-model minimum|minimums?)\b[^.\n]*\./gi;
const hits=[];
for(const p of all){
  const c=p.content||''; const ms=c.match(re);
  if(ms) hits.push({id:p.id,slug:p.slug,status:p.status,n:ms.length,lines:[...new Set(ms.map(s=>s.trim()))]});
}
hits.sort((a,b)=>b.n-a.n);
console.log(`命中 MOQ 相关表述的文章：${hits.length} 篇，句子合计 ${hits.reduce((s,h)=>s+h.n,0)}\n`);
fs.writeFileSync('/tmp/moq_scan.json', JSON.stringify(hits,null,2));
for(const h of hits) console.log(`  id${String(h.id).padEnd(4)} ${String(h.n).padStart(2)}句 [${h.status}] ${h.slug}`);
