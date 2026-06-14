/**
 * app.js — Shared initialisation for every page.
 *
 *  - Applies the reduced-motion body class.
 *  - Injects a minimal top bar: brand (→ Home) + a pill nav (Scan · Demo ·
 *    About). One clean, consistent component instead of a crowded link bar.
 *    Immersive pages opt out with `<body data-tabbar="off">` (the AR page).
 */

import { prefersReducedMotion, debug } from './utils.js';

debug('app.js loaded — page:', location.pathname);

if (prefersReducedMotion()) document.body.classList.add('reduced-motion');

const LEAF =
  '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20C6 20 4 15 4 11c5 0 7 3 7 7"/><path d="M12 20c0-7 4-12 8-13 0 8-3 13-8 13"/></svg>';

const PILLS = [
  { href: 'ar.html', label: 'Scan' },
  { href: 'demo.html', label: 'Demo' },
  { href: 'about.html', label: 'About' },
];

function injectTopBar() {
  const current = location.pathname.split('/').pop() || 'index.html';

  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML =
    `<a class="topbar__brand" href="index.html" aria-label="PlateWise AR home">${LEAF}<span>PlateWise</span></a>` +
    `<nav class="navpills" aria-label="Primary">` +
    PILLS.map((p) => {
      const active = p.href === current;
      return `<a class="navpill${active ? ' active' : ''}" href="${p.href}"${active ? ' aria-current="page"' : ''}>${p.label}</a>`;
    }).join('') +
    `</nav>`;

  document.body.prepend(bar);
  document.body.classList.add('has-topbar');
}

if (document.body.dataset.tabbar !== 'off') {
  injectTopBar();
}
