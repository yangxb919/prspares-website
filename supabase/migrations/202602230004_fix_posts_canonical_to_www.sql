-- PRSPARES SEO P0: fix historical canonical/open_graph.url domain
-- Source: docs/SEO_P0_Execution_Plan_2026-02-23.md (Section 4)

-- 1) 修 posts.meta.canonical
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb(
    regexp_replace(
      coalesce(meta->>'canonical',''),
      '^https://(www\\.)?prspares\\.com',
      'https://www.phonerepairspares.com'
    )
  ),
  true
)
where coalesce(meta->>'canonical','') ~ '^https://(www\\.)?prspares\\.com';

-- 2) 修 posts.meta.open_graph.url
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{open_graph,url}',
  to_jsonb(
    regexp_replace(
      coalesce(meta#>>'{open_graph,url}',''),
      '^https://(www\\.)?prspares\\.com',
      'https://www.phonerepairspares.com'
    )
  ),
  true
)
where coalesce(meta#>>'{open_graph,url}','') ~ '^https://(www\\.)?prspares\\.com';
