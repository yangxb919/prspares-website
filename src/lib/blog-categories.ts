/**
 * Single source of truth for blog category hubs.
 *
 * Each entry powers:
 *   - /blog/category/[slug] landing page (SEO metadata, H1, intro, article list)
 *   - "Browse by Topic" cards on /blog
 *   - sitemap entries
 *
 * IMPORTANT: `slug` here is the category slug stored in `posts.meta.category`
 * in Supabase. Do not rename without a matching data migration.
 */

export type BlogCategory = {
  slug: string;
  label: string;       // short name for chips/tabs
  emoji: string;       // for tab/card UI
  title: string;       // <title> tag (55-65 chars)
  description: string; // meta description (140-160 chars)
  h1: string;
  intro: string;       // 2-4 sentence intro paragraph
  card: string;        // short blurb for "Browse by Topic" cards
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'repair-guides',
    label: 'Repair Guides',
    emoji: '🔧',
    title: 'Phone Repair Guides for Repair Shops | PRSPARES',
    description:
      'Step-by-step iPhone and Samsung repair guides: screen replacement, battery swaps, charging ports, and diagnosing common repair callbacks.',
    h1: 'Phone Repair Guides for Repair Shops',
    intro:
      'Hands-on repair walkthroughs written for working technicians. Covers screen replacement by iPhone and Samsung model, battery swaps, charging port rebuilds, and how to diagnose the faults that keep coming back to the bench.',
    card: 'Screen, battery, and charging-port repair walkthroughs by iPhone and Samsung model.',
  },
  {
    slug: 'parts-knowledge',
    label: 'Parts Knowledge',
    emoji: '📱',
    title: 'Phone Screen Grades & Parts Quality Guide | PRSPARES',
    description:
      'Incell vs Hard OLED vs Soft OLED, OEM vs aftermarket screens, iPhone battery specs, and how to spot fake parts before a wholesale order.',
    h1: 'Screen Grades, Parts Quality, and What Actually Differs Between Them',
    intro:
      'Deep dives on screen technologies, battery specs, and parts grading — the questions every wholesale buyer asks before placing the first bulk order. Use these to decide which grades to stock, which to skip, and how to tell real OEM from relabelled aftermarket.',
    card: 'Incell vs OLED, OEM vs aftermarket, battery specs, and how to verify parts quality.',
  },
  {
    slug: 'sourcing-suppliers',
    label: 'Sourcing & Suppliers',
    emoji: '📦',
    title: 'Sourcing Phone Parts from China: Supplier & QC Guide | PRSPARES',
    description:
      'How to evaluate phone parts suppliers, run incoming QC, handle disputes, and source from Huaqiangbei without getting burned on quality or lead time.',
    h1: 'Sourcing, Supplier Evaluation, and QC for Wholesale Buyers',
    intro:
      'Practical sourcing playbooks for repair shops and distributors buying phone parts from China. Supplier vetting questions, incoming QC processes, dispute-resolution scripts, and payment and shipping logistics — written from a Shenzhen factory-direct wholesale view.',
    card: 'Supplier vetting, incoming QC, dispute resolution, payment and shipping from China.',
  },
  {
    slug: 'business-tips',
    label: 'Wholesale Buying',
    emoji: '💼',
    title: 'Wholesale Phone Parts Buying Guide & Order Templates | PRSPARES',
    description:
      'Wholesale order structure, MOQ, freight choices, pricing, and mixed-order templates for repair shops placing their first bulk phone parts orders.',
    h1: 'Wholesale Buying Guides & Order Templates',
    intro:
      'How to structure your first wholesale phone parts order, what MOQ and freight terms mean in practice, and sample order templates for screens, batteries, and small parts. Built for small repair shops moving from retail sourcing to bulk buying.',
    card: 'MOQ, freight, pricing, and mixed-order templates for repair shops going wholesale.',
  },
  {
    slug: 'industry-insights',
    label: 'Shop Operations',
    emoji: '🏭',
    title: 'Phone Repair Shop Operations & Pricing Insights | PRSPARES',
    description:
      'Phone repair pricing, stocking strategy by model, ROI analysis, and operations tips for repair shops, distributors, and sourcing managers.',
    h1: 'Repair Shop Operations, Stocking, and Pricing Insights',
    intro:
      'What to stock, how to price repairs, which iPhone and Samsung models actually earn margin, and how to run a repair shop that does not just react to tickets. Written for shop owners and procurement managers thinking about the P&L, not the bench.',
    card: 'Pricing strategy, model-level ROI, stocking decisions, and shop P&L analysis.',
  },
];

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map((c) => c.slug);

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}
