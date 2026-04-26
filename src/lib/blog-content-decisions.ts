/**
 * PRSPARES Blog — Content Decision Manifest
 *
 * Single source of truth for pillar/supporting/cannibalization decisions
 * across high-risk content clusters. Use this to drive:
 *   - 301 redirect maps (recommended_action === 'recommend-301')
 *   - canonical assignments (recommended_action === 'canonical-to-pillar')
 *   - retitle/reposition work (recommended_action === 'retitle')
 *   - cluster-scoped related-post suggestions
 *
 * Field semantics match the SEO ops playbook — see `/docs` or changelog
 * 2026-04-21 for the original brief.
 */

export type ContentDecisionRole =
  | 'pillar'
  | 'supporting'
  | 'cannibalization-risk'
  | 'distinct-intent'
  | 'legacy-manual-review';

export type ContentDecisionAction =
  | 'keep-as-pillar'
  | 'keep-as-supporting'
  | 'retitle'
  | 'canonical-to-pillar'
  | 'recommend-301'
  | 'manual-merge-needed'
  | 'fix-broken-seo'
  | 'add-category';

export type DecisionStatus =
  | 'applied'               // changes landed in production DB
  | 'code-only'             // only code artifact (manifest/SQL), not yet in DB
  | 'observation-pending'   // canonical-to-pillar applied; waiting window before 301
  | 'needs-human-review'    // requires content judgement before action
  | 'no-action-needed';     // decision: keep as-is

export interface ContentDecision {
  cluster: string;
  slug: string;
  title: string;
  current_category: string;
  recommended_role: ContentDecisionRole;
  primary_intent: string;
  target_keyword_theme: string;
  recommended_action: ContentDecisionAction;
  target_pillar_slug: string | null;
  notes: string;
  /** Lifecycle state of this decision — see DecisionStatus. */
  status_this_round?: DecisionStatus;
  /** Round label (e.g. 'P3', 'P4') that first produced this row. */
  round?: string;
}

