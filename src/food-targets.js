/**
 * food-targets.js — Curated food-waste image targets and their exhibit content.
 *
 * PlateWise AR turns curated food-waste images into AR "museum exhibits". Each
 * entry maps a compiled MindAR image target (by `targetIndex`) to the content
 * shown in the AR exhibit card, the contextual bottom sheet, and the Ask-More
 * drawer.
 *
 * IMPORTANT (honesty about scope):
 *  - The app recognises ONLY these curated images, in this exact order. The
 *    `targetIndex` MUST match the order the images were given to the MindAR
 *    compiler when producing public/assets/targets/food-waste-targets.mind.
 *  - It does NOT recognise arbitrary food-waste photos, and it does NOT confirm
 *    food safety. (A future AI mode could analyse uploaded images — not now.)
 *
 * Source images live in public/assets/targets/source/ (used for the compiler
 * and for Demo Mode previews). No fabricated carbon values or food weights.
 */

import { t } from './i18n.js';

/** Short labels for the four action choices (English fallback). */
export const ACTION_LABELS = {
  throwAway: 'Throw',
  saveLeftovers: 'Save',
  share: 'Share',
  compost: 'Compost',
};

/** Localised short action label (falls back to the English ACTION_LABELS). */
export function actionLabel(id) {
  return t(`actions.${id}.short`) || ACTION_LABELS[id] || id;
}

/**
 * Return a copy of a target with its text fields swapped for the active locale.
 * English requests return the base target unchanged (t() yields undefined and
 * we fall back to the source values defined below).
 * @param {FoodTarget} target
 * @returns {FoodTarget}
 */
export function localizedTarget(target) {
  if (!target) return target;
  const tr = t(`targets.${target.id}`);
  if (!tr || typeof tr !== 'object') return target;
  return {
    ...target,
    title: tr.title ?? target.title,
    shortLabel: tr.shortLabel ?? target.shortLabel,
    wasteType: tr.wasteType ?? target.wasteType,
    quickFact: tr.quickFact ?? target.quickFact,
    defaultMessage: tr.defaultMessage ?? target.defaultMessage,
    askMoreTitle: tr.askMoreTitle ?? target.askMoreTitle,
    askMoreExplanation: tr.askMoreExplanation ?? target.askMoreExplanation,
    safetyNote: tr.safetyNote ?? target.safetyNote,
    actionGuidance: { ...target.actionGuidance, ...(tr.actionGuidance || {}) },
  };
}

/**
 * @typedef {Object} FoodTarget
 * @property {number} targetIndex
 * @property {string} id
 * @property {string} title
 * @property {string} shortLabel
 * @property {string} wasteType
 * @property {string} quickFact
 * @property {string} source
 * @property {string} image
 * @property {('throwAway'|'saveLeftovers'|'share'|'compost')} recommendedAction
 * @property {string} defaultMessage
 * @property {Object} actionGuidance
 * @property {string} askMoreTitle
 * @property {string} askMoreExplanation
 * @property {string} safetyNote
 */

