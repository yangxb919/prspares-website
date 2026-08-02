---
date: "2026-08-02"
scope: "Google Ads × GA4 × GSC 三平台交叉分析，6月 vs 7月"
data_sources: "Ads API / GA4 Data API / GSC Search Analytics API / Supabase contact_submissions"
---

# 三平台交叉分析：7 月询盘 +48%，且三方数字能对上账

## 一、总览（6月 → 7月）

| 指标 | 6月 | 7月 | 变化 |
|---|---|---|---|
| **真实询盘（Supabase）** | **27** | **40** | **+48%** |
| GSC 点击 | 135 | 343 | +154% |
| GSC 曝光 | 26,478 | 47,362 | +79% |
| GSC 平均排名 | 10.4 | 8.6 | 改善 1.8 位 |
| GSC CTR | 0.51% | 0.72% | +41% |
| GA4 总会话 | 1,598 | 2,544 | +59% |
| Ads 花费 | ¥950 | ¥1,847 | +94% |
| Ads 点击 | 78 | 157 | +101% |
| Ads 转化 | 6 | 12 | +100% |
| Ads CPA | ¥158 | ¥154 | 持平 |

> 💰 Ads 账户货币是 **CNY**。¥1,847 ≈ $264，CPA ¥154 ≈ **$22/条询盘**。

## 二、✅ 三平台对账：四组数字全部吻合

这是本次分析最有价值的结论——**转化埋点是可信的**，后续决策可以放心用这些数字。

| 对账项 | 平台 A | 平台 B | 判定 |
|---|---|---|---|
| 询盘总数 | GA4 `generate_lead` = **40** | Supabase 实际 = **40** | ✅ 完全一致 |
| 广告询盘 | Ads 转化 = **12** | LP 页提交 = **12** | ✅ 完全一致 |
| 自然流量 | GSC 点击 343 | GA4 Organic 会话 285 | ✅ 合理（点击≥会话） |
| 付费流量 | Ads 点击 157 | GA4 Paid 会话 139 | ✅ 合理 |

**7 月 40 条询盘的来源结构**：

| 提交页面 | 条数 | 占比 | 渠道含义 |
|---|---|---|---|
| `/wholesale-inquiry` | 25 | 62% | 自然 + AI + 直接 |
| `/lp/google-ads-factory-direct.html` | 12 | 30% | **Ads 独占** |
| `/id/wholesale`（印尼 LP） | 1 | 2% | 自然 |
| prspares.xyz | 2 | 5% | 旧域名（08-01 已 301） |

自报来源字段（07-21 上线，样本 14）：**ChatGPT 10 / Google Search 3 / Reddit 1** —— ChatGPT 占 71%。

## 三、渠道质量：必须看 engaged 而不是会话数

| 渠道 | 7月会话 | engaged | 参与率 | 判定 |
|---|---|---|---|---|
| Direct | 1,796 | 179 | **10%** | 🔴 绝大部分是 bot |
| Organic Search | 285 | 117 | 41% | ✅ 真人 |
| **AI Assistant** | **252** | **145** | **58%** | ✅ 质量最高 |
| Paid Search | 139 | 82 | 59% | ✅ 质量最高 |
| Referral | 34 | 17 | 50% | ✅ |

**Direct 占了全站 71% 的会话，却只贡献 33% 的 engaged。** 若按会话数看报表会得出完全错误的结论。

🔴 **近 7 天 Direct 异常暴涨**：326 → 829（+154%），参与率仅 8.6%。
落地页维度也印证：`(not set)` 有 2,259 会话但只有 260 engaged。这批流量需要盯，
目前尚未确认是否消耗了 VPS 资源（与 08-02 观察到的 Googlebot p95=2.09s 可能相关，待验证）。

AI 来源细分（7月）：chatgpt.com **276 会话 / 154 engaged (56%)**、perplexity 4、gemini 2、copilot 2。
**ChatGPT 一家占 AI 渠道的 97%。**

## 四、🔴 发现：GA4 事件数据被污染（但**未**影响 Ads 出价）

7 月事件计数出现倒挂——`form_submit` (1140) 竟然远大于 `begin_form` (163)：

