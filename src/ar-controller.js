/**
 * ar-controller.js — MindAR image-target experience for PlateWise AR.
 *
 * Flow:
 *   1. Check the compiled image-target file exists (graceful "not installed").
 *   2. Camera pre-checks: secure context → getUserMedia support → permission
 *      probe (precise states) → start MindAR.
 *   3. When a curated food-waste image is detected, MindAR shows its anchored
 *      AR exhibit card and we raise a contextual bottom sheet with that
 *      target's content and actions. When the image is lost, we drop back to a
 *      "scan" hint.
 *   4. Actions (Throw / Save / Share / Compost) give target-specific guidance;
 *      "Ask more" opens a static educational drawer.
 *
 * All user-facing copy is localised via src/i18n.js (EN / BM / 中文); see t().
 * Recognises ONLY the curated targets in src/food-targets.js — no AI, no
 * arbitrary-image recognition, no food-safety claims.
 */

import { TARGETS, getTargetByIndex, localizedTarget, actionLabel } from './food-targets.js';
import { saveLastAction, getScanGuideSeen, setScanGuideSeen } from './storage.js';
import { initAskMore } from './askmore.js';
import { debug, isSecureContext, prefersReducedMotion } from './utils.js';
import { t, initI18n, mountLanguageSwitcher } from './i18n.js';

const MIND_FILE = './assets/targets/food-waste-targets.mind';
const AR_LOAD_TIMEOUT_MS = 12000;

// --- state ---
let arReady = false;
let started = false;
let currentTarget = null;     // raw target (re-localised at render time)
let lastActionId = null;      // chosen action this detection, or null
let currentStatusKey = null;  // last status shown (for re-localising on lang change)
let loadTimeoutId = null;
let lostTimerId = null;

// --- status screen refs ---
const statusScreenEl = document.getElementById('ar-status-screen');
const statusIconEl = document.getElementById('ar-status-icon');
const statusTitleEl = document.getElementById('ar-status-title');
const statusMessageEl = document.getElementById('ar-status-message');
const statusSpinnerEl = document.getElementById('ar-status-spinner');
const statusTroubleshootEl = document.getElementById('ar-status-troubleshoot');
const statusActionsEl = document.getElementById('ar-status-actions');
const retryBtn = document.getElementById('ar-retry');

// --- scene + sheet refs ---
const sceneEl = document.getElementById('mindar-scene');
const sheetEl = document.getElementById('ar-sheet');
const sheetToggleEl = document.getElementById('sheet-toggle');
const sheetTypeEl = document.getElementById('sheet-type');
const sheetTitleEl = document.getElementById('sheet-title');
const sheetStepEl = document.getElementById('sheet-step');
const markerStatusEl = document.getElementById('marker-status');
const factDisplayEl = document.getElementById('fact-display');
const factSourceEl = document.getElementById('fact-source');
const feedbackPanelEl = document.getElementById('feedback-panel');
const scanHintEl = document.getElementById('scan-hint');
const tapCueEl = document.getElementById('ar-tap-cue');     // "Tap for actions" cue
const actionsEl = document.querySelector('#ar-sheet .actions');

// --- top bar + first-time guide refs ---
const arTopbarEl = document.getElementById('ar-topbar');
const howToBtn = document.getElementById('how-to-btn');
const scanGuideEl = document.getElementById('scan-guide');
const scanGuideBackdrop = document.getElementById('scan-guide-backdrop');
const scanGuideDismiss = document.getElementById('scan-guide-dismiss');
const langMountEl = document.getElementById('ar-lang-mount');

const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');
const btnAskMore = document.getElementById('btn-askmore');

const askMore = initAskMore();

debug('ar-controller.js (MindAR) loaded.');

// Translate the static page chrome + set <html lang>, then mount the switcher.
initI18n();
if (langMountEl) mountLanguageSwitcher(langMountEl);

// ar.html doesn't load app.js, so set the reduced-motion class here too.
if (prefersReducedMotion()) document.body.classList.add('reduced-motion');

// ===========================================================================
// Lightweight debug indicator — only when the URL has ?debug (e.g. ?debug=1).
// ===========================================================================
const DEBUG_ON = new URLSearchParams(location.search).has('debug');
let debugEl = null;
if (DEBUG_ON) {
  debugEl = document.createElement('div');
  debugEl.className = 'ar-debug';
  debugEl.textContent = 'debug: starting…';
  document.body.appendChild(debugEl);
}
function setDebug(msg) {
  if (debugEl) debugEl.textContent = `debug:\n${msg}`;
}

