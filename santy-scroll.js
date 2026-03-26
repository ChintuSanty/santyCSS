/*! santy-scroll.js — SantyCSS Scroll Observer v2.1
 * Activates when-visible: viewport-entry animations via IntersectionObserver.
 *
 * CDN: <script src="https://cdn.jsdelivr.net/npm/santycss/dist/santy-scroll.js"></script>
 *
 * Modifiers read from element classes:
 *   enter-at-{15|25|50|75}  — threshold (default: 0.15)
 *   enter-repeat            — re-trigger on every viewport entry
 */
(function () {
  'use strict';

  function getThreshold(el) {
    if (el.classList.contains('enter-at-75')) return 0.75;
    if (el.classList.contains('enter-at-50')) return 0.50;
    if (el.classList.contains('enter-at-25')) return 0.25;
    return 0.15;
  }

  function makeObserver(threshold, repeat) {
    return new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (!repeat) this.unobserve(entry.target);
        } else if (repeat) {
          entry.target.classList.remove('is-visible');
        }
      }.bind(this));
    }, { threshold: threshold });
  }

  function init() {
    document.querySelectorAll('[class*="when-visible:"]').forEach(function (el) {
      var obs = makeObserver(getThreshold(el), el.classList.contains('enter-repeat'));
      obs.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
