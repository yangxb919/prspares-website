// Canonical screen grade taxonomy — 对外四档词典（2026-07-15 拍板）。
// 所有等级展示（表格 badge / 标题句式 / 等级中心 / PDP）必须引用本文件，不得另建映射。
// 生成器侧白名单在 产品excel/_gen_iphone_screen_catalog.py 的 GRADES，需与 label 保持一致。
//
// 拍板记录（Analytics/competitors/phase0a-grade-taxonomy-proposal.md）：
// ① Original 标题只写 "Original"，翻新事实在正文/tooltip 解释（zero-fake，不写 "genuine factory"）
// ② 供应商标 "OLED"（RJ/YK 尾缀）的模糊档全部归 Soft OLED
// ④ TFT / in-cell / 剩余 LCD 总成归 Incell；"OEM LCD" 不明货已剔除
// ⑤ Incell 不拆高配/标配 —— 无独立质检口径支撑前不硬拆，品牌信息保留在行内 title

export type GradeKey = 'original' | 'soft-oled' | 'hard-oled' | 'incell';

export interface GradeDef {
  key: GradeKey;
  /** 对外唯一用词，与 catalog 数据的 grade 字段字面一致 */
  label: 'Original' | 'Soft OLED' | 'Hard OLED' | 'Incell';
  /** 定义式一句话（citability："X is a ..."），等级中心/FAQ 复用 */
  definition: string;
  /** 表格 badge tooltip / 卡片短句 */
  note: string;
  /** 适用采购场景，B2B 文案复用 */
  bestFor: string;
}

export const GRADE_TAXONOMY: GradeDef[] = [
  {
    key: 'original',
    label: 'Original',
    definition:
      'Original grade is a refurbished original panel: the factory OLED cell is kept and fitted with new glass, so brightness, color and True Tone match the stock display.',
    note: 'Refurbished original panel with new glass — original display quality',
    bestFor: 'Quality-first repair shops, insurance and warranty jobs',
  },
  {
    key: 'soft-oled',
    label: 'Soft OLED',
    definition:
      'Soft OLED is an aftermarket flexible OLED panel, the closest aftermarket match to the original display at roughly 90-95% of its quality.',
    note: 'Flexible OLED, 90–95% of original quality',
    bestFor: 'Shops balancing premium feel with margin on popular models',
  },
  {
    key: 'hard-oled',
    label: 'Hard OLED',
    definition:
      'Hard OLED is an aftermarket rigid OLED panel: slightly thicker glass than Soft OLED, durable, and priced for value.',
    note: 'Rigid OLED, durable, strong value',
    bestFor: 'Volume repairs where durability and price matter most',
  },
  {
    key: 'incell',
    label: 'Incell',
    definition:
      'Incell is an aftermarket in-cell LCD assembly: the budget tier for OLED iPhones, with LCD brightness and contrast at the lowest unit cost.',
    note: 'In-cell LCD assembly — budget option',
    bestFor: 'Price-sensitive markets, trade-in refurbishing, older models',
  },
];

export const GRADE_LABELS = GRADE_TAXONOMY.map((g) => g.label);

/** label → 定义/短句速查，供表格等按 grade 字段直接取用 */
export const GRADE_BY_LABEL: Record<string, GradeDef> = Object.fromEntries(
  GRADE_TAXONOMY.map((g) => [g.label, g])
);
