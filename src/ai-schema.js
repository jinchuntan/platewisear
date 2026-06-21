/**
 * ai-schema.js — Shared schema, trusted facts, and a safety-aware normalizer
 * for AI Scan. Pure ESM with NO browser or Node-only APIs, so it can be
 * imported by both the frontend (ai-controller / renderer) and the serverless
 * functions in /api.
 *
 * Honesty model. The model is asked to choose a `factKey` (never to invent
 * statistics), and `normalizeResult()` enforces the allow-lists, scrubs any
 * disallowed claims (food-safety confirmation, exact weight/carbon), and always
 * substitutes our own canonical safety note. The UI also shows a fixed
 * disclaimer, so the output is safe even if a model misbehaves.
 */

export const ALLOWED_ACTIONS = ['throwAway', 'saveLeftovers', 'share', 'compost'];
export const ALLOWED_CONFIDENCE = ['low', 'medium', 'high'];
// Whether the camera frame actually shows a food-waste scene. Used by the
// camera scan flow to decide between showing a result and asking for a retry.
export const ALLOWED_SCENE_STATUS = ['detected', 'unclear', 'not_food_waste'];
export const ALLOWED_FACT_KEYS = [
  'household_food_waste',
  'consumer_food_waste',
  'sdg_123',
  'composting_scraps',
  'edible_surplus',
  'avoid_overbuying',
];

/** Curated, source-backed facts. The AI may only reference these by key. */
export const TRUSTED_FACTS = {
  household_food_waste: {
    text: {
      en: 'Households account for about 60% of global food waste.',
      ms: 'Isi rumah menyumbang kira-kira 60% daripada sisa makanan global.',
      'zh-CN': '家庭约占全球食物浪费的 60%。',
    },
    source: 'UNEP Food Waste Index Report 2024',
  },
  consumer_food_waste: {
    text: {
      en: 'About 19% of food available to consumers is wasted.',
      ms: 'Kira-kira 19% makanan yang tersedia kepada pengguna dibazirkan.',
      'zh-CN': '约 19% 供应给消费者的食物被浪费。',
    },
    source: 'UNEP Food Waste Index Report 2024',
  },
  sdg_123: {
    text: {
      en: 'SDG 12.3 aims to halve per-person food waste by 2030.',
      ms: 'SDG 12.3 menyasarkan pengurangan separuh sisa makanan per kapita menjelang 2030.',
      'zh-CN': 'SDG 12.3 旨在到 2030 年将人均食物浪费减半。',
    },
    source: 'United Nations SDG 12',
  },
  composting_scraps: {
    text: {
      en: 'Composting returns nutrients from unavoidable scraps to the soil.',
      ms: 'Pengkomposan mengembalikan nutrien daripada sisa yang tidak dapat dielak kepada tanah.',
      'zh-CN': '堆肥能把无法避免的残渣中的养分归还给土壤。',
    },
    source: 'UNEP / FAO',
  },
  edible_surplus: {
    text: {
      en: 'Edible surplus is best shared or stored before it is thrown away.',
      ms: 'Lebihan yang boleh dimakan paling baik dikongsi atau disimpan sebelum dibuang.',
      'zh-CN': '可食用的余量最好在丢弃前分享或保存。',
    },
    source: 'UNEP / FAO',
  },
  avoid_overbuying: {
    text: {
      en: 'Buying only what you need is the simplest way to prevent food waste.',
      ms: 'Membeli hanya apa yang diperlukan ialah cara paling mudah untuk mencegah pembaziran makanan.',
      'zh-CN': '只购买所需是预防食物浪费最简单的方法。',
    },
    source: 'UNEP Food Waste Index Report 2024',
  },
};

/** Canonical safety note — we never trust the model's own wording here. */
export const SAFETY_NOTE = {
  en: 'The app cannot confirm food safety. Check storage time, smell, contamination, and local food-safety guidance.',
  ms: 'Aplikasi ini tidak boleh mengesahkan keselamatan makanan. Periksa tempoh simpanan, bau, pencemaran, dan panduan keselamatan makanan tempatan.',
  'zh-CN': '此应用无法确认食物是否安全食用。请检查存放时间、气味、是否受污染，并参考当地的食品安全指南。',
};

const DEFAULTS = {
  wasteType: { en: 'Mixed food waste', ms: 'Sisa makanan bercampur', 'zh-CN': '混合食物浪费' },
  shortExhibitText: {
    en: 'Separate edible food from scraps before disposal.',
    ms: 'Asingkan makanan yang boleh dimakan daripada sisa sebelum pelupusan.',
    'zh-CN': '在丢弃前把可食用的食物与残渣分开。',
  },
  actionReason: {
    en: 'Based on the visible items, this general action is usually best.',
    ms: 'Berdasarkan item yang kelihatan, tindakan umum ini biasanya terbaik.',
    'zh-CN': '根据可见的物品，这个一般性的做法通常最合适。',
  },
  detectionMessage: {
    en: 'I cannot clearly see food waste yet. Move closer, improve lighting, or try another angle.',
    ms: 'Saya belum nampak sisa makanan dengan jelas. Dekatkan lagi, tingkatkan pencahayaan, atau cuba sudut lain.',
    'zh-CN': '暂时看不清食物浪费。靠近一点、改善光线，或换个角度再试。',
  },
  guidance: {
    throwAway: {
      en: 'Throw away only if spoiled or unsafe.',
      ms: 'Buang hanya jika rosak atau tidak selamat.',
      'zh-CN': '只有在变质或不安全时才丢弃。',
    },
    saveLeftovers: {
      en: 'Save edible items only if they were stored safely.',
      ms: 'Simpan item yang boleh dimakan hanya jika disimpan dengan selamat.',
      'zh-CN': '只有在安全存放的情况下才保存可食用的物品。',
    },
    share: {
      en: 'Share only sealed or clearly safe surplus.',
      ms: 'Kongsi hanya lebihan yang tertutup atau jelas selamat.',
      'zh-CN': '只分享密封或明显安全的余量。',
    },
    compost: {
      en: 'Compost unavoidable scraps where facilities exist.',
      ms: 'Kompos sisa yang tidak dapat dielak di tempat yang ada kemudahan.',
      'zh-CN': '在有设施的地方把无法避免的残渣堆肥。',
    },
  },
};

