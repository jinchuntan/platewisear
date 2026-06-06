/**
 * app.js — Shared initialisation for every page
 *
 * Imported by each HTML page to apply common behaviour:
 *  - active-nav highlighting
 *  - HTTPS warning banner
 *  - reduced-motion body class
 */

import { isSecureContext, prefersReducedMotion, debug } from './utils.js';

debug('app.js loaded — page:', location.pathname);

// ---------------------------------------------------------------------------
// 1. Highlight the current page link in the nav bar
// ---------------------------------------------------------------------------
document.querySelectorAll('nav a').forEach((link) => {
  // Compare just the filename portion (e.g. "ar.html")
  const href = link.getAttribute('href');
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  if (href === currentPage || (href === 'index.html' && currentPage === '')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// ---------------------------------------------------------------------------
// 2. Show HTTPS warning if not in a secure context
// ---------------------------------------------------------------------------
if (!isSecureContext()) {
  const banner = document.getElementById('https-warning');
  if (banner) banner.style.display = 'block';
  debug('Not a secure context — camera features may be blocked.');
}

// ---------------------------------------------------------------------------
// 3. Reduced-motion preference
// ---------------------------------------------------------------------------
if (prefersReducedMotion()) {
  document.body.classList.add('reduced-motion');
  debug('Reduced-motion preference detected.');
}
