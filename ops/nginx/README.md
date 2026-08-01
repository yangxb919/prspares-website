# VPS nginx 配置

`prspares-site.conf` 是 VPS 上 `/etc/nginx/sites-enabled/prspares-site` 的副本，**仅供追溯**——
它不参与部署，改动必须在 VPS 上做，做完同步回这里。

## 🔴 sites-enabled 里绝不能放备份文件

`nginx.conf` 用的是 `include /etc/nginx/sites-enabled/*`（通配符，不限扩展名），所以
`prspares-site.bak.20260512` 这类文件会被当成真配置加载，导致每个 server_name 定义两遍：

```
nginx: [warn] conflicting server name "prspares.xyz" on 0.0.0.0:443, ignored
```

nginx 会忽略重复定义（保留第一个），功能不会立刻坏，但改配置可能改了不生效。
2026-08-01 已清理，备份统一放 `/etc/nginx/backup-<date>/`。

## 域名结构（2026-08-01 起）

| 来源 | 行为 |
|---|---|
| `phonerepairspares.com`（apex，http/https） | 301 → `www.phonerepairspares.com` |
| `www.phonerepairspares.com` | 200，proxy 到 `127.0.0.1:3000` |
| `prspares.xyz` / `www.prspares.xyz` 内容页 | **301 → 主域对应路径** |
| `prspares.xyz/api/*` | **200 直通**（见下） |
| 两个域名的 `/healthz` | 200 "ok" |

### 为什么 xyz 要 301
xyz 此前对爬虫返回 200 且内容与主域完全重复，Googlebot 把两个域名当独立站点各抓一遍，
瓜分本就紧张的抓取预算（近两周主域+xyz 合计仅 1218 次，是 AI 爬虫 6943 次的 1/6）。
canonical 只决定「算谁的分」，无法阻止抓取动作本身；301 还能把 xyz 的历史外链权重传给主域。

### 🔴 为什么 /api/ 必须排除在 301 之外
前端表单走**相对路径** POST `/api/send-rfq-email`。若 `/api/` 也 301，浏览器会把 POST
降级成 GET 并**丢弃 body** —— 在 301 生效前就已打开 xyz 页面的用户，点提交会直接丢询盘。
xyz 历史上承接过 12/88 的询盘，这条不能省。API 端点不是内容页，保留直通不影响去重目的。

### robots.txt 缓存头
上游 Next.js 返回 `Cache-Control: max-age=0`，导致 Googlebot 两周内重复抓 robots.txt
**303 次，占其全部抓取预算的 25%**。已在 nginx 层覆盖为 `max-age=86400`。
必须先 `proxy_hide_header Cache-Control` 再 `add_header`，否则两个头会同时下发。

## 改配置的安全流程

```bash
ssh prspares
BK=/etc/nginx/backup-$(date +%Y%m%d); mkdir -p $BK
cp /etc/nginx/sites-enabled/prspares-site $BK/prspares-site.orig
# ...改动...
nginx -t && systemctl reload nginx || cp $BK/prspares-site.orig /etc/nginx/sites-enabled/prspares-site
```

改完必须验证：主域 200、xyz 301、两个 /healthz 200、`/api/products` 在两个域名都 200。
