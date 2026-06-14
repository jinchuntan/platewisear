/**
 * app.js — Shared initialisation for every non-immersive page.
 *
 *  - Applies the reduced-motion body class.
 *  - Injects a minimal top bar: brand (→ Home) + a pill nav (Scan · Demo ·
 *    About) + the language switcher (globe · EN / BM / 中文).
 *    Immersive pages opt out with `<body data-tabbar="off">` (the AR page,
 *    which wires its own switcher in ar-controller.js).
 *  - Initialises i18n (sets <html lang> and translates the page).
 */

import { prefersReducedMotion, debug } from './utils.js';
import { initI18n, mountLanguageSwitcher } from './i18n.js';

debug('app.js loaded — page:', location.pathname);

if (prefersReducedMotion()) document.body.classList.add('reduced-motion');

const LEAF =
  '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20C6 20 4 15 4 11c5 0 7 3 7 7"/><path d="M12 20c0-7 4-12 8-13 0 8-3 13-8 13"/></svg>';

const PILLS = [
  { href: 'ar.html', key: 'nav.scan' },
  { href: 'demo.html', key: 'nav.demo' },
  { href: 'about.html', key: 'nav.about' },
];

function injectTopBar() {
  const current = location.pathname.split('/').pop() || 'index.html';

  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML =
    `<a class="topbar__brand" href="index.html" aria-label="PlateNudge home">${LEAF}<span>PlateNudge</span></a>` +
    `<div class="topbar__right">` +
    `<nav class="navpills" aria-label="Primary">` +
    PILLS.map((p) => {
      const active = p.href === current;
      return `<a class="navpill${active ? ' active' : ''}" href="${p.href}" data-i18n="${p.key}"${active ? ' aria-current="page"' : ''}></a>`;
    }).join('') +
    `</nav>` +
    `<div class="topbar__lang"></div>` +
    `</div>`;

  document.body.prepend(bar);
  document.body.classList.add('has-topbar');

  mountLanguageSwitcher(bar.querySelector('.topbar__lang'));
}

if (document.body.dataset.tabbar !== 'off') {
  injectTopBar();
}

// Set <html lang> and translate the page (topbar labels included).
initI18n();
