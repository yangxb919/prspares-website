# 产品图片批量上传指南

## 🚀 快速开始（推荐方案）

### 方案一：使用图片助手工具 + 免费图床

#### 步骤1：上传图片到免费图床
1. 选择一个免费图床服务（推荐ImgBB、Imgur或Cloudinary）
2. 批量上传您的产品图片
3. 获取每张图片的直链URL

#### 步骤2：使用图片助手工具
1. 访问 `http://localhost:3000/admin/products/image-helper`
2. 逐个添加图片URL到列表中
3. 点击"复制JSON数组"获取格式化的图片数组

#### 步骤3：准备产品JSON文件
1. 使用 `products_template_draft.json` 作为模板
2. 将复制的图片URL数组粘贴到每个产品的 `images` 字段
3. 确保 `status` 字段设置为 `"draft"`（草稿状态）

#### 步骤4：批量上传产品
1. 访问 `http://localhost:3000/admin/products/bulk-upload`
2. 上传您的JSON文件
3. 产品将以草稿状态保存，不会在前台显示

## 方案二：使用Supabase Storage（需要配置）

### 步骤1：批量上传图片
1. 访问 `http://localhost:3000/admin/products/image-upload`
2. 选择您本地的产品图片文件（支持多选）
3. 等待上传完成
4. 点击"复制JSON数组"获取图片URL数组

### 步骤2-4：同方案一的步骤3-4

## 方案三：使用免费图床服务（手动）

### 推荐的免费图床：
1. **ImgBB** (https://imgbb.com/)
   - 免费，支持批量上传
   - 提供直链URL
   - 无需注册

2. **Imgur** (https://imgur.com/)
   - 免费，知名度高
   - 支持批量上传
   - 需要注册账号

3. **Cloudinary** (https://cloudinary.com/)
   - 免费额度较大
   - 专业图片处理
   - 需要注册账号

### 使用步骤：
1. 选择一个图床服务
2. 批量上传您的产品图片
3. 获取每张图片的直链URL
4. 在JSON文件中使用这些URL

## 方案三：本地图片服务器

如果您有技术能力，可以搭建本地图片服务器：

### 使用Node.js Express
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use('/images', express.static('uploads'));

app.post('/upload', upload.array('images'), (req, res) => {
  const urls = req.files.map(file => 
    `http://localhost:3001/images/${file.filename}`
  );
  res.json({ urls });
});

app.listen(3001);
```

## JSON文件格式示例

```json
[
  {
    "name": "产品名称",
    "slug": "product-slug",
    "sku": "SKU001",
    "short_desc": "产品简短描述",
    "description": "详细描述",
    "regular_price": 100.00,
    "sale_price": null,
    "stock_status": "instock",
    "status": "draft",
    "category": "accessories",
    "images": [
      "https://your-image-host.com/image1.jpg",
      "https://your-image-host.com/image2.jpg",
      "https://your-image-host.com/image3.jpg"
    ],
    "features": ["特性1", "特性2"],
    "applications": ["应用1", "应用2"],
    "materials": ["材料1", "材料2"]
  }
]
```

## 重要提示

1. **图片格式**：支持 JPG, PNG, GIF, WebP
2. **图片大小**：建议每张图片不超过 2MB
3. **图片尺寸**：建议 800x600 像素或更高
4. **图片质量**：确保图片清晰，展示产品细节
5. **产品状态**：使用 `"status": "draft"` 保存为草稿
6. **URL有效性**：确保图片URL可以直接访问

## 草稿管理

产品以草稿状态上传后：
1. 在后台管理页面可以看到所有草稿产品
2. 可以逐个编辑和完善产品信息
3. 确认无误后将状态改为 `publish` 发布
4. 只有发布状态的产品才会在前台显示

## 故障排除

### 图片不显示
- 检查图片URL是否可以直接访问
- 确认图片服务器支持CORS
- 检查图片格式是否支持

### 上传失败
- 检查网络连接
- 确认Supabase Storage配置正确
- 检查文件大小是否超限

### JSON格式错误
- 使用JSON验证工具检查格式
- 确保所有字符串都用双引号包围
- 检查逗号和括号是否匹配
