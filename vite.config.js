/**
 * Vite Configuration for PlateNudge
 *
 * Multi-page setup: each HTML file is a separate entry point.
 * This allows `npm run build` to produce a static site with all pages.
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path — use './' so built assets work when served from any subdirectory
  base: './',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ar: resolve(__dirname, 'ar.html'),
        ai: resolve(__dirname, 'ai.html'),
        demo: resolve(__dirname, 'demo.html'),
        marker: resolve(__dirname, 'marker.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },

  server: {
    // Allow access from other devices on the same network (for phone testing)
    host: true,
  },
});
