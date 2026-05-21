---
title: Lead Source Ground Truth Dashboard - Day 3 Status
date: 2026-05-21
period: 2026-04-15 → 2026-05-21 (37 days with full email audit)
type: dashboard
status: refined
tags: [analytics, dashboard, lead-attribution, ground-truth, email-audit]
related:
  - [[direct-attribution-investigation]]
  - [[PRSPARES Growth Plan 2026-05-19 to 06-18]]
---

# Lead Source Ground Truth Dashboard — 5-21 周四收尾（含邮箱审计）

> [!success] 通过 wendy-lee Zoho 邮箱 IMAP 审计后，真实 baseline 修订
> 修订前估算：17 leads/月（仅 5-15~5-20 6 天 trend 外推，恰逢 LP 低谷）
> 修订后真实：**约 25 unique 询盘人/月**（4-15~5-21 邮箱+Supabase 双源校准）
> Plan 目标 35-45/月 = **+40-80% 合理拉伸**（不是之前认为的"不可达"）

## 数据三源校准

通过 **wendy-lee@phonerepairspares.com Zoho IMAP** (`~/.hermes/scripts/prspares_zoho_mail.py`) 拿到 37 天完整 `[RFQ]` 邮件历史，弥补 5-12 前 Supabase 数据缺口。

| 周期 | 天数 | [RFQ] 邮件 | 真实询盘 | Spam | unique 询盘人/月外推 |
|------|------|-----------|---------|------|-------------------|
| 4-15 ~ 5-11 (Turnstile 修复前) | 27 | 60 | **23 unique** | **30 (5-04~5-05 爆发)** | ~25 |
| 5-12 ~ 5-21 (Turnstile 修复后) | 10 | 18 | ~8 unique | **0** 🎉 | ~24 |
| **整合 37 天** | 37 | 78 | **~31 unique** | 30 | **~25/月** |

## 🎉 三大成功

### 1. Turnstile 修复彻底压制 Spam（30 → 0）

5-12 之前 27 天 30 封 spam 邮件（占 [RFQ] 总数 50%），随机字符姓名如 `lDVaBHiEsnxXAWzjnvjRMos`，集中在 4-29~5-05 爆发。修复后 10 天 **0 spam**。这是 5-15 commit `cbe3644`（删客户端 Turnstile 预 verify）+ `6f0e26d`（defensive Supabase）+ `a7c76d0`（SG IP）三连击的合力效果。

**GA4 generate_lead 噪声大幅降低的根因**：之前 GA4 报 57 leads，其中很大一部分是 spam 触发的 trackEvent。spam 消失后 GA4 数字回到 8/7 天 ≈ 34/月，与真实 25/月 + 一些 bot 残留对得上。

### 2. 真实 baseline 比"GA4 噪声"低、但比"5-15 后 trend"高

| 数据源 | 月度估算 | 可信度 |
|--------|---------|--------|
| GA4 generate_lead (旧 plan) | 57 | ❌ 含 30 封 spam + bot |
| Supabase sb_clean (4-15~5-14) | 13 | ❌ 5-12 前 wholesale-inquiry 不写 DB |
| 5-15~5-20 6 天 trend 外推 | 17 | ⚠️ 赶上 LP 流量低谷 |
| **邮箱 ground truth (37 天)** | **25** | ✅ **唯一可靠** |

### 3. 实际渠道分布（37 天邮箱审计）

按 RFQ 邮件发件人/主题 + Supabase source 字段交叉：
- LP `/lp/google-ads-factory-direct.html`: ~13-15 (50-60%)
- /wholesale-inquiry: ~10-12 (40-50%)
- 真实 Direct/其他: 0-2 (近 0%)

不再有"Direct 53%"这个伪渠道。

## ⚠️ 三大警示（仍存在）

### 1. LP 流量 5-15 后跳水 10x — Smart Bidding 死循环

| 周期 | LP AU | LP CVR | LP 真实 lead |
|------|-------|--------|-------------|
| 30 天 baseline (4-15~5-14) | 192 (6.4/天) | 5.2% | 10 |
| 6 天修复后 (5-15~5-20) | 4 (0.67/天) | 0% | 0 |

**5-22 周五 decision day 必须做的动作**：
- 临时切 Manual CPC $8-10 强制提高 imp_share
- 或提 tCPA 上限 $175 → $250
- 或重启 Maximize Clicks 一周积累样本

### 2. Singapore 持续 30-45%

7 天 SG 占比 26-45% 徘徊。今天 5-21 实测 30%。middleware IP 黑名单（30 个 prefix）几乎无效。建议改用：
- Vercel/CloudFront geo header `x-vercel-ip-country` / `cf-ipcountry`
- 或在 GA4 报告层 filter 出 SG（不阻拦访问，仅清洁报告）

### 3. 5-12 前 27 天 wholesale-inquiry 真实询盘**确认**有丢失

Supabase 4-15~5-11 共 9 条（全部来自 LP）。邮箱却显示 23 个 unique 询盘人。**差 14 人** = wholesale-inquiry 通过 SMTP 到了邮箱但没写 DB。如果 SMTP 也偶有失败，损失可能更多（但邮箱审计无法重建）。

## 修订后 plan 目标（与真实 baseline 对齐）

| 维度 | 旧 plan | 新（基于邮箱 ground truth） |
|------|---------|------|
| 30 天 baseline | 57 (GA4 噪声) | **25 unique 询盘人/月** |
| 月度目标 | 35-45 (停留) | **30-35** 保守 / **35-45** 拉伸 |
| 主增长杠杆 | "Direct / AI / Organic 各 2x" | **LP 流量恢复 + spam 压制保持 + LTV 复算** |
| Spam 状况 | 不明 | ✅ 已彻底压制（0/10 天） |

## 今天 (5-21) 全部完成的动作

- ✅ 09:30 加 4 个 Ads negative（`mobil centrix` / `mighty wireless` / `siren wireless` / `supreme phone parts`）
- ✅ 10:00 LP CVR 评估（发现 10x 流量跳水）
- ✅ 14:00 `ga4_fetch_daily.py` 加 .env.local 解析 + 7 天 daily backfill 含 Supabase（commit `8df96ab`）
- ✅ 15:30 wendy-lee 邮箱 IMAP 审计（37 天 78 封 [RFQ]，分类 + 去重）
- ✅ 16:00 写本 dashboard 报告并修订 baseline

## 待办（5-22 周五 + 运营）

### 🔴 5-22 decision points（明天必须执行）

- [ ] **决策点 1**: imp_share ≥ 14%? 否则切 Manual CPC $8-10 → **基于今天 LP 10x 跳水数据，强烈建议切**
- [ ] **决策点 2**: 累计 unique 真实询盘 ≥ 8? 实际邮箱审计 5-19~5-21 这 3 天有 5 unique (Omar + 5-21 那 3 个 + 4 月遗留？) — **接近达标但脆弱**
- [ ] **决策点 3**: Singapore < 10%? **持续未达，必须升级 middleware 到 country-code gating**

### 🟠 运营协同动作（待业务侧反馈）

- [ ] **业务侧**：4 月 23 个 unique 真实询盘人有多少：成单 / 报价 / 寄样品 / 平均订单金额。**重算 Ads ROI 必须**
- [ ] **业务侧**：5-21 今天有 3 个新询盘人（5-21 那批 ?????? / Atm Atm / martin kirimi），看是否真意向客户（看起来 ?????? 可能编码问题或非英文姓名）
