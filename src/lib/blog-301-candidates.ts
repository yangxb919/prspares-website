/**
 * PRSPARES Blog — 301 Candidates Tracker
 *
 * Lifecycle of a candidate:
 *
 *   canonical-to-pillar applied  →  observe_longer
 *      ↓ (content review confirms no salvageable unique value)
 *   ready_for_301
 *      ↓ (redirect added to next.config.js, ship to prod)
 *   executed   (entry stays here for audit history)
 *
 *   alternative path:
 *     observe_longer → do_not_301  (page found to have unique intent;
 *                                   should be retitled or self-canonicalled
 *                                   instead of merged)
 *
 * How to use this list:
 *   - "ready_for_301" entries → already in next.config.js redirects().
 *   - "observe_longer" entries → still canonical-pointed at pillar; revisit
 *      around the recheck_after date with GSC + backlink audit.
 *   - "do_not_301" entries → restore self-canonical, leave content alone.
 *
 * Do NOT 301 a page before verifying that pillar is consolidating its
 * impressions for the contested queries — premature 301 also drops the
 * pillar's ranking.
 */

export type CandidateStatus =
  | 'observe_longer'
  | 'ready_for_301'
  | 'do_not_301'
  | 'executed';

export interface Candidate301 {
  from_slug: string;
  current_title: string;
  to_pillar_slug: string;
  why_recommended_for_301: string;
  prerequisite_before_301: string;
  suggested_observation_window: string;
  /** ISO date (YYYY-MM-DD) when canonical-to-pillar was set. */
  canonical_applied_on: string;
  /** ISO date (YYYY-MM-DD) when the team should re-check this candidate. */
  recheck_after: string;
  /** Current lifecycle state. */
  status: CandidateStatus;
  /** Why this status was chosen on the most recent review. */
  decision_reason: string;
  /** ISO date (YYYY-MM-DD) of the most recent review that set `status`. */
  review_date: string;
  /** What the team should do next, in plain English. */
  next_action: string;
}

