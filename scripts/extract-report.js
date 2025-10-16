// Extract and sanitize full report body (exclude footer) for Phone Repair Parts Buying Guide
// - Removes <script>, <style>, <footer> and common footer classes
// - Strips inline styles and inline event handlers (on*)
// - Rewrites image src to /images/news/<filename>
// - Writes sanitized HTML to src/app/news/phone-repair-parts-buying-guide/sanitized.html

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const summaryDir = path.join(ROOT, 'summary');

function findSourceHtml() {
  const files = fs.readdirSync(summaryDir).filter(f => f.toLowerCase().endsWith('.html'));
  if (files.length === 0) throw new Error('No .html found in /summary');
  // Use the only HTML or the one likely to be the buying guide
  // Fallback to the first one
  return path.join(summaryDir, files[0]);
}

function stripBlacklistedSections(html) {
  // Remove <script>...</script> and <style>...</style>
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Remove <footer ...>...</footer>
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Remove common footer containers by class/id
  const footerSelectors = [
    /<div[^>]*(class|id)=["'](?:[^"']*\bfooter\b[^"']*)["'][\s\S]*?<\/div>/gi,
    /<nav[^>]*role=["']contentinfo["'][\s\S]*?<\/nav>/gi,
  ];
  footerSelectors.forEach(re => {
    html = html.replace(re, '');
  });
  return html;
}

function stripInline(html) {
  // Remove inline style attributes
  html = html.replace(/\sstyle=\"[^\"]*\"/gi, '');
  html = html.replace(/\sstyle='[^']*'/gi, '');
  // Remove inline on* event handlers
  html = html.replace(/\son[a-z]+=\"[^\"]*\"/gi, '');
  html = html.replace(/\son[a-z]+='[^']*'/gi, '');
  return html;
}

function rewriteImages(html) {
  // Replace src paths pointing to ./images or summary/images to /images/news
  html = html.replace(/src=\"(?:\.\/)?images\/([^\"]+)\"/gi, 'src="/images/news/$1"');
  html = html.replace(/src=\"summary\/images\/([^\"]+)\"/gi, 'src="/images/news/$1"');
  html = html.replace(/src='(?:\.\/)?images\/([^']+)'/gi, "src='/images/news/$1'");
  html = html.replace(/src='summary\/images\/([^']+)'/gi, "src='/images/news/$1'");
  return html;
}

function extractBody(html) {
  // Get content inside <body> to avoid duplicating head/nav; keep full body minus footers
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

function sanitize(html) {
  let s = extractBody(html);
  s = stripBlacklistedSections(s);
  s = stripInline(s);
  s = rewriteImages(s);
  return s.trim();
}

function main() {
  const src = findSourceHtml();
  const raw = fs.readFileSync(src, 'utf8');
  const sanitized = sanitize(raw);
  const outDir = path.join(ROOT, 'src', 'app', 'news', 'phone-repair-parts-buying-guide');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sanitized.html');
  fs.writeFileSync(outPath, sanitized, 'utf8');
  console.log(`Wrote sanitized content: ${path.relative(ROOT, outPath)}`);
  console.log(`Source: ${path.relative(ROOT, src)}`);
  // Simple counts
  const h2 = (sanitized.match(/<h2\b/gi) || []).length;
  const tables = (sanitized.match(/<table\b/gi) || []).length;
  const imgs = (sanitized.match(/<img\b/gi) || []).length;
  console.log(`Counts => h2: ${h2}, tables: ${tables}, images: ${imgs}`);
}

if (require.main === module) {
  main();
}

