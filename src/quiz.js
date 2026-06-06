/**
 * quiz.js — Quiz and pledge logic for PlateWise AR
 *
 * Renders quiz questions from content.js, tracks answers,
 * calculates the score, and persists results to localStorage.
 *
 * Also handles the "My Action Pledge" section.
 *
 * Heavily commented for the technical report.
 */

import { quizQuestions, pledgeOptions } from './content.js';
import { getQuizScore, saveQuizScore, getPledge, savePledge } from './storage.js';
import { debug } from './utils.js';

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

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Track how many questions have been answered so far. */
let answeredCount = 0;

/** Track the number of correct answers. */
let correctCount = 0;

debug('quiz.js loaded');

// ---------------------------------------------------------------------------
// Render quiz questions
// ---------------------------------------------------------------------------

/**
 * Build the quiz UI from the quizQuestions array in content.js.
 * Each question gets a card with clickable option buttons.
 */
function renderQuiz() {
  answeredCount = 0;
  correctCount = 0;
  quizContainer.innerHTML = '';
  quizResultEl.style.display = 'none';

  quizQuestions.forEach((q, qIndex) => {
    // Card wrapper
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `question-${qIndex}`;

    // Question text
    const questionP = document.createElement('p');
    questionP.innerHTML = `<strong>Q${qIndex + 1}.</strong> ${q.question}`;
    card.appendChild(questionP);

    // Option buttons
    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.setAttribute('aria-label', `Option: ${opt}`);

      btn.addEventListener('click', () => {
        handleAnswer(qIndex, optIndex, card);
      });

      card.appendChild(btn);
    });

    quizContainer.appendChild(card);
  });

  debug('Quiz rendered —', quizQuestions.length, 'questions');
}

/**
 * Handle a quiz answer selection.
 *
 * - Highlights correct / incorrect options.
 * - Shows the explanation.
 * - Disables further interaction on the question.
 * - Checks whether all questions have been answered.
 *
 * @param {number} qIndex — question index
 * @param {number} selectedIndex — chosen option index
 * @param {HTMLElement} card — question card element
 */
function handleAnswer(qIndex, selectedIndex, card) {
  const q = quizQuestions[qIndex];
  const buttons = card.querySelectorAll('.quiz-option');

  // Prevent re-answering
  if (buttons[0].disabled) return;

  // Disable all option buttons for this question
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) {
      btn.classList.add('correct');
    }
    if (i === selectedIndex && selectedIndex !== q.correctIndex) {
      btn.classList.add('incorrect');
    }
  });

  // Show explanation
  const explanation = document.createElement('p');
  explanation.className = 'quiz-explanation';
  explanation.textContent = q.explanation;
  card.appendChild(explanation);

  // Update tallies
  if (selectedIndex === q.correctIndex) {
    correctCount++;
  }
  answeredCount++;

  debug(`Q${qIndex + 1} answered — correct: ${selectedIndex === q.correctIndex}`);

  // Check if quiz is complete
  if (answeredCount === quizQuestions.length) {
    showResult();
  }
}

/**
 * Display the final score and persist it to localStorage.
 */
function showResult() {
  const total = quizQuestions.length;
  scoreDisplayEl.textContent = `${correctCount} / ${total}`;

  // Contextual message
  if (correctCount === total) {
    scoreMessageEl.textContent = 'Excellent! You have a strong understanding of food waste and SDG 12.';
  } else if (correctCount >= total * 0.6) {
    scoreMessageEl.textContent = 'Good effort! Review the explanations above to strengthen your understanding.';
  } else {
    scoreMessageEl.textContent = 'Keep learning! Try the AR experience again and review the facts.';
  }

  quizResultEl.style.display = 'block';
  saveQuizScore(correctCount);
  updateSavedDisplay();

  debug('Quiz completed — score:', correctCount, '/', total);
}

// ---------------------------------------------------------------------------
// Retry
// ---------------------------------------------------------------------------

btnRetry?.addEventListener('click', () => {
  renderQuiz();
  debug('Quiz retried');
});

// ---------------------------------------------------------------------------
// Pledge section
// ---------------------------------------------------------------------------

/**
 * Render the pledge radio buttons from the pledgeOptions array.
 */
function renderPledgeOptions() {
  pledgeOptionsEl.innerHTML = '';

  pledgeOptions.forEach((text, i) => {
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

  // Pre-select saved pledge if one exists
  const saved = getPledge();
  if (saved) {
    const radios = pledgeOptionsEl.querySelectorAll('input[type="radio"]');
    radios.forEach((r) => {
      if (r.value === saved) r.checked = true;
    });
  }
}

btnSavePledge?.addEventListener('click', () => {
  const selected = pledgeOptionsEl.querySelector('input[name="pledge"]:checked');
  if (!selected) {
    pledgeConfirmEl.textContent = 'Please select a pledge first.';
    pledgeConfirmEl.style.color = 'var(--clr-danger)';
    pledgeConfirmEl.style.display = 'block';
    return;
  }

  savePledge(selected.value);
  pledgeConfirmEl.textContent = `Pledge saved: "${selected.value}"`;
  pledgeConfirmEl.style.color = 'var(--clr-primary)';
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
    ? `Quiz score: ${score} / ${quizQuestions.length}`
    : 'No quiz score saved yet.';

  savedPledgeEl.textContent = pledge
    ? `Pledge: "${pledge}"`
    : 'No pledge saved yet.';
}

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------

renderQuiz();
renderPledgeOptions();
updateSavedDisplay();
