/**
 * demo-controller.js — Camera-free mirror of the image-target experience.
 *
 * Lets the user pick a sample food-waste image (the same curated targets used
 * by AR), then shows the exhibit card, contextual actions, target-specific
 * guidance, and the shared Ask-More drawer. No camera, no AI.
 */

import { TARGETS, ACTION_LABELS } from './food-targets.js';
import { saveLastAction } from './storage.js';
import { initAskMore } from './askmore.js';
import { debug } from './utils.js';

let currentTarget = null;
const askMore = initAskMore();

// --- refs ---
const gridEl = document.getElementById('target-grid');
const stageEl = document.getElementById('demo-stage');
const imageEl = document.getElementById('demo-image');
const typeEl = document.getElementById('demo-type');
const titleEl = document.getElementById('demo-title');
const statEl = document.getElementById('demo-stat');
const actionBadgeEl = document.getElementById('demo-action');
const factSourceEl = document.getElementById('fact-source');
const feedbackPanelEl = document.getElementById('feedback-panel');

const btnThrow = document.getElementById('btn-throw');
const btnSave = document.getElementById('btn-save');
const btnShare = document.getElementById('btn-share');
const btnCompost = document.getElementById('btn-compost');
const btnAskMore = document.getElementById('btn-askmore');

const actionButtons = { throwAway: btnThrow, saveLeftovers: btnSave, share: btnShare, compost: btnCompost };

debug('demo-controller.js loaded');

// ---------------------------------------------------------------------------
// Render the selectable sample image cards
// ---------------------------------------------------------------------------
function renderGrid() {
  if (!gridEl) return;
  gridEl.innerHTML = TARGETS.map(
    (t) =>
      `<button type="button" class="target-card" data-index="${t.targetIndex}">` +
      `<img class="target-card__img" src="${t.image}" alt="${t.title}" loading="lazy" />` +
      `<span class="target-card__label">${t.title}</span></button>`
  ).join('');

  gridEl.querySelectorAll('.target-card').forEach((card) => {
    card.addEventListener('click', () => selectTarget(Number(card.dataset.index)));
  });
}

// ---------------------------------------------------------------------------
// Select an exhibit
// ---------------------------------------------------------------------------
function selectTarget(index) {
  const target = TARGETS.find((t) => t.targetIndex === index);
  if (!target) return;
  currentTarget = target;
  debug('Demo selected:', target.id);

  imageEl.src = target.image;
  imageEl.alt = target.title;
  typeEl.textContent = target.wasteType;
  titleEl.textContent = target.title;
  statEl.textContent = target.quickFact;
  actionBadgeEl.textContent = `Best: ${ACTION_LABELS[target.recommendedAction]}`;
  factSourceEl.textContent = `Source: ${target.source}`;

  feedbackPanelEl.textContent = target.defaultMessage;
  feedbackPanelEl.className = 'feedback-panel';

  highlightRecommended(target.recommendedAction);
  // mark the active card
  gridEl.querySelectorAll('.target-card').forEach((c) =>
    c.classList.toggle('is-active', Number(c.dataset.index) === index)
  );

  stageEl.hidden = false;
  stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function highlightRecommended(actionId) {
  Object.entries(actionButtons).forEach(([id, btn]) => {
    btn?.classList.toggle('is-recommended', id === actionId);
  });
}

// ---------------------------------------------------------------------------
// Actions (target-specific guidance)
// ---------------------------------------------------------------------------
function applyAction(actionId) {
  if (!currentTarget) return;
  const guidance = currentTarget.actionGuidance[actionId];
  feedbackPanelEl.textContent = `${ACTION_LABELS[actionId]}: ${guidance}`;
  feedbackPanelEl.className = 'feedback-panel';
  if (actionId === 'throwAway') feedbackPanelEl.classList.add('feedback-panel--negative');
  else if (actionId === currentTarget.recommendedAction) feedbackPanelEl.classList.add('feedback-panel--positive');
  else feedbackPanelEl.classList.add('feedback-panel--neutral');
  saveLastAction(actionId);
  debug('Demo action:', actionId, 'on', currentTarget.id);
}

btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));
btnAskMore?.addEventListener('click', () => askMore.open(currentTarget));

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
renderGrid();
