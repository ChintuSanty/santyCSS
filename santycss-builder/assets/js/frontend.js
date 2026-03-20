/* SantyCSS Builder — frontend runtime */
(function () {
  'use strict';

  /* ── Tabs ─────────────────────────────────────────────────────────── */
  document.querySelectorAll('.scb-tabs').forEach(function (tabs) {
    var buttons = tabs.querySelectorAll('.scb-tab-btn');
    var panels  = tabs.querySelectorAll('.scb-tab-panel');

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p)  { p.style.display = 'none'; });
        btn.classList.add('active');
        if (panels[i]) panels[i].style.display = '';
      });
    });

    /* activate first */
    if (buttons[0]) buttons[0].click();
  });

  /* ── Accordion ────────────────────────────────────────────────────── */
  document.querySelectorAll('.scb-accordion-item').forEach(function (item) {
    var header  = item.querySelector('.scb-accordion-header');
    var content = item.querySelector('.scb-accordion-content');
    if (!header || !content) return;

    header.addEventListener('click', function () {
      var open = item.classList.contains('open');
      /* close siblings */
      var parent = item.parentNode;
      if (parent) {
        parent.querySelectorAll('.scb-accordion-item.open').forEach(function (s) {
          s.classList.remove('open');
          var c = s.querySelector('.scb-accordion-content');
          if (c) c.style.maxHeight = '';
        });
      }
      if (!open) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ── Toggle (same as accordion but independent) ───────────────────── */
  document.querySelectorAll('.scb-toggle-item').forEach(function (item) {
    var header  = item.querySelector('.scb-toggle-header');
    var content = item.querySelector('.scb-toggle-content');
    if (!header || !content) return;

    header.addEventListener('click', function () {
      var open = item.classList.contains('open');
      item.classList.toggle('open', !open);
      content.style.maxHeight = open ? '' : content.scrollHeight + 'px';
    });
  });

  /* ── Countdown ────────────────────────────────────────────────────── */
  document.querySelectorAll('.scb-countdown[data-target]').forEach(function (el) {
    var target = new Date(el.dataset.target).getTime();

    function tick() {
      var now  = Date.now();
      var diff = target - now;
      if (diff <= 0) {
        el.querySelectorAll('.scb-countdown-num').forEach(function (n) { n.textContent = '00'; });
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000)  / 60000);
      var s = Math.floor((diff % 60000)    / 1000);

      var parts = el.querySelectorAll('.scb-countdown-num');
      if (parts[0]) parts[0].textContent = String(d).padStart(2, '0');
      if (parts[1]) parts[1].textContent = String(h).padStart(2, '0');
      if (parts[2]) parts[2].textContent = String(m).padStart(2, '0');
      if (parts[3]) parts[3].textContent = String(s).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  });

  /* ── Counter (animated number roll) ──────────────────────────────── */
  var counters = document.querySelectorAll('.scb-counter[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var el       = entry.target;
        var target   = parseFloat(el.dataset.target) || 0;
        var prefix   = el.dataset.prefix || '';
        var suffix   = el.dataset.suffix || '';
        var duration = parseInt(el.dataset.duration, 10) || 2000;
        var start    = Date.now();
        var frame = function () {
          var progress = Math.min((Date.now() - start) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          var val      = target * ease;
          el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ── Progress bars (animate in) ──────────────────────────────────── */
  var bars = document.querySelectorAll('.progress .progress-fill[data-width]');
  if (bars.length && 'IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        barObs.unobserve(entry.target);
        entry.target.style.width = entry.target.dataset.width + '%';
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { barObs.observe(b); });
  }

  /* ── Image carousel ────────────────────────────────────────────────── */
  document.querySelectorAll('.scb-carousel[data-autoplay]').forEach(function (el) {
    var interval = parseInt(el.dataset.autoplay, 10) || 3000;
    var slides   = el.querySelectorAll('.scb-carousel-slide');
    if (slides.length < 2) return;
    var current = 0;

    function show(idx) {
      slides[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
    }

    el.querySelector('.scb-carousel-prev')?.addEventListener('click', function () { show(current - 1); });
    el.querySelector('.scb-carousel-next')?.addEventListener('click', function () { show(current + 1); });

    slides[0].classList.add('active');
    setInterval(function () { show(current + 1); }, interval);
  });

})();
