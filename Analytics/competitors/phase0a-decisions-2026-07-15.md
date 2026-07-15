# Phase 0A 决策记录 · 2026-07-15

> 上游：website-execution-plan-2026-07-12.md（0.1/0.6/0.7）+ phase0a-grade-taxonomy-proposal.md。本文记录已拍板决策与数据依据，后续改动引用本文，不再重新发明。

## ① 等级词典（0.1）——✅ 已拍板并上线（2026-07-15）

对外四档 **Original / Soft OLED / Hard OLED / Incell**，SoT = `src/data/grade-taxonomy.ts`。
细节与执行记录见 changelogs/2026-07-15.md（目录 193→188 行，commit 5179afd，已部署验证）。

## ② 产品数据 SoT（0.6）——✅ 已定：静态 catalog

**决策**：型号级产品数据以 **静态 catalog**（`src/data/iphone-screen-catalog.ts` 等生成文件）为唯一事实源；Supabase `products` 表逐步退役（Phase 2 执行，非立即动手）。

**理由**（2026-07-15 用户确认）：
- 价格的真实来源就是 Excel→CSV→生成器这条链（`产品excel/PRSPARES_*_Master_Full_*.xlsx` → `agent_price_index.csv` → `_gen_*_catalog.py`），生成器带断言套件，git 部署即生效
- Supabase products 表价格无人维护（PDP 曾长期挂 B2C 残留），双源必然口径漂移

**执行含义**：
- 新建产品页（等级中心、model×grade 试点）一律读静态 catalog + grade-taxonomy
- 动态 PDP（`/products/[slug]` 读 Supabase）**暂时保留不动**，Phase 2 的 2.3/2.4 重构时再决定合并/退役路径；期间不给它加新功能
- 价格更新流程 = 改 Excel → 跑生成器 → git commit → push 自动部署（勿手动碰 VPS）

## ③ PDP URL / canonical / sitemap 方案（0.7）——📋 提案待批

**硬约束**（Codex 审查实锤）：`/products/[model]-[grade]` 是非法 Next 段+与 `/products/[slug]` 同层冲突，**永不再提**。

**提案**：嵌套在分类静态段之下——
- URL：`/products/screens/[skuSlug]`，如 `/products/screens/iphone-15-pro-max-soft-oled`（合法：静态段 `screens` 优先级高于同层 `[slug]`，无冲突）
- slug 生成：`{model}-{gradeKey}`（来自 grade-taxonomy 的 key），同一 model+grade 多 SKU 时聚合为一页（页内列 SKU 行）
- canonical：自引用；等级中心 `/products/screens-grade-guide` 链向各页
- sitemap：只纳入 Phase 2 试点的 3-5 页，验证收录后再扩量
- schema：单页 Product + Offer（明文价），**不用 AggregateOffer 聚合 variants**（Google 不推荐，也是现存 3 schema 冲突的根源）

## ④ 月采购额下拉档位（1.5 输入）——📊 真实分布已推，档位提案待批

**数据**（Supabase contact_submissions，2026-04-16 ~ 07-15，去重去测试后 64 个独立询盘人，其中 39 人经批发表单选了数量档）：

| 表单数量档 | 人数 | 占比 |
|---|---|---|
| 10-50 units | 22 | **56%** |
| 50-100 units | 7 | 18% |
| 100-500 units | 7 | 18% |
| 1000+ units | 3 | 8%（且三条均为 Mixed Grades 泛询，质量存疑） |

等级偏好（可多选）：OEM Original 13 / Mixed Grades 11 / Premium Aftermarket 7 / Standard Aftermarket 7。

**结论**：客群主力是 10-50 片的小修理店/初创分销（56%），REWA 的 $1k 起跳档位会把主力客群挤到最低档失去区分度。按数量档 × 四档真实单价（Incell 中位 $18 / Soft OLED $50-120 / Original $100-300）折算，**提议月采购额 5 档**（选填，绝不 required）：

| 档位 | 对应画像 |
|---|---|
| Under $1,000 | 试单/样品，10-50 片 incell 为主 |
| $1,000 – $3,000 | 小修理店月常规补货 |
| $3,000 – $10,000 | 多店/小分销（50-500 片混合） |
| $10,000 – $30,000 | 区域分销商 |
| $30,000+ | 大分销/整柜 |

**备选意见**：现有 Qty 数量档字段填答率已 100%（批发表单内），金额档与其信息重叠度高；若担心表单摩擦，可推迟 1.5、只做 1.4（discovery_source AI 归因）。两者都需 Supabase migration，届时单独确认。

## 遗留待批清单

- [ ] ③ PDP URL 方案（上表提案）
- [ ] ④ 月采购额 5 档 vs 推迟 1.5（含 1.4/1.5 的 Supabase migration 单独确认）
- [ ] deploy.yml 已加固上线（07-15，stop pm2+720M+回滚），无遗留
