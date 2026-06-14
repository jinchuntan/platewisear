/**
 * ar-controller.js — Controls camera start-up, the A-Frame AR scene, and the DOM overlay.
 *
 * Responsibilities:
 *  1. Camera/AR lifecycle with clear user-facing states:
 *       secure-context check → getUserMedia support check → permission probe →
 *       mount the AR scene → wait for the camera/AR to be ready (with a timeout).
 *     Every state is surfaced on the full-screen #ar-status-screen, and any
 *     failure offers troubleshooting text plus a Demo Mode fallback.
 *  2. Listen for marker found / lost events and update the DOM status badge.
 *  3. Drive the 4-step learning-flow progress indicator.
 *  4. Manage fact navigation (previous / next) including the source citation.
 *  5. Handle action button clicks — update AR entity visibility/scale, AR + DOM
 *     feedback, and persist the last chosen action to localStorage.
 *
 * This file is heavily commented for use in the technical report.
 */

import { facts, actions } from './content.js';
import { saveLastAction } from './storage.js';
import { debug, isSecureContext } from './utils.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Index of the currently displayed fact (0-based). */
let currentFactIndex = 0;

/** Whether the Hiro marker is currently detected by the camera. */
let markerVisible = false;

/** Whether the camera/AR has reached the ready state. */
let arReady = false;

/** Whether the AR scene has been injected into the DOM yet. */
let sceneMounted = false;

/** Highest reached step in the learning-flow progress indicator (1–4). */
let progressStep = 0;

/** Timers (kept so they can be cleared). */
let loadTimeoutId = null;
let stepFourTimerId = null;

/** How long to wait for the camera/AR before declaring failure (ms). */
const AR_LOAD_TIMEOUT_MS = 10000;

// ---------------------------------------------------------------------------
// DOM references — status screen
// ---------------------------------------------------------------------------

const statusScreenEl = document.getElementById('ar-status-screen');
const statusIconEl = document.getElementById('ar-status-icon');
const statusTitleEl = document.getElementById('ar-status-title');
const statusMessageEl = document.getElementById('ar-status-message');
const statusSpinnerEl = document.getElementById('ar-status-spinner');
const statusTroubleshootEl = document.getElementById('ar-status-troubleshoot');
const statusActionsEl = document.getElementById('ar-status-actions');
const retryBtn = document.getElementById('ar-retry');

// ---------------------------------------------------------------------------
// DOM references — overlay panel (static; lives in the page, hidden until ready)
// ---------------------------------------------------------------------------

const overlayEl = document.getElementById('ar-overlay');
const overlayToggleEl = document.getElementById('overlay-toggle');
const markerStatusEl = document.getElementById('marker-status');
const factDisplayEl = document.getElementById('fact-display');
const factSourceEl = document.getElementById('fact-source');
const feedbackPanelEl = document.getElementById('feedback-panel');
const quizLinkEl = document.getElementById('quiz-link');

// Buttons
const btnPrev = document.getElementById('btn-prev-fact');
const btnNext = document.getElementById('btn-next-fact');
const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');

// AR entity references (resolved after the scene is mounted + loaded)
let arFoodPile, arWaste, arSave, arShare, arCompost, arFactText, arFactSource, arFeedbackText;

debug('ar-controller.js loaded — beginning camera pre-checks…');

// ===========================================================================
// 1. Status-screen state machine
// ===========================================================================

/**
 * Definitions for every user-facing camera/AR state.
 * `spinner` shows the loading spinner; `troubleshoot`/`actions` reveal the
 * troubleshooting tips and the retry/demo buttons (used for error states).
 */
