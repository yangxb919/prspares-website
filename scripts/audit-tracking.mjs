import fs from 'node:fs';
import path from 'node:path';
import {
  checkTrackingContract,
  discoverTargets,
  repoRoot,
} from './tracking-contract.mjs';

const targets = discoverTargets();

if (targets.length === 0) {
  console.error('FAIL: 0 RFQ submit targets discovered.');
  process.exitCode = 1;
} else {
  let passed = 0;

  for (const relativePath of targets) {
    const source = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    const result = checkTrackingContract(source, relativePath);

    if (result.ok) {
      passed += 1;
      console.log(`PASS ${relativePath}`);
      continue;
    }

    console.error(`FAIL ${relativePath}`);
    for (const violation of result.violations) {
      console.error(`  ${violation.code}: ${violation.message}`);
    }
  }

  console.log(`${targets.length} discovered, ${passed} passed`);
  if (passed !== targets.length) {
    process.exitCode = 1;
  }
}