// Phrases the AI must never produce (food-safety confirmation, medical claims,
// exact weight, exact carbon). Matched fields are replaced with safe defaults.
const DISALLOWED =
  /(safe to eat|definitely safe|guaranteed safe|perfectly safe|no bacteria|free of bacteria|won'?t make you sick|fit for consumption|\b\d+(\.\d+)?\s?(g|kg|grams?|kilograms?)\b|\b\d+(\.\d+)?\s?(kg\s?)?co2\b|carbon footprint)/i;

function pick(map, locale) {
  return (map && (map[locale] || map.en)) || '';
}
function asString(v) {
  return typeof v === 'string' ? v.trim() : '';
}
function asArray(v) {
  return Array.isArray(v)
    ? v.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim().slice(0, 80)).slice(0, 6)
    : [];
}
/** Return text unless it contains a disallowed claim, in which case use fallback. */
function clean(text, fallback) {
  const s = asString(text);
  if (!s) return fallback;
  return DISALLOWED.test(s) ? fallback : s.slice(0, 400);
}

/**
 * Pull the first JSON object out of a model response (handles bare JSON and
 * JSON wrapped in prose / code fences).
 * @param {string} content
 * @returns {object}
 */
export function extractJson(content) {
  if (typeof content !== 'string') throw new Error('no content');
  try {
    return JSON.parse(content);
  } catch { /* fall through */ }
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start >= 0 && end > start) return JSON.parse(content.slice(start, end + 1));
  throw new Error('no JSON object found in model output');
}

/**
 * Validate + sanitize a raw model object into the canonical PlateNudge AI shape.
 * Enforces enums, scrubs disallowed claims, and forces our safety note.
 * Throws only if `raw` is not an object (so the caller can try the other provider).
 * @param {*} raw
 * @param {('en'|'ms'|'zh-CN')} locale
 * @returns {object}
 */
// This normalizer is the trust boundary for AI output. It never assumes the
// model behaved. It forces every enum onto an allow-list, scrubs any disallowed
// claim (food-safety confirmation, exact weight/carbon) via clean(), keeps facts
// to our TRUSTED_FACTS by factKey, and always substitutes our own canonical
// safety note. So even a misbehaving model produces safe output.
export function normalizeResult(raw, locale = 'en') {
  if (!raw || typeof raw !== 'object') throw new Error('result is not an object');

  const recommendedAction = ALLOWED_ACTIONS.includes(raw.recommendedAction) ? raw.recommendedAction : 'compost';
  const confidence = ALLOWED_CONFIDENCE.includes(raw.confidence) ? raw.confidence : 'low';
  const factKey = ALLOWED_FACT_KEYS.includes(raw.factKey) ? raw.factKey : 'household_food_waste';

  // Scene detection (camera scan). Default to "detected" so an older model that
  // omits the field still behaves like the original upload flow.
  const sceneStatus = ALLOWED_SCENE_STATUS.includes(raw.sceneStatus) ? raw.sceneStatus : 'detected';
  const isFoodWasteLikely =
    typeof raw.isFoodWasteLikely === 'boolean' ? raw.isFoodWasteLikely : sceneStatus === 'detected';

  const rawGuidance = raw.guidance && typeof raw.guidance === 'object' ? raw.guidance : {};
  const guidance = {};
  for (const a of ALLOWED_ACTIONS) {
    guidance[a] = clean(rawGuidance[a], pick(DEFAULTS.guidance[a], locale));
  }

  const visibleItems = asArray(raw.visibleItems);
  const wasteType = clean(raw.wasteType, pick(DEFAULTS.wasteType, locale));

  return {
    mode: 'ai_photo',
    language: locale,
    provider: typeof raw.provider === 'string' ? raw.provider : undefined,
    visibleItems,
    uncertainItems: asArray(raw.uncertainItems),
    wasteType,
    confidence,
    sceneStatus,
    isFoodWasteLikely,
    detectionMessage: clean(raw.detectionMessage, pick(DEFAULTS.detectionMessage, locale)),
    recommendedAction,
    actionReason: clean(raw.actionReason, pick(DEFAULTS.actionReason, locale)),
    factKey,
    arTitle: clean(raw.arTitle, wasteType),
    shortExhibitText: clean(raw.shortExhibitText, pick(DEFAULTS.shortExhibitText, locale)),
    guidance,
    safetyNote: pick(SAFETY_NOTE, locale), // always canonical — never the model's wording
    followUpQuestions: asArray(raw.followUpQuestions).slice(0, 3),
    disallowedClaimsAvoided: true,
  };
}

/** Light scrubber for free-text answers (Phase 2 Ask More). */
export function scrubAnswer(text, locale = 'en') {
  const s = asString(text);
  if (!s) return '';
  if (DISALLOWED.test(s)) return `${s}\n\n${pick(SAFETY_NOTE, locale)}`;
  return s.slice(0, 600);
}
