---
title: ChatGPT 渠道 Sprint Plan (2026-05-30 → 06-13)
date: 2026-05-29
period_start: 2026-05-30
period_end: 2026-06-13
type: channel-sprint-plan
priority: P0
tags: [prspares, chatgpt, llm-channel, sprint, 2-week]
related:
  - [[half-month-report-2026-05-29]]
  - [[changelogs/2026-05-29]]
---

# ChatGPT 渠道 Sprint Plan — 5-30 → 6-13（2 周冲刺）

> [!important] 战略重新认知
> 30 天 baseline (4-25 ~ 5-24) ChatGPT 已经 **119 sessions / 14 generate_lead**，是 Google CPC（5 lead）的 **2.8 倍** — ChatGPT 不是"试水新渠道"，是 PRSPARES **已经的第一大 organic lead 源**。本 sprint 目标是**加固**这条线，而不是开通它。

---

## 🎯 Sprint 目标

| 维度 | 当前（5-25~5-29 实测） | 6-13 目标 | 衡量方式 |
|------|------------------------|-----------|----------|
| ChatGPT sessions/天 | 2.2 | **≥ 4.0**（回到 baseline 119/30=4/天） | daily report `chatgpt_sessions` |
| ChatGPT begin_form | 0 | **≥ 3 总数** | daily report `chatgpt_begin_form` |
| ChatGPT generate_lead | 0 | **≥ 1 首 lead** | daily report `chatgpt_generate_lead` |
| Spot check 被引率 | 未知 | **10 query 中 ≥ 3 被引** | 周一 / 下周一两次 spot check 对比 |
| Schema 覆盖商业页 | 1 (/wholesale-inquiry) | **5 页**（+/products + 3 个子分类） | git commit + VPS deploy 验证 |

---

## 📅 时间表（按天细化）

### 5-30 周六（明天）— spot check + 扩 schema 准备

**上午（1.5h）**

1. **Spot check 10 个 query**（30-40 min）
   - 在 ChatGPT 里逐个问下方 query，记录被引情况到 `Analytics/chatgpt-spot-check-2026-05-30.md`
   - **不要用 Pro/Plus 用 GPT-4o 默认设置**（最接近普通 buyer 体验）
   - 每个 query 用一个新对话（避免上下文污染）

2. **整理 spot check 结论**（30 min）
   - PRSPARES 被引几个 query？被引在 source list 还是 answer body？
   - 哪些对手被引（MobileSentrix / Injured Gadgets / etech / RepairPartsUSA / DFW / 其他）
   - 哪些 query 完全没人被引（= 空白市场）

3. **看 schema 改动范围**（20 min）
   - 读 `src/app/wholesale-inquiry/layout.tsx` (line 54-150) — 模板
   - 看 `src/app/products/{screens,batteries,small-parts}/layout.tsx` 各自有什么 JSON-LD

**下午（按 spot check 决定）**

- 如果 spot check 显示 **PRSPARES 被引 ≥ 3 个 query** → 扩 schema 是加固，可以照原 plan
- 如果显示 **被引 0-1 个 query** → 优先级转向"找出为什么没被引"（内容差距 / sitemap 没被抓 / 引文 sentiment 不利），扩 schema 推后

### 5-31 周日 — 扩 procurement-intent schema

**目标**：把 wholesale-inquiry 上验证过的 schema 模式扩到 4 个新页面：

| 页面 | 当前 schema | 要加什么 | 备注 |
|------|-----------|---------|------|
| `/products` (catalog) | 基础 BreadcrumbList | + Service + procurement FAQ (5 项，覆盖 catalog 级问题) | 落点：buyer 问"who sells wholesale phone parts" 时 LLM 引到 catalog 而不是个别 SKU |
| `/products/screens` | 待查 | + OfferCatalog (incell / hard OLED / soft OLED grades) + 3 个 FAQ (grade 怎么选 / MOQ / shipping) | 当前 LP `/lp/google-ads-factory-direct.html` 已经有 screen-focused 内容，但 schema 不互通 |
| `/products/batteries` | 待查 | + OfferCatalog (品牌覆盖 / 包装 / shipping) + 3 个 FAQ | 电池 buyer 关心 packaging + 空运限制 |
| `/products/small-parts` | 待查 | + OfferCatalog (camera / charging / flex 等分类) + 3 个 FAQ | small-parts 是 SKU 最深的品类 |

**具体 commit 计划**（明天可直接动手）：

```
git checkout -b feat/extend-procurement-schema-to-product-pages

# 4 个文件编辑：
src/app/products/layout.tsx (可能要新建)
src/app/products/screens/layout.tsx
src/app/products/batteries/layout.tsx
src/app/products/small-parts/layout.tsx

# 复用 procurementFaqItems 模式 + 每页定制 3-5 个 FAQ
# 用 Service + OfferCatalog 模板从 wholesale-inquiry/layout.tsx 抄

git commit -m "feat: extend procurement-intent JSON-LD to /products + 3 category pages"
```

### 6-1 周一 — 部署 + GA4 看板调整

- VPS deploy（merge feat 分支到 master → ssh prspares → git pull → pm2 restart）
- 用浏览器 UA + Google Rich Results Test 验证 4 个新页面的 JSON-LD
- 调整 daily report：加 `chatgpt_landing_path` 维度（看 ChatGPT 用户落在哪些页面，**这是验证扩 schema 是否有效的核心指标**）

### 6-2 ~ 6-6 周二~周五 — 观察 + 第 1 篇 buyer guide

