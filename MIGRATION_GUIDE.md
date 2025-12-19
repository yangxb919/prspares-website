# Supabase 数据迁移指南

本指南将帮助你将当前 Supabase 数据库迁移到新的自部署 Supabase 实例。

## 📋 目录

1. [准备工作](#准备工作)
2. [方案选择](#方案选择)
3. [详细步骤](#详细步骤)
4. [迁移后配置](#迁移后配置)
5. [验证和测试](#验证和测试)
6. [常见问题](#常见问题)

---

## 准备工作

### 1. 获取当前数据库信息

当前数据库配置：
- **URL**: `https://prspares.zeabur.app`
- **数据库主机**: `prspares.zeabur.app`
- **端口**: `5432`
- **数据库名**: `postgres`
- **用户名**: `postgres`

### 2. 准备新的 Supabase 实例

确保你已经：
- ✅ 部署了新的 Supabase 实例
- ✅ 获取了新实例的连接信息
- ✅ 获取了新实例的 API Keys（ANON_KEY 和 SERVICE_ROLE_KEY）

### 3. 安装必要工具

```bash
# macOS
brew install postgresql
brew install supabase/tap/supabase

# Ubuntu/Debian
sudo apt-get install postgresql-client

# 或使用 npm 安装 Supabase CLI
npm install -g supabase
```

---

## 方案选择

根据你的需求选择合适的迁移方案：

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **方案 1: pg_dump** | 完整迁移 | 最可靠，包含所有数据和结构 | 需要数据库密码 |
| **方案 2: Supabase CLI** | 官方推荐 | 自动处理 Supabase 特定配置 | 需要安装 CLI |
| **方案 3: 自动化脚本** | 编程方式 | 可自定义，有备份 | 需要 Node.js |
| **方案 4: CSV 导出** | 小数据量 | 简单直观 | 手动操作多 |

**推荐**: 方案 1（pg_dump）或方案 2（Supabase CLI）

---

## 详细步骤

### 方案 1: 使用 pg_dump（推荐）

#### 步骤 1: 导出完整数据库

```bash
# 导出数据库（包含结构和数据）
pg_dump -h prspares.zeabur.app \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=realtime \
  --exclude-schema=supabase_functions \
  --exclude-schema=extensions \
  --exclude-schema=graphql \
  --exclude-schema=graphql_public \
  --exclude-schema=pgbouncer \
  --exclude-schema=pgsodium \
  --exclude-schema=pgsodium_masks \
  --exclude-schema=vault \
  --file=supabase_backup_$(date +%Y%m%d_%H%M%S).sql
```

**提示**: 运行时会提示输入密码，请从 Supabase Dashboard 的 Database Settings 中获取。

#### 步骤 2: 检查导出文件

```bash
# 查看文件大小
ls -lh supabase_backup_*.sql

# 查看文件内容（前 50 行）
head -n 50 supabase_backup_*.sql
```

#### 步骤 3: 导入到新数据库

```bash
# 导入到新的 Supabase 实例
psql -h <新数据库主机> \
  -U postgres \
  -d postgres \
  -f supabase_backup_YYYYMMDD_HHMMSS.sql
```

---

### 方案 2: 使用 Supabase CLI

#### 步骤 1: 导出数据

```bash
# 导出完整数据库
supabase db dump \
  --db-url "postgresql://postgres:[密码]@prspares.zeabur.app:5432/postgres" \
  --file supabase_dump.sql

# 或者分别导出
# 只导出结构
supabase db dump \
  --db-url "postgresql://postgres:[密码]@prspares.zeabur.app:5432/postgres" \
  --schema-only \
  --file schema.sql

# 只导出数据
supabase db dump \
  --db-url "postgresql://postgres:[密码]@prspares.zeabur.app:5432/postgres" \
  --data-only \
  --file data.sql
```

#### 步骤 2: 导入到新数据库

```bash
# 方法 1: 使用 Supabase CLI
supabase db push \
  --db-url "postgresql://postgres:[新密码]@<新主机>:5432/postgres" \
  --file supabase_dump.sql

# 方法 2: 使用 psql
psql -h <新主机> \
  -U postgres \
  -d postgres \
  -f supabase_dump.sql
```

---

### 方案 3: 使用自动化脚本

我已经为你创建了一个自动化迁移脚本。

#### 步骤 1: 配置目标数据库

编辑 `scripts/migrate-supabase.js` 或设置环境变量：

```bash
export NEW_SUPABASE_URL="https://your-new-instance.supabase.co"
export NEW_SUPABASE_ANON_KEY="your-new-anon-key"
export NEW_SUPABASE_SERVICE_ROLE="your-new-service-role-key"
```

#### 步骤 2: 运行迁移脚本

```bash
# 运行迁移
node scripts/migrate-supabase.js
```

脚本会：
- ✅ 从源数据库导出所有数据
- ✅ 保存本地备份到 `backups/` 目录
- ✅ 导入数据到新数据库
- ✅ 生成详细的迁移报告

---

### 方案 4: 使用数据库结构导出脚本

如果你只想先导出表结构：

```bash
# 给脚本添加执行权限
chmod +x scripts/export-schema.sh

# 运行导出脚本
./scripts/export-schema.sh
```

导出的结构文件将保存在 `supabase/exported_schema/` 目录。

---

## 迁移后配置

### 1. 更新环境变量

迁移完成后，需要更新项目的环境变量以连接新数据库。

#### 开发环境 (`.env.local`)

```bash
# 更新为新的 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-new-instance.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE=your-new-service-role-key
```

#### 生产环境

在你的部署平台（Vercel、Netlify 等）更新环境变量：
1. 登录部署平台
2. 进入项目设置
3. 更新环境变量
4. 重新部署应用

### 2. 验证 RLS 策略

确保新数据库中的 Row Level Security (RLS) 策略已正确设置：

```sql
-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 查看策略
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

如果策略缺失，运行项目中的 SQL 脚本：

```bash
# 在新数据库的 SQL Editor 中运行
# supabase/safe_create_products.sql
# supabase/products_schema.sql
```

### 3. 重建索引（可选）

```sql
-- 重建所有索引以优化性能
REINDEX DATABASE postgres;
```

---

## 验证和测试

### 1. 验证数据完整性

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 检查记录数
SELECT 
  'product_prices' as table_name, 
  COUNT(*) as record_count 
FROM product_prices
UNION ALL
SELECT 
  'products' as table_name, 
  COUNT(*) as record_count 
FROM products;
```

### 2. 测试 API 连接

创建测试脚本 `test-new-connection.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  // 测试查询
  const { data, error } = await supabase
    .from('product_prices')
    .select('*')
    .limit(5);

  if (error) {
    console.error('❌ 连接失败:', error);
  } else {
    console.log('✅ 连接成功!');
    console.log('数据示例:', data);
  }
}

test();
```

运行测试：

```bash
node test-new-connection.js
```

### 3. 测试网站功能

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 测试关键功能：
   - ✅ 产品列表页面加载
   - ✅ 产品搜索功能
   - ✅ 产品详情页面
   - ✅ 管理后台（如果有）
   - ✅ CSV 导入功能

---

## 常见问题

### Q1: 导出时提示 "password authentication failed"

**解决方案**:
1. 检查数据库密码是否正确
2. 从 Supabase Dashboard → Settings → Database 获取正确密码
3. 确保使用 `postgres` 用户

### Q2: 导入时出现 "permission denied" 错误

**解决方案**:
```bash
# 使用 service_role 权限导入
# 或在 SQL 中添加：
SET ROLE postgres;
```

### Q3: RLS 策略导致数据无法访问

**解决方案**:
```sql
-- 临时禁用 RLS 进行测试
ALTER TABLE product_prices DISABLE ROW LEVEL SECURITY;

-- 重新创建策略
DROP POLICY IF EXISTS "Public can view products" ON product_prices;
CREATE POLICY "Public can view products" 
  ON product_prices FOR SELECT 
  USING (true);

-- 重新启用 RLS
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
```

### Q4: 迁移后数据量不一致

**解决方案**:
```sql
-- 在源数据库和目标数据库分别运行
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Q5: 如何回滚到旧数据库？

**解决方案**:
1. 保留旧的环境变量配置
2. 在 `.env.local` 中切换回旧配置
3. 重启应用

---

## 数据库表结构

当前项目使用的主要表：

### `product_prices` 表
```sql
- id: uuid (主键)
- title: text (产品标题)
- url: text (产品链接)
- image: text (图片链接)
- price: numeric(12,2) (价格)
- currency: text (货币代码，如 USD)
- slug: text (URL 友好标识)
- clicks: integer (点击次数)
- created_at: timestamptz (创建时间)
```

### `products` 表
```sql
- id: uuid (主键)
- name: text (产品名称)
- slug: text (URL 标识)
- description: text (描述)
- regular_price: numeric(12,2) (常规价格)
- sale_price: numeric(12,2) (促销价格)
- images: jsonb (图片数组)
- status: text (状态: draft/publish)
- created_at: timestamptz (创建时间)
- updated_at: timestamptz (更新时间)
```

---

## 支持和帮助

如果遇到问题：

1. 📖 查看 [Supabase 官方文档](https://supabase.com/docs)
2. 💬 查看项目的 `README.md`
3. 🔍 检查迁移报告文件 `backups/*/migration_report.json`
4. 📝 查看备份的 JSON 文件确认数据完整性

---

## 迁移检查清单

完成迁移后，请确认：

- [ ] 所有表已成功创建
- [ ] 数据记录数一致
- [ ] RLS 策略已正确配置
- [ ] 索引已创建
- [ ] 环境变量已更新
- [ ] 应用可以正常连接新数据库
- [ ] 所有功能测试通过
- [ ] 生产环境配置已更新
- [ ] 旧数据库备份已保存
- [ ] 迁移文档已归档

---

**祝迁移顺利！** 🎉

