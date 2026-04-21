# PRSPARES SEO 流量修复行动计划
**生成日期：** 2026-04-21
**基线数据（GSC 近 3 个月）：** 103 点击 / 7,520 展示 / 平均排名 9.7 / CTR 1.4%
**核心问题：** 139 篇文章里只有 30 篇被 Google 索引；非品牌词 3 个月仅带来 14 次点击

---

## 目录
- [问题一览](#问题一览)
- [阶段 1：本周（P0 · 紧急）](#阶段-1本周p0--紧急)
- [阶段 2：本月（P1 · 重要）](#阶段-2本月p1--重要)
- [阶段 3：下月+（P2 · 长期）](#阶段-3下月p2--长期)
- [验收指标](#验收指标)
- [每周固定检查项](#每周固定检查项)

---

## 问题一览

| # | 问题 | GSC 证据 | 影响权重 | 归属 |
|---|------|---------|---------|------|
| 1 | 110 篇文章"已发现-从未抓取" | 上次抓取："不适用" | ★★★★★ | 技术+内容 |
| 2 | 19 篇"已抓取-被拒索引" | 含 www/非 www 重复、长 slug | ★★★★ | 技术+内容 |
| 3 | CTR 只有 1.4%（正常 3–8%） | 3 篇有 400+ 展示 0–6 点击 | ★★★★★ | 内容 |
| 4 | 86% 点击来自品牌词 "prspares" | 103 里有 89 | ★★★ | 内容 |
| 5 | sitemap 里 14 个 404 + 20 个重定向 | 给 Google 的负面信号 | ★★★ | 技术 |
| 6 | www vs non-www canonical 分裂 | 首页数据被分到两行 | ★★★ | 技术 |
| 7 | tag/query 过滤页被抓取 | `/blog?tag=...` 出现在已抓取 | ★★ | 技术 |

---

## 阶段 1：本周（P0 · 紧急）

> 目标：**让 Google 重新愿意抓取剩余 110 篇文章**。核心手段：提升已索引文章的 CTR + 清理技术负面信号。

### ☐ T1. 重写 Top 10 高展示低点击文章的 Title + Meta（★★★★★）

**问题：** 3 篇文章 3 个月累计 2,215 次展示，只带来 8 次点击（CTR 0.36%）。Google 判定内容不匹配用户意图。

**要改的文章（按展示量降序）：**
1. `/blog/is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners` — 1,024 展示 / 6 点击
2. `/blog/which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business` — 695 展示 / 1 点击
3. `/blog/iphone-13-screen-replacement` — 496 展示 / 1 点击
4. 登录 GSC → 效果 → 网页 → 导出前 10 名

**改写原则：**
- **Title：** 数字 + 价格 + 年份 + 核心关键词，限 55–60 字符
  - ❌ `Is Your iPhone 14 Pro Max Back Glass Worth Fixing: The Complete Cost-Benefit Guide for Repair Shop Owners`
  - ✅ `iPhone 14 Pro Max Back Glass Fix: $89 vs $450 (2026 Shop Data)`
- **Meta description：** 140–155 字符，承诺具体收益，含 CTA
  - ❌ "Learn about iPhone 14 Pro Max back glass repair from our comprehensive guide..."
  - ✅ "Compare 3 back glass repair methods with real 2026 shop costs. See which saves $300/device and how top techs avoid re-cracks in 7 days."

**操作步骤：**
- [ ] 登录 Supabase → posts 表 → 找到这 10 篇
- [ ] 编辑 `meta.seo.title` 和 `meta.seo.description`
- [ ] 或者让我写脚本批量更新（提供一份表格：slug → new_title → new_description）

**验收：** 改完后用 GSC URL Inspection 工具点"请求编入索引"，1 周后看 CTR 是否 > 2%

**耗时：** 半天（脑力 + 复制粘贴）

**归属：** 人工（可让我协助起草文案）

---

### ☐ T2. 强制 www 301 重定向（统一 canonical）（★★★★）

**问题：** `phonerepairspares.com/` 和 `www.phonerepairspares.com/` 被 Google 视为两个站点，权重分散。

**现状证据：**
- GSC Top Pages 里首页同时出现 `www` 和无 `www` 两行（64 + 26 点击）
- 19 篇"已抓取未索引"里混有 `phonerepairspares.com/blog/` 和 `www.phonerepairspares.com/blog/`

**操作步骤：**
- [ ] 在 DNS/CDN 层（Vercel/Cloudflare）设置 `phonerepairspares.com` → `www.phonerepairspares.com` 301
- [ ] 或者在 `next.config.js` 加 redirects 规则（见代码实现参考）
- [ ] 验证：`curl -I https://phonerepairspares.com` 应返回 301 到 www 版本

**代码参考（我可以帮你加）：**
```js
// next.config.js 的 async redirects() 中新增
{
  source: '/:path*',
  has: [{ type: 'host', value: 'phonerepairspares.com' }],
  destination: 'https://www.phonerepairspares.com/:path*',
  permanent: true,
}
```

**验收：** Google 不再同时索引两个版本

**耗时：** 30 分钟

**归属：** 代码（我执行）

---

### ☐ T3. 从 sitemap 剔除 404 与已重定向 URL（★★★）

**问题：** sitemap 里 14 个 URL 返回 404，20 个被自动重定向。这是给 Google 的低质信号。

**操作步骤：**
- [ ] 导出 GSC → 网页索引编制 → 未找到(404) → 下载所有 URL
- [ ] 从 Supabase 查出这些 slug 对应的 post，改 status=draft 或删除
- [ ] 核对 `next.config.js` 的 redirects：已 301 的旧 URL 不该再被 sitemap 引用
- [ ] 修改 `next-sitemap.config.js`：对每个 slug 加一次 `fetch HEAD` 筛选（可选但推荐）

**代码参考（我可以帮你改）：**
```js
// next-sitemap.config.js 的 fetchPostSlugs 后加过滤
async function filterLive(slugs, base) {
  const results = await Promise.all(slugs.map(async s => {
    try {
      const r = await fetch(`${base}/blog/${s}`, { method: 'HEAD' });
      return r.status === 200 ? s : null;
    } catch { return null; }
  }));
  return results.filter(Boolean);
}
```

**验收：** 下次构建后 GSC 的「未找到 (404)」和「自动重定向」数应降到 < 5

**耗时：** 1 小时

**归属：** 代码 + 人工（删除 Supabase 中的废稿需要你判断）

---

### ☐ T4. 手动请求 20 篇重要文章重新索引（★★★★）

**问题：** 110 篇文章 Google 从未抓取，需要人工"敲门"让 Googlebot 来爬。

**操作步骤：**
- [ ] 从你 139 篇中挑 20 篇「**商业价值最高** + **关键词有搜索量**」的（优先 iPhone 15/16、battery、wholesale 主题）
- [ ] 登录 https://search.google.com/search-console
- [ ] 顶部搜索框输入每篇完整 URL
- [ ] 点「请求编入索引」（测试实际网址 → 请求编入索引）
- [ ] 每天最多 10 条，所以分 2 天完成

**验收：** 1–2 周后在 GSC 看这 20 个 URL 状态是否从「已发现」变为「已编入索引」

**耗时：** 2 × 20 分钟

**归属：** 人工（只能手动提交）

---

### ☐ T5. 屏蔽 tag/query 过滤页被抓取（★★）

**问题：** `/blog?tag=screen technology` 被 Google 抓取，URL 还带空格未编码，是低质信号。

**操作步骤：**
- [ ] 检查 `public/robots.txt` 是否已屏蔽带 query 的 blog URL
- [ ] 若无，添加：`Disallow: /blog?*`
- [ ] 已经有的 `robots: {index:false}` 配合生效

**代码参考（我可以帮你改）：**
```
User-agent: *
Disallow: /blog?*
Disallow: /admin
...
```

**验收：** GSC 里"已被 robots.txt 屏蔽"会计入这些 URL，不再出现在已抓取列表

**耗时：** 15 分钟

**归属：** 代码（我执行）

---

## 阶段 2：本月（P1 · 重要）

### ☐ T6. 内链网络建设：每篇加 3–5 条同主题内链（★★★★）

**问题：** 139 篇文章各自孤立，没有 internal link juice 流动，Google 难以识别主题集群。

**操作步骤：**
- [ ] 按主题分组（iPhone 屏幕 / 电池 / 采购指南 / 维修工具 / 问题排查）
- [ ] 每篇文章底部加 "Related Guides" 模块（目前有 `RelatedPosts` 组件，但是基于 `published_at` 近期，不是主题相关）
- [ ] 改造 `RelatedPosts`：按 `meta.tags` 或 `meta.category` 匹配
- [ ] 正文中用 markdown link 引用 3–5 篇同主题文章（需要逐篇人工编辑或用脚本+review）

**验收：** 爬虫会通过内链发现更多文章，「已发现-从未抓取」数持续下降

**耗时：** 1–2 周（视人工投入）

**归属：** 代码（改组件）+ 人工（正文内链）

---

### ☐ T7. 重构 19 篇"已抓取-未索引"文章（★★★★）

**问题：** Google 读过这些文章后决定不收录，说明内容质量不达标。

**样本：**
- `/blog/phone-lcd-parts-wholesale-quality-grades-pricing-supplier-guide`
- `/blog/are-substandard-mobile-batteries-killing-your-repair-business-the-complete-guide-...`（180 字符 slug）
- `/blog/how-can-you-capitalize-on-the-4552b-mobile-repair-boom-with-premium-wholesale-strategies`
- ...19 篇

**操作步骤：**
- [ ] 从 GSC 导出完整列表
- [ ] 对每篇做诊断：
  - Slug 是否 > 80 字符？→ 改短 + 设 301
  - 内容是否少于 800 字？→ 补充
  - 是否是其他文章的重复？→ 合并后 301
  - 是否只是 AI 通稿？→ 加原创数据/图表/案例
- [ ] 改完后去 GSC 手动请求重新索引

**验收：** 这 19 篇里至少 10 篇重新进入索引

**耗时：** 1 周

**归属：** 内容团队 + 代码（301 配置）

---

### ☐ T8. 合并重复文章（LCD 系列 / OLED test 系列）（★★★）

**问题：** 本地备份里看到 2 组重复内容：
- `phone-lcd-parts-wholesale-guide` vs `phone-lcd-parts-wholesale-quality-grades-pricing-supplier-guide`
- `iphone-oled-test-guide` vs `iphone-oled-test-guide-bilingual`

**操作步骤：**
- [ ] 从 GSC 看这 4 篇的排名/展示数据
- [ ] 保留数据较好的版本，另一篇 `status=draft` + 加 `next.config.js` 301
- [ ] 类似地，grep Supabase 找其他 focus keyword 重叠的文章

**验收：** 无重复 slug / 无重复主题关键词互相蚕食

**耗时：** 半天

**归属：** 人工 + 代码

---

### ☐ T9. 标准化 slug 长度（< 80 字符）（★★）

**问题：** 多篇 slug 超过 100 字符，Google 视为低质。

**操作步骤：**
- [ ] 脚本查出 Supabase 里 slug 长度 > 80 的 posts
- [ ] 人工改写为更短、关键词集中的新 slug
- [ ] 在 `next.config.js` 加旧→新 301 重定向

**验收：** 所有 slug ≤ 80 字符

**耗时：** 半天

**归属：** 人工 + 代码（我可以写脚本查出来）

---

### ☐ T10. 中英文内容加 hreflang（★★）

**问题：** 英文+中文文章混在 `/blog/` 下，Google 不知道给哪国用户看哪版。

**操作步骤：**
- [ ] 在 Supabase 的 `meta` 里加 `language: 'en' | 'zh'` 字段
- [ ] `generateMetadata` 里根据 language 加 `alternates.languages`
- [ ] 或者把中文文章迁移到 `/zh/blog/` 独立路径

**代码参考：**
```ts
alternates: {
  canonical: canonicalUrl,
  languages: {
    'en': `${SITE_URL}/blog/${slug}`,
    'zh': `${SITE_URL}/zh/blog/${slug}`,
  }
}
```

**验收：** GSC 国际化报告不再混淆

**耗时：** 1–2 天

**归属：** 代码（我执行）+ 内容人工分类

---

### ☐ T11. 给核心文章加 FAQ 结构化数据（★★★）

**问题：** 已索引 30 篇没有 FAQ schema，错过 SERP 折叠答案展位。

**操作步骤：**
- [ ] 筛选 Top 20 商业意图文章
- [ ] 每篇在正文中加 3–5 个 FAQ Q&A（答 150 字以内）
- [ ] `generateMetadata` 检测正文 FAQ 段，自动输出 JSON-LD FAQPage schema

**验收：** SERP 出现可折叠的 Q&A，CTR 提升 2–3x

**耗时：** 2–3 天

**归属：** 代码 + 内容

---

## 阶段 3：下月+（P2 · 长期）

### ☐ T12. 建立外链（★★★★）

**问题：** 没有外链，新站点 Google 不信任。

**渠道：**
- [ ] Reddit r/mobilerepair、r/iphone、r/techsupport — 答专业问题，签名带链接
- [ ] Quora — 同样策略，回答手机维修 / 采购问题
- [ ] 行业论坛：GSMHosting、REWA Academy 评论区
- [ ] LinkedIn 写 1–2 篇行业分析，挂链接
- [ ] 联系 3–5 家手机维修博主做客座稿（guest post）

**目标：** 3 个月拿到 10+ DA 30+ 的自然外链

**耗时：** 持续

**归属：** 市场/你

---

### ☐ T13. Google Business Profile 关联（★★）

- [ ] 创建/认领 Google Business Profile（depending on your physical location）
- [ ] 关联 `www.phonerepairspares.com`
- [ ] 增强本地 SEO + 品牌实体信号

**耗时：** 2 天（含 Google 验证）

**归属：** 人工

---

### ☐ T14. 每周发 1–2 篇高质量新文章（★★★）

**问题：** 2026-03 发 56 篇 + 2026-04 发 53 篇，过于"砸量"被 Google 怀疑 AI 通稿。

**新节奏：**
- [ ] 每周 1–2 篇，每篇 2000+ 字
- [ ] 必含：原创数据 / 图表 / 实拍图 / 案例
- [ ] 发布前用 Surfer SEO 或 Clearscope 检查关键词覆盖

**耗时：** 持续

**归属：** 内容团队

---

### ☐ T15. 每月跑一次 GSC + GA4 交叉分析（★★）

- [ ] 导出 GSC 点击数据 vs GA4 landing page 数据
- [ ] 找 "有展示无点击" 文章 → 改写
- [ ] 找 "有点击跳出率高" 文章 → 改开头 / 改内容结构

**耗时：** 每月半天

**归属：** 你（或让我写自动化报告脚本）

---

## 验收指标

### 本周（2026-04-21 → 2026-04-28）
- [ ] sitemap 404 数：14 → < 3
- [ ] 重定向数：20 → < 5
- [ ] Top 10 文章 title/meta 已改写
- [ ] 20 篇重要文章手动请求索引

### 本月（→ 2026-05-21）
- [ ] 已编入索引：30 → **80+**
- [ ] 已发现-未抓取：110 → **< 30**
- [ ] 非品牌词点击：14 → **50+**
- [ ] 平均 CTR：1.4% → **> 3%**

### 3 个月（→ 2026-07-21）
- [ ] 已编入索引：30 → **120+**
- [ ] 月度 organic 点击：40 → **500+**
- [ ] 平均排名：9.7 → **< 7**
- [ ] Organic 占站点流量：2–11% → **30%+**

---

## 每周固定检查项

| 频率 | 项目 | 入口 |
|-----|------|------|
| 每日 | GA4 流量同步（你已有 SOP） | `~/ga4-sync-prompt.md` |
| 每周一 | GSC 效果报告对比上周 | search.google.com/search-console |
| 每周 | 新文章发布前 SEO 自查（slug、meta、内链） | — |
| 每月 1 号 | 未索引 URL 清单导出 + 重提交 | GSC 网页索引编制 |
| 每月 1 号 | sitemap 健康度审计 | `grep -c "<loc>" public/sitemap-0.xml` |

---

## 谁来做什么（快速分工）

### 我（Claude Code）可以立即执行
- T2 强制 www 301（代码改 next.config.js）
- T3 sitemap 过滤 404（改 next-sitemap.config.js）
- T5 屏蔽 tag/query 抓取（改 robots.txt）
- T9 查出长 slug（脚本）
- T10 hreflang 配置（代码）
- T11 FAQ 自动注入（代码）
- T15 月度分析脚本（自动化）

### 需要你（或内容团队）做
- T1 改 10 篇 title/meta 文案
- T4 GSC 手动请求索引（Google 不允许自动化）
- T7 重写 19 篇低质文章
- T12 外链建设
- T13 Google Business Profile
- T14 持续内容生产

### 需要协作
- T6 内链（我改组件 + 你/团队审文案）
- T8 合并重复文章（你判断保哪篇 + 我做 301）

---

## 下一步

**建议先让我批量处理能立即执行的代码类任务（T2 + T3 + T5），1 小时内完成并推送。之后你再逐条推进人工任务（T1、T4）。**

告诉我："**开始执行 T2 T3 T5**" 或者其他你想先做的任务编号。
