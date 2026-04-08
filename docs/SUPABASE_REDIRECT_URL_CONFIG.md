# Supabase 重定向 URL 配置指南

## 🚨 问题

密码重置邮件中的链接指向了错误的域名：
```
https://eiikisplpnbeiscunkap.supabase.co/reset-password?token=...
```

但你的网站实际运行在：
- 开发环境: `http://localhost:3005`
- 生产环境: `https://prspares.xyz`

这导致用户点击链接后无法正确重置密码，出现 "Auth session missing!" 错误。

---

## 💡 解决方案

### **步骤 1: 配置 Supabase 重定向 URL**

1. **访问 Supabase Dashboard**
   ```
   https://eiikisplpnbeiscunkap.supabase.co
   ```

2. **进入 Authentication 设置**
   - 点击左侧菜单的 **Authentication**
   - 点击 **URL Configuration** 标签

3. **配置 Site URL**
   
   **开发环境：**
   ```
   Site URL: http://localhost:3005
   ```
   
   **生产环境：**
   ```
   Site URL: https://prspares.xyz
   ```

4. **添加 Redirect URLs**
   
   在 **Redirect URLs** 部分添加以下 URL（每行一个）：
   
   ```
   http://localhost:3000/reset-password
   http://localhost:3001/reset-password
   http://localhost:3002/reset-password
   http://localhost:3003/reset-password
   http://localhost:3004/reset-password
   http://localhost:3005/reset-password
   http://localhost:3000/auth/reset-password
   http://localhost:3005/auth/reset-password
   https://prspares.xyz/reset-password
   https://prspares.xyz/auth/reset-password
   https://www.prspares.xyz/reset-password
   https://www.prspares.xyz/auth/reset-password
   ```

5. **保存配置**
   - 点击 **Save** 按钮

---

### **步骤 2: 配置邮件模板重定向 URL**

1. **进入 Email Templates**
   - 在 Authentication 页面
   - 点击 **Email Templates** 标签

2. **编辑 Reset Password 模板**
   - 找到 **Reset Password** 模板
   - 点击 **Edit**

3. **更新重定向 URL**
   
   找到模板中的 `{{ .ConfirmationURL }}` 或类似的变量，确保使用正确的格式：
   
   **开发环境：**
   ```html
   <a href="{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery">Reset Password</a>
   ```
   
   **或者使用完整 URL：**
   ```html
   <a href="http://localhost:3005/reset-password?token={{ .Token }}&type=recovery">Reset Password</a>
   ```
   
   **生产环境：**
   ```html
   <a href="https://prspares.xyz/reset-password?token={{ .Token }}&type=recovery">Reset Password</a>
   ```

4. **保存模板**
   - 点击 **Save** 按钮

---

### **步骤 3: 更新代码中的重定向 URL**

#### App Router 版本 (`src/app/forgot-password/page.tsx`)

确保代码中使用正确的重定向 URL：

```typescript
const origin = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${origin}/reset-password`,
});
```

#### Pages Router 版本 (`src/pages/auth/forgot-password.tsx`)

```typescript
const origin = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${origin}/auth/reset-password`,
});
```

---

### **步骤 4: 添加环境变量**

在 `.env.local` 文件中添加：

```bash
# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3005

# 生产环境使用：
# NEXT_PUBLIC_SITE_URL=https://prspares.xyz
```

---

## 🧪 测试流程

### **测试步骤：**

1. **清除浏览器缓存和 Cookies**
   - 按 `Cmd+Shift+Delete` (Mac) 或 `Ctrl+Shift+Delete` (Windows)
   - 清除所有数据

2. **访问忘记密码页面**
   ```
   http://localhost:3005/forgot-password
   ```

3. **输入邮箱并提交**
   ```
   例如: lijiedong08@gmail.com
   ```

4. **检查邮件**
   - 打开收到的重置邮件
   - 检查链接是否指向正确的域名
   - 应该是: `http://localhost:3005/reset-password?token=...&type=recovery`

5. **点击链接**
   - 应该跳转到重置密码页面
   - 不应该出现 "Auth session missing!" 错误

6. **输入新密码**
   - 新密码: 至少 6 个字符
   - 确认密码: 必须一致

7. **提交并验证**
   - 应该显示成功消息
   - 自动跳转到登录页面

8. **使用新密码登录**
   - 验证新密码是否生效

---

## 🔍 调试技巧

### **检查邮件链接**

收到重置邮件后，右键点击"Reset Password"按钮，选择"复制链接地址"，检查 URL 格式：

**正确格式：**
```
http://localhost:3005/reset-password?token=xxx&type=recovery
```

**错误格式：**
```
https://eiikisplpnbeiscunkap.supabase.co/reset-password?token=xxx&type=recovery
```

### **检查浏览器控制台**

打开浏览器开发者工具（F12），查看 Console 标签：

**成功的日志：**
```
Reset password page loaded with params: { type: 'recovery', token: 'present' }
Verifying token and establishing session...
Token verified successfully, session established: { ... }
```

**失败的日志：**
```
Token verification error: { ... }
```

### **检查 Network 标签**

在 Network 标签中查看 API 请求：

1. 找到 `/auth/v1/verify` 请求
2. 检查 Request Payload
3. 检查 Response

---

## ⚠️ 常见问题

### Q1: 邮件链接还是指向错误的域名

**A**: 
1. 确认 Supabase Dashboard 中的 Site URL 配置正确
2. 清除浏览器缓存
3. 重新发送重置邮件

### Q2: 点击链接后显示 "Invalid or expired password reset link"

**A**:
1. 检查 token 是否过期（1 小时有效期）
2. 确认 Redirect URLs 中包含了正确的 URL
3. 重新请求重置链接

### Q3: 显示 "Auth session missing!"

**A**:
1. 确认代码中已添加 `verifyOtp` 调用
2. 检查浏览器是否阻止了 Cookies
3. 尝试在无痕模式下测试

### Q4: 本地开发正常，生产环境失败

**A**:
1. 确认生产环境的 Site URL 配置正确
2. 确认 Redirect URLs 包含生产域名
3. 检查 HTTPS 证书是否有效

---

## 📝 配置清单

- [ ] 在 Supabase Dashboard 配置 Site URL
- [ ] 在 Supabase Dashboard 添加所有 Redirect URLs
- [ ] 更新邮件模板中的重定向 URL
- [ ] 在 `.env.local` 添加 `NEXT_PUBLIC_SITE_URL`
- [ ] 确认代码中使用 `verifyOtp` 验证 token
- [ ] 清除浏览器缓存和 Cookies
- [ ] 测试完整的密码重置流程
- [ ] 验证邮件链接指向正确的域名
- [ ] 确认密码重置成功

---

## 🎯 最终配置示例

### **Supabase Dashboard - URL Configuration**

```
Site URL: http://localhost:3005

Redirect URLs:
http://localhost:3005/reset-password
http://localhost:3005/auth/reset-password
https://prspares.xyz/reset-password
https://prspares.xyz/auth/reset-password
```

### **.env.local**

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3005
NEXT_PUBLIC_SUPABASE_URL=https://eiikisplpnbeiscunkap.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### **邮件模板**

```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
```

---

## ✅ 完成后

配置完成后，密码重置功能应该完全正常工作：

1. ✅ 邮件链接指向正确的域名
2. ✅ 点击链接后成功建立会话
3. ✅ 可以成功更新密码
4. ✅ 自动跳转到登录页面
5. ✅ 可以使用新密码登录

---

**如果还有问题，请检查浏览器控制台的错误信息，并参考上面的调试技巧！** 🚀

