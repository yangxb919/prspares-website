import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const { data } = await c.from('posts').select('slug,title,excerpt,content,published_at').eq('status','publish').limit(200);

// Extract focus keywords from title (simple heuristic)
function keywordSet(title) {
  const stopwords = new Set(['the','a','an','is','are','for','of','on','in','and','or','to','with','by','from','how','why','what','which','when','where','can','your','my','our','does','do','this','that','these','those','worth','guide','complete','2026','2025','lesson','vs','vs.','real','all','no']);
  return new Set(
    title.toLowerCase().replace(/[^\w\s]/g,' ').split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w))
  );
}

function jaccardSim(a, b) {
  const inter = [...a].filter(x => b.has(x)).length;
  const uni = new Set([...a, ...b]).size;
  return uni ? inter / uni : 0;
}

// Compare every pair
const kws = data.map(p => ({...p, kw: keywordSet(p.title)}));
const pairs = [];
for (let i = 0; i < kws.length; i++) {
  for (let j = i+1; j < kws.length; j++) {
    const sim = jaccardSim(kws[i].kw, kws[j].kw);
    if (sim >= 0.55) {
      pairs.push({
        sim: sim.toFixed(2),
        a: {slug: kws[i].slug, title: kws[i].title, published: kws[i].published_at?.slice(0,10), wc: (kws[i].content||'').split(/\s+/).length},
        b: {slug: kws[j].slug, title: kws[j].title, published: kws[j].published_at?.slice(0,10), wc: (kws[j].content||'').split(/\s+/).length},
      });
    }
  }
}

pairs.sort((x,y) => parseFloat(y.sim) - parseFloat(x.sim));
console.log(`Found ${pairs.length} potential duplicate pairs (Jaccard >= 0.55):\n`);
pairs.forEach((p,i) => {
  console.log(`#${i+1} [sim=${p.sim}]`);
  console.log(`  A: [${p.a.published}] [${p.a.wc}w] ${p.a.slug}`);
  console.log(`     "${p.a.title}"`);
  console.log(`  B: [${p.b.published}] [${p.b.wc}w] ${p.b.slug}`);
  console.log(`     "${p.b.title}"`);
  console.log();
});

fs.writeFileSync('scripts/duplicate-pairs.json', JSON.stringify(pairs, null, 2));
console.log(`→ scripts/duplicate-pairs.json saved (${pairs.length} pairs)`);