/** @type {FoodTarget[]} */
export const TARGETS = [
  {
    targetIndex: 0,
    id: 'leftover-rice',
    title: 'Leftover rice',
    shortLabel: 'Edible leftovers',
    wasteType: 'Cooked food',
    quickFact: 'Households account for about 60% of global food waste.',
    source: 'UNEP Food Waste Index Report 2024',
    image: './assets/targets/source/leftover-rice.jpg',
    defaultMessage: 'If still safe, storing leftovers is usually better than throwing them away.',
    recommendedAction: 'saveLeftovers',
    actionGuidance: {
      throwAway: 'Only throw away if spoiled or unsafe.',
      saveLeftovers: 'Store in a clean container and eat soon.',
      share: 'Share only if it is safe and hygienic.',
      compost: 'Use composting for unavoidable scraps, not edible food.',
    },
    askMoreTitle: 'Why this matters',
    askMoreExplanation:
      'Wasted cooked food represents embedded resources such as water, energy, labour, transport, and packaging.',
    safetyNote: 'The app cannot confirm food safety. Check smell, storage time, and contamination. Cooked rice in particular should be cooled quickly, refrigerated, and reheated only once.',
  },
  {
    targetIndex: 1,
    id: 'fruit-peels',
    title: 'Fruit peels',
    shortLabel: 'Unavoidable scraps',
    wasteType: 'Peels & skins',
    quickFact: 'Composting returns nutrients from scraps to the soil.',
    source: 'UNEP / FAO',
    image: './assets/targets/source/fruit-peels.jpg',
    defaultMessage: 'Peels are usually inedible — compost them instead of sending them to landfill.',
    recommendedAction: 'compost',
    actionGuidance: {
      throwAway: 'Avoid landfill where composting is available.',
      saveLeftovers: 'Some peels are usable — e.g. citrus zest before composting the rest.',
      share: 'Not suitable for sharing.',
      compost: 'Compost peels and skins to enrich soil.',
    },
    askMoreTitle: 'Why compost scraps',
    askMoreExplanation:
      'Composting is the right step for genuinely inedible scraps. It keeps organic matter out of landfill (where it releases methane) and returns nutrients to the soil.',
    safetyNote: 'Compost unavoidable scraps only — edible food should be eaten, saved, or shared first.',
  },
  {
    targetIndex: 2,
    id: 'bread-waste',
    title: 'Bread waste',
    shortLabel: 'Surplus / edible',
    wasteType: 'Bakery surplus',
    quickFact: 'About 19% of food available to consumers is wasted.',
    source: 'UNEP Food Waste Index Report 2024',
    image: './assets/targets/source/bread-waste.jpg',
    defaultMessage: 'Most of this bread looks edible — sharing or freezing beats binning it.',
    recommendedAction: 'share',
    actionGuidance: {
      throwAway: 'Last resort — only if mouldy or stale beyond use.',
      saveLeftovers: 'Freeze bread to extend its life, or use it for toast, crumbs, or croutons.',
      share: 'Redistribute safe surplus to people or food banks.',
      compost: 'Compost only pieces that are mouldy or truly inedible.',
    },
    askMoreTitle: 'Why surplus matters',
    askMoreExplanation:
      'Throwing away edible surplus wastes the water, land, energy, and labour used to produce it. Preventing and redistributing surplus sits at the top of the food-waste hierarchy.',
    safetyNote: 'The app cannot confirm food safety. Do not share or eat bread showing mould.',
  },
  {
    targetIndex: 3,
    id: 'mixed-leftovers',
    title: 'Mixed leftovers',
    shortLabel: 'Plate scraps',
    wasteType: 'Mixed / trimmings',
    quickFact: 'SDG 12.3 aims to halve per-person food waste by 2030.',
    source: 'United Nations SDG 12',
    image: './assets/targets/source/mixed-leftovers.jpg',
    defaultMessage: 'Use the edible parts first; compost only the true trimmings.',
    recommendedAction: 'saveLeftovers',
    actionGuidance: {
      throwAway: 'Mixed waste in the bin is hard to recover — separate it instead.',
      saveLeftovers: 'Use edible parts (stalks, florets, peppers) in stocks, soups, or stir-fries.',
      share: 'Share edible portions before they spoil.',
      compost: 'Compost the genuine scraps (peels, cores, skins).',
    },
    askMoreTitle: 'Why prevention matters',
    askMoreExplanation:
      'Much plate and prep waste is avoidable. Planning portions, using edible trimmings, and composting only the rest cut waste at the source — the cheapest, most effective step.',
    safetyNote: 'The app cannot confirm food safety. When in doubt, do not eat or share questionable food.',
  },
  {
    targetIndex: 4,
    id: 'drink-waste',
    title: 'Drink waste',
    shortLabel: 'Drinks & cups',
    wasteType: 'Beverages / single-use',
    quickFact: 'Wasted drinks also waste water, ingredients, and packaging.',
    source: 'UNEP / FAO',
    image: './assets/targets/source/drink-waste.jpg',
    defaultMessage: 'Make or buy only what you’ll finish, and choose reusable cups.',
    recommendedAction: 'saveLeftovers',
    actionGuidance: {
      throwAway: 'Pour unavoidable liquid away; recycle clean cans and bottles.',
      saveLeftovers: 'Keep unfinished drinks sealed for later, and prefer reusable cups.',
      share: 'Sealed, unopened drinks can be shared; open ones generally cannot.',
      compost: 'Most cups are plastic-lined — not compostable. Recycle where possible.',
    },
    askMoreTitle: 'Why drinks count',
    askMoreExplanation:
      'Drinks carry embedded water and ingredients, and single-use cups add packaging waste. Buying only what you finish and using reusables cuts both.',
    safetyNote: 'The app cannot confirm drink safety. Discard drinks left out too long.',
  },
];

/** Look up a target by its compiled index. */
export function getTargetByIndex(index) {
  return TARGETS.find((t) => t.targetIndex === index) || null;
}

/** Look up a target by id. */
export function getTargetById(id) {
  return TARGETS.find((t) => t.id === id) || null;
}
