-- Update products table to include currency column and other missing columns
DO $$
BEGIN
    -- Add currency column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'currency') THEN
        ALTER TABLE public.products ADD COLUMN currency text default 'USD';
        RAISE NOTICE 'Added currency column to products table';
    END IF;

    -- Add clicks column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'clicks') THEN
        ALTER TABLE public.products ADD COLUMN clicks integer default 0;
        RAISE NOTICE 'Added clicks column to products table';
    END IF;

    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE public.products ADD COLUMN slug text;

        -- Generate slugs for existing records that don't have them
        UPDATE public.products
        SET slug = lower(
            regexp_replace(
                regexp_replace(
                    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
                    '\s+', '-', 'g'
                ),
                '-+', '-', 'g'
            )
        )
        WHERE slug IS NULL AND title IS NOT NULL;

        RAISE NOTICE 'Added slug column to products table';
    END IF;

    -- Create unique index on slug for upsert operations
    IF NOT EXISTS (SELECT 1 FROM pg_indexes
                   WHERE tablename = 'products' AND indexname = 'products_slug_unique_idx') THEN
        CREATE UNIQUE INDEX products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL;
        RAISE NOTICE 'Created products_slug_unique_idx index';
    END IF;

    -- Create unique index on url for upsert operations
    IF NOT EXISTS (SELECT 1 FROM pg_indexes
                   WHERE tablename = 'products' AND indexname = 'products_url_unique_idx') THEN
        CREATE UNIQUE INDEX products_url_unique_idx ON public.products(url) WHERE url IS NOT NULL;
        RAISE NOTICE 'Created products_url_unique_idx index';
    END IF;
END $$;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;