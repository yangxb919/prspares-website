-- RFQ content attribution (2026-06-23)
--
-- Why: contact_submissions only stored page_url (the form page, almost always
-- /wholesale-inquiry or an LP), so an inquiry could never be traced back to the
-- blog post / landing page that actually drove it. Without this, "which content
-- brings inquiries" is unanswerable and the content strategy can't be judged.
--
-- The app captures first-touch attribution client-side (landing page, referrer,
-- utm_*, gclid) into a first-party cookie and sends it with the RFQ. This column
-- stores that JSON. Additive + nullable + IF NOT EXISTS — safe to run anytime,
-- no backfill, no impact on existing rows.
--
-- NOTE: must be applied BEFORE (or together with) the API code that writes the
-- `attribution` field. The API is defensive (retries the insert without
-- attribution if the column is missing), so a lagging migration never drops a
-- lead, but attribution data is only captured once this column exists.

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS attribution jsonb;

-- Optional: index for querying by first-touch landing path, e.g.
--   SELECT attribution->>'first_landing', count(*) ...
-- Kept as a btree on the extracted text to keep it cheap; uncomment if needed.
-- CREATE INDEX IF NOT EXISTS idx_contact_submissions_first_landing
--   ON contact_submissions ((attribution->>'first_landing'));
