// Model-level screen pages (category → model → grade sections), pilot batch
// 2026-10-12: iPhone 13 / 15 Pro / 17 Pro Max. Prices, grades and stock come
// from the live catalog (screen-catalog.ts); this file only holds the per-model
// facts that the catalog cannot compute. Every fact carries the source it was
// checked against — no unsourced claims (see Analytics/claim-ledger.md).
//
// Expand only after the pilot pages are confirmed indexed (plan: 28-day review).

export interface ModelFact {
  label: string;
  value: string;
  sourceUrl: string;
}

export interface ScreenModelPage {
  /** URL segment under /products/screens — always prefixed (iphone-…) so it can
   *  never collide with the short panel-brand slugs (gx, jk). */
  slug: string;
  /** Literal `model` value in the screen catalog. */
  model: string;
  metaTitle: string;
  metaDescription: string;
  /** Original display + compatibility facts, each with its source. */
  facts: ModelFact[];
  /** What a shop sees after fitting a non-Apple screen on this model. */
  afterInstall: ModelFact[];
  /** Plain buying advice per grade label, written for this model. */
  gradeAdvice: Partial<Record<'Original' | 'Soft OLED' | 'Hard OLED' | 'Incell', string>>;
  /** Other model pages worth linking from this one. */
  related: string[];
}

