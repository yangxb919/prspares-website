-- PRSPARES Blog SEO P6: Samsung screen + back-glass cluster sweep
--
-- Source of decisions: src/lib/blog-content-decisions.ts (Round P6)
--
-- Scope:
--   (A) Samsung — split A-series brand-comparison page from A-series stocking pillar.
--   (B) Back-glass — shorten ugly H1 on the iPhone 14 Pro Max worth-fixing
--       page (still canonical-pointed at pillar from P4 — H1 is for the
--       few users who land directly).
--
-- All updates idempotent via jsonb_set.

-- ────────────────────────────────────────────────────────────────────────
-- (A) Samsung — 1 retitle
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'Samsung vs iPhone Parts: Which Brand to Stock First as a Small Buyer',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('Samsung vs iPhone Parts: Which Brand to Stock First'::text), true)
where slug = 'samsung-a-series-vs-iphone-parts-stock-first';

-- ────────────────────────────────────────────────────────────────────────
-- (B) Back-glass — shorten H1 on the canonical-to-pillar variant
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'iPhone 14 Pro Max Back Glass Repair Cost: When It''s Worth Fixing for Repair Shops'
where slug = 'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners';
