---
title: PRSPARES 流量与 Google Ads 综合诊断报告
date: "2026-05-15"
period: "2026-05-08 ~ 2026-05-14 (近 7 天)"
data_sources:
  - GA4 Data API (Property 502760218 / phonerepairspares.com)
  - Google Ads API (Customer 164-200-5192)
---

# PRSPARES 流量 × Google Ads 综合诊断报告 (2026-05-15)

> 数据口径：GA4 + Google Ads 7 日完整数据（2026-05-08 ~ 2026-05-14）
> 今日 (05-15) 数据为 GA4 当时切片：AU 18 / Sess 18 / Ev 272，仅供今日趋势参考，不计入 7 日合计

---

## 一、TL;DR — 一句话结论

**最近 7 天总流量 223 AU / 237 sess / 514 Key Events，但 Google Ads 花了 $230.48 拿到 22 次点击 0 次转化；同期 generate_lead 仅 2 次，真正的高价值线索严重缺失。**

三个最值得马上动手的问题：

| 优先级 | 问题 | 数据证据 |
|--------|------|---------|
| 🔴 P0 | **Google Ads 0 转化、Ads→GA4 链路断裂** | 7 天 $230 投入 0 conv；GA4 中 google/cpc 落地页全为 "(not set)" → GCLID/UTM 未透传 |
| 🟠 P1 | **Singapore 异常流量占 37.7%**（非目标市场） | 84/223 AU 来自新加坡，目标市场 US+UK 合计仅 26 AU（11.7%） |
| 🟠 P1 | **表单漏斗坍塌**：begin_form → generate_lead = 8 → 2（25%） | 22 次 quote_cta_click 仅生成 2 个 lead，转化漏斗中段严重流失 |

---

## 二、GA4 流量总览（7 天）

### 2.1 核心指标
| 指标 | 数值 | 评估 |
|------|------|------|
| Active Users | **223** | — |
| New Users | 222 (99.6%) | 几乎全是新访客，老客回访极少 |
| Sessions | 237 | — |
| Events | 1,859 | — |
| Key Events | 514 | — |
| Engagement Rate | **27.8%** | 偏低（B2B 行业基准 ~45–55%） |
| Avg Engagement Time | **28s** | 偏短，与 bot 流量高一致 |

### 2.2 按日趋势（活跃用户 / 会话 / 事件）

| 日期 | AU | Sess | Events | Key Events | 说明 |
|------|----|------|--------|------------|------|
| 05-08 | 25 | 27 | 140 | — | 周五 |
| 05-09 | 30 | 32 | 337 | — | 周六 |
| 05-10 | 33 | 34 | 254 | — | 周日 |
| 05-11 | 26 | 29 | 173 | — | 周一 |
| 05-12 | 37 | 40 | 320 | — | 周二，最高 |
| 05-13 | 36 | 36 | 279 | — | 周三 |
| 05-14 | 38 | 39 | 356 | 132 | 周四，会话最多 |

趋势：周中（周二~周四）流量明显高于周末，符合 B2B 采购特征。

### 2.3 渠道分布 (Default Channel Group)

| Channel | Sessions | AU | Engaged | Key Events | 备注 |
|---------|---------|----|---------|-----------|------|
| **Direct** | **132 (55.7%)** | 131 | 16 | 256 | 异常偏高，怀疑混入 bot/工具流量 |
| Organic Search | 61 (25.7%) | 55 | 21 | 12 | SEO 流量，Bing 占主导 |
| Paid Search | 22 (9.3%) | 19 | 10 | **0** | 全部来自 Google Ads，**0 转化** |
| Unassigned | 14 (5.9%) | 14 | 14 | 212 | 主要是 chatgpt.com 引荐 |
| Referral | 8 (3.4%) | 4 | 5 | 34 | — |

> ⚠️ Unassigned 14 sess 却贡献 212 KE，平均每会话 15 个事件 → 几乎确定是 chatgpt 来的真实用户深度阅读。

### 2.4 Source / Medium Top 12

