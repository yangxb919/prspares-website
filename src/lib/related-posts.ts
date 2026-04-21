export interface CandidatePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  meta?: { cover_image?: string } | null;
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
 */
export function pickRelatedByTitle<T extends CandidatePost>(
  currentTitle: string,
  candidates: T[],
  n = 3
): T[] {
  if (!candidates || candidates.length === 0) return [];
  const currentKws = tokenize(currentTitle);

  const scored = candidates.map((c) => ({
    post: c,
    score: jaccard(currentKws, tokenize(c.title)),
  }));

  // Primary: sort by similarity desc, then by recency
  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    const xt = x.post.published_at ? new Date(x.post.published_at).getTime() : 0;
    const yt = y.post.published_at ? new Date(y.post.published_at).getTime() : 0;
    return yt - xt;
  });

  // Require at least one shared keyword for similarity match; fall back to newest
  const withOverlap = scored.filter((s) => s.score > 0).slice(0, n);
  if (withOverlap.length === n) return withOverlap.map((s) => s.post);

  const fillCount = n - withOverlap.length;
  const taken = new Set(withOverlap.map((s) => s.post.id));
  const fillers = scored
    .filter((s) => !taken.has(s.post.id))
    .slice(0, fillCount)
    .map((s) => s.post);

  return [...withOverlap.map((s) => s.post), ...fillers];
}