- daily report 跟踪 ChatGPT sessions / landing_path 变化（schema 抓取通常 3-7 天见效）
- **如果 spot check 显示有引文空白，开始写第 1 篇 LLM-friendly buyer guide**：
  - 候选标题：`How to Vet a Chinese Wholesale Phone Parts Supplier in 2026 (12-Point Checklist)`
  - 结构：FAQ schema + 对比表 + 清单 + 价格区间 + 警告信号
  - 目标：让 ChatGPT 把这篇当 source（被引位置在 answer body 而不是 footnote）
  - 工程量：1500-2000 字 + 1 个对比表 + JSON-LD

### 6-7 周六 — 第二次 spot check（**关键复盘点**）

- 重跑 5-30 同样的 10 个 query
- 对比：PRSPARES 被引数量、位置、引文 sentiment 是否改善
- 决定 Week 4 (6-8~6-13) 方向：
  - **明显改善** → 继续扩 schema + 写第 2 篇 buyer guide
  - **没改善** → 反思：schema 不是瓶颈，可能是 robots.txt / sitemap / 内容质量

### 6-8 ~ 6-13 — 按 6-7 复盘决定

候选动作（看 spot check 选）：
- 第 2 篇 buyer guide（候选：`Wholesale iPhone Screen Prices 2026: Incell vs OLED Bulk Cost Guide`）
- 扩 schema 到 `/products/repair-tools` + `/products/tablet-watch` + `/products/ipad-battery-replacement-factory`
- 检查 Direct 流量里是否有"剥离 referer 的 ChatGPT 流量"（5-20 commit 5813377 调查可扩展一轮）

---

## 🔍 Spot Check Query List（5-30 周六上午用）

按 buyer intent 5 个 tier 各 2 个 query，共 10 个。

### Tier 1: Discovery（**最高价值**，buyer 还没认品牌时的 query）

1. `Who are the most reliable wholesale suppliers for iPhone replacement screens in 2026?`
2. `Best wholesale suppliers for phone repair parts shipping to the US`

### Tier 2: Comparison（**品牌对比**，buyer 已知一个，找替代）

3. `MobileSentrix alternatives for wholesale phone screens — who else is reliable?`
4. `Injured Gadgets vs other wholesale phone parts suppliers — best alternative?`

### Tier 3: Price / Spec（**buyer guide intent**，PRSPARES 内容能引）

5. `How much do iPhone 15 OLED replacement screens cost wholesale in bulk?`
6. `Incell vs hard OLED vs soft OLED — which to order for my repair shop?`

### Tier 4: Procurement how-to（**信息型 query**，被引概率最高）

7. `How to vet a Chinese wholesale phone parts supplier — what to check before first order?`
8. `What's the typical MOQ for wholesale iPhone screens from China suppliers?`

### Tier 5: Specific SKU / 地域（**长尾 query**，引到具体 SKU 页）

9. `Where to buy iPhone 15 Pro Max replacement screens in bulk for repair shops?`
10. `Wholesale Samsung Galaxy S24 OLED screens — sourcing from China to Europe?`

### Spot Check 记录模板

每个 query 记录到表格：

| # | Query | PRSPARES 被引？ | 位置 | 引到 URL | 引文 sentiment | Top 3 对手 | 备注 |
|---|-------|----------------|------|---------|--------------|----------|------|
| 1 | (Q1) | Y / N | answer body / source list / 没出现 | (URL or 没引) | 推荐 / 中性 / 警告 / 没引 | (3 个 brand 名) | (任何观察) |

字段说明：
- **位置**：`answer body` = ChatGPT 在主回答里 mention，`source list` = 只在 footnote / source 卡片里出现，`没出现` = 完全没引
- **引文 sentiment**：`推荐` = ChatGPT 主动说 PRSPARES 好，`中性` = 列名字没评价，`警告` = ChatGPT 说慎选 / 没经验等，`没引` = N/A
- **Top 3 对手**：按 ChatGPT mention 顺序，重点看是不是 MobileSentrix / Injured Gadgets / eTech / RepairPartsUSA / DFW 几个常见竞品

---

## ✅ Sprint 成功 / 失败判定（6-13 总结时用）

### ✅ Sprint 成功
- ChatGPT sessions/天回到 ≥ 4.0（baseline 水位）
- 出 ≥ 1 个 ChatGPT 来源 sb_clean lead
- Spot check 10 个 query 中 PRSPARES 被引 ≥ 3 个

### 🟡 部分成功
- 满足以上 1-2 个

### ❌ Sprint 失败 → 反思
- 一个都没满足 → 推翻"ChatGPT 是第一大 organic lead 源"假设
- 重新看 30 天 baseline 14 lead 的归因是否准确（GA4 referrer 归因可能有 noise）
- 调查 robots.txt / sitemap.xml 是否真被 GPTBot 抓
- 评估 PRSPARES 内容**实际 LLM-friendly 程度**：是不是太"市场营销文案"风，缺数据 / 缺对比 / 缺清单

---

## ❌ 这两周不做的事

- ❌ 投资 ChatGPT 广告（无成熟产品）
- ❌ 大规模 TOFU blog 内容生产（边际效应低）
- ❌ SearchGPT / Perplexity / Claude 等其他 LLM（先走通 ChatGPT，再复制方法）
- ❌ 重写所有现有 blog（成本高，先看哪几篇被引再针对性优化）
- ⏸ Direct 流量 ChatGPT 归因深挖（推迟，等 sprint 复盘后看是否必要）

---

## 📎 关联文件

- [[half-month-report-2026-05-29]] — 半月报，Week 3 plan 起点
- [[Analytics/chatgpt-spot-check-2026-05-30]] — 明天创建，spot check 记录
- `src/app/wholesale-inquiry/layout.tsx` — 现有 schema 模板（line 54-150）
- commit `c7e090d` — ChatGPT 通道首次部署
- [[Analytics/lead-source-ground-truth-dashboard]] — 5-21 邮箱审计 baseline
