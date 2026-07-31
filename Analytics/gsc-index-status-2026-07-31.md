---
date: "2026-07-31"
source: "GSC 界面（ego-browser 实抓），数据截至 2026/7/24"
scope: "sc-domain:phonerepairspares.com 全站"
note: "界面读数用于看全局分布；单页收录判定一律以 URL Inspection API 为准（Analytics/scripts/gsc_inspect.py）"
---

# 全站收录现状：62 收录 / 222 未收录

## 一、总览

| | 页数 |
|---|---|
| **已编入索引** | **62** |
| **未编入索引** | **222** |

效果报告（07-02~07-29，28 天）：点击 **313** / 曝光 **4.23 万** / CTR **0.7%** / 平均排名 **8.4**。
热门查询里 `iphone boot loop repair cost` 曝光 **174 只有 1 点击**（CTR 0.57%）——与 8 月计划主线 B 的 CTR 单点完全对上。

## 二、未收录 222 页的构成

| 原因 | 页数 | 来源 | 判定 |
|---|---|---|---|
| **已发现 - 尚未编入索引** | **76** | Google | 🔴 **最大问题：全部从未被抓取** |
| **已抓取 - 尚未编入索引** | **43** | Google | 🔴 其中约 23 篇是博客正文 |
| 已被 robots.txt 屏蔽 | 58 | 网站 | ✅ 全是 `/blog?tag=xxx`，屏蔽正确 |
| 备用网页（有适当规范标记） | 18 | 网站 | ✅ canonical 归并的正常结果 |
| 网页会自动重定向 | 13 | 网站 | ⚠️ 多数是 apex/http 版本，正常；含 3 篇旧 slug 301 |
| 未找到 (404) | 9 | 网站 | ⚠️ 2 条可救、7 条是历史遗留 |
| 被"noindex"标记排除 | 4 | 网站 | ⚠️ `/news/*` ×3 + `/industry-insights`，待确认是否该彻底下线 |
| 重复网页，Google 选的规范页不同 | 1 | Google | — |

## 三、🔴 核心问题：143 篇已发布文章里，76 篇 Google 从未抓过（53%）

「已发现-尚未编入索引」的 76 页**全部是 `/blog/*` 正文，上次抓取日期一律显示"不适用"**——即 Google 知道这些 URL 存在（从 sitemap 得知），但**一次都没有派爬虫去读**。

抽样（与今天 llms.txt 工作的交叉）：

| 页面 | Google | ChatGPT 抓取 |
|---|---|---|
| `/blog/iphone-16-pro-max-screen-replacement-uk-guide` | **从未抓取** | 20 次 |
| `/blog/iphone-13-screen-replacement-worth-it-2026` | **从未抓取** | 16 次 |
| `/blog/common-iphone-screen-problems-2026` | **从未抓取** | 12 次 |
| `/blog/iphone-11-screen-replacement` | **从未抓取** | 9 次 |

→ **同一批内容，ChatGPT 在读，Google 连看都没看。** 这是今天归因复盘「GEO 才是当前主通道」最直接的结构性证据。

## 四、「已抓取-尚未编入索引」43 页的真实构成

不是 43 篇内容都有问题，拆开看约一半是 URL 规范化噪音：

- **~23 篇博客正文**（抓取日期 05-01 ~ 07-23）——真正的「抓了不收」，与 JK 页同类
- **~13 条 apex 域名版本**：`https://phonerepairspares.com/products`、`/about`、`/contact/`、`/blog` 等（无 www）
- **尾斜杠重复**：`/contact/` vs `/contact`、`/about/` vs `/about`、`/products/` vs `/products`
- **查询参数版本**：`/blog?category=sourcing-suppliers`、残留的 `/blog?tag=xxx`
- **2 条分类页**：`/blog/category/sourcing-suppliers`、`/blog/category/repair-guides`

> apex 版本被反复抓取，和今天归因复盘里发现的「AI 爬虫 22% 请求（289 次）撞 `/` 的 301」**是同一个根因**：站外/历史链接指向 apex，每次都要多一跳。

## 五、404 的 9 条：2 条可以立刻救回

| URL | 判定 |
|---|---|
| `/charging-port-failures-after-replacement` | 🟢 **缺 `/blog` 前缀**，文章存在（id170, publish）→ 加 301 |
| `/iphone-unknown-part-warning-screen-replacement-ic-transfer` | 🟢 **缺 `/blog` 前缀**，文章存在（id147, publish）→ 加 301 |
| `/blog/common-iphone-screen-quality-problems-wholesale` | 库里没有，真 404 |
| `/blog/replacement-parts-repeat-orders-repair-shops` | 库里没有，真 404 |
| `/wholesale-phone-parts-supplier-uk` | 历史页 |
| `/products/android-phone-parts-manufacturer-supplier` | 老产品页，已删 |
| `/products/samsung-phone-parts-oem` | 老产品页，已删 |
| `/products/mobile-phone-parts-odm-supplier` | 老产品页，已删 |
| `phonerepairspares.com/product/for-ipad-pro-11-2st-repair-parts/` | 老 WordPress 结构（`/product/` 单数） |

源码里没有指向前两条错误 URL 的链接，所以来自外链或历史索引——**这意味着有外部链接权重正打在 404 上**，加 301 是净收益。

## 六、这份数据对 8 月计划的修正

1. **主线 A 的规模被严重低估**。我今天处理的是 3 个页面（hub156 / 榜单文 / JK），实际卡住的是 **99 篇博客**（76 未抓 + 23 抓了不收）。好在今天修的 sitemap lastmod、IndexNow、内链权重重排都是全站性的，对这 99 页同样有效——但**逐页手动提交的路子彻底走不通**，76 页手动提交要提交到猴年。
2. **08-07 熔断的判据要改**。原判据是「三页仍未抓则熔断」——太窄。应改为看 **76 页未抓取的基数是否下降**。
3. **新增两个当天可做的小修**：2 条 404 → 301；apex/尾斜杠规范化（同时省下 AI 爬虫 22% 的浪费抓取）。
4. **CTR 问题被独立验证**：平均排名 8.4 但 CTR 0.7%，`iphone boot loop repair cost` 174 曝光 1 点击——主线 B 的 CTR 单点是对的。
