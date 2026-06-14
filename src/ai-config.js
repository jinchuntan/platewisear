/**
 * ai-config.js — Centralised AI model configuration for AI Scan.
 *
 * Pinned, safe default model IDs so the feature works out of the box once the
 * API keys are set. Each default can be overridden by a server-side environment
 * variable (NEVER a VITE_ var, so models/keys stay out of the browser bundle).
 *
 * Required env (keys):   OPENROUTER_API_KEY, GROQ_API_KEY
 * Optional env (models): OPENROUTER_MODEL, GROQ_VISION_MODEL
 *
 * Resolution: env override → pinned default. An empty/unset env var falls back
 * to the default (so a blank Vercel value still works).
 */

export const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';
export const DEFAULT_GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

/** Resolved OpenRouter model: OPENROUTER_MODEL env → pinned default. */
export function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
}

/** Resolved Groq vision model: GROQ_VISION_MODEL env → pinned default. */
export function getGroqVisionModel() {
  return process.env.GROQ_VISION_MODEL || DEFAULT_GROQ_VISION_MODEL;
}
