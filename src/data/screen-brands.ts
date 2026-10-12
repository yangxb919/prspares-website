// Panel brand dictionary — W3-4 品牌页试点（2026-07-15 拍板：先建 GX/JK 两页，
// DD/RJ 词量/库存不足缓做）。所有库存数/价格由页面从 catalog 实算，本文件只放
// 静态定位文案；brand label 与 iphone-screen-catalog.ts 的 brand 字段字面一致。
// 合规口径：GX/JK 是第三方面板品牌，PRSPARES 为独立批发商，页面必须带独立声明。

export interface ScreenBrandDef {
  /** URL segment: /products/screens/{key} */
  key: string;
  /** Matches ScreenSku.brand exactly */
  label: string;
  /** Page H1 */
  h1: string;
  /** Citability definition sentence ("X is ..."), reused in hero + FAQ */
  definition: string;
  /** Qualitative positioning paragraph (facts derivable from catalog stay computed on-page) */
  positioning: string;
  /** Short buying guidance line */
  bestFor: string;
  /** FAQ question wording for the grade-mix question (matches how buyers search) */
  gradeFaqQ: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const SCREEN_BRANDS: ScreenBrandDef[] = [
  {
    key: 'gx',
    label: 'GX',
    h1: 'GX iPhone Screens — Wholesale OLED Price List',
    definition:
      'GX is a third-party aftermarket panel brand that makes both soft (flexible) and hard (rigid) OLED iPhone replacement screens. A GX screen listed simply as "GX OLED" is the soft version; hard GX assemblies are always labeled hard.',
    positioning:
      'GX is an OLED line rather than an incell one: shops use it to offer an OLED repair below Original-grade prices. Grades are labeled per SKU from the supplier listing — check the grade column, because the same brand name covers both hard and soft OLED assemblies.',
    bestFor:
      'OLED repairs where the shop wants a recognized aftermarket panel name below Original-grade pricing.',
    gradeFaqQ: 'Is GX a soft OLED or a hard OLED screen?',
    metaTitle: 'GX iPhone Screens Wholesale — OLED Price List & SKUs | PRSPARES',
    metaDescription:
      'GX iPhone screen wholesale: GX hard and soft OLED assemblies with live 10/50/200 tier pricing and a 12-month warranty. No single-model MOQ — mix GX with any models and categories to reach the 10-piece order minimum.',
    keywords:
      'gx screen, gx iphone screen, gx hard oled, gx oled screen, gx display wholesale, gx screen supplier',
  },
  {
    key: 'jk',
    label: 'JK',
    h1: 'JK iPhone Screens — Wholesale Incell & OLED Price List',
    definition:
      'JK is a third-party aftermarket panel brand that makes incell LCD, soft OLED and hard OLED iPhone replacement screens, known for value-priced incell assemblies alongside its OLED lines.',
    positioning:
      'JK covers every aftermarket price point: soft and hard OLED for customer-facing repairs and incell for budget quotes. That range makes JK a common single-brand answer for shops that want one panel maker across their whole repair menu, and JK incell is one of the most-searched budget screen options in the trade.',
    bestFor:
      'Shops running a two-tier repair menu (premium OLED + budget incell) that prefer one consistent panel brand.',
    gradeFaqQ: 'Is JK an incell or an OLED screen?',
    metaTitle: 'JK iPhone Screens Wholesale — Incell & OLED Price List | PRSPARES',
    metaDescription:
      'JK iPhone screen wholesale: JK incell, soft OLED and hard OLED assemblies with live 10/50/200 tier pricing and a 12-month warranty. No single-model MOQ — mix JK models, grades and categories to reach the 10-piece order minimum.',
    keywords:
      'jk screen, jk incell, jk iphone screen, jk oled, jk display wholesale, jk incell screen supplier',
  },
];

export const SCREEN_BRAND_BY_KEY: Record<string, ScreenBrandDef> = Object.fromEntries(
  SCREEN_BRANDS.map((b) => [b.key, b])
);
