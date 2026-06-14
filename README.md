# PlateWise AR

**A Mobile WebAR Application for Food Waste Awareness under SDG 12**

PlateWise AR is an educational prototype that uses browser-based Augmented Reality to help users explore how everyday food-waste decisions connect to environmental impact, household responsibility, and sustainable behaviour.

---

## SDG 12 Alignment

This project is aligned with **United Nations Sustainable Development Goal 12: Responsible Consumption and Production**, specifically Target 12.3, which aims to halve per-capita global food waste at retail and consumer levels by 2030.

---

## Features

- **Marker-based AR experience** — scan the real, printed **Hiro** marker to see an interactive AR scene with a 3D plate, food pile, action visuals, an SDG 12 label, and floating statistics.
- **Robust camera handling** — clear, user-facing states for *camera starting, permission needed, permission denied, browser unsupported, AR loading, AR ready, AR failed* — with a secure-context check, getUserMedia support check, an ~10 s start-up timeout, troubleshooting tips, and a one-tap **Demo Mode** fallback.
- **Learning-flow progress indicator** — a 4-step guide (Scan marker → Read facts → Choose action → Complete quiz) that advances as the user progresses.
- **Four food-waste actions** — Throw Away, Save Leftovers, Share, Compost — each updating both the AR scene **and** the DOM feedback panel with educational explanations.
- **Fact navigation with sources** — browse food-waste statistics drawn from official sources (UNEP, UN SDG 12), each shown with its **source citation**.
- **Non-AR demo mode** — a camera-free mirror of the AR flow for debugging, report screenshots, and presentations.
- **Printable / downloadable marker page** — shows the exact Hiro marker image with Print and Download options and clear print/scan instructions.
- **Quiz and reflection** — 5 multiple-choice questions with scoring and a personal action pledge (both saved to localStorage), plus a recall of the user's last AR/Demo action.
- **About / Sources page** — project overview, SDG 12 alignment, assignment component explanations, empirical facts, and full references.
- **Mobile-first responsive design** — large buttons, readable text, clean academic look.
- **Accessibility basics** — semantic HTML, readable contrast, focus states, aria-labels, reduced-motion support.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AR Engine | [A-Frame](https://aframe.io/) 1.6.0 + [AR.js](https://ar-js-org.github.io/AR.js-Docs/) 3.4.8 (pinned, locally vendored) |
| Marker | Standard **Hiro** marker (real image, `public/assets/marker/hiro-marker.jpg`) used via `<a-marker preset="hiro">` |
| Frontend | Vanilla HTML, CSS, JavaScript (ES modules) |
| Build Tool | [Vite](https://vitejs.dev/) 5.x |
| Storage | Browser localStorage |
| External runtime dependencies | None — A-Frame + AR.js are vendored under `public/vendor/`, so no CDN is required at runtime |

No React, Next.js, Vue, TypeScript, Tailwind, databases, authentication, backend APIs, machine learning, or external sensors.

### AR Dependencies (pinned & vendored)

AR depends on two libraries that are **pinned to specific stable versions and committed to the repository** under `public/vendor/`:

| File | Version | Upstream source |
|------|---------|-----------------|
| `public/vendor/aframe-1.6.0.min.js` | A-Frame **1.6.0** | `https://aframe.io/releases/1.6.0/aframe.min.js` |
| `public/vendor/aframe-ar-3.4.8.js` | AR.js **3.4.8** | `https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.8/aframe/build/aframe-ar.js` |

**Why vendored instead of a CDN?** The previous version loaded AR.js from the `master` branch via `raw.githack` — a *moving target* that can change or break without notice and is explicitly not intended for production. Vendoring pinned copies means:

- the AR engine never changes unexpectedly between sessions (reproducible builds),
- the app keeps working even on networks that block CDNs or when offline,
- A-Frame 1.6.0 and AR.js 3.4.8 are a maintainer-tested, compatible pair.

The choice favours **stability over latest version**. To update, download a newer pinned release into `public/vendor/` and update the two `<script>` tags in `ar.html`.

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

## How to Print / Use the Marker

The app uses the **standard Hiro marker** — the exact image AR.js recognises through
`<a-marker preset="hiro">`. The real image lives at:

```
public/assets/marker/hiro-marker.jpg
```

It is displayed on the **Marker** page and offered as a **Download Marker** link.

1. Open the **Marker** page in the app.
2. Either tap **🖨️ Print This Page** (the print layout sizes the marker to ~10 cm) or tap
   **⬇️ Download Marker** to save `hiro-marker.jpg` and print/share it yourself.
3. **Print clearly in black and white** on plain white paper (at least 8 cm × 8 cm).
4. **Do not crop the black border** — AR.js needs the full black frame to detect the marker.
5. **Keep the marker flat and well-lit** — avoid bends, glare, and deep shadows.
6. **Scan from around 20–40 cm away** with the camera roughly square to the marker.
7. No printer? Display the Marker page on a laptop or tablet screen and scan that.

> The marker is the standard **Hiro** pattern recognised by AR.js / ARToolKit. The marker page
> shows this exact image so what you print always matches what the AR page expects.

---

## Project Structure

```
platewisear/
├── index.html              Home page
├── ar.html                 AR experience (A-Frame + AR.js)
├── demo.html               Non-AR demo mode
├── marker.html             Printable marker page
├── quiz.html               Quiz and reflection
├── about.html              About / sources
├── package.json
├── vite.config.js
├── README.md
├── public/
│   ├── manifest.webmanifest
│   ├── vendor/                 Pinned, vendored AR libraries (A-Frame, AR.js)
│   └── assets/
│       ├── icons/
│       ├── marker/             hiro-marker.jpg — the real Hiro marker image
│       └── screenshots-placeholder/
├── src/
│   ├── styles.css          Global styles
│   ├── app.js              Shared page initialisation
│   ├── ar-controller.js    AR scene and overlay controller
│   ├── demo-controller.js  Demo mode controller
│   ├── quiz.js             Quiz and pledge logic
│   ├── content.js          All educational data and content
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

- **Marker-based AR, not real food recognition.** The app uses the standard Hiro marker; it does not detect or recognise real food items.
- **No AI features (by design).** This is the hardened **core** version. There is **no** AI, OpenRouter, image scanning, object recognition, backend API, or machine learning — these are deliberately out of scope and planned as future work (see below).
- **Educational prototype only.** The app does not measure actual household food-waste reduction unless user evaluation is later conducted.
- **Simplified statistics.** Facts are presented in a concise learning-friendly format and should be cited properly in the academic report.
- **HTTPS requirement.** Camera-based AR requires HTTPS or localhost. Plain HTTP blocks camera access on mobile browsers — the AR page detects this and shows a clear "HTTPS required" state with a Demo Mode fallback.
- **Browser compatibility.** AR.js works best in Chrome and Firefox on Android. iOS Safari has limited/variable WebRTC support which may affect camera access; Demo Mode works everywhere.

---

## Future Work (NOT part of the current core version)

The following are **planned future enhancements** and are intentionally **not implemented** in this core release:

- **AI features** — e.g. AI-generated tips/explanations via an LLM (such as OpenRouter), real **image scanning / object recognition** of food, and any **machine-learning** or **backend API** integration. None of this exists yet; the current app is fully client-side and marker-based.
- Animated AR elements (e.g. food pile shrinking, compost plant growing).
- A richer 3D scene with GLTF models.
- More quiz questions and adaptive difficulty.
- User evaluation studies and integration of findings.
- Multilingual support and Progressive Web App (PWA) offline caching.

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
