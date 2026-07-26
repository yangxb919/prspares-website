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
    value: '10 pcs for screens — mixed models count toward the minimum, so 5 + 5 across two models qualifies.',
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
