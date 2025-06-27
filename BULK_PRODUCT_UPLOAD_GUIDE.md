# PRSPARES 批量上传产品指南

本指南介绍了几种不同的批量上传产品的方法，您可以根据自己的需求选择最适合的方式。

## 方法一：Web界面批量上传（推荐）

### 访问地址
```
http://localhost:3000/admin/products/bulk-upload
```

### 功能特性
- ✅ 支持CSV和JSON格式
- ✅ 提供模板文件下载
- ✅ 实时数据预览和验证
- ✅ 进度条显示上传状态
- ✅ 详细的错误报告
- ✅ 用户友好的界面

### 使用步骤
1. **下载模板**: 点击"下载CSV模板"或"下载JSON模板"
2. **填写数据**: 在模板中填入您的产品信息
3. **上传文件**: 选择格式并上传填好的文件
4. **预览数据**: 检查解析结果是否正确
5. **批量上传**: 点击"开始上传"进行批量导入

### 支持的字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | 文本 | ✅ | 产品名称 |
| regular_price | 数字 | ✅ | 常规价格 |
| slug | 文本 | - | 产品别名（自动生成） |
| sku | 文本 | - | 产品编号 |
| short_desc | 文本 | - | 简短描述 |
| description | 文本 | - | 详细描述 |
| sale_price | 数字 | - | 促销价格 |
| stock_status | 枚举 | - | instock/outofstock |
| status | 枚举 | - | draft/publish |
| category | 文本 | - | 产品分类 |
| images | 数组/字符串 | - | 图片URL |
| features | 数组/字符串 | - | 产品特性 |
| applications | 数组/字符串 | - | 应用场景 |
| materials | 数组/字符串 | - | 材料信息 |

### 格式示例

#### CSV格式
```csv
name,slug,sku,short_desc,description,regular_price,sale_price,stock_status,status,category,images,features,applications,materials
"iPhone 15 LCD Screen","iphone-15-lcd-screen","LCD-IP15-001","High quality LCD replacement screen","Premium LCD screen replacement for iPhone 15 with HD resolution and excellent touch response.",120.00,95.00,"instock","publish","displays","https://example.com/image1.jpg|https://example.com/image2.jpg","HD Resolution|Touch Sensitive|Easy Installation","Screen Repair|Display Replacement","LCD|Glass|Metal"
```

#### JSON格式
```json
[
  {
    "name": "iPhone 15 LCD Screen",
    "slug": "iphone-15-lcd-screen",
    "sku": "LCD-IP15-001",
    "short_desc": "High quality LCD replacement screen",
    "description": "Premium LCD screen replacement for iPhone 15 with HD resolution and excellent touch response.",
    "regular_price": 120.00,
    "sale_price": 95.00,
    "stock_status": "instock",
    "status": "publish",
    "category": "displays",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "features": ["HD Resolution", "Touch Sensitive", "Easy Installation"],
    "applications": ["Screen Repair", "Display Replacement"],
    "materials": ["LCD", "Glass", "Metal"]
  }
]
```

## 方法二：直接SQL导入（技术用户）

### 适用场景
- 🔧 技术人员直接操作数据库
- 📊 大量数据快速导入
- 🎯 需要精确控制数据结构

### 使用步骤
1. **编辑SQL文件**: 修改 `scripts/bulk-import-products.sql`
2. **登录Supabase**: 访问项目的SQL编辑器
3. **执行脚本**: 复制SQL内容并执行
4. **验证结果**: 查看导入的产品数据

### SQL文件位置
```
scripts/bulk-import-products.sql
```

### 示例SQL
```sql
INSERT INTO public.products (
  name, slug, sku, short_desc, description, 
  regular_price, sale_price, stock_status, status, images, meta
) VALUES
(
  'iPhone 14 Pro Max OLED原装屏幕',
  'iphone-14-pro-max-oled-original',
  'OLED-IP14PM-001',
  '原装OLED屏幕，支持ProMotion技术，120Hz刷新率',
  'iPhone 14 Pro Max原装OLED显示屏...',
  380.00,
  350.00,
  'instock',
  'publish',
  '[{"id": "1", "url": "https://example.com/image.jpg", "alt": "产品图片", "isPrimary": true}]'::jsonb,
  '{"features": ["原装OLED", "120Hz ProMotion"], "applications": ["iPhone 14 Pro Max维修"]}'::jsonb
);
```

## 方法三：API批量导入（开发者）

### 适用场景
- 🔄 与外部系统集成
- 🤖 自动化导入流程
- 📡 通过API进行数据同步

### API端点
```
POST /api/products/bulk
```

### 请求格式
```javascript
// 使用Fetch API
fetch('/api/products/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    products: [
      {
        name: "产品名称",
        regular_price: 100.00,
        // ... 其他字段
      }
    ]
  })
})
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "imported": 5,
    "failed": 1,
    "errors": ["产品名称重复"]
  }
}
```

## 数据准备建议

### 1. 图片准备
- **图片尺寸**: 建议800x600像素
- **图片格式**: JPG、PNG、WebP
- **图片质量**: 优化后控制在100KB以内
- **存储方式**: 上传到图床或使用Supabase Storage

### 2. 分类管理
确保产品分类已存在：
- displays（显示屏）
- batteries（电池）
- cameras（摄像头）
- charging（充电配件）
- speakers（扬声器）
- buttons（按键）
- cases（外壳）
- tools（工具）

### 3. 数据验证
- ✅ 产品名称不能为空
- ✅ 价格必须大于0
- ✅ slug必须唯一
- ✅ 图片URL必须有效
- ✅ 分类slug必须存在

## 常见问题解决

### Q1: 批量上传失败怎么办？
**A**: 检查以下几点：
1. 文件格式是否正确
2. 必填字段是否完整
3. 产品slug是否重复
4. 图片URL是否有效
5. 分类是否存在

### Q2: 如何处理重复产品？
**A**: 系统会自动检测slug重复，有以下选择：
1. 修改产品名称生成新的slug
2. 手动指定不重复的slug
3. 先删除重复产品再导入

### Q3: 图片显示不出来怎么办？
**A**: 检查图片URL：
1. 确保图片URL可以直接访问
2. 检查图片服务器的CORS设置
3. 考虑使用Supabase Storage存储图片

### Q4: 如何批量更新现有产品？
**A**: 目前支持的是新增产品，更新现有产品需要：
1. 通过SQL直接更新数据库
2. 使用API逐个更新
3. 先删除再重新导入

## 最佳实践

### 1. 分批导入
- 📦 每次不超过100个产品
- ⏱️ 避免超时问题
- 🔍 便于错误排查

### 2. 数据备份
- 💾 导入前备份现有数据
- 📝 保存导入日志
- 🔄 准备回滚方案

### 3. 测试导入
- 🧪 先用少量数据测试
- ✅ 验证数据格式正确性
- 📊 检查显示效果

### 4. 性能优化
- 🖼️ 优化图片大小和质量
- 🗜️ 压缩JSON/CSV文件
- ⚡ 使用CDN加速图片加载

## 技术支持

如果在批量上传过程中遇到问题，请提供以下信息：
1. 使用的上传方法
2. 文件格式和大小
3. 错误信息截图
4. 示例数据

---

**注意**: 批量上传功能需要管理员权限，请确保您已正确登录管理后台。 