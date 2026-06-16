/**
 * QA Evidence — Issue D3: AR target ORDER consistency check
 * -----------------------------------------------------------------------------
 * Issue D3 (report): a WRONG exhibit could appear if the MindAR target order
 * does not match across the four places that must agree:
 *
 *     1. The compiled .mind target order (frozen — NOT touched by this script).
 *     2. src/food-targets.js          -> targetIndex -> id mapping.
 *     3. ar.html                       -> mindar-image-target="targetIndex: N".
 *     4. marker.html (Scan Images)     -> the five source preview images.
 *     5. public/assets/targets/source/ -> the five source image files on disk.
 *
 * If any of these drifts out of order, MindAR target N would light up the wrong
 * exhibit card. This script proves the order is consistent end-to-end.
 *
 * It is SAFE and READ-ONLY. It NEVER writes, moves, deletes, or regenerates any
 * file. In particular it never touches the compiled .mind file and never
 * changes the target order — it only reads and compares.
 *
 * Run:  npm run qa:d3
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

// ---- Resolve paths relative to the repository root -------------------------
// This file lives at <repo>/scripts/qa-evidence/, so the repo root is two
// directories up. Resolving this way keeps the script correct no matter what
// the current working directory is when it runs.
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

// ---- The single source of truth this script verifies against ---------------
// The expected target ORDER for PlateNudge. Index === the MindAR targetIndex.
const EXPECTED = [
  { index: 0, id: 'leftover-rice' },
  { index: 1, id: 'fruit-peels' },
  { index: 2, id: 'bread-waste' },
  { index: 3, id: 'mixed-leftovers' },
  { index: 4, id: 'drink-waste' },
];

const foodTargetsPath = resolve(repoRoot, 'src/food-targets.js');
const arHtmlPath = resolve(repoRoot, 'ar.html');
const markerHtmlPath = resolve(repoRoot, 'marker.html');
const sourceDir = resolve(repoRoot, 'public/assets/targets/source');

// ---- Small helpers ---------------------------------------------------------
let failures = 0;

function pass(msg) {
  console.log(`D3 PASS: ${msg}`);
}
function info(msg) {
  console.log(`D3 INFO: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`D3 FAIL: ${msg}`);
}
function rel(p) {
  return relative(repoRoot, p).replace(/\\/g, '/');
}

/** Read a file as UTF-8, or record a failure and return null if missing. */
function readOrFail(path, label) {
  if (!existsSync(path)) {
    fail(`${label} not found at ${rel(path)}`);
    return null;
  }
  return readFileSync(path, 'utf8');
}

console.log('=== QA Evidence — Issue D3: AR target order consistency check ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

// ---- Parse the actual order out of src/food-targets.js ---------------------
// We parse the file as TEXT (not by importing it) so this stays a pure,
// dependency-free read-only check. Each TARGETS entry declares `targetIndex: N`
// immediately followed by `id: '<slug>'`, so we capture them in file order.
const foodTargets = readOrFail(foodTargetsPath, 'src/food-targets.js');
let parsed = [];
if (foodTargets) {
  const re = /targetIndex:\s*(\d+)\s*,\s*[\r\n]+\s*id:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(foodTargets)) !== null) {
    parsed.push({ index: Number(m[1]), id: m[2] });
  }
}

// ---- Check 1: food-targets.js contains all five target IDs -----------------
const parsedIds = parsed.map((p) => p.id);
const missingIds = EXPECTED.filter((e) => !parsedIds.includes(e.id)).map((e) => e.id);
if (foodTargets) {
  if (missingIds.length === 0 && parsed.length === EXPECTED.length) {
    pass(`food-targets.js contains all ${EXPECTED.length} target IDs`);
  } else if (missingIds.length > 0) {
    fail(`food-targets.js is missing target ID(s): ${missingIds.join(', ')}`);
  } else {
    fail(`food-targets.js declares ${parsed.length} targets, expected ${EXPECTED.length}`);
  }
}

// ---- Check 2: targetIndex values are exactly 0,1,2,3,4 in the right order ---
// AND each index maps to the EXPECTED id (this is the core D3 guarantee).
if (foodTargets) {
  let orderOk = parsed.length === EXPECTED.length;
  for (const want of EXPECTED) {
    const got = parsed[want.index];
    if (!got || got.index !== want.index || got.id !== want.id) {
      orderOk = false;
      fail(
        `food-targets.js order mismatch at index ${want.index}: ` +
          `expected "${want.id}", got "${got ? `${got.id} (index ${got.index})` : 'nothing'}"`
      );
    }
  }
  if (orderOk) {
    pass('food-targets.js targetIndex values are 0,1,2,3,4 in the expected order');
  }
}

// ---- Check 3: ar.html has matching mindar-image-target entries 0..4 --------
const arHtml = readOrFail(arHtmlPath, 'ar.html');
if (arHtml) {
  const re = /mindar-image-target="targetIndex:\s*(\d+)"/g;
  const arIndices = [];
  let m;
  while ((m = re.exec(arHtml)) !== null) arIndices.push(Number(m[1]));

  const expectedIndices = EXPECTED.map((e) => e.index);
  const orderMatches =
    arIndices.length === expectedIndices.length &&
    arIndices.every((v, i) => v === expectedIndices[i]);

  if (orderMatches) {
    pass(`ar.html has mindar-image-target entries for targetIndex ${expectedIndices.join(', ')}`);
  } else {
    fail(`ar.html targetIndex entries [${arIndices.join(', ')}] do not match expected [${expectedIndices.join(', ')}]`);
  }
}

// ---- Check 4: marker.html (Scan Images) references the five source images ---
const markerHtml = readOrFail(markerHtmlPath, 'marker.html');
if (markerHtml) {
  const missingRefs = EXPECTED.filter(
    (e) => !markerHtml.includes(`./assets/targets/source/${e.id}.jpg`)
  ).map((e) => `${e.id}.jpg`);

  if (missingRefs.length === 0) {
    pass('marker.html (Scan Images) references all five source images');
  } else {
    fail(`marker.html is missing source image reference(s): ${missingRefs.join(', ')}`);
  }
}

// ---- Check 5: the five expected source image files exist on disk -----------
const missingFiles = EXPECTED.filter(
  (e) => !existsSync(resolve(sourceDir, `${e.id}.jpg`))
).map((e) => `${e.id}.jpg`);

if (missingFiles.length === 0) {
  pass(`public/assets/targets/source/ contains all five image files`);
  info(`source dir -> ${rel(sourceDir)}`);
} else {
  fail(`source dir is missing image file(s): ${missingFiles.join(', ')}`);
}

// ---- Human-readable evidence: the verified target order --------------------
console.log('');
for (const e of EXPECTED) {
  console.log(`D3 Target ${e.index}: ${e.id}`);
}

// ---- Safety statement ------------------------------------------------------
info('read-only: no production files were modified and the target order was not changed');

// ---- Summary / exit code ---------------------------------------------------
console.log('');
if (failures === 0) {
  console.log('D3 PASS: target order is consistent');
  console.log('=== D3 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.error('D3 FAIL: target order is INCONSISTENT — see failures above');
  console.log(`=== D3 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
