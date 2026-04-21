import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});
const { data } = await c.from('posts').select('slug,content').eq('slug', 'iphone-13-screen-replacement').maybeSingle();
const txt = data.content;

// Find ALL lines starting with # to understand structure
console.log('All heading lines:');
const lines = txt.split('\n');
lines.forEach((l, i) => {
  const m = l.match(/^(#+)\s+(.+)/);
  if (m) console.log(`  L${i} [${m[1].length}]`, m[2].slice(0,80));
});
