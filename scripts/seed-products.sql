-- 产品种子数据
-- 注意：在运行此脚本之前，请确保已经创建了相应的表结构

-- 插入产品分类
INSERT INTO public.product_categories (name, slug, description) VALUES
('Automotive Molds', 'automotive', 'High-precision molds for automotive industry'),
('Medical Molds', 'medical', 'FDA-approved molds for medical applications'),
('Electronics Molds', 'electronics', 'Precision molds for electronic components'),
('Packaging Molds', 'packaging', 'Food-safe molds for packaging industry'),
('Industrial Molds', 'industrial', 'Heavy-duty molds for industrial applications'),
('Toy Molds', 'toy', 'Safe molds for toy manufacturing')
ON CONFLICT (slug) DO NOTHING;

-- 插入示例产品（需要替换 author_id 为实际的用户ID）
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
(
  'Precision Injection Mold',
  'precision-injection-mold',
  'PIM-001',
  'High-precision injection mold for automotive components with advanced cooling system',
  'This high-precision injection mold is specifically designed for automotive components requiring exceptional accuracy and durability. Our advanced cooling system ensures optimal cycle times while maintaining consistent part quality.

The mold features state-of-the-art steel construction with precision-machined cavities that deliver parts with tolerances as tight as ±0.01mm. The integrated cooling channels are strategically positioned to ensure uniform temperature distribution throughout the molding process.

Key benefits include reduced cycle times, improved part quality, extended mold life, and lower maintenance requirements. This mold is ideal for high-volume production runs and can handle a wide range of thermoplastic materials.',
  15000.00,
  NULL,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold1-detail1/800/600", "alt": "Precision Injection Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold1-detail2/800/600", "alt": "Precision Injection Mold - Side View"},
    {"id": "3", "url": "https://picsum.photos/seed/mold1-detail3/800/600", "alt": "Precision Injection Mold - Internal Structure"}
  ]'::jsonb,
  '{
    "features": ["High Precision", "Advanced Cooling", "Durable Steel", "Fast Cycle Time"],
    "applications": ["Automotive Parts", "Engine Components", "Interior Trim"],
    "materials": ["ABS", "PC", "PA6", "PP"]
  }'::jsonb
),
(
  'Medical Grade Mold',
  'medical-grade-mold',
  'MGM-001',
  'FDA-approved medical grade injection mold for healthcare applications',
  'Our FDA-approved medical grade injection mold is engineered to meet the stringent requirements of healthcare applications. This mold is designed with biocompatible materials and features a sterile design that ensures the highest levels of cleanliness and safety.

The mold construction utilizes medical-grade stainless steel with specialized surface treatments to prevent contamination and ensure easy cleaning. All components are designed to withstand repeated sterilization cycles without degradation.

This mold is perfect for manufacturing medical devices, surgical instruments, and pharmaceutical packaging components. The precision engineering ensures consistent part quality that meets FDA and ISO 13485 standards.',
  25000.00,
  22000.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold2-detail1/800/600", "alt": "Medical Grade Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold2-detail2/800/600", "alt": "Medical Grade Mold - Sterile Chamber"},
    {"id": "3", "url": "https://picsum.photos/seed/mold2-detail3/800/600", "alt": "Medical Grade Mold - Quality Control"}
  ]'::jsonb,
  '{
    "features": ["FDA Approved", "Biocompatible", "Sterile Design", "Easy Cleaning"],
    "applications": ["Medical Devices", "Surgical Instruments", "Pharmaceutical Packaging"],
    "materials": ["Medical Grade PC", "PEEK", "POM", "Medical Grade PP"]
  }'::jsonb
),
(
  'Consumer Electronics Mold',
  'consumer-electronics-mold',
  'CEM-001',
  'Specialized mold for consumer electronics with micro-precision features',
  'This specialized injection mold is designed for manufacturing consumer electronics components that require micro-precision features and tight tolerances. The mold incorporates advanced technology to handle complex geometries and fine details.

Features include multi-cavity design for high-volume production, precision temperature control, and specialized venting systems. The mold is optimized for processing engineering plastics commonly used in electronics manufacturing.

Perfect for producing smartphone cases, tablet components, laptop parts, and other consumer electronic devices. The mold design ensures consistent quality and dimensional accuracy across all production runs.',
  18000.00,
  NULL,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold3-detail1/800/600", "alt": "Electronics Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold3-detail2/800/600", "alt": "Electronics Mold - Precision Features"},
    {"id": "3", "url": "https://picsum.photos/seed/mold3-detail3/800/600", "alt": "Electronics Mold - Multi-Cavity Design"}
  ]'::jsonb,
  '{
    "features": ["Micro Precision", "Multi-Cavity", "Fast Cycle Time", "Complex Geometries"],
    "applications": ["Smartphone Cases", "Tablet Components", "Laptop Parts", "Electronic Housings"],
    "materials": ["PC/ABS", "PA66", "POM", "TPU"]
  }'::jsonb
),
(
  'Packaging Mold',
  'packaging-mold',
  'PKG-001',
  'Efficient packaging mold for food and beverage industry applications',
  'This high-efficiency packaging mold is specifically designed for the food and beverage industry, featuring food-safe materials and construction. The mold is optimized for high-volume production of containers, caps, and packaging components.

The design incorporates rapid cooling systems and optimized flow channels to minimize cycle times while maintaining excellent part quality. All materials used are FDA-approved and suitable for direct food contact applications.

Ideal for producing bottles, containers, caps, lids, and other packaging components. The mold design ensures consistent wall thickness, excellent surface finish, and reliable performance in high-volume production environments.',
  12000.00,
  10500.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold4-detail1/800/600", "alt": "Packaging Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold4-detail2/800/600", "alt": "Packaging Mold - Food Safe Design"},
    {"id": "3", "url": "https://picsum.photos/seed/mold4-detail3/800/600", "alt": "Packaging Mold - High Volume Production"}
  ]'::jsonb,
  '{
    "features": ["Food Safe", "High Volume", "Cost Effective", "Rapid Cooling"],
    "applications": ["Bottles", "Containers", "Caps", "Food Packaging"],
    "materials": ["PP", "PE", "PET", "PS"]
  }'::jsonb
),
(
  'Industrial Component Mold',
  'industrial-component-mold',
  'ICM-001',
  'Heavy-duty mold for industrial components and machinery parts',
  'This heavy-duty industrial mold is engineered for manufacturing robust components used in industrial machinery and equipment. The mold features reinforced construction and premium steel grades to handle demanding production requirements.

Designed for processing engineering plastics and high-performance materials, this mold delivers exceptional durability and long service life. The robust design can handle high injection pressures and temperatures required for industrial-grade materials.

Perfect for producing gears, housings, brackets, and other industrial components that require high strength and dimensional stability. The mold is built to withstand continuous operation in demanding industrial environments.',
  22000.00,
  NULL,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold5-detail1/800/600", "alt": "Industrial Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold5-detail2/800/600", "alt": "Industrial Mold - Heavy Duty Construction"},
    {"id": "3", "url": "https://picsum.photos/seed/mold5-detail3/800/600", "alt": "Industrial Mold - Precision Machining"}
  ]'::jsonb,
  '{
    "features": ["Heavy Duty", "Long Lasting", "High Strength", "Premium Steel"],
    "applications": ["Industrial Gears", "Machine Housings", "Brackets", "Equipment Parts"],
    "materials": ["PA6", "POM", "PC", "PEEK"]
  }'::jsonb
),
(
  'Toy Safety Mold',
  'toy-safety-mold',
  'TSM-001',
  'Child-safe injection mold designed for toy manufacturing with safety standards',
  'This child-safe injection mold is specifically designed for toy manufacturing, meeting all international safety standards including CPSIA, EN71, and ASTM F963. The mold features rounded edges, smooth surfaces, and safe material specifications.

All components are designed to eliminate sharp edges and small parts that could pose choking hazards. The mold construction uses non-toxic materials and incorporates safety features throughout the design process.

Perfect for producing educational toys, building blocks, action figures, and other children''s products. The mold ensures consistent quality while maintaining the highest safety standards for children''s products.',
  8000.00,
  7200.00,
  'instock',
  'publish',
  '[
    {"id": "1", "url": "https://picsum.photos/seed/mold6-detail1/800/600", "alt": "Toy Mold - Main View", "isPrimary": true},
    {"id": "2", "url": "https://picsum.photos/seed/mold6-detail2/800/600", "alt": "Toy Mold - Safety Features"},
    {"id": "3", "url": "https://picsum.photos/seed/mold6-detail3/800/600", "alt": "Toy Mold - Child Safe Design"}
  ]'::jsonb,
  '{
    "features": ["Child Safe", "Non-Toxic", "Smooth Finish", "Safety Certified"],
    "applications": ["Educational Toys", "Building Blocks", "Action Figures", "Play Sets"],
    "materials": ["ABS", "PP", "PE", "TPE"]
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 创建产品与分类的关联关系
-- 注意：需要根据实际插入的产品ID和分类ID来调整
INSERT INTO public.product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM public.products p, public.product_categories c
WHERE (p.slug = 'precision-injection-mold' AND c.slug = 'automotive')
   OR (p.slug = 'medical-grade-mold' AND c.slug = 'medical')
   OR (p.slug = 'consumer-electronics-mold' AND c.slug = 'electronics')
   OR (p.slug = 'packaging-mold' AND c.slug = 'packaging')
   OR (p.slug = 'industrial-component-mold' AND c.slug = 'industrial')
   OR (p.slug = 'toy-safety-mold' AND c.slug = 'toy')
ON CONFLICT (product_id, category_id) DO NOTHING; 