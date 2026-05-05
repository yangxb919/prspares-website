'use client';

import { useMemo, useState } from 'react';
import type { QuoteLine } from '@/data/product-category-pages';

type HeroFilterRow = {
  model: string;
  category: string;
  value: string;
};

type HeroFilterSet = {
  label: string;
  rows: HeroFilterRow[];
};

type HeroFilterConfig = {
  eyebrow: string;
  filters: HeroFilterSet[];
};

const heroFilterConfigs: Record<string, HeroFilterConfig> = {
  // TODO: replace placeholder hero chip rows with verified catalog segmentation when source data is available.
  screens: {
    eyebrow: 'Grade lane',
    filters: [
      {
        label: 'Soft OLED',
        rows: [
          { model: 'iPhone Pro Max series', category: 'Soft OLED screen', value: 'Grade quote' },
          { model: 'Samsung S series', category: 'Soft OLED assembly', value: 'Grade quote' },
          { model: 'Pixel Pro series', category: 'Soft OLED panel', value: 'Grade quote' },
        ],
      },
      {
        label: 'Hard OLED',
        rows: [
          { model: 'iPhone standard series', category: 'Hard OLED screen', value: 'Value quote' },
          { model: 'Samsung A/S mix', category: 'Hard OLED assembly', value: 'Value quote' },
          { model: 'Android hot models', category: 'Hard OLED panel', value: 'Value quote' },
        ],
      },
      {
        label: 'Incell',
        rows: [
          { model: 'iPhone legacy models', category: 'Incell LCD screen', value: 'MOQ quote' },
          { model: 'Galaxy A series', category: 'Incell LCD option', value: 'MOQ quote' },
          { model: 'Redmi / OPPO lines', category: 'Incell LCD panel', value: 'MOQ quote' },
        ],
      },
    ],
  },
  batteries: {
    eyebrow: 'Capacity lane',
    filters: [
      {
        label: '< 3000mAh',
        rows: [
          { model: 'Compact iPhone models', category: 'Slim battery', value: 'Route quote' },
          { model: 'Small Android models', category: 'Replacement battery', value: 'Route quote' },
          { model: 'Legacy phones', category: 'Low-capacity pack', value: 'Route quote' },
        ],
      },
      {
        label: '3000–4000',
        rows: [
          { model: 'iPhone mainline', category: 'Standard battery', value: 'MOQ quote' },
          { model: 'Galaxy S / A mix', category: 'Standard battery', value: 'MOQ quote' },
          { model: 'Pixel / Xiaomi', category: 'Standard battery', value: 'MOQ quote' },
        ],
      },
      {
        label: '4000–5000',
        rows: [
          { model: 'Samsung FE / A series', category: 'High-capacity battery', value: 'DG quote' },
          { model: 'Redmi Note series', category: 'High-capacity pack', value: 'DG quote' },
          { model: 'Huawei Mate line', category: 'High-capacity pack', value: 'DG quote' },
        ],
      },
      {
        label: '> 5000',
        rows: [
          { model: 'Large Android phones', category: 'Extended battery', value: 'Pack quote' },
          { model: 'Tablet add-ons', category: 'Large battery pack', value: 'Pack quote' },
          { model: 'Mixed bulk order', category: 'DG packing lane', value: 'Pack quote' },
        ],
      },
    ],
  },
  'small-parts': {
    eyebrow: 'Part type',
    filters: [
      {
        label: 'Camera',
        rows: [
          { model: 'iPhone Pro series', category: 'Rear camera module', value: 'Line quote' },
          { model: 'Pixel flagship', category: 'Camera set', value: 'Line quote' },
          { model: 'Galaxy Ultra', category: 'Camera module', value: 'Line quote' },
        ],
      },
      {
        label: 'Charging Port',
        rows: [
          { model: 'Samsung S series', category: 'Charging board', value: 'MOQ quote' },
          { model: 'OPPO Reno line', category: 'Charging sub board', value: 'MOQ quote' },
          { model: 'Redmi Note line', category: 'Charging flex', value: 'MOQ quote' },
        ],
      },
      {
        label: 'Flex Cable',
        rows: [
          { model: 'iPhone mainline', category: 'Power / volume flex', value: 'Mix quote' },
          { model: 'Huawei Nova', category: 'Internal flex cable', value: 'Mix quote' },
          { model: 'Vivo / OPPO', category: 'LCD / antenna flex', value: 'Mix quote' },
        ],
      },
      {
        label: 'Speaker',
        rows: [
          { model: 'iPhone family', category: 'Loudspeaker', value: 'Add-on quote' },
          { model: 'Galaxy A series', category: 'Speaker unit', value: 'Add-on quote' },
          { model: 'Android long tail', category: 'Earpiece speaker', value: 'Add-on quote' },
        ],
      },
      {
        label: 'SIM Tray',
        rows: [
          { model: 'iPhone color mix', category: 'SIM tray', value: 'Color quote' },
          { model: 'Samsung color mix', category: 'SIM tray', value: 'Color quote' },
          { model: 'OPPO / Vivo mix', category: 'SIM tray', value: 'Color quote' },
        ],
      },
    ],
  },
  'repair-tools': {
    eyebrow: 'Tool group',
    filters: [
      {
        label: 'Screwdrivers',
        rows: [
          { model: 'Precision driver kit', category: 'Bench consumable', value: 'Kit quote' },
          { model: 'Screw organizer set', category: 'Repair tool', value: 'Kit quote' },
          { model: 'Opening tool set', category: 'Hand tool', value: 'Kit quote' },
        ],
      },
      {
        label: 'Programmers',
        rows: [
          { model: 'NAND programmer', category: 'Board tool', value: 'Version quote' },
          { model: 'True Tone programmer', category: 'Screen workflow', value: 'Version quote' },
          { model: 'Battery programmer', category: 'Battery workflow', value: 'Version quote' },
        ],
      },
      {
        label: 'IC Tools',
        rows: [
          { model: 'WiFi IC lane', category: 'IC chip order', value: 'Model quote' },
          { model: 'Power IC lane', category: 'Board repair', value: 'Model quote' },
          { model: 'Connector IC lane', category: 'Micro-repair', value: 'Model quote' },
        ],
      },
      {
        label: 'Power Tools',
        rows: [
          { model: 'Power test cable', category: 'Diagnostic line', value: 'Bench quote' },
          { model: 'Spot welder', category: 'Battery bench', value: 'Bench quote' },
          { model: 'Soldering station', category: 'Workshop tool', value: 'Bench quote' },
        ],
      },
    ],
  },
  'tablet-watch': {
    eyebrow: 'Device lane',
    filters: [
      {
        label: 'iPad',
        rows: [
          { model: 'iPad Pro', category: 'Display / battery', value: 'Model quote' },
          { model: 'iPad Air', category: 'Battery / flex', value: 'Model quote' },
          { model: 'iPad mini', category: 'Small tablet parts', value: 'Model quote' },
        ],
      },
      {
        label: 'Galaxy Tab',
        rows: [
          { model: 'Galaxy Tab S', category: 'Display assembly', value: 'Model quote' },
          { model: 'Galaxy Tab A', category: 'Battery / charging', value: 'Model quote' },
          { model: 'Samsung tablet mix', category: 'Flex cable lane', value: 'Model quote' },
        ],
      },
      {
        label: 'Apple Watch',
        rows: [
          { model: 'Watch display', category: 'Smartwatch screen', value: 'Size quote' },
          { model: 'Watch battery', category: 'Smartwatch battery', value: 'Size quote' },
          { model: 'Watch flex parts', category: 'Small wearable parts', value: 'Size quote' },
        ],
      },
      {
        label: 'Galaxy Watch',
        rows: [
          { model: 'Round display lane', category: 'Smartwatch display', value: 'Size quote' },
          { model: 'Watch battery lane', category: 'Wearable battery', value: 'Size quote' },
          { model: 'Wearable add-ons', category: 'Flex / small parts', value: 'Size quote' },
        ],
      },
    ],
  },
};

