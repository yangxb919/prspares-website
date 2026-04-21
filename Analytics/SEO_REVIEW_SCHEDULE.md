# SEO 改造效果复盘日程
**改造完成日：** 2026-04-21
**基线数据：** 30 已索引 / 178 未索引 / 103 点击 / 7520 展示 / CTR 1.4% / 平均排名 9.7

> 💡 Claude Code 的 cron 是 session-only，会话关闭就失效。所以把日程放这里，你每天同步 GA4 时会看到这个目录，自然会记起来。或者让 Claude 每次进入时读 `Analytics/` 就行。

---

## 信号到达时间表

| 距今 | 日期 | 能看到什么 |
|-----|------|----------|
| **3 天** | 2026-04-24 | Googlebot 重新抓取完那 20 篇 → GSC URL Inspection "Last crawled" 变成 4/22 之后的日期 |
| **7 天** | 2026-04-28 | 新 title/desc 开始在 SERP 显示（Google 快照更新）；CTR 早期信号出现 |
| **14 天** | 2026-05-05 | 多数文章的新 meta 已被 Google 吸收；CTR 趋势在 GSC 有较可信样本量 |
| **21 天** | 2026-05-12 | 关键评估节点：已编入索引数是否上升、已发现-未抓取数是否下降 |
| **42-56 天** | 2026-06-02~16 | 排名变化完整生效；301 合并的旧 URL 权重转移完成 |
| **60-90 天** | 2026-06-20~07-20 | 最终结果：organic 流量目标 +5-10x（从基线看） |

---

## 🗓️ Checkpoint 1：T+7 天（2026-04-28 周二）

告诉 Claude：**"执行 SEO 第 1 周 checkpoint"**，或手动检查：

- [ ] 打开 GSC URL Inspection，随便查 3 篇之前提交的文章，看 "上次抓取时间" 是否 ≥ 2026-04-22
- [ ] Google 搜 `site:phonerepairspares.com/blog/iphone-13-screen-replacement`，看快照 <title> 是否是 **"iPhone 13 Screen: OEM vs Aftermarket — £2 Price, 400% Gap"**
- [ ] GSC Performance 看过去 7 天 vs 上个 7 天，**CTR 有无变化**（最敏感指标）
- [ ] GSC Sitemaps，sitemap-0.xml 上次读取时间 ≥ 2026-04-22

**判断：**
- ✅ 3/4 满足 → Google 正在响应，继续观察
- ⚠️ ≤ 2/4 满足 → 手动在 GSC 触发抓取，检查 sitemap 是否可访问

---

## 🗓️ Checkpoint 2：T+21 天（2026-05-12 周二）

告诉 Claude：**"执行 SEO 第 3 周综合复盘"**，我会生成报告到 `Analytics/seo-3week-review-2026-05-12.md`。

**主查指标：**
- [ ] GSC 已编入索引数：30 → **目标 ≥ 60**
- [ ] GSC 已发现-尚未编入索引：110 → **目标 ≤ 70**
- [ ] 近 21 天总点击：基线 × (21/90) ≈ 24 → **目标 ≥ 60**
- [ ] 非品牌词点击比例：~14% → **目标 ≥ 30%**
- [ ] GA4 Organic Search 流量占比：2-11% → **目标 ≥ 20%**

**决策树：**
- ✅ 2/3 以上达标 → 推进 P2（外链、剩余 slug、新内容节奏）
- ⚠️ 1/3 达标 → 延长观察期 2 周，查找卡点
- 🔴 全部未达标 → 有可能有技术问题或负面改动，全面排查

---

## 🗓️ Checkpoint 3：T+56 天（2026-06-16 周二）

**最终评估：** SEO 改造 ROI 是否成立。

**成功标准：**
- Monthly organic clicks 从 30-40 → **≥ 300**
- 已索引数 ≥ 120（139 篇里的 85%）
- 至少 10 个非品牌关键词 top 10 排名

---

## 如果你忘了今天改了什么

```bash
cd /Users/yangxiaobo/Desktop/prspares-website
git log --oneline --since="2026-04-21"
cat changelogs/2026-04-21.md
cat SEO_ACTION_PLAN_2026-04-21.md
```

---

## 这期间不要做的事（防止污染归因）

1. ❌ 不要改 blog 页面的 title/meta（除非 Claude 发现新问题）
2. ❌ 不要新增更多 301 redirect
3. ❌ 不要大批量发新文章（单周 > 5 篇会让 Google 怀疑）
4. ❌ 不要改 sitemap 配置
5. ❌ 不要改 next-sitemap.config.js 的 fetchPostSlugs 逻辑

**可以做的：**
- ✅ 持续 GA4 日同步
- ✅ 修复发现的 bug（与 SEO 无关的）
- ✅ 本地测试改动（不推生产）
- ✅ T12 外链建设——这是长期积累，越早越好（但不会影响 P0/P1 归因）
