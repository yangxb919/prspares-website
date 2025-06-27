-- 修复产品表的RLS策略，解决批量上传失败问题
-- 在Supabase SQL编辑器中执行此脚本

-- 1. 删除现有的可能冲突的策略（如果存在）
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "已发布产品对所有人可读" ON products;
DROP POLICY IF EXISTS "作者管理自己的商品" ON products;
DROP POLICY IF EXISTS "允许已认证用户创建产品" ON products;
DROP POLICY IF EXISTS "允许管理员创建产品" ON products;

-- 2. 创建新的RLS策略

-- 允许所有人查看已发布的产品
CREATE POLICY "公开查看已发布产品" ON products
  FOR SELECT 
  USING (status = 'publish');

-- 允许已认证用户查看自己的所有产品（包括草稿）
CREATE POLICY "作者查看自己的产品" ON products
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = author_id);

-- 允许已认证用户创建产品（设置author_id为当前用户）
CREATE POLICY "已认证用户创建产品" ON products
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- 允许作者更新自己的产品
CREATE POLICY "作者更新自己的产品" ON products
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- 允许作者删除自己的产品
CREATE POLICY "作者删除自己的产品" ON products
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- 3. 检查products表结构，确保有author_id字段
-- 如果没有author_id字段，添加它
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'author_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. 为现有产品设置默认的author_id（如果需要）
-- 注意：这里需要替换为实际的用户ID
-- UPDATE products SET author_id = 'YOUR_USER_ID_HERE' WHERE author_id IS NULL;

-- 5. 验证策略是否正确创建
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 6. 检查表结构
\d products;
