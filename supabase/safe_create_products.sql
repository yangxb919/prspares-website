-- Safe products table creation for Supabase
-- Run this in your Supabase SQL editor

DO $$
BEGIN
    -- Drop existing policies if they exist
    BEGIN
        DROP POLICY IF EXISTS "Public can view products" ON public.products;
    EXCEPTION WHEN OTHERS THEN
        -- Policy doesn't exist, ignore error
    END;

    BEGIN
        DROP POLICY IF EXISTS "Service role can insert products" ON public.products;
    EXCEPTION WHEN OTHERS THEN
        -- Policy doesn't exist, ignore error
    END;

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

    -- Create policies
    BEGIN
        CREATE POLICY "Public can view products" ON public.products
            FOR SELECT USING (true);
    EXCEPTION WHEN OTHERS THEN
        -- Policy already exists, ignore error
        RAISE NOTICE 'Policy "Public can view products" already exists';
    END;

    BEGIN
        CREATE POLICY "Service role can insert products" ON public.products
            FOR INSERT USING (auth.role() = 'service_role');
    EXCEPTION WHEN OTHERS THEN
        -- Policy already exists, ignore error
        RAISE NOTICE 'Policy "Service role can insert products" already exists';
    END;

    RAISE NOTICE 'Products table setup completed successfully';
END $$;

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;