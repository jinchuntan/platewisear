/**
 * content.js — Central data store for PlateNudge
 *
 * All educational content, statistics, quiz questions, and source references
 * are maintained here so every page draws from a single source of truth.
 *
 * DATA SOURCES (full citations on the About page and in README):
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
