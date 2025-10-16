// Translate sanitized report HTML from Chinese to English (best-effort) without changing structure.
// Source: src/app/news/phone-repair-parts-buying-guide/sanitized.html
// Output: src/app/news/phone-repair-parts-buying-guide/sanitized.en.html
// Uses libretranslate.com public API. If it rate-limits, run multiple times or switch to your own instance.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const inPath = path.join(ROOT, 'src', 'app', 'news', 'phone-repair-parts-buying-guide', 'sanitized.html');
const outPath = path.join(ROOT, 'src', 'app', 'news', 'phone-repair-parts-buying-guide', 'sanitized.en.html');

const CACHE_PATH = path.join(ROOT, 'scripts', 'translation-cache.json');
let CACHE = {};
if (fs.existsSync(CACHE_PATH)) {
  try { CACHE = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch {}
}

function saveCache() { fs.writeFileSync(CACHE_PATH, JSON.stringify(CACHE, null, 2)); }

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

function hasCJK(s){ return /[\u4e00-\u9fff]/.test(s); }

async function translate(text) {
  // Preserve trivial/ASCII-only content
  const trimmed = text.trim();
  if (!trimmed) return text;
  // Skip if contains no CJK
  if (!hasCJK(trimmed)) return text;
  if (CACHE[trimmed] && !hasCJK(CACHE[trimmed])) return CACHE[trimmed];
  // Keep bracketed citation markers as-is
  const pre = trimmed.replace(/\[[0-9]+\]/g, (m) => `__CITE__${m}__`);
  try {
    // Use MyMemory free API (rate limited). Add delay to be polite.
    await sleep(250);
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(pre) + '&langpair=zh-CN|en-US';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let out = (data?.responseData?.translatedText || pre);
    // Fallback to Google if still has CJK
    if (hasCJK(out)) {
      await sleep(250);
      const gurl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + encodeURIComponent(pre);
      const gres = await fetch(gurl);
      if (gres.ok) {
        const gjson = await gres.json();
        if (Array.isArray(gjson)) {
          out = gjson[0].map(seg => seg[0]).join('');
        }
      }
    }
    // Restore citation markers
    out = out.replace(/__CITE__\[([0-9]+)\]__/g, '[$1]');
    CACHE[trimmed] = out;
    return out;
  } catch (e) {
    console.warn('Translate error, passthrough:', e.message);
    return text;
  }
}

async function main() {
  if (!fs.existsSync(inPath)) throw new Error('sanitized.html not found. Run extract-report.js first.');
  let html = fs.readFileSync(inPath, 'utf8');

  // 1) Translate text nodes between tags: >TEXT<
  const nodeRegex = /(>)([^<>\n][^<>]*?)(<)/g;
  const nodeMatches = Array.from(html.matchAll(nodeRegex));
  for (const m of nodeMatches) {
    const original = m[2];
    const translated = await translate(original);
    if (translated !== original) {
      html = html.replace(m[0], m[1] + translated + m[3]);
    }
  }

  // 2) Translate alt attributes
  const altRegex = /(alt=\")(.*?)(\")/g;
  const alts = Array.from(html.matchAll(altRegex));
  for (const m of alts) {
    const original = m[2];
    const translated = await translate(original);
    if (translated !== original) {
      html = html.replace(m[0], `${m[1]}${translated}${m[3]}`);
    }
  }

  // 3) Translate anchor text specifically within <a>…</a>
  const aRegex = /(<a\b[^>]*>)([\s\S]*?)(<\/a>)/gi;
  const aMatches = Array.from(html.matchAll(aRegex));
  for (const m of aMatches) {
    // Avoid translating nested tags; only translate pure text content fragments
    const inner = m[2];
    const pieces = inner.split(/(<[^>]+>)/g);
    const outPieces = [];
    for (const p of pieces) {
      if (/^<[^>]+>$/.test(p)) {
        outPieces.push(p);
      } else {
        // Text fragment
        const t = await translate(p);
        outPieces.push(t);
      }
    }
    const replaced = m[1] + outPieces.join('') + m[3];
    html = html.replace(m[0], replaced);
  }

  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote translated file:', path.relative(ROOT, outPath));
  saveCache();
}

if (require.main === module) {
  // Node 18+ has fetch built-in
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
