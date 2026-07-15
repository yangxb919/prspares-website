# Claim Ledger — 站上数字声明清册（Phase 0.5）

> 建立：2026-07-15。原则：zero-fake——每个对外数字要么有数据出处，要么标红待核/删除。
> 数据基准：`产品excel/agent_price_index.csv`（2026-05-26 快照，23,374 行）实测；全站扫描 via 子代理 2026-07-15。
> 状态：✅有据 ｜ 🟢已修复 ｜ 🟡待核实（需内部数据）｜ 🔴口径冲突/无依据（优先处理）

## 🔴 口径冲突（同一事实多套数字，立即可修或需重算）

| # | 声明 | 位置 | 实测/冲突 | 处置 |
|---|---|---|---|---|
| R1 | SKU 总数三套口径：`23,374` / `23,000+` / `27,000+` | products/page.tsx:235(h1 写 27,000+)、FeaturedWholesaleTable:62(23,000+)、products meta+data 文件(23,374) | CSV 实测 **23,374** ✅ | 🟢 h1 已改 23,374（2026-07-15）；23,000+ 作模糊口径可保留 |
| R2 | 小件 SKU：主页 `15,000+ part lines` vs 数据文件 `14,000+` | src/app/page.tsx:132 | 数据文件口径 14,000+ | 🟢 已改 14,000+（2026-07-15） |
| R3 | 屏类 SKU：`5,263 screen SKUs` / `4,493 assemblies + 770 with-frame` | product-category-pages.ts:42-48、product-taxonomy.ts、主页 4,400+/4.4k+ | CSV 实测：Screen Assembly **2,700** + with Frame **1,413** = **4,113**，页面高报 ~28% | 🔴 待重算：建 stats 生成器从 CSV 算类目数，替换手填常量（follow-up） |
| R4 | 类目数 `49 part categories` | product-catalog-summary.ts:4 | CSV 实测 **43** 类 | 🔴 同 R3 一并生成器化 |
| R5 | 国家数：主页/about `50+ countries` vs products 页 `30+ countries`（代码内 TODO 自认未核实） | page.tsx:490、about:143、products/page.tsx:566 | 无 CRM 出处 | 🟡 需用户给真实出货国家数（Zoho/物流单口径），统一一个数 |
| R6 | `<1% RMA`：主页/warranty 写 "target"，id/th 落地页写成既成事实 "RMA Rate < 1%" | id/wholesale/page.tsx:62 等 5 处、th/wholesale:111 | 无 RMA 统计出处 | 🟢 id/th 已改回 target 口径（2026-07-15）；真实 RMA 率待内部统计 |
| R7 | 机型数 `2,646 phone models` | product-catalog-summary.ts:3 | CSV model 列去重仅 192（口径不同：应为 compatible 列拆分数，未验证） | 🟡 重算口径后归入 R3 生成器 |

## 🔴 无依据的产品性能承诺（需采购/QC 给依据，否则降级措辞）

| # | 声明 | 位置 | 问题 | 处置 |
|---|---|---|---|---|
| P1 | iPad 电池 "**95%+ capacity guaranteed**" | ipad-battery.../page.tsx:181 | 纯硬编码承诺，无 QC 数据出处；"guaranteed" 字眼有售后风险 | 🟡 需采购确认电芯规格书；建议改 "capacity tested against spec before shipping" |
| P2 | "retain **80%+ capacity for 1,000 charge cycles**"（iPad）；"**800-1,000 cycles**"（batteries FAQ） | ipad page:37、batteries/layout.tsx:97 | 电芯厂规格书未见；两页数字还不一致 | 🟡 向电芯厂要 cycle 测试报告，统一口径 |
| P3 | 小件页 "Laser removal **95%+ success rate**" | small-parts/layout.tsx:67 | 无出处 | 🟡 无法佐证就删百分比 |
| P4 | "**7-step incoming QC**" | products/page.tsx:571 | QC 流程步数未见内部文档 | 🟡 让 QC 把 7 步写成文档（也是好内容素材），或改 "multi-step" |
| P5 | 市场价锚点：Apple charges $99-149 / shops $79-119（iPad）；工具价 $45/$55/$120/$95/$150（repair-tools FAQ） | ipad layout:66+page:112、repair-tools/layout.tsx | 第三方价格快照无日期 | 🟡 补 as-of 日期；工具价对主表核对 |

## 🟢 今日已修复（2026-07-15 schema 审计 Phase 0.8）

| 声明 | 位置 | 修复 |
|---|---|---|
| 两个编造 AggregateOffer：iPhone $19-339/50 offers、Samsung $35-290/20 offers | screens/layout.tsx（已删） | 全页只留 WholesaleScreenTable 从真实 catalog 计算的一份 Product schema（$8.23-304.37/188 offers） |
| FAQ 过期价 "16PM $39-259 / 14PM $29-179 / 13 $19-89" | screens/layout.tsx:124 | 改真实价：16PM $30-242 / 14PM $15-130 / 13 $11-57，标注 July 2026 |
| "Volume discounts of **8-15%** for 50+ units" | 同上 | 实测阶梯折扣 1.5-4.1%（中位 3%）→ 改 "2-4%" |
| "genuine factory display / perfect color accuracy" + "**120Hz support**"（soft OLED 不支持 ProMotion） | screens/layout.tsx:92 | 改词典四档诚实口径，删 120Hz |
| "OEM Original screens are genuine parts pulled from new devices" | screens/layout.tsx:116 | 改 glass-change 翻新口径 |

## ✅ 有据（保留，注明出处）

| 声明 | 出处 |
|---|---|
| `23,374` SKUs | agent_price_index.csv 行数精确一致（2026-05-26 快照）；⚠️ "Updated May 2026" 时效字样需随 CSV 刷新（0.4 关联） |
| `1,500` battery SKUs | CSV Battery 类精确一致 |
| iPad 电池 `$5.02-19.84`、16 SKUs | 真实价表（07-04 上线时已验证） |
| 屏幕表 188 SKUs、$8.23-304.37、10/50/200 阶梯 | iphone-screen-catalog.ts（生成器+断言套件） |
| `12-month warranty`、MOQ 10 units、DHL/FedEx worldwide | 对客标准口径（2026-06-12 拍板） |
| Soft OLED "90-95% of original quality" | 行业通用口径，词典 SoT 收录（grade-taxonomy.ts） |
| `24h quote` | 业务承诺（用户可确认，暂视为有据） |

## 维护规则

1. 新增对外数字前先登记本清册，标注出处
2. R3/R4/R7 的治本 = 类目统计生成器（从 CSV 算，替换 product-category-pages/product-taxonomy/product-catalog-summary 三处手填常量）——列入 0B follow-up
3. CSV 刷新（0.4 价格有效期）时同步刷新 "Updated May 2026" 字样
