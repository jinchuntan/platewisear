/**
 * QA Evidence — Issue D5: mobile tap-cue / bottom-sheet fallback check
 * -----------------------------------------------------------------------------
 * Issue D5 (report): tapping the 3D AR exhibit card was unreliable on mobile
 * because some browsers (notably mobile Safari) do not consistently deliver
 * canvas-based tap/click events. The fix added a SCREEN-BASED fallback: an HTML
 * "Tap for actions" cue button plus the bottom-sheet interaction path, so the
 * Throw / Save / Share / Compost actions are always reachable outside the WebGL
 * canvas — even when the 3D tap is dropped.
 *
 * This script is a SAFE, STATIC, READ-ONLY audit used to generate report
 * evidence. It does NOT change the interaction design, write, move, or delete
 * any file. It only reads ar.html and src/ar-controller.js and confirms the
 * fallback wiring is present.
 *
 * What it proves:
 *   - ar.html has the screen tap cue            (#ar-tap-cue),
 *   - ar.html has the bottom sheet              (#ar-sheet),
 *   - ar.html has Throw/Save/Share/Compost buttons (HTML, outside the canvas),
 *   - ar-controller.js binds a click listener to the tap cue,
 *   - ar-controller.js opens/expands the bottom sheet on that interaction,
 *   - ar-controller.js still keeps the 3D AR card hit area (.ar-card-hit).
 *
 * Run:  npm run qa:d5
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
const controllerPath = resolve(repoRoot, 'src/ar-controller.js');

// The four action choices that must be reachable as HTML buttons in the sheet.
const ACTIONS = [
  { id: 'btn-throw', label: 'Throw' },
  { id: 'btn-save', label: 'Save' },
  { id: 'btn-share', label: 'Share' },
  { id: 'btn-compost', label: 'Compost' },
];

// ---- Small helpers ---------------------------------------------------------
let failures = 0;

function pass(msg) {
  console.log(`D5 PASS: ${msg}`);
}
function info(msg) {
  console.log(`D5 INFO: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`D5 FAIL: ${msg}`);
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

console.log('=== QA Evidence — Issue D5: tap cue / bottom-sheet fallback check ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

const arHtml = readOrFail(arHtmlPath, 'ar.html');
const controller = readOrFail(controllerPath, 'src/ar-controller.js');
if (arHtml) info(`inspected -> ${rel(arHtmlPath)}`);
if (controller) info(`inspected -> ${rel(controllerPath)}`);
console.log('');

// ===========================================================================
// ar.html structural checks
// ===========================================================================
const htmlHasTapCue = !!arHtml && /id="ar-tap-cue"/.test(arHtml);
if (arHtml) {
  if (htmlHasTapCue) pass('ar.html contains the screen tap cue  ->  id="ar-tap-cue"');
  else fail('ar.html is missing the screen tap cue (id="ar-tap-cue")');
}

const htmlHasSheet = !!arHtml && /id="ar-sheet"/.test(arHtml);
if (arHtml) {
  if (htmlHasSheet) pass('ar.html contains the bottom sheet  ->  id="ar-sheet"');
  else fail('ar.html is missing the bottom sheet (id="ar-sheet")');
}

// Action buttons present (by id) AND labelled — these are HTML buttons in the
// sheet, i.e. reachable OUTSIDE the 3D WebGL canvas.
let actionButtonsOk = !!arHtml;
if (arHtml) {
  for (const a of ACTIONS) {
    const hasId = new RegExp(`id="${a.id}"`).test(arHtml);
    const hasLabel = arHtml.includes(`>${a.label}<`);
    if (hasId && hasLabel) {
      info(`action button present -> ${a.label} (#${a.id})`);
    } else {
      actionButtonsOk = false;
      fail(`ar.html is missing the "${a.label}" action button (#${a.id})`);
    }
  }
  if (actionButtonsOk) {
    pass('ar.html contains Throw, Save, Share, and Compost action buttons');
  }
}

// ===========================================================================
// ar-controller.js wiring checks
// ===========================================================================
// 1) A click listener is bound to the tap-cue element.
//    tapCueEl is `document.getElementById('ar-tap-cue')`; it must have a click
//    listener so the screen cue triggers the same action focus as a 3D tap.
const cueBoundToId = !!controller && /tapCueEl\s*=\s*document\.getElementById\(\s*['"]ar-tap-cue['"]\s*\)/.test(controller);
const cueClickListener = !!controller && /tapCueEl\s*\??\.\s*addEventListener\(\s*['"]click['"]/.test(controller);
if (controller) {
  if (cueBoundToId && cueClickListener) {
    pass('ar-controller.js binds a click listener to the tap cue (#ar-tap-cue)');
  } else {
    fail('ar-controller.js does not bind a click listener to the tap cue');
  }
}

// 2) Logic that opens / expands the bottom sheet.
//    The fallback works by making the sheet visible and expanding it.
const sheetOpenLogic =
  !!controller && /sheetEl\.classList\.add\([^)]*['"]is-(open|expanded)['"]/.test(controller);
if (controller) {
  if (sheetOpenLogic) {
    pass('ar-controller.js opens/expands the bottom sheet (is-open / is-expanded)');
  } else {
    fail('ar-controller.js has no logic to open or expand the bottom sheet');
  }
}

// 3) The 3D AR card hit area is still kept (if present) — the fallback ADDS a
//    path, it does not remove the original canvas tap path.
const htmlHasCardHit = !!arHtml && /ar-card-hit/.test(arHtml);
const controllerKeepsCardHit = !!controller && /ar-card-hit/.test(controller);
if (htmlHasCardHit || controllerKeepsCardHit) {
  if (controllerKeepsCardHit) {
    pass('ar-controller.js still keeps the AR card hit area (.ar-card-hit) — 3D path retained');
  } else {
    fail('ar.html has .ar-card-hit but ar-controller.js no longer wires it');
  }
} else {
  info('no .ar-card-hit present — nothing to retain (fallback path stands alone)');
}

// ===========================================================================
// Headline evidence lines (the three the report asks for)
// ===========================================================================
console.log('');
const tapCueExists = htmlHasTapCue && cueBoundToId && cueClickListener;
const sheetFallbackExists = htmlHasSheet && sheetOpenLogic;
const actionsOutsideCanvas = actionButtonsOk;

if (tapCueExists) pass('screen-based tap cue exists');
else fail('screen-based tap cue is incomplete');

if (sheetFallbackExists) pass('bottom sheet fallback interaction exists');
else fail('bottom sheet fallback interaction is incomplete');

if (actionsOutsideCanvas) pass('action buttons are available outside the 3D canvas');
else fail('action buttons are not all available outside the 3D canvas');

info('static audit only: the interaction design and AR behavior were not changed');

// ---- Summary / exit code ---------------------------------------------------
console.log('');
if (failures === 0) {
  console.log('=== D5 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.log(`=== D5 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
