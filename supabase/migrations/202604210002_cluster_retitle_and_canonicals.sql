-- PRSPARES Blog SEO P3: cluster cannibalization mitigation
--
-- Source of decisions: src/lib/blog-content-decisions.ts
-- Scope: 3 high-risk clusters (iPhone 15 screen, Wholesale iPhone screens, OLED/LCD/Incell).
--
-- What this migration does:
--   (A) RETITLE (posts.title + meta.seo.title) — disambiguate supporting-page
--       SERP snippets from the cluster pillar. H1 on the page is posts.title.
--   (B) FIX meta.seo.description — replace placeholder/body-leaked descriptions
--       with clean 140-170 char descriptions aligned to each supporting page's
--       distinct angle.
--   (C) CANONICAL-TO-PILLAR — set meta.canonical to the pillar URL on the main
--       domain for cannibalization-risk pages. Also fixes the residual
--       `prspares.com` canonicals left behind after 202602230004.
--
-- This migration is idempotent (uses jsonb_set on a coalesced object) but
-- changes are *content* changes — coordinate with the content/SEO team before
-- running on production.

-- ────────────────────────────────────────────────────────────────────────
-- (A) Retitles: posts.title  +  meta.seo.title
-- ────────────────────────────────────────────────────────────────────────

-- Cluster 1 — iPhone 15 screen

update posts
set title = 'iPhone 15 Screen Grade Guide: Incell, Hard OLED and Soft OLED Compared for Repair Shops',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('iPhone 15 Screen Grade Guide: Incell vs OLED Picks'::text), true)
where slug = 'iphone-15-screen-grade-repair-shops';

update posts
set title = 'iPhone 15 Repair Shop Pricing: How to Charge £80–£379 by Screen Grade (2026)',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('iPhone 15 Repair Shop Pricing 2026: Grade by Grade'::text), true)
where slug = 'iphone-15-screen-replacement-cost-repair-shops';

-- Cluster 2 — Wholesale iPhone screens

update posts
set title = 'iPhone Screen Wholesale for Repair Shops: Grade Picks and 90-Day Stock Plan',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('iPhone Screen Wholesale: Grade Picks & 90-Day Plan'::text), true)
where slug = 'iphone-screen-replacement-wholesale-repair-business';

update posts
set title = 'iPhone Screen Wholesale Pricing: Grade Differences and Ordering Logic',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('iPhone Screen Wholesale Pricing: Grade & Ordering'::text), true)
where slug = 'wholesale-iphone-screens-pricing-guide';

update posts
set title = 'Wholesale iPhone Screens Inventory: How to Avoid Overstocking Slow Models',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('Wholesale iPhone Screen Inventory: Avoid Overstock'::text), true)
where slug = 'wholesale-iphone-screens-avoid-overstocking';

update posts
set title = 'Wholesale iPhone Screens MOQ and Order Strategy: How Buyers Compare Grades',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('Wholesale iPhone Screens MOQ & Order Strategy'::text), true)
where slug = 'wholesale-iphone-screens-grades-prices-moq';

update posts
set title = 'Soft OLED vs Hard OLED vs Incell for Wholesale iPhone Screens: A Bulk Buyer''s Grade Guide',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('Soft OLED vs Hard OLED vs Incell: Wholesale Buyer Guide'::text), true)
where slug = 'iphone-screens-wholesale-oled-incell-comparison';

update posts
set title = 'Cell Phone Screens Wholesale 2026: Brand Priorities and Stock Plan for Repair Shops',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('Cell Phone Screens Wholesale 2026: Stock Plan'::text), true)
where slug = 'cell-phone-screens-wholesale-repair-shops-2026';

-- Cluster 3 — OLED / LCD / Incell

update posts
set title = 'Incell vs OLED Cost & Margin Analysis: 18,000-Install Data for Repair Shops (2026)',
    meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
             to_jsonb('Incell vs OLED Cost Analysis: 18,000-Install Margin Data'::text), true)
where slug = 'incell-soft-oled-hard-oled-cost-comparison-repair-shops';

-- ────────────────────────────────────────────────────────────────────────
-- (B) Fix broken meta.seo.description (body text leaked into description)
-- ────────────────────────────────────────────────────────────────────────

update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{seo,description}',
  to_jsonb(
    'iPhone 15 screen replacement cost and quality grades explained for repair shops. Real wholesale prices, margin traps, and why the cheapest screen often costs you the most.'::text
  ),
  true
)
where slug = 'iphone-15-screen-replacement-cost-quality';

update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{seo,description}',
  to_jsonb(
    'How mobile phone screens are made: the full LCD and OLED production process, from glass substrate through encapsulation, for repair technicians and sourcing buyers.'::text
  ),
  true
)
where slug = 'how-phone-screens-are-made-lcd-oled';

update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{seo,description}',
  to_jsonb(
    'Cell phone screen replacement wholesale guide: OEM vs aftermarket quality tiers, supplier verification, and the testing protocols that keep defect rates under 1%.'::text
  ),
  true
)
where slug = 'phone-screen-wholesale-oem-vs-aftermarket';

-- Also fix the mangled meta.seo.title on phone-screen-wholesale-oem-vs-aftermarket
-- (currently starts with "screens - " which is clearly auto-generated junk).
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{seo,title}',
  to_jsonb('Cell Phone Screen Wholesale: OEM vs Aftermarket Insider Guide'::text),
  true
)
where slug = 'phone-screen-wholesale-oem-vs-aftermarket';

-- ────────────────────────────────────────────────────────────────────────
-- (C) Canonical-to-pillar for cannibalization-risk pages
--     Also fixes residual `prspares.com` canonicals (mixed-domain leftovers
--     that slipped past migration 202602230004).
-- ────────────────────────────────────────────────────────────────────────

-- iPhone 15 screen cluster: cost-quality → pillar
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb('https://www.phonerepairspares.com/blog/iphone-15-screen-replacement'::text),
  true
)
where slug = 'iphone-15-screen-replacement-cost-quality';

-- OLED/LCD cluster: two legacy generic articles → pillar
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb('https://www.phonerepairspares.com/blog/lcd-vs-oled-hard-soft-oled-repair-shops'::text),
  true
)
where slug = 'whats-the-real-difference-between-oled-and-lcd-phone-screens';

update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb('https://www.phonerepairspares.com/blog/lcd-vs-oled-hard-soft-oled-repair-shops'::text),
  true
)
where slug = 'oled-vs-lcd-comparison-guide';

-- `how-phone-screens-are-made-lcd-oled` is distinct intent (manufacturing) — give
-- it a clean self-canonical so Google stops inferring a wrong one.
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb('https://www.phonerepairspares.com/blog/how-phone-screens-are-made-lcd-oled'::text),
  true
)
where slug = 'how-phone-screens-are-made-lcd-oled';
