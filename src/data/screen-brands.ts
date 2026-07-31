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
    h1: 'GX iPhone Screens — Wholesale Soft OLED Price List',
    definition:
      'GX is a third-party aftermarket panel brand best known for soft OLED iPhone replacement screens, and one of the most-requested aftermarket OLED names among repair shops and distributors.',
    positioning:
      'GX sits in the premium aftermarket band: shops that quote "like-original" OLED repairs without paying Original-grade prices typically stock GX soft OLED. Nearly the whole GX line is flexible (soft) OLED, so color, contrast and touch feel stay close to the stock display.',
    bestFor:
      'Customer-facing OLED repairs where the shop wants a recognized aftermarket panel name at soft OLED pricing.',
    gradeFaqQ: 'Is GX a soft OLED or a hard OLED screen?',
    metaTitle: 'GX iPhone Screens Wholesale — Soft OLED Price List & SKUs | PRSPARES',
    metaDescription:
      'GX iPhone screen wholesale: GX soft OLED assemblies (plus hard OLED and incell SKUs) with live 10/50/200 tier pricing, factory-direct QC and a 12-month warranty. No single-model MOQ — mix GX with any models and categories to reach the 10-piece order minimum.',
    keywords:
      'gx screen, gx iphone screen, gx soft oled, gx oled screen, gx display wholesale, gx screen supplier',
  },
  {
    key: 'jk',
    label: 'JK',
    h1: 'JK iPhone Screens — Wholesale Incell & Soft OLED Price List',
    definition:
      'JK is a third-party aftermarket panel brand that makes both incell LCD and soft OLED iPhone replacement screens, known for value-priced incell assemblies alongside its OLED line.',
    positioning:
      'JK runs two lines: soft OLED for customer-facing repairs and incell for budget quotes. That two-tier range makes JK a common single-brand answer for shops that want one panel maker across both price points, and JK incell is one of the most-searched budget screen options in the trade.',
    bestFor:
      'Shops running a two-tier repair menu (premium OLED + budget incell) that prefer one consistent panel brand.',
    gradeFaqQ: 'Is JK an incell or an OLED screen?',
    metaTitle: 'JK iPhone Screens Wholesale — Incell & Soft OLED Price List | PRSPARES',
    metaDescription:
      'JK iPhone screen wholesale: JK incell and JK soft OLED assemblies with live 10/50/200 tier pricing, factory-direct QC and a 12-month warranty. No single-model MOQ — mix JK models, grades and categories to reach the 10-piece order minimum.',
    keywords:
      'jk screen, jk incell, jk iphone screen, jk oled, jk display wholesale, jk incell screen supplier',
  },
];

export const SCREEN_BRAND_BY_KEY: Record<string, ScreenBrandDef> = Object.fromEntries(
  SCREEN_BRANDS.map((b) => [b.key, b])
);
