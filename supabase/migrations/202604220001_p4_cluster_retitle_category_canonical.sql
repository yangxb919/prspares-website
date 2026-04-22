-- PRSPARES Blog SEO P4: second cluster batch + legacy category cleanup
--
-- Source of decisions: src/lib/blog-content-decisions.ts (Round P4)
-- Companion: src/lib/blog-301-candidates.ts
--
-- Scope:
--   (A) iPhone 11-14 per-model screen cluster — retitle + SEO desc cleanup
--   (B) Battery cluster — split 2 overlapping titles; retitle 2025 → 2026
--   (C) Legacy uncategorized articles — add category + canonical to pillar
--       (also fixes residual `prspares.com` canonicals)
--   (D) Finalize `Industry Insights` → `industry-insights` case normalization
--       (the 202604210001 migration was written in P2 but never executed;
--       rolled into this pass since we were cleaning categories anyway).
--
-- Idempotent via jsonb_set.

-- ────────────────────────────────────────────────────────────────────────
-- (A) iPhone 11-14 cluster — retitles + SEO desc fixes + missing canonical
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'iPhone 11 LCD Repair Margins: Why the ''Outdated'' Screen Is Your Most Profitable Fix',
  meta  = jsonb_set(
    jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}', to_jsonb('iPhone 11 LCD Repair Margins: Most Profitable Fix'::text), true),
    '{seo,description}',
    to_jsonb('iPhone 11 LCD screen replacement gives repair shops the highest per-hour margin of any iPhone repair. Wholesale pricing £8-£45, profit math, and why LCD beats OLED here.'::text), true)
where slug = 'iphone-11-screen-replacement';

update posts set
  title = 'iPhone 12 Install Pitfalls: Ceramic Shield Myth and the Flat-Edge Trap',
  meta  = jsonb_set(
    jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}', to_jsonb('iPhone 12 Install Pitfalls: Ceramic Shield & Flat-Edge Traps'::text), true),
    '{seo,description}',
    to_jsonb('iPhone 12 screen replacement is high risk for technicians. Ceramic Shield does not prevent cracks, and the flat edges make removal harder — see the traps and how to avoid them.'::text), true)
where slug = 'iphone-12-screen-replacement';

update posts set
  title = 'iPhone 14 Screen Install Warning: The Design Change That Breaks Screens',
  meta  = jsonb_set(
    jsonb_set(
      jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}', to_jsonb('iPhone 14 Screen Install Warning: Design Flaw Guide'::text), true),
      '{seo,description}',
      to_jsonb('iPhone 14 screen chassis changed in 2022 — and the new design breaks screens during routine installs. See what changed, why it matters, and how to avoid damaging the panel.'::text), true),
    '{canonical}',
    to_jsonb('https://www.phonerepairspares.com/blog/iphone-14-screen-replacement-design-fix'::text), true)
where slug = 'iphone-14-screen-replacement-design-fix';

update posts set
  title = 'iPhone 8 Screen Cross-Compatibility: One Screen Fits 8, SE 2020 and SE 2022',
  meta  = jsonb_set(
    jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}', to_jsonb('iPhone 8 Screen Cross-Compat: Fits 8 / SE 2020 / SE 2022'::text), true),
    '{seo,description}',
    to_jsonb('iPhone 8 screens also fit SE 2020 and SE 2022 — same dimensions, same connector. Skip the 3D Touch upsell and stock one screen for three models. Wholesale math inside.'::text), true)
where slug = 'iphone-8-screen-replacement';

update posts set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{seo,description}',
  to_jsonb('iPhone XR screen replacement parts cost £8-£45 wholesale. XR is the only modern iPhone where LCD is the correct spec — not a downgrade. Grade picks and the one test that catches bad screens.'::text),
  true)
where slug = 'iphone-xr-screen-replacement-cheapest-options-quality-comparison';

-- ────────────────────────────────────────────────────────────────────────
-- (B) Battery cluster — split two overlapping titles; retitle 2025 → 2026
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'iPhone Battery Quality: Matching Grades to Customer Types and Warranty Expectations',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('iPhone Battery Quality: Match Grade to Customer Type'::text), true)
where slug = 'iphone-battery-quality-repair-shops';

update posts set
  title = 'Wholesale iPhone Battery Grades: How Repair Shops Pick What to Order in Bulk',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('Wholesale iPhone Battery Grades: Bulk Order Picks'::text), true)
where slug = 'how-repair-shops-choose-iphone-battery-grades-wholesale-orders';

update posts set
  title = 'iPhone Battery Wholesale Sourcing Guide 2026: Factory Direct from Shenzhen',
  meta  = jsonb_set(
    jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}', to_jsonb('iPhone Battery Wholesale Sourcing 2026: Factory Direct'::text), true),
    '{seo,description}',
    to_jsonb('How to source iPhone batteries factory-direct from Shenzhen in 2026. MOQ, diagnostic IC chips, wholesale pricing tiers, international shipping, and supplier verification.'::text), true)
where slug = '2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen';

-- ────────────────────────────────────────────────────────────────────────
-- (C) Legacy uncategorized — add category + canonical
--     (Also fixes residual `prspares.com` canonicals on several rows.)
-- ────────────────────────────────────────────────────────────────────────

update posts set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('parts-knowledge'::text), true)
where slug in (
  'whats-the-real-difference-between-oled-and-lcd-phone-screens',
  'oled-vs-lcd-comparison-guide',
  'how-phone-screens-are-made-lcd-oled'
);

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('sourcing-suppliers'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/china-phone-parts-suppliers-quality-vs-cost'::text), true)
where slug = 'china-phone-parts-suppliers-quality-vs-cost';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('sourcing-suppliers'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/how-to-choose-phone-parts-supplier'::text), true)
where slug = 'why-risk-your-business-on-single-source-display-suppliers';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('parts-knowledge'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/oem-vs-aftermarket-phone-screens'::text), true)
where slug = 'how-do-you-choose-high-quality-screen-replacement-parts-for-your-phone';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('sourcing-suppliers'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/buying-iphone-batteries-bulk-repair-business'::text), true)
where slug = 'substandard-battery-sourcing-certified-repair-shops';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('parts-knowledge'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/phone-battery-replacement-safety-standards'::text), true)
where slug = 'phone-battery-replacement-safety-standards';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('repair-guides'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/back-glass-replacement-iphone-guide'::text), true)
where slug = 'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('repair-guides'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/iphone-14-screen-grade-repair-shops'::text), true)
where slug = 'which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business';

update posts set meta = jsonb_set(
  jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('industry-insights'::text), true),
  '{canonical}', to_jsonb('https://www.phonerepairspares.com/blog/mobile-repair-wholesale-growth-strategies'::text), true)
where slug = 'mobile-repair-wholesale-growth-strategies';

-- ────────────────────────────────────────────────────────────────────────
-- (D) Finalize `Industry Insights` → `industry-insights` case normalization
--     (Equivalent to migration 202604210001, rolled into this pass.)
-- ────────────────────────────────────────────────────────────────────────

update posts
set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{category}', to_jsonb('industry-insights'::text), true)
where meta ->> 'category' = 'Industry Insights';
