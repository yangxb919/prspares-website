---
title: Lead Source Ground Truth Dashboard - Day 3 Status
date: 2026-05-21
period: 2026-05-14 → 2026-05-20 (7 days post-fix)
type: dashboard
status: red_flag
tags: [analytics, dashboard, lead-attribution, ground-truth, red-flag]
related:
  - [[direct-attribution-investigation]]
  - [[PRSPARES Growth Plan 2026-05-19 to 06-18]]
---

# Lead Source Ground Truth Dashboard — 5-21 周四收尾

> [!warning] 关键发现：plan 月度目标 35-45 leads 在当前 trend 下不可达
> 修复后 7 天实际数据外推为 17 真实询盘人/月（按 unique 邮箱），距离 plan 35-45 目标差 2x+。
> 根因是 LP `/lp/google-ads-factory-direct.html` 流量 5-15 后跳水 10x。

## 7 天三方对账（2026-05-14 → 05-20）

| 日期 | GA4 AU | GA4 leads | Supabase `sb_clean` | Ads imp | Ads cost | SG% |
|------|--------|-----------|---------------------|---------|----------|-----|
| 5-14 周四 | 38 | 0 | **1** (dj.t_mac LP) | 22 | $4.96 | 45% |
| 5-15 周五 | 41 | 2 | 0 (raoufbrahim 落 5-16 CST) | 11 | $0 | 39% |
| 5-16 周六 | 42 | 5 | **4** (Princemussa x3 + raoufbrahim) | 16 | $4.91 | 43% |
| 5-17 周日 | 42 | 0 | 0 | 14 | $12.05 | 26% |
| 5-18 周一 | 39 | 0 | 0 | 8 | $5.80 | 33% |
| 5-19 周二 | 35 | 0 | 0 | 17 | $18.35 | 40% |
| 5-20 周三 | 44 | 1 | **1** (omarabdulaziz) | 8 | $0 | 30% |
| **7 天合计** | — | **8** | **6 sb_clean** | 96 | $46 | **avg 37%** |
| **unique 邮箱** | — | — | **4** (真实询盘人) | — | — | — |

按 unique 邮箱外推：**4 人/7 天 ≈ 17 人/月**（远低于 plan 35-45 目标）。

## 🚨 三大警示

### 1. LP 流量跳水 10x — 真主力渠道近乎停摆

`/lp/google-ads-factory-direct.html` 是真实询盘的 77% 主入口（30 天 baseline）：

| 周期 | LP AU | LP Sessions | LP CVR | Supabase Lead 来自 LP |
|------|-------|-------------|--------|---------------------|
| 30 天 baseline (4-15~5-14) | **192** (6.4/天) | 207 | **5.2%** ✅ 健康 | 10 |
| 6 天修复后 (5-15~5-20) | **4** (0.67/天) | 5 | **0%** | 0 |

**根因**：Smart Bidding 在 5-12 之后还没收到足够 conversion 信号（之前因 gtag 缺失大部分 conversion 没回传）。imp_share 11-18% 徘徊，rank_lost 80-90%。即使我们今天加了 4 个 negative，也救不了流量。

**关键判断**：plan 期待"Smart Bidding 信号回填后 Ads 自然恢复"——但 5-15~5-20 6 天 0 LP conversion，**Smart Bidding 拿不到信号反哺**。这是典型的"鸡生蛋"死循环：
- 没 conversion → 算法降出价
- 出价降 → 没流量
- 没流量 → 没 conversion

**短期可行的破局动作**（按 ROI 排序）：
1. **临时切 Manual CPC $8-10** 强制提高 imp_share（plan 5-22 已经把这个写成 decision point）
2. 提高 Maximize Conversions tCPA 上限（当前 $175，可提到 $250 让 Smart Bid 出更高）
3. 主动暂停 Smart Bidding 一周，回归 Maximize Clicks 让算法快速积累 traffic 样本

