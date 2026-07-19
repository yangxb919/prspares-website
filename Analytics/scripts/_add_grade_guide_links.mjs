// 2026-07-19 W2 遗留批量改造：所有含等级对比表的博客，在第一个等级对比表表尾
// 插入 grade-guide 内链行。幂等（已含链接的跳过）；先备份后写。
// 用法：node Analytics/scripts/_add_grade_guide_links.mjs [--dry]
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const DRY = process.argv.includes('--dry');
const LINK_LINE =
  '*See the full four-grade comparison with live wholesale prices: [iPhone Screen Grade Guide](/products/screens-grade-guide)*';

const env = {};
for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);

// 等级对比表判定：一个 markdown 表格 block 内含 ≥2 个不同等级词（其中至少 1 个
// aftermarket 档），与筛选脚本口径一致。
const norm = (w) => w.toLowerCase().replace(/-/g, '');
function firstGradeTableEnd(content) {
  const lines = content.split('\n');
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('|')) {
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith('|')) j++;
      const block = lines.slice(i, j).join('\n');
      const found = new Set();
      for (const g of ['Soft OLED', 'soft OLED', 'Hard OLED', 'hard OLED', 'Incell', 'incell', 'In-Cell', 'in-cell']) {
        if (block.includes(g)) found.add(norm(g));
      }
      if (/original/i.test(block)) found.add('original');
      const aftermarket = [...found].filter((x) => x !== 'original');
      if (found.size >= 2 && aftermarket.length >= 1) return j; // 表结束行号（不含）
      i = j;
    } else i++;
  }
  return -1;
}

const { data, error } = await sb.from('posts').select('id,slug,title,content,status,meta').eq('status', 'publish');
if (error) { console.error(error); process.exit(1); }

const targets = [];
for (const p of data) {
  const c = p.content || '';
  if (c.includes('/products/screens-grade-guide')) continue; // 幂等
  const end = firstGradeTableEnd(c);
  if (end < 0) continue;
  const lines = c.split('\n');
  lines.splice(end, 0, '', LINK_LINE); // 表尾空行 + 链接行
  targets.push({ id: p.id, slug: p.slug, meta: p.meta, old: c, next: lines.join('\n') });
}
console.log(`待改 ${targets.length} 篇${DRY ? '（dry-run，不写）' : ''}`);

if (!DRY && targets.length) {
  fs.writeFileSync(
    'Analytics/_backups_grade-guide-links-2026-07-19.json',
    JSON.stringify(targets.map(({ id, slug, old }) => ({ id, slug, content: old })))
  );
  console.log('备份已写 Analytics/_backups_grade-guide-links-2026-07-19.json');
  let ok = 0;
  for (const t of targets) {
    const wc = t.next.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[#*`>|\-]/g, ' ').split(/\s+/).filter(Boolean).length;
    const meta = t.meta || {}; meta.seo = meta.seo || {}; meta.seo.wordCount = wc;
    const { error: e } = await sb.from('posts')
      .update({ content: t.next, meta, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    if (e) { console.error(`id=${t.id} FAILED`, e.message); continue; }
    ok++;
  }
  console.log(`写入完成 ${ok}/${targets.length}`);
} else {
  for (const t of targets) console.log(`  id=${t.id} ${t.slug}`);
}