// ===========================================================================
// Status-screen state machine
// Flags live here; the title/message come from i18n (scan.status.<key>).
// ===========================================================================
const STATUS_META = {
  permission: { icon: '📷', spinner: true },
  starting: { icon: '📷', spinner: true },
  loading: { icon: '🧩', spinner: true },
  ready: { icon: '✅', spinner: false },
  notargets: { icon: '🖼️', spinner: false, troubleshoot: false, actions: true },
  insecure: { icon: '🔒', spinner: false, troubleshoot: true, actions: true },
  unsupported: { icon: '🚫', spinner: false, troubleshoot: true, actions: true },
  denied: { icon: '⛔', spinner: false, troubleshoot: true, actions: true },
  nocamera: { icon: '🎥', spinner: false, troubleshoot: true, actions: true },
  inuse: { icon: '🎥', spinner: false, troubleshoot: true, actions: true },
  failed: { icon: '⚠️', spinner: false, troubleshoot: true, actions: true },
};

function setStatus(key) {
  const meta = STATUS_META[key];
  if (!meta || !statusScreenEl) return;
  currentStatusKey = key;
  statusScreenEl.hidden = false;
  statusIconEl.textContent = meta.icon;
  statusTitleEl.textContent = t(`scan.status.${key}.title`) || '';
  statusMessageEl.textContent = t(`scan.status.${key}.message`) || '';
  statusSpinnerEl.hidden = !meta.spinner;
  statusTroubleshootEl.hidden = !meta.troubleshoot;
  statusActionsEl.hidden = !meta.actions;
  debug('AR status →', key);
}
function hideStatusScreen() { if (statusScreenEl) statusScreenEl.hidden = true; }

// ===========================================================================
// Camera / AR start-up
// ===========================================================================
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

function classifyCameraError(err) {
  const name = (err && err.name) || '';
  debug('Camera probe error:', name, err && err.message);
  switch (name) {
    case 'NotAllowedError': case 'PermissionDeniedError': case 'SecurityError': return 'denied';
    case 'NotFoundError': case 'DevicesNotFoundError': case 'OverconstrainedError': case 'ConstraintNotSatisfiedError': return 'nocamera';
    case 'NotReadableError': case 'TrackStartError': case 'AbortError': return 'inuse';
    default: return 'failed';
  }
}

/**
 * Does the compiled .mind file actually exist? (graceful degradation)
 * Dev servers often answer a missing file with an HTML fallback (200 text/html);
 * a real .mind is binary, so we reject HTML — only a non-HTML 200 counts.
 */
async function targetsInstalled() {
  try {
    const res = await fetch(MIND_FILE, { cache: 'no-store' });
    if (!res.ok) return false;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) return false;
    return true;
  } catch {
    return false;
  }
}