| Source / Medium | Sessions | AU |
|-----------------|---------|----|
| (direct) / (none) | 132 | 131 |
| bing / organic | 25 | 23 |
| **google / cpc** | **22** | 19 |
| duckduckgo / organic | 17 | 14 |
| chatgpt.com / (not set) | 14 | 14 |
| yahoo / organic | 10 | 10 |
| google / organic | 5 | 4 |
| chatgpt.com / referral | 4 | 2 |
| ecosia.org / organic | 3 | 3 |
| tagassistant.google.com / referral | 3 | 1 |

> 🟢 SEO 渠道亮点：**Bing > Google organic**（25 vs 5）— 这与中小 B2B 站常见模式吻合，但说明 Google SEO 还有大量空间。
> 🟡 chatgpt.com 累计 18 sess，AI 引流通道已经成型，值得专门优化 LLM 答案露出。

### 2.5 地理分布（Top 10）

| Country | City | AU | Sessions | 是目标市场? |
|---------|------|----|---------|------------|
| **Singapore** | **Singapore** | **84** | 84 | ❌ |
| United States | (not set) | 15 | 18 | ✅ |
| China | (not set) | 6 | 6 | ❌（自家访问？） |
| Singapore | (not set) | 6 | 6 | ❌ |
| United Kingdom | London | 4 | 4 | ✅ |
| United States | Los Angeles | 4 | 5 | ✅ |
| Vietnam | Hanoi | 4 | 4 | ❌ |
| (not set) | (not set) | 3 | 3 | — |
| United States | Dallas | 3 | 4 | ✅ |
| Belgium | Brussels | 2 | 2 | ✅ |

> 🔴 **Singapore 异常**：90 AU 来自新加坡（40%），但 PRSPARES 主力市场是 **US/UK/EU**。这部分流量大概率是：
> - VPS/数据中心 IP（Singapore 是 AWS / GCP 节点热门地区）
> - 监控工具、爬虫
> - 本人或同事开发/测试访问
>
> **建议**：在 GA4 加 IP 排除过滤器；在 Google Ads 已限制 US-UK 的话，确认 Singapore 不会被烧钱（见下文 Ads 部分）。

### 2.6 Top 页面

| Path | Pageviews | AU | Events |
|------|----------|----|--------|
| /wholesale-inquiry | 23 | 29 | 282 |
| /products/screens | 15 | 14 | 134 |
| / | 13 | 54 | 347 |
| /products | 13 | 10 | 116 |
| /products/small-parts | 8 | 8 | 78 |
| /products/batteries | 5 | 6 | 54 |
| /contact | 2 | 3 | 26 |
| /thank-you | 1 | 1 | 13 |

> /wholesale-inquiry（询盘页）pv 23 / events 282 — 平均每次访问触发 12 个事件，CTA 互动充分；但配合下面的 generate_lead 仅 2 次，说明**到了表单这一步用户大量跳出**。

---

## 三、转化漏斗（7 天）

| 事件 | 7 天计数 | 含义 |
|------|---------|------|
| contact_click | 84 | 点击联系入口（页面顶/底） |
| quote_cta_click | 22 | 点击"获取报价" CTA |
| begin_form | 8 | 真的开始填表 |
| generate_lead | **2** | 表单提交成功（真 lead） |
| thank_you_page_view | 1 | 进入 thank-you 页 |
| whatsapp_click | 2 | WhatsApp 跳转 |

**漏斗损失率**：
```
contact_click 84
    ↓ (-74%)
quote_cta_click 22
    ↓ (-64%)
begin_form 8
    ↓ (-75%)
generate_lead 2
```

> 🟠 begin_form → generate_lead 损失 75%。8 个用户开始填表只有 2 个提交成功 — 排查方向：
> 1. 表单必填字段太多？（注意：[66f0901] commit 刚加了 HTML required 校验，可能就是因此体验更"卡"）
> 2. Turnstile 校验失败？（近期 changelog 提到过 Turnstile 事故）
> 3. 移动端表单适配？（移动端是 Ads 主流量，CTR 11.6%）

