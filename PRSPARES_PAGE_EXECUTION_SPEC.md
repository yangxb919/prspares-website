# PRSPARES 页面改版清单 + 保留/合并/新增页面表

**用途：** 给 Claude Code 作为直接执行的施工文档  
**原则：** 不做零散微调，以整站重构思路推进  
**优先级基准：** P0 > P1 > P2 > P3

---

# 一、执行总原则

Claude Code 在修改本项目时，必须遵守以下原则：

1. 不要只做局部文案优化，要围绕整站结构统一改造。
2. 先修复结构性问题，再优化视觉与文案。
3. 所有页面改版都必须围绕统一主线：
   - SEO 流量获取
   - 商业能力展示
   - 信任建立
   - Quote / Inquiry 转化
4. 全站 CTA 统一收敛为：
   - Primary: `Get Wholesale Quote`
   - Secondary: `Browse Products`
   - Support: `WhatsApp Sales` / `Contact Sales`
5. 如果页面存在旧结构但与新规划冲突，优先服从新规划。

---

# 二、P0：必须先处理的事项

## P0-1 修复 `/wholesale-inquiry` 线上可访问性
**状态：** 本地存在，线上 404  
**动作：** 必须优先排查并修复  
**目标：** 让该页面成为真实可访问页面，并作为全站核心转化页

### Claude Code 执行要求
- 检查路由文件是否正确参与 build
- 检查 App Router 结构是否存在冲突
- 检查部署环境是否遗漏该页面
- 检查是否存在 redirect / rewrite / middleware 干扰
- 修复后保证线上可访问，并能正常渲染

---

## P0-2 统一主域名与 canonical 策略
**目标：** 统一使用单一主域名，避免权重分散

### Claude Code 执行要求
- 确认 `metadataBase`、canonical、openGraph URL 统一
- 确认 `phonerepairspares.com` 与 `www.phonerepairspares.com` 只保留一个主版本
- 检查首页、产品页、博客页、分类页、专题页 canonical 是否一致规范

---

## P0-3 清理明显占位与错误信号
**目标：** 提升专业感与信任感

### 需处理项
- 修复 favicon 路径中的空格问题
- 替换无效/占位社媒链接
- 清理 footer 中无意义或未准备好的入口
- 检查 404 页面是否带来错误品牌信号
- 检查无效链接或死链

---

# 三、P1：核心商业骨架页面改造

## P1-1 首页 `/`
**页面角色：** 品牌首页 + 商业入口页  
**目标关键词：**
- mobile phone parts wholesale
- phone repair parts supplier
- OEM mobile phone parts supplier

### 必须保留
- Hero
- 品类入口
- 信任证明
- CTA

### 必须新增/强化
1. 明确一句话定位
2. 明确目标客户（repair shops / wholesalers / distributors）
3. Why PRSPARES 模块统一化
4. How Ordering Works 模块
5. 最终 CTA 统一为 Get Wholesale Quote

### 必须弱化
- 过多堆叠卖点
- 过多重复数据卡片
- 与成交无关的内容分支

### 推荐结构
1. Hero
2. Who We Serve
3. Product Categories
4. Why PRSPARES
5. How Ordering Works
6. Trust Proof
7. Final CTA

---

## P1-2 产品总页 `/products`
**页面角色：** broad commercial landing page  
**目标关键词：**
- mobile repair parts
- phone parts supplier
- wholesale phone repair parts

### 当前问题
- 更像分类导航页
- 不够像商业 landing page

### 改版要求
必须重构为具备以下模块的强商业页：
1. Hero（B2B 采购导向）
2. Categories overview
3. Supported brands/models
4. Quality & sourcing capability
5. Who we serve
6. MOQ / shipping / warranty
7. FAQ
8. Get Wholesale Quote CTA

---

## P1-3 分类页：
- `/products/screens`
- `/products/batteries`
- `/products/small-parts`
- `/products/repair-tools`

**页面角色：** category-level landing pages

### 每个分类页必须统一结构
1. Hero
2. What we supply
3. Compatible brands/models
4. Quality grades / available options
5. Buyer types
6. MOQ / shipping / warranty
7. FAQ
8. Related guides
9. CTA

### Claude Code 要求
- 尽量组件化复用结构
- 保留各品类差异化内容
- 不做纯模板堆字，要体现不同品类采购关注点

---

## P1-4 核心询盘页 `/wholesale-inquiry`
**页面角色：** 全站统一转化页  
**重要性：** 极高

### 改版要求
页面结构必须围绕“促成询盘”而非单纯展示设计。

### 必备模块
1. Strong headline
2. Why choose us
3. Product categories snapshot
4. MOQ / payment / shipping / warranty
5. Inquiry form
6. FAQ
7. Direct contact options
8. 24h response promise

### 表单要求
建议字段：
- Company name
- Contact name
- Email
- Country
- Product category
- Model / brand
- Quantity
- Quality requirement
- Message

---

# 四、P2：内容与 SEO 结构调整

## P2-1 统一内容主路径
**建议主内容路径：** `/blog`

### Claude Code 执行方向
- 保持 `/blog` 为主内容体系
- 对 `/news`、`/industry-insights` 做结构评估
- 若功能重复，逐步弱化或准备迁移方案
- 避免后续继续增加并行内容线

---

## P2-2 Blog 列表页 `/blog`
**角色：** 内容入口页 + cluster hub

