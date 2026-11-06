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

  // The label sits on its own light chip so it stays readable (WCAG AA) on any swatch color.
  function swatch(hex, label) {
    return '<li class="sw" style="background:' + hex + '"><span class="sw__t">' +
      (label ? '<b>' + esc(label) + '</b>' : '') + '<span>' + hex + '</span></span></li>';
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

  function wrapLines(ctx, text, maxWidth) {
    var words = String(text || '').split(/\s+/), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = words[i];
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function downloadCard(scope) {
    if (typeof document === 'undefined') return;
    var toolId = scope.getAttribute('data-tool') || 'style';
    var toolLabel = scope.getAttribute('aria-label') || 'Style Specification';
    var bigEl = scope.querySelector('.big') || document.querySelector('h1');
    var sumEl = scope.querySelector('[data-summary]');
    var headline = bigEl ? bigEl.textContent.trim() : toolLabel;
    var summaryText = sumEl ? sumEl.textContent.trim() : '';

    var canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    var ctx = canvas.getContext('2d');

    // Archival warm paper background & framing
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = '#E6E1D8';
    ctx.lineWidth = 3;
    ctx.strokeRect(44, 44, 992, 1262);
    ctx.fillStyle = '#1C2D22';
    ctx.fillRect(44, 44, 992, 12);

    // Brand header
    ctx.fillStyle = '#111110';
    ctx.fillRect(96, 102, 56, 56);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = '600 36px Georgia, serif';
    ctx.fillText('S', 114, 143);
    ctx.fillStyle = '#111110';
    ctx.font = '600 38px Georgia, serif';
    ctx.fillText('SimplyStylo', 170, 142);

    ctx.fillStyle = '#67625B';
    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(toolLabel.toUpperCase(), 96, 224);

    // Primary result headline
    ctx.fillStyle = '#111110';
    ctx.font = '600 64px Georgia, serif';
    var hLines = wrapLines(ctx, headline, 888).slice(0, 2);
    var y = 300;
    hLines.forEach(function (line) {
      ctx.fillText(line, 96, y);
      y += 76;
    });

    // Summary paragraph
    ctx.fillStyle = '#45423E';
    ctx.font = '400 30px system-ui, -apple-system, sans-serif';
    var sLines = wrapLines(ctx, summaryText, 888).slice(0, 4);
    y += 12;
    sLines.forEach(function (line) {
      ctx.fillText(line, 96, y);
      y += 44;
    });

    // Color swatches if present
    var swatchEls = scope.querySelectorAll('.sw, .pal span');
    if (swatchEls.length > 0) {
      y += 28;
      var maxSw = Math.min(8, swatchEls.length);
      var swW = Math.floor((888 - (maxSw - 1) * 14) / maxSw);
      for (var i = 0; i < maxSw; i++) {
        var bg = swatchEls[i].style.backgroundColor || swatchEls[i].style.background || '#1F2A44';
        ctx.fillStyle = bg;
        ctx.fillRect(96 + i * (swW + 14), y, swW, 130);
        ctx.strokeStyle = 'rgba(17,17,16,0.12)';
        ctx.lineWidth = 2;
        ctx.strokeRect(96 + i * (swW + 14), y, swW, 130);
      }
      y += 175;
    }

    // KPI specification grid if present
    var kpiEls = scope.querySelectorAll('.kpi');
    if (kpiEls.length > 0 && y < 1040) {
      y += 16;
      var kCount = Math.min(4, kpiEls.length);
      var colW = 432, rowH = 136;
      for (var j = 0; j < kCount; j++) {
        var kx = 96 + (j % 2) * (colW + 24);
        var ky = y + Math.floor(j / 2) * (rowH + 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(kx, ky, colW, rowH);
        ctx.strokeStyle = '#E6E1D8';
        ctx.lineWidth = 2;
        ctx.strokeRect(kx, ky, colW, rowH);
        var spans = kpiEls[j].querySelectorAll('span');
        var bEl = kpiEls[j].querySelector('b');
        ctx.fillStyle = '#67625B';
        ctx.font = '600 19px system-ui, -apple-system, sans-serif';
        if (spans[0]) ctx.fillText(spans[0].textContent.trim().toUpperCase(), kx + 24, ky + 42);
        ctx.fillStyle = '#111110';
        ctx.font = '600 36px Georgia, serif';
        if (bEl) ctx.fillText(bEl.textContent.trim().slice(0, 22), kx + 24, ky + 94);
      }
    }

    // Footer bar & watermark
    ctx.strokeStyle = '#E6E1D8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, 1190);
    ctx.lineTo(984, 1190);
    ctx.stroke();

    ctx.fillStyle = '#1C2D22';
    ctx.font = '600 26px system-ui, -apple-system, sans-serif';
    var pathStr = typeof location !== 'undefined' ? location.pathname : '/tools/';
    ctx.fillText('simplystylo.com' + pathStr, 96, 1244);
    ctx.fillStyle = '#67625B';
    ctx.font = '400 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('Bespoke Style Architecture · 100% Private Browser Engine', 96, 1280);

    var a = document.createElement('a');
    a.download = 'simplystylo-' + toolId + '-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  function bindCommon(scope) {
    var p = scope.querySelector('[data-print]');
    if (p) p.addEventListener('click', function () { window.print(); });
    var c = scope.querySelector('[data-copy]');
    if (c) c.addEventListener('click', function () {
      var done = function () { c.textContent = 'Link copied'; setTimeout(function () { c.textContent = 'Copy link'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {});
    });
    var card = scope.querySelector('[data-card]');
    if (card) card.addEventListener('click', function () {
      downloadCard(scope);
      card.textContent = 'Saved PNG';
      setTimeout(function () { card.textContent = 'Save card (PNG)'; }, 2000);
    });
  }

  function track(event, params) {
    if (typeof window === 'undefined') return;
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: event }, params || {}));
  }

  return { esc: esc, inkOn: inkOn, swatch: swatch, dot: dot, bar: bar, readHash: readHash, writeHash: writeHash, bindCommon: bindCommon, downloadCard: downloadCard, track: track };
});

