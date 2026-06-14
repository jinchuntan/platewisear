/**
 * askmore.js — Shared "Ask more" drawer used by AR and Demo modes.
 *
 * Opens a clean bottom drawer with predefined, source-backed content for the
 * detected/selected food-waste target. No network or AI calls.
 *
 * Future AI mode: replace this static explanation with OpenRouter vision
 * analysis of the user's own uploaded food-waste photo.
 *
 * Expects this markup on the page (see ar.html / demo.html):
 *   #askmore (dialog) · #askmore-backdrop · #askmore-close
 *   #askmore-title · #askmore-look · #askmore-why · #askmore-do · #askmore-safety
 */

import { ACTION_LABELS } from './food-targets.js';

export function initAskMore() {
  const drawer = document.getElementById('askmore');
  const backdrop = document.getElementById('askmore-backdrop');
  const closeBtn = document.getElementById('askmore-close');
  const titleEl = document.getElementById('askmore-title');
  const lookEl = document.getElementById('askmore-look');
  const whyEl = document.getElementById('askmore-why');
  const doEl = document.getElementById('askmore-do');
  const safetyEl = document.getElementById('askmore-safety');

  if (!drawer) return { open() {}, close() {} };

  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
  }

  function open(target) {
    if (!target) return;
    titleEl.textContent = target.askMoreTitle;
    lookEl.textContent = `${target.title} — ${target.shortLabel} (${target.wasteType}).`;
    whyEl.textContent = target.askMoreExplanation;

    const rec = ACTION_LABELS[target.recommendedAction] || 'Act';
    doEl.textContent = `Recommended: ${rec}. ${target.actionGuidance[target.recommendedAction]}`;
    safetyEl.textContent = target.safetyNote;

    drawer.removeAttribute('hidden');
    // allow the element to paint before adding the open class (slide-in)
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    closeBtn?.focus();
  }

  backdrop?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) close();
  });

  return { open, close };
}
