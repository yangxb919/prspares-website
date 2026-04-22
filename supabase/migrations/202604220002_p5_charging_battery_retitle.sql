-- PRSPARES Blog SEO P5: charging-port cluster + battery-buyer final sweep
--
-- Source of decisions: src/lib/blog-content-decisions.ts (Round P5)
-- Companion: src/lib/blog-301-candidates.ts (added slug-rename entry)
--
-- Scope:
--   (A) Charging-port cluster — retitle 3 supporting pages so they stop
--       sharing the "iPhone Charging Port Replacement:" prefix with the
--       two pillars (guide + cost).
--   (B) Battery-buyer sub-cluster — 1 remaining retitle to split intent
--       from the generic buyer pillar.
--
-- All updates are idempotent via jsonb_set.

-- ────────────────────────────────────────────────────────────────────────
-- (A) Charging-port cluster retitles
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'iPhone Charging Port Repair Guide: Fault Diagnosis, Repair Decisions, and Parts Quality',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('iPhone Charging Port Repair Guide: Faults & Parts Quality'::text), true)
where slug = 'iphone-charging-port-replacement-guide';

update posts set
  title = 'Wholesale Charging Port Assemblies: How Repair Shops Pick Bulk Orders',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('Wholesale Charging Ports: Bulk Order Quality Guide'::text), true)
where slug = 'how-to-choose-charging-ports-bulk-repair-orders';

update posts set
  title = 'Charging Port Flex Cables Wholesale: Defect Patterns and Buyer''s Quality Checklist',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('Charging Port Flex Cables Wholesale: Quality Checklist'::text), true)
where slug = 'how-choose-charging-port-flex-cables-bulk-repair-orders';

-- ────────────────────────────────────────────────────────────────────────
-- (B) Battery-buyer sub-cluster — final retitle
-- ────────────────────────────────────────────────────────────────────────

update posts set
  title = 'iPhone Battery Quality Red Flags: What Wholesale Buyers Must Inspect Before Ordering',
  meta  = jsonb_set(coalesce(meta, '{}'::jsonb), '{seo,title}',
    to_jsonb('iPhone Battery Quality Red Flags: Wholesale Buyer QC'::text), true)
where slug = 'common-iphone-battery-quality-problems-wholesale-buyers-check';
