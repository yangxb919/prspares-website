# 📧 EmailJS 配置指南 - 5分钟快速上手

## 🎯 简介
EmailJS 是最简单的表单邮件解决方案，无需后端服务器即可发送邮件。

## 📋 配置步骤

### 1. 注册 EmailJS 账户
访问：https://www.emailjs.com/
- 点击 "Sign Up" 注册免费账户
- 免费版每月可发送 200 封邮件，足够小型网站使用

### 2. 添加邮箱服务
登录后点击 "Email Services" → "Add New Service"
推荐选择：
- **Gmail** (最简单)
- **Outlook** 
- **Yahoo**
- 或其他邮箱服务

### 3. 创建邮件模板
点击 "Email Templates" → "Create New Template"

**推荐模板内容：**
```
Subject: 网站联系表单 - 来自 {{from_name}}

Hello,

您收到一条来自 PRSPARES 网站的新消息：

姓名: {{from_name}}
邮箱: {{from_email}}
消息内容:
{{message}}

---
此邮件由 PRSPARES 网站自动发送
回复地址: {{reply_to}}
```

### 4. 获取配置密钥
在 EmailJS 控制台中获取：
- **Service ID**: 在 Email Services 中找到
- **Template ID**: 在 Email Templates 中找到  
- **Public Key**: 在 Account → API Keys 中找到

### 5. 配置环境变量
复制 `.env.example` 文件为 `.env.local`：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入实际的密钥：
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
NEXT_PUBLIC_CONTACT_EMAIL=info@prspares.com
```

### 6. 重启开发服务器
```bash
npm run dev
```

## ✅ 测试表单
1. 访问联系页面：http://localhost:3000/contact
2. 填写表单并提交
3. 检查您的邮箱是否收到邮件

## 🔧 故障排除

### 问题1: 没有收到邮件
- 检查垃圾邮件文件夹
- 确认 EmailJS 配置密钥正确
- 查看浏览器控制台是否有错误信息

### 问题2: 配置未生效
- 确保环境变量文件名为 `.env.local`
- 重启开发服务器 (`npm run dev`)
- 检查环境变量是否以 `NEXT_PUBLIC_` 开头

### 问题3: 超出免费额度
- 免费版每月 200 封邮件
- 可升级到付费版获得更多额度
- 或考虑其他邮件发送方案

## 🚀 优势总结
- ✅ **5分钟配置**：注册即用，无需服务器
- ✅ **免费额度**：每月200封邮件免费
- ✅ **稳定可靠**：专业邮件服务，送达率高
- ✅ **自动回退**：配置失败时自动切换到模拟模式

## 📞 需要帮助？
如果遇到问题，可以：
1. 查看 EmailJS 官方文档
2. 检查浏览器控制台错误信息
3. 联系技术支持 