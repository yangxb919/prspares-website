export interface HowToStep {
  position: number;
  name: string;
  text: string;
  anchor: string;
}

/** Opt-in marker. HowTo schema is only emitted for articles that contain it. */
export const HOWTO_MARKER = '<!-- schema:howto -->';

const STEP_HEADING_RE = /^##\s+Step\s+(\d+)\s*[:.–—-]\s*(.+?)\s*$/i;
const MIN_STEPS = 3;
const MAX_STEPS = 10;

/** Must stay in sync with headingSlug() in src/components/MarkdownRenderer.tsx. */
function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A plain prose paragraph: not an image, list, table, quote, HTML, heading or rule. */
function isProseParagraph(block: string): boolean {
  const first = block.trimStart();
  if (!first) return false;
  return !/^(!\[|[-*+]\s|\d+\.\s|\||>|<|#|---)/.test(first);
}

/**
 * Extract HowTo steps from a markdown article.
 *
 * Only runs when the article contains HOWTO_MARKER. Steps are the consecutive
 * `## Step N: Title` headings that follow the marker, numbered 1..N in order
 * (N between 3 and 10). Each step's text is the first prose paragraph under
 * its heading, so the schema mirrors visible content word for word. Any gap,
 * duplicate, out-of-order number or step without a prose paragraph returns []
 * rather than emitting partial schema.
 */
export function extractHowToSteps(content: string | null | undefined): HowToStep[] {
  if (!content) return [];
  const markerIdx = content.indexOf(HOWTO_MARKER);
  if (markerIdx === -1) return [];

  const lines = content.slice(markerIdx + HOWTO_MARKER.length).split('\n');
  const steps: HowToStep[] = [];
  let current: { position: number; name: string; heading: string; body: string[] } | null = null;
  let inFence = false;

  const flush = (): boolean => {
    if (!current) return true;
    const paragraph = current.body
      .join('\n')
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .find(isProseParagraph);
    if (!paragraph) return false;
    const text = stripInlineMarkdown(paragraph);
    if (text.length < 40) return false;
    steps.push({
      position: current.position,
      name: current.name,
      text,
      anchor: headingSlug(current.heading),
    });
    current = null;
    return true;
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && /^#{1,2}\s/.test(line)) {
      const match = line.match(STEP_HEADING_RE);
      if (!flush()) return [];
      if (!match) break;
      const position = Number(match[1]);
      if (position !== steps.length + 1) return [];
      const heading = line.replace(/^##\s+/, '').trim();
      current = { position, name: stripInlineMarkdown(match[2]), heading: stripInlineMarkdown(heading), body: [] };
      continue;
    }
    if (current) current.body.push(line);
    else if (line.trim() && steps.length === 0) return []; // marker must sit right before Step 1
  }
  if (!flush()) return [];

  return steps.length >= MIN_STEPS && steps.length <= MAX_STEPS ? steps : [];
}

export function buildHowToSchema(params: { name: string; description?: string; url: string; steps: HowToStep[] }) {
  if (!params.steps.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    ...(params.description ? { description: params.description } : {}),
    step: params.steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.position,
      name: s.name,
      text: s.text,
      url: `${params.url}#${s.anchor}`,
    })),
  };
}
