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
 * Recognises ONLY the curated targets in src/food-targets.js — no AI, no
 * arbitrary-image recognition, no food-safety claims.
 */

import { TARGETS, getTargetByIndex, ACTION_LABELS } from './food-targets.js';
import { saveLastAction } from './storage.js';
import { initAskMore } from './askmore.js';
import { debug, isSecureContext } from './utils.js';

const MIND_FILE = './assets/targets/food-waste-targets.mind';
const AR_LOAD_TIMEOUT_MS = 12000;

// --- state ---
let arReady = false;
let started = false;
let currentTarget = null;
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
const markerStatusEl = document.getElementById('marker-status');
const factDisplayEl = document.getElementById('fact-display');
const factSourceEl = document.getElementById('fact-source');
const feedbackPanelEl = document.getElementById('feedback-panel');
const scanHintEl = document.getElementById('scan-hint');

const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');
const btnAskMore = document.getElementById('btn-askmore');

const askMore = initAskMore();

debug('ar-controller.js (MindAR) loaded.');

// ===========================================================================
// Status-screen state machine
// ===========================================================================
const STATUS = {
  permission: { icon: '📷', title: 'Camera permission needed', message: 'Tap “Allow” when your browser asks to use the camera.', spinner: true },
  starting: { icon: '📷', title: 'Starting camera…', message: 'Getting the camera ready — a few seconds.', spinner: true },
  loading: { icon: '🧩', title: 'Loading AR…', message: 'Preparing image tracking.', spinner: true },
  ready: { icon: '✅', title: 'Ready to scan', message: 'Point your phone at a food-waste image.', spinner: false },
  notargets: {
    icon: '🖼️', title: 'Scan targets not installed',
    message: 'The compiled image-target file isn’t set up yet. Add public/assets/targets/food-waste-targets.mind (see README) — or use Demo Mode, which works now.',
    spinner: false, troubleshoot: false, actions: true,
  },
  insecure: { icon: '🔒', title: 'HTTPS required for the camera', message: 'Open this page over HTTPS or on localhost, then try again. Demo Mode works without a camera.', spinner: false, troubleshoot: true, actions: true },
  unsupported: { icon: '🚫', title: 'Camera not supported', message: 'This browser can’t access the camera. Try Chrome / Firefox on Android, or use Demo Mode.', spinner: false, troubleshoot: true, actions: true },
  denied: { icon: '⛔', title: 'Camera permission denied', message: 'Allow camera access for this site, then tap “Try again”.', spinner: false, troubleshoot: true, actions: true },
  nocamera: { icon: '🎥', title: 'No camera found', message: 'No camera was found on this device. Use Demo Mode instead.', spinner: false, troubleshoot: true, actions: true },
  inuse: { icon: '🎥', title: 'Camera unavailable', message: 'Another app or tab is using the camera. Close it, then tap “Try again”.', spinner: false, troubleshoot: true, actions: true },
  failed: { icon: '⚠️', title: 'AR failed to load', message: 'Image tracking could not start in time. Try again, or use Demo Mode.', spinner: false, troubleshoot: true, actions: true },
};

function setStatus(key) {
  const s = STATUS[key];
  if (!s || !statusScreenEl) return;
  statusScreenEl.hidden = false;
  statusIconEl.textContent = s.icon;
  statusTitleEl.textContent = s.title;
  statusMessageEl.textContent = s.message;
  statusSpinnerEl.hidden = !s.spinner;
  statusTroubleshootEl.hidden = !s.troubleshoot;
  statusActionsEl.hidden = !s.actions;
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
 *
 * Dev servers / static hosts often answer a missing file with an HTML fallback
 * (200 text/html). A real .mind is binary, so we reject HTML responses — only
 * a genuine, non-HTML 200 counts as "installed".
 */
async function targetsInstalled() {
  try {
    const res = await fetch(MIND_FILE, { cache: 'no-store' });
    if (!res.ok) return false;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) return false; // SPA/dev fallback, not a real target file
    return true;
  } catch {
    return false;
  }
}

