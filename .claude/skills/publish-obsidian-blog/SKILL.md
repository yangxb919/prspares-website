---
name: publish-obsidian-blog
description: Publish blog articles from Obsidian vault (PRSPARES Blog) to the website's Supabase database. Reads markdown with Cloudinary image URLs, maps frontmatter to posts table schema, auto-generates SEO metadata, and publishes directly. Usage: /publish-obsidian-blog [article-slug-or-filename]
---

# Publish Obsidian Blog to PRSPARES Website

## Overview
This skill reads blog articles from the Obsidian vault at `/Users/yangxiaobo/Documents/Obsidian Prspares/PRSPARES Blog/`, parses frontmatter and content, maps fields to the Supabase `posts` table, and publishes them to the website.

## Usage
```
/publish-obsidian-blog <slug-or-filename>
/publish-obsidian-blog all          # publish all articles with status: with-images
/publish-obsidian-blog list         # list all available articles
```

## Workflow

### Step 1: Locate the Article

Search for the article across all category subdirectories:
- `Supplier & Sourcing/`
- `Market & Buyer Guide/`
- `Quality & Comparison/`
- `Pricing & MOQ/`
- `Repair Guide/`

The user can provide either:
- The slug (e.g., `how-to-choose-phone-parts-supplier`)
- The filename (e.g., `how-to-choose-phone-parts-supplier.md`)
- `all` to publish all articles with `status: with-images`
- `list` to show available articles

### Step 2: Parse the Obsidian Article

Read the markdown file and extract:

**Frontmatter fields:**
```yaml
title: "Article Title"
seo_title: "SEO optimized title"
meta_description: "Meta description for search engines"
slug: article-slug
category: "Category Name"
status: with-images | draft
primary_keyword: "main keyword"
secondary_keywords: ["kw1", "kw2"]
target_buyer: [buyer1, buyer2]
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
schema: article, faq
breadcrumb: "Blog > Category > Article"
```

**Content:**
- Full markdown body (everything after the frontmatter `---` block)
- Images are Cloudinary URLs in standard markdown format: `![alt](https://res.cloudinary.com/...)`

### Step 3: Extract Cover Image

The first image in the article content (usually `hero.jpg`) becomes the `cover_image`.

**Strategy:**
1. Use regex to find the first `![...](URL)` pattern in the content
2. Extract the URL as `cover_image`
3. This image is typically: `https://res.cloudinary.com/dv1cajx98/image/upload/v.../prspares-blog/{slug}/hero.jpg`

### Step 4: Map to Supabase Posts Schema

Transform Obsidian data to this structure:

```javascript
{
  title: frontmatter.title,
  slug: frontmatter.slug,
  content: markdownBody,  // Keep full content including images
  excerpt: frontmatter.meta_description,
  status: 'publish',
  author_id: 'bf93cce6-898f-4ca6-aa35-7d6f48ed6061',
  published_at: new Date().toISOString(),
  created_at: frontmatter.date_created ? new Date(frontmatter.date_created).toISOString() : new Date().toISOString(),
  updated_at: new Date().toISOString(),
  meta: {
    cover_image: extractedCoverImageURL,
    category: mapCategory(frontmatter.category),
    tags: frontmatter.secondary_keywords || [],
    seo: {
      title: frontmatter.seo_title || frontmatter.title + ' - PRSPARES',
      description: frontmatter.meta_description,
      keywords: [frontmatter.primary_keyword, ...(frontmatter.secondary_keywords || [])],
    },
    open_graph: {
      url: `https://www.phonerepairspares.com/blog/${frontmatter.slug}`,
      type: 'article',
      image: extractedCoverImageURL,
      title: frontmatter.seo_title || frontmatter.title,
      description: frontmatter.meta_description,
    },
    twitter: {
      card: 'summary_large_image',
      image: extractedCoverImageURL,
      title: frontmatter.seo_title || frontmatter.title,
      description: frontmatter.meta_description,
    },
    canonical: `https://www.phonerepairspares.com/blog/${frontmatter.slug}`,
    structured_data: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: frontmatter.title,
      description: frontmatter.meta_description,
      image: extractedCoverImageURL,
      author: {
        '@type': 'Organization',
        name: 'PRSPARES',
        url: 'https://www.phonerepairspares.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'PRSPARES - Phone Repair Spare Parts',
        url: 'https://www.phonerepairspares.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.phonerepairspares.com/PRSPARES1.png'
        }
      },
      datePublished: frontmatter.date_created,
      dateModified: frontmatter.date_updated || frontmatter.date_created,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.phonerepairspares.com/blog/${frontmatter.slug}`
      }
    }
  }
}
```

