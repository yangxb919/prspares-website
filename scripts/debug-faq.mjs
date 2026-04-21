import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { extractFAQs, buildFaqSchema } from '../src/lib/extract-faqs.ts';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const { data } = await c.from('posts').select('slug,content').eq('slug', 'iphone-13-screen-replacement').maybeSingle();
console.log('content length:', data.content?.length);
const faqs = extractFAQs(data.content);
console.log('FAQs found:', faqs.length);
faqs.forEach((f, i) => console.log(`  Q${i+1}: ${f.q.slice(0,60)}`));
if (faqs.length) {
  const schema = buildFaqSchema(faqs);
  console.log('\nSchema preview:', JSON.stringify(schema, null, 2).slice(0, 800));
}