async function startFlow() {
  // 0. targets present?
  if (!(await targetsInstalled())) { setStatus('notargets'); return; }

  // 1. secure context
  if (!isSecureContext()) { setStatus('insecure'); return; }

  // 2. API support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setStatus('unsupported'); return; }

  // 3. permission probe (precise states), then release for MindAR
  setStatus('permission');
  let probe;
  try {
    probe = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (err) {
    setStatus(classifyCameraError(err));
    return;
  }
  probe.getTracks().forEach((t) => t.stop());

  // 4. start MindAR
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
  setStatus('ready');
  setTimeout(() => { hideStatusScreen(); showScanHint(); }, 700);
}
function onArError() {
  if (arReady) return;
  if (loadTimeoutId) clearTimeout(loadTimeoutId);
  debug('EVENT: arError'); setStatus('failed');
}

// MindAR fires these on the scene
sceneEl?.addEventListener('arReady', onArReady);
sceneEl?.addEventListener('arError', onArError);

retryBtn?.addEventListener('click', () => location.reload());

// Release the camera when leaving the page
window.addEventListener('pagehide', () => {
  try { sceneEl?.systems?.['mindar-image-system']?.stop(); } catch { /* noop */ }
});

// ===========================================================================
// Exhibit population + target detection
// ===========================================================================
function populateExhibits() {
  TARGETS.forEach((t, i) => {
    const title = document.getElementById(`arx-title-${i}`);
    const stat = document.getElementById(`arx-stat-${i}`);
    const action = document.getElementById(`arx-action-${i}`);
    title?.setAttribute('value', t.title);
    stat?.setAttribute('value', t.quickFact);
    action?.setAttribute('value', `Best: ${ACTION_LABELS[t.recommendedAction]}`);
  });
  debug('Exhibits populated.');
}

function attachTargetHandlers() {
  const entities = document.querySelectorAll('#mindar-scene [mindar-image-target]');
  entities.forEach((el, i) => {
    el.addEventListener('targetFound', () => onTargetFound(i));
    el.addEventListener('targetLost', () => onTargetLost(i));
  });
  debug('Target handlers attached:', entities.length);
}

function onTargetFound(index) {
  if (lostTimerId) { clearTimeout(lostTimerId); lostTimerId = null; }
  const target = getTargetByIndex(index);
  if (!target) return;
  currentTarget = target;
  debug('EVENT: targetFound', target.id);
  showSheet(target);
}

function onTargetLost(index) {
  // debounce flicker — only drop the sheet if not re-found shortly
  if (lostTimerId) clearTimeout(lostTimerId);
  lostTimerId = setTimeout(() => {
    debug('targetLost (settled)', index);
    currentTarget = null;
    hideSheet();
    showScanHint();
  }, 800);
}

// ===========================================================================
// Bottom sheet
// ===========================================================================
function showScanHint() {
  if (scanHintEl) scanHintEl.hidden = false;
}
function hideScanHint() {
  if (scanHintEl) scanHintEl.hidden = true;
}

function showSheet(target) {
  hideScanHint();
  sheetTypeEl.textContent = target.wasteType;
  sheetTitleEl.textContent = target.title;
  markerStatusEl.textContent = 'Detected';
  markerStatusEl.className = 'status-badge status-badge--found';
  factDisplayEl.textContent = target.quickFact;
  factSourceEl.textContent = `Source: ${target.source}`;
  feedbackPanelEl.textContent = target.defaultMessage;
  feedbackPanelEl.className = 'feedback-panel';

  highlightRecommended(target.recommendedAction);

  sheetEl.hidden = false;
  sheetEl.classList.remove('collapsed');
  requestAnimationFrame(() => sheetEl.classList.add('is-open'));
}

function hideSheet() {
  sheetEl.classList.remove('is-open');
  sheetEl.hidden = true;
}

const actionButtons = { throwAway: btnThrow, saveLeftovers: btnSave, share: btnShare, compost: btnCompost };

function highlightRecommended(actionId) {
  Object.entries(actionButtons).forEach(([id, btn]) => {
    btn?.classList.toggle('is-recommended', id === actionId);
  });
}

// ===========================================================================
// Actions (target-specific guidance)
// ===========================================================================
function applyAction(actionId) {
  if (!currentTarget) return;
  const guidance = currentTarget.actionGuidance[actionId];
  debug('ACTION', actionId, 'on', currentTarget.id);

  feedbackPanelEl.textContent = `${ACTION_LABELS[actionId]}: ${guidance}`;
  feedbackPanelEl.className = 'feedback-panel';
  if (actionId === 'throwAway') feedbackPanelEl.classList.add('feedback-panel--negative');
  else if (actionId === currentTarget.recommendedAction) feedbackPanelEl.classList.add('feedback-panel--positive');
  else feedbackPanelEl.classList.add('feedback-panel--neutral');

  saveLastAction(actionId);
}

btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));
btnAskMore?.addEventListener('click', () => askMore.open(currentTarget));

sheetToggleEl?.addEventListener('click', () => sheetEl.classList.toggle('collapsed'));

// ===========================================================================
// Scene init
// ===========================================================================
if (sceneEl) {
  const onLoaded = () => { populateExhibits(); attachTargetHandlers(); };
  if (sceneEl.hasLoaded) onLoaded();
  else sceneEl.addEventListener('loaded', onLoaded, { once: true });
}

startFlow();