### 目标
- 不只是文章列表
- 要体现主题集群与商业承接

### 改版要求
建议强化：
1. Blog positioning copy
2. Cluster navigation
3. Featured commercial guides
4. Category clarity
5. CTA back to product/inquiry pages

---

## P2-3 博客文章页 `/blog/[slug]`
**角色：** SEO 流量承接页

### 改版要求
每篇文章都必须具备：
- 中段 CTA
- 文末 CTA
- 相关产品页链接
- 相关询盘页链接
- 相关文章内链

### 统一要求
文章页不能只追求阅读体验，还要承担商业引导功能。

---

## P2-4 内容集群优先级
优先围绕以下 4 个 cluster 建设：

### Cluster A：Screens
- OLED vs LCD
- OEM vs aftermarket screens
- iPhone screen quality guide
- how to test bad screens

### Cluster B：Batteries
- iPhone battery wholesale guide
- battery quality check
- safe battery sourcing
- battery supplier guide

### Cluster C：Supplier / Sourcing
- how to choose a phone parts supplier
- import phone parts from China
- supplier checklist
- factory direct vs trader

### Cluster D：Repair shop decision content
- which grade to buy
- profitable repairs
- model-specific cost/quality guides

---

# 五、P2：专题商业页执行规范

## 已有专题页
- `/products/iphone-rear-camera-wholesale`
- `/products/ipad-battery-replacement-factory`

### 改造目标
从“薄专题页”升级为“高商业意图落地页”。

### 必备结构
1. Hero
2. Coverage / product scope
3. Why buy from PRSPARES
4. Quality/testing/compatibility
5. MOQ / lead time / shipping
6. FAQ
7. Related guides
8. CTA

### Claude Code 要求
- 提升内容完整度
- 增强 buyer-oriented 信息
- 减少空泛表述
- 强化与分类页、询盘页的关系

---

# 六、P3：辅助页面处理策略

## About `/about`
**保留，但重写定位**

### 作用
- 补信任，不是纯品牌故事
- 突出深圳/华强北/供应链/团队/质检/服务能力

---

## Contact `/contact`
**保留，但与 inquiry 区分职责**

### 作用
- 给出直接联系信息
- 作为补充联系页
- 引导回 inquiry 主转化路径

---

## Privacy Policy `/privacy-policy`
**保留**
- 不作为优化重点
- 保持合规

---

# 七、建议弱化 / 合并 / 清理项

## 7.1 建议弱化
### `/news`
如果没有长期稳定内容规划，建议弱化存在感，不作为主内容入口。

### `/industry-insights`
如无独立内容策略，建议并入 blog 体系。

---

## 7.2 建议清理或检查
- 无效测试页
- demo 页面
- 不再服务主站目标的临时页
- 没有明确 SEO / 转化价值的边缘路径

Claude Code 应检查：
- 是否有未纳入 sitemap 但仍可访问的低价值页面
- 是否有应 noindex 的页面
- 是否有旧页面影响主站权重集中

---

# 八、全站组件级统一要求

## 8.1 CTA 文案统一
默认统一为：
- Get Wholesale Quote
- Browse Products
- WhatsApp Sales / Contact Sales

避免在全站混用过多 CTA 说法。

---

## 8.2 Trust modules 统一
建议抽象为可复用模块：
- MOQ
- Warranty
- Low RMA
- Quality control
- Fast shipping
- Shenzhen advantage
- Buyer type support

---

## 8.3 FAQ modules 统一
分类页、专题页、询盘页都应支持 FAQ 模块，并考虑结构化数据支持。

---

## 8.4 Internal link modules 统一
建议建立统一的：
- Related guides
- Related categories
- Inquiry CTA strip

---

# 九、技术执行清单

Claude Code 在修改时应同步检查以下技术事项：

1. `metadata` 是否统一规范
2. canonical 是否正确
3. OG / Twitter card 是否一致
4. sitemap 是否只包含有效页面
5. robots 策略是否合理
6. redirect 是否避免链式跳转
7. 404 页面是否正确
8. 社媒、邮箱、电话、地址是否一致
9. footer/header 是否反映新的信息架构
10. 页面是否存在明显重复内容风险

---

# 十、推荐执行顺序（Claude Code 必须遵守）

## Step 1
先处理 P0：
- 修复 `/wholesale-inquiry`
- 统一 canonical / 主域名
- 清理明显占位问题

## Step 2
处理 P1：
- 首页
- `/products`
- 四个分类页
- `/wholesale-inquiry`

## Step 3
处理 P2：
- `/blog`
- `/blog/[slug]`
- 内容集群结构与内链
- 专题商业页增强

## Step 4
处理 P3：
- About
- Contact
- 其它辅助页面

## Step 5
最后统一检查：
- sitemap
- robots
- metadata
- CTA 一致性
- header/footer

---

# 十一、Claude Code 最终交付要求

Claude Code 执行完成后，至少应交付：

1. 已修改页面清单
2. 每个页面改动摘要
3. 是否修复了 `/wholesale-inquiry` 线上问题
4. 是否统一了 CTA / metadata / canonical
5. 是否清理了低价值结构
6. 哪些项目因数据/素材不足暂未完成

---

# 十二、最终目标
本文件的目的不是让 Claude Code 做局部修补，而是让它完成：

> **把 PRSPARES 重构为一个围绕 B2B SEO 获客与询盘转化运行的整站系统。**
