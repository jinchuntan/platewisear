# PlateWise AR — User Manual

> **Scope:** This manual covers the **core** marker-based WebAR app. AI features (AI tips,
> image scanning, object recognition, backend/ML) are **future work** and are **not** part of
> this version.

## Step 1: Open the App

Open the PlateWise AR home page in a mobile browser (Chrome on Android recommended). If testing
locally, use the URL provided by `npm run dev`. **Camera AR requires HTTPS or localhost** — see
"Testing on a phone" in the README.

## Step 2: Get the Marker

Navigate to the **Marker** page. The app uses the **standard Hiro marker** — the real image at
`public/assets/marker/hiro-marker.jpg`, which is exactly what the AR page expects.

- Tap **🖨️ Print This Page** — the print layout sizes the marker to about 10 cm, or
- Tap **⬇️ Download Marker** to save `hiro-marker.jpg` and print or share it yourself.

When printing/using the marker:

- **Print clearly in black and white** on plain white paper (at least 8 cm × 8 cm).
- **Do not crop the black border** — AR.js needs the full black frame.
- **Keep the marker flat and well-lit** — avoid bends, glare, and shadows.
- **Scan from around 20–40 cm away.**
- No printer? Display the Marker page on a laptop/tablet screen and scan that.

## Step 3: Start the AR Experience

Tap **Start AR Experience** on the home page, or open the **AR Experience** page.

## Step 4: Allow Camera Access — and understanding the on-screen states

The AR page shows a clear status screen while the camera/AR starts up, and for any problem.
You may see:

| State | What it means / what to do |
|-------|----------------------------|
| **Camera permission needed** | Your browser is about to ask — tap **Allow**. |
| **Starting camera… / Loading AR…** | Normal start-up; wait a few seconds. |
| **AR ready** | The camera is live — point it at the marker. |
| **HTTPS required for the camera** | Open the page over HTTPS or on localhost, then retry. |
| **Camera not supported** | This browser can't access the camera — use **Demo Mode** or another browser. |
| **Camera permission denied** | Access was blocked — allow it in browser settings, then **Try Again**. |
| **No camera found / Camera unavailable** | No camera, or it's used by another app/tab — close it and **Try Again**. |
| **AR failed to load** | Start-up timed out (~10 s). Read the troubleshooting tips, **Try Again**, or use **Demo Mode**. |

Every error state offers a **🔄 Try Again** button and an **🖥️ Open Demo Mode (no camera)** link
so you are never stuck.

## Step 5: Scan the Marker

Point your phone camera at the Hiro marker, about 20–40 cm away, with even lighting.

- When detected: the badge changes to **"Marker detected"** (green) and the AR scene (plate, food
  pile, SDG 12 label, fact text) appears above the marker.
- When lost: the badge changes back to **"Marker not detected"** (red) and the AR content
  disappears until the marker is detected again.

## Step 6: Follow the Progress Indicator

A 4-step indicator at the top of the overlay guides you:

1. **Scan marker** → 2. **Read facts** → 3. **Choose action** → 4. **Complete quiz**

It advances automatically: detecting the marker moves you to *Read facts*; choosing an action
moves you to *Choose action* and then highlights *Complete quiz*.

## Step 7: Navigate Facts (with sources)

Use **← Previous** and **Next →** to browse food-waste statistics. Each fact shows its **source
citation** (e.g. "Source: UNEP Food Waste Index Report 2024") below it in the overlay and in AR
space. The current fact also floats above the marker.

## Step 8: Choose a Food-Waste Action

Tap one of the four action buttons:

| Action | What Happens |
|--------|-------------|
| 🗑️ Throw Away | Waste pile grows; warning appears; feedback explains embedded resource loss. |
| 📦 Save Leftovers | Food pile shrinks; save container appears; feedback explains waste reduction. |
| 🤝 Share | Food pile shrinks; sharing figures appear; feedback explains redistribution. |
| 🌱 Compost | Food pile reduces; compost/plant appears; feedback explains the composting hierarchy. |

Each action updates the **AR scene**, the **feedback panel**, and saves your choice to
localStorage (so it can be recalled on the Quiz page).

## Step 9: Demo Mode (no camera)

The **Demo** page mirrors the same flow without a camera or marker: fact navigation with source
labels, the four action buttons, a changing plate visual, feedback text, and a link to the quiz.
Use it if the camera is unavailable or for report screenshots.

## Step 10: Complete the Quiz and Reflection

Open the **Quiz** page. If you chose an action in AR/Demo, it is recalled at the top. Answer the
5 multiple-choice questions (correct/incorrect highlighting and explanations appear). Your score
is shown and saved to localStorage. In **My Action Pledge**, choose a pledge and tap **Save My
Pledge**. Saved score and pledge appear in **Saved Results** and persist across reloads.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Camera does not start | Ensure HTTPS or localhost. Check browser camera permissions. The on-screen state will tell you which problem occurred. |
| Permission denied | Allow camera access for the site in browser settings, then tap **Try Again**. |
| "Camera not supported" | Use Chrome/Firefox on Android, or use **Demo Mode**. |
| Marker not detected | Keep the marker flat, well-lit, uncropped, and hold the camera 20–40 cm away. |
| AR content does not appear | Wait for "AR ready". If it times out, use **Try Again** or **Demo Mode**. |
| Buttons do not respond | Ensure JavaScript is enabled; try refreshing. |
