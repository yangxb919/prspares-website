# PRSPARES SEO 紧急修复执行方案（P0）

更新时间：2026-02-23  
适用站点：`phonerepairspares.com`  
目标：先止损（纠正权重错投和抓取入口错误），再恢复索引与排名增长。

---

## 0. 执行前决策（必须先确认）

先统一唯一主域（Canonical 主域），建议：

- `https://www.phonerepairspares.com`

> 说明：本文所有示例都按 `www` 主域写。若你决定不用 `www`，需要全量替换为不带 `www` 的版本。

---

## 1. 必须马上修改的先后顺序

1. 修 canonical 与站点基础 URL（最高优先级）  
2. 修 robots/sitemap（爬虫入口）  
3. 做 HTTP/Host 301 规范化  
4. 处理 `/seo` 404（先 301 止损）  
5. 修历史文章数据库中的旧 canonical  
6. 提交 Search Console 并复检

---

## 2. 代码层修改（P0）

## 2.1 修主域与 canonical（全站）

### 文件 1：`/Users/yangxiaobo/Desktop/prspares-website/src/app/layout.tsx`

将硬编码域名 `https://prspares.com` 改为环境变量：

```ts
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');
```

并同步修改：

- `metadataBase: new URL(SITE_URL)`
- `alternates.canonical: '/'`
- JSON-LD:
  - `organizationSchema.url = SITE_URL`
  - `organizationSchema.logo = ${SITE_URL}/PRSPARES1%20.png`（建议后续移除文件名空格）

---

### 文件 2-5：产品页 metadata（全部从 `prspares.com` 改为主域或相对路径）

- `/Users/yangxiaobo/Desktop/prspares-website/src/app/products/screens/layout.tsx`
- `/Users/yangxiaobo/Desktop/prspares-website/src/app/products/batteries/layout.tsx`
- `/Users/yangxiaobo/Desktop/prspares-website/src/app/products/repair-tools/layout.tsx`
- `/Users/yangxiaobo/Desktop/prspares-website/src/app/products/small-parts/layout.tsx`

重点修改字段：

- `openGraph.url`
- `alternates.canonical`
- `openGraph.images` / `twitter.images`（建议使用相对路径或统一主域变量）

---

### 文件 6：自动 SEO 生成器（防止继续生成错误 canonical）

- `/Users/yangxiaobo/Desktop/prspares-website/src/utils/auto-seo-generator.ts`

将全部 `https://prspares.com` 改为 `SITE_URL` 变量来源，覆盖：

- `openGraph.url`
- `canonical`
- JSON-LD 中 `baseUrl`、`articleUrl`、默认图片地址

---

## 2.2 修 sitemap 与 robots

### 文件 7：`/Users/yangxiaobo/Desktop/prspares-website/next-sitemap.config.js`

修改为：

```js
const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.phonerepairspares.com';
```

并修正：

- `siteUrl: siteUrl`
- `robotsTxtOptions.additionalSitemaps = [\`${siteUrl}/sitemap.xml\`]`

更新 `exclude`，至少排除以下非 SEO 页面：

- `/admin`
- `/admin/*`
- `/auth/*`
- `/api/*`
- `/demo-seo-scoring`
- `/test-seo`
- `/test-input`
- `/test-markdown`
- `/image-optimization-demo`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/logout`

---

### 文件 8：`/Users/yangxiaobo/Desktop/prspares-website/public/robots.txt`

建议改为：

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Sitemap: https://www.phonerepairspares.com/sitemap.xml
```

说明：

- `Host:` 字段建议删除（Google 不依赖）。

---

## 2.3 处理 `/seo` 路由 404（先止损）

### 文件 9：`/Users/yangxiaobo/Desktop/prspares-website/next.config.js`

增加重定向（优先止损）：

```js
async redirects() {
  return [
    { source: '/seo', destination: '/blog', permanent: true },
  ];
}
```

