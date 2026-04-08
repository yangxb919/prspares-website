const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
try { require('@next/env').loadEnvConfig(path.resolve(__dirname, '..')); } catch (_) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE in env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

const AUTHOR_ID = 'bf93cce6-898f-4ca6-aa35-7d6f48ed6061';
const SITE_URL = 'https://www.phonerepairspares.com';
const BLOG_PATH = '/Users/yangxiaobo/Documents/Obsidian Prspares/PRSPARES Blog';

const CATEGORY_MAP = {
  'Market & Buyer Guide': 'industry-insights',
  'Repair Guide': 'repair-guides',
  'Quality & Comparison': 'parts-knowledge',
  'Pricing & MOQ': 'business-tips',
  'Supplier & Sourcing': 'sourcing-suppliers',
  'Repair Guide / Buyer Bridge': 'repair-guides',
};

const FILES = [
  'battery-complaints-after-replacement-repair-shops.md',
  'best-iphone-repair-roi-small-shops-2026.md',
  'charging-port-failures-after-replacement.md',
  'first-wholesale-order-templates-repair-shop.md',
  'small-repair-parts-quality-guide.md',
];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const frontmatterStr = match[1];
  const body = match[2];
  const meta = {};

  let currentKey = null;
  let currentValue = '';
  let inArray = false;

  for (const line of frontmatterStr.split('\n')) {
    if (inArray && /^\s*-\s/.test(line)) {
      currentValue.push(line.replace(/^\s*-\s*/, '').replace(/^["']|["']$/g, ''));
      continue;
    } else if (inArray) {
      meta[currentKey] = currentValue;
      inArray = false;
    }

    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();

      if (val.startsWith('[') && val.endsWith(']')) {
        meta[currentKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      } else if (val === '' || val === '[]') {
        currentValue = [];
        inArray = true;
      } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        meta[currentKey] = val.slice(1, -1);
      } else {
        meta[currentKey] = val;
      }
    }
  }
  if (inArray) meta[currentKey] = currentValue;

  return { meta, body };
}

function extractFirstImage(body) {
  const match = body.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  return match ? match[1] : null;
}

function buildPostData(meta, body) {
  const coverImage = extractFirstImage(body);
  const category = CATEGORY_MAP[meta.category] || meta.category || 'industry-insights';
  const seoTitle = meta.seo_title || meta.title + ' - PRSPARES';
  const slug = meta.slug;
  const primaryKw = meta.primary_keyword || '';
  const secondaryKws = meta.secondary_keywords || [];
  const metaDesc = meta.meta_description || '';
  const dateStr = meta.date || '2026-03-26';

  return {
    title: meta.title,
    slug: slug,
    content: body.trim(),
    excerpt: metaDesc,
    status: 'publish',
    author_id: AUTHOR_ID,
    published_at: new Date().toISOString(),
    created_at: new Date(dateStr + 'T00:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
    meta: {
      cover_image: coverImage,
      category: category,
      tags: secondaryKws,
      seo: {
        title: seoTitle,
        description: metaDesc,
        keywords: [primaryKw, ...secondaryKws].filter(Boolean),
      },
      open_graph: {
        url: `${SITE_URL}/blog/${slug}`,
        type: 'article',
        image: coverImage,
        title: seoTitle,
        description: metaDesc,
      },
      twitter: {
        card: 'summary_large_image',
        image: coverImage,
        title: seoTitle,
        description: metaDesc,
      },
      canonical: `${SITE_URL}/blog/${slug}`,
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: metaDesc,
        image: coverImage,
        author: {
          '@type': 'Organization',
          name: 'PRSPARES',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'PRSPARES - Phone Repair Spare Parts',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/PRSPARES1.png`,
          },
        },
        datePublished: dateStr,
        dateModified: '2026-03-26',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blog/${slug}`,
        },
      },
    },
  };
}

async function publishArticle(fileName) {
  const filePath = path.join(BLOG_PATH, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontmatter(content);
  const postData = buildPostData(meta, body);

  // Check if slug exists
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', postData.slug)
    .single();

  let result;
  let action;
  if (existing) {
    const { slug, ...updateData } = postData;
    result = await supabase
      .from('posts')
      .update(updateData)
      .eq('slug', postData.slug)
      .select('id, slug, title');
    action = 'UPDATED';
  } else {
    result = await supabase
      .from('posts')
      .insert([postData])
      .select('id, slug, title');
    action = 'INSERTED';
  }

  if (result.error) {
    console.error(`  ERROR: ${postData.slug} - ${result.error.message}`);
    return null;
  }

  const post = result.data[0];
  console.log(`  ${action}: ${post.title}`);
  console.log(`    ID: ${post.id}`);
  console.log(`    URL: ${SITE_URL}/blog/${post.slug}`);
  console.log(`    Category: ${postData.meta.category}`);
  return { ...post, action };
}

async function main() {
  console.log('\nPublishing 5 Blog Articles to PRSPARES Supabase\n');
  console.log('='.repeat(60));

  const results = [];
  for (const file of FILES) {
    console.log(`\nProcessing: ${file}`);
    const result = await publishArticle(file);
    if (result) results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nDone! ${results.length}/${FILES.length} articles published.\n`);

  console.log('Summary:');
  for (const r of results) {
    console.log(`  [${r.action}] ${r.id} - ${r.slug}`);
  }
}

main().catch(console.error);
