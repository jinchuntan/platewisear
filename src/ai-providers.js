/**
 * ai-providers.js — Server-side provider plumbing for AI Scan.
 *
 * OpenAI-compatible chat calls to OpenRouter (primary) and Groq (backup).
 * Reads API keys + model names from process.env at call time. NEVER imported by
 * the frontend, so keys never reach the browser bundle. Uses the global fetch +
 * AbortController available in the Vercel Node runtime.
 *
 * Env vars (server-only; do NOT prefix with VITE_):
 *   OPENROUTER_API_KEY, OPENROUTER_MODEL    (model optional — see ai-config.js)
 *   GROQ_API_KEY, GROQ_VISION_MODEL         (model optional — see ai-config.js)
 *   PUBLIC_SITE_URL (optional, for OpenRouter attribution headers)
 *
 * Model IDs are pinned in ai-config.js with env override, so the feature works
 * with only the API keys set.
 */

import { getOpenRouterModel, getGroqVisionModel } from './ai-config.js';

const TIMEOUT_MS = 25000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Keys are read from process.env at call time and only ever sent in the
// Authorization header of the server to provider request. They are never logged,
// since we log the model name and never the key, and never returned to the browser.
export function hasOpenRouter() {
  return !!process.env.OPENROUTER_API_KEY;
}
export function hasGroq() {
  return !!process.env.GROQ_API_KEY;
}

async function postChat(url, key, model, messages, { json = true, extraHeaders = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = { model, messages, temperature: 0.2, max_tokens: 900 };
    if (json) body.response_format = { type: 'json_object' };

    const resp = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, ...extraHeaders },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      const err = new Error(`HTTP ${resp.status}: ${detail.slice(0, 180)}`);
      err.status = resp.status;
      throw err;
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error('empty model content');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

/** OpenRouter (primary). Vision-capable model from ai-config (env-overridable). */
export function openrouterChat(messages, opts) {
  const key = process.env.OPENROUTER_API_KEY;
  const model = getOpenRouterModel();
  console.log(`[ai] OpenRouter request — model: ${model}`); // never logs the key
  return postChat(OPENROUTER_URL, key, model, messages, {
    ...opts,
    extraHeaders: {
      'HTTP-Referer': process.env.PUBLIC_SITE_URL || 'https://platewise-ar.vercel.app',
      'X-Title': 'PlateNudge',
    },
  });
}

/** Groq (backup). Vision-capable model from ai-config (env-overridable). */
export function groqChat(messages, opts) {
  const key = process.env.GROQ_API_KEY;
  const model = getGroqVisionModel();
  console.log(`[ai] Groq request — model: ${model}`); // never logs the key
  return postChat(GROQ_URL, key, model, messages, opts);
}