const STATUS = {
  // --- loading states ---
  permission: {
    icon: '📷',
    title: 'Camera permission needed',
    message: 'Please tap “Allow” when your browser asks to use the camera.',
    spinner: true, troubleshoot: false, actions: false,
  },
  starting: {
    icon: '📷',
    title: 'Starting camera…',
    message: 'Getting the camera ready — this can take a few seconds.',
    spinner: true, troubleshoot: false, actions: false,
  },
  loading: {
    icon: '🧩',
    title: 'Loading AR…',
    message: 'Preparing the augmented-reality scene.',
    spinner: true, troubleshoot: false, actions: false,
  },
  ready: {
    icon: '✅',
    title: 'AR ready',
    message: 'Point your camera at the Hiro marker to begin.',
    spinner: false, troubleshoot: false, actions: false,
  },
  // --- error states ---
  insecure: {
    icon: '🔒',
    title: 'HTTPS required for the camera',
    message:
      'Camera access only works over HTTPS or on localhost. Open this page on a secure (https) link, then try again. You can still use Demo Mode without a camera.',
    spinner: false, troubleshoot: true, actions: true,
  },
  unsupported: {
    icon: '🚫',
    title: 'Camera not supported',
    message:
      'This browser does not support camera access (getUserMedia). Try Chrome or Firefox on Android, or use Demo Mode.',
    spinner: false, troubleshoot: true, actions: true,
  },
  denied: {
    icon: '⛔',
    title: 'Camera permission denied',
    message:
      'Camera access was blocked. Allow camera access for this site in your browser settings, then tap “Try Again”.',
    spinner: false, troubleshoot: true, actions: true,
  },
  nocamera: {
    icon: '🎥',
    title: 'No camera found',
    message: 'No camera could be found on this device. Connect a camera, or use Demo Mode.',
    spinner: false, troubleshoot: true, actions: true,
  },
  inuse: {
    icon: '🎥',
    title: 'Camera unavailable',
    message: 'The camera is being used by another app or tab. Close it, then tap “Try Again”.',
    spinner: false, troubleshoot: true, actions: true,
  },
  failed: {
    icon: '⚠️',
    title: 'AR failed to load',
    message:
      'The AR experience could not start in time. Check the tips below, then try again — or use Demo Mode.',
    spinner: false, troubleshoot: true, actions: true,
  },
};

/**
 * Show a status on the full-screen status layer.
 * @param {keyof STATUS} key
 */
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

function hideStatusScreen() {
  if (statusScreenEl) statusScreenEl.hidden = true;
}

function showOverlay() {
  if (overlayEl) overlayEl.hidden = false;
}

// ===========================================================================
// 2. Camera / AR start-up flow
// ===========================================================================

/** Small promise-based delay helper. */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Map a getUserMedia DOMException to a user-facing status.
 * @param {DOMException|Error} err
 */
function classifyCameraError(err) {
  const name = (err && err.name) || '';
  debug('Camera probe error:', name, err && err.message);
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return 'denied';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'nocamera';
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return 'inuse';
    default:
      return 'failed';
  }
}

/**
 * Drive the whole start-up sequence. Each guard surfaces a precise state so
 * the user always knows what to do next.
 */
async function startCameraFlow() {
  // (a) Secure-context check — camera APIs require HTTPS or localhost.
  if (!isSecureContext()) {
    setStatus('insecure');
    return;
  }

  // (b) API-support check — does this browser expose getUserMedia?
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus('unsupported');
    return;
  }

  // (c) Permission probe — request the camera ourselves first so we can report
  //     the exact outcome (granted / denied / no camera / in use). We then stop
  //     the probe stream and let AR.js acquire the (now-permitted) camera once.
  setStatus('permission');
  let probeStream;
  try {
    probeStream = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (err) {
    setStatus(classifyCameraError(err));
    return;
  }

  // Release the probe stream so AR.js can take the camera cleanly.
  probeStream.getTracks().forEach((track) => track.stop());

  // (d) Mount the AR scene and wait for the camera/AR to come up.
  setStatus('starting');
  await wait(350); // give the device a moment to release the camera
  mountScene();
  startLoadTimeout();
}

/**
 * Clone the inert <a-scene> template into the page. A-Frame + AR.js initialise
 * only now, guaranteeing a single clean camera acquisition.
 */
function mountScene() {
  if (sceneMounted) return;
  const tmpl = document.getElementById('ar-scene-template');
  const mount = document.getElementById('ar-scene-mount');
  if (!tmpl || !mount) {
    setStatus('failed');
    return;
  }
  mount.appendChild(tmpl.content.cloneNode(true));
  sceneMounted = true;
  debug('AR scene mounted.');

  const scene = mount.querySelector('a-scene');
  if (scene) {
    if (scene.hasLoaded) onSceneLoaded();
    else scene.addEventListener('loaded', onSceneLoaded);
  }
}

