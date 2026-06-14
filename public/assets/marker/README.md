# Hiro Marker

PlateWise AR uses the standard **Hiro** marker from ARToolKit, recognised by AR.js via
`<a-marker preset="hiro">`.

## Files in this folder

| File | Purpose |
|------|---------|
| `hiro-marker.jpg` | **The marker the app uses.** This is the real, standard Hiro marker image displayed and offered for download on `marker.html`. It matches exactly what `preset="hiro"` expects. |
| `HIRO.jpg` | Original source image (kept for reference). `hiro-marker.jpg` is a copy of this. |
| `sdg12.png` | SDG 12 logo asset. |

## Important

- Do **not** crop, redraw, distort, or regenerate the marker — AR.js needs the full image
  including its **black border** to detect it.
- Print it clearly in **black and white** on white paper, keep it **flat and well-lit**, and
  scan it from about **20–40 cm** away.

## Upstream reference

- AR.js documentation: https://ar-js-org.github.io/AR.js-Docs/
- Original Hiro marker image: https://github.com/AR-js-org/AR.js/blob/master/data/images/hiro.png

> Note: earlier versions of this project drew an approximate marker on a `<canvas>`. That has
> been removed in favour of this real Hiro image so the printed marker always matches the one
> AR.js detects.
