# PRSPARES 网站优化详细文档 — 基于 Microsoft Clarity 数据分析

> 日期: 2026-03-31
> 触发原因: Microsoft Clarity 热力图和会话回放数据显示多项严重 UX 问题
> 涉及页面: 6 个页面 + 1 个核心模块

---

## 一、问题诊断总结

| 页面 | 问题指标 | 核心问题 |
|------|----------|----------|
| `/lp/google-ads-factory-direct.html` | 滚动深度 19%，停留 7s | 首屏是文字+视频，用户搜索产品进来却看不到产品 |
| `/products/screens` | 29 次死点击，83% 会话 | 产品/品牌/等级卡片是纯展示 `<div>`，不可交互 |
| `/` (首页) | 滚动深度 31.7% | Hero 下方是 "Who We Serve" 而非产品，缺乏吸引力 |
| `/wholesale-inquiry` | 93% 滚动但 4s 退出 | 10 个表单字段，首次询价门槛太高 |
| GA4 数据 | Campaign 参数全部为空 | 缺少 UTM 参数解析，无法评估广告效果 |

**行为分析核心结论**: 用户搜索 "wholesale phone parts" 进来，期待看到**产品图片+价格信息**，但每个页面都更像"公司介绍"而非"产品目录"。死点击说明用户在积极寻找可交互元素但找不到入口。

---

## 二、优化项详细说明

### 优化项 1 [P0]: UTM 跟踪修复

**修改文件**: `src/lib/analytics.ts`

**修改内容**:
- 新增 `UTM_KEYS` 常量定义 5 个标准 UTM 参数名
- 新增 `captureUtmParams()` 函数: 从 URL 提取 UTM 参数，存入 `sessionStorage`（key: `prspares_utm`），支持跨页面保持
- 新增 `getUtmParams()` 导出函数: 供外部组件获取当前 UTM 参数
- 修改 `trackEvent()` 函数: 自动在所有 GA4 事件中附带 UTM 参数
- 页面加载时自动调用 `captureUtmParams()` 初始化

**数据流**: URL 参数 → `captureUtmParams()` → `sessionStorage` → `trackEvent()` → GTM dataLayer → GA4

**验证方式**: 
- 访问 `?utm_source=google&utm_campaign=test` 后在浏览器控制台查看 `sessionStorage.getItem('prspares_utm')`
- 触发任意事件后检查 dataLayer 是否包含 utm 字段

---

### 优化项 2 [P0]: 广告落地页首屏重构

**修改文件**: `public/lp/google-ads-factory-direct.html`

**修改前**: 
- Hero 区域: 左侧大段文字描述 + 右侧仓库视频
- 单一 CTA: "Request Wholesale Quote"
- 无产品图片或价格信息
- 无 UTM 跟踪

**修改后**:
- Hero 改为居中布局: Badge + 大标题 "Save 30-40% vs Regional Distributors"
- 3 张产品卡片 (Screens / Batteries / Parts): 真实产品图 + 分类名 + 点击跳转到询价表单
- 双 CTA: "Request Wholesale Quote" + "WhatsApp Us"
- Trust badges 内联显示 (MOQ 10pcs / 24h Response / 12mo Warranty / Same-Day Dispatch)
- 移动端: Sticky 底部双按钮 (Get Quote + WhatsApp)
- 新增 `LP_UTM` 变量: 解析 URL UTM 参数，表单提交和 GA4 事件自动携带

**布局变化**:
```
修改前:                          修改后:
┌──────────┬─────────┐          ┌─────────────────────┐
│ 大段文字  │  视频   │          │  Badge + 大标题      │
│ 公司介绍  │ (仓库)  │          │                     │
│          │         │          │ [Screen] [Battery] [Parts]
│ [CTA]    │         │          │  产品图   产品图    产品图
└──────────┴─────────┘          │                     │
                                │ [Get Quote] [WhatsApp]│
                                │ ✓MOQ ✓24h ✓Warranty  │
                                └─────────────────────┘
```

---

### 优化项 3 [P1]: 产品页添加交互元素 (3 个页面)

**修改文件**:
- `src/app/products/screens/page.tsx`
- `src/app/products/batteries/page.tsx`
- `src/app/products/small-parts/page.tsx`

**统一修改模式** (三个页面一致):

| 区域 | 修改前 | 修改后 |
|------|--------|--------|
| 产品类型卡片 | 纯展示 `<div>` | `<Link>` → `/wholesale-inquiry?product=XXX`，hover 动画 + "Get Quote" CTA |
| 品牌卡片 | 纯文本展示 | `<Link>` → `/wholesale-inquiry?product={品牌}+XXX`，hover 时出现 ArrowRight |
| 质量等级卡片 | 无交互 | `<Link>` → `/wholesale-inquiry?product={等级}+XXX`，"Request {等级} Pricing" CTA |
| 浮动按钮 | 无 | 新增 fixed bottom-right "Get Quote" 按钮，始终可见 |

**hover 效果**: `group` class + `hover:shadow-lg hover:-translate-y-1 transition-all`

