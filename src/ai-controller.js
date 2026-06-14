/**
 * ai-controller.js — AI Photo Mode page controller.
 *
 * Upload/capture → compress in the browser → POST /api/analyze-food → render a
 * PlateWise AI exhibit. Optional contextual "Ask more" calls /api/ask-food.
 *
 * Fully optional: if the API is missing keys (503 not_configured) or fails, the
 * page shows a friendly fallback with links to curated AR Scan / Demo — it never
 * crashes and never touches the core AR flow.
 */

import { t, getLocale } from './i18n.js';
import { actionLabel } from './food-targets.js';
import { saveLastAction } from './storage.js';
import { normalizeResult } from './ai-schema.js';
import { renderAiResult } from './ai-result-renderer.js';
import { debug } from './utils.js';

const MAX_FILE_BYTES = 12 * 1024 * 1024; // reject huge originals before compressing
const MAX_DIM = 1280;
const JPEG_QUALITY = 0.82;
const ACTIONS = ['throwAway', 'saveLeftovers', 'share', 'compost'];

let currentResult = null;
let currentDataUrl = null;

// --- refs ---
const fileInput = document.getElementById('ai-file');
const previewWrap = document.getElementById('ai-preview');
const previewImg = document.getElementById('ai-preview-img');
const errorEl = document.getElementById('ai-error');
const analyseBtn = document.getElementById('ai-analyse');
const changeBtn = document.getElementById('ai-change');

const uploadSection = document.getElementById('ai-upload');
const loadingSection = document.getElementById('ai-loading');
const resultSection = document.getElementById('ai-result');
const fallbackSection = document.getElementById('ai-fallback');
const fallbackMsg = document.getElementById('ai-fallback-msg');
const retryBtn = document.getElementById('ai-retry');

const resultImg = document.getElementById('ai-result-img');
const feedbackEl = document.getElementById('ai-feedback');

// Ask-more drawer
const drawer = document.getElementById('askmore');
const drawerBackdrop = document.getElementById('askmore-backdrop');
const drawerClose = document.getElementById('askmore-close');
const askMoreBtn = document.getElementById('ai-askmore');
const dLook = document.getElementById('askmore-look');
const dWhy = document.getElementById('askmore-why');
const dDo = document.getElementById('askmore-do');
const dSafety = document.getElementById('askmore-safety');
const dFollowWrap = document.getElementById('askmore-followups-wrap');
const dFollow = document.getElementById('askmore-followups');
const askInput = document.getElementById('askmore-q');
const askBtn = document.getElementById('askmore-ask');
const askAnswer = document.getElementById('askmore-answer');

debug('ai-controller.js loaded');

// ===========================================================================
// View state
// ===========================================================================
function showOnly(section) {
  [uploadSection, loadingSection, resultSection, fallbackSection].forEach((el) => {
    if (el) el.hidden = el !== section;
  });
}
function showError(key) {
  if (!errorEl) return;
  errorEl.textContent = t(`ai.${key}`) || '';
  errorEl.hidden = false;
}
function clearError() {
  if (errorEl) errorEl.hidden = true;
}
function showFallback(key) {
  if (fallbackMsg) fallbackMsg.textContent = t(`ai.${key}`) || t('ai.errUnavailable') || '';
  showOnly(fallbackSection);
}

// ===========================================================================
// Image handling (validate + compress in-browser)
// ===========================================================================
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(new Error('read failed'));
    fr.readAsDataURL(file);
  });
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });
}

async function compressImage(file) {
  const dataUrl = await readFileAsDataURL(file);
  let img;
  try {
    img = await loadImage(dataUrl);
  } catch {
    // Some formats (e.g. HEIC) can't be decoded by canvas — fall back to raw.
    return dataUrl;
  }
  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  try {
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } catch {
    return dataUrl;
  }
}

async function handleFile(file) {
  clearError();
  if (!file) return;
  if (!file.type || !file.type.startsWith('image/')) {
    showError('errType');
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    showError('errTooLarge');
    return;
  }
  try {
    currentDataUrl = await compressImage(file);
    previewImg.src = currentDataUrl;
    previewWrap.hidden = false;
    if (changeBtn) changeBtn.hidden = false;
    analyseBtn.disabled = false;
  } catch (e) {
    debug('compress failed', e);
    showError('errType');
  }
}