async function startFlow() {
  if (!(await targetsInstalled())) { setStatus('notargets'); return; }
  if (!isSecureContext()) { setStatus('insecure'); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setStatus('unsupported'); return; }

  setStatus('permission');
  let probe;
  try {
    probe = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (err) {
    setStatus(classifyCameraError(err));
    return;
  }
  probe.getTracks().forEach((tr) => tr.stop());

  setStatus('starting');
  await wait(300);
  startMindAR();
  startLoadTimeout();
}

function startMindAR() {
  if (started || !sceneEl) return;
  const begin = () => {
    const sys = sceneEl.systems && sceneEl.systems['mindar-image-system'];
    if (!sys) { setStatus('failed'); return; }
    setStatus('loading');
    try { sys.start(); started = true; debug('MindAR started.'); }
    catch (e) { debug('MindAR start error', e); setStatus('failed'); }
  };
  if (sceneEl.hasLoaded) begin();
  else sceneEl.addEventListener('loaded', begin, { once: true });
}

function startLoadTimeout() {
  loadTimeoutId = setTimeout(() => {
    if (!arReady) { debug('AR load timed out'); setStatus('failed'); }
  }, AR_LOAD_TIMEOUT_MS);
}

function onArReady() {
  if (arReady) return;
  arReady = true;
  if (loadTimeoutId) clearTimeout(loadTimeoutId);
  debug('EVENT: arReady');
  setDebug('ready — point at a target');
  hideStatusScreen();
  if (arTopbarEl) arTopbarEl.hidden = false;
  showScanHint();
  if (!getScanGuideSeen()) setTimeout(openGuide, 500);
}
function onArError() {
  if (arReady) return;
  if (loadTimeoutId) clearTimeout(loadTimeoutId);
  debug('EVENT: arError'); setStatus('failed');
}

sceneEl?.addEventListener('arReady', onArReady);
sceneEl?.addEventListener('arError', onArError);

retryBtn?.addEventListener('click', () => location.reload());

window.addEventListener('pagehide', () => {
  try { sceneEl?.systems?.['mindar-image-system']?.stop(); } catch { /* noop */ }
});

// ===========================================================================
// Exhibit population + target detection
// ===========================================================================
function populateExhibits() {
  // Minimal 3D card: localised title + (static SDG 12 pill) + best-action badge.
  // NOTE: A-Frame's default MSDF font renders Latin glyphs (EN/BM). Chinese
  // glyphs need a custom MSDF font (future work); the bottom sheet always shows
  // the full localised content as HTML, so no information is lost.
  TARGETS.forEach((tg, i) => {
    const lt = localizedTarget(tg);
    const titleEl = document.getElementById(`arx-title-${i}`);
    const actionEl = document.getElementById(`arx-action-${i}`);
    titleEl?.setAttribute('value', lt.title);
    actionEl?.setAttribute('value', `${t('common.bestPrefix') || 'Best: '}${actionLabel(tg.recommendedAction)}`);
  });
  debug('Exhibits populated.');
}

/** Read the real targetIndex from the component (not DOM order). */
function readTargetIndex(el, fallback) {
  const parsed = el.getAttribute('mindar-image-target');
  if (parsed && typeof parsed === 'object' && parsed.targetIndex != null) {
    return Number(parsed.targetIndex);
  }
  const raw = (typeof parsed === 'string' ? parsed : el.attributes['mindar-image-target']?.value) || '';
  const m = /targetIndex\s*:\s*(\d+)/.exec(raw);
  return m ? Number(m[1]) : fallback;
}

function attachTargetHandlers() {
  const entities = document.querySelectorAll('#mindar-scene [mindar-image-target]');
  entities.forEach((el, i) => {
    const index = readTargetIndex(el, i);
    el.addEventListener('targetFound', () => onTargetFound(index));
    el.addEventListener('targetLost', () => onTargetLost(index));
  });
  debug('Target handlers attached:', entities.length);
}

function onTargetFound(index) {
  if (lostTimerId) { clearTimeout(lostTimerId); lostTimerId = null; }
  const target = getTargetByIndex(index);
  debug('targetFound index:', index, target ? `→ ${target.id} (${target.title})` : '→ (no content mapped)');
  if (!target) { setDebug(`found #${index}\n(no content mapped)`); return; }
  currentTarget = target;
  setDebug(`found #${index}\n${target.id} — ${target.title}`);
  showSheet(target);
}

function onTargetLost(index) {
  debug('targetLost index:', index);
  if (lostTimerId) clearTimeout(lostTimerId);
  lostTimerId = setTimeout(() => {
    debug('targetLost (settled) index:', index);
    setDebug(`lost #${index}\nscanning…`);
    currentTarget = null;
    lastActionId = null;
    hideSheet();
    showScanHint();
  }, 800);
}

// ===========================================================================
// Bottom sheet
// ===========================================================================
function showScanHint() { if (scanHintEl) scanHintEl.hidden = false; }
function hideScanHint() { if (scanHintEl) scanHintEl.hidden = true; }

// "Tap for actions" cue — only meaningful before the user has chosen an action.
function showTapCue() { if (tapCueEl && !lastActionId) tapCueEl.hidden = false; }
function hideTapCue() { if (tapCueEl) tapCueEl.hidden = true; }

const actionButtons = { throwAway: btnThrow, saveLeftovers: btnSave, share: btnShare, compost: btnCompost };

function highlightRecommended(actionId) {
  Object.entries(actionButtons).forEach(([id, btn]) => {
    btn?.classList.toggle('is-recommended', id === actionId);
  });
}

/** Fill the sheet's text from the current target + chosen action (localised). */
function renderSheetText() {
  if (!currentTarget) return;
  const lt = localizedTarget(currentTarget);
  sheetTypeEl.textContent = lt.wasteType;
  sheetTitleEl.textContent = lt.title;
  markerStatusEl.textContent = t('scan.detected') || 'Detected';
  markerStatusEl.className = 'status-badge status-badge--found';
  factDisplayEl.textContent = lt.quickFact;
  factSourceEl.textContent = `${t('common.sourcePrefix') || 'Source: '}${lt.source}`;

  if (lastActionId) {
    const guidance = lt.actionGuidance[lastActionId];
    feedbackPanelEl.textContent = `${actionLabel(lastActionId)}: ${guidance}`;
    feedbackPanelEl.className = 'feedback-panel';
    if (lastActionId === 'throwAway') feedbackPanelEl.classList.add('feedback-panel--negative');
    else if (lastActionId === currentTarget.recommendedAction) feedbackPanelEl.classList.add('feedback-panel--positive');
    else feedbackPanelEl.classList.add('feedback-panel--neutral');
    if (sheetStepEl) sheetStepEl.textContent = t('scan.step3');
  } else {
    feedbackPanelEl.textContent = lt.defaultMessage;
    feedbackPanelEl.className = 'feedback-panel';
    if (sheetStepEl) sheetStepEl.textContent = t('scan.step2');
  }

  highlightRecommended(currentTarget.recommendedAction);
}

function showSheet(target) {
  hideScanHint();
  currentTarget = target;
  lastActionId = null;
  renderSheetText();

  // Open compact first (keeps the AR exhibit visible); user expands via handle.
  sheetEl.hidden = false;
  sheetEl.classList.remove('is-expanded');
  requestAnimationFrame(() => sheetEl.classList.add('is-open'));
  showTapCue();
}

function hideSheet() {
  sheetEl.classList.remove('is-open', 'is-expanded');
  sheetEl.hidden = true;
  hideTapCue();
}

// ===========================================================================
// AR-layer interaction — tapping the exhibit card focuses the action choices.
// The real Throw/Save/Share/Compost buttons stay in the sheet (reliable path);
// if a browser drops the 3D tap, nothing breaks — the sheet still works.
// ===========================================================================
function onArCardTap(index) {
  const target = getTargetByIndex(index);
  debug('AR card tapped index:', index, target ? `→ ${target.id} (${target.title})` : '→ (no content mapped)');
  if (!target) return;

  // Make sure the sheet reflects the tapped card.
  if (!currentTarget || currentTarget.targetIndex !== target.targetIndex) {
    showSheet(target);
  }

  // Bring attention to the action choices.
  sheetEl.hidden = false;
  sheetEl.classList.add('is-open', 'is-expanded');
  if (sheetStepEl) sheetStepEl.textContent = t('scan.step2');
  if (!lastActionId) {
    feedbackPanelEl.textContent = t('scan.chooseActionBelow') || 'Choose an action below';
    feedbackPanelEl.className = 'feedback-panel feedback-panel--neutral';
  }
  hideTapCue();

  if (actionsEl) {
    actionsEl.classList.remove('is-attn');
    void actionsEl.offsetWidth;          // restart the one-shot attention pulse
    actionsEl.classList.add('is-attn');
    setTimeout(() => actionsEl.classList.remove('is-attn'), 1300);
  }
}

function attachCardTapHandlers() {
  const hits = document.querySelectorAll('#mindar-scene .ar-card-hit');
  hits.forEach((el) => {
    const anchor = el.closest('[mindar-image-target]');
    const index = anchor ? readTargetIndex(anchor, 0) : 0;
    el.addEventListener('click', () => onArCardTap(index));
  });
  debug('AR card tap handlers attached:', hits.length);
}

// A-Frame animations don't honour prefers-reduced-motion automatically.
function applyReducedMotionToCues() {
  if (!prefersReducedMotion()) return;
  document.querySelectorAll('#mindar-scene .ar-cue [animation__pulse]')
    .forEach((el) => el.removeAttribute('animation__pulse'));
}

// ===========================================================================
// Actions (target-specific guidance)
// ===========================================================================
function applyAction(actionId) {
  if (!currentTarget) return;
  lastActionId = actionId;
  hideTapCue();
  debug('ACTION', actionId, 'on', currentTarget.id);
  renderSheetText();
  saveLastAction(actionId);
}

btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));
btnAskMore?.addEventListener('click', () => askMore.open(currentTarget));

