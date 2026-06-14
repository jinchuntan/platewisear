# PlateNudge — User Manual

> **Scope:** This is the **core, non-AI** version. PlateNudge scans a small set of **curated
> food-waste images** and shows AR exhibits. It does **not** recognise arbitrary food photos and
> does **not** judge food safety. AI image analysis is future work.

## 1. Open the app

Open the home page in a mobile browser (Chrome on Android recommended). Camera AR needs **HTTPS
or localhost** — see "Test on a phone" in the README.

## 2. Get something to scan

The app recognises five curated images (the **Scan images** page):

- **Leftover rice** — edible leftovers
- **Fruit peels** — unavoidable scraps
- **Bread waste** — edible surplus
- **Mixed leftovers** — plate scraps/trimmings
- **Drink waste** — drinks & single-use cups

Open the **Scan images** page on another screen, or tap **Download** to save/print an image.
(For a camera-free walkthrough, use **Demo Mode** instead.)

## 3. Start scan

Tap **Start scan**. Allow camera access when asked. You may see these states:

| State | Meaning / action |
|-------|------------------|
| **Camera permission needed / Starting camera** | Normal start-up — tap Allow, wait a few seconds. |
| **Ready to scan** | Point the camera at a food-waste image. |
| **Scan targets not installed** | The `.mind` target file isn't set up — see README, or use Demo Mode. |
| **HTTPS required / Camera denied / not supported / unavailable / failed** | Follow the on-screen tip, **Try again**, or **Open Demo Mode**. |

Every error offers **Try again** and **Open Demo Mode**.

## 4. Scan an image

Point the camera at one of the curated images — fill the frame, hold flat, good light, ~20–40 cm.
When detected:

- An **AR exhibit card** appears over the image (title, SDG 12 tag, a statistic, recommended action).
- A **bottom sheet** slides up, titled with the detected exhibit.

When the image leaves the frame, the sheet drops and a **"Point at a food-waste image"** hint returns.

## 5. Choose an action

In the bottom sheet, tap one of:

- **Throw** · **Save** · **Share** · **Compost**

The recommended action is marked with a ★. The feedback updates with guidance **specific to that
image** (e.g. compost is recommended for kitchen scraps; sharing for edible surplus).

## 6. Ask more

Tap **Ask more** for a short, non-AI explanation drawer:

- What am I looking at? · Why it matters · What should I do? · Safety note

## 7. Demo Mode (no camera)

The **Demo** page mirrors the flow without a camera: tap a sample image → see the exhibit, the
same actions and guidance, and the Ask-More drawer.

## 8. Quiz & reflection

Open **Quiz**. Your last action is recalled at the top. Answer 5 questions (with explanations),
see your score, and save a pledge. Score and pledge persist in localStorage.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Scan targets not installed" | Generate `public/assets/targets/food-waste-targets.mind` (README), or use Demo Mode. |
| Camera won't start | Use HTTPS/localhost; allow camera permission; the on-screen state explains which problem occurred. |
| Image not detected | Fill the frame, hold flat and steady, improve lighting, get closer (~20–40 cm). |
| Anything else | Use **Demo Mode** — it needs no camera or targets. |