/** Fail the experience if the camera/AR has not become ready in time. */
function startLoadTimeout() {
  loadTimeoutId = setTimeout(() => {
    if (!arReady) {
      debug('Camera/AR load timed out after', AR_LOAD_TIMEOUT_MS, 'ms');
      setStatus('failed');
    }
  }, AR_LOAD_TIMEOUT_MS);
}

/**
 * Once the scene is loaded: resolve AR entity references, attach marker
 * handlers, and (if not already) advance the loading state.
 */
function onSceneLoaded() {
  arFoodPile = document.getElementById('ar-food-pile');
  arWaste = document.getElementById('ar-waste');
  arSave = document.getElementById('ar-save');
  arShare = document.getElementById('ar-share');
  arCompost = document.getElementById('ar-compost');
  arFactText = document.getElementById('ar-fact-text');
  arFactSource = document.getElementById('ar-fact-source');
  arFeedbackText = document.getElementById('ar-feedback-text');
  debug('AR entities resolved.');

  attachMarkerHandlers();

  if (!arReady) setStatus('loading');
}

/**
 * AR.js dispatches `arjs-video-loaded` on window when the camera feed is live.
 * That is our definitive "AR ready" signal.
 */
function onArVideoLoaded() {
  if (arReady) return;
  arReady = true;
  if (loadTimeoutId) clearTimeout(loadTimeoutId);
  debug('EVENT: arjs-video-loaded — camera live, AR ready.');

  setStatus('ready');
  // Briefly show the "AR ready" confirmation, then reveal the live camera + overlay.
  setTimeout(() => {
    hideStatusScreen();
    showOverlay();
    setProgress(1); // Step 1: Scan marker
  }, 700);
}

/** AR.js dispatches `camera-error` on window if its own getUserMedia fails. */
function onArCameraError() {
  if (arReady) return;
  if (loadTimeoutId) clearTimeout(loadTimeoutId);
  debug('EVENT: camera-error from AR.js.');
  setStatus('failed');
}

// AR.js events fire on window — safe to listen even before the scene mounts.
window.addEventListener('arjs-video-loaded', onArVideoLoaded);
window.addEventListener('camera-error', onArCameraError);

// Retry simply reloads the page for a clean camera re-acquisition.
retryBtn?.addEventListener('click', () => {
  debug('Retry requested — reloading.');
  location.reload();
});

// ===========================================================================
// 3. Learning-flow progress indicator
// ===========================================================================

/**
 * Set the active step (1–4). Steps below it are marked complete; the indicator
 * only ever moves forward so losing the marker never rewinds progress.
 * @param {number} step
 */
function setProgress(step) {
  if (step <= progressStep) return;
  progressStep = step;
  document.querySelectorAll('#ar-progress .ar-progress__step').forEach((el) => {
    const n = Number(el.getAttribute('data-step'));
    el.classList.remove('is-active', 'is-done');
    if (n < step) el.classList.add('is-done');
    else if (n === step) el.classList.add('is-active');
  });
  debug('Progress → step', step);
}

// ===========================================================================
// 4. Marker events
// ===========================================================================

/**
 * The <a-marker> element fires 'markerFound' when the Hiro pattern is
 * recognised, and 'markerLost' when it disappears. We update the DOM status
 * badge, advance progress, and (on first detection) show the first fact.
 */
function attachMarkerHandlers() {
  const markerEl = document.getElementById('hiro-marker');
  if (!markerEl) return;

  markerEl.addEventListener('markerFound', () => {
    markerVisible = true;
    markerStatusEl.textContent = 'Marker detected';
    markerStatusEl.className = 'status-badge status-badge--found';
    debug('EVENT: markerFound');

    setProgress(2); // Step 2: Read facts
    updateFactDisplay(); // show the current fact once the marker is detected
  });

  markerEl.addEventListener('markerLost', () => {
    markerVisible = false;
    markerStatusEl.textContent = 'Marker not detected';
    markerStatusEl.className = 'status-badge status-badge--lost';
    debug('EVENT: markerLost');
  });
}

// ===========================================================================
// 5. Fact navigation (with source citation)
// ===========================================================================

/**
 * Update the fact shown in the DOM overlay and in the AR text entities,
 * including the source label, using `currentFactIndex`.
 */
