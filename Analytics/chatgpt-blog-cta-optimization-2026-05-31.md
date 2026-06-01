# ChatGPT 流量 → 询盘页 转化断点优化方案

> 2026-05-31 | 基于 Clarity 热图 + GA4 5-31 数据 | 目标：把 ChatGPT 带来的 blog/首页流量导向 `/wholesale-inquiry`

## 一、问题（数据支撑）

- ChatGPT referrer sessions 连续上升 1→3→5（5-29~5-31），但 `begin_form=0 / generate_lead=0`，**0 转化**。
- Clarity 显示 ChatGPT 的 5 个 session 落在**首页 + blog 科普文**（back-glass / charging-port / samsung-a15 guide），**没有一个走到 `/wholesale-inquiry`**。
- 首页 CTA 充足（`/wholesale-inquiry` 出现 3 次：Hero / Fast Stock / Bottom）→ **首页不是瓶颈**。
- **瓶颈是 blog 文章模板**：整篇文章只有 1 个 wholesale CTA，位于最底部（正文 + Tags + Related Posts 全部之后，`blog/[slug]/page.tsx:595-605`）。
- 平均滚动深度仅 **38.6%**（Clarity）→ 绝大多数读者**滚不到底部那个 CTA**。
- 设备：Clarity 23 session 中 ChromeMobile 10 + MobileSafari 8 = **~78% 移动端**，但 blog 移动端无侧栏、无常驻 CTA。
- 埋点缺口：blog 底部 CTA 用普通 `<Link>`（无 `trackEvent`），**点击未进 GA4** → 当前无法衡量 blog CTA 表现。

## 二、方案（全部改在 blog 模板 / 共享组件，一次性覆盖所有文章）

### P0 — 高 ROI / 低成本

**① 正文中段内联 CTA（catch 38.6% 滚动区内的读者，移动+桌面都吃到）**
- 实现：在 `MarkdownRenderer.tsx` 的 h2 自定义组件里计数，在**第 1 个 H2 之后**注入一个 CTA 卡（或新建 `BlogInlineCTA` 组件由模板在正文 ~30% 处插入）。
- 文案随文章主题（见 ④），深链带 `?product=`。
- 理由：CTA 出现在大多数人真正会看到的区域（< 40% 滚动），是单点最高杠杆。

**② 移动端 sticky 底部 CTA 条（覆盖 ~78% 移动流量，全程可见）**
- 实现：`blog/[slug]/page.tsx` 加 `BlogStickyCTA`（`md:hidden` 仅移动端），固定底部细条："Get Wholesale Quote →"。
- 理由：移动端无侧栏，这是移动端的"常驻 CTA"等价物；B2B 维修店主大多手机浏览。

### P1 — 中 ROI

**③ 桌面 sticky 侧栏 CTA 卡**
- 实现：侧栏 `aside`（`page.tsx:581-583`）已 `sticky top-24`，在 `TableOfContents` 下方加一张"Get Wholesale Quote"卡（或用 TOC 组件 footer 区 `TableOfContents.tsx:225`）。
- 理由：桌面读者全程可见，零额外滚动成本。

**④ CTA 文案上下文化 + 预填深链**
- 现状：底部 CTA 是通用文案"Need Wholesale Phone Repair Parts?"。
- 改：按文章 category/tags 映射到具体品类 + 用 `?product=` 深链（询盘页已支持预填，确认于 `wholesale-inquiry/page.tsx:232-269`）：
  - back-glass 文 → `/wholesale-inquiry?product=iPhone Back Glass`，文案"Need iPhone back glass in bulk? Factory-direct pricing →"
  - charging-port 文 → `?product=Charging Port Flex`
  - samsung-a15 screen 文 → `?product=Samsung A15 Screen`
- 理由：相关性越高 CTR 越高；预填降低表单摩擦。

### P0.5 — 顺手必做（衡量前提）

**⑤ 所有 blog CTA 换 `TrackedLink` + 唯一 event_label**
- 现状：blog 底部 CTA 是普通 `<Link>`，点击不进 GA4。
- 改：换成首页同款 `TrackedLink`，label 区分位置（`Blog Inline CTA` / `Blog Sticky CTA` / `Blog Sidebar CTA` / `Blog Bottom CTA`）。
- 理由：没有埋点就无法判断哪个 CTA 有效、改了有没有用。**先于一切优化**。

## 三、落地顺序建议

1. ⑤ 埋点（半小时，先能测）
2. ① 正文中段内联 CTA + ④ 上下文文案/预填（核心杠杆）
3. ② 移动 sticky 条（覆盖 78% 移动）
4. ③ 桌面侧栏卡（补桌面）

## 四、衡量

- 主指标：`begin_form` / `generate_lead`（尤其 chatgpt source 维度）
- 次指标：各 `Blog * CTA` event_label 的 `quote_cta_click` / Link 点击数
- 对照：Clarity 滚动深度是否因中段 CTA 改变、blog → wholesale-inquiry 的页面路径

## 五、注意

- 当前样本极小（5-31 ChatGPT 仅 5 session，blog 3 天个位数点击）。这套改造的判断依据是**结构性缺陷（CTA 全在 38.6% 滚动线以下 + 移动端无常驻 CTA + 无埋点）**，不依赖样本量。
- 改完后给 ChatGPT 渠道 1-2 周积累，再用 ⑤ 的埋点数据评估。
