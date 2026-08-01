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

## 日志格式（2026-08-01 起）

`nginx.conf` 里定义了 `main_host`，在 combined 基础上**行尾追加** `host=` 与 `rt=`：

```
log_format main_host '$remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" host=$host rt=$request_time';
```

### 🔴 为什么必须追加在行尾
前 8 个字段与 combined 完全一致，所以 `awk '{print $7}'` 取 URL、`$9` 取状态码的既有脚本
和**全部历史日志**都继续可用。把新字段插在开头会让所有字段位移，之前写的爬虫分析命令全废。

### 为什么要加这两个字段
- `host=`：两个域名共用一份 access.log，此前无法区分 `prspares.xyz` 与主域的抓取量。
  2026-07-31 统计出的「Googlebot 1218 次」其实是**两域合计**，主域实际值更低。
- `rt=`：此前无法验证 Googlebot 的响应耗时（曾被怀疑是 1GB VPS 的抓取瓶颈，但因日志缺字段无法证实）。

### 常用查询

```bash
# 只看主域的 Googlebot 抓取（2026-08-01 之后的日志才有 host 字段）
grep -a 'host=www.phonerepairspares.com' access.log | grep -a Googlebot | awk '{print $7}' | sort | uniq -c | sort -rn

# 各域名的爬虫抓取量对比
grep -a Googlebot access.log | grep -oE 'host=[^ ]+' | sort | uniq -c

# Googlebot 响应耗时分布（找慢请求）
grep -a Googlebot access.log | grep -oE 'rt=[0-9.]+' | cut -d= -f2 | sort -rn | head -20
```

历史日志（08-01 之前）没有这两个字段，按 host 过滤会得到空结果 —— 这是预期行为，不是脚本坏了。
