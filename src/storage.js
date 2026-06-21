/**
 * storage.js — localStorage helpers for PlateNudge
 *
 * Provides simple get/save wrappers so every page interacts with
 * localStorage through a consistent interface.
 *
 * Keys used:
 *   platewise_quizScore   — number (0–5)
 *   platewise_pledge      — string (pledge text)
 *   platewise_lastAction  — string (action id)
 *   platewise_lastTarget  — string (target id, or "ai-scan")
 */

// Demo note. localStorage is how the app "remembers" things between pages
// without any backend or login. Four small values flow through here: the quiz
// score, the saved pledge, the last action chosen, and the last learning context
// (target id). For example, AR and Demo save the target, then the Quick Check
// page reads it to lead with relevant questions. Two extra keys remember whether
// each "how to" guide has been dismissed. Only short text and ids are stored,
// never a photo.
const PREFIX = 'platewise_';

// ---------------------------------------------------------------------------
// Quiz score
// ---------------------------------------------------------------------------

/**
 * Retrieve the saved quiz score, or null if none exists.
 * @returns {number|null}
 */
export function getQuizScore() {
  const val = localStorage.getItem(PREFIX + 'quizScore');
  return val !== null ? Number(val) : null;
}

/**
 * Save the quiz score to localStorage.
 * @param {number} score
 */
export function saveQuizScore(score) {
  localStorage.setItem(PREFIX + 'quizScore', String(score));
  console.log('[PlateNudge] Quiz score saved:', score);
}

// ---------------------------------------------------------------------------
// Action pledge
// ---------------------------------------------------------------------------

/**
 * Retrieve the saved pledge text, or null if none exists.
 * @returns {string|null}
 */
export function getPledge() {
  return localStorage.getItem(PREFIX + 'pledge');
}

/**
 * Save the user's action pledge to localStorage.
 * @param {string} pledge
 */
export function savePledge(pledge) {
  localStorage.setItem(PREFIX + 'pledge', pledge);
  console.log('[PlateNudge] Pledge saved:', pledge);
}

// ---------------------------------------------------------------------------
// Last AR / demo action
// ---------------------------------------------------------------------------

/**
 * Retrieve the last chosen action id, or null if none exists.
 * @returns {string|null}
 */
export function getLastAction() {
  return localStorage.getItem(PREFIX + 'lastAction');
}

/**
 * Save the most recent action id to localStorage.
 * @param {string} actionId
 */
export function saveLastAction(actionId) {
  localStorage.setItem(PREFIX + 'lastAction', actionId);
  console.log('[PlateNudge] Last action saved:', actionId);
}

// ---------------------------------------------------------------------------
// Last learning context — which exhibit the user most recently scanned,
// selected in Demo, or got from AI Scan. The Quick Check reads this to lead
// with target-specific questions. We store only a short id (never an image).
//   curated / demo → 'leftover-rice' | 'fruit-peels' | 'bread-waste' |
//                    'mixed-leftovers' | 'drink-waste'
//   AI Scan        → 'ai-scan'
// ---------------------------------------------------------------------------

/**
 * Remember the most recent learning context for the Quick Check.
 * @param {string} targetId
 */
export function saveLastTarget(targetId) {
  if (!targetId) return;
  localStorage.setItem(PREFIX + 'lastTarget', targetId);
  console.log('[PlateNudge] Last target saved:', targetId);
}

/** @returns {string|null} the last target id, or null if none. */
export function getLastTarget() {
  return localStorage.getItem(PREFIX + 'lastTarget');
}

/** Forget the last learning context (e.g. to reset to the general quiz). */
export function clearLastTarget() {
  localStorage.removeItem(PREFIX + 'lastTarget');
}

// ---------------------------------------------------------------------------
// "How to scan" guide — has the user dismissed it before?
// ---------------------------------------------------------------------------

/** @returns {boolean} true if the scan guide has already been dismissed. */
export function getScanGuideSeen() {
  return localStorage.getItem(PREFIX + 'scanGuideSeen') === '1';
}

/** Remember that the user dismissed the scan guide. */
export function setScanGuideSeen() {
  localStorage.setItem(PREFIX + 'scanGuideSeen', '1');
}

// ---------------------------------------------------------------------------
// "How AI Scan works" guide — separate from the curated-scan guide because the
// steps are different. Uses its own key so dismissing one does not hide the
// other. The key name was requested explicitly, so it is kept as-is.
// ---------------------------------------------------------------------------

const AI_GUIDE_KEY = 'platenudge-ai-guide-seen';

/** @returns {boolean} true if the AI Scan guide has already been dismissed. */
export function getAiGuideSeen() {
  return localStorage.getItem(AI_GUIDE_KEY) === '1';
}

/** Remember that the user dismissed the AI Scan guide. */
export function setAiGuideSeen() {
  localStorage.setItem(AI_GUIDE_KEY, '1');
}
