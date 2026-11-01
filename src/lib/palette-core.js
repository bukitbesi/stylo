/*! SimplyStylo photo palette engine. (c) SimplyStylo. All rights reserved. */
// Finds the main colors of a photo with k-means clustering in the Oklab color space (distances match how different
// colors look), seeded deterministically so the same photo always gives the same palette. Runs entirely in the
// browser on a downscaled copy of the image; nothing is uploaded. Depends on SSColor and SSSeason.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./color-core.js'), require('./season-core.js'));
  else root.SSPalette = factory(root.SSColor, root.SSSeason);
})(typeof self !== 'undefined' ? self : this, function (C, SE) {
  'use strict';

  var FACTS = { verified: '2026-11-02', method: 'k-means clustering (k-means++ seeding, fixed seed) in Oklab on up to 12,000 sampled pixels' };

  function srgbToLin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function linToSrgb(v) { v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); }

  function toLab(r, g, b) {
    r = srgbToLin(r); g = srgbToLin(g); b = srgbToLin(b);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function toHex(lab) {
    var l = Math.pow(lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2], 3);
    var m = Math.pow(lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2], 3);
    var s = Math.pow(lab[0] - 0.0894841775 * lab[1] - 1.291485548 * lab[2], 3);
    return C.rgbToHex({
      r: linToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      g: linToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      b: linToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
    });
  }
  function d2(a, b) { var x = a[0] - b[0], y = a[1] - b[1], z = a[2] - b[2]; return x * x + y * y + z * z; }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // rgba: flat array/Uint8ClampedArray of RGBA bytes. Returns colors sorted by share of the image.
  function extract(rgba, k) {
    k = k || 6;
    var total = rgba.length / 4, step = Math.max(1, Math.floor(total / 12000)), pts = [];
    for (var i = 0; i < total; i += step) {
      var o = i * 4;
      if (rgba[o + 3] < 128) continue; // skip transparent pixels
      pts.push(toLab(rgba[o], rgba[o + 1], rgba[o + 2]));
    }
    if (!pts.length) return [];
    var r = rng(20261102), centers = [pts[Math.floor(r() * pts.length)]];
    // k-means++ seeding: each new center is picked far from the existing ones.
    while (centers.length < Math.min(k, pts.length)) {
      var dist = pts.map(function (p) { return Math.min.apply(null, centers.map(function (c) { return d2(p, c); })); });
      var sum = dist.reduce(function (a, b) { return a + b; }, 0);
      if (!sum) break;
      var t = r() * sum, j = 0;
      while ((t -= dist[j]) > 0 && j < dist.length - 1) j++;
      centers.push(pts[j]);
    }
    var assign = new Array(pts.length);
    for (var it = 0; it < 20; it++) {
      var moved = false;
      for (var p = 0; p < pts.length; p++) {
        var best = 0, bd = Infinity;
        for (var c = 0; c < centers.length; c++) { var dd = d2(pts[p], centers[c]); if (dd < bd) { bd = dd; best = c; } }
        if (assign[p] !== best) { assign[p] = best; moved = true; }
      }
      var acc = centers.map(function () { return [0, 0, 0, 0]; });
      for (p = 0; p < pts.length; p++) { var a = acc[assign[p]]; a[0] += pts[p][0]; a[1] += pts[p][1]; a[2] += pts[p][2]; a[3]++; }
      centers = acc.map(function (a, i2) { return a[3] ? [a[0] / a[3], a[1] / a[3], a[2] / a[3]] : centers[i2]; });
      if (!moved) break;
    }
    var counts = centers.map(function () { return 0; });
    assign.forEach(function (a2) { counts[a2]++; });
    var out = centers.map(function (c, i3) {
      var hex = toHex(c), named = C.nearestNamed(hex);
      return { hex: hex, share: Math.round(counts[i3] / pts.length * 100), name: named.name, slug: named.slug, neutral: named.neutral };
    }).filter(function (x) { return x.share >= 2; });
    // Merge clusters that land on the same visible color.
    var merged = [];
    out.sort(function (x, y) { return y.share - x.share; }).forEach(function (x) {
      var twin = merged.filter(function (m) { return C.distance(m.hex, x.hex) < 0.03; })[0];
      if (twin) twin.share += x.share; else merged.push(x);
    });
    return merged.sort(function (x, y) { return y.share - x.share; });
  }

  // Which seasonal palettes contain colors closest to this palette (weighted by share).
  function seasonMatch(colors, n) {
    return Object.keys(SE.SEASONS).map(function (id) {
      var s = SE.SEASONS[id], all = s.palette.concat(s.neutrals), score = 0, w = 0;
      colors.forEach(function (c) {
        var d = Math.min.apply(null, all.map(function (h) { return C.distance(h, c.hex); }));
        score += d * c.share; w += c.share;
      });
      return { id: id, name: s.name, score: w ? score / w : 1 };
    }).sort(function (a, b) { return a.score - b.score; }).slice(0, n || 3);
  }

  // A synthetic outfit image (used for the example result): blocks of color in the given proportions.
  function demoPixels(parts, size) {
    size = size || 60;
    var px = new Uint8ClampedArray(size * size * 4), idx = 0;
    parts.forEach(function (p) {
      var rgb = C.hexToRgb(p[0]), cnt = Math.round(size * size * p[1]);
      for (var i = 0; i < cnt && idx < size * size; i++, idx++) { px[idx * 4] = rgb.r; px[idx * 4 + 1] = rgb.g; px[idx * 4 + 2] = rgb.b; px[idx * 4 + 3] = 255; }
    });
    return px;
  }

  return { FACTS: FACTS, extract: extract, seasonMatch: seasonMatch, demoPixels: demoPixels, toLab: toLab, toHex: toHex };
});
