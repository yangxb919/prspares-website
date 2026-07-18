import Link from 'next/link';
import { IPHONE_SCREEN_CATALOG } from '@/data/iphone-screen-catalog';
import { GRADE_TAXONOMY, type GradeDef } from '@/data/grade-taxonomy';

// Canonical grade comparison matrix — the site-wide authority for what each
// screen grade means (W2 grade hub, Notion plan 点二). Every number is computed
// from the live catalog at build time; nothing is hand-filled (zero-fake).

export interface GradeStats {
  def: GradeDef;
  skuCount: number;
  modelCount: number;
  minP10: number;
  maxP10: number;
}

export function computeGradeStats(): GradeStats[] {
  return GRADE_TAXONOMY.map((def) => {
    const rows = IPHONE_SCREEN_CATALOG.filter((r) => r.grade === def.label);
    return {
      def,
      skuCount: rows.length,
      modelCount: new Set(rows.map((r) => r.model)).size,
      minP10: rows.length ? Math.min(...rows.map((r) => r.p10)) : 0,
      maxP10: rows.length ? Math.max(...rows.map((r) => r.p10)) : 0,
    };
  });
}

const money = (n: number) => `$${n.toFixed(2)}`;

// Row facts that are qualitative (not derivable from catalog data). Wording
// mirrors grade-taxonomy definitions and the screens-page FAQ — do not drift.
const QUALITY_VS_STOCK: Record<string, string> = {
  Original: 'Matches stock brightness, color and True Tone',
  'Soft OLED': 'Roughly 90–95% of original display quality',
  'Hard OLED': 'Good OLED color, slightly thicker glass',
  Incell: 'LCD brightness and contrast — no deep blacks',
};

const PANEL_TYPE: Record<string, string> = {
  Original: 'Refurbished original panel: factory OLED cell + new glass',
  'Soft OLED': 'Aftermarket flexible OLED panel',
  'Hard OLED': 'Aftermarket rigid OLED panel',
  Incell: 'Aftermarket in-cell LCD assembly',
};

const TRUE_TONE: Record<string, string> = {
  Original: 'Transfers with a programmer (JC / i2C / JCID)',
  'Soft OLED': 'Transfers with a programmer (JC / i2C / JCID)',
  'Hard OLED': 'Transfers with a programmer (JC / i2C / JCID)',
  Incell: 'Varies by SKU — confirm before ordering',
};

const GRADE_HEADER_BG: Record<string, string> = {
  Original: 'bg-[#0b6b45]',
  'Soft OLED': 'bg-[#1f7a52]',
  'Hard OLED': 'bg-[#2f8f6a]',
  Incell: 'bg-[#9a5a16]',
};

export default function ScreenGradeTable() {
  const stats = computeGradeStats();

  return (
    <div className="overflow-x-auto rounded-lg border border-[#e4dccb]">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="bg-[#18212c] px-4 py-3 font-bold text-white">Grade</th>
            {stats.map(({ def }) => (
              <th key={def.key} className={`${GRADE_HEADER_BG[def.label]} px-4 py-3 font-bold text-white`}>
                {def.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="px-4 py-3 font-bold text-[#18212c]">Panel type</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">{PANEL_TYPE[def.label]}</td>
            ))}
          </tr>
          <tr className="bg-[#faf8f3]">
            <td className="px-4 py-3 font-bold text-[#18212c]">Display quality</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">{QUALITY_VS_STOCK[def.label]}</td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-bold text-[#18212c]">True Tone</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">{TRUE_TONE[def.label]}</td>
            ))}
          </tr>
          <tr className="bg-[#faf8f3]">
            <td className="px-4 py-3 font-bold text-[#18212c]">Face ID</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">
                Not affected — keep the original sensor flex
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-bold text-[#18212c]">Best for</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">{def.bestFor}</td>
            ))}
          </tr>
          <tr className="bg-[#faf8f3]">
            <td className="px-4 py-3 font-bold text-[#18212c]">iPhone SKUs in stock</td>
            {stats.map(({ def, skuCount, modelCount }) => (
              <td key={def.key} className="px-4 py-3 text-[#52606d]">
                {skuCount} SKUs · {modelCount} models
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-bold text-[#18212c]">Wholesale price (10+ units)</td>
            {stats.map(({ def, minP10, maxP10 }) => (
              <td key={def.key} className="whitespace-nowrap px-4 py-3 font-mono font-bold text-[#0b6b45]">
                {money(minP10)} – {money(maxP10)}
              </td>
            ))}
          </tr>
          <tr className="bg-[#faf8f3]">
            <td className="px-4 py-3 font-bold text-[#18212c]">Live price list</td>
            {stats.map(({ def }) => (
              <td key={def.key} className="px-4 py-3">
                <Link href="/products/screens#price-list" className="font-bold text-[#ff8a2a] hover:text-[#0b6b45]">
                  View {def.label} prices →
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
