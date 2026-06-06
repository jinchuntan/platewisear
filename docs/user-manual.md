# PlateWise AR — User Manual

## Step 1: Open the App

Open the PlateWise AR home page in a mobile browser (Chrome on Android recommended). If testing locally, use the URL provided by `npm run dev`.

## Step 2: View or Print the Marker

Navigate to the **Marker** page. Print the marker on white paper (at least 8 cm × 8 cm) or display it on a second screen (laptop or tablet).

## Step 3: Start the AR Experience

Tap **Start AR Experience** on the home page, or navigate to the **AR Experience** page.

## Step 4: Allow Camera Access

Your browser will ask for camera permission. Tap **Allow**. If permission is denied, the camera will not start — check your browser settings and ensure the page is served over HTTPS or localhost.

## Step 5: Scan the Marker

Point your phone camera at the printed or displayed Hiro marker. Hold the phone about 20–40 cm away. Ensure even lighting and avoid glare.

When the marker is detected:
- The status badge will change to **"Marker detected"** (green).
- The AR scene (plate, food pile, SDG 12 label) will appear above the marker.

When the marker is lost:
- The status badge will change to **"Marker not detected"** (red).
- The AR content will disappear until the marker is detected again.

## Step 6: Navigate Facts

Use the **← Previous** and **Next →** buttons in the overlay panel to browse food-waste statistics. The current fact is shown both in the overlay panel and as floating AR text above the marker.

## Step 7: Choose a Food-Waste Action

Tap one of the four action buttons:

| Action | What Happens |
|--------|-------------|
| 🗑️ Throw Away | Waste pile grows; warning appears; feedback explains embedded resource loss. |
| 📦 Save Leftovers | Food pile shrinks; save container appears; feedback explains waste reduction. |
| 🤝 Share | Food pile shrinks; sharing figures appear; feedback explains redistribution. |
| 🌱 Compost | Food pile reduces; compost/plant appears; feedback explains composting hierarchy. |

Each action updates the AR scene, the feedback panel, and saves your choice to localStorage.

## Step 8: Complete the Quiz and Reflection

Navigate to the **Quiz** page. Answer 5 multiple-choice questions about food waste and SDG 12. Your score is displayed and saved to localStorage.

In the **My Action Pledge** section, choose one action you intend to take and tap **Save My Pledge**.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Camera does not start | Ensure the page is served over HTTPS or localhost. Check browser camera permissions. |
| Marker not detected | Ensure the marker is flat, well-lit, not obscured, and the camera is 20–40 cm away. |
| AR content does not appear | Wait for the A-Frame scene to load. Check the browser console for errors. |
| Buttons do not respond | Ensure JavaScript is enabled. Try refreshing the page. |
