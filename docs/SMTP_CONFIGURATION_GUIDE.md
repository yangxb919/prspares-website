# SMTP 配置指南 - 自部署 Supabase

## 🚨 问题

自部署的 Supabase 实例（`https://prspares.zeabur.app`）没有配置 SMTP 邮件服务，导致密码重置邮件无法发送。

**错误信息**:
```
AuthApiError: Error sending recovery email
Status: 500
Code: unexpected_failure
```

---

## 💡 解决方案

### **方案 1: 配置 Gmail SMTP（推荐 - 免费）**

#### 步骤 1: 生成 Gmail 应用专用密码

1. **登录 Google 账号**
   - 访问: https://myaccount.google.com/

2. **启用两步验证**（如果还没启用）
   - 进入 **安全性** → **两步验证**
   - 按照提示完成设置

3. **生成应用专用密码**
   - 进入 **安全性** → **应用专用密码**
   - 选择应用: **邮件**
   - 选择设备: **其他（自定义名称）**
   - 输入名称: `Supabase PRSPARES`
   - 点击 **生成**
   - **保存生成的 16 位密码**（格式: xxxx xxxx xxxx xxxx）

#### 步骤 2: 配置 Supabase SMTP

1. **访问 Supabase Dashboard**
   ```
   https://prspares.zeabur.app
   ```

2. **进入 Authentication 设置**
   - 点击左侧菜单的 **Authentication**
   - 点击 **Settings** 标签
   - 找到 **SMTP Settings** 部分

3. **填写 SMTP 配置**
   ```
   Enable Custom SMTP: ✅ (勾选)
   
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Password: xxxx xxxx xxxx xxxx (应用专用密码)
   
   Sender Email: your-email@gmail.com
   Sender Name: PRSPARES
   ```

4. **保存配置**
   - 点击 **Save** 按钮

5. **测试邮件发送**
   - 返回网站，尝试密码重置功能
   - 应该能成功收到邮件

---

### **方案 2: 使用 SendGrid（推荐 - 专业）**

SendGrid 提供免费套餐（每天 100 封邮件）。

#### 步骤 1: 注册 SendGrid

1. **访问 SendGrid**
   - https://sendgrid.com/
   - 点击 **Start for Free**

2. **创建账号**
   - 填写注册信息
   - 验证邮箱

3. **创建 API Key**
   - 进入 **Settings** → **API Keys**
   - 点击 **Create API Key**
   - 名称: `Supabase PRSPARES`
   - 权限: **Full Access** 或 **Mail Send**
   - 点击 **Create & View**
   - **复制并保存 API Key**（只显示一次）

#### 步骤 2: 配置 Supabase SMTP

```
Enable Custom SMTP: ✅

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: <your-sendgrid-api-key>

Sender Email: your-verified-email@yourdomain.com
Sender Name: PRSPARES
```

---

### **方案 3: 使用 Resend（推荐 - 现代化）**

Resend 是一个现代化的邮件服务，专为开发者设计。

#### 步骤 1: 注册 Resend

1. **访问 Resend**
   - https://resend.com/
   - 点击 **Sign Up**

2. **创建 API Key**
   - 进入 **API Keys**
   - 点击 **Create API Key**
   - 名称: `Supabase PRSPARES`
   - 权限: **Sending access**
   - 点击 **Create**
   - **复制并保存 API Key**

#### 步骤 2: 配置 Supabase SMTP

```
Enable Custom SMTP: ✅

SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: <your-resend-api-key>

Sender Email: onboarding@resend.dev (或你的域名邮箱)
Sender Name: PRSPARES
```

---

### **方案 4: 临时切换到旧数据库（快速测试）**

如果你只是想快速测试密码重置功能，可以临时切换回旧的 Supabase 实例。

#### 使用切换脚本

```bash
# 切换到旧数据库（有邮件服务）
node scripts/switch-supabase-env.js

# 重启开发服务器
npm run dev
```

#### 手动切换

编辑 `.env.local` 文件：

**注释掉新数据库配置：**
```bash
# NEXT_PUBLIC_SUPABASE_URL=https://prspares.zeabur.app
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
# SUPABASE_SERVICE_ROLE=eyJhbGc...
```

