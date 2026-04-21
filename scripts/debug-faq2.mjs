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
const c2 = data.content;

// Find FAQ section manually
const faqIdx = c2.search(/^##?\s+(FAQ|Frequently)/im);
console.log('FAQ section starts at:', faqIdx);
if (faqIdx >= 0) console.log('Context:', c2.slice(faqIdx, faqIdx+300).replace(/\n/g,'\\n'));

// Try loading via tsx transpile
import('../src/lib/extract-faqs.ts').then(m => {
  const faqs = m.extractFAQs(c2);
  console.log('\nShared lib FAQs:', faqs.length);
  faqs.forEach((f,i) => console.log(' Q'+(i+1)+':', f.q.slice(0,70)));
}).catch(e => console.log('import err:', e.message));

// Inline the same algorithm
const faqHeaderRe = /^#{2,3}\s+(FAQ|F\.A\.Q\.|Frequently Asked Questions?|Common Questions|Q\s*&\s*A|Questions?\s+and\s+Answers?)\s*$/im;
const header = c2.match(faqHeaderRe);
console.log('\nHeader match:', header ? header[0] : 'NONE');
if (header) {
  const startIdx = c2.indexOf(header[0]) + header[0].length;
  const afterSection = c2.slice(startIdx);
  console.log('After section first 200:', afterSection.slice(0,200).replace(/\n/g,'\\n'));
  const nextH2Match = afterSection.match(/^#{1,2}\s+(?!.*(FAQ|Question))/m);
  console.log('Next H2 match:', nextH2Match ? nextH2Match[0] : 'NONE');
  const faqBlock = nextH2Match ? afterSection.slice(0, afterSection.indexOf(nextH2Match[0])) : afterSection;
  console.log('FAQ block length:', faqBlock.length);
  console.log('FAQ block first 500:', faqBlock.slice(0,500).replace(/\n/g,'\\n'));

  const qaRe = /(?:^|\n)#{3,4}\s+(.+?)\n+([\s\S]+?)(?=\n#{3,4}|\n#{1,2}\s|$)/gm;
  let m2;
  let count = 0;
  while ((m2 = qaRe.exec(faqBlock)) !== null) {
    count++;
    console.log('\nMatch', count, 'q:', m2[1].slice(0,60), '| a:', m2[2].trim().slice(0,60));
  }
  console.log('\nInline total Q&A:', count);
}
