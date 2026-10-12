// iPhone screen catalog as shown on the site: the generated base catalog
// (iphone-screen-catalog.ts, 2026-05 snapshot) with the supplier live-price
// refresh (screen-price-refresh.ts) applied on top. Every page that shows screen
// prices must import from here so the hub table, brand pages and model pages
// never disagree.
//
// 2026-10-12 用户拍板：挂牌价 = 供应商现价，不加价；页面注明 10 片起、量大另报。

import { IPHONE_SCREEN_CATALOG as BASE_CATALOG, type ScreenSku as BaseScreenSku } from './iphone-screen-catalog';
import { SCREEN_PRICE_REFRESH } from './screen-price-refresh';

export interface ScreenSku extends BaseScreenSku {
  /** Supplier SKU (= image file name), the key used by the price refresh. */
  supplierSku: string;
  /** null = stock not re-checked since the base snapshot. */
  inStock: boolean | null;
  /** ISO date of the last live price check; null = base snapshot only. */
  checkedAt: string | null;
}

/** Date of the base snapshot that unrefreshed rows still carry. */
export const BASE_CATALOG_DATE = '2026-05-27';

function supplierSkuOf(image: string) {
  return image.split('/').pop()!.replace(/\.[a-z]+$/i, '');
}

export const IPHONE_SCREEN_CATALOG: ScreenSku[] = BASE_CATALOG.map((row) => {
  const supplierSku = supplierSkuOf(row.image);
  const refresh = SCREEN_PRICE_REFRESH[supplierSku];
  if (!refresh) return { ...row, supplierSku, inStock: null, checkedAt: null };
  return {
    ...row,
    supplierSku,
    grade: refresh.grade ?? row.grade,
    p10: refresh.p10,
    p50: refresh.p50,
    p200: refresh.p200,
    inStock: refresh.inStock,
    checkedAt: refresh.checkedAt,
  };
});