// ===========================================================================
// Analyse
// ===========================================================================
async function analyse() {
  if (!currentDataUrl) {
    showError('errNoImage');
    return;
  }
  showOnly(loadingSection);

  let resp;
  try {
    resp = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: currentDataUrl, locale: getLocale() }),
    });
  } catch {
    showFallback('errUnavailable');
    return;
  }

  let data = null;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }

  if (resp.status === 503 || data?.error === 'not_configured') {
    showFallback('errNotConfigured');
    return;
  }
  if (!resp.ok || !data?.ok || !data.result) {
    showFallback('errUnavailable');
    return;
  }

  try {
    currentResult = normalizeResult(data.result, getLocale()); // defensive re-normalize
    currentResult.provider = data.result.provider;
  } catch {
    showFallback('errUnavailable');
    return;
  }

  debug('AI analysis ok — provider:', currentResult.provider, 'action:', currentResult.recommendedAction);
  resultImg.src = currentDataUrl;
  resultImg.alt = currentResult.arTitle || '';
  renderAiResult(currentResult);
  showOnly(resultSection);
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetToUpload() {
  currentResult = null;
  showOnly(uploadSection);
}

// ===========================================================================
// Actions (target-specific guidance from the AI result)
// ===========================================================================
function applyAction(action) {
  if (!currentResult) return;
  const guidance = currentResult.guidance[action] || '';
  feedbackEl.textContent = `${actionLabel(action)}: ${guidance}`;
  feedbackEl.className = 'feedback-panel';
  if (action === 'throwAway') feedbackEl.classList.add('feedback-panel--negative');
  else if (action === currentResult.recommendedAction) feedbackEl.classList.add('feedback-panel--positive');
  else feedbackEl.classList.add('feedback-panel--neutral');
  saveLastAction(action); // so Quick Check can recall it
  debug('AI action:', action);
}

// ===========================================================================
// Ask-more drawer (static content + optional contextual question)
// ===========================================================================
function fillDrawer() {
  if (!currentResult) return;
  const visible = currentResult.visibleItems.length ? currentResult.visibleItems.join(', ') : '—';
  const uncertain = currentResult.uncertainItems.length ? ` (${currentResult.uncertainItems.join(', ')})` : '';
  dLook.textContent = `${visible}${uncertain}`;
  dWhy.textContent = currentResult.actionReason;
  dDo.textContent = `${actionLabel(currentResult.recommendedAction)}: ${currentResult.guidance[currentResult.recommendedAction] || ''}`;
  dSafety.textContent = currentResult.safetyNote;

  if (currentResult.followUpQuestions.length) {
    dFollow.innerHTML = currentResult.followUpQuestions
      .map((q) => `<li><button type="button" class="askmore-suggest">${escapeHtml(q)}</button></li>`)
      .join('');
    dFollowWrap.hidden = false;
    dFollow.querySelectorAll('.askmore-suggest').forEach((b) => {
      b.addEventListener('click', () => {
        if (askInput) askInput.value = b.textContent;
      });
    });
  } else {
    dFollowWrap.hidden = true;
  }
  if (askAnswer) askAnswer.hidden = true;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function openDrawer() {
  if (!drawer || !currentResult) return;
  fillDrawer();
  drawer.removeAttribute('hidden');
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  drawerClose?.focus();
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('hidden', '');
}

async function askQuestion() {
  if (!currentResult || !askInput) return;
  const question = askInput.value.trim();
  if (!question) return;
  askBtn.disabled = true;
  askAnswer.hidden = false;
  askAnswer.textContent = `${t('ai.analysing') || 'Analysing…'}`;

  let resp;
  try {
    resp = await fetch('/api/ask-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, analysisResult: currentResult, locale: getLocale() }),
    });
  } catch {
    askAnswer.textContent = t('ai.errUnavailable') || '';
    askBtn.disabled = false;
    return;
  }
  let data = null;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }
  askAnswer.textContent = data?.ok && data.answer ? data.answer : t('ai.errUnavailable') || '';
  askBtn.disabled = false;
}

// ===========================================================================
// Wire up
// ===========================================================================
fileInput?.addEventListener('change', (e) => handleFile(e.target.files && e.target.files[0]));
changeBtn?.addEventListener('click', () => fileInput?.click());
analyseBtn?.addEventListener('click', analyse);
retryBtn?.addEventListener('click', resetToUpload);

document.querySelectorAll('#ai-actions [data-action]').forEach((btn) => {
  btn.addEventListener('click', () => applyAction(btn.dataset.action));
});

askMoreBtn?.addEventListener('click', openDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);
drawerClose?.addEventListener('click', closeDrawer);
askBtn?.addEventListener('click', askQuestion);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer && !drawer.hasAttribute('hidden')) closeDrawer();
});

// Re-localise the dynamic result (fact + labels) when language changes; the AI
// free-text fields remain in the language they were generated in.
window.addEventListener('platewise:localechange', () => {
  if (currentResult) renderAiResult(currentResult);
  if (drawer && !drawer.hasAttribute('hidden')) fillDrawer();
});

// Start on the upload step.
showOnly(uploadSection);
