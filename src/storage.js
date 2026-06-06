/**
 * storage.js — localStorage helpers for PlateWise AR
 *
 * Provides simple get/save wrappers so every page interacts with
 * localStorage through a consistent interface.
 *
 * Keys used:
 *   platewise_quizScore   — number (0–5)
 *   platewise_pledge      — string (pledge text)
 *   platewise_lastAction  — string (action id)
 */

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
  console.log('[PlateWise] Quiz score saved:', score);
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
  console.log('[PlateWise] Pledge saved:', pledge);
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
  console.log('[PlateWise] Last action saved:', actionId);
}
