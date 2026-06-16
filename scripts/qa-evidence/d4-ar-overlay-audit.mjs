/**
 * QA Evidence — Issue D4: AR overlay minimalism audit
 * -----------------------------------------------------------------------------
 * Issue D4 (report): the AR overlay was previously too cluttered. The fix was to
 * keep the in-camera AR overlay MINIMAL — only a title, an "SDG 12" cue, and a
 * best-action badge per target — and to move the long quick facts, sources, and
 * explanations into the bottom sheet (#ar-sheet) and the Ask More drawer
 * (#askmore).
 *
 * This script is a SAFE, STATIC, READ-ONLY audit used to generate report
 * evidence. It does NOT redesign the UI, change AR behavior, write, move, or
 * delete any file. It only reads ar.html and reports what the overlay contains.
 *
 * What it proves for each AR target entity (mindar-image-target):
 *   - it has a TITLE field          (arx-title-N),
 *   - it has an SDG 12 cue          (value="SDG 12"),
 *   - it has a BEST-ACTION field    (arx-action-N),
 *   - it carries NO long quick-fact text inside the AR overlay,
 * plus that the bottom sheet and Ask More drawer exist to hold the detail.
 *
 * Run:  npm run qa:d4
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
const arHtmlPath = resolve(repoRoot, 'ar.html');

// If any AR overlay <a-text> carried a value longer than this, the overlay
// would be text-heavy again. Titles/actions are empty (value="") and filled
// from JS; the SDG cue is just "SDG 12" (6 chars), so a low ceiling is safe.
const MAX_OVERLAY_TEXT_LEN = 40;

// ---- Small helpers ---------------------------------------------------------
let failures = 0;

function pass(msg) {
  console.log(`D4 PASS: ${msg}`);
}
function info(msg) {
  console.log(`D4 INFO: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`D4 FAIL: ${msg}`);
}
function rel(p) {
  return relative(repoRoot, p).replace(/\\/g, '/');
}

console.log('=== QA Evidence — Issue D4: AR overlay minimalism audit ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

// ---- Load ar.html ----------------------------------------------------------
if (!existsSync(arHtmlPath)) {
  fail(`ar.html not found at ${rel(arHtmlPath)}`);
  console.log('');
  console.log('=== D4 RESULT: 1 CHECK(S) FAILED ===');
  process.exit(1);
}
const arHtml = readFileSync(arHtmlPath, 'utf8');
info(`audited file -> ${rel(arHtmlPath)}`);

// ---- Isolate the AR overlay (the <a-scene>...</a-scene> block) -------------
// The overlay is everything MindAR renders over the camera. The bottom sheet
// and Ask More drawer live OUTSIDE the scene, so scoping to the scene lets us
// prove long content was moved out of the overlay.
const sceneMatch = arHtml.match(/<a-scene[\s\S]*?<\/a-scene>/);
const scene = sceneMatch ? sceneMatch[0] : '';
if (!scene) {
  fail('could not locate the <a-scene> AR overlay block in ar.html');
}

// ---- Split the scene into per-target blocks --------------------------------
// Each target entity starts with `mindar-image-target="targetIndex: N"`.
const targetStartRe = /mindar-image-target="targetIndex:\s*(\d+)"/g;
const starts = [];
let sm;
while ((sm = targetStartRe.exec(scene)) !== null) {
  starts.push({ index: Number(sm[1]), at: sm.index });
}

const targets = starts.map((s, i) => {
  const end = i + 1 < starts.length ? starts[i + 1].at : scene.length;
  return { index: s.index, block: scene.slice(s.at, end) };
});

// ---- Report: number of AR target entities ----------------------------------
console.log('');
info(`AR target entities found: ${targets.length}`);
if (targets.length > 0) {
  pass(`AR overlay defines ${targets.length} target entit${targets.length === 1 ? 'y' : 'ies'}`);
} else {
  fail('no AR target entities (mindar-image-target) found in the overlay');
}

// ---- Per-target field audit ------------------------------------------------
let allHaveTitle = targets.length > 0;
let allHaveSdg = targets.length > 0;
let allHaveAction = targets.length > 0;

for (const tgt of targets) {
  const hasTitle = new RegExp(`id="arx-title-${tgt.index}"`).test(tgt.block);
  const hasSdg = /value="SDG 12"/.test(tgt.block);
  const hasAction = new RegExp(`id="arx-action-${tgt.index}"`).test(tgt.block);

  if (!hasTitle) allHaveTitle = false;
  if (!hasSdg) allHaveSdg = false;
  if (!hasAction) allHaveAction = false;

  const marks = [
    `title:${hasTitle ? 'yes' : 'NO'}`,
    `SDG 12 cue:${hasSdg ? 'yes' : 'NO'}`,
    `best-action:${hasAction ? 'yes' : 'NO'}`,
  ].join('  ');
  info(`Target ${tgt.index} -> ${marks}`);
}

if (allHaveTitle) pass('every AR target has a title field');
else fail('one or more AR targets are missing a title field');

if (allHaveSdg) pass('every AR target has an SDG 12 cue');
else fail('one or more AR targets are missing an SDG 12 cue');

if (allHaveAction) pass('every AR target has a best-action field');
else fail('one or more AR targets are missing a best-action field');

// ---- Long quick facts must be kept OUT of the AR overlay -------------------
// 1) No <a-text> inside the scene may carry a long, hard-coded string.
const textValRe = /<a-text\b[^>]*\bvalue="([^"]*)"/g;
let longestOverlayText = '';
let tm;
while ((tm = textValRe.exec(scene)) !== null) {
  if (tm[1].length > longestOverlayText.length) longestOverlayText = tm[1];
}
const overlayTextOk = longestOverlayText.length <= MAX_OVERLAY_TEXT_LEN;
info(`longest hard-coded overlay <a-text> value = ${longestOverlayText.length} chars` +
  (longestOverlayText ? ` ("${longestOverlayText}")` : ''));

// 2) The quick-fact / source nodes must NOT live inside the overlay.
const factInOverlay = /id="fact-display"/.test(scene) || /id="fact-source"/.test(scene);

if (overlayTextOk && !factInOverlay) {
  pass('long quick facts are kept OUT of the AR overlay');
} else {
  if (!overlayTextOk) {
    fail(`AR overlay contains a long hard-coded text value (${longestOverlayText.length} chars > ${MAX_OVERLAY_TEXT_LEN})`);
  }
  if (factInOverlay) {
    fail('quick-fact / fact-source nodes are inside the AR overlay (should be in the bottom sheet)');
  }
}

// ---- The detail surfaces (bottom sheet + Ask More drawer) must exist -------
const hasSheet = /id="ar-sheet"/.test(arHtml);
const hasFactDisplay = /id="fact-display"/.test(arHtml);
const hasDrawer = /id="askmore"/.test(arHtml);

if (hasSheet) pass('bottom sheet (#ar-sheet) exists to hold detailed content');
else fail('bottom sheet (#ar-sheet) not found');

if (hasDrawer) pass('Ask More drawer (#askmore) exists to hold explanations');
else fail('Ask More drawer (#askmore) not found');

if (hasFactDisplay) info('quick facts render in the bottom sheet (#fact-display)');

// ---- Plain-English evidence summary ----------------------------------------
console.log('');
info('AR overlay contains title, SDG cue, and best-action badge');
info('detailed content is handled by bottom sheet / Ask More');
info('static audit only: UI was not redesigned and AR behavior was not changed');

// ---- Summary / exit code ---------------------------------------------------
console.log('');
if (failures === 0) {
  console.log('D4 PASS: AR overlay is minimal and not text-heavy');
  console.log('=== D4 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.error('D4 FAIL: AR overlay does not meet the minimalism criteria — see failures above');
  console.log(`=== D4 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
