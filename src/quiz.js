/**
 * quiz.js — Quiz and pledge logic for PlateNudge
 *
 * Renders quiz questions and the pledge from content.js (locale-aware), tracks
 * answers, calculates the score, and persists results to localStorage.
 * All copy is localised (EN / BM / 中文) and re-renders on language change.
 */

import { getBlendedQuiz, getPledgeOptions, getActionInfo } from './content.js';
import { getQuizScore, saveQuizScore, getPledge, savePledge, getLastAction, getLastTarget } from './storage.js';
import { getTargetById, localizedTarget } from './food-targets.js';
import { debug } from './utils.js';
import { t } from './i18n.js';

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const quizContainer = document.getElementById('quiz-container');
const quizResultEl = document.getElementById('quiz-result');
const scoreDisplayEl = document.getElementById('score-display');
const scoreMessageEl = document.getElementById('score-message');
const btnRetry = document.getElementById('btn-retry');
const pledgeOptionsEl = document.getElementById('pledge-options');
const btnSavePledge = document.getElementById('btn-save-pledge');
const pledgeConfirmEl = document.getElementById('pledge-confirmation');
const savedScoreEl = document.getElementById('saved-score');
const savedPledgeEl = document.getElementById('saved-pledge');
const lastActionNoteEl = document.getElementById('last-action-note');
const titleEl = document.getElementById('quiz-title');
const contextNoteEl = document.getElementById('quiz-context-note');

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
// The last scanned / selected / AI-Scan context decides which questions lead.
const lastTargetId = getLastTarget();
let questions = getBlendedQuiz(lastTargetId);
let answeredCount = 0;
let correctCount = 0;

debug('quiz.js loaded — context:', lastTargetId || 'none');

// ---------------------------------------------------------------------------
// Learning context — adapt the header + intro line to the last target
// ---------------------------------------------------------------------------
/** Localised display name for the current context, or null if unknown. */
function contextName(id) {
  if (!id) return null;
  if (id === 'ai-scan') return t('ai.cta') || 'AI Scan';
  const target = getTargetById(id);
  return target ? localizedTarget(target).title : null;
}

function renderContext() {
  const name = contextName(lastTargetId);

  if (titleEl) {
    titleEl.textContent = name
      ? (t('quiz.titleFor') || 'Quick check for {x}').replace('{x}', name)
      : (t('quiz.title') || 'Quick check');
  }

  if (contextNoteEl) {
    if (lastTargetId === 'ai-scan') {
      contextNoteEl.textContent = t('quiz.contextAi');
    } else if (name) {
      contextNoteEl.textContent = (t('quiz.contextTarget') || '').replace('{x}', name);
    } else {
      contextNoteEl.textContent = t('quiz.contextNone');
    }
  }
}

// ---------------------------------------------------------------------------
// Render quiz questions
// ---------------------------------------------------------------------------
function renderQuiz() {
  questions = getBlendedQuiz(lastTargetId);
  answeredCount = 0;
  correctCount = 0;
  quizContainer.innerHTML = '';
  quizResultEl.style.display = 'none';

  const qLabel = t('quiz.qLabel') || 'Q{n}.';
  const optAria = t('quiz.optionAriaPrefix') || 'Option: ';

  questions.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `question-${qIndex}`;

    const questionP = document.createElement('p');
    questionP.innerHTML = `<strong>${qLabel.replace('{n}', qIndex + 1)}</strong> ${q.question}`;
    card.appendChild(questionP);

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.setAttribute('aria-label', `${optAria}${opt}`);
      btn.addEventListener('click', () => handleAnswer(qIndex, optIndex, card));
      card.appendChild(btn);
    });

    quizContainer.appendChild(card);
  });

  debug('Quiz rendered —', questions.length, 'questions');
}

function handleAnswer(qIndex, selectedIndex, card) {
  const q = questions[qIndex];
  const buttons = card.querySelectorAll('.quiz-option');
  if (buttons[0].disabled) return;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('correct');
    if (i === selectedIndex && selectedIndex !== q.correctIndex) btn.classList.add('incorrect');
  });

  const explanation = document.createElement('p');
  explanation.className = 'quiz-explanation';
  explanation.textContent = q.explanation;
  card.appendChild(explanation);

  if (selectedIndex === q.correctIndex) correctCount++;
  answeredCount++;

  debug(`Q${qIndex + 1} answered — correct: ${selectedIndex === q.correctIndex}`);

  if (answeredCount === questions.length) showResult();
}

