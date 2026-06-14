# PlateWise AR — Debugging Log

Use this template to document issues encountered during development and testing. Each row records a bug or problem, its cause, the fix applied, and a placeholder for evidence screenshots.

## Log

| # | Date | Issue | Cause | Fix | Evidence |
|---|------|-------|-------|-----|----------|
| 1 | | | | | *(screenshot placeholder)* |
| 2 | | | | | *(screenshot placeholder)* |
| 3 | | | | | *(screenshot placeholder)* |
| 4 | | | | | *(screenshot placeholder)* |
| 5 | | | | | *(screenshot placeholder)* |
| 6 | | | | | *(screenshot placeholder)* |
| 7 | | | | | *(screenshot placeholder)* |
| 8 | | | | | *(screenshot placeholder)* |
| 9 | | | | | *(screenshot placeholder)* |
| 10 | | | | | *(screenshot placeholder)* |

## Instructions

1. Record every significant issue encountered during development or testing.
2. Describe the **Issue** clearly (e.g. "AR exhibit does not appear after the image target is detected").
3. Identify the **Cause** (e.g. "exhibit text element IDs (`arx-*`) did not match ar-controller.js").
4. Describe the **Fix** (e.g. "Corrected the `arx-*` IDs and the `targetIndex` mapping").
5. Add a screenshot or console log capture in the **Evidence** column for your report.

## Console Log Evidence

PlateWise AR prints debug messages to the browser console prefixed with `[PlateWise]`. To capture console evidence:

1. Open DevTools (F12 or right-click → Inspect).
2. Go to the **Console** tab.
3. Perform the action you want to document.
4. Take a screenshot of the console output.

Example console messages (MindAR image tracking):
```
[PlateWise] app.js loaded — page: /ar.html
[PlateWise] ar-controller.js (MindAR) loaded.
[PlateWise] AR status → ready
[PlateWise] EVENT: arReady
[PlateWise] Target handlers attached: 5
[PlateWise] targetFound index: 0 → leftover-rice (Leftover rice)
[PlateWise] ACTION saveLeftovers on leftover-rice
[PlateWise] Last action saved: saveLeftovers
[PlateWise] targetLost index: 0
```

Tip: append `?debug=1` to the Scan URL (e.g. `/ar.html?debug=1`) to show a small
on-screen indicator with the latest `found #N / lost #N` event.