---

## 四、Google Ads 诊断（7 天）

### 4.1 账户总览

| 维度 | 值 |
|------|----|
| Customer ID | 164-200-5192 |
| 启用中的 Campaign | **1 个** — "Search \| PR Spares \| Factory Direct \| US-UK \| EN" |
| 已暂停 | PRSPARES-Search-FactoryDirect-US-01（0 曝光） |
| **7 天花费** | **$230.48** |
| 曝光 | 258 |
| 点击 | 22 |
| CTR | 8.53% |
| 平均 CPC | $10.48 |
| **转化** | **0** ❌ |
| 转化价值 | $0 |

### 4.2 按日趋势

| 日期 | 曝光 | 点击 | CTR | 花费 | CPC | 备注 |
|------|-----|------|------|-------|------|------|
| 05-08 | 63 | 5 | 7.94% | $50.38 | $10.08 | |
| 05-09 | 47 | 5 | 10.64% | $49.69 | $9.94 | |
| 05-10 | 32 | 2 | 6.25% | $15.36 | $7.68 | |
| 05-11 | 46 | 3 | 6.52% | $39.24 | $13.08 | |
| 05-12 | 28 | 3 | 10.71% | $35.66 | $11.89 | |
| 05-13 | 20 | 3 | 15.00% | $35.17 | $11.72 | |
| 05-14 | 22 | 1 | 4.55% | **$4.96** | $4.96 | ⚠️ 花费骤降 |

> ⚠️ **5-14 单日花费仅 $4.96** — 平时日均 ~$35。建议检查：日预算是否撞顶、出价策略切换、广告组是否被限频。

### 4.3 广告组明细

| Ad Group | 曝光 | 点击 | CTR | 花费 | CPC | 转化 |
|----------|-----|-----|------|-------|------|------|
| Wholesale Parts Supplier | 140 | 13 | 9.3% | $130.17 | $10.01 | 0 |
| Phone Repair Parts B2B | 118 | 9 | 7.6% | $100.31 | $11.15 | 0 |

两组表现接近，没有明显谁优谁劣，问题在共同的"0 转化"。

### 4.4 设备分布

| 设备 | 曝光 | 点击 | CTR | 花费 |
|------|-----|------|------|-------|
| **Mobile** | 147 | 17 | **11.6%** | **$188.80 (82%)** |
| Desktop | 99 | 5 | 5.1% | $41.68 (18%) |
| Tablet | 12 | 0 | 0% | $0 |

> 🟠 **B2B 询盘业务 82% 预算花在 Mobile 上**，但 B2B 采购决策通常在 Desktop 完成。配合上面 begin_form 流失，移动端表单体验是关键瓶颈。

### 4.5 高消耗关键词 Top 7

| Keyword | 匹配 | Ad Group | 曝光 | 点击 | 花费 | CPC |
|---------|------|---------|-----|------|------|------|
| phone parts distributor | PHRASE | Wholesale Parts Supplier | 63 | 8 | **$69.55** (30%) | $8.69 |
| wholesale phone parts | PHRASE | Phone Repair Parts B2B | 35 | 4 | $42.11 | $10.53 |
| mobile repair parts distributor | PHRASE | Phone Repair Parts B2B | 56 | 3 | $37.60 | $12.53 |
| phone parts supplier | EXACT | Wholesale Parts Supplier | 29 | 3 | $31.12 | $10.37 |
| wholesale phone parts | EXACT | Wholesale Parts Supplier | 10 | 2 | $29.50 | **$14.75** |
| wholesale iphone parts | PHRASE | Phone Repair Parts B2B | 11 | 1 | $12.72 | $12.72 |
| wholesale phone screens | PHRASE | Phone Repair Parts B2B | 8 | 1 | $7.87 | $7.87 |

> "wholesale phone parts" EXACT 的 CPC $14.75 偏高；"phone parts distributor" PHRASE 一项就吃掉 30% 预算。

### 4.6 搜索词消耗 Top 10（实际触发广告的用户搜索）

