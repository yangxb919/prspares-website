-- PRSPARES Blog SEO P1: normalize category case.
-- 7 posts were stored with meta.category = 'Industry Insights' (title case),
-- while the other 29 use 'industry-insights' (kebab case). The blog list filter
-- uses JSON containment equality, so the 7 posts are invisible on the
-- Industry Insights tab and on /blog/category/industry-insights.

update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{category}',
  to_jsonb('industry-insights'::text),
  true
)
where meta ->> 'category' = 'Industry Insights';

-- After this migration, only 5 canonical category slugs should exist:
--   repair-guides, parts-knowledge, sourcing-suppliers, business-tips, industry-insights
-- Plus a residual set of legacy posts with no category (pre-categorization era).
