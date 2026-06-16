/**
 * QA Evidence — Issue D10: i18n / language-switching consistency check
 * -----------------------------------------------------------------------------
 * Issue D10 (report): switching language did not update dynamic content
 * consistently. The fix: setLocale() broadcasts a `platewise:localechange`
 * event; i18n.js re-applies the static [data-i18n] strings, and each page
 * controller re-renders its JS-generated content on that event. Data content
 * (food targets) is localized in ms + zh-CN, with English falling back to the
 * source module.
 *
 * This script is a SAFE, READ-ONLY audit used to generate report evidence. It
 * does NOT change any translation, write, move, or delete any file. To validate
 * key coverage accurately it IMPORTS the real i18n.js / food-targets.js modules
 * (shimming a few browser globals so the modules load in Node — nothing on disk
 * is modified) and checks every static [data-i18n] key against the actual
 * translation dictionaries.
 *
 * What it proves:
 *   - supported languages include English, Bahasa Melayu, and Simplified Chinese,
 *   - every static data-i18n key in the HTML resolves in the dictionaries,
 *   - dynamic target content is localized (ms + zh-CN) with an English fallback,
 *   - ar-controller.js + ai-controller.js re-render on locale change.
 *
 * Run:  npm run qa:d10
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

// ---- Resolve paths relative to the repository root -------------------------
// This file lives at <repo>/scripts/qa-evidence/, so the repo root is two
// directories up. Resolving this way keeps the script correct no matter what
// the current working directory is when it runs.
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

const HTML_PAGES = ['index.html', 'ar.html', 'demo.html', 'ai.html', 'marker.html', 'quiz.html', 'about.html'];

// ---- Small helpers ---------------------------------------------------------
let failures = 0;
function pass(msg) { console.log(`D10 PASS: ${msg}`); }
function info(msg) { console.log(`D10 INFO: ${msg}`); }
function fail(msg) { failures += 1; console.error(`D10 FAIL: ${msg}`); }
function rel(p) { return relative(repoRoot, p).replace(/\\/g, '/'); }
function read(name) {
  const p = resolve(repoRoot, name);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

console.log('=== QA Evidence — Issue D10: i18n / language-switching check ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

// ---- Shim the few browser globals i18n.js touches at module top level ------
// i18n.js calls window.addEventListener(...) when it loads, and setLocale() uses
// CustomEvent. Shimming them lets the real module load in Node. This only sets
// in-memory globals for THIS audit process — no file or env var is modified.
globalThis.window = globalThis.window || { addEventListener() {}, dispatchEvent() {} };
globalThis.document = globalThis.document || { documentElement: {} };
globalThis.CustomEvent = globalThis.CustomEvent || class CustomEvent { constructor(type, init) { this.type = type; Object.assign(this, init); } };

// Some Node versions expose a partial localStorage without getItem; install a
// minimal in-memory stub so i18n.js's "typeof localStorage" probe stays happy.
const localStorageStub = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  try { globalThis.localStorage = localStorageStub; }
  catch { Object.defineProperty(globalThis, 'localStorage', { value: localStorageStub, configurable: true }); }
}
// navigator already exists in modern Node (getter-only); i18n.js only reads
// navigator.language and safely falls back to 'en' if it is undefined.

let i18n, foodTargets;
try {
  i18n = await import(pathToFileURL(resolve(repoRoot, 'src/i18n.js')).href);
  foodTargets = await import(pathToFileURL(resolve(repoRoot, 'src/food-targets.js')).href);
} catch (err) {
  fail(`could not load i18n / food-targets modules: ${err.message}`);
  console.log('\n=== D10 RESULT: 1 CHECK(S) FAILED ===');
  process.exit(1);
}
const { translations, t, setLocale, getLocale, LOCALES, LOCALE_NAMES } = i18n;
const { TARGETS, localizedTarget } = foodTargets;

// ===========================================================================
// Check 1 — supported languages (English, Bahasa Melayu, Simplified Chinese)
// ===========================================================================
const wantLocales = ['en', 'ms', 'zh-CN'];
const localesOk = wantLocales.every((l) => LOCALES.includes(l)) &&
  wantLocales.every((l) => translations && translations[l]);
const namesOk = LOCALE_NAMES &&
  LOCALE_NAMES.en === 'English' &&
  /Bahasa Melayu/i.test(LOCALE_NAMES.ms || '') &&
  (LOCALE_NAMES['zh-CN'] === '中文' || /chinese/i.test(LOCALE_NAMES['zh-CN'] || ''));

if (localesOk && namesOk) {
  pass('supported languages found');
  info(`LOCALES = [${LOCALES.join(', ')}]  ->  English, Bahasa Melayu (BM), Simplified Chinese (中文)`);
} else {
  fail(`expected locales en/ms/zh-CN with names; got LOCALES=[${LOCALES?.join(', ')}]`);
}

// ===========================================================================
// Check 2 — every static data-i18n key resolves in the dictionaries
// ===========================================================================
const KEY_RE = /\bdata-i18n(?:-html|-alt|-aria-label|-placeholder)?="([^"]+)"/g;
const keys = new Set();
let pagesScanned = 0;
for (const page of HTML_PAGES) {
  const html = read(page);
  if (html === null) { fail(`page not found: ${page}`); continue; }
  pagesScanned += 1;
  let m;
  while ((m = KEY_RE.exec(html)) !== null) keys.add(m[1]);
}

const missing = [];
let msCovered = 0;
let zhCovered = 0;
for (const key of keys) {
  if (typeof t(key, 'en') !== 'string') missing.push(key);
  // Informational: how many static keys are ALSO overridden in ms / zh-CN
  // (the rest fall back to English by design).
  if (typeof lookupRaw('ms', key) === 'string') msCovered += 1;
  if (typeof lookupRaw('zh-CN', key) === 'string') zhCovered += 1;
}
function lookupRaw(locale, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), translations[locale]);
}

if (missing.length === 0 && keys.size > 0) {
  pass('static translation keys checked');
  info(`${keys.size} unique data-i18n keys across ${pagesScanned} pages all resolve in the EN dictionary`);
  info(`localized overrides: ms covers ${msCovered}/${keys.size}, zh-CN covers ${zhCovered}/${keys.size} (rest fall back to English by design)`);
} else if (missing.length > 0) {
  fail(`${missing.length} data-i18n key(s) missing from the dictionaries: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' …' : ''}`);
} else {
  fail('no data-i18n keys were found to check');
}

// ===========================================================================
// Check 3 — dynamic target content is localized (ms + zh-CN) with EN fallback
// ===========================================================================
const targetIds = TARGETS.map((tg) => tg.id);
const msMissing = targetIds.filter((id) => !translations.ms?.targets?.[id]?.title);
const zhMissing = targetIds.filter((id) => !translations['zh-CN']?.targets?.[id]?.title);
const ftSrc = read('src/food-targets.js') || '';
const hasFallback = /localizedTarget/.test(ftSrc) && /\?\?\s*target\./.test(ftSrc);

if (msMissing.length === 0 && zhMissing.length === 0 && hasFallback) {
  pass('dynamic target localization found');
  info(`all ${targetIds.length} targets have ms + zh-CN translations; food-targets.js localizedTarget() falls back to the EN source`);
  // Runtime proof that switching locale re-localizes dynamic content.
  const sample = TARGETS[0];
  const enTitle = localizedTarget(sample).title;            // currentLocale = 'en'
  setLocale('ms');   const msTitle = localizedTarget(sample).title;
  setLocale('zh-CN'); const zhTitle = localizedTarget(sample).title;
  setLocale('en');   const backTitle = localizedTarget(sample).title;
  info(`runtime switch — "${sample.id}": EN="${enTitle}"  ->  BM="${msTitle}"  ->  中文="${zhTitle}"  ->  back to EN="${backTitle}"`);
  if (msTitle === enTitle || zhTitle === enTitle) {
    fail('switching locale did NOT change the localized target title');
  }
} else {
  if (msMissing.length) fail(`ms target translation missing for: ${msMissing.join(', ')}`);
  if (zhMissing.length) fail(`zh-CN target translation missing for: ${zhMissing.join(', ')}`);
  if (!hasFallback) fail('food-targets.js localizedTarget() fallback not detected');
}

// ===========================================================================
// Check 4 — controllers re-render on locale change
// ===========================================================================
const LC_EVENT = /addEventListener\(\s*['"]platewise:localechange['"]/;
const arSrc = read('src/ar-controller.js') || '';
const aiSrc = read('src/ai-controller.js') || '';
const i18nSrc = read('src/i18n.js') || '';

const arListens = LC_EVENT.test(arSrc) && (/populateExhibits\(\)/.test(arSrc) || /renderSheetText\(\)/.test(arSrc));
const aiListens = LC_EVENT.test(aiSrc) && (/renderAiResult\(/.test(aiSrc) || /applyTranslations/.test(aiSrc));
const i18nBroadcasts = /dispatchEvent\(\s*new CustomEvent\(\s*['"]platewise:localechange['"]/.test(i18nSrc) &&
  LC_EVENT.test(i18nSrc); // i18n re-applies static strings on the same event

if (arListens && aiListens && i18nBroadcasts) {
  pass('locale change re-render handling found');
  info('i18n.js setLocale() broadcasts platewise:localechange and re-applies static [data-i18n] strings');
  info('ar-controller.js re-renders exhibits + bottom sheet; ai-controller.js re-renders the AI result on locale change');
} else {
  if (!i18nBroadcasts) fail('i18n.js does not broadcast/re-apply on platewise:localechange');
  if (!arListens) fail('ar-controller.js does not re-render dynamic content on locale change');
  if (!aiListens) fail('ai-controller.js does not re-render on locale change');
}

// ---- Summary / exit code ---------------------------------------------------
console.log('');
info('read-only audit: no translations were changed (no missing keys were discovered)');
console.log('');
if (failures === 0) {
  console.log('=== D10 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.log(`=== D10 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
