/**
 * content.js — Central data store for PlateNudge
 *
 * All educational content, statistics, quiz questions and source references live
 * here, so every page reads from one source of truth.
 *
 * Data sources (full citations on the About page and in README):
 *  - UNEP Food Waste Index Report 2024
 *  - United Nations SDG 12 targets
 */

import { t } from './i18n.js';

// ---------------------------------------------------------------------------
// Food-waste facts displayed in the AR scene and demo mode
// ---------------------------------------------------------------------------
export const facts = [
  {
    id: 1,
    short: '1.05 billion tonnes of food were wasted globally in 2022.',
    detail:
      'According to the UNEP Food Waste Index Report 2024, an estimated 1.05 billion tonnes of food were wasted in 2022 across households, food service, and retail.',
    source: 'UNEP Food Waste Index Report 2024',
  },
  {
    id: 2,
    short: 'Households accounted for about 60% of global food waste.',
    detail:
      'The UNEP report estimates that households were responsible for approximately 60 percent of total food waste, making consumer behaviour a key area for intervention.',
    source: 'UNEP Food Waste Index Report 2024',
  },
  {
    id: 3,
    short:
      'About 19% of food available to consumers was wasted across retail, food service, and households.',
    detail:
      'Roughly 19 percent of the food available at the consumer stage was lost or wasted, highlighting a significant inefficiency in the food supply chain.',
    source: 'UNEP Food Waste Index Report 2024',
  },
  {
    id: 4,
    short:
      'SDG 12.3 aims to halve per-capita global food waste at retail and consumer levels by 2030.',
    detail:
      'Target 12.3 of the United Nations Sustainable Development Goals calls for halving per-capita food waste at retail and consumer levels and reducing food losses along production and supply chains by 2030.',
    source: 'United Nations SDG 12',
  },
  {
    id: 5,
    short:
      'Food waste represents embedded resources: land, water, labour, transport, energy, and packaging.',
    detail:
      'When food is wasted, all the resources invested in producing, transporting, storing, and packaging that food are also lost — including water, energy, land use, and human labour.',
    source: 'UNEP / FAO',
  },
  {
    id: 6,
    short:
      'SDG 12 focuses on Responsible Consumption and Production.',
    detail:
      'Sustainable Development Goal 12 calls for sustainable consumption and production patterns, aiming to do more with less and decoupling economic growth from environmental degradation.',
    source: 'United Nations SDG 12',
  },
  {
    id: 7,
    short:
      'Household decisions matter — most food-waste actions happen after food reaches the consumer.',
    detail:
      'Because a large share of food waste occurs at the consumer stage, individual household decisions about storage, portion planning, and leftovers can meaningfully reduce waste.',
    source: 'UNEP Food Waste Index Report 2024',
  },
  {
    id: 8,
    short:
      'Composting is useful for unavoidable scraps, but edible food should be eaten, saved, or shared first.',
    detail:
      'The food-waste hierarchy prioritises prevention (reducing surplus), then redistribution and reuse, and finally recycling via composting — composting should be the last resort for truly inedible waste.',
    source: 'UNEP / FAO',
  },
];

// ---------------------------------------------------------------------------
// Action definitions — each action the user can choose in the AR / demo scene
// ---------------------------------------------------------------------------
export const actions = {
  throwAway: {
    id: 'throwAway',
    label: 'Throw Away',
    icon: '🗑️',
    ariaLabel: 'Throw food away',
    feedback: 'Binning edible food wastes the water, land and energy used to grow it.',
    impactLevel: 'negative',
  },
  saveLeftovers: {
    id: 'saveLeftovers',
    label: 'Save Leftovers',
    icon: '📦',
    ariaLabel: 'Save leftovers for later',
    feedback: 'Storing leftovers is the easiest way to cut household food waste.',
    impactLevel: 'positive',
  },
  share: {
    id: 'share',
    label: 'Share',
    icon: '🤝',
    ariaLabel: 'Share surplus food',
    feedback: 'Sharing safe surplus feeds people instead of filling bins.',
    impactLevel: 'positive',
  },
  compost: {
    id: 'compost',
    label: 'Compost',
    icon: '🌱',
    ariaLabel: 'Compost scraps',
    feedback: 'Compost what can’t be eaten — it returns nutrients to the soil.',
    impactLevel: 'neutral',
  },
};

