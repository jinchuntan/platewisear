/**
 * askmore.js — Shared "Ask more" drawer used by AR and Demo modes.
 *
 * Opens a clean bottom drawer with predefined, source-backed content for the
 * detected/selected food-waste target. No network or AI calls. Content is
 * localised (EN / BM / 中文) and re-renders if the language changes while open.
 *
 * Future AI mode: replace this static explanation with OpenRouter vision
 * analysis of the user's own uploaded food-waste photo.
 *
 * Expects this markup on the page (see ar.html / demo.html):
 *   #askmore (dialog) · #askmore-backdrop · #askmore-close
 *   #askmore-title · #askmore-look · #askmore-why · #askmore-do · #askmore-safety
 */

import { localizedTarget, actionLabel } from './food-targets.js';
import { t } from './i18n.js';

// Demo note. One shared drawer, reused by both AR and Demo Mode. initAskMore()
// returns an { open, close } pair; calling open(target) fills the four sections
// ("What am I looking at?", "Why it matters", "What should I do?", and the safety
// note) straight from that target's curated content. No network and no AI. It is
// the deeper, source-backed explanation behind the one-line fact on the sheet.
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

  let lastTarget = null; // raw target, re-localised on render

  function render() {
    if (!lastTarget) return;
    const lt = localizedTarget(lastTarget);
    titleEl.textContent = lt.askMoreTitle;
    lookEl.textContent = `${lt.title} — ${lt.shortLabel} (${lt.wasteType}).`;
    whyEl.textContent = lt.askMoreExplanation;

    const rec = actionLabel(lt.recommendedAction);
    doEl.textContent = `${t('common.recommendedPrefix') || 'Recommended: '}${rec}. ${lt.actionGuidance[lt.recommendedAction]}`;
    safetyEl.textContent = lt.safetyNote;
  }

  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
  }

  function open(target) {
    if (!target) return;
    lastTarget = target;
    render();

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

  // Re-localise the open drawer when the language changes.
  window.addEventListener('platewise:localechange', () => {
    if (!drawer.hasAttribute('hidden')) render();
  });

  return { open, close };
}
