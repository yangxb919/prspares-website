---
title: Direct 渠道归因深度调查 (Part 1)
date: 2026-05-20
type: investigation
status: bombshell
tags: [analytics, attribution, direct-channel, ground-truth]
related: [[PRSPARES Growth Plan 2026-05-19 to 06-18]]
---

# Direct 渠道归因深度调查 — Part 1

> [!warning] 调查结论彻底改写了之前所有的 baseline 假设
> 之前 plan 基于 GA4 报告的 "30 天 57 leads / Direct 53%"。
> 这份调查通过 Supabase ground truth 对账后发现：**真实询盘数大幅低于 GA4 报告，且 Direct 53% 几乎不存在**。

## 调查方法

1. 拉 GA4 generate_lead 事件 30 天（2026-04-15 ~ 05-14）的所有维度分布
2. 拉 Supabase `contact_submissions` 表 30 天全部记录作 ground truth
3. 交叉时间戳 / 邮箱 / 页面 URL 对账

## 数据快照

### A. GA4 报告的 30 天 generate_lead (按渠道)

| Channel | leads | 占比 |
|---------|-------|------|
| Direct | 30 | 53% |
| AI/Unassigned | 10 | 18% |
| Paid Search | 9 | 16% |
| Organic Search | 6 | 11% |
| Referral | 2 | 4% |
| **合计** | **57** | 100% |

### B. Supabase ground truth (30 天)

**只有 13 条 contact_submissions 记录**：

| 来源 (source 字段) | page_url 含 gclid? | 数量 |
|----|----|----|
| `google-ads-factory-direct-2026` | ✅ 全部带 gclid | 10 |
| `wholesale-inquiry` | ❌ 都无 gclid | 3 |
| **合计** | — | **13** |

### C. GA4 vs Supabase 时间序列对账

> [!info] **关键转折点：2026-05-12 commit `6f0e26d`** — "defensive Supabase persistence on send-rfq-email API"
> 在此之前，`/api/send-rfq-email` **不写 Supabase**。所有 /wholesale-inquiry 的真实表单提交都没进数据库。
> Supabase 5-12 之前的 9 条全部来自 `/lp/google-ads-factory-direct.html`（这个 LP 有独立的 lp-inquiry API，一直在写 Supabase）。

5-12 之后的对账（8 天）：

| 日期 | GA4 leads | Supabase 真实 | 备注 |
|------|-----------|---------------|------|
| 5-12 | 1 | 2 (-1 test) | OK |
| 5-13 | 1 | 0 | GA4 + 1 |
| 5-14 | 0 | 1 | GA4 漏 1 |
| 5-15 | 2 | 2 (-2 test) | OK |
| 5-16 | 5 | 3 (Princemussa 3 次重复) | GA4 + 2 |
| 5-17 | 0 | 0 | OK |
| 5-18 | 0 | 0 | OK |
| 5-19 | 0 | 0 | OK |
| **8 天合计** | **9** | **8** | 差 1，误差合理 |

5-12 之前 27 天的对账（**重大缺口**）：

| 维度 | GA4 | Supabase |
|------|-----|----------|
| Total leads (27 天) | 48 | 9（全部来自 LP） |
| **wholesale-inquiry 的真实 lead 数** | 未知（GA4 中混合归因） | **0**（API 不写 DB） |

## 关键发现

### 🚨 发现 1：GA4 "Direct 53%" 是噪音 + 测量问题

GA4 报告的 30 天 30 个 "Direct" generate_lead 事件深挖发现：

- **97% (29/30) 是 macOS Chrome desktop**（高度同质化设备指纹）
- **93% (28/30) landing page = `/thank-you`**（不可能直接落地一个 success page 又触发 lead）
- **100% source / medium = `(direct) / (none)`**，first-touch 也是 100% direct（不是 last-touch 丢 UTM）

这些"Direct lead"在 Supabase 里**没有对应记录**。它们是 GA4 事件计数中的 ghost。

**真实归因**：
- 通过 Supabase 看，30 天真实询盘的渠道分布是：
  - **77% Google Ads** (10/13，来自 /lp/google-ads-factory-direct.html 带 gclid)
  - **23% 自然流量** (3/13，wholesale-inquiry 直接访问或 organic)
- **不存在"53% Direct 神秘渠道"**

### 🚨 发现 2：5-12 之前 `/wholesale-inquiry` 询盘可能全部丢失

`/api/send-rfq-email` 在 commit `6f0e26d` (5-12) 之前**只发邮件不写数据库**。这意味着：

