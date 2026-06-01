# Claude Code GA4 数据写入执行说明

## 概述
本指南用于指导 Claude Code 自动从 GA4 抓取数据并写入 Daily / Weekly 报告文件。

## 文件结构
```
Analytics/
├── _Claude-Code-GA4-Execution-Guide.md   # 本文件
├── _daily-template.md                     # Daily 模板
├── _weekly-template.md                    # Weekly 模板
├── daily/
│   └── YYYY-MM-DD.md                     # 每日报告
└── weekly/
    └── YYYY-WXX.md                       # 每周报告（ISO 周号）
```

## 执行判断逻辑
1. **仅更新 Daily**：当天还没有 Daily 文件时
2. **仅更新 Weekly**：当天是周日（每周复盘日），且本周 Weekly 文件不存在或未完成
3. **Daily + Weekly 一起更新**：当天是周日，且 Daily 也未写入

## 数据来源
- GA4 Property: phonerepairspares.com (GTM-TTBMN854)
- GA4 Property ID: a366477268p502760218
- GA4 + Supabase 用脚本拉取：`python3 Analytics/scripts/ga4_fetch_daily.py YYYY-MM-DD`
- **Microsoft Clarity（行为分析 / bot 识别 / 热图洞察）**：`python3 Analytics/scripts/clarity_fetch_daily.py [YYYY-MM-DD]`
  - 紧接 GA4 脚本之后运行，会把「## Clarity 行为分析」段追加进当天 `daily/YYYY-MM-DD.md`（幂等，已存在则替换）。
  - Token 从 `~/.hermes/.env` 的 `CLARITY_API_TOKEN` 读取（Data.Export scope）。
  - ⚠️ Clarity Data Export API 只提供**最近 1-3 天**，且限 **10 次请求/天**，必须**当天运行**，无法回取历史日期。

## 每日执行顺序（推荐）
```bash
python3 Analytics/scripts/ga4_fetch_daily.py 2026-05-31      # ① GA4 + Supabase，生成日报
python3 Analytics/scripts/clarity_fetch_daily.py 2026-05-31  # ② Clarity 行为段追加
# ③ 手动追加「## 当日分析」段（GA4 + Clarity + Ads 交叉印证 + 询盘跟进）
```

## 需要采集的数据

### Daily 数据（单日）
- active_users / new_users / event_count
- avg_engagement_time
- top_pages（Views, Active Users, Bounce Rate）
- sessions_by_source（source/medium 维度）
- cities
- key_events

### Weekly 数据（7 天汇总 + 复盘）
- 所有 Daily 字段的 7 天汇总
- sessions_by_channel（Channel Group 维度）
- landing_page 排名（Sessions, Active Users, Key Events）
- lead_acquisition（New Leads by Channel）
- top_article_1~3（博客文章表现）
- top_landing_1~3（Organic Landing Page 排名）
- week_over_week 对比

## YAML 字段命名规范
- 字段名使用 snake_case
- 数值字段：整数不加引号，百分比用字符串如 "96.8%"
- 时间字段：用字符串如 "22s" / "1m 00s"
- 空数据填 `0` 或 `""`，并在 notes 中说明

## 完成标准
### Daily 完成标准
- [ ] YAML frontmatter 所有必填字段已填写
- [ ] active_users / new_users / event_count 有实际数值
- [ ] top_pages 至少 3 条
- [ ] sessions_by_source 至少 2 条
- [ ] **「## Clarity 行为分析」段已生成（bot 占比 / 体验信号 / Top 真人页面）**
- [ ] **「## 当日分析」段已写（GA4 + Clarity + Ads 交叉印证）**

### Weekly 完成标准
- [ ] YAML frontmatter 所有必填字段已填写
- [ ] traffic_by_channel 完整（含 Direct / AI Referral / Organic / Paid）
- [ ] top_landing_1~3 已回填（如可获取）
- [ ] top_article_1~3 已回填（如可获取）
- [ ] lead_acquisition 已填写
- [ ] week_summary 正文部分有分析内容
