// B2B buying facts — single source for the B2BFactsTable component (competitor
// action item #4: REPART/Kimeery-style trade facts card, transparent-version).
// Every row must be a fact PRSPARES already publishes or operates by; do not add
// monthly-capacity or certification claims here without documented basis
// (see Analytics/claim-ledger.md).

export interface B2BFact {
  label: string;
  value: string;
}

export const B2B_FACTS: B2BFact[] = [
  {
    label: 'Supplier type',
    value: 'Independent factory-direct wholesale supplier based in Huaqiangbei, Shenzhen. Third-party brand names appear as compatibility references only.',
  },
  {
    label: 'MOQ',
    // 单一事实源（2026-09-10 用户拍板，取代 07-30「跨品类凑 10 + 试单 5」与 08-24「纯分品类」两版）：
    // 含屏幕的混单整单满 10 件即可；单品类单独下单：屏 10 / 电池 20 / 小件 20 / 工具 5；不再写「试单 5 件」。
    // 全站博客已按此口径回扫（见 changelogs/2026-09-10.md）——改这里必须同步跑 Analytics/scripts/_scan_moq.mjs 扫博客。
    value:
      'No single-model MOQ. A mixed order that includes screens qualifies once it totals 10 pcs across models, grades and categories, and the published 10+ tier price applies to every line. Ordered on their own, screens start at 10 pcs, batteries and small parts at 20 pcs, repair tools at 5 pcs. Freight is quoted separately.',
  },
  {
    label: 'Pricing structure',
    value: 'Published tiered wholesale pricing at 10+ / 50+ / 200+ units, by model and grade — no login wall, no quote games.',
  },
  {
    label: 'Quote response',
    value: 'Within 24 hours with price, stock status and lead time for your model list.',
  },
  {
    label: 'Quality control',
    value: 'Incoming-material QC on every batch; batteries checked for capacity, voltage and IC at intake.',
  },
  {
    label: 'Warranty',
    value: '12-month defect replacement warranty on all parts.',
  },
  {
    label: 'Shipping',
    value: 'DHL / FedEx / UPS express, typically 3-7 days door-to-door; freight quoted per destination.',
  },
  {
    label: 'Trade terms',
    value: 'Prices quoted EXW Shenzhen; proforma invoice issued before payment.',
  },
  {
    label: 'Payment',
    value: 'Bank transfer (T/T) or PayPal, confirmed on the proforma invoice.',
  },
  {
    label: 'Screen grades',
    value: 'Four published grades — Original, Soft OLED, Hard OLED, Incell — each SKU grade-labeled with live prices.',
  },
];
