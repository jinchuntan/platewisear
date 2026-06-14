/**
 * ai-result-renderer.js — Renders a normalized AI Scan result into the
 * PlateNudge exhibit/sheet DOM on ai.html. Locale aware so the trusted fact and
 * the static labels follow the active language; the AI's free-text fields stay
 * in the language they were generated in.
 */

import { TRUSTED_FACTS } from './ai-schema.js';
import { t, getLocale } from './i18n.js';
import { actionLabel } from './food-targets.js';

const CONF_CLASS = { low: 'ai-conf--low', medium: 'ai-conf--medium', high: 'ai-conf--high' };
const ACTIONS = ['throwAway', 'saveLeftovers', 'share', 'compost'];

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
function $(id) {
  return document.getElementById(id);
}

/**
 * Fill the AI result UI from a normalized result object.
 * @param {object} result
 */
export function renderAiResult(result) {
  if (!result) return;
  const locale = getLocale();

  // Exhibit card
  $('ai-title').textContent = result.arTitle;
  $('ai-best').textContent = `${t('common.bestPrefix') || 'Best: '}${actionLabel(result.recommendedAction)}`;
  // Detected badge — only when the AI clearly saw a food-waste scene. For an
  // uploaded image that was not clearly food waste we hide it rather than
  // overclaim a detection.
  const detectedBadge = $('ai-detected-badge');
  if (detectedBadge) {
    const detected = !result.sceneStatus || result.sceneStatus === 'detected';
    detectedBadge.textContent = t('ai.sceneDetected') || 'Food waste scene detected';
    detectedBadge.hidden = !detected;
  }

  // Summary
  const wasteEl = $('ai-waste');
  if (wasteEl) wasteEl.textContent = result.wasteType || '—';
  $('ai-visible').textContent = result.visibleItems.length ? result.visibleItems.join(', ') : '—';
  const uncertainRow = $('ai-uncertain-row');
  if (result.uncertainItems.length) {
    $('ai-uncertain').textContent = result.uncertainItems.join(', ');
    uncertainRow.hidden = false;
  } else {
    uncertainRow.hidden = true;
  }

  const confEl = $('ai-confidence');
  confEl.textContent = t('ai.conf' + cap(result.confidence)) || result.confidence;
  confEl.className = 'ai-conf ' + (CONF_CLASS[result.confidence] || '');

  $('ai-reason').textContent = result.actionReason;

  // Trusted fact (mapped locally by factKey — never AI-invented)
  const fact = TRUSTED_FACTS[result.factKey] || TRUSTED_FACTS.household_food_waste;
  $('ai-fact').textContent = fact.text[locale] || fact.text.en;
  $('ai-fact-source').textContent = `${t('common.sourcePrefix') || 'Source: '}${fact.source}`;

  // Safety note (canonical, prominent)
  $('ai-safety').textContent = result.safetyNote;

  // Default feedback = short exhibit text; reset styling
  const fb = $('ai-feedback');
  fb.textContent = result.shortExhibitText;
  fb.className = 'feedback-panel';

  // Low-confidence nudge
  const lowNote = $('ai-low-note');
  if (lowNote) lowNote.hidden = result.confidence !== 'low';

  // Highlight the recommended action
  ACTIONS.forEach((a) => {
    document
      .querySelector(`#ai-actions [data-action="${a}"]`)
      ?.classList.toggle('is-recommended', a === result.recommendedAction);
  });
}