### 2. Singapore 30-45% 流量长期没降

7 天 SG 占比一直在 26-45% 徘徊，**middleware IP 黑名单（5-15 commit `a7c76d0` 加的 30 个 prefix）几乎无效**。可能：
- bot 用了我没列的 IP 段（Hetzner / 各小厂 SG 节点）
- bot 用了 residential proxy（CDN 出口）
- middleware 没真正部署生效（按 GitHub Actions auto-deploy 应该有）

**5-22 周五 escalation** 之一就是处理这个。今天先记录。

### 3. 5-12 之前 27 天 `/wholesale-inquiry` 真实询盘**永久丢失**

`/api/send-rfq-email` 在 commit `6f0e26d` (5-12) 之前不写 Supabase。这 27 天里所有从 `/wholesale-inquiry` 提交的真实询盘：
- 如果 SMTP 成功 → 邮件到 wendy-lee 邮箱（**ground truth 唯一来源**）
- 如果 SMTP 失败 → 永久消失

**待运营动作**：去 wendy-lee@phonerepairspares.com 邮箱搜 2026-04-15 ~ 2026-05-11 期间所有标题含 `[RFQ]` 或 `[Wholesale Inquiry]` 的邮件，反推丢失数量。如果差异巨大（>10 封），未来的 baseline 应该用 GA4 噪声估算 × 校正系数。

## 修订后的真实状态（按 Supabase ground truth）

| 维度 | 旧 plan（GA4 噪声） | 新（Supabase ground truth） |
|------|------------------|------------------------|
| 30 天 baseline | 57 | **~17 unique 询盘人**（trend 外推，因 5-12 前漏报无法精确） |
| 渠道分布 | Direct 53% / Paid 16% / Organic 11% / AI 18% | **Paid (LP) 77% / Wholesale-inquiry 23%** / 其他 ~0 |
| 月度目标 | 65-72 (stretch 75) | ❌ 不现实 → **建议下修到 20-30** |
| 主增长杠杆 | Ads 2.5x + AI 2x + Organic 2x | **LP 流量恢复**（Smart Bidding 突围） |

## 今日已完成的动作

- ✅ 09:30 加 4 个 Ads negative：`mobil centrix`, `mighty wireless`, `siren wireless`, `supreme phone parts`
- ✅ 10:00 LP CVR 评估（发现流量跳水）
- ✅ 14:00 `ga4_fetch_daily.py` 加载 `.env.local` Supabase 凭据（commit `8df96ab`）
- ✅ 7 天 daily 文件 backfill（包含 sb_clean / sb_lp_leads / sb_wholesale_leads）

## 待办（明天 5-22 决策日 + 运营动作）

### 🔴 5-22 周五 decision points（plan 原计划）

- [ ] **决策点 1**: imp_share ≥ 14%? 否则切 Manual CPC $8-10 → **基于今天的 LP 数据，建议直接切**（已是 5 天死循环）
- [ ] **决策点 2**: 累计 lead < 8? → **实际已确认未达**（unique 4 < 8）
- [ ] **决策点 3**: Singapore < 10%? → **持续 5 天 26-45%，必须升级 middleware**

### 🟠 运营动作

- [ ] **运营查 wendy-lee 邮箱** 4-15 ~ 5-11 期间 `[RFQ]` / `[Wholesale Inquiry]` 邮件数量，对比 Supabase 0 条 LP-外的真实数据，反推丢失量
- [ ] 决定 Princemussa / raoufbrahim 等短时多次提交是否是真实意向客户（需业务侧反馈）

### 🟡 长远（plan Week 2+）

- [ ] Smart Bidding 救援路径决策（Manual CPC vs 提 tCPA vs 重启）
- [ ] Singapore middleware IP 升级（用 cf-ipcountry / Vercel geo header 而非 IP prefix）
- [ ] 5-12 前 27 天数据缺口的补救策略（如果运营拿到了真实 RFQ 数量）
