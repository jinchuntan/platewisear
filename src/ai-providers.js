/**
 * ai-providers.js — Server-side provider plumbing for AI Photo Mode.
 *
 * OpenAI-compatible chat calls to OpenRouter (primary) and Groq (backup).
 * Reads API keys + model names from process.env at call time. NEVER imported by
 * the frontend, so keys never reach the browser bundle. Uses the global fetch +
 * AbortController available in the Vercel Node runtime.
 *
 * Env vars (server-only; do NOT prefix with VITE_):
 *   OPENROUTER_API_KEY, OPENROUTER_MODEL
 *   GROQ_API_KEY, GROQ_VISION_MODEL
 *   PUBLIC_SITE_URL (optional, for OpenRouter attribution headers)
 */

const TIMEOUT_MS = 25000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

/** OpenRouter (primary). Vision-capable model via OPENROUTER_MODEL. */
export function openrouterChat(messages, opts) {
  const key = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  return postChat(OPENROUTER_URL, key, model, messages, {
    ...opts,
    extraHeaders: {
      'HTTP-Referer': process.env.PUBLIC_SITE_URL || 'https://platewise-ar.vercel.app',
      'X-Title': 'PlateWise AR',
    },
  });
}

/** Groq (backup). Vision-capable model via GROQ_VISION_MODEL. */
export function groqChat(messages, opts) {
  const key = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
  return postChat(GROQ_URL, key, model, messages, opts);
}