export const CANDIDATES_301: Candidate301[] = [
  // ═════════════════════════════════════════════════════════════════════
  // ready_for_301 — graduated to hard 301 in next.config.js (P7, 2026-04-22)
  // ═════════════════════════════════════════════════════════════════════
  {
    from_slug: 'whats-the-real-difference-between-oled-and-lcd-phone-screens',
    current_title: "What's the Real Difference Between OLED and LCD Phone Screens?",
    to_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    why_recommended_for_301:
      'Generic 2025 consumer article (~2,260 words) overlapping the 2,685-word repair-shop OLED/LCD pillar. Same category, no unique technical depth that the pillar lacks. Canonical was already pointing at pillar.',
    prerequisite_before_301:
      'GSC impression check + backlink audit (one-shot, low effort). Pillar covers Hard OLED + Soft OLED in addition to OLED vs LCD generally — strictly more comprehensive than the legacy article.',
    suggested_observation_window: 'observation period bypassed — clear consolidation case',
    canonical_applied_on: '2026-04-21',
    recheck_after: '2026-06-02',
    status: 'ready_for_301',
    decision_reason:
      'Pillar covers everything the legacy page covers, plus repair-shop-specific framing the legacy lacks. No unique anecdote/data flagged for salvage. Hard 301 is strictly an upgrade.',
    review_date: '2026-04-22',
    next_action: 'Redirect added to next.config.js (P7 block); ship with next deploy.',
  },
  {
    from_slug: 'oled-vs-lcd-comparison-guide',
    current_title: 'OLED vs LCD Comparison: The Ultimate Mobile Display Guide',
    to_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    why_recommended_for_301:
      '3,870-word generic technical comparison. Larger word count is bloat (consumer-tone overview), not unique substance. Canonical-to-pillar set in P3.',
    prerequisite_before_301:
      'Same — GSC + backlink check. Pillar serves the actual B2B query intent better.',
    suggested_observation_window: 'observation period bypassed — clear consolidation case',
    canonical_applied_on: '2026-04-21',
    recheck_after: '2026-06-02',
    status: 'ready_for_301',
    decision_reason:
      'Same situation as `whats-the-real-difference-…`. Larger word count does not equal unique value — it is a generic 3000-word overview that the pillar covers more concisely with better intent fit.',
    review_date: '2026-04-22',
    next_action: 'Redirect added to next.config.js (P7 block); ship with next deploy.',
  },
  {
    from_slug: 'substandard-battery-sourcing-certified-repair-shops',
    current_title:
      'Are Substandard Mobile Batteries Killing Your Repair Business? The Complete Guide to Sourcing Certified Mobile Phone Batteries for Professional Success',
    to_pillar_slug: 'buying-iphone-batteries-bulk-repair-business',
    why_recommended_for_301:
      'Legacy 2025 consultant-style article (~2,080 words). The wholesale-buyer pillar (~2,474 words) covers the same buyer-intent with tighter scope. Title is a 25-word ranking liability on its own.',
    prerequisite_before_301:
      'The "certified / safety standards" angle is now covered by `phone-battery-replacement-safety-standards` (added category in P4), so consolidating this one to the buyer pillar does not strand the cert topic.',
    suggested_observation_window: 'observation period bypassed — cert topic now has a separate home',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'ready_for_301',
    decision_reason:
      'Wholesale-buyer intent overlap is high. Cert/safety angle has its own dedicated page now. No reason to keep the legacy URL indexable.',
    review_date: '2026-04-22',
    next_action:
      'Redirect added to next.config.js (P7 block) — also bypasses the long-form redirect at line 132 of next.config.js so we go directly long → pillar without a chain.',
  },
  {
    from_slug: 'oled-vs-lcd-comprehensive-comparison',
    current_title: 'OLED vs LCD: Comprehensive Mobile Display Technology Comparison',
    to_pillar_slug: 'lcd-vs-oled-hard-soft-oled-repair-shops',
    why_recommended_for_301:
      'Generic OLED vs LCD overview duplicating the repair-shop pillar (same body shape as `oled-vs-lcd-comparison-guide` and `whats-the-real-difference-between-oled-and-lcd-phone-screens`, which were already 301-ed in P7). 38 GSC imp / 0 clk over 90 days — 0 unique value vs pillar.',
    prerequisite_before_301:
      'None — same pattern as the other two OLED/LCD generic overviews already merged in P7 (2026-04-22).',
    suggested_observation_window: 'observation period bypassed — clear consolidation case (P7 pattern)',
    canonical_applied_on: '2026-04-25',
    recheck_after: '2026-06-06',
    status: 'ready_for_301',
    decision_reason:
      'P7 follow-up — the third "oled-vs-lcd generic overview" article that should have been swept up with the other two but was missed (different slug naming). Same merge target as the other two.',
    review_date: '2026-04-25',
    next_action: 'Redirect added to next.config.js immediately after the P7 block; ship with next deploy.',
  },
  {
    from_slug: '2025-iphone-battery-wholesale-sourcing-guide-factory-direct-from-shenzhen',
    current_title: 'iPhone Battery Wholesale Sourcing Guide 2026: Factory Direct from Shenzhen',
    to_pillar_slug: 'iphone-battery-wholesale-sourcing-guide-shenzhen',
    why_recommended_for_301:
      'URL housekeeping (slug-rename), not cluster consolidation. Title and meta updated to "2026" in P4; old slug still year-stamped "2025-".',
    prerequisite_before_301:
      'None — same content stays online under the new slug. Pure URL change with 301 to catch old bookmarks.',
    suggested_observation_window: 'no observation needed (URL housekeeping)',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'ready_for_301',
    decision_reason:
      'Slug renamed in Supabase (posts.slug + meta.canonical updated). 301 added in next.config.js to catch the old URL. Idempotent and reversible (backup at /tmp/prspares_p7_slug_rename_backup.json).',
    review_date: '2026-04-22',
    next_action: 'Verify after deploy: hit /blog/2025-… should 301 to /blog/iphone-battery-wholesale-sourcing-guide-shenzhen.',
  },

  // ═════════════════════════════════════════════════════════════════════
  // observe_longer — keep canonical-to-pillar; revisit after window
  // ═════════════════════════════════════════════════════════════════════
  {
    from_slug: 'iphone-15-screen-replacement-cost-quality',
    current_title:
      "iPhone 15 Screen Replacement: The Real Cost, Quality Grades & What Repair Shops Won't Tell You",
    to_pillar_slug: 'iphone-15-screen-replacement',
    why_recommended_for_301:
      'Body overlaps the iPhone 15 screen pillar. Canonical already points to pillar.',
    prerequisite_before_301:
      'Birmingham repair-shop anecdote in body may have unique narrative value. Decide: salvage anecdote into pillar then 301, OR hard 301 if anecdote does not move the needle.',
    suggested_observation_window: '6 weeks from canonical_applied_on (+ content merge window)',
    canonical_applied_on: '2026-04-21',
    recheck_after: '2026-06-02',
    status: 'observe_longer',
    decision_reason:
      'Page sizes are similar (2,283 vs 2,347 words). Birmingham anecdote was specifically called out as potentially salvageable. A hard 301 is premature without the content team confirming the anecdote either was merged or is not worth merging.',
    review_date: '2026-04-22',
    next_action:
      'Content team to read the Birmingham section and decide: (a) merge into pillar then 301, (b) confirm not worth merging then 301, (c) discover unique angle and reposition. Recheck around 2026-06-02.',
  },
  {
    from_slug: 'why-risk-your-business-on-single-source-display-suppliers',
    current_title: 'Why Risk Your Business on Single-Source Display Suppliers?',
    to_pillar_slug: 'how-to-choose-phone-parts-supplier',
    why_recommended_for_301:
      'Supplier-diversification angle is conceptually a subset of the sourcing pillar.',
    prerequisite_before_301:
      'Pillar `how-to-choose-phone-parts-supplier` is "10 questions to ask suppliers" — does not explicitly cover multi-source vs single-source as a strategic decision. Either add a diversification section to pillar before 301, or accept loss of that angle.',
    suggested_observation_window: '4–6 weeks from canonical_applied_on',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'observe_longer',
    decision_reason:
      'Diversification angle is the unique contribution of this page. Pillar does not currently cover it. Hard 301 would lose this topic from the index. Best to add a section to pillar first, then 301.',
    review_date: '2026-04-22',
    next_action:
      'Content team to add a "single-source vs multi-source supplier risk" section (~300-500 words) to the pillar, then 301 this page. If team declines to add the section, downgrade this candidate to do_not_301 and restore self-canonical.',
  },
  {
    from_slug: 'how-do-you-choose-high-quality-screen-replacement-parts-for-your-phone',
    current_title: 'How Do You Choose High-Quality Screen Replacement Parts for Your Phone?',
    to_pillar_slug: 'oem-vs-aftermarket-phone-screens',
    why_recommended_for_301:
      'Consumer-oriented narrative that overlaps the OEM-vs-aftermarket pillar.',
    prerequisite_before_301:
      'Page is 5,410 words — much larger than the 2,620-word pillar. Word count alone suggests potentially salvageable depth (testing methodology, anecdotes). Content review needed before 301.',
    suggested_observation_window: '4–6 weeks from canonical_applied_on',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'observe_longer',
    decision_reason:
      'Promoted from "ready" to "observe" on second review: 5,410-word body is a yellow flag — could be bloat (consumer fluff) but could also contain unique testing methodology that is not in the 2,620-word pillar. Need a human read.',
    review_date: '2026-04-22',
    next_action:
      'Content team to skim body for unique technical sections worth salvaging. If none, 301; if some, salvage then 301. Recheck around 2026-06-03.',
  },
  {
    from_slug:
      'is-your-iphone-14-pro-max-back-glass-worth-fixing-the-complete-cost-benefit-guide-for-repair-shop-owners',
    current_title:
      "iPhone 14 Pro Max Back Glass Repair Cost: When It's Worth Fixing for Repair Shops",
    to_pillar_slug: 'back-glass-replacement-iphone-guide',
    why_recommended_for_301:
      'iPhone 14 Pro Max-specific cost-benefit. Pillar covers all models + methods.',
    prerequisite_before_301:
      'Confirm pillar mentions iPhone 14 Pro Max specifically (model-specific cost data). If not, salvage 1-2 paragraphs before 301.',
    suggested_observation_window: '4–6 weeks from canonical_applied_on',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'observe_longer',
    decision_reason:
      'H1 was shortened in P6 to "iPhone 14 Pro Max Back Glass Repair Cost: When It\'s Worth Fixing for Repair Shops" — page is now usable for direct landings. Risk of premature 301: pillar may not mention "$89 vs $450" Pro Max cost data that this page features.',
    review_date: '2026-04-22',
    next_action:
      'Content team to confirm pillar covers Pro Max cost specifics. Then decide: 301, or keep as model-specific supporting page (in which case downgrade to do_not_301 + restore self-canonical).',
  },
  {
    from_slug:
      'which-iphone-14-pro-max-screen-replacement-option-delivers-the-best-value-for-your-repair-business',
    current_title:
      'Which iPhone 14 Pro Max Screen Replacement Option Delivers the Best Value for Your Repair Business?',
    to_pillar_slug: 'iphone-14-screen-grade-repair-shops',
    why_recommended_for_301:
      'Narrow Pro Max screen-value variant of the iPhone 14 grade decision page.',
    prerequisite_before_301:
      'Confirm grade-decision pillar (`iphone-14-screen-grade-repair-shops`) covers Pro Max specifics; if not, salvage before 301.',
    suggested_observation_window: '4–6 weeks from canonical_applied_on',
    canonical_applied_on: '2026-04-22',
    recheck_after: '2026-06-03',
    status: 'observe_longer',
    decision_reason:
      'Same Pro Max-specific concern as the back-glass variant above. Page sizes are similar (2,659 vs 2,537 words) — neither is a slam-dunk consolidation.',
    review_date: '2026-04-22',
    next_action:
      'Content team to confirm Pro Max coverage in pillar. Same options: salvage + 301, or keep as model-specific supporting (downgrade to do_not_301).',
  },
];

/** Convenience: only the entries currently flagged for hard 301 execution. */
export const READY_FOR_301: Candidate301[] = CANDIDATES_301.filter(
  (c) => c.status === 'ready_for_301',
);