function showResult() {
  const total = questions.length;
  scoreDisplayEl.textContent = `${correctCount} / ${total}`;

  if (correctCount === total) {
    scoreMessageEl.textContent = t('quiz.scorePerfect');
  } else if (correctCount >= total * 0.6) {
    scoreMessageEl.textContent = t('quiz.scoreNice');
  } else {
    scoreMessageEl.textContent = t('quiz.scoreKeep');
  }

  quizResultEl.style.display = 'block';
  saveQuizScore(correctCount);
  updateSavedDisplay();
  debug('Quiz completed — score:', correctCount, '/', total);
}

btnRetry?.addEventListener('click', () => {
  renderQuiz();
  debug('Quiz retried');
});

// ---------------------------------------------------------------------------
// Pledge section
// ---------------------------------------------------------------------------
function renderPledgeOptions() {
  pledgeOptionsEl.innerHTML = '';

  getPledgeOptions().forEach((text, i) => {
    const label = document.createElement('label');
    label.className = 'pledge-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'pledge';
    radio.value = text;
    radio.id = `pledge-${i}`;

    label.appendChild(radio);
    label.appendChild(document.createTextNode(text));
    pledgeOptionsEl.appendChild(label);
  });

  const saved = getPledge();
  if (saved) {
    pledgeOptionsEl.querySelectorAll('input[type="radio"]').forEach((r) => {
      if (r.value === saved) r.checked = true;
    });
  }
}

btnSavePledge?.addEventListener('click', () => {
  const selected = pledgeOptionsEl.querySelector('input[name="pledge"]:checked');
  if (!selected) {
    pledgeConfirmEl.textContent = t('quiz.selectFirst');
    pledgeConfirmEl.style.color = 'var(--danger)';
    pledgeConfirmEl.style.display = 'block';
    return;
  }

  savePledge(selected.value);
  pledgeConfirmEl.textContent = `${t('quiz.pledgeSavedPrefix') || 'Pledge saved: '}"${selected.value}"`;
  pledgeConfirmEl.style.color = 'var(--primary)';
  pledgeConfirmEl.style.display = 'block';
  updateSavedDisplay();
  debug('Pledge saved:', selected.value);
});

// ---------------------------------------------------------------------------
// Display saved results from localStorage
// ---------------------------------------------------------------------------
function updateSavedDisplay() {
  const score = getQuizScore();
  const pledge = getPledge();

  savedScoreEl.textContent = score !== null
    ? `${t('quiz.savedScorePrefix') || 'Quiz score: '}${score} / ${questions.length}`
    : (t('quiz.noScore') || 'No quiz score saved yet.');

  savedPledgeEl.textContent = pledge
    ? `${t('quiz.savedPledgePrefix') || 'Pledge: '}"${pledge}"`
    : (t('quiz.noPledge') || 'No pledge saved yet.');
}

// ---------------------------------------------------------------------------
// Recall the last AR / Demo action (carried over via localStorage)
// ---------------------------------------------------------------------------
function showLastAction() {
  if (!lastActionNoteEl) return;
  const lastId = getLastAction();
  const action = lastId ? getActionInfo(lastId) : null;

  if (!action) {
    lastActionNoteEl.hidden = true;
    return;
  }

  lastActionNoteEl.innerHTML =
    `<strong>${t('quiz.lastChoicePrefix') || 'Your last choice: '}${action.label}</strong><br>${action.feedback}`;
  lastActionNoteEl.hidden = false;
  debug('Last action recalled:', lastId);
}

// ---------------------------------------------------------------------------
// Language change — re-render everything from the active locale
// ---------------------------------------------------------------------------
window.addEventListener('platewise:localechange', () => {
  renderContext();
  renderQuiz();
  renderPledgeOptions();
  updateSavedDisplay();
  showLastAction();
});

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------
renderContext();
renderQuiz();
renderPledgeOptions();
updateSavedDisplay();
showLastAction();
