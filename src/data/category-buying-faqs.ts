// "Buying questions" for category pages: the purchase-decision answers a buyer
// checks before sending a list (price range, MOQ, grades, warranty, shipping,
// payment). Every number is computed from the live catalogs or read from
// b2b-facts.ts — never typed in here — so the visible block and the FAQPage
// schema can't drift from the price tables.
//
// 2026-10-12 用户拍板：不写报价时效；10-13：付款后隔天发货；付款只写银行转账；价格注明 10 片起、量大另报。

import { B2B_FACTS } from './b2b-facts';
import { GRADE_TAXONOMY } from './grade-taxonomy';
import { IPHONE_SCREEN_CATALOG } from './screen-catalog';
import { IPHONE_BATTERY_CATALOG } from './iphone-battery-catalog';

export interface Faq {
  q: string;
  a: string;
}

const money = (n: number) => `$${n.toFixed(2)}`;
const fact = (label: string) => B2B_FACTS.find((f) => f.label === label)?.value ?? '';
const range = (ps: number[]) => `${money(Math.min(...ps))}–${money(Math.max(...ps))}`;

const VOLUME_NOTE = 'Listed prices apply from 10 pcs; larger volumes are quoted separately.';

const commonFaqs = (): Faq[] => [
  { q: 'What warranty do you give?', a: fact('Warranty') },
  { q: 'How is the order shipped?', a: fact('Shipping') },
  { q: 'How do I pay?', a: fact('Payment') },
];

export function screensBuyingFaqs(): Faq[] {
  const rows = IPHONE_SCREEN_CATALOG;
  const byGrade = GRADE_TAXONOMY.map((g) => ({ g, rows: rows.filter((r) => r.grade === g.label) })).filter(
    (x) => x.rows.length
  );
  return [
    {
      q: 'What do wholesale iPhone screens cost?',
      a: `Listed iPhone screen assemblies run ${range(rows.map((r) => r.p10))} per unit for 10+ pcs: ${byGrade
        .map((x) => `${x.g.label} ${range(x.rows.map((r) => r.p10))}`)
        .join(', ')}. ${VOLUME_NOTE} Each model's full price list is in the table on this page.`,
    },
    { q: 'What is the minimum order for screens?', a: fact('MOQ') },
    {
      q: 'Which screen grades can I order?',
      a: `${byGrade.length} grades, each SKU labeled: ${byGrade
        .map((x) => `${x.g.label} (${x.rows.length} SKUs) — ${x.g.note.toLowerCase()}`)
        .join('; ')}.`,
    },
    ...commonFaqs(),
  ];
}

export function batteriesBuyingFaqs(): Faq[] {
  const rows = IPHONE_BATTERY_CATALOG;
  const types = [...new Set(rows.map((r) => r.type))].map((t) => ({ t, rows: rows.filter((r) => r.type === t) }));
  const models = new Set(rows.map((r) => r.model)).size;
  return [
    {
      q: 'What do wholesale iPhone batteries cost?',
      a: `Listed iPhone batteries run ${range(rows.map((r) => r.p10))} per unit at the 10+ tier across ${models} models (${types
        .map((x) => `${x.t} ${range(x.rows.map((r) => r.p10))}`)
        .join(', ')}). ${VOLUME_NOTE} Samsung and other Android batteries are priced on request.`,
    },
    { q: 'What is the minimum order for batteries?', a: fact('MOQ') },
    ...commonFaqs(),
  ];
}
