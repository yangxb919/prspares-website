const fs = require('fs');
const path = require('path');

const p = path.join(process.cwd(), 'src', 'app', 'news', 'phone-repair-parts-buying-guide', 'sanitized.en.html');
let html = fs.readFileSync(p, 'utf8');

// Load translation cache
const translationCachePath = path.join(process.cwd(), 'scripts', 'translation-cache.json');
let translationCache = {};
try {
  const cacheContent = fs.readFileSync(translationCachePath, 'utf8');
  translationCache = JSON.parse(cacheContent);
  console.log(`Loaded ${Object.keys(translationCache).length} translation mappings`);
} catch (error) {
  console.warn('Warning: Could not load translation cache, using basic replacements only');
}

// Apply comprehensive translation from cache
function applyTranslationCache(text) {
  let result = text;
  // Apply translations in order of longest to shortest to avoid partial matches
  const sortedEntries = Object.entries(translationCache)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [chinese, english] of sortedEntries) {
    result = result.replace(new RegExp(escapeRegExp(chinese), 'g'), english);
  }
  return result;
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Apply comprehensive translation to HTML content
html = applyTranslationCache(html);

// Fix common visible leftovers
html = html.replace(/报告生成时间\s*:/g, 'Report generated on:');
// Remove HTML comments entirely (not visible but keep clean)
html = html.replace(/<!--([\s\S]*?)-->/g, '');
// Remove Unicode replacement chars and stray placeholders like "�?"
html = html.replace(/�\??/g, '');
// Remove corrupted marker at start of some list/text fragments
html = html.replace(/<li>\s*�\??\s*/g, '<li>');
html = html.replace(/�\*?/g, '');
// Remove any leading non-alnum noise after <li>
html = html.replace(/<li>\s*[^A-Za-z0-9<]+/g, '<li>');
// Clean stray leading artifacts right after a closing tag marker
html = html.replace(/>\s*�\*?/g, '>');
// Replace Chinese year marker within headings like "2024年..."
html = html.replace(/(\b\d{4})年/g, '$1 ');
// Common leftover Chinese phrases in headings → English
html = html.replace(/市场增长驱动因素/g, 'Market Growth Drivers');
html = html.replace(/手机维修配件市场概述/g, 'Mobile Phone Repair Parts Market Overview');
html = html.replace(/指南内容结构预览/g, 'Guide Structure Overview');
html = html.replace(/为什么需要这份指南/g, 'Why You Need This Guide');
html = html.replace(/主要品牌市场洞察/g, 'Major Brand Market Insights');
html = html.replace(/指南使用价值/g, 'Practical Value of This Guide');
html = html.replace(/屏幕技术对比/g, 'Screen Technology Comparison');

// Clean up Chinese text specifically in citation titles
html = html.replace(/title="[^"]*[\u4e00-\u9fff][^"]*"/g, function(match) {
  // Extract the title content
  const titleContent = match.substring(7, match.length - 1);
  // Translate the title content
  const translatedContent = applyTranslationCache(titleContent);
  // If translation resulted in English (no Chinese characters), use it
  if (!/[\u4e00-\u9fff]/.test(translatedContent)) {
    return `title="${translatedContent}"`;
  }
  // Otherwise, remove the title attribute to avoid Chinese text
  return '';
});

// Remove any remaining Chinese characters in visible text (but keep in HTML attributes like URLs)
html = html.replace(/>([^<]*[\u4e00-\u9fff][^<]*)</g, function(match) {
  const content = match.substring(1, match.length - 1);
  const translatedContent = applyTranslationCache(content);
  return `>${translatedContent}<`;
});

fs.writeFileSync(p, html, 'utf8');
console.log('Postprocessed English HTML:', path.relative(process.cwd(), p));