// ---------------------------------------------------------------------------
// Quiz questions for the reflection page
// ---------------------------------------------------------------------------
export const quizQuestions = [
  {
    id: 'q1',
    question: 'Which Sustainable Development Goal is PlateNudge aligned with?',
    options: ['SDG 2', 'SDG 7', 'SDG 12', 'SDG 15'],
    correctIndex: 2,
    explanation:
      'PlateNudge is aligned with SDG 12. It supports Responsible Consumption and Production.',
  },
  {
    id: 'q2',
    question: 'Which action is generally best for edible leftovers?',
    options: ['Throw them away', 'Save them for later', 'Compost them', 'Ignore them'],
    correctIndex: 1,
    explanation:
      'Saving edible leftovers for later consumption is one of the simplest and most effective ways to reduce household food waste.',
  },
  {
    id: 'q3',
    question: 'When is composting most appropriate?',
    options: [
      'For all food waste',
      'Only for cooked food',
      'For unavoidable inedible scraps',
      'Never',
    ],
    correctIndex: 2,
    explanation:
      'Composting is most appropriate for unavoidable scraps such as peels, cores, and shells. This is food that cannot be eaten, saved, or shared.',
  },
  {
    id: 'q4',
    question: 'Why is food waste more than just a disposal issue?',
    options: [
      'It only affects landfill space',
      'It wastes embedded resources like water, land, energy, and labour',
      'It is only an aesthetic problem',
      'It has no broader impact',
    ],
    correctIndex: 1,
    explanation:
      'When food is wasted, all the resources used to produce, transport, and store it are also lost. That includes water, land, energy, labour, and packaging.',
  },
  {
    id: 'q5',
    question:
      'Approximately what percentage of global food waste came from households in 2022?',
    options: ['20%', '40%', '60%', '80%'],
    correctIndex: 2,
    explanation:
      'According to the UNEP Food Waste Index Report 2024, households accounted for about 60% of global food waste in 2022.',
  },
];

