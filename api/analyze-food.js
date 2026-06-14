/**
 * api/analyze-food.js — Vercel serverless function for AI Scan.
 *
 * Flow: validate input → OpenRouter (primary) → Groq (backup) → normalize →
 * return. Never exposes API keys. If no keys are set, returns `not_configured`
 * so the frontend can show a friendly message and keep the rest of the app
 * working. If both providers fail, returns `unavailable`.
 *
 * Response: { ok: true, result } | { ok: false, error: <code> }
 */

import { normalizeResult, extractJson } from '../src/ai-schema.js';
import { systemPromptAnalyze, userContentAnalyze } from '../src/ai-prompts.js';
import { openrouterChat, groqChat, hasOpenRouter, hasGroq } from '../src/ai-providers.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // ~5MB decoded
const IMAGE_RE = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+)$/;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return safeParse(Buffer.concat(chunks).toString('utf8'));
}
function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
function normLocale(loc) {
  return ['en', 'ms', 'zh-CN'].includes(loc) ? loc : 'en';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method_not_allowed' });

  // No keys configured → graceful, non-crashing state.
  if (!hasOpenRouter() && !hasGroq()) return send(res, 503, { ok: false, error: 'not_configured' });

  const body = await readBody(req);
  const image = body?.image;
  const locale = normLocale(body?.locale);
  // "camera" or "upload" — informational only, used for logging. The analysis
  // itself does not change based on where the image came from.
  const source = body?.source === 'camera' ? 'camera' : 'upload';

  const match = typeof image === 'string' && IMAGE_RE.exec(image);
  if (!match) return send(res, 400, { ok: false, error: 'bad_image' });
  const approxBytes = Math.floor((match[2].replace(/\s/g, '').length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) return send(res, 413, { ok: false, error: 'too_large' });

  const messages = [
    { role: 'system', content: systemPromptAnalyze(locale) },
    { role: 'user', content: userContentAnalyze(image, locale) },
  ];

  let result = null;
  let provider = null;

  if (hasOpenRouter()) {
    try {
      const content = await openrouterChat(messages, { json: true });
      result = normalizeResult(extractJson(content), locale);
      provider = 'openrouter';
    } catch (err) {
      console.error('[analyze-food] OpenRouter failed:', err.message);
    }
  }

  if (!result && hasGroq()) {
    try {
      const content = await groqChat(messages, { json: true });
      result = normalizeResult(extractJson(content), locale);
      provider = 'groq';
    } catch (err) {
      console.error('[analyze-food] Groq failed:', err.message);
    }
  }

  if (!result) return send(res, 502, { ok: false, error: 'unavailable' });

  result.provider = provider;
  console.log(`[analyze-food] success via ${provider} (locale: ${locale}, source: ${source})`);
  return send(res, 200, { ok: true, result });
}