export const CONTENT_DECISIONS: ContentDecision[] = [
  // ═════════════════════════════════════════════════════════════════════
  // Cluster 1 — iPhone 15 screen replacement
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'iphone-15-screen',
    slug: 'iphone-15-screen-replacement',
    title: 'iPhone 15 Screen Replacement: What Repair Shops Need to Know in 2026',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'broad overview — grades, cost, IC transfer, 120Hz ProMotion, UK pricing',
    target_keyword_theme: 'iphone 15 screen replacement',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Broadest coverage of the cluster; keep unchanged. All supporting pages should canonical-point or at least internal-link back here.',
  },
  {
    cluster: 'iphone-15-screen',
    slug: 'iphone-15-screen-grade-repair-shops',
    title: 'iPhone 15 Screen Replacement: Which Grade Should Repair Shops Use?',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'grade selection (Incell / Hard OLED / Soft OLED) for iPhone 15 standard vs Pro',
    target_keyword_theme: 'iphone 15 screen grade / soft oled vs incell iphone 15',
    recommended_action: 'retitle',
    target_pillar_slug: 'iphone-15-screen-replacement',
    notes:
      'Distinct intent (grade picker) but title still starts with "iPhone 15 Screen Replacement:" which competes with pillar on SERP. Retitle H1 + meta title to lead with "Grade Guide" angle.',
  },
  {
    cluster: 'iphone-15-screen',
    slug: 'iphone-15-screen-replacement-cost-repair-shops',
    title: 'iPhone 15 Screen Replacement Cost: How Repair Shops Should Price It in 2026',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'pricing strategy for UK repair shops, £80–£379 benchmarks',
    target_keyword_theme: 'iphone 15 screen replacement cost / repair shop pricing',
    recommended_action: 'retitle',
    target_pillar_slug: 'iphone-15-screen-replacement',
    notes:
      'Strong distinct angle (repair-shop pricing, margin math). Retitle to lead with "Repair Shop Pricing" so SERP cluster shows clear intent split from the pillar.',
  },
  {
    cluster: 'iphone-15-screen',
    slug: 'iphone-15-screen-replacement-cost-quality',
    title:
      "iPhone 15 Screen Replacement: The Real Cost, Quality Grades & What Repair Shops Won't Tell You",
    current_category: 'parts-knowledge',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'overlapping with pillar — cost + quality grades framing, storytelling',
    target_keyword_theme: 'iphone 15 screen replacement cost / quality',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'iphone-15-screen-replacement',
    notes:
      'Body overlaps pillar intent (cost + grades). meta.seo.description was broken (contained raw body text). Apply canonical to pillar as a safe short-term fix. Flag for manual merge: either 301 or absorb unique storytelling into pillar.',
  },
  {
    cluster: 'iphone-15-screen',
    slug: 'oem-vs-aftermarket-iphone-15-profit-margin',
    title:
      'OEM vs Aftermarket iPhone 15 Screens: Real Profit Margin Comparison for Repair Shops',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'callback costs, IC transfer labour, OEM-pull vs aftermarket margin',
    target_keyword_theme: 'oem vs aftermarket iphone 15 / profit margin',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-15-screen-replacement',
    notes:
      'Title already differentiates ("OEM vs Aftermarket ... Profit Margin"). No retitle needed.',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Cluster 2 — Wholesale iPhone screens
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'wholesale-iphone-screens-buyer-checklist',
    title:
      'Wholesale iPhone Screens Buyer Checklist: 12 Things to Verify Before Your First Bulk Order',
    current_category: 'industry-insights',
    recommended_role: 'pillar',
    primary_intent: 'actionable buyer checklist — most hub-like article in this cluster',
    target_keyword_theme: 'wholesale iphone screens buyer checklist',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Best pillar candidate: concrete 12-point checklist covers grade, IC chips, True Tone, Face ID, warranty. Category was "Industry Insights" (title case bug) — normalized in migration 202604210001.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'iphone-screen-replacement-wholesale-repair-business',
    title: 'iPhone Screen Replacement Wholesale: Best Options for Repair Businesses',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: '90-day stock plan, grade picks by business type',
    target_keyword_theme: 'iphone screen wholesale / 90-day plan',
    recommended_action: 'retitle',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      '"Best Options" framing competes with pillar. Retitle to lead with "Grade Picks & 90-Day Stock Plan" to signal execution-plan angle.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'wholesale-iphone-screens-pricing-guide',
    title:
      'Wholesale iPhone Screens: Pricing Logic, Grade Differences, and What to Check Before Ordering',
    current_category: 'business-tips',
    recommended_role: 'supporting',
    primary_intent: 'pricing logic and grade differences for wholesale iPhone screens',
    target_keyword_theme: 'wholesale iphone screen pricing',
    recommended_action: 'retitle',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'Retitle to put "Pricing" first and drop "Wholesale iPhone Screens:" prefix — clearer SERP differentiation from pillar.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'wholesale-iphone-screens-avoid-overstocking',
    title: 'How to Buy Wholesale iPhone Screens Without Overstocking Slow Models',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'inventory management — reorder formulas, depreciation, liquidation',
    target_keyword_theme: 'wholesale iphone screens inventory / overstocking',
    recommended_action: 'retitle',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'Retitle to foreground the "Inventory" angle, e.g. "Wholesale iPhone Screens Inventory: How to Avoid Overstocking Slow Models".',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'wholesale-iphone-screens-grades-prices-moq',
    title: 'Wholesale iPhone Screens: How Buyers Compare Grades, Prices, and MOQ',
    current_category: 'business-tips',
    recommended_role: 'supporting',
    primary_intent: 'grade comparison by profit margin, MOQ strategy',
    target_keyword_theme: 'wholesale iphone screens MOQ / grade / price compare',
    recommended_action: 'retitle',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'Close overlap with pricing-guide article. Retitle to foreground "MOQ & Order Strategy" and pair it more tightly with the buyer checklist pillar.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'iphone-screens-wholesale-oled-incell-comparison',
    title: 'iPhone Screens Wholesale: Soft OLED vs Hard OLED vs Incell for Bulk Buyers',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'OLED/Incell comparison for wholesale bulk buyers — bridges cluster 2 and 3',
    target_keyword_theme: 'soft oled vs hard oled vs incell wholesale',
    recommended_action: 'retitle',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'Cross-cluster article. Retitle to foreground the OLED/Incell angle so SERP differentiates from the generic "iPhone Screens Wholesale" cluster. Targets the OLED cluster pillar, not the wholesale pillar.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'wholesale-phone-screens-vs-oem-aftermarket-profit',
    title: 'Wholesale Phone Screens vs OEM Pulls vs Aftermarket: Which Is Better for Profit?',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'sourcing channel profit comparison (wholesale vs OEM pulls vs aftermarket)',
    target_keyword_theme: 'wholesale vs oem pulls vs aftermarket / profit',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'Already distinct intent (channel vs channel). No retitle needed.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'cell-phone-screens-wholesale-repair-shops-2026',
    title: 'Cell Phone Screens Wholesale: What Repair Shops Should Buy in 2026',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: '2026 annual buying plan, brand priorities, market shifts',
    target_keyword_theme: 'cell phone screens wholesale 2026',
    recommended_action: 'retitle',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'Strong annual-plan angle — retitle to signal this is a year-specific stock plan, reducing overlap with pillar.',
  },
  {
    cluster: 'wholesale-iphone-screens',
    slug: 'phone-screen-wholesale-oem-vs-aftermarket',
    title:
      "Cell Phone Screen Replacement Wholesale: OEM vs Aftermarket Quality - The Insider's Guide",
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'OEM vs aftermarket quality tiers, insider guide framing',
    target_keyword_theme: 'cell phone screen replacement wholesale oem vs aftermarket',
    recommended_action: 'fix-broken-seo',
    target_pillar_slug: 'wholesale-iphone-screens-buyer-checklist',
    notes:
      'meta.seo.title was mangled (prefix "screens - " + article body bleed). Replace with a clean SEO title/description. Article itself is worth keeping as supporting.',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Cluster 3 — OLED / LCD / Incell / Hard OLED / Soft OLED
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'oled-lcd-grades',
    slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    title: 'LCD vs OLED vs Hard OLED vs Soft OLED: Which One Should Repair Shops Buy?',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent:
      'repair-shop-focused grade decision — pricing, margin, which grade per iPhone model',
    target_keyword_theme: 'lcd vs oled / hard oled vs soft oled / repair shop',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Best pillar: repair-shop buyer intent, model-by-model guidance, margin context. Keep unchanged.',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'incell-vs-hard-oled-vs-soft-oled-which-screen-to-order',
    title:
      'Incell vs Hard OLED vs Soft OLED: Which Screen Type to Order for Each iPhone and Samsung Model',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'per-model ordering decision (iPhone + Samsung)',
    target_keyword_theme: 'which screen type to order per iphone / samsung model',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'Already distinct (per-model ordering). No retitle needed.',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'incell-soft-oled-hard-oled-cost-comparison-repair-shops',
    title:
      'INCELL vs Soft OLED vs Hard OLED in 2026: Real Cost & Margin Analysis for Repair Shops',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'cost/margin data from 18,000+ installs; defect-rate analytics',
    target_keyword_theme: 'incell vs oled cost / margin data',
    recommended_action: 'retitle',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'Retitle to lead with data-set signal ("18,000-Install Margin Data"). Differentiates from pillar on SERP.',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'whats-the-real-difference-between-oled-and-lcd-phone-screens',
    title: "What's the Real Difference Between OLED and LCD Phone Screens?",
    current_category: 'parts-knowledge',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'generic consumer-oriented OLED vs LCD — highly overlaps pillar',
    target_keyword_theme: 'oled vs lcd phone screen',
    recommended_action: 'recommend-301',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'P3: canonical-to-pillar applied (also fixed prspares.com mixed-domain). P7: graduated to hard 301 in next.config.js after content review confirmed no salvageable unique value vs the 2,685-word repair-shop pillar.',
    round: 'P7',
    status_this_round: 'applied',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'oled-vs-lcd-comparison-guide',
    title: 'OLED vs LCD Comparison: The Ultimate Mobile Display Guide',
    current_category: 'parts-knowledge',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'generic 3000-word OLED vs LCD comparison — overlaps pillar',
    target_keyword_theme: 'oled vs lcd comparison',
    recommended_action: 'recommend-301',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'P3: canonical-to-pillar applied. P7: graduated to hard 301. Larger word count (3,870 vs pillar 2,685) was bloat (consumer-tone overview), not unique substance.',
    round: 'P7',
    status_this_round: 'applied',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'oled-vs-lcd-comprehensive-comparison',
    title: 'OLED vs LCD: Comprehensive Mobile Display Technology Comparison',
    current_category: 'parts-knowledge',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'third generic OLED vs LCD overview — same pattern as the two siblings already 301-ed in P7',
    target_keyword_theme: 'oled vs lcd comparison',
    recommended_action: 'recommend-301',
    target_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    notes:
      'P7 follow-up (2026-04-25): missed in the original P7 sweep due to differing slug naming. GSC shows 38 imp / 0 clk / pos ~? over 90 days — same pattern as the two siblings. Hard 301 added; sitemap exclude added.',
    round: 'P7-followup',
    status_this_round: 'applied',
  },
  {
    cluster: 'oled-lcd-grades',
    slug: 'how-phone-screens-are-made-lcd-oled',
    title: 'How Are Mobile Phone Screens Made? Complete Production Process Analysis from LCD to OLED',
    current_category: '(none)',
    recommended_role: 'distinct-intent',
    primary_intent: 'manufacturing process — not a buying decision',
    target_keyword_theme: 'how phone screens are made / manufacturing process',
    recommended_action: 'fix-broken-seo',
    target_pillar_slug: null,
    notes:
      'Distinct intent — keep as standalone. Current meta.seo.description contains raw body text ("Featured Summary..."). Replace with clean description. No canonical needed beyond default.',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P4 (2026-04-22)
  // Cluster 4 — iPhone 11-14 per-model screen replacement cluster
  // Each model has a micro-cluster: a "main" replacement/angle article +
  // a "worth it in 2026" cost/residual-value article. We keep both per
  // model (distinct intents) but retitle the main article to lead with
  // its unique angle so the SERP snippets stop sharing "iPhone N Screen
  // Replacement:" prefix.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-11-screen-replacement',
    title:
      "iPhone 11 LCD Repair Margins: Why the 'Outdated' Screen Is Your Most Profitable Fix",
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'LCD profitability / per-hour margin angle for iPhone 11 repairs',
    target_keyword_theme: 'iphone 11 lcd profit / repair margin',
    recommended_action: 'retitle',
    target_pillar_slug: null,
    notes:
      'Per-model pillar for iPhone 11. Retitle + SEO desc cleanup applied. NOTE: post.excerpt is still Chinese; content team should translate. Keep separate from `-worth-it-2026` (different intent).',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-11-screen-replacement-worth-it-2026',
    title: 'iPhone 11 Screen Replacement in 2026: Is It Still Worth Repairing?',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'residual value / is-it-worth-repairing angle for consumer intent',
    target_keyword_theme: 'iphone 11 screen replacement worth it 2026',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-11-screen-replacement',
    notes: 'Already distinct (worth-it angle). No retitle needed.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-12-screen-replacement',
    title:
      'iPhone 12 Install Pitfalls: Ceramic Shield Myth and the Flat-Edge Trap',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'install-pitfall / technician caution angle for iPhone 12',
    target_keyword_theme: 'iphone 12 ceramic shield / flat edge install risk',
    recommended_action: 'retitle',
    target_pillar_slug: null,
    notes:
      'Per-model pillar for iPhone 12. Retitle + SEO desc cleanup applied. Chinese excerpt flagged for content team.',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-12-screen-replacement-worth-it-2026',
    title: 'iPhone 12 Screen Replacement Cost in 2026: Is It Still Worth Repairing?',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'residual value / cost angle for iPhone 12',
    target_keyword_theme: 'iphone 12 screen replacement cost 2026',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-12-screen-replacement',
    notes: 'Already distinct.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-13-screen-replacement',
    title: 'iPhone 13 Screen Replacement: OEM vs Aftermarket — The £2 Difference That Hides a 400% Quality Gap',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'OEM vs aftermarket quality-gap angle for iPhone 13',
    target_keyword_theme: 'iphone 13 oem vs aftermarket / quality gap',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes: 'Per-model pillar for iPhone 13. Title already leads with unique angle — no retitle needed.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-13-screen-replacement-worth-it-2026',
    title: 'iPhone 13 Screen Replacement Cost in 2026: Is It Still Worth Repairing?',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'residual value / cost angle for iPhone 13',
    target_keyword_theme: 'iphone 13 screen replacement cost 2026',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-13-screen-replacement',
    notes: 'Already distinct.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-14-screen-replacement-design-fix',
    title:
      'iPhone 14 Screen Install Warning: The Design Change That Breaks Screens',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'install-warning / design-flaw angle for iPhone 14',
    target_keyword_theme: 'iphone 14 screen install warning / design change',
    recommended_action: 'retitle',
    target_pillar_slug: null,
    notes:
      'Per-model pillar for iPhone 14. Retitle + SEO desc cleanup + self-canonical applied (was missing).',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-14-screen-grade-repair-shops',
    title: 'iPhone 14 Screen Replacement: Which Screen Grade Should Repair Shops Use?',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'grade picker for iPhone 14',
    target_keyword_theme: 'iphone 14 screen grade / incell vs oled',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-14-screen-replacement-design-fix',
    notes: 'Already distinct (grade picker).',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-8-screen-replacement',
    title: 'iPhone 8 Screen Cross-Compatibility: One Screen Fits 8, SE 2020 and SE 2022',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'cross-model compatibility — unique angle (8/SE 2020/SE 2022)',
    target_keyword_theme: 'iphone 8 screen compatibility / se 2020 se 2022 screen',
    recommended_action: 'retitle',
    target_pillar_slug: null,
    notes:
      'Retitle + SEO desc cleanup applied. Chinese excerpt flagged. Distinct from iPhone 11-14 series: cross-model compat is the unique angle.',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-se-screen-replacement-budget-friendly-repair-guide',
    title: 'iPhone SE Screen Replacement: Budget-Friendly Repair Guide',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'iPhone SE 1/2/3 identification and budget-friendly repair',
    target_keyword_theme: 'iphone se screen replacement budget',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-8-screen-replacement',
    notes:
      'Already distinct ("Budget-Friendly" lead). Pairs with iPhone 8 cross-compat article since all three SE generations cross-reference iPhone 8 parts.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'iphone-11-14-screen',
    slug: 'iphone-xr-screen-replacement-cheapest-options-quality-comparison',
    title: 'iPhone XR Screen Replacement: Cheapest Options & Quality Comparison',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'cheapest options + quality comparison for XR',
    target_keyword_theme: 'iphone xr screen replacement cheapest / lcd quality',
    recommended_action: 'fix-broken-seo',
    target_pillar_slug: null,
    notes:
      'SEO desc was body-text bleed. Fixed in this round. Title already distinct. XR is the only modern iPhone where LCD is correct spec — keep separate.',
    round: 'P4',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P4 — Cluster 5 — Battery (buyer / diagnostic / QC / safety)
  // Two pillars: repair-guide pillar (cost) + wholesale-buyer pillar
  // (buying bulk checklist). Retitled two articles that shared "How
  // Repair Shops Should Choose iPhone Battery [X]" prefix.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'battery',
    slug: 'iphone-battery-replacement-cost-2026',
    title: 'iPhone Battery Replacement Cost in 2026: Is It Worth Replacing?',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'consumer/shop cost-question pillar — all iPhone 11-16 compared',
    target_keyword_theme: 'iphone battery replacement cost 2026',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes: 'Repair-guide pillar. Covers all models. Title/SEO already strong.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'buying-iphone-batteries-bulk-repair-business',
    title: 'What to Check Before Buying iPhone Batteries in Bulk for Repair Business',
    current_category: 'industry-insights',
    recommended_role: 'pillar',
    primary_intent: 'wholesale buyer checklist — parallel pillar to the cost pillar',
    target_keyword_theme: 'buying iphone batteries bulk / wholesale checklist',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Wholesale buyer pillar. This is the intended canonical target for legacy `substandard-battery-sourcing-certified-repair-shops`.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'iphone-battery-quality-repair-shops',
    title: 'iPhone Battery Quality: Matching Grades to Customer Types and Warranty Expectations',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'customer-facing quality tier selection (different customer types)',
    target_keyword_theme: 'iphone battery quality / customer tier',
    recommended_action: 'retitle',
    target_pillar_slug: 'iphone-battery-replacement-cost-2026',
    notes:
      'Retitled to split intent from `how-repair-shops-choose-iphone-battery-grades-wholesale-orders` (both shared the "How Repair Shops Should Choose iPhone Battery" prefix).',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'battery',
    slug: 'how-repair-shops-choose-iphone-battery-grades-wholesale-orders',
    title: 'Wholesale iPhone Battery Grades: How Repair Shops Pick What to Order in Bulk',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'wholesale bulk-order grade selection',
    target_keyword_theme: 'wholesale iphone battery grades bulk',
    recommended_action: 'retitle',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'Retitled to split intent from `iphone-battery-quality-repair-shops`. Now clearly wholesale-order focused.',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'battery',
    slug: 'iphone-battery-specs-wholesale-buying-guide',
    title: 'iPhone Battery Specs That Actually Matter When Buying Wholesale: Capacity, IC Chips, and What to Test',
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'technical specs (IC chips, capacity) — buyer due diligence',
    target_keyword_theme: 'iphone battery wholesale specs / ic chips',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes: 'Already distinct (technical spec angle).',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'common-iphone-battery-quality-problems-wholesale-buyers-check',
    title: 'Common iPhone Battery Quality Problems Wholesale Buyers Should Check Before Ordering',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'QC red flags buyers should screen for',
    target_keyword_theme: 'iphone battery quality problems wholesale qc',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes: 'Already distinct (QC red flags).',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'battery-reset-scams-how-wholesale-buyers-check-if-a-battery-is-really-new',
    title: 'Battery Reset Scams: How Wholesale Buyers Can Check If a Battery Is Really New',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'authenticity / cycle-count fraud verification',
    target_keyword_theme: 'battery reset scam / cycle count fraud',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes: 'Already distinct (authenticity angle).',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'iphone-battery-stocking-by-model-2026',
    title: 'How Repair Shops Should Stock iPhone Batteries by Model in 2026',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'inventory / model stocking plan',
    target_keyword_theme: 'iphone battery stocking by model 2026',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes: 'Already distinct (stocking plan).',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: '2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen',
    title: 'iPhone Battery Wholesale Sourcing Guide 2026: Factory Direct from Shenzhen',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'factory-direct sourcing walkthrough (Shenzhen)',
    target_keyword_theme: 'iphone battery wholesale sourcing / factory direct',
    recommended_action: 'retitle',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'Retitle (2025 → 2026) + SEO desc cleanup applied. Slug still has "2025" — acceptable for now; rename needs a 301 later.',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'battery',
    slug: 'iphone-battery-draining-fast-causes-replacement',
    title: 'iPhone Battery Draining Fast: Causes and When Repair Shops Should Replace It',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'fault diagnosis — when to replace vs not',
    target_keyword_theme: 'iphone battery draining fast diagnosis',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-battery-replacement-cost-2026',
    notes: 'Diagnostic intent — distinct from buyer cluster.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'battery-complaints-after-replacement-repair-shops',
    title: 'Common Battery Complaints After Replacement — and How Shops Can Avoid Callbacks',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'post-replacement callback prevention',
    target_keyword_theme: 'battery complaints after replacement / callback',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-battery-replacement-cost-2026',
    notes: 'Diagnostic / operations intent.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'iphone-15-battery-replacement-no-battery-boot-guide',
    title: 'iPhone 15 Battery Replacement: What Changed with USB-C and How to Get It Right',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'iPhone 15 specific (USB-C BMS) replacement',
    target_keyword_theme: 'iphone 15 battery replacement usb-c',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-battery-replacement-cost-2026',
    notes: 'Model-specific — distinct.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'is-this-iphone-battery-safe-to-reuse-test-guide',
    title: "Is This iPhone Battery Safe to Reuse? A Repair Tech's Diagnostic Guide",
    current_category: 'parts-knowledge',
    recommended_role: 'supporting',
    primary_intent: 'tech diagnostic — reuse or replace',
    target_keyword_theme: 'iphone battery safe to reuse / diagnostic',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-battery-replacement-cost-2026',
    notes: 'Diagnostic intent — distinct.',
    round: 'P4',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'battery',
    slug: 'substandard-battery-sourcing-certified-repair-shops',
    title: 'Are Substandard Mobile Batteries Killing Your Repair Business? The Complete Guide to Sourcing Certified Mobile Phone Batteries for Professional Success',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'legacy sourcing certified batteries — overlaps wholesale-buyer pillar',
    target_keyword_theme: 'certified phone battery sourcing',
    recommended_action: 'recommend-301',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'P4: category added + canonical → wholesale-buyer pillar. P7: graduated to hard 301. Cert/safety angle now lives at `phone-battery-replacement-safety-standards`, so consolidating this one to the buyer pillar does not strand the cert topic.',
    round: 'P7',
    status_this_round: 'applied',
  },
  {
    cluster: 'battery',
    slug: 'phone-battery-replacement-safety-standards',
    title: 'Why Are Mobile Phone Battery Replacement Safety Standards Critical for Your Device and Personal Safety?',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'UL 2054 / IEC 62133 / UN 38.3 safety standards angle',
    target_keyword_theme: 'phone battery safety standards ul iec',
    recommended_action: 'add-category',
    target_pillar_slug: null,
    notes:
      'Distinct safety-standards intent — keep standalone. Category added + self-canonical on www.',
    round: 'P4',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P4 — Cluster 6 — Legacy uncategorized (non-battery remainder)
  // Added category and canonical to pillar where appropriate. Most are
  // candidates for eventual 301 after traffic observation.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'legacy-uncategorized',
    slug: 'china-phone-parts-suppliers-quality-vs-cost',
    title: 'Are Chinese Phone Parts Suppliers Really Worth the Risk? The Truth About Quality vs. Cost Trade-offs',
    current_category: 'sourcing-suppliers',
    recommended_role: 'legacy-manual-review',
    primary_intent: 'broad sourcing-from-China narrative — overlaps sourcing pillar loosely',
    target_keyword_theme: 'china phone parts suppliers quality vs cost',
    recommended_action: 'add-category',
    target_pillar_slug: null,
    notes:
      'Category added; self-canonical set on www. Keep for now — has distinct narrative framing. Flag for future review against `how-to-choose-phone-parts-supplier`.',
    round: 'P4',
    status_this_round: 'applied',
  },
  {
    cluster: 'legacy-uncategorized',
    slug: 'why-risk-your-business-on-single-source-display-suppliers',
    title: 'Why Risk Your Business on Single-Source Display Suppliers?',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'supplier diversification — overlaps `how-to-choose-phone-parts-supplier`',
    target_keyword_theme: 'multi source display supplier / single source risk',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'Canonical on prspares.com (mixed-domain). Canonical retargeted to sourcing pillar on www. Recommend 301 after observation.',
    round: 'P4',
    status_this_round: 'observation-pending',
  },
  {
    cluster: 'legacy-uncategorized',
    slug: 'how-do-you-choose-high-quality-screen-replacement-parts-for-your-phone',
    title: 'How Do You Choose High-Quality Screen Replacement Parts for Your Phone?',
    current_category: 'parts-knowledge',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'consumer-oriented "how do you choose" — overlaps OEM vs aftermarket pillar',
    target_keyword_theme: 'how to choose screen replacement parts',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'oem-vs-aftermarket-phone-screens',
    notes:
      'Canonical on prspares.com (mixed-domain). Canonical retargeted on www. Recommend 301 after observation.',
    round: 'P4',
    status_this_round: 'observation-pending',
  },
  {
    cluster: 'legacy-uncategorized',
    slug: 'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners',
    title: 'Is Your iPhone 14 Pro Max Back Glass Worth Fixing? The Complete Cost-Benefit Guide for Repair Shop Owners',
    current_category: 'repair-guides',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'iPhone 14 Pro Max back-glass cost-benefit — overlaps back-glass pillar',
    target_keyword_theme: 'iphone 14 pro max back glass cost',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'back-glass-replacement-iphone-guide',
    notes:
      'Canonical on prspares.com (mixed-domain). Canonical retargeted to back-glass pillar on www. Recommend 301 after observation.',
    round: 'P4',
    status_this_round: 'observation-pending',
  },
  {
    cluster: 'legacy-uncategorized',
    slug: 'which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business',
    title: 'Which iPhone 14 Pro Max Screen Replacement Option Delivers the Best Value for Your Repair Business?',
    current_category: 'repair-guides',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'iPhone 14 Pro Max screen value — overlaps iPhone 14 grade pillar',
    target_keyword_theme: 'iphone 14 pro max screen replacement value',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'iphone-14-screen-grade-repair-shops',
    notes:
      'Canonical on prspares.com (mixed-domain). Canonical retargeted on www. Recommend 301 after observation.',
    round: 'P4',
    status_this_round: 'observation-pending',
  },
  {
    cluster: 'legacy-uncategorized',
    slug: 'mobile-repair-wholesale-growth-strategies',
    title: 'How Can You Capitalize on the $45.52B Mobile Repair Boom with Premium Wholesale Strategies?',
    current_category: 'industry-insights',
    recommended_role: 'distinct-intent',
    primary_intent: 'industry market analysis — $45.52B TAM / premium wholesale',
    target_keyword_theme: 'mobile repair market growth strategies',
    recommended_action: 'add-category',
    target_pillar_slug: null,
    notes:
      'Market-analysis framing is distinct from operational/pricing content. Category added; self-canonical set on www. Keep as distinct-intent.',
    round: 'P4',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P5 (2026-04-22)
  // Cluster 7 — Charging port (repair / cost / diagnostic / wholesale)
  // Two pillars coexist (repair pillar + cost pillar) because they serve
  // different query intents. Four supporting pages retitled so SERP
  // snippets stop sharing the "iPhone Charging Port Replacement:" prefix.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'charging-port',
    slug: 'iphone-charging-port-replacement-guide',
    title:
      'iPhone Charging Port Repair Guide: Fault Diagnosis, Repair Decisions, and Parts Quality',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'main repair pillar — faults, decisions, parts quality',
    target_keyword_theme: 'iphone charging port replacement / repair guide',
    recommended_action: 'retitle',
    target_pillar_slug: null,
    notes:
      'Retitled from "iPhone Charging Port Replacement: …" to lead with "Repair Guide" so it no longer shares the "Replacement:" prefix with the cost pillar.',
    round: 'P5',
    status_this_round: 'applied',
  },
  {
    cluster: 'charging-port',
    slug: 'iphone-charging-port-replacement-cost',
    title: 'iPhone Charging Port Replacement Cost: When to Clean, Repair, or Replace',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'cost pillar — decision framework (clean vs replace) + pricing',
    target_keyword_theme: 'iphone charging port replacement cost',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Parallel pillar with `iphone-charging-port-replacement-guide`. "Cost" lead word already differentiates on SERP — keep as-is.',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'charging-port',
    slug: 'iphone-charging-port-replacement-cost-uk',
    title: 'iPhone Charging Port Replacement Cost UK: What Repair Shops Charge (and What Parts Cost Wholesale)',
    current_category: 'business-tips',
    recommended_role: 'supporting',
    primary_intent: 'UK-specific pricing + wholesale part cost',
    target_keyword_theme: 'iphone charging port replacement cost uk',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-charging-port-replacement-cost',
    notes: 'Region-specific (UK) — distinct from global cost pillar.',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'charging-port',
    slug: 'iphone-not-charging-diagnosis-charging-port-replacement',
    title: 'iPhone Not Charging? Diagnosis Guide for Repair Shops',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'diagnostic intent — "not charging" symptom triage',
    target_keyword_theme: 'iphone not charging / diagnosis',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-charging-port-replacement-guide',
    notes: 'Diagnostic intent differentiates naturally ("iPhone Not Charging?").',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'charging-port',
    slug: 'charging-port-failures-after-replacement',
    title: 'Charging Port Failures After Replacement: Common Problems and How to Trace Them to Parts Quality',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'post-install QC — parts-quality vs install error',
    target_keyword_theme: 'charging port failure after replacement',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-charging-port-replacement-guide',
    notes: 'Post-install angle — distinct.',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'charging-port',
    slug: 'samsung-a-series-charging-port-failure-after-replacement',
    title: 'Why Samsung Galaxy A-Series Charging Ports Keep Failing After Replacement',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'Samsung A-series specific failure patterns',
    target_keyword_theme: 'samsung galaxy a charging port failure',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'iphone-charging-port-replacement-guide',
    notes: 'Brand-specific — not competing with iPhone cluster.',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'charging-port',
    slug: 'how-to-choose-charging-ports-bulk-repair-orders',
    title: 'Wholesale Charging Port Assemblies: How Repair Shops Pick Bulk Orders',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'wholesale bulk-order assembly selection',
    target_keyword_theme: 'wholesale charging port bulk / assembly',
    recommended_action: 'retitle',
    target_pillar_slug: 'iphone-charging-port-replacement-guide',
    notes:
      'Retitled to foreground "Wholesale ... Assemblies" and separate from the flex-cable article.',
    round: 'P5',
    status_this_round: 'applied',
  },
  {
    cluster: 'charging-port',
    slug: 'how-choose-charging-port-flex-cables-bulk-repair-orders',
    title: 'Charging Port Flex Cables Wholesale: Defect Patterns and Buyer\'s Quality Checklist',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'flex-cable specific defect patterns + QC',
    target_keyword_theme: 'charging port flex cable wholesale / quality',
    recommended_action: 'retitle',
    target_pillar_slug: 'iphone-charging-port-replacement-guide',
    notes:
      'Retitled to foreground "Flex Cables Wholesale" and separate from whole-assembly article.',
    round: 'P5',
    status_this_round: 'applied',
  },
  {
    cluster: 'charging-port',
    slug: 'combine-batteries-charging-ports-small-parts-one-repair-order',
    title: 'How to Combine Batteries, Charging Ports, and Small Parts in One Repair Order',
    current_category: 'industry-insights',
    recommended_role: 'distinct-intent',
    primary_intent: 'wholesale order structure (cross-cluster — belongs to wholesale buyer hub)',
    target_keyword_theme: 'combine wholesale phone parts order',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'Cross-cluster — logically belongs to the wholesale-buying cluster, not the charging-port cluster. No retitle needed.',
    round: 'P5',
    status_this_round: 'no-action-needed',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P5 — Battery-buyer sub-cluster final sweep
  // One remaining retitle for `common-iphone-battery-quality-problems-…`
  // which shared the generic "Common iPhone Battery ... Wholesale Buyers"
  // pattern with the pillar and sibling checklist pages.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'battery-buyer',
    slug: 'common-iphone-battery-quality-problems-wholesale-buyers-check',
    title:
      'iPhone Battery Quality Red Flags: What Wholesale Buyers Must Inspect Before Ordering',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'red-flag inspection — distinct from generic buyer checklist',
    target_keyword_theme: 'iphone battery quality red flags / wholesale qc',
    recommended_action: 'retitle',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'Retitled to lead with "Quality Red Flags" so this no longer competes with the generic pillar checklist. Supporting page focuses on concrete failure patterns buyers should screen for.',
    round: 'P5',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P6 (2026-04-22)
  // Cluster 8 — Samsung screen (wholesale / model repair / UK region)
  // Two pillars coexist: wholesale-buyer pillar + flagship model repair
  // pillar. Distinct enough on intent; one retitle to separate A-series
  // brand-comparison page from the A-series stocking pillar.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'samsung-screen',
    slug: 'wholesale-samsung-screens-guide',
    title: 'Wholesale Samsung Screens: AMOLED Grades, Pricing, and What to Stock',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'wholesale-buyer pillar for Samsung screens — AMOLED grades + stocking',
    target_keyword_theme: 'wholesale samsung screens / amoled grades',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Top-of-funnel B2B pillar. Title already leads with "Wholesale Samsung Screens" — no retitle needed.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-s23-s24-screen-replacement-guide',
    title: 'Samsung Galaxy S23/S24 Screen Replacement: Cost, Grades, and Repair Margins',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'flagship model repair pillar — S23 and S24',
    target_keyword_theme: 'samsung s23 s24 screen replacement',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Multi-model flagship pillar. Keep separate from wholesale pillar and A-series guides.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-a15-screen-replacement-guide',
    title: 'Samsung Galaxy A15 Screen Replacement: LCD Quality, Cost, and Repair Guide',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'A15 budget model screen repair',
    target_keyword_theme: 'samsung a15 screen replacement',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'samsung-s23-s24-screen-replacement-guide',
    notes: 'Budget A-series model — distinct from flagship pillar.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-galaxy-s24-screen-replacement-uk',
    title: 'Samsung Galaxy S24 Screen Replacement UK: Why the £75 Screen That Kills Your Fingerprint Sensor Costs You £225',
    current_category: 'repair-guides',
    recommended_role: 'supporting',
    primary_intent: 'UK region + ultrasonic fingerprint sensor callback angle',
    target_keyword_theme: 'samsung s24 screen replacement uk / fingerprint sensor',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'samsung-s23-s24-screen-replacement-guide',
    notes:
      'Title already front-loads the unique fingerprint-sensor angle — clearly differentiated from the global S23/S24 pillar.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-galaxy-z-flip-fold-inner-screen-replacement-guide',
    title: 'Galaxy Z Flip & Z Fold Screen Replacement: What Repair Shops Need to Know',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'foldable (Z Flip / Z Fold) inner-screen repair — unique intent',
    target_keyword_theme: 'galaxy z flip fold screen replacement',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'samsung-s23-s24-screen-replacement-guide',
    notes: 'Foldable is a genuinely separate repair category. Keep.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-a-series-repair-parts-stock-guide',
    title: 'Samsung A-Series Repair Parts: What Small Buyers Should Stock First',
    current_category: 'industry-insights',
    recommended_role: 'pillar',
    primary_intent: 'A-series stocking pillar — cross-cluster (screens + batteries + small parts)',
    target_keyword_theme: 'samsung a-series parts stock',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Cross-cluster stocking pillar. Covers more than screens (batteries + small parts too). Kept separate from `wholesale-samsung-screens-guide` (that one is screens-only).',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'samsung-screen',
    slug: 'samsung-a-series-vs-iphone-parts-stock-first',
    title: 'Samsung vs iPhone Parts: Which Brand to Stock First as a Small Buyer',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'brand-level stocking comparison (Samsung vs iPhone)',
    target_keyword_theme: 'samsung vs iphone parts stock / brand priority',
    recommended_action: 'retitle',
    target_pillar_slug: 'samsung-a-series-repair-parts-stock-guide',
    notes:
      'Retitled to drop the A-Series prefix and lead with the brand comparison framing — now clearly differentiated from `samsung-a-series-repair-parts-stock-guide` which is Samsung-internal.',
    round: 'P6',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P6 — Cluster 9 — Back-glass / housing
  // Small but clean cluster: 1 pillar, 1 cannibalization-risk (already
  // canonical-pointed in P4), 1 distinct-intent troubleshooting page.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'back-glass',
    slug: 'back-glass-replacement-iphone-guide',
    title: 'Back Glass Replacement iPhone: Cost, Methods, and Best Parts to Use',
    current_category: 'repair-guides',
    recommended_role: 'pillar',
    primary_intent: 'iPhone back-glass repair pillar — cost, laser/housing methods, parts',
    target_keyword_theme: 'back glass replacement iphone',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Single pillar for the back-glass topic. Already canonical target for the iPhone 14 Pro Max variant (set in P4).',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'back-glass',
    slug: 'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners',
    title:
      "iPhone 14 Pro Max Back Glass Repair Cost: When It's Worth Fixing for Repair Shops",
    current_category: 'repair-guides',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'iPhone 14 Pro Max cost-benefit — overlaps pillar',
    target_keyword_theme: 'iphone 14 pro max back glass cost',
    recommended_action: 'retitle',
    target_pillar_slug: 'back-glass-replacement-iphone-guide',
    notes:
      'Canonical already points to pillar (set in P4). Retitled the H1 in P6 so users who still land here see a readable headline. Still in 301 observation queue.',
    round: 'P6',
    status_this_round: 'observation-pending',
  },
  {
    cluster: 'back-glass',
    slug: 'iphone-housing-swap-nfc-apple-pay-troubleshooting',
    title:
      'After iPhone Housing Swap: NFC & Apple Pay Not Working — Complete Fix Guide',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'post-housing-swap NFC/Apple Pay troubleshooting — distinct fault angle',
    target_keyword_theme: 'iphone housing swap nfc apple pay fix',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'back-glass-replacement-iphone-guide',
    notes:
      'Troubleshooting angle is clearly distinct from repair-cost pillar. Keep standalone.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P6 — Cluster 10 (initial scoping) — Small parts
  // Pillar identified. No retitles this round. Subject to deeper treatment
  // in a future round if SERP cannibalization shows up in GSC.
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'small-parts',
    slug: 'small-repair-parts-quality-guide',
    title:
      'Small Repair Parts Explained: Earpiece, Speaker, Camera Lens, and Flex Cable Quality Guide',
    current_category: 'parts-knowledge',
    recommended_role: 'pillar',
    primary_intent: 'small-parts quality pillar — covers earpiece / speaker / camera / flex',
    target_keyword_theme: 'phone small parts quality / earpiece speaker camera flex',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Initial cluster scoping. Declared as pillar. Sub-clusters may emerge (camera-specific, flex-cable-specific) if content grows — revisit next round.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'small-parts',
    slug: 'which-small-phone-parts-create-most-repeat-demand-repair-shops',
    title:
      'Which Small Phone Parts Create the Most Repeat Demand for Repair Shops',
    current_category: 'industry-insights',
    recommended_role: 'supporting',
    primary_intent: 'demand/volume ranking for small parts (earpiece / speaker / camera / flex)',
    target_keyword_theme: 'small phone parts repeat demand / reorder',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'small-repair-parts-quality-guide',
    notes:
      'Narrow scope (small parts only). Distinct from `which-repair-parts-bring-most-repeat-orders` which covers screens/batteries/charging too.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'small-parts',
    slug: 'camera-not-working-after-iphone-screen-replacement',
    title:
      'Camera Not Working After iPhone Screen Replacement: The 7 Real Causes (and Fixes)',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'post-install camera fault — cross-reference with screen-replacement cluster',
    target_keyword_theme: 'camera not working after iphone screen replacement',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'small-repair-parts-quality-guide',
    notes:
      'Could form a camera sub-cluster with `iphone-pro-camera-dust-removal-and-prevention` if more articles added. Keep standalone for now.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'small-parts',
    slug: 'iphone-pro-camera-dust-removal-and-prevention',
    title:
      'iPhone Pro Camera Dust: DIY Cleaning, Module Replacement & Why It Keeps Happening',
    current_category: 'repair-guides',
    recommended_role: 'distinct-intent',
    primary_intent: 'camera dust diagnostic + prevention',
    target_keyword_theme: 'iphone pro camera dust / cleaning',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'small-repair-parts-quality-guide',
    notes: 'Distinct intent (dust/cleaning). Keep.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },
  {
    cluster: 'small-parts',
    slug: 'why-third-party-lightning-cables-burn-pin-4',
    title: 'Why Third-Party Lightning Cables Burn Out: The Pin 4 Mystery Explained',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'Lightning cable defect analysis — unique deep-technical angle',
    target_keyword_theme: 'lightning cable pin 4 burn / third party cable defect',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'small-repair-parts-quality-guide',
    notes: 'Unique cable-specific topic. Keep.',
    round: 'P6',
    status_this_round: 'no-action-needed',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Round P7 (2026-04-22) — slug-rename housekeeping
  // ═════════════════════════════════════════════════════════════════════
  {
    cluster: 'battery',
    slug: 'iphone-battery-wholesale-sourcing-guide-shenzhen',
    title: 'iPhone Battery Wholesale Sourcing Guide 2026: Factory Direct from Shenzhen',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'factory-direct sourcing (Shenzhen)',
    target_keyword_theme: 'iphone battery wholesale sourcing / factory direct',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    notes:
      'Slug-rename housekeeping in P7. Renamed in Supabase from `2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen` to drop the year prefix. Old slug 301-ed in next.config.js. meta.canonical updated to new URL.',
    round: 'P7',
    status_this_round: 'applied',
  },

  // ═════════════════════════════════════════════════════════════════════
  // Cluster — wholesaler-verify-sourcing (P8, 2026-04-25)
  //
  // Identified via GSC analysis: 27 articles overlap on "how to vet/verify
  // wholesale phone parts suppliers" intent. Top variants pulled 128+ combined
  // impressions over 90 days at ranks 4-7 with 0 CTR — biggest validated
  // long-tail opportunity in the site, but currently fragmented.
  //
  // Pillar choice: `how-to-choose-phone-parts-supplier` (87 imp / pos 4.3 /
  // already indexed / quality 8/10). Strongest organic signal in the cluster.
  //
  // Secondary pillar (kept temporarily): `trustworthy-wholesale-phone-parts-
  // suppliers-qc` is a P7 redirect target. Do NOT 301 it now — would create a
  // chain (`how-can-you-find-trustworthy...` → `trustworthy-wholesale-...` →
  // `how-to-choose-...`). Re-evaluate after 6 weeks: if `trustworthy-wholesale`
  // accumulates no signal, fold it into `how-to-choose` and rewrite the P7
  // redirect to point directly at `how-to-choose`.
  //
  // Status disclaimer: 4 articles read in detail; remaining 22 classified by
  // slug/GSC desk judgement. Anything below marked `needs-human-review` should
  // be content-read before executing the recommended action.
  // ═════════════════════════════════════════════════════════════════════

  // --- Pillar ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'how-to-choose-phone-parts-supplier',
    title: 'How to Choose a Reliable Phone Parts Supplier: 10 Questions Every Buyer Should Ask',
    current_category: 'sourcing-suppliers',
    recommended_role: 'pillar',
    primary_intent: 'broad supplier vetting framework — 10 questions + ROI math + scorecard',
    target_keyword_theme: 'how to choose phone parts supplier / verify wholesaler',
    recommended_action: 'keep-as-pillar',
    target_pillar_slug: null,
    notes:
      'Strongest organic signal in cluster (87 imp, pos 4.3). 2,800-word body with defect-rate math, weighted scorecard, and red-flags section — pillar-quality content. Anchor for cluster.',
    round: 'P8',
    status_this_round: 'applied',
  },
  // --- Secondary pillar (observation) ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'trustworthy-wholesale-phone-parts-suppliers-qc',
    title: 'Trustworthy Wholesale Phone Parts Suppliers: Complete QC Guide',
    current_category: 'sourcing-suppliers',
    recommended_role: 'distinct-intent',
    primary_intent: 'P7 redirect target — overlaps `how-to-choose-...` but kept to avoid chain',
    target_keyword_theme: 'trustworthy wholesale phone parts suppliers',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'P7 created this as the 301 target for `how-can-you-find-trustworthy-wholesale-suppliers-...` (185 imp). Body overlaps `how-to-choose-...` heavily (4,200 vs 2,800 words, same intent). 301-ing it now would create a chain. Observe 6 weeks; if no signal accumulates, fold into `how-to-choose-...` and rewrite P7 redirect direct.',
    round: 'P8',
    status_this_round: 'observation-pending',
  },

  // --- Supporting (kept — distinct angle) ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'how-repair-shops-should-use-technical-questions-to-screen-suppliers',
    title: 'How Repair Shops Should Use Technical Questions to Screen Suppliers',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: '10 specific technical questions (IC chip names, defect rates, voltage) — distinct from generic 10-questions framework',
    target_keyword_theme: 'technical questions to screen phone parts supplier',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'Truly distinct angle (specific IC/nit/voltage questions vs generic vetting). 8/10 quality. Keep as supporting; ensure internal link from pillar.',
    round: 'P8',
    status_this_round: 'applied',
  },

  // --- Cannibalization-risk → recommend-301 to pillar ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'best-cell-phone-parts-supplier-checklist-2025',
    title: 'Best Cell Phone Parts Supplier Checklist - Quality & Reliability Guide',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: '2025 supplier evaluation checklist — overlaps pillar significantly',
    target_keyword_theme: 'best cell phone parts supplier checklist',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      '2,100-word checklist with weighted scorecard — same shape as pillar without unique data. discovered_not_crawled by GSC. Set canonical to pillar; observe 4-6 weeks before hard 301.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'cell-phone-parts-wholesale-sourcing-guide',
    title: 'Cell Phone Parts Wholesale Sourcing Guide',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'generic wholesale sourcing overview — needs-human-review',
    target_keyword_theme: 'cell phone parts wholesale sourcing',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Sample read in earlier audit (4,200 words, mid AI-feel, generic sourcing buyer journey). Canonical to pillar. needs-human-review before hard 301.',
    round: 'P8',
    status_this_round: 'code-only',
  },

  // --- Sub-intent: verification / anti-fraud (keep both — distinct from generic vetting) ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'spot-fake-phone-screens',
    title: 'How to Spot Fake Phone Screens',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'product-level fake detection (visual / functional tests on a screen) — not the same as supplier-level vetting',
    target_keyword_theme: 'spot fake phone screens / fake screen detection',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Sub-intent is product-inspection (after part arrives), not supplier-vetting (before order). Keep distinct. needs-human-review of body to confirm it actually delivers product-level guidance vs generic.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'how-to-verify-original-phone-screens-without-trusting-supplier-labels',
    title: 'How to Verify Original Phone Screens Without Trusting Supplier Labels',
    current_category: 'parts-knowledge',
    recommended_role: 'distinct-intent',
    primary_intent: 'physical verification of "original" claims — overlap with `spot-fake-phone-screens` likely high',
    target_keyword_theme: 'verify original phone screen / supplier label trust',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'spot-fake-phone-screens',
    notes:
      'discovered_not_crawled. Title overlap with `spot-fake-phone-screens` is heavy. Pick one as the verification-anti-fraud pillar; canonical the other. needs-human-review which has stronger body content.',
    round: 'P8',
    status_this_round: 'code-only',
  },

  // --- Sub-intent: first order / test order / MOQ ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'test-order-evaluate-phone-parts-supplier',
    title: 'Test Order: How to Evaluate a Phone Parts Supplier Before Bulk',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'test-order workflow — plausibly distinct from generic vetting',
    target_keyword_theme: 'test order phone parts supplier',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Test-order angle is a specific tactical step — could be a useful satellite. needs-human-review to confirm body delivers tactical detail.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'moq-sample-orders-lead-time-wholesale',
    title: 'MOQ, Sample Orders, and Lead Time in Phone Parts Wholesale',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'MOQ + sample + lead time mechanics — distinct tactical topic',
    target_keyword_theme: 'phone parts wholesale moq sample lead time',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. MOQ/lead-time is its own searchable topic — keep as supporting. needs-human-review.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'first-wholesale-order-templates-repair-shop',
    title: 'First Wholesale Order Templates for Repair Shops',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'first-order templates — overlaps `test-order-evaluate-phone-parts-supplier`',
    target_keyword_theme: 'first wholesale order template repair shop',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'test-order-evaluate-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Sub-cluster overlap with `test-order-...`. Canonical to that as sub-pillar; observe.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'how-repair-shops-should-structure-the-first-real-order-after-a-test-order',
    title: 'How Repair Shops Should Structure the First Real Order After a Test Order',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'transition from test-order to first real order',
    target_keyword_theme: 'first real order after test order phone parts',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'test-order-evaluate-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Direct sequel to `test-order-...`. Better consolidated than fragmented. needs-human-review.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'prepare-mixed-order-list-before-contacting-supplier',
    title: 'Prepare a Mixed-Order List Before Contacting a Phone Parts Supplier',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'order-preparation tactic — narrow, low standalone signal expected',
    target_keyword_theme: 'mixed order list phone parts supplier',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Narrow tactical post — better as a section in pillar. Canonical now; observe.',
    round: 'P8',
    status_this_round: 'code-only',
  },

  // --- Sub-intent: supplier management (DOA / dispute / delays / relationship) ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'doa-parts-policy-repair-shop-checklist',
    title: 'DOA Parts Policy: Repair Shop Checklist',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'dead-on-arrival parts policy — distinct operational topic',
    target_keyword_theme: 'doa parts policy / phone parts return',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. DOA policy is a real operational topic — keep. needs-human-review.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'phone-parts-dispute-resolution',
    title: 'Phone Parts Dispute Resolution',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'dispute handling with supplier — distinct operational topic',
    target_keyword_theme: 'phone parts dispute resolution / supplier conflict',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Dispute resolution is a real operational topic. Keep. needs-human-review for overlap with `doa-parts-policy-...`.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'phone-parts-supplier-delays',
    title: 'Phone Parts Supplier Delays',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'supplier delay handling — likely overlaps with dispute / relationship articles',
    target_keyword_theme: 'phone parts supplier delays / lead time issues',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'indexed_no_traffic. Narrow topic, better as section in pillar or dispute article. Canonical; observe.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'phone-parts-supplier-relationship',
    title: 'Phone Parts Supplier Relationship',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'long-term supplier relationship management — generic',
    target_keyword_theme: 'phone parts supplier relationship',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Generic relationship-management framing — likely AI-template. Canonical; observe; lean toward 301 if review confirms no unique value.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'check-before-repeat-order-phone-parts-supplier',
    title: 'Check Before Repeat Order: Phone Parts Supplier',
    current_category: 'sourcing-suppliers',
    recommended_role: 'cannibalization-risk',
    primary_intent: 'reorder QC checklist — narrow',
    target_keyword_theme: 'check before reorder phone parts',
    recommended_action: 'canonical-to-pillar',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Narrow tactical post about repeat orders. Canonical to pillar.',
    round: 'P8',
    status_this_round: 'code-only',
  },

  // --- Sub-intent: geographic sourcing (China / UK / Huaqiangbei) ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'huaqiangbei-vs-online-sourcing',
    title: 'Huaqiangbei vs Online Sourcing for Phone Parts',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'Huaqiangbei market vs online platforms (Alibaba/AliExpress)',
    target_keyword_theme: 'huaqiangbei vs online sourcing phone parts',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Geographic angle is searchable and distinct. PRSPARES has authentic Huaqiangbei perspective — opportunity to add real first-hand data. Keep + UPGRADE candidate.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'china-phone-parts-suppliers-quality-vs-cost',
    title: 'China Phone Parts Suppliers: Quality vs Cost Trade-offs',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'China-specific quality/cost trade-off framing',
    target_keyword_theme: 'china phone parts suppliers quality vs cost',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'indexed_no_traffic. P7 already 301-ed the long-form variant `are-chinese-phone-parts-suppliers-really-worth-the-risk-...` to this. Keep. UPGRADE candidate (Shenzhen first-hand data).',
    round: 'P8',
    status_this_round: 'applied',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'paying-china-phone-parts-supplier',
    title: 'Paying a China Phone Parts Supplier (T/T, Alipay, Trade Assurance)',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'payment methods + trade assurance — narrow but searchable',
    target_keyword_theme: 'pay china phone parts supplier / T/T alipay',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Payment-mechanics is a real searchable topic for first-time China buyers. Keep.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'local-supplier-vs-china-direct-when-paying-more-saves-money',
    title: 'Local Supplier vs China Direct: When Paying More Saves Money',
    current_category: 'sourcing-suppliers',
    recommended_role: 'distinct-intent',
    primary_intent: 'local vs China decision framework — counter-intuitive angle',
    target_keyword_theme: 'local supplier vs china direct phone parts',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. Counter-intuitive framing ("when paying more saves money") — distinct angle. Keep.',
    round: 'P8',
    status_this_round: 'code-only',
  },
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'wholesale-phone-parts-supplier-uk',
    title: 'Wholesale Phone Parts Supplier in the UK',
    current_category: 'sourcing-suppliers',
    recommended_role: 'supporting',
    primary_intent: 'UK-specific sourcing — important for UK GSC traffic surge in Mar-Apr',
    target_keyword_theme: 'wholesale phone parts supplier uk',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'discovered_not_crawled. UK angle is timely (UK queries are PRSPARES top non-brand impressions in 28d). UPGRADE candidate — add real UK shipping/VAT/import data.',
    round: 'P8',
    status_this_round: 'code-only',
  },

  // --- Sub-intent: risk management ---
  {
    cluster: 'wholesaler-verify-sourcing',
    slug: 'why-risk-your-business-on-single-source-display-suppliers',
    title: 'Why Risk Your Business on Single-Source Display Suppliers?',
    current_category: 'sourcing-suppliers',
    recommended_role: 'distinct-intent',
    primary_intent: 'single-source vs multi-source supplier risk',
    target_keyword_theme: 'single-source supplier risk / supplier diversification',
    recommended_action: 'keep-as-supporting',
    target_pillar_slug: 'how-to-choose-phone-parts-supplier',
    notes:
      'indexed_no_traffic. Already in `blog-301-candidates.ts` as observe_longer (canonical-to-pillar set). Distinct angle (diversification). Pillar should add a "single-source vs multi-source" section before considering 301.',
    round: 'P8',
    status_this_round: 'observation-pending',
  },
];

export const PILLAR_BY_CLUSTER: Record<string, string> = CONTENT_DECISIONS.filter(
  (d) => d.recommended_role === 'pillar',
).reduce((acc, d) => {
  acc[d.cluster] = d.slug;
  return acc;
}, {} as Record<string, string>);

/**
 * Posts that currently have `canonical_to_pillar` or `recommend-301`.
 * Useful if a future task wants to auto-generate redirect maps or link chips.
 */
export const CANONICAL_OVERRIDES: Record<string, string> = Object.fromEntries(
  CONTENT_DECISIONS.filter(
    (d) => d.recommended_action === 'canonical-to-pillar' && d.target_pillar_slug,
  ).map((d) => [d.slug, d.target_pillar_slug as string]),
);
