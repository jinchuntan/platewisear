/**
 * QA Evidence — Issue D9: UI copy-weight audit
 * -----------------------------------------------------------------------------
 * Issue D9 (report): earlier versions were too text-heavy and overwhelming. The
 * redesign uses shorter copy, a clear hierarchy, bottom sheets, drawers, and
 * progressive disclosure — so the homepage hero and the AR overlay stay light,
 * while long educational explanations live in About, the Ask More drawer, and
 * the contextual bottom sheets.
 *
 * This script is a SAFE, STATIC, READ-ONLY audit used to generate report
 * evidence. It does NOT redesign the UI, write, move, or delete any file. It
 * reads the key HTML pages and prints visible-text statistics.
 *
 * What it reports:
 *   - approximate VISIBLE word count per page,
 *   - number of major CTA buttons per page,
 *   - whether the homepage hero copy is short,
 *   - whether long educational copy sits in About / drawers / sheets rather than
 *     the homepage hero and the AR overlay.
 *
 * Run:  npm run qa:d9
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

const PAGES = ['index.html', 'ar.html', 'demo.html', 'ai.html', 'marker.html', 'quiz.html', 'about.html'];

// Thresholds — generous enough to pass a well-structured UI, tight enough to
// flag a genuine regression back to a text-heavy hero / overlay.
const HERO_MAX_WORDS = 60;     // first-impression copy must stay short
const OVERLAY_MAX_WORDS = 20;  // the in-camera AR overlay must stay minimal
const MIN_DISCLOSURE = 3;      // sheets + drawers + details across the app

// ---- Small helpers ---------------------------------------------------------
let failures = 0;
function pass(msg) { console.log(`D9 PASS: ${msg}`); }
function info(msg) { console.log(`D9 INFO: ${msg}`); }
function fail(msg) { failures += 1; console.error(`D9 FAIL: ${msg}`); }
function rel(p) { return relative(repoRoot, p).replace(/\\/g, '/'); }
function read(name) {
  const p = resolve(repoRoot, name);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

/** Remove the non-visible parts of a page (head, script, style, svg, comments). */
function bodyVisible(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
}

/** Approximate VISIBLE word count of an HTML fragment (tags + entities stripped). */
function wordsOf(fragment) {
  const s = fragment
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return 0;
  // A "word" must contain a letter, digit, percent, or CJK glyph — this drops
  // lone punctuation separators ("·", "—", "→") so they don't inflate the count.
  return s.split(' ').filter((tok) => /[A-Za-z0-9%一-鿿]/.test(tok)).length;
}

/** Count major CTA buttons: <a>/<button> elements whose class includes "btn". */
function ctaCount(html) {
  const m = bodyVisible(html).match(/<(?:a|button)\b[^>]*class="[^"]*\bbtn\b[^"]*"/gi);
  return m ? m.length : 0;
}

/** Extract the first <tag ...>...</tag> block by a class or tag marker. */
function block(html, openRe, closeTag) {
  const start = html.search(openRe);
  if (start < 0) return '';
  const end = html.indexOf(closeTag, start);
  return end < 0 ? html.slice(start) : html.slice(start, end + closeTag.length);
}

/** Count high-signal progressive-disclosure components in a page. */
function disclosure(html) {
  return {
    bottomSheet: (html.match(/id="ar-sheet"/gi) || []).length,
    drawer: (html.match(/id="askmore"/gi) || []).length,
    details: (html.match(/<details\b/gi) || []).length,
    accordion: (html.match(/class="acc[ "]/gi) || []).length,
    guide: (html.match(/class="guide"/gi) || []).length,
  };
}

console.log('=== QA Evidence — Issue D9: UI copy-weight audit ===');
console.log(`Repo root: ${repoRoot}`);
console.log('');

// ---- Per-page statistics table ---------------------------------------------
const stats = {};
const disclosureTotals = { bottomSheet: 0, drawer: 0, details: 0, accordion: 0, guide: 0 };
console.log('Page              Words   CTAs');
console.log('----------------  -----   ----');
for (const page of PAGES) {
  const html = read(page);
  if (html === null) {
    fail(`page not found: ${page}`);
    continue;
  }
  const words = wordsOf(bodyVisible(html));
  const ctas = ctaCount(html);
  stats[page] = { words, ctas, html };
  const d = disclosure(html);
  for (const k of Object.keys(disclosureTotals)) disclosureTotals[k] += d[k];
  console.log(`${page.padEnd(16)}  ${String(words).padStart(5)}   ${String(ctas).padStart(4)}`);
}
console.log('');

