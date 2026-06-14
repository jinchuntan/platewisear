/**
 * demo-controller.js — Controls the non-AR demo page
 *
 * Mirrors the educational flow of the AR page without camera/marker.
 * Updates the stylised plate scene, fact display, and feedback panel
 * based on user interactions.
 *
 * This file is heavily commented for use in the technical report.
 */

import { facts, actions } from './content.js';
import { saveLastAction } from './storage.js';
import { debug } from './utils.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Index of the currently displayed fact (0-based). */
let currentFactIndex = 0;

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------

const factDisplayEl = document.getElementById('fact-display');
const factSourceEl = document.getElementById('fact-source');
const feedbackPanelEl = document.getElementById('feedback-panel');
const demoPlateEl = document.getElementById('demo-plate');
const demoFoodIconEl = document.getElementById('demo-food-icon');
const demoVisualLabelEl = document.getElementById('demo-visual-label');

const btnPrev = document.getElementById('btn-prev-fact');
const btnNext = document.getElementById('btn-next-fact');
const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');

debug('demo-controller.js loaded');

// ---------------------------------------------------------------------------
// Fact navigation
// ---------------------------------------------------------------------------

/**
 * Render the current fact in the DOM.
 */
function updateFactDisplay() {
  const fact = facts[currentFactIndex];
  factDisplayEl.textContent = `${fact.short} (${currentFactIndex + 1}/${facts.length})`;
  if (factSourceEl) factSourceEl.textContent = `Source: ${fact.source}`;
  debug('Demo fact updated:', currentFactIndex + 1, '/', facts.length);
}

// Show the first fact immediately
updateFactDisplay();

btnPrev?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex - 1 + facts.length) % facts.length;
  updateFactDisplay();
});

btnNext?.addEventListener('click', () => {
  currentFactIndex = (currentFactIndex + 1) % facts.length;
  updateFactDisplay();
});

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

/**
 * Reset the plate visual to its default state.
 */
function resetDemoVisual() {
  if (demoPlateEl) {
    demoPlateEl.style.transform = '';
    demoPlateEl.style.borderColor = '#bdbdbd';
  }
}

/**
 * Apply a food-waste action in demo mode.
 *
 * Updates:
 *  - plate visual (icon, colour, size hint)
 *  - visual label below the plate
 *  - feedback panel text and style
 *  - localStorage
 *
 * @param {'throwAway'|'saveLeftovers'|'share'|'compost'} actionId
 */
function applyAction(actionId) {
  const action = actions[actionId];
  if (!action) return;

  debug('Demo ACTION selected:', actionId);
  resetDemoVisual();

  // Update plate visual per action
  switch (actionId) {
    case 'throwAway':
      demoFoodIconEl.textContent = '🗑️';
      demoPlateEl.style.borderColor = '#d32f2f';
      demoPlateEl.style.transform = 'scale(1.1)';
      demoVisualLabelEl.textContent = 'Food thrown away — waste grows';
      break;

    case 'saveLeftovers':
      demoFoodIconEl.textContent = '📦';
      demoPlateEl.style.borderColor = '#1565c0';
      demoPlateEl.style.transform = 'scale(0.9)';
      demoVisualLabelEl.textContent = 'Leftovers saved for later';
      break;

    case 'share':
      demoFoodIconEl.textContent = '🤝';
      demoPlateEl.style.borderColor = '#7b1fa2';
      demoPlateEl.style.transform = 'scale(0.9)';
      demoVisualLabelEl.textContent = 'Surplus shared with others';
      break;

    case 'compost':
      demoFoodIconEl.textContent = '🌱';
      demoPlateEl.style.borderColor = '#ff9800';
      demoPlateEl.style.transform = 'scale(0.95)';
      demoVisualLabelEl.textContent = 'Scraps composted — nutrients returned';
      break;
  }

  // Update feedback panel
  feedbackPanelEl.textContent = `${action.label}: ${action.feedback}`;
  feedbackPanelEl.className = 'feedback-panel';
  if (action.impactLevel === 'negative') feedbackPanelEl.classList.add('feedback-panel--negative');
  if (action.impactLevel === 'neutral') feedbackPanelEl.classList.add('feedback-panel--neutral');

  // Persist
  saveLastAction(actionId);
}

// Wire up buttons
btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));
