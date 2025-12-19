-- 修复外键关系
-- 这些外键关系是 Supabase 进行 JOIN 查询所必需的

-- 1. posts 表的 author_id 外键
ALTER TABLE public.posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- 2. products 表的 author_id 外键
ALTER TABLE public.products 
ADD CONSTRAINT products_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- 3. post_tags 表的外键
ALTER TABLE public.post_tags 
ADD CONSTRAINT post_tags_post_id_fkey 
FOREIGN KEY (post_id) 
REFERENCES public.posts(id) 
ON DELETE CASCADE;

ALTER TABLE public.post_tags 
ADD CONSTRAINT post_tags_tag_id_fkey 
FOREIGN KEY (tag_id) 
REFERENCES public.tags(id) 
ON DELETE CASCADE;

-- 完成！
-- 现在 Supabase 可以正确处理 JOIN 查询了