### Step 5: Category Mapping

Map Obsidian categories to website categories:

**IMPORTANT: Website categories MUST use kebab-case (lowercase with hyphens). Title Case will break category filtering.**

| Obsidian Category | Website Category (kebab-case) |
|---|---|
| Supplier & Sourcing | sourcing-suppliers |
| Market & Buyer Guide | industry-insights |
| Quality & Comparison | parts-knowledge |
| Pricing & MOQ | business-tips |
| Repair Guide | repair-guides |

### Step 6: Check for Existing Post

Before inserting, query Supabase to check if a post with the same slug already exists:
- If exists: **UPDATE** the existing post (upsert)
- If not exists: **INSERT** a new post

### Step 7: Execute the Publish

Use the Bash tool to run a Node.js script that:
1. Connects to Supabase using the service role key from `.env.local`
2. Upserts the post data
3. Reports success/failure

**Supabase Connection:**
```
URL: from .env.local (NEXT_PUBLIC_SUPABASE_URL) → https://eiikisplpnbeiscunkap.supabase.co
Service Role Key: from .env.local (SUPABASE_SERVICE_ROLE)
```

**Execute with:**
```bash
cd /Users/yangxiaobo/Desktop/prspares-website && node -e "
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

async function publish() {
  const postData = {POST_DATA_JSON};

  // Check if exists
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', postData.slug)
    .single();

  let result;
  if (existing) {
    // Update
    result = await supabase
      .from('posts')
      .update(postData)
      .eq('slug', postData.slug)
      .select();
    console.log('Updated:', postData.slug);
  } else {
    // Insert
    result = await supabase
      .from('posts')
      .insert([postData])
      .select();
    console.log('Inserted:', postData.slug);
  }

  if (result.error) {
    console.error('Error:', result.error);
    process.exit(1);
  }
  console.log('Success! Post ID:', result.data[0].id);
  console.log('URL: https://www.phonerepairspares.com/blog/' + postData.slug);
}

publish();
"
```

### Step 8: Update Obsidian Article Status

After each article is successfully published to Supabase, **immediately update the source markdown file** in the Obsidian vault:

1. **Change frontmatter status**: `status: with-images` → `status: published`
2. Use `sed` or the Edit tool to replace the status line in the original `.md` file

```bash
sed -i '' 's/^status: with-images$/status: published/' "/path/to/article.md"
```

3. **Update the Dashboard** (`_Dashboard.md`) after all articles in the batch are published:
   - Increment the `published` count
   - Decrement the `with-images` count
   - Update the progress line (e.g., "Week 1-11 全部已发布")

This ensures the Obsidian vault stays in sync with the website and prevents duplicate publishing.

### Step 9: Verify & Report

After publishing, report:
- Post title and slug
- Published URL
- Cover image URL
- Category
- Whether it was an insert or update
- Status update confirmation (with-images → published)
- Any errors encountered

## Important Notes

- **Images stay on Cloudinary** - no downloading or re-uploading needed
- **Cloudinary URLs are already whitelisted** in the website's image proxy
- **Only publish articles with `status: with-images`** in frontmatter (unless user explicitly requests draft articles)
- **Author ID**: `bf93cce6-898f-4ca6-aa35-7d6f48ed6061` (lijiedong08, admin role, from profiles table)
- **Always publish as `status: 'publish'`** per user preference
- **Content is kept as-is** - the website's MarkdownRenderer handles Cloudinary image URLs natively

## Obsidian Vault Path
```
/Users/yangxiaobo/Documents/Obsidian Prspares/PRSPARES Blog/
```

## Category Subdirectories
```
Supplier & Sourcing/
Market & Buyer Guide/
Quality & Comparison/
Pricing & MOQ/
Repair Guide/
```