**URL 参数预填**: 点击后跳转到询价页，自动选中对应产品类别

---

### 优化项 4 [P2]: 首页优化滚动深度

**修改文件**: `src/app/page.tsx`

**修改内容**:
1. **Product Categories 上移**: 从原来的第 3 位移到紧接 Hero 的第 2 位（用户进来立刻看到产品）
2. **新增 Social Proof 数据条**: 插入在 Product Categories 和 Who We Serve 之间
   - 10+ Years in Business
   - 1,000+ B2B Clients Served
   - 50+ Countries Shipped
   - <1% RMA Rate
   - 使用 FadeIn 动画 + 橙色数字强调
3. **Who We Serve 下移**: 从第 2 位移到第 4 位

**页面结构变化**:
```
修改前:                    修改后:
1. Hero                   1. Hero
2. Who We Serve           2. Product Categories ← 上移
3. Product Categories     3. Social Proof Stats ← 新增
4. Why PRSPARES           4. Who We Serve ← 下移
5. ...                    5. Why PRSPARES
                          6. ...
```

---

### 优化项 5 [P2]: 询价表单简化

**修改文件**: `src/app/wholesale-inquiry/page.tsx`

**修改前**:
- 10 个表单字段平铺展示
- 4 个必填: Company*, Name*, Email*, Products*
- 无 WhatsApp 替代选项
- 不支持 URL 参数预填

**修改后**:

**A. 必填字段精简为 3 个**:
| 字段 | 类型 | 说明 |
|------|------|------|
| Email * | input[email] | 联系邮箱 |
| Products * | select | 产品类别选择 |
| Quantity * | select | 数量范围选择 (新增为必填) |

**B. 可选字段折叠**:
- 新增 "More Details (Optional) — helps us prepare a better quote" 可折叠区域
- 点击展开后显示: Company, Name, Phone, Country, Model/Brand, Quality, Message
- 默认收起，减少首屏视觉压力

**C. WhatsApp 替代 CTA**:
- 提交按钮下方添加分隔线 "or"
- 绿色 WhatsApp 按钮: "Chat on WhatsApp — Get Instant Reply"
- 为不愿填表单的用户提供即时沟通渠道

**D. URL 参数预填**:
- 新增 `useSearchParams()` hook
- 支持 `?product=Screens` / `?product=Batteries` / `?product=Small+Parts` 等参数
- 从产品页跳转时自动选中对应类别

**E. 验证逻辑更新**:
- `validate()` 函数: 移除 company/name 必填检查，新增 quantity 必填检查
- 新增 `Plus` / `Minus` 图标用于折叠指示

---

## 三、修改文件清单

| 文件路径 | 操作类型 | 变更行数 (约) |
|----------|----------|---------------|
| `src/lib/analytics.ts` | 修改 | +60 行 (UTM 模块) |
| `public/lp/google-ads-factory-direct.html` | 修改 | ~100 行重写 Hero 区域 |
| `src/app/products/screens/page.tsx` | 修改 | ~40 行 (卡片→Link + 浮动按钮) |
| `src/app/products/batteries/page.tsx` | 修改 | ~40 行 (同上) |
| `src/app/products/small-parts/page.tsx` | 修改 | ~40 行 (同上) |
| `src/app/page.tsx` | 修改 | ~30 行 (顺序调整 + Stats) |
| `src/app/wholesale-inquiry/page.tsx` | 修改 | ~80 行 (表单重构) |

**未修改的关键文件**: `package.json`, `next.config.js`, API routes, 数据库 schema — 本次均为前端 UI/UX 层修改，无后端变更。

---

## 四、预期效果

| 指标 | 优化前 | 预期目标 | 测量方式 |
|------|--------|----------|----------|
| 落地页滚动深度 | 19% | 50%+ | Clarity 滚动热力图 |
| 落地页停留时间 | 7s | 20s+ | Clarity 会话指标 |
| Screens 页死点击 | 29 次/会话 | <5 次 | Clarity 点击热力图 |
| 首页滚动深度 | 31.7% | 50%+ | Clarity 滚动热力图 |
| 询价表单完成率 | 低 (4s 退出) | 提升 2-3x | GA4 generate_lead 事件 |
| UTM 参数捕获率 | 0% | 100% (广告流量) | GA4 Campaign 报告 |

---

## 五、部署后验证清单

1. [ ] 首页: Social Proof 数据条显示，产品分类在 Hero 下方
2. [ ] 广告落地页: 3 张产品卡片 + 双 CTA，移动端 sticky 按钮
3. [ ] Screens/Batteries/Small Parts 页: 卡片可点击，浮动按钮可见
4. [ ] 询价表单: 仅 3 个必填字段，可选区折叠，WhatsApp 按钮
5. [ ] 从产品页点击 "Get Quote" → 询价页自动选中产品类别
6. [ ] 带 UTM 参数访问后，GA4 事件包含 utm_source 等字段
7. [ ] 移动端响应式正常（Chrome DevTools 模拟 iPhone/Android）
