-- Simple products table creation
-- Run this in your Supabase SQL editor

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Service role can insert products" ON public.products;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    url text,
    image text,
    price numeric,
    currency text DEFAULT 'USD',
    slug text,
    clicks integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS products_url_unique_idx ON public.products(url) WHERE url IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies (without IF NOT EXISTS)
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Service role can insert products" ON public.products
    FOR INSERT USING (auth.role() = 'service_role');

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;