| 事件 | 次数 | 判定 |
|---|---|---|
| form_submit | 1,140 | 🔴 异常 |
| contact_click | 1,030 | 🔴 **代码里明写「not actively fired」** |
| request_quote | 1,030 | 🔴 异常 |
| chat_start | 1,027 | 🔴 异常 |
| quote_cta_click | 258 | 合理 |
| begin_form | 163 | 合理 |
| whatsapp_click | 85 | 合理 |
| **generate_lead** | **40** | ✅ 与真实询盘完全一致 |
| thank_you_page_view | 18 | 合理 |

**根因方向**：`src/lib/analytics.ts:12` 明确注释 `contact_click` 是
「legacy umbrella event (kept for historical compat; **not actively fired**)」，
且该文件为所有事件配了 `requireHuman` + `minTimeOnPage` 的人机 gating。
**代码不触发、GA4 却记了 1030 次** → 这些事件来自 **GTM 容器（GTM-TTBMN854）的独立配置**，
绕过了代码侧的 gating。三个事件计数高度接近（1030/1030/1027）且与 Direct bot 量级相当，
符合「同一个宽泛触发器批量触发」的特征。

### ✅ 但已排除最坏情况：Ads 智能出价没有被污染

查了全部 13 个 conversion action 的 `include_in_conversions_metric`：

- **计入转化的只有 2 个**：`提交潜在客户表单`、`Lead form - Submit`（均 ENABLED + primary_for_goal=True）
- 被污染的 `contact_click` / `request_quote` / `chat_start` / `form_submit` **全部是 HIDDEN 且不计入转化**

→ MaxConv 出价用的是干净信号，**没有在为 bot 付费**。这解释了为什么 Ads 只报 12 转化而非 1030。

## 五、自然搜索增长的结构

7 月 343 次点击高度集中在 5 篇消费者症状文：

| 页面 | 点击 | 曝光 | 均位 |
|---|---|---|---|
| boot-loop（换屏后开机循环） | 102 | 9,019 | 6.9 |
| S23/S24 换屏 | 39 | 5,497 | 7.5 |
| 14PM best-value | 33 | 2,917 | 7.6 |
| 14PM 后盖 | 27 | 6,574 | 7.4 |
| iPhone 11 换屏 | 20 | 5,227 | 6.2 |

**top 5 占 221/343 = 64%，boot-loop 一篇就占 30%。** 全部是消费者维修问题，无一 B2B 采购词——
与 07-31 归因复盘的结论完全一致。

CTR 仍是短板：boot-loop 9,019 曝光只有 102 点击（1.1%），排名 6.9 位。
这印证 8 月主线 B 的 CTR 单点方向正确。

## 六、结论与待办

### 可以确认的
1. **业务在增长**：询盘 27 → 40（+48%），且增长来自多渠道而非单点。
2. **数据基础可信**：四组对账全部吻合，`generate_lead` 可作为唯一权威口径。
3. **Ads 效率稳定**：CPA ¥154（$22）持平于 6 月，花费翻倍的同时转化也翻倍——**线性扩张，未见边际递减**。
4. **AI 是质量最高的自然渠道**：参与率 58%，自报来源占 71%。

### 需要处理的
| 优先级 | 事项 |
|---|---|
| 🔴 P0 | **GTM 容器审计**：contact_click / request_quote / chat_start / form_submit 四个事件被 GTM 绕过代码 gating 批量触发，GA4 报表失真。需进 GTM-TTBMN854 查触发器配置。**不影响 Ads，但影响所有基于 GA4 事件的判断。** |
| 🟡 P1 | **Direct bot 激增**：近 7 天 +154%、参与率 8.6%。确认是否消耗 VPS 资源、是否需要在 nginx 层限流。 |
| 🟡 P1 | **CTR 优化**：boot-loop 等 5 篇高曝光页 CTR ~1%，排名已在 6-7 位，是 8 月主线 B 的靶子。 |
| 🟢 P2 | Ads 可考虑小幅加预算测试线性区间上限（当前 CPA 稳定，未见衰减）。 |