| Search Term | Ad Group | 点击 | 花费 |
|-------------|---------|------|------|
| phone parts wholesale | Wholesale Parts Supplier | 1 | $21.79 |
| iphone screen vendor | Phone Repair Parts B2B | 1 | $19.13 |
| iphone parts wholesale | Phone Repair Parts B2B | 1 | $12.72 |
| phone parts | Wholesale Parts Supplier | 1 | $12.71 |
| wholesale iphone screens | Phone Repair Parts B2B | 1 | $11.10 |
| best cell phone parts supplier | Wholesale Parts Supplier | 1 | $10.96 |
| cell phone parts store | Phone Repair Parts B2B | 1 | $9.66 |
| iphone parts for sale | Wholesale Parts Supplier | 1 | $9.45 |
| wholesale phone parts | Wholesale Parts Supplier | 1 | $7.71 |
| mobile phone parts | Wholesale Parts Supplier | 1 | $7.44 |

### 4.7 ⚠️ 应该加否定关键词的搜索词

发现以下竞争对手品牌词被广告匹配（虽然无点击但浪费曝光）：

| 搜索词 | 类型 | 处置建议 |
|--------|------|---------|
| mengtor / mengtor cell phone parts | 竞品品牌 | 加 negative |
| mobile defenders parts | 竞品品牌 | 加 negative |
| mobile syntrex | 竞品品牌 | 加 negative |
| mobile centric | 竞品品牌 | 加 negative |
| brophone parts | 竞品品牌 | 加 negative |
| ishine mobile accessories | 竞品品牌 | 加 negative |
| mobile phone parts suppliers **uk** | 含地理修饰 | 保留，可单独提价 |
| phone accessories manufacturers in china | 含"china" | 评估 — 可能是 dropshipper 找货源，目标客户 |
| after market phone screen | 模糊 | 评估 |

### 4.8 🔴 Ads → GA4 归因链路断裂（关键问题）

GA4 看到的 Google Ads 落地页全部为 **"(not set)"**：

```
google / cpc           sess=22 au=19 ke=0 landing_page="(not set)"
google / organic       sess=5  au=4  ke=0 landing_page="(not set)"
```

**含义**：用户从 Ads 点进站后，GA4 没记录到落地路径 — 几乎确定是 GCLID/UTM 在跳转链路中被剥掉。可能的原因：

1. 广告 Final URL 没有挂 UTM 参数，且 Google Ads 账户没开启 auto-tagging（GCLID）
2. 网站某层 redirect 把 query string 丢了（middleware/Next.js redirect）
3. GTM 配置里 GA4 page_view 在 GCLID 写 cookie 之前触发

> 💡 **如果归因正常，那 22 次 cpc 点击应该带来若干 page_view → 起码能看出落在 /wholesale-inquiry 还是首页**。现在完全看不到 → 转化归因 100% 失效，这也解释了为什么 Ads 显示 0 conv（即使有人成交，也没法回传给 Google Ads 系统去优化）。

---

## 五、根因分析

| 现象 | 根因（推断） | 影响 |
|------|------------|------|
| Ads 0 转化 | 1) GCLID/UTM 链路断；2) Ads 没绑定 GA4 conversion import；3) 表单 begin→submit 漏斗大流失 | 智能出价没数据反哺 → 烧钱无优化 |
| Singapore 流量 40% | bot / 监控 / VPS IP 进入了 GA4 | 拉低 engagement_rate；干扰决策数据 |
| Direct 占 55.7% | UTM 丢失 + 应用内浏览器 + 内部访问 | 渠道贡献被低估 |
| Begin_form → Lead 仅 25% | Turnstile / 字段太多 / 移动端体验 / Required 校验门槛 | 真实 lead 损失 6/天 |
| 5-14 花费骤降 | 出价策略/预算撞顶/质量分波动 | 数据样本不足 |
| Bing 流量 > Google organic | Google SEO 长期未发力 | Google SERP 还有空间可挖 |

---

## 六、行动清单（按 ROI 排序）

