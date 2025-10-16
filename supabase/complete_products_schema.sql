-- Complete products table schema update
-- This file contains all necessary columns for the import functionality

-- Add missing columns to products table
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

    -- Ensure url column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'url') THEN
        ALTER TABLE public.products ADD COLUMN url text;
        RAISE NOTICE 'Added url column to products table';
    END IF;

    -- Ensure image column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'image') THEN
        ALTER TABLE public.products ADD COLUMN image text;
        RAISE NOTICE 'Added image column to products table';
    END IF;

    -- Ensure price column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'products' AND column_name = 'price') THEN
        ALTER TABLE public.products ADD COLUMN price numeric;
        RAISE NOTICE 'Added price column to products table';
    END IF;
END $$;

-- Create unique indexes for upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS products_url_unique_idx ON public.products(url) WHERE url IS NOT NULL;

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;