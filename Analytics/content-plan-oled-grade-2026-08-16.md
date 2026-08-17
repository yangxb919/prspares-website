# OLED 等级词族内容方案（按视频五步法执行）

生成日期：2026-08-16
方法论来源：「從 0 到被 Google 看見：AI 時代的 SEO 生存指南」步骤③④
数据来源：GSC 2026-07-18~08-14（含 query×page）、DataForSEO 实时 SERP（US）、竞品正文抓取

---

## 步骤③：找关键词 + 判断搜索意图

### 全站意图分布（GSC 2,866 词 / 8,907 曝光）

| 意图 | 词数 | 曝光占比 | 点击 | 均位 |
|---|---|---|---|---|
| Info | 2,690 | **89.5%** | 33 | 8.0 |
| CI | 101 | 5.6% | 1 | 11.2 |
| Trans（B2B 钱词） | 74 | 4.7% | 1 | **23.7** |
| Nav（品牌词） | 1 | 0.3% | 23 | 1.0 |

**结论**：Trans 意图的词全部在第 3 页开外（均位 23.7），28 天只拿到 1 次点击。
Info 词占 89.5% 曝光却几乎不转化 —— 因为排的是消费者维修词。

### 错配实证：曝光 TOP3 文章排的是什么词

| 文章 | 曝光 | 点击 | CTR | 主力词 |
|---|---|---|---|---|
| iphone-11-screen-replacement-worth-it-2026 | 2,763 | 9 | 0.33% | "iphone screen repair near me"(#2.1)、"iphone 11 screen replacement cost" |
| samsung-s23-s24-screen-replacement-guide | 1,912 | 11 | 0.58% | "s23 ultra screen replacement cost" |
| iphone-14-pro-max-back-glass | 1,202 | 4 | 0.33% | "iphone back glass repair"(#4.6) |

这三篇吃掉 65% 曝光。排名不差（均位 6-9），CTR 却只有 0.33%。
原因不是标题写得烂，是**接错人**：搜 "screen repair near me" 的是要找维修店的消费者，不是批发买家。

### 选定目标：OLED 等级对比词族（CI 意图）

| 查询词 | GSC 曝光 | GSC 排名 | 月搜量 | 难度 | CPC |
|---|---|---|---|---|---|
| incell vs oled | 31 | 10.6 / 12.9 | **320** | 0 | $0.30 |
| soft oled vs hard oled | 60 | 6.5 / 6.6 | **170** | 0 | **$2.08** |
| best iphone screen replacement brand | — | — | 90 | 0 | $1.66 |
| hard oled vs soft oled vs incell | 28 | 4.7 / 8.1 | 20 | — | $1.92 |
| soft oled vs original | 13 | 8.5 | 10 | — | — |

**为什么选它**（对齐视频判据「用户真的在搜、我们又答得比别人好」）：
- 用户真的在搜：合计 ~610/月，GSC 已有 188 曝光实证
- 难度 0，我们已在第 1-2 页 —— 临门一脚
- CI 意图 = 买家下单前最后确认，正是 B2B 决策时刻
- CPC $2.08 说明有人愿为它付广告费（商业价值被市场验证）
- **我们答得比别人好**：见下方独家资产

### 发现的问题：关键词蚕食

`soft oled vs hard oled` 同时被两个页面承接，互相稀释：
- `/products/screens-grade-guide`（排 6.6）
- `/blog/lcd-vs-oled-hard-soft-oled-repair-shops`（排 6.5）

---

## 步骤④：SERP 分析（实时抓取，US）

### SERP 形态

- **有 AI Overview**（引用 11 个来源，**我们不在其中**）
- People Also Ask ×4
- Reddit 讨论块（r/mobilerepair 排 #2）
- YouTube ×2（#11、#16）
- **我们排 #22**（grade-guide 页）；那篇博客**完全不在前 22 —— 因为它 8/10 起 404 了**

AIO 引用来源：reddit、lcd-phone.com、instagram、sqlcd.com、**shop.rewa.tech**、youtube×4、ifixit、irepart

### ① 内容主要写给谁

| 站点 | 排名 | 词数 | 写给谁 |
|---|---|---|---|
| reddit r/mobilerepair | 2 | — | 技师同行互问（真人经验） |
| lcd-phone.com | 6 | 403 | 供应商 |
| quickfixiphone.com | 7 | 795 | **消费者**（"Protecting Your iPhone Screen"） |
| shop.rewa.tech | 8 | 3,851 | 维修店/技师 |
| sqlcd.com | 10 | 2,353 | 维修店（含采购决策） |
| irepart.com | 14 | 1,814 | 维修店 |
| world-itech.com | 15 | 2,023 | 维修店（全等级科普） |
| panoxdisplay.com | 17 | 1,248 | OEM 采购 |

**主流读者是维修店/技师**，不是消费者。我们的 B2B 定位与 SERP 主流一致 —— 这个词值得打。

### ② 普遍包含的共同主题（= 用户需要的核心信息）

几乎每篇都有：定义（soft/hard）→ 基板差异（塑料 polyimide vs 玻璃）→ 耐摔性 → 画质 → 厚度/边框贴合 → 价格 → 怎么选（预算 vs 高端）

头部两篇额外有：
- 与 LCD/incell 的**三方**对比（rewa、sqlcd）
- 机型兼容性（rewa、sqlcd）
- 安装差异 for technicians（sqlcd）
- **Customer Return Rates 行业趋势**（sqlcd 独有）

### ③ 哪些信息过时或不完整（← 我们的机会）

| 站点 | 问题 |
|---|---|
| quickfixiphone (#7) | **2023 年内容，只提到 iPhone X**，严重过时却排第 7 |
| world-itech (#15) | 只提 iPhone X |
| panoxdisplay (#17) | 无机型、无价格，纯技术科普 |
| sqlcd (#10) | 机型只到 iPhone 14；价格是**零售价** $29.59-$55.99 |
| irepart (#14) | 价格 $60-70，零售价 |
| rewa (#8) | 覆盖到 iPhone 17，但**通篇没有一个价格** |
| **全部 8 家** | **没有一家讲 JK / GX / DD / RJ 品牌级差异** |
| **全部 8 家** | 没有「按机型的等级可得性矩阵」（哪些机型压根没有 hard OLED 可选） |

### ④ People Also Ask（必须覆盖）

1. Is soft OLED or hard OLED better?  ← 我们 FAQ 已有
2. **Is OLED worse for eyes than LCD?**  ← 缺
3. Which type of OLED is the best?  ← 部分覆盖
4. **What does soft OLED mean?**  ← 缺（缺定义式问答）

Related searches（8 个待覆盖）：soft oled vs hard oled reddit / Hard OLED vs Soft OLED vs Incell / **Soft OLED vs AMOLED** / **Soft OLED vs original iPhone** / Soft OLED vs OLED / Hard OLED vs Soft OLED vs LCD / Soft OLED vs Incell LCD / **soft oled vs hard oled iphone 13 pro max**

---

## 我们的独家资产（E-E-A-T 一手信息）

`src/data/iphone-screen-catalog.ts`：**188 条 SKU / 27 款机型 / 4 等级 × 4 品牌 / 三档批发价**

- 等级：Original 31、Soft OLED 69、Hard OLED 21、Incell 67
- 品牌：JK 40、GX 23、DD 20、RJ 7
- 覆盖到 **iPhone 17 Pro Max / iPhone Air**
- 价格是 **p10/p50/p200 三档批发价**，不是竞品那种零售价

示例（p10 档）：

| 机型 | Original | Soft OLED (JK) | Soft OLED (GX) | Hard OLED (DD) | Incell |
|---|---|---|---|---|---|
| iPhone 15 | $126.08 | $41.18 | $51.42 | $51.02 | — |
| iPhone 16 | $147.75 | $40.43 | $51.42 | $50.14 | $14.96 |
| iPhone 16 Pro Max | $242.31 | $74.96 | $60.38 | — | — |
| iPhone 17 Pro Max | — | — | — | $74.96 | — |

> 🔴 **发布前必须复核价格**。记忆记录 `agent_price_index.csv` valid_until 已过（5-27），且「soft OLED 越新越虚高」（16PM JK +64%、17PM JK +98%）。
> 公开文章里的价格建议：① 用区间不用单点 ② 标注 "as of 2026-08" ③ 先与 Sunsky/主表对账。

---

## 现有文章诊断：`/blog/lcd-vs-oled-hard-soft-oled-repair-shops`

现状：2,764 词，结构完整，29 处价格，5 条 FAQ。**底子好，不该重写，应该升级。**

现有结构：
```
The Four Replacement Screen Grades, Explained (LCD/Incell, Hard OLED, Soft OLED, OEM Original)
Hard OLED vs Soft OLED vs Incell: Side-by-Side Comparison
Which Grade Fits Which iPhone Model?
Price, Cost, and Profit Margin Breakdown
  └ The Real Cost Factor: Callbacks and Returns
Common Mistakes When Choosing Screen Grades
How to Start Stocking the Right Mix
FAQ ×5
```

### 该补什么（按缺口优先级）

| # | 动作 | 依据 |
|---|---|---|
| 1 | **机型覆盖从 iPhone 15 补到 17 / Air** | 现文最新只到 15；rewa/irepart 已覆盖 17。catalog 已有数据 |
| 2 | **新增「品牌级：JK vs GX vs DD vs RJ」整节** | **SERP 前 22 名零覆盖**，是唯一真差异化 + 我们有 90 条带价 SKU |
| 3 | **新增「按机型 × 等级可得性矩阵」** | 无人做过；直接回答 "iPhone 16 有没有 hard OLED" 这类真实采购问题 |
| 4 | 补 FAQ：What does soft OLED mean?（定义式） | PAA 原题缺失 |
| 5 | 补 FAQ：Is OLED worse for eyes than LCD? | PAA 原题缺失 |
| 6 | 新增小节：Soft OLED vs AMOLED / vs Original | related searches 高频，现文未覆盖 |
| 7 | 价格改成「批发三档 + as-of 日期」 | 竞品全是零售价，我们的批发价才是买家真正要的 |
| 8 | 补 Return/DOA 实测口径 | 对标 sqlcd 的 Customer Return Rates，我们有 12 个月保修 + 售后标准可佐证 |

### 蚕食处理

`/products/screens-grade-guide`（#22）与本文抢同一批词。建议分工：
- **博客** = 决策教育（怎么选、为什么、品牌差异、踩坑）→ 吃 CI 意图
- **grade-guide 产品页** = 规格与报价入口（等级定义表 + SKU + RFQ）→ 吃 Trans 意图
- 两页互相内链，博客 canonical 保持自引用，正文顶部一句话导流到产品页

---

## AI Overview 层（视频结尾伏笔：AIO 出现时第一名 CTR -58%）

本词已有 AIO 且引用 11 源，我们不在其中。AIO 引用的多为 Reddit / YouTube / 供应商博客。
可执行动作：
- 正文用「X is a...」定义式开头段（citability 配方，记忆已验证）
- 每个对比维度给独立可摘取的短段落 + 数字
- 补 FAQPage schema（本站 FAQ 由正文 `## FAQ` 自动生成，写进正文即可）

---

## 发布前 6 项人工检查（视频原文清单）

1. 信息是否正确且仍然有效 → **价格必须回源核对**（见上方红字）
2. 是否真的符合搜索意图 → 目标是 CI，不是 Info 科普
3. 有无空泛、重复或无关内容
4. 引用资料能否找到可靠来源
5. **是否加入自己的经验、照片和案例** → 品牌级差异、退货率、实拍是我们唯一护城河
6. 是否比现有搜索结果更实用 → 对照 rewa(3,851词无价) / sqlcd(2,353词零售价止于 iPhone 14)

---

## 前置阻塞

🔴 本文当前 **404**（Supabase egress 超额停服，2026-08-10 起）。
内容改写可以先做，但**发布与收录必须等站点恢复**。恢复后需在 GSC 用「网址审查 → 请求编入索引」推一次。
