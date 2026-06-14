# PlateWise AR — Testing Checklist

Mark each test Pass / Fail with notes.

> **Scope:** Core, non-AI version. Image-target scanning of **curated** food-waste images only.
> No AI, no arbitrary-image recognition, no food-safety diagnosis.

## Home

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | Home loads; headline + subheading + CTAs visible | | |
| 2 | "Start scan" → Scan page; "Try demo" → Demo | | |
| 3 | Stat ticker chips visible (1.05B / 60% / SDG 12.3) | | |
| 4 | Top pill nav present; current page highlighted | | |

## Scan page — camera & setup states

| # | Test | Result | Notes |
|---|------|--------|-------|
| 5 | Vendored A-Frame 1.3.0 + MindAR load (no CDN) | | |
| 6 | If `.mind` missing → "Scan targets not installed" + Demo link | | |
| 7 | Permission prompt appears; "Starting camera" then "Ready to scan" | | |
| 8 | Permission denied → "Camera permission denied" state | | |
| 9 | Plain HTTP → "HTTPS required" state | | |
| 10 | Every error offers "Try again" + "Open Demo Mode" | | |
| 11 | "Point at a food-waste image" hint shows when ready & nothing detected | | |

## Scan page — guided UX

| # | Test | Result | Notes |
|---|------|--------|-------|
| G1 | After permission, the **live camera feed is visible** (no lingering beige screen) | | |
| G2 | A **scanning animation** (corner frame, pulsing border, moving line) shows while nothing is detected | | |
| G3 | Animation/overlays are transparent and do **not** block the camera | | |
| G4 | **Home** button (top-left) returns to the main page — available before & after scanning | | |
| G5 | First visit auto-shows the **"How to scan"** guide; "Got it" dismisses it (and it stays dismissed on reload) | | |
| G6 | **"How to scan?"** button reopens the guide any time | | |
| G7 | Step labels update: Step 1 (scan) → Step 2 (choose action) → Step 3 (learn / quick check) | | |
| G8 | Bottom sheet opens **compact**; handle expands it; sheet has a **Back to home** button | | |
| G9 | `prefers-reduced-motion` stops the scan animations | | |

## Scan page — detection, exhibit, sheet (needs compiled `.mind` + device)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 12 | Scanning a curated image is detected | | |
| 13 | AR exhibit card appears over the image (title, SDG 12, stat, action badge, frame) | | |
| 14 | Exhibit is readable and does not cover the whole screen | | |
| 15 | Bottom sheet appears on detection, titled with the exhibit | | |
| 16 | Recommended action marked with ★ | | |
| 17 | Throw / Save / Share / Compost give target-specific feedback | | |
| 18 | "Ask more" opens drawer with the 4 sections | | |
| 19 | Losing the image hides the sheet and returns the scan hint | | |
| 20 | All 5 targets work (rice / peels / bread / mixed / drink) | | |

## Demo Mode (no camera)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 21 | Five sample image cards render | | |
| 22 | Selecting a card shows image preview + exhibit card | | |
| 23 | Source label visible | | |
| 24 | Actions update feedback; recommended marked ★ | | |
| 25 | "Ask more" drawer works | | |

## Scan images gallery (marker.html)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 26 | Five curated images shown with Download buttons | | |
| 27 | "Curated images only" note shown | | |
| 28 | "Start scan" / "Try demo" links work | | |

## Quiz

| # | Test | Result | Notes |
|---|------|--------|-------|
| 29 | 5 questions render; correct/incorrect styling + explanations | | |
| 30 | Score shows and saves; Retry resets | | |
| 31 | Pledge saves; saved results persist | | |
| 32 | Last action recalled at top (after an AR/Demo action) | | |

## About + cross-cutting

| # | Test | Result | Notes |
|---|------|--------|-------|
| 33 | About explains exhibits, curated-only, no-AI, no food-safety | | |
| 34 | Sources/SDG 12 accessible | | |
| 35 | Mobile layout usable; tap targets large; focus visible | | |
| 36 | `npm run build` succeeds | | |
| 37 | `npm run preview` serves all pages | | |
| 38 | No app-code console errors | | |
