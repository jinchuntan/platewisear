# PlateNudge — Code Walkthrough for the Demo Video

> A guide for screen-recording a tour of the PlateNudge codebase (WOA7019 AR
> project). It tells you **what to open**, **in what order**, and gives **short
> speaker notes** you can read almost verbatim. Throughout the source you will
> find short demo notes (plus safety and fallback notes) that mark the exact
> lines referenced here.

---

## 0. What to show first

Open the project root and show the folder shape for ~15 seconds before diving in:

```
platenudge/
├─ index.html          ← home / navigation hub
├─ ar.html             ← curated AR scan (MindAR)
├─ ai.html             ← optional AI scan (camera + AI)
├─ demo.html           ← no-camera mirror of the AR flow
├─ quiz.html / about.html / marker.html
├─ api/                ← serverless AI routes (run on the server, not the browser)
│   ├─ analyze-food.js
│   └─ ask-food.js
├─ src/                ← all front-end logic + the single content source
│   ├─ food-targets.js ← single source of truth for curated content
│   ├─ ar-controller.js / ai-controller.js / demo-controller.js
│   ├─ askmore.js / quiz.js / content.js
│   ├─ i18n.js / storage.js / utils.js / styles.css
│   └─ ai-*.js         ← schema, prompts, providers, config, renderer
└─ public/assets/targets/  ← compiled MindAR .mind file + source images
```

**Speaker note:** "PlateNudge is a mobile-first web app — plain HTML, CSS and
JavaScript with Vite as the build tool. There are three ways to use it: a curated
AR scan, an optional AI scan, and a no-camera demo mode. All three share one
content file and one design system, so the project stays small and consistent."

---

## 1. Which file controls each feature

| Feature | Page (HTML) | Logic (JS) |
|---|---|---|
| Home & navigation | `index.html` | `src/app.js` (top bar + i18n) |
| Curated AR scan | `ar.html` | `src/ar-controller.js` |
| Curated content (the "truth") | — | `src/food-targets.js` |
| AR overlay / bottom sheet | `ar.html` | `src/ar-controller.js` |
| Ask More (curated) | `ar.html` / `demo.html` | `src/askmore.js` |
| Quick Check (quiz + pledge) | `quiz.html` | `src/quiz.js` + `src/content.js` |
| Demo Mode | `demo.html` | `src/demo-controller.js` |
| AI Scan | `ai.html` | `src/ai-controller.js` (+ `ai-result-renderer.js`) |
| AI API + provider fallback | — | `api/analyze-food.js`, `api/ask-food.js` |
| AI safety / normalisation | — | `src/ai-schema.js`, `src/ai-prompts.js` |
| AI provider plumbing & keys | — | `src/ai-providers.js`, `src/ai-config.js` |
| Language switching | all pages | `src/i18n.js` |
| Saved progress | all pages | `src/storage.js` |
| Styling / responsive | all pages | `src/styles.css` |

---

## 2. Suggested order for explaining the implementation

Follow this order in the recording. Each step lists the file(s) to open, the key
lines to scroll to, and a natural speaker note.

### 2.1 Project structure
- **Open:** the folder tree (section 0) and `package.json`.
- **Speaker note:** "It's a static multi-page app. `npm run build` bundles it with
  Vite; the only server-side code is the two AI routes in `api/`, which Vercel runs
  as serverless functions. Notice there's no framework and no database — state is
  kept in the browser's localStorage."

### 2.2 Home page and navigation
- **Open:** `index.html` → the demo note above `<main>`, then the `hero__cta`
  block.
- **Speaker note:** "The home page is just a navigation hub. These three buttons —
  Start scan, AI Scan, Try demo — are the three modes. Every visible string has a
  `data-i18n` key, which is how the whole page switches language. `src/app.js`
  injects the shared top bar and runs the translator on load."

### 2.3 Curated AR scan
- **Open:** `ar.html` → the top demo note, then the `<a-scene>` element.
- **Open:** `src/ar-controller.js` → the file header, then the `startFlow()`
  demo note.
