-- 修复现有产品数据的脚本
-- 为没有author_id的产品设置默认作者

-- 1. 查看当前没有author_id的产品
SELECT id, name, author_id 
FROM products 
WHERE author_id IS NULL;

-- 2. 获取第一个管理员用户的ID（如果有的话）
-- 注意：请替换为您的实际用户ID
-- 您可以通过以下查询找到用户ID：
-- SELECT id, email FROM auth.users ORDER BY created_at LIMIT 5;

-- 3. 为现有产品设置author_id
-- 请将 'YOUR_USER_ID_HERE' 替换为实际的用户ID
/*
UPDATE products 
SET author_id = 'YOUR_USER_ID_HERE' 
WHERE author_id IS NULL;
*/

-- 4. 验证更新结果
-- SELECT id, name, author_id FROM products WHERE author_id IS NOT NULL;

-- 5. 如果您需要创建一个默认管理员用户，可以使用以下步骤：
-- 注意：这需要在Supabase Dashboard的Authentication页面完成，或者通过API

-- 临时解决方案：如果您想允许匿名用户也能创建产品（不推荐用于生产环境）
-- 可以创建一个更宽松的策略：
/*
CREATE POLICY "临时允许匿名创建产品" ON products
  FOR INSERT 
  WITH CHECK (true);
*/

-- 但是更好的做法是确保用户已登录并设置正确的author_id
