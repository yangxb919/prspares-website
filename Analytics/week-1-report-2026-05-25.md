---
title: Week 1 Report (2026-05-19 → 05-25) — Draft
date: 2026-05-22
period_start: 2026-05-19
period_end: 2026-05-25
type: weekly-report
status: draft (Sun 5-25 finalize)
tags: [prspares, weekly, decision-day]
related:
  - [[PRSPARES Growth Plan 2026-05-19 to 06-18]]
  - [[direct-attribution-investigation]]
  - [[lead-source-ground-truth-dashboard]]
---

# Week 1 Report — 2026-05-19 → 05-25（草稿，周日定稿）

> [!info] 本周主题原是"验证修复 + 修测量底子"，结果实际工作变成"颠覆 baseline + 抓真实 bot"
> 单 ~~Direct 53% 黑盒~~ → ~~邮箱审计~~ → ~~SG IP 误归因~~ 这 3 个 ground truth 调查就重写了整个 plan

## 📊 Week 1 数字 vs 目标

| 指标 | Baseline | 目标 | 周一~周四实际 | 判定 |
|------|---------|------|--------------|------|
| 周询盘 (sb_clean) | 14 (GA4 噪声) → **25/月 (邮箱审计)** | 8-11/周 | 4 天 4 sb_clean，周五还会续 | 🟡 接近 |
| begin_form → lead | 58% | ≥ 65% | 待 5-25 数据完整后算 | ⏸ |
| Ads conv 回传率 | 78% | ≥ 95% | Ads token 过期无法查 | ⚠️ |
| **Singapore 占比** | **37.7%** | **< 10%** | 8 天均 37%（不降反升） | ❌ → 5-22 实际修复 |
| Ads imp_share | 11.4% | 14-18% | 5-19 17.9% / 5-20 11.4% / **5-21 23.2%** | ✅ 自愈达标 |
| Ads 日均花费 | $5 | $25-40 | 5-15~5-20 仅 $4-18 | ❌ Smart Bid 困死 |

## 🏆 Week 1 真正的成就（实际比 plan 更深）

### 1. 三层 ground truth 校准把"57 leads/月" 纠正成 "25 unique 询盘人/月"

通过三个数据源交叉对账（GA4 / Supabase / wendy-lee Zoho IMAP），把过去 30 天真实 baseline 锁定在 **~25/月**：

| 数据源 | 30 天估算 | 可信度 |
|--------|---------|--------|
| GA4 generate_lead | 57 | ❌ 含 30 封 spam + bot |
| Supabase sb_clean | 13 | ⚠️ 5-12 前 wholesale-inquiry 不写 DB |
| **wendy-lee 邮箱审计** | **25 unique 询盘人** | ✅ ground truth |

### 2. Turnstile 修复彻底压制 spam（30 → 0）

- 4-15~5-11 (27 天): 30 封 spam 邮件，集中 4-29~5-05 爆发
- 5-12~5-21 (10 天): **0 封 spam**
- 这是 commit `cbe3644`（删客户端 Turnstile 预 verify）+ `6f0e26d`（defensive Supabase）+ `a7c76d0`（SG IP）+ `01fcd3c`（邮箱审计）四连击的合力

### 3. 用真实 nginx log 锁定 bot IP（不是 GA4 报告的 SG）

GA4 报"SG 37%" 是误归因。VPS nginx 5 天 log 显示真实 bot 来源：
- **Techoff SRV Limited**: 8 IPs / 1152 次 / Andorra + Netherlands
- **印度家用 bot 集群** (Rekha/Harsh/Mahavir Jain): 416 次
- 散户 (Smartnet DE / TELECOMTRADE UA): ~150 次

**修复**（commit `58c5d47`，今天 5-22）：加 8 个 /24 prefix 拦真 bot。下周看 SG 是否归位。

### 4. 已交付的具体改动 (Week 1)

| 日期 | Commit | 内容 |
|------|--------|------|
| 5-19 周二 | `75830b9` | contact_click 拆 email_click + phone_click |
| 5-20 周三 | `69b273c` | thank_you_page_view 走 trackEvent 统一门控 |
| 5-20 周三 | `5813377` | Direct 归因调查 part 1 报告 |
| 5-21 周四 | (Ads API) | 4 个新 negative：mobil centrix / mighty wireless / siren wireless / supreme phone parts |
| 5-21 周四 | `8df96ab` | ga4_fetch_daily.py 加 .env.local 解析 + 7 天 backfill |
| 5-21 周四 | `01fcd3c` | wendy-lee 邮箱 IMAP 审计 dashboard |
| 5-22 周五 | `58c5d47` | middleware 8 个真 bot prefix (nginx log 实证) |

## ❌ Week 1 失败/卡住的点

### 1. Ads OAuth refresh token 过期

- 5-22 今天发现 `~/.hermes/.env` 里 `GOOGLE_ADS_REFRESH_TOKEN` 失效
- 影响：今天无法 API 切 Manual CPC（Plan 决策点 1 的预定动作）
- 后续 Ads 所有 API 操作都阻塞
- **待用户外部修复**

### 2. LP 流量 10x 跳水死锁

- LP `/lp/google-ads-factory-direct.html` 5-15 后 6.4 AU/天 → 0.67 AU/天
- Smart Bidding 死循环：无 conversion → 降出价 → 没流量 → 无 conversion
- 等 OAuth 修好后必须立刻切 Manual CPC 或重启 bidding

### 3. Singapore 修复延迟一周

- 5-15 加的 30 个 SG datacenter prefix 完全无效，因为 bot 根本不在 SG（GA4 误归因）
- 损失 7 天调查时间。今天 5-22 才用 nginx log 锁定真 bot IP
- 教训：每天看板要多看 nginx log，不只 GA4

## 🎯 Week 2 plan 修订建议（明天 5-25 周日定稿）

按 plan 原 Week 2 主题是"Offline conversion 上线 + Title 重写"。但当前优先级应该是：

| 原 Week 2 任务 | 修订建议 |
|---------------|---------|
| Offline conversion upload 链路 | ⏸ **暂停**，等 Ads OAuth 修好 |
| Title 重写剩余 7 篇 | ✅ 继续，独立于 Ads |
| Half-month review 决定加预算 | ❌ **不应加预算**，先看本周 bot prefix 效果 + LP 流量是否回来 |

**新增的 Week 2 P0**：
- [ ] 验证 5-22 commit `58c5d47` 是否真的把 SG 占比拉回 < 10%
- [ ] Ads OAuth 修复后立刻：(a) Manual CPC 切；(b) 看 LP 流量是否回升；(c) 补 4 个 negative 的实际效果
- [ ] 设计"业务侧 lead 跟进 status" Supabase schema（plan 5-25 的对话准备）

## 📋 待办 traffic light

### 🔴 必做（72h 内）
- [ ] 用户修复 Ads OAuth refresh token
- [ ] 周日 5-25 与业务侧关键对话：4 月 23 个 unique 询盘人有多少成单/报价/寄样品

### 🟠 应做（Week 2 内）
- [ ] daily 看板自动判定 SG 占比 / sb_clean 累计 + 异常预警
- [ ] Supabase contact_submissions 加 status 字段
- [ ] 给 Princemussa / raoufbrahim / Atm Atm 等重复或不寻常提交者打 spam 嫌疑标签

### 🟡 可做（Week 3+）
- [ ] LP `/lp/google-ads-factory-direct.html` 自身 UX/CTA 审计（CVR 5.2% 已很好，但能否到 7%？）
- [ ] Title 重写剩 7 篇高展示低点击文章
