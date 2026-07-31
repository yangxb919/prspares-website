import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
const slugs=[
 'iphone-boot-loop-after-screen-replacement-causes',
 'samsung-s23-s24-screen-replacement-guide',
 'iphone-11-screen-replacement-worth-it-2026',
 'which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business',
 'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners',
 'iphone-display-ic-fault-diagnosis-real-time-method',
 'lcd-vs-oled-hard-soft-oled-repair-shops',
 'how-phone-screens-are-made-lcd-oled',
 'moq-sample-orders-lead-time-wholesale',
];
const {data,error}=await sb.from('posts').select('id,slug,title,content').in('slug',slugs);
if(error){console.error(error);process.exit(1);}
for(const s of slugs){
  const p=data.find(x=>x.slug===s);
  if(!p){console.log(`MISSING ${s}`);continue;}
  const c=p.content||'';
  const wa=(c.match(/wa\.me/g)||[]).length;
  const inq=(c.match(/wholesale-inquiry/g)||[]).length;
  const prod=(c.match(/\/products\//g)||[]).length;
  const grade=(c.match(/screens-grade-guide/g)||[]).length;
  const hub=(c.match(/moq-sample-orders-lead-time-wholesale/g)||[]).length;
  console.log(`id${String(p.id).padEnd(4)} wa.me=${wa} inquiry=${inq} products=${prod} gradeGuide=${grade} hub156=${hub}  ${s.slice(0,55)}`);
}
