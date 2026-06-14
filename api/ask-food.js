/**
 * api/ask-food.js — Phase 2 contextual "Ask more" for AI Scan.
 *
 * Answers ONLY about the current analysis result (passed in by the client).
 * This is NOT a general homepage chatbot. Same provider fallback + safety
 * scrubbing as analyze-food. Returns plain-text answer.
 *
 * Response: { ok: true, answer, provider } | { ok: false, error: <code> }
 */

import { scrubAnswer } from '../src/ai-schema.js';
import { systemPromptAsk, userContentAsk } from '../src/ai-prompts.js';
import { openrouterChat, groqChat, hasOpenRouter, hasGroq } from '../src/ai-providers.js';

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
  if (!hasOpenRouter() && !hasGroq()) return send(res, 503, { ok: false, error: 'not_configured' });

  const body = await readBody(req);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  const analysisResult = body?.analysisResult && typeof body.analysisResult === 'object' ? body.analysisResult : null;
  const locale = normLocale(body?.locale);

  if (!question || question.length > 300) return send(res, 400, { ok: false, error: 'bad_question' });
  if (!analysisResult) return send(res, 400, { ok: false, error: 'missing_context' });

  const messages = [
    { role: 'system', content: systemPromptAsk(locale) },
    { role: 'user', content: userContentAsk(question, analysisResult, locale) },
  ];

  let answer = null;
  let provider = null;

  if (hasOpenRouter()) {
    try {
      answer = scrubAnswer(await openrouterChat(messages, { json: false }), locale);
      provider = 'openrouter';
    } catch (err) {
      console.error('[ask-food] OpenRouter failed:', err.message);
    }
  }
  if (!answer && hasGroq()) {
    try {
      answer = scrubAnswer(await groqChat(messages, { json: false }), locale);
      provider = 'groq';
    } catch (err) {
      console.error('[ask-food] Groq failed:', err.message);
    }
  }

  if (!answer) return send(res, 502, { ok: false, error: 'unavailable' });
  console.log(`[ask-food] success via ${provider} (locale: ${locale})`);
  return send(res, 200, { ok: true, answer, provider });
}
