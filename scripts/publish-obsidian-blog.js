const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
// Load env via Next's bundled loader (no dotenv dep needed)
try { require('@next/env').loadEnvConfig(path.resolve(__dirname, '..')); } catch (_) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE in env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

const AUTHOR_ID = 'bf93cce6-898f-4ca6-aa35-7d6f48ed6061';
const SITE_URL = 'https://www.phonerepairspares.com';
const VAULT_PATH = '/Users/yangxiaobo/Documents/Obsidian Prspares/PRSPARES Blog';

const CATEGORY_MAP = {
  'Supplier & Sourcing': 'sourcing-suppliers',
  'Market & Buyer Guide': 'industry-insights',
  'Quality & Comparison': 'parts-knowledge',
  'Pricing & MOQ': 'business-tips',
  'Repair Guide': 'repair-guides',
};

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
    // Array continuation
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

      // Inline array like ["a", "b"]
      if (val.startsWith('[') && val.endsWith(']')) {
        meta[currentKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      // Array start
      else if (val === '' || val === '[]') {
        currentValue = [];
        inArray = true;
      }
      // Quoted string
      else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        meta[currentKey] = val.slice(1, -1);
      }
      // Plain value
      else {
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
  const category = CATEGORY_MAP[meta.category] || meta.category || 'Industry Insights';
  const seoTitle = meta.seo_title || meta.title + ' - PRSPARES';
  const slug = meta.slug;
  const keywords = [meta.primary_keyword, ...(meta.secondary_keywords || [])].filter(Boolean);

  return {
    title: meta.title,
    slug: slug,
    content: body.trim(),
    excerpt: meta.meta_description || '',
    status: 'publish',
    author_id: AUTHOR_ID,
    published_at: new Date().toISOString(),
    created_at: meta.date_created ? new Date(meta.date_created + 'T00:00:00Z').toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta: {
      cover_image: coverImage,
      category: category,
      tags: meta.secondary_keywords || [],
      seo: {
        title: seoTitle,
        description: meta.meta_description || '',
        keywords: keywords,
      },
      open_graph: {
        url: `${SITE_URL}/blog/${slug}`,
        type: 'article',
        image: coverImage,
        title: seoTitle,
        description: meta.meta_description || '',
      },
      twitter: {
        card: 'summary_large_image',
        image: coverImage,
        title: seoTitle,
        description: meta.meta_description || '',
      },
      canonical: `${SITE_URL}/blog/${slug}`,
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: meta.meta_description || '',
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
        datePublished: meta.date_created || new Date().toISOString().split('T')[0],
        dateModified: meta.date_updated || meta.date_created || new Date().toISOString().split('T')[0],
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blog/${slug}`,
        },
      },
    },
  };
}

async function findAllArticles() {
  const categories = ['Supplier & Sourcing', 'Market & Buyer Guide', 'Quality & Comparison', 'Pricing & MOQ', 'Repair Guide'];
  const articles = [];

  for (const cat of categories) {
    const catPath = path.join(VAULT_PATH, cat);
    if (!fs.existsSync(catPath)) continue;
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    for (const file of files) {
      articles.push(path.join(catPath, file));
    }
  }
  return articles;
}

async function publishArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontmatter(content);

  // Only publish articles with status: with-images
  if (meta.status !== 'with-images') {
    console.log(`  SKIP: ${meta.slug || path.basename(filePath)} (status: ${meta.status})`);
    return null;
  }

  const postData = buildPostData(meta, body);

  // Check if exists
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', postData.slug)
    .single();

  let result;
  let action;
  if (existing) {
    // Update - don't overwrite id
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
  console.log(`    Cover: ${postData.meta.cover_image || 'none'}`);
  console.log(`    Category: ${postData.meta.category}`);
  return post;
}

async function main() {
  console.log('\n📝 Publishing Obsidian Blog Articles to PRSPARES\n');
  console.log('='.repeat(60));

  const articles = await findAllArticles();
  console.log(`\nFound ${articles.length} articles\n`);

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of articles) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);
    const result = await publishArticle(filePath);
    if (result) success++;
    else if (result === null) {
      // Could be skip or error - already logged
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Done! ${success} articles published successfully.\n`);
}

main().catch(console.error);
