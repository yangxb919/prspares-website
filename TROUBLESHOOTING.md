# 产品页面故障排除指南

## 问题：后台上传的产品在前端页面没有显示

### 可能的原因和解决方案

#### 1. 产品状态问题
**问题**: 产品状态不是 "publish"
**解决方案**: 
- 在后台管理界面将产品状态设置为 "publish"
- 或者在数据库中直接更新：
```sql
UPDATE products SET status = 'publish' WHERE id = YOUR_PRODUCT_ID;
```

#### 2. 产品分类关联问题
**问题**: 产品没有关联到任何分类
**解决方案**: 
- 确保产品分类表有数据：
```sql
SELECT * FROM product_categories;
```
- 为产品添加分类关联：
```sql
INSERT INTO product_to_category (product_id, category_id) 
VALUES (YOUR_PRODUCT_ID, YOUR_CATEGORY_ID);
```

#### 3. 数据库权限问题
**问题**: RLS (Row Level Security) 策略阻止了数据访问
**解决方案**: 
- 检查 products 表的 RLS 策略
- 确保有正确的公开读取策略：
```sql
-- 检查现有策略
SELECT * FROM pg_policies WHERE tablename = 'products';

-- 如果需要，添加公开读取策略
CREATE POLICY "已发布产品对所有人可读"
  ON public.products FOR SELECT
  USING ( status = 'publish' );
```

#### 4. 环境变量问题
**问题**: Supabase 连接配置错误
**解决方案**: 
- 检查 `.env.local` 文件中的环境变量：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 调试步骤

#### 步骤 1: 访问调试页面
访问 `http://localhost:3000/products/debug` 查看：
- 所有产品数据
- 已发布产品数据
- 产品分类数据
- 产品分类关联数据

#### 步骤 2: 检查浏览器控制台
打开浏览器开发者工具，查看控制台日志：
- 查找数据库查询错误
- 查看返回的产品数量
- 检查网络请求状态

#### 步骤 3: 检查数据库
直接在 Supabase 控制台中查询：
```sql
-- 查看所有产品
SELECT id, name, status, created_at FROM products ORDER BY created_at DESC;

-- 查看已发布产品
SELECT id, name, status, created_at FROM products WHERE status = 'publish';

-- 查看产品分类关联
SELECT p.name as product_name, c.name as category_name 
FROM products p
JOIN product_to_category pc ON p.id = pc.product_id
JOIN product_categories c ON pc.category_id = c.id;
```

### 常见解决方案

#### 解决方案 1: 批量发布产品
```sql
UPDATE products SET status = 'publish' WHERE status = 'draft';
```

#### 解决方案 2: 为所有产品添加默认分类
```sql
-- 首先确保有一个默认分类
INSERT INTO product_categories (name, slug, description) 
VALUES ('General', 'general', 'General products') 
ON CONFLICT (slug) DO NOTHING;

-- 为没有分类的产品添加默认分类
INSERT INTO product_to_category (product_id, category_id)
SELECT p.id, c.id
FROM products p
CROSS JOIN product_categories c
WHERE c.slug = 'general'
AND NOT EXISTS (
  SELECT 1 FROM product_to_category pc 
  WHERE pc.product_id = p.id
);
```

#### 解决方案 3: 重置缓存
如果使用了缓存，清除 Next.js 缓存：
```bash
rm -rf .next
npm run dev
```

### 联系支持
如果以上步骤都无法解决问题，请提供以下信息：
1. 调试页面的截图
2. 浏览器控制台的错误信息
3. 产品在后台的状态截图
4. 数据库查询结果 