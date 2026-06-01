# PRSPARES 流量增长 30 天执行方案

**创建**: 2026-05-31 | **负责**: Bowen Yang + Claude Code | **复盘日**: 2026-06-30

> 一句话：把米课"选题→内容→转化→规模化"打法，用 **GSC（真实排名）+ DataForSEO（市场大小）** 双数据源跑通，
> 嵌进现有 GA4→Clarity 每日例程，30 天后非品牌曝光与点击可量化增长。ChatGPT/AEO 渠道并行深耕。

---

## 一、30 天可量化目标（复盘日对照）

| 指标 | 基线 (2026-04-28~05-25, GSC) | 30 天目标 | 怎么算成功 |
|---|---|---|---|
| 非品牌总曝光 | 960 / 28天 | **≥ 1500 (+55%)** | GSC queries.csv 去品牌词求和 |
| 非品牌点击 | ~1 / 28天 | **≥ 15** | 同上 clicks 求和 |
| 🔴 抢点击词进点击 | 0（128曝光0点击） | **≥ 3 个词开始有点击** | CTR_FIX 桶逐词跟踪 |
| 🟡 推首页词排名 | pos 18-30 | **≥ 2 个进 Top 10** | backlog 周对比 position |
| ChatGPT sessions | 5/天 (5-30) | **稳定 ≥ 8/天，出现 begin_form** | GA4 + Clarity |
| 新发布文章 | — | **8-10 篇（瞄准 backlog 高优先级）** | Supabase posts |

> 现实预期：SEO 是慢变量，30 天主要看**曝光/排名先动**（领先指标），询盘是 60-90 天的滞后结果。
> 不要用"这个月来了几个询盘"评判 SEO；用"曝光涨没涨、目标词排名升没升"评判。

---

## 二、三条腿打法（按 ROI 排序，倒着做米课五环）

### 🦵 腿 1：补转化漏桶（最高 ROI，先做，1 次性）
**为什么第一**：现在流量进来接不住——blog 滚动深度仅 38.6%，唯一的 wholesale CTA 在最底部没人看到；
排第一的词 128 曝光 0 点击。往漏桶里加水之前先补桶。

落地（参考 `Analytics/chatgpt-blog-cta-optimization-2026-05-31.md` 5 项）：
1. blog 正文中段内联 CTA（catch <40% 滚动区）
2. 移动端 sticky 底部询盘条（78% 是移动流量）
3. 桌面 sticky 侧栏报价卡
4. CTA 文案上下文化 + `?product=` 预填深链
5. 全部换 TrackedLink 埋点（衡量前提，**先做**）

### 🦵 腿 2：抢点击 + 推首页（现成流量，快见效）
靠 `keyword_opportunity.py` 的 🔴CTR_FIX + 🟡PUSH 两桶。本周实测结果：

**🔴 抢点击（排第一却 0 点击）** — 改标题/Meta/加 FAQ schema 抢 AI Overview：
- `how to verify phone parts wholesaler not gray market`（pos 1-3，128 曝光，0 点击）← 头号目标

**🟡 推首页（第 2-3 页，推一把上首页）** — on-page 优化（H 标签/内链/补段落）：
- `iphone 14 pro max back glass replacement`（2400/mo，pos 18.8）← 大市场
- `iphone battery wholesale`（pos 24.9，已有 1 点击，LOW 竞争）

### 🦵 腿 3：写新文抢金矿词（长期增量，规模化）
靠 🟢NEW 桶。本周实测挖到的金矿（**有市场、低竞争、强商业意图、你几乎没排名**）：

| 关键词 | 月搜量 | 竞争 | 当前排名 | 备注 |
|---|---|---|---|---|
| **cell phone parts wholesale** | **9900** | **LOW** | pos 38.5 | 头号金矿，大词低竞争 |
| phone replacement parts | 1900 | LOW | 未排名 | |
| cell phone replacement parts | 1600 | LOW | 未排名 | |
| wholesale cell phone parts | 1300 | LOW | pos 41.8 | |
| iphone parts | 5800 | LOW | 未排名 | 大词 |

内容生产用 `blog-writer-pro` / `prspares-blog-writer` skill（强制注入你的采购/维修 insight = EEAT），
发布用 `publish-obsidian-blog`。

### 🦵 ChatGPT / AEO 渠道（并行，已确认要继续）
现状：sessions 1→3→5 爬升中，但 0 lead，落点在首页+blog 没到询盘页。继续动作：
1. **转化**：腿 1 的 CTA 改造同时解决 ChatGPT 流量"到不了询盘页"问题
2. **被引用**：写新文时结构化（FAQ schema、清晰小标题、数据表格）→ 更易被 ChatGPT 引用
3. **监测**：每日 GA4 看 ChatGPT sessions/begin_form/generate_lead；referrer 含 `chatgpt`/`openai`
4. 保持 commit c7e090d 已开的 crawler signal + procurement-intent schema

---

## 三、嵌入每日例程（在现有 GA4→Clarity 之后加 1 步）

**每天**（约 +2 分钟，几乎免费）：
```
1. python3 Analytics/scripts/ga4_fetch_daily.py <date>      # 已有
2. python3 Analytics/scripts/clarity_fetch_daily.py <date>  # 已有
3. 手动「当日分析」                                          # 已有
   └─ 新增观察项：ChatGPT sessions 趋势 + 目标词有无新点击（从 GSC 日数据感知）
```

**每周一**（约 15 分钟，约 $0.05-0.3）：
```
4. python3 Analytics/scripts/gsc_fetch.py --days 28         # 拉新一期排名
5. python3 Analytics/scripts/keyword_opportunity.py         # 刷新 backlog（GSC×DataForSEO）
   └─ 读 Analytics/keyword-backlog/backlog_<期>.md
   └─ 对比上周：哪些词排名升了/降了，决定本周做哪 2-3 个
```

**每周产出节奏**（30 天 = 4 周）：
- Week 1：做腿 1（CTA 改造，一次过覆盖所有 blog）+ 修头号 CTR_FIX 词
- Week 2-4：每周 1 篇新金矿文（腿 3）+ 1 个 PUSH 词 on-page 优化（腿 2）
- 累计：CTA 1 套 + 新文 ~3-4 篇 + 优化旧文 ~3 个（加上已有储备可冲 8-10 篇）

---

## 四、衡量与复盘（6-30 复盘日做）

复盘动作：
1. 重跑 `gsc_fetch.py` + `keyword_opportunity.py`，与本基线对比
2. 填第一节目标表的"30天实际"列
3. 判断：领先指标（曝光/排名）有没有动？动了 = 方向对，继续；
   完全没动 = 检查是否发文太少 / 索引问题 / 选错词

## 五、成本

- DataForSEO：每周刷新约 $0.05-0.3（带缓存，重复词免费），余额 $29.87 够跑大半年
- GSC / GA4 / Clarity：免费
- 主要成本是**内容生产的时间**（你注入 insight 的部分，AI 替不了）

## 六、关键文件

- 引擎：`Analytics/scripts/keyword_opportunity.py`
- 每周 backlog：`Analytics/keyword-backlog/backlog_<期>.md`
- 转化方案：`Analytics/chatgpt-blog-cta-optimization-2026-05-31.md`
- 每日指南：`Analytics/_Claude-Code-GA4-Execution-Guide.md`（已更新含本流程）
- 本方案：`Analytics/traffic-growth-30day-plan-2026-05-31.md`
