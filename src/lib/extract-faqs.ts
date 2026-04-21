export interface FAQ {
  q: string;
  a: string;
}

/**
 * Extract FAQ Q&A pairs from a markdown article.
 *
 * Recognises sections whose heading matches /FAQ|Frequently Asked|Common Questions|Q&A|Questions and Answers/
 * and pulls H3/H4 questions with their paragraph answers, or **Q:** / **A:** bold pairs as a fallback.
 *
 * Returns at most 10 FAQs, each answer trimmed to 500 chars (FAQPage schema best-practice).
 */
export function extractFAQs(content: string | null | undefined): FAQ[] {
  if (!content) return [];
  const faqs: FAQ[] = [];

  const faqHeaderRe =
    /^#{2,3}\s+(FAQ|F\.A\.Q\.|Frequently Asked Questions?|Common Questions|Q\s*&\s*A|Questions?\s+and\s+Answers?)\s*$/im;
  const header = content.match(faqHeaderRe);
  if (!header) return [];

  const startIdx = content.indexOf(header[0]) + header[0].length;
  const afterSection = content.slice(startIdx);
  // Use exec().index so we get the true match position (not a substring
  // occurrence — "## " is a substring of "### " and indexOf would find the
  // wrong spot).
  const nextH2Re = /^(#{1,2})(?!#)\s+(?!.*(FAQ|Question))/m;
  const nextH2Match = nextH2Re.exec(afterSection);
  const faqBlock = nextH2Match
    ? afterSection.slice(0, nextH2Match.index)
    : afterSection;

  // Primary pattern: H3/H4 question followed by paragraph answer
  const qaRe = /(?:^|\n)#{3,4}\s+(.+?)\n+([\s\S]+?)(?=\n#{3,4}|\n#{1,2}\s|$)/gm;
  let m: RegExpExecArray | null;
  while ((m = qaRe.exec(faqBlock)) !== null) {
    const q = m[1]
      .trim()
      .replace(/^\d+\.\s*/, '')
      .replace(/^[QA]\d*:?\s*/i, '');
    const a = m[2]
      .trim()
      .replace(/^\*\*A:?\*\*\s*/i, '')
      .replace(/^[Aa]nswer:?\s*/, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 500);
    if (q && a && q.length > 5 && a.length > 20) faqs.push({ q, a });
    if (faqs.length >= 10) break;
  }

  // Fallback: bold Q/A pairs
  if (faqs.length === 0) {
    const boldRe = /\*\*Q\d*:?\s*(.+?)\*\*\s*([\s\S]+?)(?=\*\*Q\d*:?|$)/g;
    while ((m = boldRe.exec(faqBlock)) !== null) {
      const q = m[1].trim();
      const a = m[2]
        .trim()
        .replace(/^\*\*A:?\*\*\s*/i, '')
        .replace(/\n{2,}/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 500);
      if (q && a && a.length > 20) faqs.push({ q, a });
      if (faqs.length >= 10) break;
    }
  }

  return faqs;
}

export function buildFaqSchema(faqs: FAQ[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
