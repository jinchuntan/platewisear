# PlateWise AR — Testing Checklist

Use this checklist for manual testing. Mark each test as Pass / Fail and add notes.

> **Scope:** Core marker-based WebAR only. AI features (AI tips, image scanning, object
> recognition, backend/ML) are future work and are **not** in this version, so they are not
> tested here.

## Home Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | Home page loads without errors | | |
| 2 | Title and subtitle display correctly | | |
| 3 | All four navigation buttons work | | |
| 4 | Nav bar links go to correct pages | | |
| 5 | HTTPS warning appears on plain HTTP | | |

## AR Page — Camera & error states

| # | Test | Result | Notes |
|---|------|--------|-------|
| 6 | AR page loads without errors | | |
| 7 | Vendored A-Frame + AR.js load (no CDN/master request) | | |
| 8 | "Camera permission needed / Starting camera…" state shows on start | | |
| 9 | Camera permission request appears | | |
| 10 | "AR ready" then live camera feed shows after permission granted | | |
| 11 | Permission **denied** shows the "Camera permission denied" state | | |
| 12 | On plain HTTP, "HTTPS required for the camera" state shows | | |
| 13 | Unsupported browser shows "Camera not supported" state | | |
| 14 | Start-up timeout (~10 s) shows "AR failed to load" state | | |
| 15 | Every error state shows troubleshooting tips | | |
| 16 | Every error state offers "Try Again" + "Open Demo Mode" | | |

## AR Page — Scene, facts, actions, progress

| # | Test | Result | Notes |
|---|------|--------|-------|
| 17 | Marker status shows "Marker not detected" initially | | |
| 18 | Status changes to "Marker detected" when the real Hiro marker is scanned | | |
| 19 | AR scene (plate, food pile, SDG 12 label, fact text) appears above the marker | | |
| 20 | Marker lost status updates when the marker is removed | | |
| 21 | Progress indicator starts at Step 1 (Scan marker) | | |
| 22 | Marker detected advances progress to Step 2 (Read facts) | | |
| 23 | Selecting an action advances progress to Step 3, then Step 4 (Quiz) | | |
| 24 | Previous/Next fact buttons cycle through facts | | |
| 25 | Fact text updates in DOM overlay and in AR | | |
| 26 | Fact **source label** is visible (e.g. "Source: UNEP…") | | |
| 27 | "Throw Away" updates AR visuals (waste pile) **and** negative feedback | | |
| 28 | "Save Leftovers" shrinks pile, shows container **and** positive feedback | | |
| 29 | "Share" shows sharing figures **and** positive feedback | | |
| 30 | "Compost" shows compost visual **and** neutral feedback | | |
| 31 | Feedback panel updates with correct text and colour | | |
| 32 | Overlay panel can be collapsed and expanded | | |
| 33 | "Go to Quiz" link works | | |

## Demo Page (mirror of AR, no camera)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 34 | Demo page loads without errors | | |
| 35 | "Demo Mode — No Camera" label is visible | | |
| 36 | Plate visual displays correctly | | |
| 37 | Fact navigation works and shows the **source label** | | |
| 38 | Each action button updates the plate icon/visual and feedback | | |
| 39 | Link to Quiz / Reflection works | | |

## Marker Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 40 | Marker page loads without errors | | |
| 41 | The **real Hiro marker image** (`hiro-marker.jpg`) is displayed (not a canvas drawing) | | |
| 42 | "Print This Page" opens the print dialog with the marker sized large enough | | |
| 43 | "Download Marker" downloads `hiro-marker.jpg` | | |
| 44 | Print/scan instructions (B&W, don't crop border, flat, 20–40 cm) are shown | | |
| 45 | The displayed marker is detected by the AR page | | |

## Quiz Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 46 | Quiz page loads with 5 questions | | |
| 47 | Clicking an option highlights correct/incorrect | | |
| 48 | Explanation appears after answering | | |
| 49 | Score displays after all questions answered | | |
| 50 | Score saves to localStorage | | |
| 51 | "Retry Quiz" resets all questions | | |
| 52 | Pledge radio buttons display correctly | | |
| 53 | "Save My Pledge" saves to localStorage | | |
| 54 | Saved results section shows stored score and pledge | | |
| 55 | Last AR/Demo action is recalled at the top (if one was chosen) | | |

## About Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 56 | About page loads without errors | | |
| 57 | SDG 12 section displays correctly | | |
| 58 | Three assignment components are listed | | |
| 59 | References section shows sources with links | | |

## Cross-Cutting

| # | Test | Result | Notes |
|---|------|--------|-------|
| 60 | Mobile layout is usable (phone screen) | | |
| 61 | Buttons are large enough to tap on mobile | | |
| 62 | Nav bar is accessible on all pages | | |
| 63 | localStorage persists across page reloads | | |
| 64 | `npm run build` succeeds without errors | | |
| 65 | Built `dist/` folder serves correctly with `npm run preview` | | |
| 66 | No app-code errors in the browser console | | |
