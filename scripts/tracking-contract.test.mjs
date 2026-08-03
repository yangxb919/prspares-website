import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  checkTrackingContract,
  countSubmitCalls,
  discoverTargets,
  repoRoot,
} from './tracking-contract.mjs';

function violationCodes(result) {
  return result.violations.map(({ code }) => code);
}

test('accepts a valid RFQ tracking sequence', () => {
  const source = `
    trackEvent('begin_form');
    await submitRfqAndNotify({ name: 'Buyer' });
    trackEvent('generate_lead', { currency: 'USD', value: 100 });
  `;

  assert.equal(checkTrackingContract(source, 'good fixture').ok, true);
});

test('rejects a submit call that is not awaited', () => {
  const source = `
    submitRfqAndNotify({ name: 'Buyer' });
    trackEvent('generate_lead', { currency: 'USD', value: 100 });
  `;
  const result = checkTrackingContract(source, 'unawaited fixture');

  assert.equal(result.ok, false);
  assert.ok(violationCodes(result).includes('SUBMIT_COUNT'));
});

test('rejects a missing generate_lead call', () => {
  const source = `
    trackEvent('begin_form');
    await submitRfqAndNotify({ name: 'Buyer' });
  `;
  const result = checkTrackingContract(source, 'missing lead fixture');

  assert.equal(result.ok, false);
  assert.ok(violationCodes(result).includes('LEAD_COUNT'));
});

test('rejects generate_lead before the awaited submit', () => {
  const source = `
    trackEvent('generate_lead', { currency: 'USD', value: 100 });
    await submitRfqAndNotify({ name: 'Buyer' });
  `;
  const result = checkTrackingContract(source, 'reversed fixture');

  assert.equal(result.ok, false);
  assert.ok(violationCodes(result).includes('ORDER'));
});

test('rejects duplicate generate_lead calls', () => {
  const source = `
    await submitRfqAndNotify({ name: 'Buyer' });
    trackEvent('generate_lead', { currency: 'USD', value: 100 });
    trackEvent("generate_lead", { currency: 'USD', value: 100 });
  `;
  const result = checkTrackingContract(source, 'duplicate lead fixture');

  assert.equal(result.ok, false);
  assert.ok(violationCodes(result).includes('LEAD_COUNT'));
});

test('submit discovery excludes function definitions and imports', () => {
  assert.equal(countSubmitCalls('function submitRfqAndNotify(input) {}'), 0);
  assert.equal(countSubmitCalls('await submitRfqAndNotify({})'), 1);
  assert.equal(
    countSubmitCalls("import { submitRfqAndNotify } from '@/lib/rfq-client';"),
    0,
  );
});

test('discovers exactly the eight real RFQ submit files', () => {
  const expected = [
    'src/app/id/wholesale/page.tsx',
    'src/app/th/wholesale/page.tsx',
    'src/app/wholesale-inquiry/page.tsx',
    'src/components/ContactFormEnhanced.tsx',
    'src/components/InquiryModal.tsx',
    'src/components/QuoteModal.tsx',
    'src/components/QuoteModalEnhanced.tsx',
    'src/components/features/ContactForm.tsx',
  ];
  const targets = discoverTargets();

  assert.deepEqual(targets, expected);
  assert.equal(targets.includes('src/lib/rfq-client.ts'), false);
});

test('all discovered real files satisfy the tracking contract', async (t) => {
  const targets = discoverTargets();

  for (const relativePath of targets) {
    await t.test(relativePath, () => {
      const source = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
      const result = checkTrackingContract(source, relativePath);
      assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
    });
  }
});
