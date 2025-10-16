-- Add slug column to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE public.products ADD COLUMN slug text;
        
        -- Create unique index on slug for upsert operations
        CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL;
        
        -- Create index on URL for upsert operations  
        CREATE UNIQUE INDEX IF NOT EXISTS products_url_unique_idx ON public.products(url) WHERE url IS NOT NULL;
        
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
    ELSE
        RAISE NOTICE 'Slug column already exists in products table';
    END IF;
END $$;
