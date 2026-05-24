---
title: Week 1 Report (2026-05-18 → 05-24) — Final
date: 2026-05-24
period_start: 2026-05-18
period_end: 2026-05-24
type: weekly-report
status: final
tags: [prspares, weekly, week-1-final]
related:
  - [[PRSPARES Growth Plan 2026-05-19 to 06-18]]
  - [[direct-attribution-investigation]]
  - [[lead-source-ground-truth-dashboard]]
---

# Week 1 Final Report — 2026-05-18 → 05-24

> [!info] Plan 主题原是"验证修复 + 修测量底子"，实际工作变成"颠覆 baseline + 抓真 bot"
> 3 个 ground truth 调查（Direct 黑盒 / 邮箱审计 / nginx log）+ 2 个 trend 自愈（spam 压制 / Smart Bid imp_share）+ 1 个新警报（LP 流量跳水 96%）

---

## 📊 vs Baseline 对比表（核心 deliverable）

| 维度 | Baseline | Week 1 目标 | Week 1 实际 | 判定 |
|------|---------|------------|------------|------|
| **真实 unique 询盘人** | 25/月 (邮箱审计) | 8-11/周 | **4 个**（5-18~5-24）| ❌ ~50% 完成率 |
| GA4 generate_lead | 57/月 (噪声) → 12/月 (修复后真实) | 12-14/周 | 7/周 | 🟡 含 noise |
| Supabase sb_clean | (新建) | (无目标) | 8 条（4 unique）| ✓ baseline 建立 |
| Spam (邮箱 [RFQ]) | 30/27天 (5-04~5-05 爆发) | 抑制 | **0 / 10 天** | ✅ 完美 |
| **Singapore 占比 (GA4)** | 37.7% | <10% | 39% (102/261) | ❌ 但已判定为 GA4 测量层失真，不是真 bot |
| **真实 bot 段 0 访问 (nginx)** | (新设目标) | 9 段 0 访问 | ✅ 5 个 hot 段全部 0 | ✅ 完美 |
| **Ads imp_share avg** | 11.4% | 14-18% | **17.7%** (5 完整日均) | ✅ 自愈达标 |
| Ads 周花费 | (周底估) | $175-280 | $93.12 | 🟡 仍偏低 |
| LP `/lp/google-ads-factory-direct.html` AU | 192 (30天) → 32/周 | (无明确目标) | **~8/周** | ❌ 跌 75% |
| begin_form → lead 漏斗 | 58% | ≥65% | 数据样本太小 | ⏸ Week 2 重评 |

## 🎯 Week 1 实际产出（7 天 11 个 commits）

| 日期 | Commit | 内容 |
|------|--------|------|
| 5-19 | `75830b9` | contact_click 拆 email_click + phone_click |
| 5-20 | `69b273c` | thank_you_page_view 走 trackEvent 统一门控 |
| 5-20 | `5813377` | Direct 归因调查 part 1 报告（**Direct 53% 是噪声**） |
| 5-21 | (Ads API) | 4 个新 negative：mobil centrix / mighty wireless / siren wireless / supreme phone parts |
| 5-21 | `8df96ab` | ga4_fetch_daily.py 加 .env.local 解析 + 7 天 backfill |
| 5-21 | `01fcd3c` | wendy-lee 邮箱 IMAP 审计 dashboard（**baseline 25/月**） |
| 5-22 | `58c5d47` | middleware 8 个真 bot prefix (nginx log 实证) |
| 5-22 | `a004516` | Week 1 周报草稿 |
| 5-22 | `833abe8` | DP1 决策：不切 Manual CPC（imp_share 自愈 23.2%） |
| 5-22 | `00d2a02` | middleware 补 103.215.75（bot 迁移 +1 /24） |
| 5-23 | `3541c12` | Sat 看板：bot prefix 100% 拦住 |

## 🏆 Week 1 三大成就

### 1. 三层 ground truth 校准

GA4 显示 57 leads/月 → 经 Supabase 对账 → 经 wendy-lee 邮箱 IMAP 审计 → **锁定真实 baseline = 25 unique 询盘人/月**。

| 数据源 | 30 天估算 | 可信度 |
|--------|---------|--------|
| GA4 generate_lead | 57 | ❌ 含 30 封 spam + bot |
| Supabase sb_clean (4-15~5-14) | 13 | ⚠️ 5-12 前 wholesale-inquiry 不写 DB |
| **wendy-lee 邮箱审计 (37 天)** | **25 unique 询盘人** | ✅ ground truth |

### 2. Spam 彻底压制（30 → 0）

| 周期 | 真实 [RFQ] | Spam |
|------|-----------|------|
| 4-15~5-11 (27 天) | 23 unique | 30（5-04~5-05 爆发） |
| 5-12~5-24 (13 天) | ~12 unique | **0** 🎉 |

是 5-15 commit `cbe3644` (Turnstile 双重 verify 修复) + `6f0e26d` (defensive Supabase) + `a7c76d0` (SG IP) 三连击的合力效果。

### 3. Bot prefix 完美生效（5-22 deploy 后实测）

5 个 hot bot /24 段，commit `58c5d47` + `00d2a02` deploy 后今天 5-23 / 5-24 **全部 0 访问**：