- **Speaker note:** "The AR scan uses MindAR for image tracking, layered on top of
  A-Frame. Both libraries are pinned and vendored locally — no CDN — so the demo is
  reproducible. Before the camera ever starts, `startFlow()` runs a chain of safety
  checks: is the compiled target file present, are we on HTTPS, does the browser
  support the camera, and is permission granted. Each check has its own friendly
  fallback screen."

### 2.4 MindAR target mapping
- **Open:** `src/food-targets.js` → the top demo note (the target-order map) and
  the safety comment above `TARGETS`.
- **Open:** `ar.html` → the demo note above "Target 0".
- **Speaker note:** "This file is the single source of truth. The five targets are
  fixed in this order — leftover rice, fruit peels, bread waste, mixed leftovers,
  drink waste — and that order must match the images compiled into the `.mind`
  file. When MindAR recognises image number 2, `ar-controller.js` calls
  `getTargetByIndex(2)` and pulls bread-waste content out of this array. Each entry
  stores the title, a sourced fact, a recommended action, per-action guidance, the
  Ask-More text, and a safety note."

### 2.5 AR overlay
- **Open:** `ar.html` → the top bar, the scan overlay, and the `ar-tap-cue` button.
- **Open:** `src/ar-controller.js` → `onArReady()` and the `targetFound` /
  `targetLost` demo note / fallback.
- **Speaker note:** "Everything you see over the camera is HTML drawn on top of the
  video — the status screen, the top bar, the scanning frame. When a target is
  found we show the exhibit; when it's lost we wait 800 milliseconds before hiding
  it, so a brief flicker or a passing hand doesn't make the panel flash away."

### 2.6 Bottom sheet and action feedback
- **Open:** `ar.html` → the demo note above the `sheet` block.
- **Open:** `src/ar-controller.js` → `renderSheetText()` and its action-feedback
  demo note.
- **Speaker note:** "On detection, a contextual bottom sheet rises with the fact and
  four choices: Throw, Save, Share, Compost. The design principle here is 'action,
  not guilt' — when you pick an action we show specific guidance and colour the
  panel: red for throwing edible food away, green when your choice matches the
  recommended action, neutral otherwise. The recommended action also gets a gold
  ring."

### 2.7 Ask More
- **Open:** `src/askmore.js` → the top demo note.
- **Speaker note:** "Ask More is a shared drawer reused by both AR and Demo. It
  gives the deeper, source-backed explanation — what am I looking at, why it
  matters, what to do — plus the safety note. In the curated modes it's entirely
  pre-written content; no AI, no network call."

### 2.8 Quick Check
- **Open:** `src/quiz.js` → the top demo note, then `showResult()`.
- **Open:** `src/content.js` → `getBlendedQuiz()` demo note.
- **Speaker note:** "The Quick Check is the reflection step. It's contextual:
  `getLastTarget()` reads what you just scanned from localStorage, and
  `getBlendedQuiz()` leads with two questions about that exhibit, then three general
  SDG 12 questions. You get a score and an encouraging message, and you can make a
  pledge — all saved locally so it persists between visits."

### 2.9 Demo Mode
- **Open:** `demo.html` → the top demo note.
- **Open:** `src/demo-controller.js` → `selectTarget()` demo note.
- **Speaker note:** "Demo Mode is the camera-free mirror. Instead of pointing a
  camera, you tap a thumbnail from the same curated targets, and you get the exact
  same exhibit card, actions, feedback and Ask-More drawer. It's the reliable path
  for a presentation or any device without a camera — no permissions, no HTTPS, no
  `.mind` file needed. `selectTarget()` is literally the stand-in for 'MindAR found
  a target'."

### 2.10 AI Scan
- **Open:** `ai.html` → the top demo note (layer stack).
- **Open:** `src/ai-controller.js` → the file header, the `captureFrame`
  demo note, and `handleCameraOutcome()`.
- **Speaker note:** "AI Scan is the optional, more advanced mode. It's a small state
  machine: intro → scanning → analysing → result, with a retry path. The key design
  decision is that we capture **one** snapshot, not a video stream — so there's no
  API spam and a clean privacy story. That single frame is compressed and sent to
  our own server route. If the snapshot is unclear, we try once more automatically,
  then ask the user to scan again rather than inventing a result."

