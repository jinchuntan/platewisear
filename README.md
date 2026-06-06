# PlateWise AR

**A Mobile WebAR Application for Food Waste Awareness under SDG 12**

PlateWise AR is an educational prototype that uses browser-based Augmented Reality to help users explore how everyday food-waste decisions connect to environmental impact, household responsibility, and sustainable behaviour.

---

## SDG 12 Alignment

This project is aligned with **United Nations Sustainable Development Goal 12: Responsible Consumption and Production**, specifically Target 12.3, which aims to halve per-capita global food waste at retail and consumer levels by 2030.

---

## Features

- **Marker-based AR experience** — scan a printed Hiro marker to see an interactive AR scene with a 3D plate, food pile, action visuals, and floating statistics.
- **Four food-waste actions** — Throw Away, Save Leftovers, Share, Compost — each with visual feedback and educational explanations.
- **Fact navigation** — browse food-waste statistics drawn from official sources (UNEP, UN SDG 12).
- **Non-AR demo mode** — a camera-free fallback for debugging, report screenshots, and presentations.
- **Printable marker page** — a branded PlateWise marker card with the standard Hiro pattern.
- **Quiz and reflection** — 5 multiple-choice questions with scoring and a personal action pledge, both saved to localStorage.
- **About / Sources page** — project overview, SDG 12 alignment, assignment component explanations, empirical facts, and full references.
- **Mobile-first responsive design** — large buttons, readable text, clean academic look.
- **Accessibility basics** — semantic HTML, readable contrast, focus states, aria-labels, reduced-motion support.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AR Engine | [A-Frame](https://aframe.io/) 1.4.2 + [AR.js](https://ar-js-org.github.io/AR.js-Docs/) (CDN) |
| Marker | Standard Hiro preset (ARToolKit) |
| Frontend | Vanilla HTML, CSS, JavaScript (ES modules) |
| Build Tool | [Vite](https://vitejs.dev/) 5.x |
| Storage | Browser localStorage |
| External dependencies | None beyond A-Frame + AR.js via CDN |

No React, Next.js, Vue, TypeScript, Tailwind, databases, authentication, backend APIs, machine learning, or external sensors.

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

1. Open the **Marker** page in the app.
2. Print the page on white paper (at least 8 cm × 8 cm).
3. Alternatively, display the marker on a laptop or tablet screen.
4. Open the **AR Experience** page on your phone and point the camera at the marker.
5. Keep the marker flat, well-lit, and avoid covering the black border.

The marker uses the standard **Hiro** pattern recognised by AR.js / ARToolKit.

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
│   └── assets/
│       ├── icons/
│       ├── marker/
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

- **Marker-based AR, not real food recognition.** The app uses the standard Hiro marker pattern; it does not detect or recognise real food items.
- **Educational prototype only.** The app does not measure actual household food-waste reduction unless user evaluation is later conducted.
- **Simplified statistics.** Facts are presented in a concise learning-friendly format and should be cited properly in the academic report.
- **HTTPS requirement.** Camera-based AR requires HTTPS or localhost. Plain HTTP may block camera access on mobile browsers.
- **Browser compatibility.** AR.js works best in Chrome and Firefox on Android. iOS Safari has limited WebRTC support which may affect camera access.

---

## Future Improvements

- Replace the canvas-drawn marker with a high-resolution Hiro marker image asset.
- Add animations to AR elements (e.g. food pile shrinking, compost plant growing).
- Implement a richer 3D scene with GLTF models.
- Add more quiz questions and adaptive difficulty.
- Conduct user evaluation studies and integrate findings.
- Add multilingual support.
- Add Progressive Web App (PWA) offline caching.

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
