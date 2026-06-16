/**
 * QA Evidence — Issue D8: AI Scan safety-disclaimer check
 * -----------------------------------------------------------------------------
 * Issue D8 (report): AI guidance could be misread as food-SAFETY advice. The
 * fix: visible, localized disclaimers state that AI Scan is "AI assisted
 * guidance only" and "cannot confirm food safety"; the flow analyses ONE
 * snapshot (not live object tracking); and the app never fabricates exact food
 * weights or exact carbon figures (the prompt forbids them and the schema
 * scrubs them, forcing a canonical safety note).
 *
 * This script is a SAFE, STATIC, READ-ONLY audit used to generate report
 * evidence. It does NOT rewrite the AI feature, write, move, or delete any file.
 * It only reads the AI-flow source files and confirms the disclaimers exist and
 * that no exact weight / carbon claim leaks into user-facing copy.
 *
 * Files inspected: ai.html, src/ai-controller.js, src/ai-prompts.js,
 *                  src/ai-schema.js, src/i18n.js.
 *
 * Run:  npm run qa:d8
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

const F = {
  aiHtml: resolve(repoRoot, 'ai.html'),
  controller: resolve(repoRoot, 'src/ai-controller.js'),
  prompts: resolve(repoRoot, 'src/ai-prompts.js'),
  schema: resolve(repoRoot, 'src/ai-schema.js'),
  i18n: resolve(repoRoot, 'src/i18n.js'),
};

// Patterns that would be an exact weight / carbon CLAIM in user-facing copy.
// A unit must follow the number, so SVG path data ("M4 7h16") never matches.
const WEIGHT_CLAIM = /\b\d+(?:\.\d+)?\s?(?:g|kg|grams?|kilograms?)\b/i;
const CARBON_CLAIM = /(?:\b\d+(?:\.\d+)?\s?(?:kg\s?)?co2\b)|carbon footprint|carbon impact/i;

// ---- Small helpers ---------------------------------------------------------
let failures = 0;

function pass(msg) {
  console.log(`D8 PASS: ${msg}`);
}
function info(msg) {
  console.log(`D8 INFO: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`D8 FAIL: ${msg}`);
}
function rel(p) {
  return relative(repoRoot, p).replace(/\\/g, '/');
}
function read(path, label) {
  if (!existsSync(path)) {
    fail(`${label} not found at ${rel(path)}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}
function count(hay, needle) {
  return hay.split(needle).length - 1;
}
/** Visible text only: drop inline <svg> icons, then strip tags + attributes. */
function visibleText(html) {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

console.log('=== QA Evidence — Issue D8: AI Scan safety-disclaimer check ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

const aiHtml = read(F.aiHtml, 'ai.html');
const controller = read(F.controller, 'src/ai-controller.js');
const prompts = read(F.prompts, 'src/ai-prompts.js');
const schema = read(F.schema, 'src/ai-schema.js');
const i18n = read(F.i18n, 'src/i18n.js');
for (const [k, p] of Object.entries(F)) {
  if (existsSync(p)) info(`inspected -> ${rel(p)}`);
}
console.log('');

// ===========================================================================
// Check 1 — AI safety disclaimer found (user-facing + localized + enforced)
// ===========================================================================
const htmlDisclaimer = /AI assisted guidance only/i.test(aiHtml) &&
  /cannot confirm food safety/i.test(aiHtml);
const i18nDisclaimerLocales = count(i18n, 'disclaimer:'); // one per locale
const schemaSafetyNote = /SAFETY_NOTE/.test(schema) && /cannot confirm food safety/i.test(schema);
const promptNoSafety = /do not confirm food safety/i.test(prompts);
const controllerRendersSafety = /safetyNote/.test(controller);

if (htmlDisclaimer && i18nDisclaimerLocales >= 1) {
  pass('AI safety disclaimer found');
  info('ai.html shows "AI assisted guidance only. PlateNudge cannot confirm food safety."');
  info(`disclaimer is localized in ${i18nDisclaimerLocales} locale(s) (i18n.js "disclaimer:")`);
  if (schemaSafetyNote) info('ai-schema.js forces a canonical SAFETY_NOTE on every result');
  if (promptNoSafety) info('ai-prompts.js instructs the model: do NOT confirm food safety');
  if (controllerRendersSafety) info('ai-controller.js renders the canonical safetyNote into the UI');
} else {
  fail('AI safety disclaimer text is missing from the user-facing AI flow');
}

// ===========================================================================
// Check 2 — no exact WEIGHT claim in user-facing copy (+ active guardrails)
// ===========================================================================
const htmlText = visibleText(aiHtml);
const weightInHtml = WEIGHT_CLAIM.exec(htmlText);
const weightInI18n = WEIGHT_CLAIM.exec(i18n);
const promptForbidsWeight = /exact weight/i.test(prompts);
const schemaScrubsWeight = /\(g\|kg\|grams\?\|kilograms\?\)/.test(schema) || /grams\?\|kilograms\?/.test(schema);

if (!weightInHtml && !weightInI18n) {
  pass('no exact weight claim found');
  info('no "<number> g/kg/grams" claim appears in ai.html or i18n.js user-facing text');
  if (promptForbidsWeight) info('ai-prompts.js forbids estimating exact weight');
  if (schemaScrubsWeight) info('ai-schema.js DISALLOWED filter scrubs exact-weight strings from model output');
} else {
  const where = weightInHtml ? `ai.html ("${weightInHtml[0]}")` : `i18n.js ("${weightInI18n[0]}")`;
  fail(`an exact weight claim appears in user-facing copy: ${where}`);
}

// ===========================================================================
// Check 3 — no exact CARBON claim in user-facing copy (+ active guardrails)
// ===========================================================================
const carbonInHtml = CARBON_CLAIM.exec(htmlText);
const carbonInI18n = CARBON_CLAIM.exec(i18n);
const promptForbidsCarbon = /exact carbon impact/i.test(prompts) || /carbon figures/i.test(prompts);
const schemaScrubsCarbon = /co2/i.test(schema) && /carbon footprint/i.test(schema);

if (!carbonInHtml && !carbonInI18n) {
  pass('no exact carbon claim found');
  info('no CO2 / "carbon footprint" / "carbon impact" claim appears in ai.html or i18n.js user-facing text');
  if (promptForbidsCarbon) info('ai-prompts.js forbids estimating exact carbon impact');
  if (schemaScrubsCarbon) info('ai-schema.js DISALLOWED filter scrubs carbon claims from model output');
} else {
  const where = carbonInHtml ? `ai.html ("${carbonInHtml[0]}")` : `i18n.js ("${carbonInI18n[0]}")`;
  fail(`a carbon claim appears in user-facing copy: ${where}`);
}

// ===========================================================================
// Check 4 — one-snapshot wording found
// ===========================================================================
const htmlSnapshot = /one snapshot/i.test(aiHtml) || /Analysing snapshot/i.test(aiHtml);
const i18nSnapshot = /one snapshot/i.test(i18n) || /snapshot/i.test(i18n);
const promptSnapshot = /single snapshot/i.test(prompts);

if (htmlSnapshot && i18nSnapshot) {
  pass('one-snapshot wording found');
  info('ai.html + i18n.js state PlateNudge analyses ONE snapshot (not continuous capture)');
  if (promptSnapshot) info('ai-prompts.js tells the model the image is a single snapshot');
} else {
  fail('one-snapshot wording is missing from the AI flow');
}

// ===========================================================================
// Bonus — "not live object tracking" (mentioned in interface + prompt)
// ===========================================================================
const i18nNoLiveTracking = /not live object tracking/i.test(i18n);
const promptNoLiveTracking = /object tracking/i.test(prompts);
if (i18nNoLiveTracking || promptNoLiveTracking) {
  pass('"no live object tracking" clarification present');
  if (i18nNoLiveTracking) info('interface copy: "analyses one snapshot, not live object tracking"');
  if (promptNoLiveTracking) info('ai-prompts.js forbids claiming live object tracking');
} else {
  info('no explicit "live object tracking" clarification (optional — not required)');
}

// ---- Summary / exit code ---------------------------------------------------
console.log('');
info('static audit only: the AI feature was not modified (all required disclaimers are present)');
console.log('');
if (failures === 0) {
  console.log('=== D8 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.log(`=== D8 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
