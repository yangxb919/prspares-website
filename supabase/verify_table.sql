-- Verify product tables exist and have correct structure

-- Check if tables exist
SELECT table_name, table_schema, table_type
FROM information_schema.tables
WHERE table_name in ('product_prices','products')
AND table_schema = 'public'
ORDER BY table_name;

-- Check product_prices columns
SELECT column_name, data_type, is_nullable, column_default, ordinal_position
FROM information_schema.columns
WHERE table_name = 'product_prices' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check products columns
SELECT column_name, data_type, is_nullable, column_default, ordinal_position
FROM information_schema.columns
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname in ('product_prices','products')
ORDER BY relname;

-- Check existing policies
SELECT policyname, permissive, cmd, roles
FROM pg_policies
WHERE tablename in ('product_prices','products')
ORDER BY tablename, policyname;

-- Try to insert a test record (you can run this manually)
-- INSERT INTO public.product_prices (title, created_at) VALUES ('test_record_' || now(), now());
-- SELECT * FROM public.product_prices WHERE title LIKE 'test_record_%';
-- DELETE FROM public.product_prices WHERE title LIKE 'test_record_%';
