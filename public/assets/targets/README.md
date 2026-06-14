# Food-waste image targets

PlateNudge scans **curated food-waste images** using [MindAR](https://github.com/hiukim/mind-ar-js)
image tracking. At runtime the app needs one compiled targets file:

```
public/assets/targets/food-waste-targets.mind
```

This file is **generated from the source images** in `source/`. A compiled
`food-waste-targets.mind` (5 targets) is already included in this repo. If it is ever
missing, the Scan page shows a friendly “Scan targets not installed” screen and Demo Mode
still works — regenerate it with the steps below.

## Source images and order (important)

The order you add the images to the compiler **must** match `targetIndex` in
[`src/food-targets.js`](../../../src/food-targets.js):

| targetIndex | file (`source/`)         | exhibit         |
|-------------|--------------------------|-----------------|
| 0           | `leftover-rice.jpg`      | Leftover rice   |
| 1           | `fruit-peels.jpg`        | Fruit peels     |
| 2           | `bread-waste.jpg`        | Bread waste     |
| 3           | `mixed-leftovers.jpg`    | Mixed leftovers |
| 4           | `drink-waste.jpg`        | Drink waste     |

## How to generate `food-waste-targets.mind`

### Option A — Official web compiler (recommended, reliable)

1. Open the MindAR Image Target Compiler:
   <https://hiukim.github.io/mind-ar-js-doc/tools/compile>
2. **Add all five images in the exact order above** (0, 1, 2, 3, 4).
3. Click **Start** to compile, then **Download** — it produces `targets.mind`.
4. Rename it to `food-waste-targets.mind` and place it in this folder
   (`public/assets/targets/`).
5. Reload the Scan page on your phone (over HTTPS) and scan an image.

### Option B — Local Node script (advanced, optional)

A best-effort compiler script lives at [`scripts/compile-targets.mjs`](../../../scripts/compile-targets.mjs).
It needs extra native dependencies and is **not** wired into `npm install`:

```bash
npm i -D mind-ar canvas
node scripts/compile-targets.mjs
```

If the native `canvas` build fails on your machine, use Option A.

## Adding more targets

1. Drop a new image in `source/`.
2. Add an entry to `TARGETS` in `src/food-targets.js` (next `targetIndex`).
3. Add a matching `<a-entity mindar-image-target="targetIndex: N">` block in `ar.html`.
4. Re-compile the `.mind` file (include the new image in the same order).

## Notes / honesty

- The app recognises **only** these curated images — not arbitrary food photos.
- It does **not** confirm food safety, and shows **no** exact weight/carbon values.
- A future AI mode could analyse uploaded photos; that is not part of this version.
