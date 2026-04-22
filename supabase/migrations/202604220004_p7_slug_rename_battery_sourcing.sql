-- PRSPARES Blog SEO P7: slug-rename housekeeping
--
-- Source of decision: src/lib/blog-301-candidates.ts (P7)
-- Companion: next.config.js (added 301 from old slug to new slug)
--
-- Drop the year prefix from a published post slug. Title and content already
-- said "2026" since P4 (migration 202604220001) but slug was still year-stamped
-- "2025-…", which hurt freshness signals and looked dated in SERP.
--
-- The next.config.js redirect catches the old URL — both the slug and the
-- canonical update below must land before the redirect ships, otherwise the
-- redirect destination 404s.

update posts
set slug = 'iphone-battery-wholesale-sourcing-guide-shenzhen',
    meta = jsonb_set(
      coalesce(meta, '{}'::jsonb),
      '{canonical}',
      to_jsonb('https://www.phonerepairspares.com/blog/iphone-battery-wholesale-sourcing-guide-shenzhen'::text),
      true
    )
where slug = '2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen';
