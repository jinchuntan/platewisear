/**
 * ar-controller.js — Controls the A-Frame AR scene and DOM overlay
 *
 * Responsibilities:
 *  1. Listen for marker found / lost events and update the DOM status badge.
 *  2. Manage fact navigation (previous / next).
 *  3. Handle action button clicks — update AR entity visibility, scale,
 *     feedback text, and DOM feedback panel.
 *  4. Persist the last chosen action to localStorage.
 *
 * This file is heavily commented for use in the technical report.
 */

import { facts, actions } from './content.js';
import { saveLastAction } from './storage.js';
import { debug, setVisible } from './utils.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Index of the currently displayed fact (0-based). */
let currentFactIndex = 0;

/** Whether the Hiro marker is currently detected by the camera. */
let markerVisible = false;

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------

const markerStatusEl = document.getElementById('marker-status');
const factDisplayEl = document.getElementById('fact-display');
const feedbackPanelEl = document.getElementById('feedback-panel');
const overlayEl = document.getElementById('ar-overlay');
const overlayToggleEl = document.getElementById('overlay-toggle');

// Buttons
const btnPrev = document.getElementById('btn-prev-fact');
const btnNext = document.getElementById('btn-next-fact');
const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');

// AR entity references (resolved after A-Frame scene loads)
let arFoodPile, arWaste, arSave, arShare, arCompost, arFactText, arFeedbackText;

// ---------------------------------------------------------------------------
// Initialisation — wait for the A-Frame scene to be ready
// ---------------------------------------------------------------------------

debug('ar-controller.js loaded — waiting for scene to initialise…');

/**
 * Resolve A-Frame entity references once the scene is loaded.
 * AR.js injects the camera feed and starts tracking after this point.
 */
function initAREntities() {
  arFoodPile = document.getElementById('ar-food-pile');
  arWaste = document.getElementById('ar-waste');
  arSave = document.getElementById('ar-save');
  arShare = document.getElementById('ar-share');
  arCompost = document.getElementById('ar-compost');
  arFactText = document.getElementById('ar-fact-text');
  arFeedbackText = document.getElementById('ar-feedback-text');
  debug('AR entities resolved.');
}

// A-Frame fires 'loaded' on <a-scene> when the scene is ready.
const scene = document.querySelector('a-scene');
if (scene) {
  if (scene.hasLoaded) {
    initAREntities();
  } else {
    scene.addEventListener('loaded', initAREntities);
  }
}

// ---------------------------------------------------------------------------
// Marker events
// ---------------------------------------------------------------------------

/**
 * The <a-marker> element fires 'markerFound' when the Hiro pattern is
 * recognised in the camera feed, and 'markerLost' when it disappears.
 *
 * We update the DOM status badge and log events for debugging evidence.
 */
const markerEl = document.getElementById('hiro-marker');

if (markerEl) {
  markerEl.addEventListener('markerFound', () => {
    markerVisible = true;
    markerStatusEl.textContent = 'Marker detected';
    markerStatusEl.className = 'status-badge status-badge--found';
    debug('EVENT: markerFound');

    // Show the first fact when the marker is first detected
    updateFactDisplay();
  });

  markerEl.addEventListener('markerLost', () => {
    markerVisible = false;
    markerStatusEl.textContent = 'Marker not detected';
    markerStatusEl.className = 'status-badge status-badge--lost';
    debug('EVENT: markerLost');
  });
}

// ---------------------------------------------------------------------------
// Fact navigation
// ---------------------------------------------------------------------------

/**
 * Update the fact shown in the DOM overlay and in the AR text entity.
 * Uses the current value of `currentFactIndex`.
 */
function updateFactDisplay() {
  const fact = facts[currentFactIndex];
  // Update DOM
  factDisplayEl.textContent = `${fact.short} (${currentFactIndex + 1}/${facts.length})`;

  // Update AR text (if entity is available)
  if (arFactText) {
    arFactText.setAttribute('value', fact.short);
  }

  debug('Fact updated:', currentFactIndex + 1, '/', facts.length);
}

/** Go to the previous fact (wraps around). */
btnPrev?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex - 1 + facts.length) % facts.length;
  updateFactDisplay();
});

/** Go to the next fact (wraps around). */
btnNext?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex + 1) % facts.length;
  updateFactDisplay();
});

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

/**
 * Reset all action-specific AR visuals to their default hidden state.
 * Called before showing the visual for the newly chosen action.
 */
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
 * Apply an action: update AR scene, DOM feedback, and localStorage.
 *
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
      // Waste pile grows — food pile scales up and turns into a warning
      if (arFoodPile) arFoodPile.setAttribute('scale', '1.5 1.5 1.5');
      if (arWaste) arWaste.setAttribute('visible', 'true');
      break;

    case 'saveLeftovers':
      // Food pile shrinks — save container appears
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.3 0.3 0.3');
      if (arSave) arSave.setAttribute('visible', 'true');
      break;

    case 'share':
      // Food pile shrinks — share figures appear
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.4 0.4 0.4');
      if (arShare) arShare.setAttribute('visible', 'true');
      break;

    case 'compost':
      // Food pile reduces — compost/plant visual appears
      if (arFoodPile) arFoodPile.setAttribute('scale', '0.5 0.5 0.5');
      if (arCompost) arCompost.setAttribute('visible', 'true');
      break;
  }

  // 3. Update AR feedback text
  if (arFeedbackText) {
    arFeedbackText.setAttribute('value', action.feedback.substring(0, 80) + '…');
    arFeedbackText.setAttribute('visible', 'true');
    // Colour based on impact
    const clr =
      action.impactLevel === 'negative' ? '#d32f2f' :
      action.impactLevel === 'positive' ? '#2e7d32' : '#ff9800';
    arFeedbackText.setAttribute('color', clr);
  }

  // 4. Update DOM feedback panel
  feedbackPanelEl.textContent = action.feedback;
  feedbackPanelEl.className = 'feedback-panel';
  if (action.impactLevel === 'negative') feedbackPanelEl.classList.add('feedback-panel--negative');
  if (action.impactLevel === 'neutral') feedbackPanelEl.classList.add('feedback-panel--neutral');

  // 5. Persist to localStorage
  saveLastAction(actionId);
}

// Wire up action buttons
btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));

// ---------------------------------------------------------------------------
// Overlay collapse / expand toggle
// ---------------------------------------------------------------------------

overlayToggleEl?.addEventListener('click', () => {
  overlayEl.classList.toggle('collapsed');
  debug('Overlay toggled:', overlayEl.classList.contains('collapsed') ? 'collapsed' : 'expanded');
});

// ---------------------------------------------------------------------------
// Camera initialisation log
// ---------------------------------------------------------------------------

debug('Camera initialisation — AR.js will request camera access.');
