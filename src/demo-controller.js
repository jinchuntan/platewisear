/**
 * demo-controller.js — Camera-free mirror of the image-target experience.
 *
 * Lets the user pick a sample food-waste image (the same curated targets used
 * by AR), then shows the exhibit card, contextual actions, target-specific
 * guidance, and the shared Ask-More drawer. No camera, no AI.
 * Fully localised (EN / BM / 中文) and re-renders on language change.
 */

import { TARGETS, localizedTarget, actionLabel } from './food-targets.js';
import { saveLastAction, saveLastTarget } from './storage.js';
import { initAskMore } from './askmore.js';
import { debug } from './utils.js';
import { t } from './i18n.js';

let currentTarget = null;   // raw target (re-localised at render time)
let lastActionId = null;
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
// Render the selectable sample image cards (labels localised)
// ---------------------------------------------------------------------------
function renderGrid() {
  if (!gridEl) return;
  gridEl.innerHTML = TARGETS.map((tg) => {
    const lt = localizedTarget(tg);
    return (
      `<button type="button" class="target-card" data-index="${tg.targetIndex}">` +
      `<img class="target-card__img" src="${tg.image}" alt="${lt.title}" loading="lazy" />` +
      `<span class="target-card__label">${lt.title}</span></button>`
    );
  }).join('');

  gridEl.querySelectorAll('.target-card').forEach((card) => {
    card.addEventListener('click', () => selectTarget(Number(card.dataset.index)));
  });

  // Keep the active card highlighted after a re-render.
  if (currentTarget) {
    gridEl.querySelectorAll('.target-card').forEach((c) =>
      c.classList.toggle('is-active', Number(c.dataset.index) === currentTarget.targetIndex)
    );
  }
}

function highlightRecommended(actionId) {
  Object.entries(actionButtons).forEach(([id, btn]) => {
    btn?.classList.toggle('is-recommended', id === actionId);
  });
}

/** Fill the exhibit card + feedback for the current target/action (localised). */
function renderStage() {
  if (!currentTarget) return;
  const lt = localizedTarget(currentTarget);

  imageEl.src = currentTarget.image;
  imageEl.alt = lt.title;
  typeEl.textContent = lt.wasteType;
  titleEl.textContent = lt.title;
  statEl.textContent = lt.quickFact;
  actionBadgeEl.textContent = `${t('common.bestPrefix') || 'Best: '}${actionLabel(currentTarget.recommendedAction)}`;
  factSourceEl.textContent = `${t('common.sourcePrefix') || 'Source: '}${lt.source}`;

  if (lastActionId) {
    const guidance = lt.actionGuidance[lastActionId];
    feedbackPanelEl.textContent = `${actionLabel(lastActionId)}: ${guidance}`;
    feedbackPanelEl.className = 'feedback-panel';
    if (lastActionId === 'throwAway') feedbackPanelEl.classList.add('feedback-panel--negative');
    else if (lastActionId === currentTarget.recommendedAction) feedbackPanelEl.classList.add('feedback-panel--positive');
    else feedbackPanelEl.classList.add('feedback-panel--neutral');
  } else {
    feedbackPanelEl.textContent = lt.defaultMessage;
    feedbackPanelEl.className = 'feedback-panel';
  }

  highlightRecommended(currentTarget.recommendedAction);
}

// ---------------------------------------------------------------------------
// Select an exhibit
// ---------------------------------------------------------------------------
// Demo note. selectTarget is Demo Mode's stand-in for "MindAR found a target".
// A tap supplies the index directly (no camera), then everything downstream
// (renderStage, the actions, the feedback colours, saveLastTarget for Quick
// Check) is identical to the AR controller. Same content, same teaching flow.
function selectTarget(index) {
  const target = TARGETS.find((tg) => tg.targetIndex === index);
  if (!target) return;
  currentTarget = target;
  lastActionId = null;
  saveLastTarget(target.id); // remember the context so Quick Check can lead with it
  debug('Demo selected:', target.id);

  renderStage();
  gridEl.querySelectorAll('.target-card').forEach((c) =>
    c.classList.toggle('is-active', Number(c.dataset.index) === index)
  );

  stageEl.hidden = false;
  stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------------------
// Actions (target-specific guidance)
// ---------------------------------------------------------------------------
function applyAction(actionId) {
  if (!currentTarget) return;
  lastActionId = actionId;
  renderStage();
  saveLastAction(actionId);
  debug('Demo action:', actionId, 'on', currentTarget.id);
}

btnThrow?.addEventListener('click', () => applyAction('throwAway'));
btnSave?.addEventListener('click', () => applyAction('saveLeftovers'));
btnShare?.addEventListener('click', () => applyAction('share'));
btnCompost?.addEventListener('click', () => applyAction('compost'));
btnAskMore?.addEventListener('click', () => askMore.open(currentTarget));

// ---------------------------------------------------------------------------
// Language change — re-render the grid + any selected exhibit
// ---------------------------------------------------------------------------
window.addEventListener('platewise:localechange', () => {
  renderGrid();
  if (currentTarget) renderStage();
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
renderGrid();
