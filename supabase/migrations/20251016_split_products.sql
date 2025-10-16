-- Migration: Split legacy products table into product_prices and create formal products table
-- This migration is idempotent.

DO $$
DECLARE
    has_products BOOLEAN;
    has_title_col BOOLEAN;
    has_name_col BOOLEAN;
BEGIN
    -- Detect if a legacy simple products table exists (title-based) and not a formal products (name-based)
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'products'
    ) INTO has_products;

    IF has_products THEN
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'title'
        ) INTO has_title_col;

        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name'
        ) INTO has_name_col;

        -- If it's the simple CSV table (has title, not name), rename it to product_prices
        IF has_title_col AND NOT has_name_col THEN
            -- Rename table if product_prices not already present
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'product_prices'
            ) THEN
                EXECUTE 'ALTER TABLE IF EXISTS public.products RENAME TO product_prices';
            END IF;
        END IF;
    END IF;

    -- Ensure product_prices table has expected columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_prices'
    ) THEN
        EXECUTE $$
            CREATE TABLE public.product_prices (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                title text NOT NULL,
                url text,
                image text,
                price numeric(12,2),
                currency text DEFAULT 'USD' CHECK (char_length(currency) = 3 and currency = upper(currency)),
                slug text,
                clicks integer DEFAULT 0,
                created_at timestamptz NOT NULL DEFAULT now()
            )
        $$;
    END IF;

    -- Add missing columns (idempotent)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_prices' AND column_name = 'slug') THEN
        EXECUTE 'ALTER TABLE public.product_prices ADD COLUMN slug text';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_prices' AND column_name = 'clicks') THEN
        EXECUTE 'ALTER TABLE public.product_prices ADD COLUMN clicks integer default 0';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_prices' AND column_name = 'currency') THEN
        EXECUTE $$ALTER TABLE public.product_prices ADD COLUMN currency text DEFAULT 'USD' CHECK (char_length(currency)=3 AND currency=upper(currency))$$;
    END IF;

    -- Indexes
    EXECUTE 'CREATE INDEX IF NOT EXISTS product_prices_created_at_idx ON public.product_prices(created_at DESC)';
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS product_prices_url_unique_idx ON public.product_prices(url) WHERE url IS NOT NULL';
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS product_prices_slug_unique_idx ON public.product_prices(slug) WHERE slug IS NOT NULL';
    -- Trigram index for title search (best-effort)
    BEGIN
        EXECUTE 'CREATE EXTENSION IF NOT EXISTS pg_trgm';
    EXCEPTION WHEN OTHERS THEN
        -- ignore
    END;
    BEGIN
        EXECUTE 'CREATE INDEX IF NOT EXISTS product_prices_title_trgm_idx ON public.product_prices USING gin (title gin_trgm_ops)';
    EXCEPTION WHEN OTHERS THEN
        -- ignore if extension missing
    END;

    -- Enable RLS and policies
    EXECUTE 'ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY';
    -- Drop and recreate policies safely
    BEGIN
        EXECUTE 'DROP POLICY IF EXISTS "authenticated can select product_prices" ON public.product_prices';
        EXECUTE 'DROP POLICY IF EXISTS "service role can insert product_prices" ON public.product_prices';
    EXCEPTION WHEN OTHERS THEN
        -- ignore
    END;
    EXECUTE 'CREATE POLICY "authenticated can select product_prices" ON public.product_prices FOR SELECT TO authenticated USING (true)';
    EXECUTE $$CREATE POLICY "service role can insert product_prices" ON public.product_prices FOR INSERT USING (auth.role() = 'service_role')$$;

    -- Create formal products table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products'
    ) THEN
        EXECUTE $$
            CREATE TABLE public.products (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                author_id uuid,
                name text NOT NULL,
                slug text,
                sku text,
                type text,
                short_desc text,
                description text,
                regular_price numeric(12,2),
                sale_price numeric(12,2),
                sale_start timestamptz,
                sale_end timestamptz,
                tax_status text,
                stock_status text,
                stock_quantity integer,
                weight numeric(10,2),
                dim_length numeric(10,2),
                dim_width numeric(10,2),
                dim_height numeric(10,2),
                attributes jsonb,
                images jsonb,
                status text CHECK (status IN ('draft','publish')) DEFAULT 'draft',
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz
            )
        $$;
    END IF;

    -- Constraints and indexes for products
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL';
    EXECUTE 'CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC)';
    -- Optional: SKU unique if desired
    -- EXECUTE ''CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique_idx ON public.products(sku) WHERE sku IS NOT NULL'';

    -- Trigram index for name search (requires pg_trgm)
    BEGIN
        EXECUTE 'CREATE EXTENSION IF NOT EXISTS pg_trgm';
    EXCEPTION WHEN OTHERS THEN
        -- ignore if lacking permission
    END;
    BEGIN
        EXECUTE 'CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON public.products USING gin (name gin_trgm_ops)';
    EXCEPTION WHEN OTHERS THEN
        -- ignore if extension missing
    END;

    -- updated_at trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'set_products_updated_at'
    ) THEN
        EXECUTE $$
            CREATE OR REPLACE FUNCTION public.set_products_updated_at()
            RETURNS trigger AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        $$;
    END IF;
    BEGIN
        EXECUTE 'DROP TRIGGER IF EXISTS trg_set_products_updated_at ON public.products';
        EXECUTE 'CREATE TRIGGER trg_set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_products_updated_at()';
    EXCEPTION WHEN OTHERS THEN
        -- ignore
    END;

    -- slug generation trigger (if slug is null, derive from name)
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'ensure_products_slug'
    ) THEN
        EXECUTE $$
            CREATE OR REPLACE FUNCTION public.ensure_products_slug()
            RETURNS trigger AS $$
            DECLARE
                base_slug text;
            BEGIN
                IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
                    base_slug := lower(
                        regexp_replace(
                            regexp_replace(
                                regexp_replace(coalesce(NEW.name,''), '[^a-zA-Z0-9\s-]', '', 'g'),
                                '\\s+', '-', 'g'
                            ),
                            '-+', '-', 'g'
                        )
                    );
                    NEW.slug := NULLIF(base_slug, '');
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        $$;
    END IF;
    BEGIN
        EXECUTE 'DROP TRIGGER IF EXISTS trg_ensure_products_slug ON public.products';
        EXECUTE 'CREATE TRIGGER trg_ensure_products_slug BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.ensure_products_slug()';
    EXCEPTION WHEN OTHERS THEN
        -- ignore
    END;

    -- Enable RLS for products and set basic policies
    EXECUTE 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY';
    BEGIN
        EXECUTE 'DROP POLICY IF EXISTS "public can select products" ON public.products';
        EXECUTE 'DROP POLICY IF EXISTS "service role can write products" ON public.products';
    EXCEPTION WHEN OTHERS THEN
        -- ignore
    END;
    -- If public read is desired; otherwise restrict as needed
    EXECUTE 'CREATE POLICY "public can select products" ON public.products FOR SELECT USING (true)';
    EXECUTE $$CREATE POLICY "service role can write products" ON public.products FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role')$$;

END $$;

-- Sanity check: list final structures
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('product_prices','products');
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='product_prices' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='products' ORDER BY ordinal_position;