export const SCREEN_MODEL_PAGES: ScreenModelPage[] = [
  {
    slug: 'iphone-13',
    model: 'iPhone 13',
    metaTitle: 'iPhone 13 Screen Wholesale: OLED, Incell & Original Prices',
    metaDescription:
      'Wholesale iPhone 13 screen assemblies by grade (Original, Soft OLED, Hard OLED, Incell) with 10+/50+/200+ prices and stock status. 10-pcs mixed order minimum.',
    facts: [
      {
        label: 'Original display',
        value:
          '6.1-inch Super Retina XDR OLED, 2532 × 1170 at 460 ppi. Apple lists no ProMotion or Always-On for this model, and it keeps the notch rather than Dynamic Island.',
        sourceUrl: 'https://support.apple.com/en-us/111872',
      },
      {
        label: 'Compatibility',
        value:
          'iPhone 13 and iPhone 13 Pro screens are not interchangeable — iFixit’s swap test found the display connectors incompatible. Stock the two models separately.',
        sourceUrl: 'https://www.ifixit.com/Answers/View/756514/iPhone+13+and+13+pro+the+same+screen',
      },
    ],
    afterInstall: [
      {
        label: 'Parts and Service History',
        value:
          'iOS lists a non-Apple display as an “Unknown Part” under Settings > General > About > Parts and Service History. Tell your customer before the repair.',
        sourceUrl: 'https://support.apple.com/en-us/102658',
      },
      {
        label: 'True Tone',
        value:
          'Apple notes that True Tone may not work correctly on a non-genuine display. Repair shops usually copy the original screen data with a programmer (JC, i2C or JCID) to restore it.',
        sourceUrl: 'https://support.apple.com/en-us/103256',
      },
      {
        label: 'Face ID',
        value:
          'Early iOS 15 disabled Face ID after an iPhone 13 screen swap; Apple removed that lock in iOS 15.2.',
        sourceUrl: 'https://www.ifixit.com/News/56386/ios-15-2-fixes-iphone-13s-face-id-repair-trap-and-improves-its-repair-score',
      },
    ],
    gradeAdvice: {},
    related: ['iphone-15-pro', 'iphone-17-pro-max'],
  },
  {
    slug: 'iphone-15-pro',
    model: 'iPhone 15 Pro',
    metaTitle: 'iPhone 15 Pro Screen Wholesale: OLED, Incell & Original Prices',
    metaDescription:
      'Wholesale iPhone 15 Pro screen assemblies by grade (Original, Soft OLED, Hard OLED, Incell) with 10+/50+/200+ prices and stock status. 10-pcs mixed order minimum.',
    facts: [
      {
        label: 'Original display',
        value:
          '6.1-inch Super Retina XDR OLED, 2556 × 1179 at 460 ppi, with ProMotion up to 120Hz, Always-On display and Dynamic Island.',
        sourceUrl: 'https://support.apple.com/en-us/111829',
      },
      {
        label: 'Compatibility',
        value:
          'iPhone 15 Pro replacement screens are listed for model numbers A2848, A3101, A3102 and A3104. Check the model number on the device before ordering.',
        sourceUrl: 'https://www.ifixit.com/products/iphone-15-pro-screen',
      },
    ],
    afterInstall: [
      {
        label: 'Parts and Service History',
        value:
          'iOS lists a non-Apple display as an “Unknown Part” under Settings > General > About > Parts and Service History. Tell your customer before the repair.',
        sourceUrl: 'https://support.apple.com/en-us/102658',
      },
      {
        label: 'True Tone',
        value:
          'Apple notes that True Tone may not work correctly on a non-genuine display. Repair shops usually copy the original screen data with a programmer (JC, i2C or JCID) to restore it.',
        sourceUrl: 'https://support.apple.com/en-us/103256',
      },
    ],
    gradeAdvice: {
      Incell: 'The original panel runs ProMotion up to 120Hz. Ask us whether a given incell assembly runs at 60Hz or 120Hz before you order.',
    },
    related: ['iphone-13', 'iphone-17-pro-max'],
  },
  {
    slug: 'iphone-17-pro-max',
    model: 'iPhone 17 Pro Max',
    metaTitle: 'iPhone 17 Pro Max Screen Wholesale: OLED, Incell & Original',
    metaDescription:
      'Wholesale iPhone 17 Pro Max screen assemblies by grade (Original, Soft OLED, Hard OLED, Incell) with 10+/50+/200+ prices and stock status. 10-pcs mixed order minimum.',
    facts: [
      {
        label: 'Original display',
        value:
          '6.9-inch Super Retina XDR OLED, 2868 × 1320 at 460 ppi, with ProMotion up to 120Hz, Always-On display and Dynamic Island.',
        sourceUrl: 'https://support.apple.com/en-us/125091',
      },
    ],
    afterInstall: [
      {
        label: 'Parts and Service History',
        value:
          'iOS lists a non-Apple display as an “Unknown Part” under Settings > General > About > Parts and Service History. Tell your customer before the repair.',
        sourceUrl: 'https://support.apple.com/en-us/102658',
      },
      {
        label: 'True Tone',
        value:
          'Apple notes that True Tone may not work correctly on a non-genuine display. Repair shops usually copy the original screen data with a programmer (JC, i2C or JCID) to restore it.',
        sourceUrl: 'https://support.apple.com/en-us/103256',
      },
    ],
    gradeAdvice: {
      Incell: 'The original panel runs ProMotion up to 120Hz. Ask us whether a given incell assembly runs at 60Hz or 120Hz before you order.',
    },
    related: ['iphone-15-pro', 'iphone-13'],
  },
];

export const SCREEN_MODEL_PAGE_BY_SLUG: Record<string, ScreenModelPage> = Object.fromEntries(
  SCREEN_MODEL_PAGES.map((p) => [p.slug, p])
);

export const SCREEN_MODEL_PAGE_BY_MODEL: Record<string, ScreenModelPage> = Object.fromEntries(
  SCREEN_MODEL_PAGES.map((p) => [p.model, p])
);

// Brand slugs live in the same URL segment; a model slug must never shadow one.
const BRAND_SLUGS = ['gx', 'jk', 'dd', 'rj'];
for (const p of SCREEN_MODEL_PAGES) {
  if (BRAND_SLUGS.includes(p.slug) || !/^(iphone|galaxy)-/.test(p.slug)) {
    throw new Error(`screen-model-pages: invalid model slug "${p.slug}"`);
  }
}