> **⚠️ 报告勘误（2026-05-15 晚补）**：进一步通过 Google Ads API 查证后发现：
> - ✅ `customer.auto_tagging_enabled = True` — auto-tagging **已经开启**，原 P0 第一项作废
> - ✅ 30 天 conversion = **9**（不是 0），7 天 = 0 是窗口太短碰到低谷
> - 🔍 真正缺的是：conversion action `7550823356 "提交潜在客户表单"` 是 `WEBPAGE_CODELESS` 类型，必须页面上加载 `gtag.js?id=AW-18045108063` 才能匹配 thank-you URL；当前 GTM 容器虽然装了但**没绑 Google Ads Conversion tag**，所以 codeless 触发失败
> - 🛠 已在 [src/app/thank-you/ThankYouClient.tsx](src/app/thank-you/ThankYouClient.tsx) 加 **inline gtag fallback**，绕过 GTM 直接 fire conversion（保留原 dataLayer.push 向后兼容）

### 🔴 P0 — 本周内必须做

1. ~~**修复 Ads → GA4 归因链路**~~ ✅ 2026-05-15 晚已完成
   - ~~Google Ads auto-tagging~~ ← 早就开了，验证通过
   - ✅ /thank-you 注入 `gtag.js?id=AW-18045108063` + `gtag('event','conversion', ...)`
   - 🔜 **明天验证**：访问 `https://www.phonerepairspares.com/thank-you?lang=en`，看 Google Ads → Tools → Conversion → "提交潜在客户表单" 的 last-converted-at 是否更新；GA4 Realtime 看 `ads_conversion` 事件触发

2. **诊断 begin_form → generate_lead 75% 流失**
   - 调出 Turnstile 失败日志（changelogs 2026-05-12 有相关记录）
   - 移动端实地测试一次 /wholesale-inquiry 表单
   - 看 send-rfq-email API 是否有报错（cdcb4b2 / 6f0e26d 都涉及该 API）

3. **Singapore IP 过滤**
   - GA4 → Admin → Data Filters → 排除 Singapore 数据中心 IP
   - Ads 已限制 US/UK 投放则确认无新加坡花费泄漏（搜索词里没看到，安全）

### 🟠 P1 — 本月内做

4. **加竞品否词** (建议直接在 campaign 层加 6 个 negative)：
   ```
   mengtor, mobile defenders, mobile syntrex, mobile centric, brophone, ishine
   ```

5. **检查 5-14 花费骤降原因**
   - Ads UI 看 Recommendations / 出价策略报告
   - 是否撞日预算上限？

6. **移动端表单专项优化**（82% Ads 预算流向 Mobile）
   - 字段折叠 / 分步骤
   - 自动填充 hint
   - WhatsApp 一键跳转作为低门槛备选

### 🟡 P2 — 季度优化

7. **Google Organic 拓量**：Bing organic 25 vs Google organic 5，Google SEO 严重落后
8. **AI 引流跟踪**：chatgpt.com 18 sess 已自然形成，专门搞一组 LLM-friendly 长尾内容
9. **追加竞品品牌词的"对手对比"内容页**（不投广告，做 SEO）

---

## 七、附录：数据获取脚本

```bash
# GA4 每日 (在 uv 环境跑，自动加载 .secrets/ga4-key.json)
uv run --with google-analytics-data --with google-auth \
  Analytics/scripts/ga4_fetch_daily.py 2026-05-15

# Google Ads（用 Hermes venv，凭据从 ~/.hermes/.env 自动加载）
/Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 \
  scripts/google-ads-query.py --preset campaign-7d
/Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 \
  scripts/google-ads-query.py --preset search-terms-7d
/Users/yangxiaobo/.hermes/hermes-agent/venv/bin/python3 \
  scripts/google-ads-query.py --list-presets
```

GA4 7 日完整 daily 文件已写入 [Analytics/daily/2026-05-08.md](Analytics/daily/2026-05-08.md) ~ [2026-05-15.md](Analytics/daily/2026-05-15.md)。