function updateFactDisplay() {
  const fact = facts[currentFactIndex];

  // DOM overlay
  factDisplayEl.textContent = `${fact.short} (${currentFactIndex + 1}/${facts.length})`;
  if (factSourceEl) factSourceEl.textContent = `Source: ${fact.source}`;

  // AR space
  if (arFactText) arFactText.setAttribute('value', fact.short);
  if (arFactSource) arFactSource.setAttribute('value', `Source: ${fact.source}`);

  debug('Fact updated:', currentFactIndex + 1, '/', facts.length);
}

btnPrev?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex - 1 + facts.length) % facts.length;
  updateFactDisplay();
});

btnNext?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex + 1) % facts.length;
  updateFactDisplay();
});

// ===========================================================================
// 6. Action handlers
// ===========================================================================

/** Reset all action-specific AR visuals to their default hidden state. */
function resetARVisuals() {
  if (arFoodPile) {
    arFoodPile.setAttribute('visible', 'true');
    arFoodPile.setAttribute('scale', '1 1 1');
  }
  if (arWaste) arWaste.setAttribute('visible', 'false');
  if (arSave) arSave.setAttribute('visible', 'false');
  if (arShare) arShare.setAttribute('visible', 'false');
  if (arCompost) arCompost.setAttribute('visible', 'false');
  if (arFeedbackText) arFeedbackText.setAttribute('visible', 'false');
}

/**
 * Apply an action: update the AR scene, DOM feedback, progress, and localStorage.
 * @param {'throwAway'|'saveLeftovers'|'share'|'compost'} actionId
 */
function applyAction(actionId) {
  const action = actions[actionId];
  if (!action) return;
  debug('ACTION selected:', actionId);

  // 1. Reset visuals
  resetARVisuals();

  // 2. Update AR scene based on the chosen action
  switch (actionId) {
    case 'throwAway':
      if (arFoodPile) arFoodPile.setAttribute('scale', '1.5 1.5 1.5');
      if (arWaste) arWaste.setAttribute('visible', 'true');
      break;
    case 'saveLeftovers':
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.3 0.3 0.3');
      if (arSave) arSave.setAttribute('visible', 'true');
      break;
    case 'share':
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.4 0.4 0.4');
      if (arShare) arShare.setAttribute('visible', 'true');
      break;
    case 'compost':
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.5 0.5 0.5');
      if (arCompost) arCompost.setAttribute('visible', 'true');
      break;
  }

  // 3. Update AR feedback text (trimmed for AR space)
  if (arFeedbackText) {
    const arMsg = action.feedback.length > 80 ? action.feedback.slice(0, 80) + '…' : action.feedback;
    arFeedbackText.setAttribute('value', arMsg);
    arFeedbackText.setAttribute('visible', 'true');
    const clr =
      action.impactLevel === 'negative' ? '#d32f2f' :
      action.impactLevel === 'positive' ? '#2e7d32' : '#ff9800';
    arFeedbackText.setAttribute('color', clr);
  }

  // 4. Update DOM feedback panel
  feedbackPanelEl.textContent = `${action.icon} ${action.label}: ${action.feedback}`;
  feedbackPanelEl.className = 'feedback-panel';
  if (action.impactLevel === 'negative') feedbackPanelEl.classList.add('feedback-panel--negative');
  if (action.impactLevel === 'neutral') feedbackPanelEl.classList.add('feedback-panel--neutral');

  // 5. Progress: Step 3 (choose action) now; then surface the quiz as Step 4.
  setProgress(3);
  if (stepFourTimerId) clearTimeout(stepFourTimerId);
  stepFourTimerId = setTimeout(() => {
    setProgress(4); // Step 4: Complete quiz
    quizLinkEl?.classList.add('btn--accent');
  }, 900);

  // 6. Persist to localStorage
  saveLastAction(actionId);
}

btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));

// ===========================================================================
// 7. Overlay collapse / expand toggle
// ===========================================================================

overlayToggleEl?.addEventListener('click', () => {
  overlayEl.classList.toggle('collapsed');
  debug('Overlay toggled:', overlayEl.classList.contains('collapsed') ? 'collapsed' : 'expanded');
});

// ===========================================================================
// Kick off the start-up sequence
// ===========================================================================

startCameraFlow();
