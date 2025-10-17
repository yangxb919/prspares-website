-- Migration: Create blog tables (profiles and posts)
-- This migration creates the necessary tables for the blog feature

DO $$
BEGIN
    -- Create profiles table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        CREATE TABLE public.profiles (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            display_name text,
            avatar_url text,
            role text DEFAULT 'user',
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );
        
        -- Enable RLS on profiles
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for public read access
        CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
            FOR SELECT USING (true);
        
        -- Create policy for users to update their own profile
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
        
        RAISE NOTICE 'Created profiles table';
    END IF;

    -- Create posts table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'posts'
    ) THEN
        CREATE TABLE public.posts (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title text NOT NULL,
            slug text NOT NULL UNIQUE,
            content text,
            excerpt text,
            status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'publish', 'private')),
            author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
            published_at timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            meta jsonb DEFAULT '{}'::jsonb
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);
        CREATE INDEX IF NOT EXISTS posts_status_idx ON public.posts(status);
        CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
        CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts(published_at DESC);
        CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
        
        -- Enable RLS on posts
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for public read access to published posts
        CREATE POLICY "Published posts are viewable by everyone" ON public.posts
            FOR SELECT USING (status = 'publish');
        
        -- Create policy for authenticated users to read all posts
        CREATE POLICY "Authenticated users can read all posts" ON public.posts
            FOR SELECT USING (auth.role() = 'authenticated');
        
        -- Create policy for service role to manage all posts
        CREATE POLICY "Service role can manage all posts" ON public.posts
            FOR ALL USING (auth.role() = 'service_role');
        
        RAISE NOTICE 'Created posts table';
    END IF;

END $$;