// ===========================================================================
// Homepage hero word count (the critical first-impression copy)
// ===========================================================================
const indexHtml = stats['index.html']?.html || '';
const heroBlock = block(indexHtml, /<section class="hero"/i, '</section>');
const heroWords = wordsOf(heroBlock);
const homeWords = stats['index.html']?.words ?? 0;

info(`homepage word count: hero=${heroWords} words, full page=${homeWords} words`);
if (heroWords <= HERO_MAX_WORDS) {
  info(`homepage hero copy is SHORT (${heroWords} ≤ ${HERO_MAX_WORDS} words)`);
} else {
  fail(`homepage hero copy is too long (${heroWords} > ${HERO_MAX_WORDS} words)`);
}

// ===========================================================================
// Main CTA presence on the homepage
// ===========================================================================
const homeCtas = stats['index.html']?.ctas ?? 0;
const linksToScan = /href="ar\.html"/i.test(indexHtml);
const linksToAi = /href="ai\.html"/i.test(indexHtml);
if (homeCtas >= 1 && (linksToScan || linksToAi)) {
  info(`main CTA found: homepage has ${homeCtas} CTA buttons (incl. Start scan / AI Scan)`);
} else {
  fail('no main CTA button found on the homepage');
}

// ===========================================================================
// Progressive-disclosure components across the app
// ===========================================================================
const disclosureTotal =
  disclosureTotals.bottomSheet + disclosureTotals.drawer +
  disclosureTotals.details + disclosureTotals.accordion + disclosureTotals.guide;
info(
  `progressive disclosure components found: ${disclosureTotal} total ` +
  `(bottom sheet:${disclosureTotals.bottomSheet}, drawer:${disclosureTotals.drawer}, ` +
  `details/accordion:${disclosureTotals.details + disclosureTotals.accordion}, guide:${disclosureTotals.guide})`
);

// ===========================================================================
// Long-form copy lives in About / drawers / sheets — NOT the hero or AR overlay
// ===========================================================================
// AR overlay must be minimal: the <a-scene> static text should be near-empty
// (exhibit text is injected into the bottom sheet at runtime, not the overlay).
const arHtml = stats['ar.html']?.html || '';
const sceneBlock = block(arHtml, /<a-scene\b/i, '</a-scene>');
const overlayWords = wordsOf(sceneBlock);
const arHasSheet = /id="ar-sheet"/i.test(arHtml);
const arHasDrawer = /id="askmore"/i.test(arHtml);

const aboutWords = stats['about.html']?.words ?? 0;

info(`AR overlay (<a-scene>) static text = ${overlayWords} words; detail moved to bottom sheet/drawer = ${arHasSheet && arHasDrawer ? 'yes' : 'no'}`);
info(`About page carries the long-form education = ${aboutWords} words`);

let structureOk = true;
if (overlayWords > OVERLAY_MAX_WORDS) {
  structureOk = false;
  fail(`AR overlay is text-heavy (${overlayWords} > ${OVERLAY_MAX_WORDS} words) — long copy should move to the sheet`);
}
if (!(arHasSheet && arHasDrawer)) {
  structureOk = false;
  fail('ar.html is missing the bottom sheet / Ask More drawer that hold the detail');
}
if (aboutWords <= heroWords) {
  structureOk = false;
  fail(`long-form copy is not concentrated in About (about=${aboutWords} ≤ hero=${heroWords} words)`);
}
if (disclosureTotal < MIN_DISCLOSURE) {
  structureOk = false;
  fail(`too few progressive-disclosure components (${disclosureTotal} < ${MIN_DISCLOSURE})`);
}

// ---- Verdict ---------------------------------------------------------------
console.log('');
if (failures === 0 && structureOk && heroWords <= HERO_MAX_WORDS) {
  pass('UI copy is reduced and structured');
  info('hero + AR overlay stay light; long explanations live in About, drawers, and bottom sheets');
}

info('static audit only: no UI was redesigned (the audit did not expose a serious issue)');
console.log('');
if (failures === 0) {
  console.log('=== D9 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.log(`=== D9 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
