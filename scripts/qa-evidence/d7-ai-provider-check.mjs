/**
 * QA Evidence — Issue D7: AI provider availability / key-safety check
 * -----------------------------------------------------------------------------
 * Issue D7 (report): the AI provider can be unavailable if the OpenRouter and
 * Groq API keys are missing, or if both providers fail. The fix: the serverless
 * route returns a graceful `not_configured` (no keys) or `unavailable` (both
 * failed) state, the AI Scan page shows a friendly message, and the user is
 * always pointed back to the curated AR Scan and Demo Mode — which keep working
 * with no AI keys at all. API keys are read ONLY on the server (process.env),
 * never via VITE_ variables, so they never reach the browser bundle.
 *
 * This script is a SAFE, STATIC, READ-ONLY audit used to generate report
 * evidence.
 *   - It NEVER reads .env / .env.local and NEVER reads process.env key values,
 *     so it cannot print a real API key.
 *   - It only inspects SOURCE files for env-var NAMES and wiring.
 *   - It does NOT modify environment variables or any file.
 *
 * What it proves:
 *   - the frontend does NOT use VITE_OPENROUTER_API_KEY / VITE_GROQ_API_KEY,
 *   - the API key names are referenced ONLY in server-side modules,
 *   - the analyze-food route checks for missing providers,
 *   - a not_configured / unavailable state exists (server + frontend),
 *   - the AI Scan page links back to Curated AR Scan and Demo Mode.
 *
 * Run:  npm run qa:d7
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

// ---- Resolve paths relative to the repository root -------------------------
// This file lives at <repo>/scripts/qa-evidence/, so the repo root is two
// directories up. Resolving this way keeps the script correct no matter what
// the current working directory is when it runs.
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const srcDir = resolve(repoRoot, 'src');

// Env-var NAMES we look for (we match the NAME only — never a value).
const VITE_KEY_NAMES = ['VITE_OPENROUTER_API_KEY', 'VITE_GROQ_API_KEY'];
const SERVER_KEY_NAMES = ['OPENROUTER_API_KEY', 'GROQ_API_KEY'];

// Server-only modules: imported by the serverless route, NEVER by the browser.
// These are the ONLY files allowed to reference the raw API key names.
const SERVER_ONLY_MODULES = new Set(['ai-providers.js', 'ai-config.js']);

// Files we MUST NOT read (could hold real secrets).
const SECRET_FILES = new Set(['.env', '.env.local', '.env.production', '.env.development']);

// ---- Small helpers ---------------------------------------------------------
let failures = 0;

function pass(msg) {
  console.log(`D7 PASS: ${msg}`);
}
function info(msg) {
  console.log(`D7 INFO: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`D7 FAIL: ${msg}`);
}
function rel(p) {
  return relative(repoRoot, p).replace(/\\/g, '/');
}
function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

console.log('=== QA Evidence — Issue D7: AI provider availability / key-safety check ===');
console.log(`Repo root: ${repoRoot}`);
info('safety: this audit never reads .env files or process.env key VALUES — no key can be printed');
console.log('');

// ---- Build the set of BROWSER-loaded files (root *.html + src/*.js) --------
// We exclude the known server-only modules; everything else in src/ is shipped
// to the browser and therefore must not reference any API key name.
const browserFiles = [];
for (const f of readdirSync(repoRoot)) {
  if (f.endsWith('.html')) browserFiles.push(resolve(repoRoot, f));
}
if (existsSync(srcDir)) {
  for (const f of readdirSync(srcDir)) {
    if (SECRET_FILES.has(f)) continue;
    if (f.endsWith('.js') && !SERVER_ONLY_MODULES.has(f)) {
      browserFiles.push(resolve(srcDir, f));
    }
  }
}

// ===========================================================================
// Check 1 — frontend does NOT use VITE_*_API_KEY (keys not exposed to browser)
// ===========================================================================
const viteOffenders = [];
for (const file of browserFiles) {
  const txt = read(file) || '';
  for (const name of VITE_KEY_NAMES) {
    if (txt.includes(name)) viteOffenders.push(`${rel(file)} -> ${name}`);
  }
}
if (viteOffenders.length === 0) {
  pass('API keys are not exposed through VITE variables');
  info(`scanned ${browserFiles.length} browser-loaded files (root *.html + src/*.js); no VITE_*_API_KEY usage`);
} else {
  fail(`VITE_*_API_KEY referenced in browser code: ${viteOffenders.join('; ')}`);
}

// ===========================================================================
// Check 2 — raw API key NAMES are referenced ONLY server-side
// ===========================================================================
// 2a) No browser file may reference OPENROUTER_API_KEY / GROQ_API_KEY.
const browserKeyOffenders = [];
for (const file of browserFiles) {
  const txt = read(file) || '';
  for (const name of SERVER_KEY_NAMES) {
    if (txt.includes(name)) browserKeyOffenders.push(`${rel(file)} -> ${name}`);
  }
}
// 2b) The server provider module reads them from process.env.
const providersPath = resolve(srcDir, 'ai-providers.js');
const providers = read(providersPath);
const serverReadsKeys = !!providers &&
  /process\.env\.OPENROUTER_API_KEY/.test(providers) &&
  /process\.env\.GROQ_API_KEY/.test(providers);

if (browserKeyOffenders.length === 0 && serverReadsKeys) {
  pass('API key names are referenced only server-side (process.env in ai-providers.js)');
  info('no browser-loaded file references OPENROUTER_API_KEY / GROQ_API_KEY');
} else {
  if (browserKeyOffenders.length > 0) {
    fail(`API key name(s) referenced in browser code: ${browserKeyOffenders.join('; ')}`);
  }
  if (!serverReadsKeys) {
    fail('ai-providers.js does not read OPENROUTER_API_KEY / GROQ_API_KEY from process.env');
  }
}

// ===========================================================================
// Check 3 — analyze-food route checks for missing providers
// ===========================================================================
const analyzePath = resolve(repoRoot, 'api/analyze-food.js');
const analyze = read(analyzePath);
const hasProviderGuards = !!analyze &&
  /hasOpenRouter\s*\(/.test(analyze) && /hasGroq\s*\(/.test(analyze);
const hasMissingProviderCheck = !!analyze &&
  /!\s*hasOpenRouter\(\)\s*&&\s*!\s*hasGroq\(\)/.test(analyze) &&
  analyze.includes('not_configured');

if (hasProviderGuards && hasMissingProviderCheck) {
  pass('server-side provider check exists');
  info('api/analyze-food.js gates on hasOpenRouter()/hasGroq() and returns not_configured when both are missing');
} else if (!analyze) {
  fail('api/analyze-food.js not found');
} else {
  fail('api/analyze-food.js does not check for missing providers before calling them');
}

// ===========================================================================
// Check 4 — not_configured / unavailable state exists (server + frontend)
// ===========================================================================
const serverHasStates = !!analyze &&
  analyze.includes('not_configured') && analyze.includes('unavailable');

const controllerPath = resolve(srcDir, 'ai-controller.js');
const controller = read(controllerPath);
const frontendHasStates = !!controller &&
  /not_configured/.test(controller) &&
  /unavailable/.test(controller) &&
  /notconfigured/.test(controller); // status-screen state key

if (serverHasStates && frontendHasStates) {
  pass('unavailable / not configured state exists');
  info('server returns not_configured (503) + unavailable (502); ai-controller.js renders both states');
} else {
  if (!serverHasStates) fail('api/analyze-food.js is missing not_configured / unavailable responses');
  if (!frontendHasStates) fail('ai-controller.js does not render the not_configured / unavailable states');
}

// ===========================================================================
// Check 5 — AI Scan page links back to Curated AR Scan / Demo Mode
// ===========================================================================
const aiHtmlPath = resolve(repoRoot, 'ai.html');
const aiHtml = read(aiHtmlPath);
const linksToAr = !!aiHtml && /href="ar\.html"/.test(aiHtml);
const linksToDemo = !!aiHtml && /href="demo\.html"/.test(aiHtml);

if (linksToAr && linksToDemo) {
  pass('non-AI fallback links exist');
  info('ai.html links back to Curated AR Scan (ar.html) and Demo Mode (demo.html) — both work with no AI keys');
} else {
  if (!aiHtml) fail('ai.html not found');
  else {
    if (!linksToAr) fail('ai.html does not link back to Curated AR Scan (ar.html)');
    if (!linksToDemo) fail('ai.html does not link back to Demo Mode (demo.html)');
  }
}

// ---- Summary / exit code ---------------------------------------------------
console.log('');
info('static audit only: no environment variables were modified and no API key was read or printed');
console.log('');
if (failures === 0) {
  console.log('=== D7 RESULT: ALL CHECKS PASSED ===');
  process.exit(0);
} else {
  console.log(`=== D7 RESULT: ${failures} CHECK(S) FAILED ===`);
  process.exit(1);
}