// ---------------------------------------------------------------------------
// Target-specific quiz questions (2 per learning context)
//
// The Quick Check blends 2 of these with 3 general questions, so each scan or
// selection leads to a slightly more contextual quiz. English lives here;
// Malay + Chinese live in src/i18n.js under `targetQuizQuestions`. Keep the
// option ORDER identical across languages — correctIndex is language-neutral.
// ---------------------------------------------------------------------------
export const targetQuizQuestions = {
  'leftover-rice': [
    {
      question: 'What is usually the better first action for edible leftover rice?',
      options: ['Throw it away immediately', 'Store it safely and eat it soon', 'Compost it before checking', 'Ignore it'],
      correctIndex: 1,
      explanation: 'Edible leftovers should be saved first when they have been stored safely. PlateNudge cannot confirm food safety, so storage time and smell still matter.',
    },
    {
      question: 'Why does wasting cooked rice matter?',
      options: ['It only wastes the rice itself', 'It also wastes water, energy, labour, transport, and packaging', 'It has no wider impact', 'It is only a visual problem'],
      correctIndex: 1,
      explanation: 'Cooked food carries embedded resources. Throwing it away wastes more than the food on the plate.',
    },
  ],
  'fruit-peels': [
    {
      question: 'When is composting most suitable?',
      options: ['For unavoidable inedible scraps', 'For all edible leftovers', 'For sealed surplus food', 'For every drink container'],
      correctIndex: 0,
      explanation: 'Composting is useful for scraps such as peels and skins, while edible food should be eaten, saved, or shared first.',
    },
    {
      question: 'Why are fruit peels a good compost example?',
      options: ['They are usually unavoidable scraps', 'They are always safe to share', 'They are the same as cooked leftovers', 'They should always go to landfill'],
      correctIndex: 0,
      explanation: 'Peels and skins are often inedible, so composting can return nutrients to the soil when facilities exist.',
    },
  ],
  'bread-waste': [
    {
      question: 'What is usually better than binning edible surplus bread?',
      options: ['Share it or freeze it if it is suitable', 'Throw it away first', 'Compost every slice', 'Leave it uncovered'],
      correctIndex: 0,
      explanation: 'Edible surplus is best used before it becomes waste. Bread can often be shared or frozen, but mouldy bread should not be eaten or shared.',
    },
    {
      question: 'What should you check before sharing bread?',
      options: ['Whether it is clearly safe and not mouldy', 'Whether the app says it is definitely safe', 'Whether it looks expensive', 'Whether it is already in the bin'],
      correctIndex: 0,
      explanation: 'PlateNudge cannot confirm food safety. Do not share questionable or mouldy food.',
    },
  ],
  'mixed-leftovers': [
    {
      question: 'What should you do before composting mixed leftovers?',
      options: ['Separate edible parts from true scraps', 'Compost everything immediately', 'Ignore the edible parts', 'Mix it with packaging'],
      correctIndex: 0,
      explanation: 'Use edible portions first. Composting should be for genuine scraps that cannot be eaten, saved, or shared.',
    },
    {
      question: 'Why does sorting mixed waste help?',
      options: ['It helps recover edible food and compost unavoidable scraps', 'It makes all food safe', 'It removes the need for SDG 12', 'It creates exact carbon data'],
      correctIndex: 0,
      explanation: 'Sorting supports better decisions because edible food and inedible scraps need different actions.',
    },
  ],
  'drink-waste': [
    {
      question: 'What is a good prevention action for drink waste?',
      options: ['Buy or make only what you will finish', 'Always buy larger drinks', 'Throw away unopened drinks', 'Ignore packaging'],
      correctIndex: 0,
      explanation: 'Preventing surplus is usually better than dealing with waste later.',
    },
    {
      question: 'Which drink item is usually more suitable to share?',
      options: ['A sealed unopened drink', 'An opened drink left out for hours', 'A dirty disposable cup', 'A drink with unknown contents'],
      correctIndex: 0,
      explanation: 'Sharing should be limited to sealed or clearly suitable surplus. PlateNudge cannot confirm food safety.',
    },
  ],
  'ai-scan': [
    {
      question: 'What does AI Scan analyse?',
      options: ['One camera snapshot', 'A continuous live tracking stream', 'The exact food safety status', 'The exact weight of the waste'],
      correctIndex: 0,
      explanation: 'AI Scan analyses one snapshot and creates a learning exhibit. It does not perform live object tracking.',
    },
    {
      question: 'What should you remember about AI guidance?',
      options: ['It cannot confirm food safety', 'It always knows if food is safe', 'It gives exact carbon values', 'It replaces common sense'],
      correctIndex: 0,
      explanation: 'AI assisted guidance is only a learning aid. Check storage time, smell, contamination, and local food safety guidance.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Pledge options for the reflection section
// ---------------------------------------------------------------------------
export const pledgeOptions = [
  'I will save leftovers.',
  'I will plan portions better.',
  'I will share edible surplus when safe.',
  'I will compost unavoidable scraps.',
];

// ---------------------------------------------------------------------------
// Source references used in the About page
// ---------------------------------------------------------------------------
export const sources = [
  {
    label: 'UNEP Food Waste Index Report 2024',
    reference:
      'United Nations Environment Programme (2024). Food Waste Index Report 2024. Nairobi: UNEP.',
    url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
  },
  {
    label: 'United Nations SDG 12',
    reference:
      'United Nations (n.d.). Sustainable Development Goal 12: Ensure sustainable consumption and production patterns.',
    url: 'https://sdgs.un.org/goals/goal12',
  },
  {
    label: 'FAO — Food Loss and Food Waste',
    reference:
      'Food and Agriculture Organization of the United Nations (n.d.). Food Loss and Food Waste.',
    url: 'https://www.fao.org/food-loss-and-food-waste/en/',
  },
];

// ---------------------------------------------------------------------------
// Locale-aware accessors — English falls back to the source arrays above;
// Malay / Chinese come from src/i18n.js. correctIndex stays language-neutral.
// ---------------------------------------------------------------------------

/** Quiz questions for the active locale (preserves each question's correctIndex). */
export function getQuizQuestions() {
  const tr = t('quizQuestions');
  if (!Array.isArray(tr)) return quizQuestions;
  return quizQuestions.map((q, i) => ({
    ...q,
    question: tr[i]?.question ?? q.question,
    options: tr[i]?.options ?? q.options,
    explanation: tr[i]?.explanation ?? q.explanation,
  }));
}

/**
 * Target-specific questions for a context id, localised (or null if none).
 * Mirrors getQuizQuestions: English from this module, ms/zh from i18n, with the
 * language-neutral correctIndex preserved.
 * @param {string} targetId
 */
export function getTargetQuizQuestions(targetId) {
  const base = targetQuizQuestions[targetId];
  if (!Array.isArray(base)) return null;
  const tr = t(`targetQuizQuestions.${targetId}`);
  return base.map((q, i) => {
    const trq = Array.isArray(tr) ? tr[i] : null;
    return {
      ...q,
      question: trq?.question ?? q.question,
      options: trq?.options ?? q.options,
      explanation: trq?.explanation ?? q.explanation,
    };
  });
}

/**
 * Demo note. This is what makes the Quick Check feel personalised. It builds a
 * blended quiz of 2 target-specific questions (about whatever the user just
 * scanned) followed by 3 general SDG 12 questions. With no known target it
 * returns the full general quiz, so the page always has questions. Kept to about
 * 5 questions so reflection stays short.
 * @param {string|null} targetId
 */
export function getBlendedQuiz(targetId) {
  const general = getQuizQuestions();
  const targetQs = targetId ? getTargetQuizQuestions(targetId) : null;
  if (!targetQs || !targetQs.length) return general;
  // General subset: SDG 12 alignment, embedded resources, household share.
  const generalSubset = [general[0], general[3], general[4]].filter(Boolean);
  return [...targetQs, ...generalSubset];
}

/** Pledge option strings for the active locale. */
export function getPledgeOptions() {
  const tr = t('pledgeOptions');
  return Array.isArray(tr) ? tr : pledgeOptions;
}

/** Localised label + feedback for an action id (used by the quiz recall note). */
export function getActionInfo(id) {
  const base = actions[id];
  if (!base) return null;
  return {
    ...base,
    label: t(`actions.${id}.label`) || base.label,
    feedback: t(`actions.${id}.feedback`) || base.feedback,
  };
}
