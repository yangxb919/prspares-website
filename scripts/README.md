# Storage Setup Scripts

这些脚本用于设置Supabase Storage buckets和权限策略。

## 问题背景

在博客文章页面上传图片时出现失败，原因是Supabase实例中缺少必要的storage buckets。

## 解决方案

### 1. 创建Storage Buckets

运行以下命令创建所需的storage buckets：

```bash
npx tsx scripts/setup-storage-buckets.ts
```

这将创建以下buckets：
- `product-images`: 用于产品图片
- `post-images`: 用于博客文章图片
- `avatars`: 用于用户头像

每个bucket配置：
- 公开访问（public: true）
- 文件大小限制：5MB
- 允许的MIME类型：image/png, image/jpeg, image/jpg, image/webp, image/gif

### 2. 设置RLS策略（可选）

如果需要更细粒度的权限控制，可以在Supabase SQL编辑器中运行：

```bash
cat scripts/setup-storage-policies.sql
```

然后将SQL内容复制到Supabase Dashboard的SQL编辑器中执行。

## 验证

检查buckets是否创建成功：

```bash
curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://prspares.zeabur.app/storage/v1/bucket | jq .
```

## 注意事项

1. 确保 `.env.local` 文件中配置了正确的Supabase URL和Service Role Key
2. Service Role Key具有管理员权限，请妥善保管
3. 在生产环境中，建议使用更严格的RLS策略而不是完全公开访问

## 故障排除

如果上传仍然失败：

1. 检查Supabase服务是否正常运行
2. 验证环境变量配置是否正确
3. 检查浏览器控制台和服务器日志中的错误信息
4. 确认用户已登录（upload API需要认证）
