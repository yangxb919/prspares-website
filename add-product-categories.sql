-- 为上传的产品添加分类关联
-- 在Supabase SQL编辑器中执行此脚本

-- 1. 首先确保产品分类存在
INSERT INTO public.product_categories (name, slug, description) VALUES
('配件', 'accessories', '手机配件和零部件'),
('摄像头', 'cameras', '手机摄像头模块'),
('扬声器', 'speakers', '手机扬声器和音频配件'),
('电池', 'batteries', '手机电池和电源配件')
ON CONFLICT (slug) DO NOTHING;

-- 2. 查看当前的产品分类
SELECT id, name, slug FROM public.product_categories;

-- 3. 查看没有分类关联的产品
SELECT p.id, p.name, p.slug 
FROM public.products p
LEFT JOIN public.product_to_category ptc ON p.id = ptc.product_id
WHERE ptc.product_id IS NULL
AND p.status = 'publish';

-- 4. 为iPhone 16相关产品添加分类关联
-- 配件类产品
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE p.name LIKE '%iPhone 16%' 
  AND (
    p.name LIKE '%SIM%' OR 
    p.name LIKE '%WIFI%' OR 
    p.name LIKE '%排线%' OR 
    p.name LIKE '%维修%' OR 
    p.name LIKE '%听筒%' OR 
    p.name LIKE '%尾插%' OR 
    p.name LIKE '%指南针%' OR 
    p.name LIKE '%音量%' OR 
    p.name LIKE '%马达%' OR 
    p.name LIKE '%麦克风%' OR 
    p.name LIKE '%液晶%' OR 
    p.name LIKE '%E-Sim%'
  )
  AND c.slug = 'accessories'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_to_category ptc 
    WHERE ptc.product_id = p.id AND ptc.category_id = c.id
  );

-- 摄像头类产品
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE p.name LIKE '%iPhone 16%' 
  AND (
    p.name LIKE '%摄像头%' OR 
    p.name LIKE '%camera%' OR
    p.name LIKE '%后盖%'
  )
  AND c.slug = 'cameras'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_to_category ptc 
    WHERE ptc.product_id = p.id AND ptc.category_id = c.id
  );

-- 扬声器类产品
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE p.name LIKE '%iPhone 16%' 
  AND p.name LIKE '%喇叭%'
  AND c.slug = 'speakers'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_to_category ptc 
    WHERE ptc.product_id = p.id AND ptc.category_id = c.id
  );

-- 电池类产品
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE p.name LIKE '%iPhone 16%' 
  AND (p.name LIKE '%电池%' OR p.name LIKE '%battery%')
  AND c.slug = 'batteries'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_to_category ptc 
    WHERE ptc.product_id = p.id AND ptc.category_id = c.id
  );

-- 5. 验证分类关联结果
SELECT 
  p.name as product_name,
  pc.name as category_name,
  pc.slug as category_slug
FROM public.products p
JOIN public.product_to_category ptc ON p.id = ptc.product_id
JOIN public.product_categories pc ON ptc.category_id = pc.id
WHERE p.name LIKE '%iPhone 16%'
ORDER BY p.name;

-- 6. 查看仍然没有分类的产品
SELECT p.id, p.name 
FROM public.products p
LEFT JOIN public.product_to_category ptc ON p.id = ptc.product_id
WHERE ptc.product_id IS NULL
AND p.status = 'publish'
AND p.name LIKE '%iPhone 16%';
