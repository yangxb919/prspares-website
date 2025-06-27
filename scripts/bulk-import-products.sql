-- 批量导入产品数据脚本
-- 使用方法：修改下面的INSERT语句中的产品数据，然后在Supabase SQL编辑器中执行

-- 1. 首先确保产品分类存在
INSERT INTO public.product_categories (name, slug, description) VALUES
('手机屏幕', 'displays', '手机LCD、OLED屏幕替换配件'),
('手机电池', 'batteries', '手机锂电池替换配件'),
('摄像头模块', 'cameras', '手机前后摄像头模块'),
('充电配件', 'charging', '充电器、数据线、充电口'),
('扬声器配件', 'speakers', '听筒、扬声器、麦克风'),
('按键配件', 'buttons', '电源键、音量键、Home键'),
('外壳配件', 'cases', '手机后盖、边框、保护壳'),
('维修工具', 'tools', '螺丝刀、撬棒、热风枪等工具')
ON CONFLICT (slug) DO NOTHING;

-- 2. 批量插入产品数据（示例）
-- 请根据您的实际产品信息修改以下数据
INSERT INTO public.products (
  name, 
  slug, 
  sku,
  short_desc, 
  description, 
  regular_price, 
  sale_price,
  stock_status,
  status,
  images,
  meta
) VALUES
-- iPhone系列产品
(
  'iPhone 14 Pro Max OLED原装屏幕',
  'iphone-14-pro-max-oled-original',
  'OLED-IP14PM-001',
  '原装OLED屏幕，支持ProMotion技术，120Hz刷新率',
  'iPhone 14 Pro Max原装OLED显示屏，采用Super Retina XDR技术，支持ProMotion自适应刷新率，HDR10和杜比视界。屏幕具有优异的色彩准确性和亮度表现，触控响应精准快速。适用于专业维修和高端客户需求。',
  380.00,
  350.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/iphone14pm-oled-1.jpg", "alt": "iPhone 14 Pro Max OLED屏幕正面", "isPrimary": true},
    {"id": "2", "url": "https://example.com/iphone14pm-oled-2.jpg", "alt": "iPhone 14 Pro Max OLED屏幕背面"}
  ]'::jsonb,
  '{
    "features": ["原装OLED", "120Hz ProMotion", "HDR10支持", "True Tone"],
    "applications": ["iPhone 14 Pro Max维修", "高端屏幕替换"],
    "materials": ["OLED", "铝合金边框", "玻璃面板"]
  }'::jsonb
),
(
  'iPhone 13 LCD高清后市场屏幕',
  'iphone-13-lcd-aftermarket',
  'LCD-IP13-001',
  '高清LCD屏幕，色彩鲜艳，触控灵敏',
  'iPhone 13高质量LCD替换屏幕，采用优质LCD面板，色彩还原度高，触控响应敏感。虽然不是原装OLED，但提供了优秀的显示效果和极具竞争力的价格。适合大部分维修场景使用。',
  120.00,
  95.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/iphone13-lcd-1.jpg", "alt": "iPhone 13 LCD屏幕", "isPrimary": true}
  ]'::jsonb,
  '{
    "features": ["高清LCD", "色彩鲜艳", "触控灵敏", "性价比高"],
    "applications": ["iPhone 13维修", "经济型屏幕替换"],
    "materials": ["LCD", "塑料边框", "玻璃面板"]
  }'::jsonb
),
-- 三星系列产品
(
  'Samsung Galaxy S23 Ultra AMOLED原装屏幕',
  'samsung-galaxy-s23-ultra-amoled',
  'AMOLED-SGS23U-001',
  '6.8英寸Dynamic AMOLED 2X曲面屏',
  'Samsung Galaxy S23 Ultra原装AMOLED显示屏，6.8英寸Dynamic AMOLED 2X技术，支持120Hz自适应刷新率。屏幕具有优异的对比度和色彩饱和度，支持HDR10+和Always On Display功能。',
  420.00,
  399.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/s23ultra-amoled-1.jpg", "alt": "Galaxy S23 Ultra AMOLED屏幕", "isPrimary": true}
  ]'::jsonb,
  '{
    "features": ["Dynamic AMOLED 2X", "120Hz刷新率", "HDR10+", "曲面屏"],
    "applications": ["Galaxy S23 Ultra维修", "高端屏幕替换"],
    "materials": ["AMOLED", "铝合金", "Gorilla Glass"]
  }'::jsonb
),
-- 电池产品
(
  'iPhone 14 原装容量电池',
  'iphone-14-original-battery',
  'BAT-IP14-001',
  '3279mAh锂离子电池，原装容量规格',
  'iPhone 14原装规格锂离子电池，容量3279mAh，采用优质电芯和保护电路。通过严格的安全测试，支持快充和无线充电。提供稳定的续航表现和安全保障。',
  45.00,
  39.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/iphone14-battery-1.jpg", "alt": "iPhone 14电池", "isPrimary": true}
  ]'::jsonb,
  '{
    "features": ["原装容量", "快充支持", "安全保护", "长续航"],
    "applications": ["iPhone 14电池替换", "续航修复"],
    "materials": ["锂离子", "保护电路", "胶带"]
  }'::jsonb
),
(
  'Samsung Galaxy S22 高容量电池',
  'samsung-galaxy-s22-battery',
  'BAT-SGS22-001',
  '3700mAh高容量电池，超越原装容量',
  'Samsung Galaxy S22高容量锂离子电池，容量3700mAh，比原装电池容量更大。采用高密度电芯技术，提供更长的续航时间。内置多重安全保护，支持快充和无线充电。',
  50.00,
  45.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/s22-battery-1.jpg", "alt": "Galaxy S22电池", "isPrimary": true}
  ]'::jsonb,
  '{
    "features": ["高容量", "快充支持", "无线充电", "安全保护"],
    "applications": ["Galaxy S22电池替换", "续航升级"],
    "materials": ["锂离子", "高密度电芯", "保护电路"]
  }'::jsonb
),
-- 摄像头产品
(
  'iPhone 13 Pro 后置摄像头模块',
  'iphone-13-pro-rear-camera',
  'CAM-IP13P-001',
  '三摄系统，支持ProRAW和ProRes录制',
  'iPhone 13 Pro后置三摄系统，包含主摄、超广角和长焦镜头。支持ProRAW照片拍摄和ProRes视频录制，具备光学图像防抖功能。提供专业级的拍摄体验和优异的成像质量。',
  180.00,
  165.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/ip13pro-camera-1.jpg", "alt": "iPhone 13 Pro后置摄像头", "isPrimary": true}
  ]'::jsonb,
  '{
    "features": ["三摄系统", "光学防抖", "ProRAW支持", "4K录制"],
    "applications": ["iPhone 13 Pro摄像头维修", "拍照功能修复"],
    "materials": ["光学镜头", "传感器", "金属支架"]
  }'::jsonb
),
-- 维修工具
(
  '专业手机维修工具套装',
  'professional-phone-repair-kit',
  'TOOL-KIT-001',
  '38件套专业维修工具，适用于各种手机型号',
  '专业手机维修工具套装，包含38件精密工具。包括各种型号螺丝刀、撬棒、吸盘、镊子、电池胶条等。工具采用优质材料制造，适用于iPhone、Samsung、Huawei等各大品牌手机维修。',
  89.00,
  79.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://example.com/repair-kit-1.jpg", "alt": "专业维修工具套装", "isPrimary": true},
    {"id": "2", "url": "https://example.com/repair-kit-2.jpg", "alt": "工具详细展示"}
  ]'::jsonb,
  '{
    "features": ["38件套装", "精密工具", "多品牌适用", "便携收纳"],
    "applications": ["手机维修", "拆机组装", "精密作业"],
    "materials": ["不锈钢", "塑料", "磁性材料"]
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 3. 创建产品与分类的关联关系
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE 
  -- 屏幕产品关联到displays分类
  ((p.slug LIKE '%oled%' OR p.slug LIKE '%lcd%' OR p.slug LIKE '%amoled%' OR p.slug LIKE '%screen%') AND c.slug = 'displays')
  -- 电池产品关联到batteries分类
  OR ((p.slug LIKE '%battery%' OR p.slug LIKE '%电池%') AND c.slug = 'batteries')
  -- 摄像头产品关联到cameras分类
  OR ((p.slug LIKE '%camera%' OR p.slug LIKE '%摄像头%') AND c.slug = 'cameras')
  -- 工具产品关联到tools分类
  OR ((p.slug LIKE '%tool%' OR p.slug LIKE '%kit%' OR p.slug LIKE '%工具%') AND c.slug = 'tools')
ON CONFLICT (product_id, category_id) DO NOTHING;

-- 4. 查看插入结果
SELECT 
  p.name,
  p.regular_price,
  p.sale_price,
  p.stock_status,
  p.status,
  STRING_AGG(pc.name, ', ') as categories
FROM public.products p
LEFT JOIN public.product_to_category ptc ON p.id = ptc.product_id
LEFT JOIN public.product_categories pc ON ptc.category_id = pc.id
WHERE p.created_at >= NOW() - INTERVAL '1 hour'  -- 只显示最近1小时创建的产品
GROUP BY p.id, p.name, p.regular_price, p.sale_price, p.stock_status, p.status
ORDER BY p.created_at DESC; 