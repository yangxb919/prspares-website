import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env={};for(const l of fs.readFileSync('.env.local','utf8').split('\n')){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const sb=createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
const ids=process.argv.slice(2).map(Number);
const {data,error}=await sb.from('posts').select('id,slug,title,content,meta,updated_at').in('id',ids);
if(error){console.error(error);process.exit(1);}
const dir='/private/tmp/claude-501/-Users-yangxiaobo-Desktop-prspares-website/fbc00516-b271-4170-a711-53968b488f72/scratchpad/posts';
fs.mkdirSync(dir,{recursive:true});
for(const p of data){
  fs.writeFileSync(`${dir}/post${p.id}.md`, p.content||'');
  fs.writeFileSync(`${dir}/post${p.id}.json`, JSON.stringify(p));
  console.log(`id${p.id}  ${p.slug}  chars=${(p.content||'').length}  updated=${(p.updated_at||'').slice(0,10)}`);
}
