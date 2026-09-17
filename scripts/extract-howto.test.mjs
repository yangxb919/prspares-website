import test from 'node:test';
import assert from 'node:assert/strict';
import { extractHowToSteps, buildHowToSchema, HOWTO_MARKER } from '../src/lib/extract-howto.ts';

const prose = (n) => `Step ${n} prose paragraph that explains exactly what the buyer should do in this step.`;
const article = (headings, { marker = true, between = '' } = {}) =>
  ['# Title', '', 'Intro.', '', marker ? HOWTO_MARKER : '', between, '',
    ...headings.flatMap((h, i) => [`## ${h}`, '', `![img](https://x/y.jpg)`, '', prose(i + 1), '', '### Sub heading', '', 'More text.', '']),
    '## Unrelated Section', '', 'Tail paragraph that is long enough to count as prose for sure.'].join('\n');

test('extracts consecutive marked steps with anchors matching MarkdownRenderer slugs', () => {
  const steps = extractHowToSteps(article(['Step 1: Verify the Business Entity', 'Step 2: Test Pricing, Grades', 'Step 3: Request QC Records']));
  assert.equal(steps.length, 3);
  assert.deepEqual(steps.map((s) => s.anchor), ['step-1-verify-the-business-entity', 'step-2-test-pricing-grades', 'step-3-request-qc-records']);
  assert.equal(steps[0].name, 'Verify the Business Entity');
  assert.equal(steps[1].text, prose(2));
});

test('no marker means no schema, even with ## Step headings', () => {
  assert.deepEqual(extractHowToSteps(article(['Step 1: A thing to do', 'Step 2: B thing', 'Step 3: C thing'], { marker: false })), []);
});

test('### Step headings are ignored', () => {
  const c = `${HOWTO_MARKER}\n\n### Step 1: One\n\n${prose(1)}\n\n### Step 2: Two\n\n${prose(2)}\n\n### Step 3: Three\n\n${prose(3)}`;
  assert.deepEqual(extractHowToSteps(c), []);
});

test('gaps, wrong order, too few steps, or text between marker and Step 1 return []', () => {
  assert.deepEqual(extractHowToSteps(article(['Step 1: A', 'Step 3: C', 'Step 4: D'])), []);
  assert.deepEqual(extractHowToSteps(article(['Step 2: A', 'Step 3: B', 'Step 4: C'])), []);
  assert.deepEqual(extractHowToSteps(article(['Step 1: A', 'Step 2: B'])), []);
  assert.deepEqual(extractHowToSteps(article(['Step 1: A', 'Step 2: B', 'Step 3: C'], { between: 'Stray paragraph.' })), []);
});

test('a step without a prose paragraph returns []', () => {
  const c = `${HOWTO_MARKER}\n\n## Step 1: One\n\n${prose(1)}\n\n## Step 2: Two\n\n- only a list item here\n\n## Step 3: Three\n\n${prose(3)}`;
  assert.deepEqual(extractHowToSteps(c), []);
});

test('schema builder emits HowToStep with url anchors', () => {
  const steps = extractHowToSteps(article(['Step 1: A first', 'Step 2: B second', 'Step 3: C third']));
  const ld = buildHowToSchema({ name: 'T', url: 'https://e.com/blog/x', steps });
  assert.equal(ld['@type'], 'HowTo');
  assert.equal(ld.step.length, 3);
  assert.equal(ld.step[2].url, 'https://e.com/blog/x#step-3-c-third');
  assert.equal(buildHowToSchema({ name: 'T', url: 'u', steps: [] }), null);
});

test('real restructured QC article yields exactly 5 steps whose text is visible verbatim', async () => {
  const fs = await import('node:fs');
  const path = process.env.QC_AFTER_MD;
  if (!path) return;
  const content = fs.readFileSync(path, 'utf8');
  const steps = extractHowToSteps(content);
  assert.equal(steps.length, 5);
  for (const s of steps) assert.ok(content.includes(s.text), `step ${s.position} text not verbatim in body`);
  console.log(JSON.stringify(steps.map(({ position, name, anchor, text }) => ({ position, name, anchor, text: text.slice(0, 80) })), null, 1));
});
