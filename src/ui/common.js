/*! SimplyStylo UI helpers. (c) SimplyStylo. All rights reserved. */
// Shared by every tool page and by the build (which renders the first result into the HTML).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSUI = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Ink or white text on a swatch, by WCAG contrast.
  function lum(hex) {
    var h = hex.replace('#', ''), v = [0, 2, 4].map(function (i) {
      var c = parseInt(h.substr(i, 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function inkOn(hex) {
    var L = lum(hex);
    return (L + 0.05) / (0.0091 + 0.05) >= 1.05 / (L + 0.05) ? '#171717' : '#FFFFFF';
  }

  function swatch(hex, label) {
    return '<li class="sw" style="background:' + hex + ';color:' + inkOn(hex) + '">' +
      (label ? '<b>' + esc(label) + '</b>' : '') + '<span>' + hex + '</span></li>';
  }

  function dot(hex, label) {
    return '<span class="dot" style="background:' + hex + '"' + (label ? ' title="' + esc(label) + '"' : '') + '></span>';
  }

  function bar(hexes, cls) {
    return '<div class="pal' + (cls ? ' ' + cls : '') + '" role="img" aria-label="Palette: ' + esc(hexes.join(', ')) + '">' +
      hexes.map(function (h) { return '<span style="background:' + h + '"></span>'; }).join('') + '</div>';
  }

  // URL hash state: #a=1&b=x. Only non-personal choices are stored, so results can be shared.
  function readHash() {
    var out = {};
    if (typeof location === 'undefined') return out;
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      out[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1));
    });
    return out;
  }
  function writeHash(obj) {
    var s = Object.keys(obj).filter(function (k) { return obj[k] !== '' && obj[k] != null; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]); }).join('&');
    if (history.replaceState) history.replaceState(null, '', s ? '#' + s : location.pathname + location.search);
  }

  function bindCommon(scope) {
    var p = scope.querySelector('[data-print]');
    if (p) p.addEventListener('click', function () { window.print(); });
    var c = scope.querySelector('[data-copy]');
    if (c) c.addEventListener('click', function () {
      var done = function () { c.textContent = 'Link copied'; setTimeout(function () { c.textContent = 'Copy link'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {});
    });
  }

  function track(event, params) {
    if (typeof window === 'undefined') return;
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: event }, params || {}));
  }

  return { esc: esc, inkOn: inkOn, swatch: swatch, dot: dot, bar: bar, readHash: readHash, writeHash: writeHash, bindCommon: bindCommon, track: track };
});
