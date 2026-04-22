export interface CandidatePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  meta?: { cover_image?: string; category?: string } | null;
}

const STOPWORDS = new Set([
  'the','a','an','is','are','for','of','on','in','and','or','to','with','by','from',
  'how','why','what','which','when','where','can','your','my','our','does','do',
  'this','that','these','those','worth','guide','complete','vs','vs.','all','any',
  'its','it','as','be','you','we','they','he','she','but','not','no','yes','so',
  'more','most','less','least','other','many','much','some','few',
  'lesson','real','best','great','good','bad','new','old',
  '2022','2023','2024','2025','2026','2027',
]);

function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

/**
 * Pick the N posts whose titles share the most keyword overlap with `current`.
 * Falls back to the newest `n` candidates if no similarity signal is found.
 *
 * When `currentCategory` is provided, same-category candidates get a 1.5x score
 * boost so the cluster/hub a post belongs to dominates the recommendation,
 * while cross-category overlap still wins when the keyword match is strong.
 */
export function pickRelatedByTitle<T extends CandidatePost>(
  currentTitle: string,
  candidates: T[],
  n = 3,
  currentCategory?: string | null,
): T[] {
  if (!candidates || candidates.length === 0) return [];
  const currentKws = tokenize(currentTitle);
  const curCat = currentCategory ? String(currentCategory).trim() : '';

  const scored = candidates.map((c) => {
    const base = jaccard(currentKws, tokenize(c.title));
    const sameCat =
      curCat && c.meta?.category && String(c.meta.category).trim() === curCat;
    return {
      post: c,
      score: sameCat ? base * 1.5 : base,
      sameCat: !!sameCat,
    };
  });

  // Primary: sort by similarity desc, then same-category first, then recency
  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    if (x.sameCat !== y.sameCat) return x.sameCat ? -1 : 1;
    const xt = x.post.published_at ? new Date(x.post.published_at).getTime() : 0;
    const yt = y.post.published_at ? new Date(y.post.published_at).getTime() : 0;
    return yt - xt;
  });

  // Require at least one shared keyword for similarity match; fall back to newest
  const withOverlap = scored.filter((s) => s.score > 0).slice(0, n);
  if (withOverlap.length === n) return withOverlap.map((s) => s.post);

  const fillCount = n - withOverlap.length;
  const taken = new Set(withOverlap.map((s) => s.post.id));

  // Fallback fillers: prefer same-category first, then recency
  const fillers = scored
    .filter((s) => !taken.has(s.post.id))
    .sort((x, y) => {
      if (x.sameCat !== y.sameCat) return x.sameCat ? -1 : 1;
      const xt = x.post.published_at
        ? new Date(x.post.published_at).getTime()
        : 0;
      const yt = y.post.published_at
        ? new Date(y.post.published_at).getTime()
        : 0;
      return yt - xt;
    })
    .slice(0, fillCount)
    .map((s) => s.post);

  return [...withOverlap.map((s) => s.post), ...fillers];
}