### 2.11 API route and provider fallback
- **Open:** `api/analyze-food.js` → the top demo note, the safety validation
  block, and the fallback provider chain.
- **Open:** `src/ai-providers.js` → the safety comment on the key checks.
- **Open:** `src/ai-schema.js` → the safety comment above `normalizeResult()`.
- **Speaker note:** "This is the serverless function. It runs on Vercel, not in the
  browser — which is the whole point, because the API keys stay in server-side
  environment variables and never reach the client bundle. It validates the image,
  then tries OpenRouter as the primary provider and falls back to Groq as a backup.
  Whatever the model returns is run through `normalizeResult`, which forces every
  field onto an allow-list, scrubs disallowed claims like food-safety guarantees or
  exact carbon figures, and always substitutes our own safety note. So even a
  misbehaving model produces safe, consistent output. If no keys are set or both
  providers fail, it returns a clear status code and the app points the user back to
  the curated scan or demo."

### 2.12 Language switching
- **Open:** `src/i18n.js` → the file header, then the `setLocale()` demo note.
- **Speaker note:** "Internationalisation is hand-rolled, no library. Every static
  string is keyed; the food-target and quiz data also have Malay and Chinese
  variants. Switching language fires one custom event, `platewise:localechange`.
  The i18n module re-translates the static markup, and each page controller listens
  for the same event to re-render its dynamic content — the bottom sheet, the
  exhibit, the quiz. One event, and the whole UI flips between English, Bahasa
  Melayu and Simplified Chinese."

### 2.13 Quality assurance and fallback handling
- **Open:** `src/storage.js` → the top demo note; and the `qa:*` scripts in
  `package.json` (plus `scripts/qa-evidence/`).
- **Speaker note:** "Two things worth highlighting here. First, persistence:
  `storage.js` keeps a handful of small values in localStorage — quiz score,
  pledge, last action, last context — and never stores a photo. Second, the app is
  built to degrade gracefully: every failure mode (no camera, denied permission,
  missing target file, AI not configured, provider down) has its own friendly
  screen with a way forward. There's even a set of `npm run qa:*` evidence scripts
  that automatically check things like the target order and the AI safety rules."

---

## 3. Important lines / files to open during the demo

Have these open in tabs, in this order, so you can switch quickly:

1. **`index.html`** — the `hero__cta` block (the three modes).
2. **`src/food-targets.js`** — the top demo note (target order 0–4) + the
   `TARGETS` array. *This is the single most important file to explain.*
3. **`ar.html`** — the `<a-scene>` + the five `mindar-image-target` entities.
4. **`src/ar-controller.js`** — `startFlow()` (camera checks) and `onTargetFound()`
   / `renderSheetText()` (detection → sheet → feedback).
5. **`src/demo-controller.js`** — `selectTarget()` (the camera-free mirror).
6. **`src/ai-controller.js`** — `captureFrame` / `runScan` (one snapshot) and
   `handleCameraOutcome` (result vs retry).
7. **`api/analyze-food.js`** — validation, OpenRouter→Groq fallback, and the
   key-safety / `not_configured` handling.
8. **`src/ai-schema.js`** — `normalizeResult()` (the AI safety boundary).
9. **`src/i18n.js`** — `setLocale()` (one event drives all three languages).
10. **`src/storage.js`** — the four saved keys (cross-page memory).

---

## 4. One-paragraph summary (for the intro or outro of the video)

> "PlateNudge turns curated food-waste images into short AR learning exhibits for
> SDG 12. It has three modes that share one content file: a curated AR scan built
> on MindAR, an optional AI scan that analyses a single camera snapshot through a
> safety-checked serverless route, and a no-camera demo mode. The app is
> mobile-first, works in English, Bahasa Melayu and Simplified Chinese from a single
> custom event, saves progress locally with no backend, and is designed to fail
> gracefully at every step — keeping API keys server-side and never claiming to
> confirm food safety."