**取消注释旧数据库配置：**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://eiikisplpnbeiscunkap.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE=eyJhbGc...
```

**重启服务器：**
```bash
npm run dev
```

---

## 🧪 测试 SMTP 配置

配置完成后，运行测试脚本：

```bash
node scripts/test-email-config.js
```

**预期输出（成功）：**
```
✅ Email sent successfully!
```

**预期输出（失败）：**
```
❌ Error sending email: ...
```

---

## 📧 SMTP 服务对比

| 服务 | 免费额度 | 优点 | 缺点 |
|------|---------|------|------|
| **Gmail** | 无限制（有速率限制） | 免费、简单、可靠 | 需要应用专用密码、可能被标记为垃圾邮件 |
| **SendGrid** | 100 封/天 | 专业、可靠、详细统计 | 需要验证域名（发送量大时） |
| **Resend** | 100 封/天 | 现代化、开发者友好 | 较新的服务 |
| **Mailgun** | 100 封/天 | 功能强大、API 友好 | 配置稍复杂 |
| **Amazon SES** | 62,000 封/月 | 便宜、可扩展 | 需要 AWS 账号、配置复杂 |

---

## 🔒 安全建议

1. **不要在代码中硬编码 SMTP 密码**
   - 使用环境变量
   - 不要提交到 Git

2. **使用应用专用密码**
   - 不要使用主账号密码
   - 定期更换密码

3. **限制 API Key 权限**
   - 只授予必要的权限
   - 定期审查和轮换

4. **监控邮件发送**
   - 设置发送限制
   - 监控异常活动

---

## 📝 邮件模板配置

配置 SMTP 后，你可能还需要自定义邮件模板。

### 在 Supabase Dashboard 中：

1. **进入 Authentication → Email Templates**

2. **编辑 Reset Password 模板**
   ```html
   <h2>Reset Your Password</h2>
   <p>Click the link below to reset your password:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   <p>This link will expire in 1 hour.</p>
   <p>If you didn't request this, please ignore this email.</p>
   ```

3. **确认重定向 URL**
   ```
   {{ .SiteURL }}/reset-password?type=recovery&token={{ .Token }}
   ```

---

## ❓ 常见问题

### Q1: Gmail SMTP 连接失败

**A**: 检查以下几点：
- 是否启用了两步验证
- 是否使用了应用专用密码（不是账号密码）
- 是否允许"不够安全的应用"访问（不推荐）

### Q2: 邮件进入垃圾箱

**A**: 
- 使用专业的 SMTP 服务（SendGrid、Resend）
- 配置 SPF、DKIM、DMARC 记录
- 使用自己的域名邮箱

### Q3: 发送速率限制

**A**:
- Gmail: 约 500 封/天
- SendGrid 免费版: 100 封/天
- 升级到付费计划以获得更高额度

### Q4: 如何验证 SMTP 配置

**A**:
```bash
# 运行测试脚本
node scripts/test-email-config.js

# 或在网站上测试
访问 /forgot-password 页面并提交
```

---

## 🎯 推荐配置

### 开发环境
- 使用 Gmail SMTP（简单、免费）
- 或临时切换到旧数据库

### 生产环境
- 使用 SendGrid 或 Resend（专业、可靠）
- 配置自定义域名邮箱
- 设置邮件监控和告警

---

## 📞 需要帮助？

如果配置过程中遇到问题：

1. 查看 Supabase 日志
2. 运行测试脚本查看详细错误
3. 检查 SMTP 服务商的文档
4. 联系开发团队

---

## ✅ 配置完成清单

- [ ] 选择 SMTP 服务提供商
- [ ] 创建账号并获取凭据
- [ ] 在 Supabase Dashboard 配置 SMTP
- [ ] 运行测试脚本验证配置
- [ ] 测试密码重置功能
- [ ] 自定义邮件模板（可选）
- [ ] 配置域名邮箱（生产环境）
- [ ] 设置监控和告警（生产环境）

---

**配置完成后，密码重置功能将正常工作！** 🎉

