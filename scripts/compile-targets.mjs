/**
 * compile-targets.mjs — OPTIONAL, best-effort MindAR target compiler.
 *
 * Generates public/assets/targets/food-waste-targets.mind from the images in
 * public/assets/targets/source/ (in the order below — must match targetIndex
 * in src/food-targets.js).
 *
 * This is NOT wired into `npm install`/`npm run build` because it needs extra
 * native dependencies. If it fails on your machine (the native `canvas` build
 * is the usual culprit on Windows/macOS), use the official web compiler instead:
 *   https://hiukim.github.io/mind-ar-js-doc/tools/compile
 *
 * Usage:
 *   npm i -D mind-ar canvas
 *   node scripts/compile-targets.mjs
 */

import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_DIR = resolve('public/assets/targets/source');
const OUT_FILE = resolve('public/assets/targets/food-waste-targets.mind');

// Order matters — keep in sync with src/food-targets.js (targetIndex 0..4)
const FILES = [
  'leftover-rice.jpg',
  'fruit-peels.jpg',
  'bread-waste.jpg',
  'mixed-leftovers.jpg',
  'drink-waste.jpg',
];

async function main() {
  // Ensure source images exist
  for (const f of FILES) {
    const p = resolve(SOURCE_DIR, f);
    if (!existsSync(p)) {
      console.error(`✗ Missing source image: ${p}`);
      process.exit(1);
    }
  }

  let loadImage, Compiler;
  try {
    ({ loadImage } = await import('canvas'));
    ({ Compiler } = await import('mind-ar/src/image-target/compiler.js'));
  } catch (err) {
    console.error('\n✗ Could not load the compiler dependencies.');
    console.error('  Install them first:  npm i -D mind-ar canvas');
    console.error('  Or use the web compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile');
    console.error('  Details:', err.message);
    process.exit(1);
  }

  try {
    console.log('• Loading images…');
    const images = [];
    for (const f of FILES) {
      images.push(await loadImage(resolve(SOURCE_DIR, f)));
    }

    console.log('• Compiling targets (this can take a while)…');
    const compiler = new Compiler();
    await compiler.compileImageTargets(images, (progress) => {
      process.stdout.write(`\r  progress: ${progress.toFixed(1)}%   `);
    });
    process.stdout.write('\n');

    const buffer = compiler.exportData();
    writeFileSync(OUT_FILE, Buffer.from(buffer));
    console.log(`✓ Wrote ${OUT_FILE}`);
  } catch (err) {
    console.error('\n✗ Compilation failed in Node (this is common — the offline');
    console.error('  compiler needs a browser-like canvas/WebGL environment).');
    console.error('  Use the official web compiler instead:');
    console.error('  https://hiukim.github.io/mind-ar-js-doc/tools/compile');
    console.error('  Details:', err.message);
    process.exit(1);
  }
}

main();