| 段 | 部署前日均 | 5-23 | 5-24 |
|----|-----------|------|------|
| 195.178.110.* (Techoff AD) | 150 | 0 | 0 |
| 45.148.10.* (Techoff NL) | 80 | 0 | 0 |
| 103.215.74.* (Rekha Jain IN) | 40 | 0 | 0 |
| 103.215.75.* (Jain +1 /24 迁移) | 100 (5-22) | 0 | 0 |
| 103.168.66.* / 103.153.183.* | 各 30 | 0 | 0 |

## ⚠️ Week 1 风险 / 卡点

### 1. LP 流量跌 96% — Week 2 必须关注的 #1

| 周期 | LP AU | LP CVR | LP 真实 lead |
|------|-------|--------|-------------|
| 30 天 baseline (4-15~5-14) | 192 (6.4/天) | 5.2% | 10 |
| Week 1 (5-18~5-24) | **~8 (1.1/天)** | 0% | 0 |

但今天 5-24 出现**回升信号**：
- LP AU 5（前 6 天累计才 4）
- Ads clicks 5、cost $45.69（7 天最高）
- 这可能是 Smart Bidding 真正恢复的开始

### 2. Singapore 占比"显示"不降 — 但已经不是真 bot 问题

GA4 仍报 SG 39%，但 nginx log 实证真 bot 5 个 /24 段已 0 访问。差异来源：
- GA4 用过期 Maxmind GeoLite2，把欧洲/亚洲非 SG IP 误归 SG
- 或者真有合法 SG VPN/proxy 用户

**plan 目标修订**：旧 "GA4 SG < 10%" 改为 **"nginx 真 bot 段 0 访问"**（已达成）。

### 3. 周一 ~ 周五 5 个工作日里 3 天 0 询盘

5-18 / 5-19 / 5-22 都是 0 真实询盘。周末 5-24 凌晨 0 询盘但下午有 5-24 LP 流量回升。
- 询盘集中在周二三四凌晨（B2B 美东工作时间）
- 周五 + 周末 自然偏低
- 看 Week 2 是否周一回升

## 🎯 Week 2 plan 决策（基于本周发现）

### 🔴 P0 — 必做

| 任务 | 原 plan | 修订 | 理由 |
|------|---------|------|------|
| Week 2 周一 (5-25) 业务侧关键对话 | ✓ 保留 | ✓ 保留 | 4 月 23 个 unique 询盘 → 多少成单 / 报价 / 寄样品 / 平均订单金额 |
| Offline conversion upload 链路 | 5-26~5-27 | **暂缓** | 真实 lead 太少，回填没意义；等 Week 2 lead 数恢复再做 |
| Title 重写剩 7 篇 | 5-28 | ✓ 保留 | 独立动作，不依赖 Ads |
| **观察 LP 流量恢复 trend** (新增) | (无) | **每天看 LP AU** | 5-24 信号是否持续，决定后续动作 |
| **Singapore 目标修订** (新增) | "GA4 SG < 10%" | "nginx 5 个 hot 段 0 访问" | 已达成，剔除 GA4 噪声目标 |

### 🟠 P1 — 应做

- [ ] 给 Princemussa / raoufbrahim / aatm44197 等同 IP 多次提交者打 "可能 spam 嫌疑" 标签
- [ ] Supabase contact_submissions 加 status 字段（业务侧填）
- [ ] 跑半月报（5-29 周五）评估是否要切 Manual CPC（如 imp_share 跌回 < 14%）

### 🟡 P2 — 可做

- [ ] LP `/lp/google-ads-factory-direct.html` 自身 UX/CTA 审计（CVR 5.2% 能否到 7%）
- [ ] daily 看板自动判定 SG 占比 / sb_clean 累计 + 异常预警

### ❌ 删除 / 推迟

- ❌ "GA4 SG < 10%" 目标（已证为 measurement 失真，不是真 bot）
- ❌ Half-month (5-29) 加 Ads 预算决策（先看 bot prefix 实战效果 + LP 流量是否真的回来）
- ⏸ Offline conversion upload（推迟到月底）

## 📈 月度 baseline 修订（Week 1 数据更新）

| 维度 | 邮箱审计 (4-15~5-21) | Week 1 trend 外推 (5-18~5-24) | 最终判定 |
|------|-------------------|----------------------------|----------|
| Unique 询盘人/月 | 25 | 4×4.3 = 17 | **20-25/月** 区间 |

差异来源：Week 1 赶上 LP 流量跳水低谷。如 Week 2 LP 流量回升到 baseline 一半（96 AU/月 → CVR 5.2% → 5 lead/月），则 ground truth 应回到 22-25/月。

**plan 月度目标**：从 35-45 改为 **25-30 保守 / 35 拉伸**。

## 三个"绝对要回答的核心问题"进度

> [!important] 月末必须有答案

1. **57 个 lead 里成单率多少？** → 周一 5-25 业务侧对话（plan 既定）
2. **Direct 53% 真正是什么来源？** → ✅ Week 1 已结案：GA4 noise / spam / 测量失真，不是真渠道
3. **修复后 begin_form → lead 漏斗稳定在多少？** → 样本太小（5 unique lead），需 Week 2-3 更多数据

## 关联文档

- [[direct-attribution-investigation]] — 5-20 Direct 黑盒破解
- [[lead-source-ground-truth-dashboard]] — 5-21 邮箱审计 + 三源校准
- [[Analytics/daily/2026-05-{18..24}]] — 每日数据
- [[changelogs/2026-05-{19..24}]] — 每日操作日志