sheetToggleEl?.addEventListener('click', () => {
  const expanded = sheetEl.classList.toggle('is-expanded');
  if (expanded) hideTapCue();
});

// ===========================================================================
// First-time "How to scan" guide
// ===========================================================================
function openGuide() {
  if (!scanGuideEl) return;
  scanGuideEl.hidden = false;
  scanGuideDismiss?.focus();
}
function closeGuide() {
  if (scanGuideEl) scanGuideEl.hidden = true;
  setScanGuideSeen();
}

howToBtn?.addEventListener('click', openGuide);
scanGuideDismiss?.addEventListener('click', closeGuide);
scanGuideBackdrop?.addEventListener('click', closeGuide);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && scanGuideEl && !scanGuideEl.hidden) closeGuide();
});

// ===========================================================================
// Language change — re-render dynamic content (static DOM is handled by i18n)
// ===========================================================================
window.addEventListener('platewise:localechange', () => {
  if (currentStatusKey && statusScreenEl && !statusScreenEl.hidden) setStatus(currentStatusKey);
  populateExhibits();
  if (currentTarget && !sheetEl.hidden) renderSheetText();
});

// ===========================================================================
// Scene init
// ===========================================================================
if (sceneEl) {
  const onLoaded = () => {
    populateExhibits();
    attachTargetHandlers();
    attachCardTapHandlers();
    applyReducedMotionToCues();
  };
  if (sceneEl.hasLoaded) onLoaded();
  else sceneEl.addEventListener('loaded', onLoaded, { once: true });
}

startFlow();