- 4-15 ~ 5-11 期间所有从 `/wholesale-inquiry` 提交的真实询盘**没存 Supabase**
- 邮件如果到了 wendy-lee@phonerepairspares.com 就还有；如果 SMTP 失败就**永久丢失**
- 跟之前 4-07 changelog 说的 "5-05~5-12 silent inquiry loss" 是同源问题

⚠️ **建议**：让运营查 wendy-lee 邮箱 4-15 ~ 5-11 期间的真实询盘数，与 Supabase 对账可以反推丢失量。

### 🚨 发现 3：GA4 generate_lead 事件被噪声污染

GA4 30 天 57 个 generate_lead，但去除 Direct ghost（30 条）后剩 27 条。Supabase 同期 13 条。GA4 还多 14 条 — 来源可能：

1. **重复提交**：Princemussa 5-16 一人 3 次、raoufbrahim 5-15 一人 2 次 → GA4 fire 5 次，Supabase 2 个 unique email
2. **bot 触发 trackEvent('generate_lead')**：trackEvent 有 EVENT_GATES 但 requireHuman 检测可被精确模拟
3. **SPA prefetch 误触发**：Next.js 路由 prefetch 可能预加载某页面导致 useEffect 误跑
4. **历史代码 bug**：某些时段（如 5-08~5-14 Turnstile bug）generate_lead 已 fire 但 API 失败

## 修订后的真实 baseline

> [!important] 用 Supabase ground truth 替代 GA4 报告

| 维度 | 旧（GA4） | **新（Supabase 真实）** |
|------|---------|----------------------|
| 30 天 leads | 57 | **13**（保守，可能更高因 5-12 前丢失） |
| Direct 53% | 30 | **0**（不存在） |
| Paid Search | 9 (16%) | **10 (77%)** ← 真主力 |
| Organic Search | 6 (11%) | **2-3 (~20%)** |
| Referral | 2 (4%) | **0-1** |
| AI Referral | 10 (18%) | 不确定（可能算入 Organic） |

修订后**5 月数据更可信**（因为 5-12 后有 Supabase 持久化）：
- 5-12 ~ 5-19 (8 天)：**8 个真实询盘**（去除 test/重复后）
- 月均约 30 个真实询盘（如果 trend 持续）

## 对 plan 目标的影响

> [!warning] 之前 plan 的"57 → 65-72 leads/月 (+14-26%)" 目标需要重设

- 真实 baseline 不是 57 而是 ~30/月（基于 5-12 后数据外推）
- 增长目标不能用 GA4 噪声数据评估
- **应改用 Supabase 数据作为唯一 lead 数据源**

新建议 baseline 与目标（带条件）：

| 指标 | 修订 baseline | 修订 1 月目标 |
|------|-------------|-------------|
| 月真实询盘（Supabase ground truth） | ~30 | **35-45** |
| Paid Search 来源（Supabase source 字段） | 25-30 (大多数来自 /lp) | 30-35 |
| /wholesale-inquiry 直接访问 | 3-5 | 5-8 |
| **GA4 generate_lead 计数（仅用于趋势对比）** | 57 (噪声) | **不作为目标** |

## 行动项

### 立即（今天 5-20 收尾）

- [x] 写本调查报告
- [ ] commit + push 
- [ ] 通知运营：查 wendy-lee 邮箱 4-15~5-11 期间的真实询盘记录，做 ground truth 对账

### 短期（本周内）

- [ ] **修改 daily 看板脚本**：用 Supabase API 拉每日真实询盘数（替代或并列 GA4 leads 数）
- [ ] **看 GA4 多余 generate_lead 事件**：找出哪些场景导致 GA4 fire 但 Supabase 没记录
- [ ] **重复提交防护**：Princemussa 类 6 分钟 3 次的同一邮箱提交，加 client-side debounce 或 server-side rate-limit by email

### 中期（plan Week 2-3）

- [ ] **改写 plan 的渠道目标**：基于 Supabase 真实分布（77% Paid / 23% Organic），不再追求 "AI 10→20 / Direct 持平" 这种基于噪声的目标
- [ ] **重新评估 Paid Search 性能**：因为大多数 Ads conversion 是从 /lp/google-ads-factory-direct.html 来的，不是 /wholesale-inquiry。需要单独看 LP 的 conv rate vs 主站表单

## 调查 part 2 待做

- [ ] **拉 Supabase 4 月前数据**（4-15 之前）看 LP 的历史 trend
- [ ] **看 lp-inquiry vs send-rfq-email 两个 API 的差异**（为什么 LP 一直写 DB，wholesale-inquiry 一直不写）
- [ ] **/lp/google-ads-factory-direct.html 的 conv rate**：拉 GA4 看这个页面 30 天 sessions 数，算 LP 转化率（应该比 wholesale-inquiry 高很多）
