# PlateWise AR — Testing Checklist

Use this checklist for manual testing. Mark each test as Pass / Fail and add notes.

## Home Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | Home page loads without errors | | |
| 2 | Title and subtitle display correctly | | |
| 3 | All four navigation buttons work | | |
| 4 | Nav bar links go to correct pages | | |
| 5 | HTTPS warning appears on plain HTTP | | |

## AR Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 6 | AR page loads without errors | | |
| 7 | Camera permission request appears | | |
| 8 | Camera feed shows after permission granted | | |
| 9 | Graceful message if permission denied | | |
| 10 | Marker status shows "Marker not detected" initially | | |
| 11 | Marker status changes to "Marker detected" when Hiro marker is scanned | | |
| 12 | AR scene (plate, food pile, SDG label) appears above marker | | |
| 13 | Marker lost status updates when marker is removed | | |
| 14 | Previous/Next fact buttons cycle through facts | | |
| 15 | Fact text updates in DOM overlay | | |
| 16 | "Throw Away" button shows waste pile and negative feedback | | |
| 17 | "Save Leftovers" button shrinks pile and shows container | | |
| 18 | "Share" button shows sharing figures and positive feedback | | |
| 19 | "Compost" button shows compost visual and neutral feedback | | |
| 20 | Feedback panel updates with correct text and colour | | |
| 21 | Overlay panel can be collapsed and expanded | | |
| 22 | "Go to Quiz" link works | | |

## Demo Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 23 | Demo page loads without errors | | |
| 24 | "Demo Mode — No Camera" label is visible | | |
| 25 | Plate visual displays correctly | | |
| 26 | Fact navigation works | | |
| 27 | Each action button updates the plate icon and feedback | | |

## Marker Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 28 | Marker page loads without errors | | |
| 29 | Hiro marker pattern renders on the canvas | | |
| 30 | Print button opens print dialog | | |
| 31 | Marker is scannable from the AR page | | |

## Quiz Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 32 | Quiz page loads with 5 questions | | |
| 33 | Clicking an option highlights correct/incorrect | | |
| 34 | Explanation appears after answering | | |
| 35 | Score displays after all questions answered | | |
| 36 | Score saves to localStorage | | |
| 37 | "Retry Quiz" resets all questions | | |
| 38 | Pledge radio buttons display correctly | | |
| 39 | "Save My Pledge" saves to localStorage | | |
| 40 | Saved results section shows stored score and pledge | | |

## About Page

| # | Test | Result | Notes |
|---|------|--------|-------|
| 41 | About page loads without errors | | |
| 42 | SDG 12 section displays correctly | | |
| 43 | Three assignment components are listed | | |
| 44 | References section shows sources with links | | |

## Cross-Cutting

| # | Test | Result | Notes |
|---|------|--------|-------|
| 45 | Mobile layout is usable (phone screen) | | |
| 46 | Buttons are large enough to tap on mobile | | |
| 47 | Nav bar is accessible on all pages | | |
| 48 | localStorage persists across page reloads | | |
| 49 | `npm run build` succeeds without errors | | |
| 50 | Built `dist/` folder serves correctly with `npm run preview` | | |
