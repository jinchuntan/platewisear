# PlateNudge

**An AR and AI food waste learning app for SDG 12**

PlateNudge turns **curated food-waste images into AR learning exhibits**. Scan a food-waste image and a short AR exhibit appears over it. It explains what the waste represents, why it matters under SDG 12, and what you can do next. PlateNudge also has an optional AI Photo Mode that analyses your own food-waste photo and suggests a next action. Inspired by food-waste museum concepts.

> **Recognition scope (honest):** the curated AR scan recognises **only the curated image targets** included with it — not arbitrary food photos. An **optional [AI Photo Mode](#ai-photo-mode-optional)** can analyse an uploaded photo via serverless routes, but it does **not** confirm food safety and never estimates exact weight or carbon. The curated AR scan is the core and works without AI.

---

## SDG 12 Alignment

This project is aligned with **United Nations Sustainable Development Goal 12: Responsible Consumption and Production**, specifically Target 12.3, which aims to halve per-capita global food waste at retail and consumer levels by 2030.

---

## Features

- **Image-target AR scanning** — point the camera at a curated food-waste image; MindAR detects it and anchors an AR **exhibit card** (title, SDG 12 tag, a statistic, recommended-action badge, highlight frame) over the image.
- **Contextual bottom sheet** — appears **only after detection**, titled with the detected exhibit, with four actions (**Throw · Save · Share · Compost**) plus **Ask more**. When the image is lost it drops back to a “Point at a food-waste image” hint.
- **Target-specific guidance** — each action gives advice tailored to the detected waste (e.g. compost is recommended for kitchen scraps, sharing for edible surplus).
- **“Ask more” drawer** — a clean, non-AI explanation panel: *What am I looking at? · Why it matters · What should I do? · Safety note* (content from `src/food-targets.js`).
- **Careful camera handling** — user-facing states for *permission needed/denied, unsupported browser, loading, ready, failed*, a secure-context + getUserMedia check, a start-up timeout, and a one-tap **Demo Mode** fallback.
- **Graceful setup** — if the compiled `.mind` target file isn’t installed yet, the Scan page says so clearly and points to Demo Mode (which always works).
- **Demo Mode (no camera)** — pick a sample food-waste image and get the same exhibit, actions, guidance, and Ask-More drawer.
- **Quiz & reflection** — 5 questions with scoring and a pledge (saved to localStorage), plus a recall of the user’s last action.
- **Premium, mobile-first UI** — warm cream + grain, charcoal ink, gold/green accents, top pill nav, soft cards; minimal copy.
- **Accessibility basics** — semantic HTML, AA contrast, visible focus states, aria-labels, reduced-motion support, non-colour status cues.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AR Engine | [A-Frame](https://aframe.io/) 1.3.0 + [MindAR](https://github.com/hiukim/mind-ar-js) 1.2.5 image tracking (pinned, locally vendored) |
| Targets | Curated food-waste images compiled to a MindAR `.mind` file |
| Frontend | Vanilla HTML, CSS, JavaScript (ES modules) |
| Build Tool | [Vite](https://vitejs.dev/) 5.x |
| Storage | Browser localStorage |
| External runtime dependencies | None — A-Frame + MindAR are vendored under `public/vendor/`, so no CDN is required at runtime |

No React, Next.js, Vue, TypeScript, Tailwind, databases, authentication, backend APIs, machine learning, or external sensors.

### AR Dependencies (pinned & vendored)

Image tracking uses two libraries **pinned and committed** under `public/vendor/`:

| File | Version | Upstream source |
|------|---------|-----------------|
| `public/vendor/aframe-1.3.0.min.js` | A-Frame **1.3.0** | `https://aframe.io/releases/1.3.0/aframe.min.js` |
| `public/vendor/mindar-image-aframe-1.2.5.prod.js` | MindAR **1.2.5** | `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js` |

A-Frame 1.3.0 + MindAR 1.2.5 is the **documented, stable pair**. Vendoring (rather than a CDN) keeps builds reproducible and works on networks that block CDNs or when offline. The previous Hiro/AR.js engine has been removed in favour of image targets.

### Image-target scanning & generating the `.mind` file

The Scan page (`ar.html`) loads `public/assets/targets/food-waste-targets.mind`. That file is **generated from the source images** in `public/assets/targets/source/` and is created **once** (it is not produced by `npm run build`). Until it exists, the Scan page shows a friendly “Scan targets not installed” screen and **Demo Mode still works**.

**Add / change targets**

1. Put the image(s) in `public/assets/targets/source/`.
2. Add a matching entry to `TARGETS` in `src/food-targets.js` (set `targetIndex` in order) and an `<a-entity mindar-image-target="targetIndex: N">` block in `ar.html`.
3. Compile the `.mind` file (below) **in the same order** as `targetIndex`.

**Compile the `.mind` file**

- **Recommended (web):** open <https://hiukim.github.io/mind-ar-js-doc/tools/compile>, add the source images in `targetIndex` order (0,1,2…), Start, Download `targets.mind`, rename to `food-waste-targets.mind`, and place it in `public/assets/targets/`.
- **Optional (Node):** `npm i -D mind-ar canvas && node scripts/compile-targets.mjs` (best-effort; falls back to the web tool if the native build fails).

See `public/assets/targets/README.md` for the full table and order.

---

## How to Install

```bash
# 1. Clone the repository
git clone <repository-url>
cd platewisear

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server will print a local URL (e.g. `http://localhost:5173`) and a network URL.

---

## How to Run Locally

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build static files to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## AI Photo Mode (optional)

PlateNudge includes an **optional** AI Photo Mode (`ai.html`) that analyses an uploaded food-waste photo through serverless routes in `api/` (**OpenRouter** primary, **Groq** backup). It is fully additive. With **no keys configured** the page shows a friendly “not configured” message and the curated AR scan, Demo, Quiz, and language switching keep working.

Set these in **Vercel → Project → Settings → Environment Variables**. They are **server-side only — never prefix with `VITE_`** (that would expose them to the browser bundle). Keys are read only inside `api/` functions and are never shipped to the frontend.

| Variable | Required? | Default when unset |
|----------|-----------|--------------------|
| `OPENROUTER_API_KEY` | Required (primary provider) | — |
| `GROQ_API_KEY` | Required (backup provider) | — |
| `OPENROUTER_MODEL` | Optional | `openai/gpt-4o-mini` |
| `GROQ_VISION_MODEL` | Optional | `meta-llama/llama-4-scout-17b-16e-instruct` |
| `PUBLIC_SITE_URL` | Optional | OpenRouter attribution header only |

The model defaults are **pinned in `src/ai-config.js`**. If a model env var is set it overrides the default; if it is unset (or blank) the built-in default is used — so AI Photo Mode runs with **only the API keys** set. See `.env.example` for a copy-paste template.

> Local note: `vite dev`/`preview` do not run the `/api` functions, so AI shows its “unavailable” state locally. Use `vercel dev` (with the env vars set) to test AI end-to-end. `npm run build` is unaffected — Vite ignores `api/`.

---

## How to Test on a Phone

Camera-based AR **requires HTTPS or localhost**. To test on a mobile device:

### Option A — Same Wi-Fi network

1. Run `npm run dev` on your computer.
2. Note the **Network** URL printed in the terminal (e.g. `http://192.168.x.x:5173`).
3. Open that URL on your phone's browser.
4. **Note:** Some browsers block camera access on plain HTTP. If camera access fails, use Option B.

### Option B — HTTPS tunnel (recommended for mobile camera)

1. Install a tunnelling tool such as [ngrok](https://ngrok.com/) or use `npx localtunnel`.
2. Run `npm run dev` and then tunnel port 5173:
   ```bash
   npx localtunnel --port 5173
   ```
3. Open the HTTPS tunnel URL on your phone.

### Option C — Deploy to a static host

Build and deploy to any static hosting provider (GitHub Pages, Netlify, Vercel) which serves over HTTPS by default.

---

## How to Use the Scan Images

The **Scan images** page (`marker.html`) shows the curated food-waste images the app recognises.
To scan them you need something to point the camera *at*:

1. Open the **Scan images** page on a computer/tablet, **or** download an image with the **Download** button.
2. Display the image on another screen (or print it).
3. On your phone, open **Start scan** and point the camera at the image (fill the frame, hold flat, good light, ~20–40 cm).
4. The AR exhibit appears over the image and the bottom sheet slides up.

> The app recognises these **curated images only** — not arbitrary food photos. For a camera-free
> walkthrough, use **Demo Mode**.

---

## Project Structure

```
platewisear/
├── index.html              Home (landing)
├── ar.html                 Scan — MindAR image tracking + exhibit + bottom sheet
├── demo.html               Demo Mode (no camera) — sample image exhibits
├── marker.html             Scan images gallery (curated targets)
├── quiz.html               Quiz and reflection
├── about.html              About / sources
├── package.json
├── vite.config.js
├── README.md
├── scripts/
│   └── compile-targets.mjs     Optional MindAR .mind compiler
├── public/
│   ├── manifest.webmanifest
│   ├── vendor/                 Vendored A-Frame 1.3.0 + MindAR 1.2.5
│   └── assets/
│       ├── icons/
│       ├── targets/
│       │   ├── source/         Curated food-waste images (+ README)
│       │   ├── food-waste-targets.mind   (you compile this — see README)
│       │   └── README.md       How to compile / add targets
│       └── marker/             (legacy Hiro images — no longer used)
├── src/
│   ├── styles.css          Design system
│   ├── app.js              Shared init + top pill nav
│   ├── food-targets.js     Curated targets + exhibit content (single source)
│   ├── ar-controller.js    MindAR detection, exhibit, bottom sheet
│   ├── demo-controller.js  Demo Mode controller
│   ├── askmore.js          Shared "Ask more" drawer
│   ├── quiz.js             Quiz and pledge logic
│   ├── content.js          Facts, quiz questions, pledges, sources
│   ├── storage.js          localStorage helpers
│   └── utils.js            Shared utilities
└── docs/
    ├── user-manual.md
    ├── testing-checklist.md
    ├── debugging-log-template.md
    ├── evaluation-plan.md
    └── report-evidence-checklist.md
```

---

## Known Limitations

- **Curated image targets only.** The app recognises the included food-waste images (compiled into the `.mind` file) — **not** arbitrary food photos.
- **Curated AR scan needs no AI.** The core scan is fully client-side. **AI Photo Mode is optional** (OpenRouter + Groq via serverless `api/`); with no keys set it shows an “unavailable” message and the rest of the app works unchanged.
- **No food-safety diagnosis.** The app cannot judge whether food is safe to eat or share — it only offers general guidance and a safety note.
- **No exact weight or carbon estimates.** Figures shown are sourced statistics, not per-item measurements.
- **`.mind` file must be generated once.** Until `public/assets/targets/food-waste-targets.mind` exists, the Scan page shows “targets not installed”; Demo Mode works regardless.
- **HTTPS requirement.** Camera AR requires HTTPS or localhost; the Scan page detects this and offers Demo Mode.
- **Browser compatibility.** MindAR works best in Chrome / Firefox on Android. iOS Safari WebRTC is variable; Demo Mode works everywhere.

---

## Future Work (NOT part of the current core version)

The following are **planned future enhancements** and are intentionally **not implemented** in this version:

- **AI image analysis** — let users scan *their own* food-waste photos and have an LLM/vision model (e.g. via OpenRouter) identify the waste and generate tailored guidance. This would replace the static "Ask more" content and the curated-targets-only limitation. The code marks the swap point with: *"Future AI mode: replace this static explanation with OpenRouter vision analysis."*
- More curated image targets and richer AR exhibits.
- More quiz questions and adaptive difficulty.
- User evaluation studies; multilingual support; PWA offline caching.

The current app is fully client-side: **no AI, no backend, no object recognition.**

---

## Data Sources

| Source | Reference |
|--------|-----------|
| UNEP Food Waste Index Report 2024 | United Nations Environment Programme (2024). *Food Waste Index Report 2024*. Nairobi: UNEP. [Link](https://www.unep.org/resources/publication/food-waste-index-report-2024) |
| United Nations SDG 12 | United Nations (n.d.). *Sustainable Development Goal 12: Ensure sustainable consumption and production patterns*. [Link](https://sdgs.un.org/goals/goal12) |
| FAO — Food Loss and Food Waste | Food and Agriculture Organization of the United Nations (n.d.). *Food Loss and Food Waste*. [Link](https://www.fao.org/food-loss-and-food-waste/en/) |

---

## Licence

This project is an academic prototype. All educational content is attributed to the sources listed above.
