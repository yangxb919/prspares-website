import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});
const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const { data } = await c.from('posts').select('slug,content').eq('status','publish').limit(200);

// Detect FAQ patterns in markdown content
// Pattern 1: "## FAQ" or "## Frequently Asked Questions" followed by H3 questions
// Pattern 2: "## Common Questions", "## Q&A"
// Pattern 3: bold questions "**Q: xxx**" "**A: xxx**"

function extractFAQs(content) {
  if (!content) return [];
  const faqs = [];

  // Strategy 1: Find FAQ H2 section
  const faqHeaderRe = /^#{2,3}\s+(FAQ|F\.A\.Q\.|Frequently Asked Questions?|Common Questions|Q\s*&\s*A|Questions?\s+and\s+Answers?)\s*$/im;
  const match = content.match(faqHeaderRe);
  if (match) {
    const startIdx = content.indexOf(match[0]) + match[0].length;
    // Find next H2 to delimit section
    const afterSection = content.slice(startIdx);
    const nextH2 = afterSection.search(/^#{1,2}\s+(?!.*(FAQ|Question))/m);
    const faqBlock = nextH2 > 0 ? afterSection.slice(0, nextH2) : afterSection;

    // Parse Q&A pairs - H3 question followed by paragraph answer
    const qaRe = /(?:^|\n)#{3,4}\s+(.+?)\n+([\s\S]+?)(?=\n#{3,4}|\n#{1,2}\s|$)/gm;
    let m;
    while ((m = qaRe.exec(faqBlock)) !== null) {
      const q = m[1].trim().replace(/^\d+\.\s*/, '').replace(/^[QA]\d*:?\s*/i, '');
      const a = m[2].trim()
        .replace(/^\*\*A:?\*\*\s*/i, '')
        .replace(/^[Aa]nswer:?\s*/, '')
        .replace(/\n{2,}/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 500);
      if (q && a && q.length > 5 && a.length > 20) {
        faqs.push({q, a});
      }
    }

    // Fallback: bold Q/A pattern "**Q: ...**" / "**A: ...**"
    if (faqs.length === 0) {
      const boldRe = /\*\*Q\d*:?\s*(.+?)\*\*\s*([\s\S]+?)(?=\*\*Q\d*:?|$)/g;
      while ((m = boldRe.exec(faqBlock)) !== null) {
        const q = m[1].trim();
        const a = m[2].trim()
          .replace(/^\*\*A:?\*\*\s*/i, '')
          .replace(/\n{2,}/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 500);
        if (q && a && a.length > 20) faqs.push({q, a});
      }
    }
  }

  return faqs;
}

const report = { total: data.length, hasFAQ: 0, samples: [] };
for (const p of data) {
  const faqs = extractFAQs(p.content);
  if (faqs.length >= 2) {
    report.hasFAQ++;
    if (report.samples.length < 10) {
      report.samples.push({slug: p.slug, count: faqs.length, first_q: faqs[0].q.slice(0,80)});
    }
  }
}

console.log(`=== FAQ 检测结果 ===`);
console.log(`Total posts: ${report.total}`);
console.log(`Posts with detectable FAQ (≥ 2 Q&A): ${report.hasFAQ}`);
console.log(`Sample ratio: ${(report.hasFAQ/report.total*100).toFixed(1)}%\n`);
console.log('样本：');
report.samples.forEach(s => console.log(`  [${s.count} Q&A] ${s.slug}`));
console.log(`  → ${report.samples[0]?.first_q}`);
