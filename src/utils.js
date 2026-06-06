/**
 * utils.js — Shared utility helpers for PlateWise AR
 */

/**
 * Simple debug logger that prepends a [PlateWise] tag.
 * Messages appear in the browser console for report evidence.
 *
 * @param  {...any} args
 */
export function debug(...args) {
  console.log('[PlateWise]', ...args);
}

/**
 * Check whether the page is served over HTTPS (or localhost).
 * Camera-based AR requires a secure context.
 *
 * @returns {boolean}
 */
export function isSecureContext() {
  return (
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  );
}

/**
 * Show or hide an element by setting its CSS display property.
 *
 * @param {HTMLElement} el
 * @param {boolean} visible
 * @param {string} [displayValue='block']
 */
export function setVisible(el, visible, displayValue = 'block') {
  if (el) el.style.display = visible ? displayValue : 'none';
}

/**
 * Check for prefers-reduced-motion media query.
 *
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
