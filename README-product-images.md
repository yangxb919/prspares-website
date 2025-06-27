# 产品图片上传故障排除指南

## 问题描述
产品图片上传失败，显示 "Failed to upload images" 错误。

## 解决方案

### 1. 检查 Supabase 存储桶设置

首先访问测试页面来诊断问题：
```
http://localhost:3000/test-product-upload
```

在该页面上：
1. 点击 "检查认证" - 确保用户已正确登录
2. 点击 "列出存储桶" - 检查 `product-images` 存储桶是否存在
3. 点击 "检查存储设置" - 自动创建存储桶（如果不存在）
4. 点击 "测试存储功能" - 测试基本上传功能
5. 尝试上传测试图片

### 2. 手动在 Supabase 中设置存储桶

如果自动设置失败，请在 Supabase Dashboard 中手动操作：

#### 步骤 A: 创建存储桶
1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 导航到 Storage → Buckets
4. 点击 "New bucket"
5. 创建名为 `product-images` 的存储桶，设置为 Public

#### 步骤 B: 设置 RLS 策略
在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建产品图片存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 设置product-images存储桶的RLS策略
-- 允许所有已认证用户上传产品图片
CREATE POLICY "允许已认证用户上传产品图片" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 允许用户管理产品图片
CREATE POLICY "允许用户管理产品图片" ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'product-images');

-- 允许公开访问产品图片
CREATE POLICY "允许公开访问产品图片" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');
```

### 3. 检查用户权限

确保当前登录的用户具有以下条件：
- 已正确通过 Supabase Auth 认证
- 在 `profiles` 表中有对应记录
- 角色为 `admin` 或 `author`

### 4. 检查文件限制

确保上传的文件满足以下要求：
- 文件类型：JPG、PNG、GIF、WebP
- 文件大小：小于 10MB
- 文件名：不包含特殊字符

### 5. 网络连接问题

如果上传仍然失败，可能是网络问题：
- 检查网络连接
- 尝试重新加载页面
- 清除浏览器缓存

### 6. 查看详细错误信息

启用浏览器开发者工具的控制台，查看详细的错误信息：
1. 按 F12 打开开发者工具
2. 切换到 Console 标签页
3. 尝试上传图片
4. 查看红色错误信息

### 7. 常见错误及解决方案

#### 错误: "Row Level Security policy violation"
- **原因**: 用户没有上传权限
- **解决**: 确保已执行步骤 2B 中的 SQL 策略

#### 错误: "Bucket not found"
- **原因**: `product-images` 存储桶不存在
- **解决**: 执行步骤 2A 创建存储桶

#### 错误: "Authentication required"
- **原因**: 用户未正确登录
- **解决**: 重新登录管理后台

#### 错误: "File too large"
- **原因**: 文件超过 10MB 限制
- **解决**: 压缩图片或选择更小的文件

### 8. 联系支持

如果以上步骤都无法解决问题，请提供以下信息：
- 浏览器控制台的完整错误信息
- 测试页面的日志输出
- 使用的浏览器和版本
- 上传文件的类型和大小

## 成功上传后

一旦图片上传成功：
1. 图片将显示在产品图片预览区域
2. 图片URL会被保存到产品数据中
3. 图片在前台产品页面可见
4. 图片会在产品列表中作为缩略图显示 