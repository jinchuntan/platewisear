/**
 * app.js — Shared initialisation for every page.
 *
 *  - Applies the reduced-motion body class.
 *  - Injects the minimal bottom tab bar (Home · AR · Marker · About) and marks
 *    the current page active. This keeps navigation to one clean, consistent
 *    component instead of a crowded six-link top bar. Immersive pages opt out
 *    with `<body data-tabbar="off">` (the AR page does this).
 */

import { prefersReducedMotion, debug } from './utils.js';

debug('app.js loaded — page:', location.pathname);

// Reduced-motion preference
if (prefersReducedMotion()) {
  document.body.classList.add('reduced-motion');
}

// ---------------------------------------------------------------------------
// Bottom tab bar
// ---------------------------------------------------------------------------

/** Minimal stroke icons (inherit colour via currentColor). */
const ICONS = {
  home:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/></svg>',
  ar:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5a2 2 0 0 1 2-2h1.3l1-1.6A1 1 0 0 1 9.1 4h5.8a1 1 0 0 1 .8.4l1 1.6H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/></svg>',
  marker:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8"/><path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8"/><path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16"/><path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
  about:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/></svg>',
};

const TABS = [
  { href: 'index.html', label: 'Home', icon: ICONS.home },
  { href: 'ar.html', label: 'AR', icon: ICONS.ar },
  { href: 'marker.html', label: 'Marker', icon: ICONS.marker },
  { href: 'about.html', label: 'About', icon: ICONS.about },
];

function injectTabBar() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.className = 'tabbar';
  nav.setAttribute('aria-label', 'Primary');

  nav.innerHTML = TABS.map((tab) => {
    const isActive = tab.href === current || (tab.href === 'index.html' && current === '');
    return (
      `<a class="tabbar__item${isActive ? ' active' : ''}" href="${tab.href}"` +
      `${isActive ? ' aria-current="page"' : ''}>` +
      `${tab.icon}<span class="tabbar__label">${tab.label}</span></a>`
    );
  }).join('');

  document.body.appendChild(nav);
  document.body.classList.add('has-tabbar');
}

if (document.body.dataset.tabbar !== 'off') {
  injectTabBar();
}