function fallbackRows(lines: readonly QuoteLine[]): HeroFilterRow[] {
  return lines.slice(0, 3).map((line) => ({
    model: line.model,
    category: line.category,
    value: line.tiers[0],
  }));
}

export default function HeroFilterChips({
  pageSlug,
  fallbackLines,
}: {
  pageSlug: string;
  fallbackLines: readonly QuoteLine[];
}) {
  const config = heroFilterConfigs[pageSlug];
  const [activeLabel, setActiveLabel] = useState(config?.filters[0]?.label ?? 'Catalog');
  const activeRows = useMemo(() => {
    if (!config) return fallbackRows(fallbackLines);
    return config.filters.find((filter) => filter.label === activeLabel)?.rows ?? config.filters[0].rows;
  }, [activeLabel, config, fallbackLines]);

  return (
    <div className="mt-4">
      {config && (
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white/45">{config.eyebrow}</div>
          <div className="mb-4 flex flex-wrap gap-2">
            {config.filters.map((filter) => {
              const active = filter.label === activeLabel;
              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setActiveLabel(filter.label)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
                    active
                      ? 'border-[#ff8a2a] bg-[#ff8a2a] text-white shadow-lg shadow-orange-950/20'
                      : 'border-white/18 bg-white/[0.04] text-white/70 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {activeRows.map((line) => (
          <div key={`${activeLabel}-${line.model}-${line.category}`} className="grid grid-cols-[1fr_auto] gap-4 border border-white/12 bg-white/[0.07] p-3">
            <div>
              <div className="text-sm font-black text-white">{line.model}</div>
              <div className="mt-1 text-xs text-slate-300">{line.category}</div>
            </div>
            <div className="font-mono text-sm font-black text-[#ffb36b]">{line.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
