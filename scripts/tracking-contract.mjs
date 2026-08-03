import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * RFQ tracking contract checker.
 *
 * This intentionally uses text/regex checks so it stays dependency-free. It can
 * miscount matching text inside comments, strings, or unusual generated syntax;
 * it is not a TypeScript parser. Keep RFQ submit and generate_lead calls in their
 * current direct-call form, and extend the fixtures if the source style changes.
 */

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SUBMIT_CALL_PATTERN = /\bsubmitRfqAndNotify\s*\(/g;
const SUBMIT_DEFINITION_PATTERN = /\bfunction\s+submitRfqAndNotify\s*\(/g;
const AWAITED_SUBMIT_PATTERN = /\bawait\s+submitRfqAndNotify\s*\(/g;
const LEAD_CALL_PATTERN = /\btrackEvent\s*\(\s*(['"])generate_lead\1/g;

function countMatches(source, pattern) {
  return Array.from(source.matchAll(new RegExp(pattern.source, pattern.flags))).length;
}

function firstMatchIndex(source, pattern) {
  return new RegExp(pattern.source, pattern.flags).exec(source)?.index ?? -1;
}

export function countSubmitCalls(source) {
  return countMatches(source, SUBMIT_CALL_PATTERN)
    - countMatches(source, SUBMIT_DEFINITION_PATTERN);
}

export function countLeadCalls(source) {
  return countMatches(source, LEAD_CALL_PATTERN);
}

export function discoverTargets(rootDir = path.join(repoRoot, 'src')) {
  const targets = [];

  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile() || !/\.tsx?$/.test(entry.name)) {
        continue;
      }

      const source = fs.readFileSync(absolutePath, 'utf8');
      if (countSubmitCalls(source) > 0) {
        targets.push(path.relative(repoRoot, absolutePath).split(path.sep).join('/'));
      }
    }
  }

  walk(rootDir);
  return targets.sort();
}

export function checkTrackingContract(source, label = '<source>') {
  const violations = [];
  const submitCount = countSubmitCalls(source);
  const awaitedSubmitCount = countMatches(source, AWAITED_SUBMIT_PATTERN);
  const leadCount = countLeadCalls(source);

  if (submitCount !== 1 || awaitedSubmitCount !== 1) {
    violations.push({
      code: 'SUBMIT_COUNT',
      message: `${label}: expected exactly one awaited submitRfqAndNotify call; found ${submitCount} call(s), ${awaitedSubmitCount} awaited.`,
    });
  }

  if (leadCount !== 1) {
    violations.push({
      code: 'LEAD_COUNT',
      message: `${label}: expected exactly one generate_lead trackEvent call; found ${leadCount}.`,
    });
  }

  const awaitedSubmitIndex = firstMatchIndex(source, AWAITED_SUBMIT_PATTERN);
  const leadIndex = firstMatchIndex(source, LEAD_CALL_PATTERN);
  if (awaitedSubmitIndex !== -1 && leadIndex !== -1 && leadIndex < awaitedSubmitIndex) {
    violations.push({
      code: 'ORDER',
      message: `${label}: generate_lead must occur after the awaited submitRfqAndNotify call.`,
    });
  }

  return {
    label,
    ok: violations.length === 0,
    violations,
  };
}
