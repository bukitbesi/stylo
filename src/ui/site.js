/*! SimplyStylo site chrome: menu, search, share. (c) SimplyStylo. All rights reserved. */
// Loaded on every page (first file of every bundle). Search uses a build-time JSON index fetched on first open.
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  var d = document;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // ----- mobile menu (<details>): close on Escape, outside click or link click -----
  var menu = d.querySelector('.menu');
  if (menu) {
    d.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
  }

  // ----- search -----
  var index = null, loading = null;
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (j) { index = j; return j; });
    return loading;
  }
  // Every word must match; title matches rank above description matches. Entries: [title, path, kind, description].
  function find(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return index.filter(function (e) { return e[2] === 'Tool'; }).slice(0, 6);
    return index.map(function (e) {
      var t = e[0].toLowerCase(), all = t + ' ' + e[2].toLowerCase() + ' ' + e[3].toLowerCase(), score = 0;
      for (var i = 0; i < words.length; i++) {
        if (all.indexOf(words[i]) < 0) return null;
        score += t.indexOf(words[i]) >= 0 ? (t.indexOf(words[i]) === 0 ? 4 : 3) : 1;
      }
      return [score + (e[2] === 'Tool' ? 0.5 : 0), e];
    }).filter(Boolean).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 8).map(function (x) { return x[1]; });
  }
  function bindSearch(input, list) {
    function show() {
      load().then(function () {
        var q = input.value.trim(), hits = find(q);
        list.innerHTML = hits.length ? hits.map(function (e) {
          return '<li><a href="' + e[1] + '"><b>' + esc(e[0]) + '</b><span>' + esc(e[2]) + ' · ' + esc(e[3]) + '</span></a></li>';
        }).join('') : '<li class="search__none">No results for “' + esc(q) + '”. Try “wedding”, “size” or “color”.</li>';
      }, function () { list.innerHTML = '<li class="search__none">Search could not load. Browse <a href="/tools/">all tools</a>.</li>'; });
    }
    input.addEventListener('input', show);
    return show;
  }

  var dlg = d.getElementById('search');
  if (dlg && dlg.showModal) {
    var input = dlg.querySelector('input'), show = bindSearch(input, dlg.querySelector('[data-search-results]'));
    d.querySelectorAll('[data-search-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (menu) menu.open = false;
        dlg.showModal(); input.focus(); show();
      });
    });
    dlg.querySelector('[data-search-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelector('form').addEventListener('submit', function (e) {
      var first = dlg.querySelector('[data-search-results] a');
      if (first) { e.preventDefault(); location.href = first.getAttribute('href'); }
    });
  }
  // The /search/ page (also the no-JavaScript fallback for the header button).
  var page = d.querySelector('[data-search-page]');
  if (page) {
    var pin = page.querySelector('input'), q = new URLSearchParams(location.search).get('q');
    if (q) pin.value = q;
    bindSearch(pin, page.querySelector('[data-search-results]'))();
  }

  // ----- share bar -----
  var nat = d.querySelector('[data-share]');
  if (nat && navigator.share) {
    nat.hidden = false;
    nat.addEventListener('click', function () {
      navigator.share({ title: d.title, url: location.href }).catch(function () {});
    });
  var copy = d.querySelector('[data-share-copy]');
  if (copy) copy.addEventListener('click', function () {
    var label = copy.querySelector('span');
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(location.href).then(function () {
      label.textContent = 'Copied';
      setTimeout(function () { label.textContent = 'Copy link'; }, 2000);
    }, function () {});
  });

  // ----- interactive lookbook studio switcher -----
  var lb = d.querySelector('[data-lookbook]');
  if (lb) {
    var tabs = lb.querySelectorAll('[data-lookbook-tab]');
    var panels = lb.querySelectorAll('[data-lookbook-panel]');
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-lookbook-tab');
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', t === btn ? 'true' : 'false'); });
        panels.forEach(function (p) {
          if (p.getAttribute('data-lookbook-panel') === id) {
            p.removeAttribute('hidden');
          } else {
            p.setAttribute('hidden', '');
          }
        });
      });
    });
  }
})();
