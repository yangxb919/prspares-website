-- 数据库表结构
-- 从源数据库分析生成
-- 生成时间: 2025-11-13T11:07:38.891Z
-- 
-- 使用方法:
-- 1. 登录目标数据库的 SQL Editor
-- 2. 复制并运行此 SQL 文件
-- 3. 然后重新运行数据迁移脚本

-- 创建表: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text,
  slug text,
  description text
);

-- 建议的索引
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);

-- 创建表: tags
CREATE TABLE IF NOT EXISTS public.tags (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text,
  slug text
);

-- 建议的索引
CREATE INDEX IF NOT EXISTS tags_slug_idx ON public.tags(slug);

-- 创建表: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text,
  avatar_url text,
  role text,
  created_at timestamptz DEFAULT now()
);

-- 建议的索引

-- 创建表: products
CREATE TABLE IF NOT EXISTS public.products (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author_id uuid,
  name text,
  slug text,
  sku text,
  type text,
  short_desc text,
  description text,
  regular_price numeric,
  sale_price numeric,
  sale_start text,
  sale_end text,
  tax_status text,
  stock_status text,
  stock_quantity integer,
  weight text,
  dim_length text,
  dim_width text,
  dim_height text,
  attributes jsonb,
  images jsonb,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta jsonb,
  url text,
  clicks integer
);

-- 建议的索引
CREATE INDEX IF NOT EXISTS products_author_id_idx ON public.products(author_id);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug);

-- 创建表: prices
CREATE TABLE IF NOT EXISTS public.prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text,
  model text,
  series text,
  product_title text,
  product_type text,
  image_url text,
  price numeric,
  currency text,
  description text,
  availability_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 建议的索引

-- 创建表: posts
CREATE TABLE IF NOT EXISTS public.posts (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author_id uuid,
  title text,
  slug text,
  content text,
  excerpt text,
  status text,
  comment_status text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta jsonb
);

-- 建议的索引
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);

-- 创建表: post_tags
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id integer,
  tag_id integer
);

-- 建议的索引
CREATE INDEX IF NOT EXISTS post_tags_post_id_idx ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS post_tags_tag_id_idx ON public.post_tags(tag_id);