> 后续如需真正承接 “SEO 服务页/说明页”流量，再新增 `src/app/seo/page.tsx`，届时移除这条重定向。

---

## 3. 服务器层修改（Nginx，P0）

目标：统一到 `https://www.phonerepairspares.com`，修复当前 `http://` 返回 404 的问题。

参考配置：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name phonerepairspares.com www.phonerepairspares.com;
    return 301 https://www.phonerepairspares.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name phonerepairspares.com;
    return 301 https://www.phonerepairspares.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.phonerepairspares.com;

    # ssl_certificate ...
    # ssl_certificate_key ...

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 4. 数据库修复（历史文章 canonical 回写）

在 Supabase SQL Editor 执行：

```sql
-- 1) 修 posts.meta.canonical
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{canonical}',
  to_jsonb(
    regexp_replace(
      coalesce(meta->>'canonical',''),
      '^https://(www\\.)?prspares\\.com',
      'https://www.phonerepairspares.com'
    )
  ),
  true
)
where coalesce(meta->>'canonical','') ~ '^https://(www\\.)?prspares\\.com';

-- 2) 修 posts.meta.open_graph.url
update posts
set meta = jsonb_set(
  coalesce(meta, '{}'::jsonb),
  '{open_graph,url}',
  to_jsonb(
    regexp_replace(
      coalesce(meta#>>'{open_graph,url}',''),
      '^https://(www\\.)?prspares\\.com',
      'https://www.phonerepairspares.com'
    )
  ),
  true
)
where coalesce(meta#>>'{open_graph,url}','') ~ '^https://(www\\.)?prspares\\.com';
```

---

## 5. 发布步骤（按顺序执行）

在服务器或部署环境：

```bash
cd /Users/yangxiaobo/Desktop/prspares-website

export SITE_URL=https://www.phonerepairspares.com
export NEXT_PUBLIC_SITE_URL=https://www.phonerepairspares.com

npm run build:fast
pm2 restart prspares-website
```

---

## 6. 上线后验收（必须全部通过）

执行：

```bash
curl -I http://phonerepairspares.com/
curl -I http://www.phonerepairspares.com/
curl -I https://phonerepairspares.com/
curl -I https://www.phonerepairspares.com/seo
curl -s https://www.phonerepairspares.com/robots.txt
curl -s https://www.phonerepairspares.com/sitemap.xml
curl -s https://www.phonerepairspares.com/ | rg -o '<link rel="canonical"[^>]+>'
```

预期：

- 前 3 条请求均为 `301` 到 `https://www.phonerepairspares.com/...`
- `/seo` 为 `301` 到 `/blog`（或你后续新建页面后为 `200`）
- robots/sitemap 只出现 `www.phonerepairspares.com`
- 首页 canonical 不再出现 `prspares.com`

---

## 7. Search Console 操作（当天完成）

1. 在 GSC 添加并验证属性（建议域属性 + URL 前缀属性）。  
2. 提交：
   - `https://www.phonerepairspares.com/sitemap.xml`
3. URL 检查并请求抓取：
   - 首页
   - `/products/screens`
   - `/products/batteries`
   - `/products/repair-tools`
   - 3-5 篇核心博客
4. 覆盖率里确认 canonical 已转为你主域。

---

## 8. 风险与回滚

- 风险：主域切换期间，短期抓取会波动。  
- 回滚策略：
  - 保留上一版 Nginx 配置备份；
  - 代码层通过 Git 回退；
  - 不回滚 canonical 到 `prspares.com`（这会继续丢权重）。

---

## 9. 完成标准（Definition of Done）

- [ ] 全站 canonical 统一为 `https://www.phonerepairspares.com`
- [ ] robots/sitemap 全部指向正确主域
- [ ] HTTP 与非主域全部 301 到主域 HTTPS
- [ ] `/seo` 不再 404
- [ ] 历史文章 canonical 清洗完成
- [ ] GSC sitemap 提交成功且可抓取

