/**
 * Resolve the best description string for a blog post across callsites that
 * render preview cards, related-posts cards, and OG/Twitter metadata.
 *
 * Priority (first non-empty wins):
 *   1. meta.seo.description       — authored SEO description (English, B2B-tuned)
 *   2. meta.open_graph.description — social-share override if editor set it
 *   3. excerpt                    — legacy per-post excerpt column (may be any language)
 *   4. contentFallback            — caller-supplied fallback (e.g. first 150 chars of body)
 *
 * WHY: some legacy posts have Chinese excerpts but English meta.seo.description.
 * Previously list/related cards used excerpt directly, so English surfaces
 * leaked Chinese snippets. This resolver centralises the preference so we fix
 * it once instead of per-template.
 */
export interface DescriptionSource {
  seo?: { description?: string | null } | null;
  open_graph?: { description?: string | null } | null;
  [key: string]: any;
}

export function pickPostDescription(
  meta: DescriptionSource | null | undefined,
  excerpt?: string | null,
  contentFallback?: string | null,
): string {
  const candidates: Array<string | null | undefined> = [
    meta?.seo?.description,
    meta?.open_graph?.description,
    excerpt,
    contentFallback,
  ];
  for (const c of candidates) {
    if (typeof c === 'string') {
      const trimmed = c.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return '';
}
