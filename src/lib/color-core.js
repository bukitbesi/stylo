/*! SimplyStylo color engine. (c) SimplyStylo. All rights reserved. */
// Pure color maths shared by every tool: conversions, harmonies, contrast, perceptual distance (OKLab)
// and the fashion color list. UMD: module.exports in Node, window.SSColor in the browser.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSColor = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-01',
    method: 'Harmonies rotate hue on the HSL color wheel; distance and lightness use OKLab (Ottosson, 2020); contrast uses the WCAG 2.2 relative-luminance formula.'
  };

  // Fashion color names with representative hex values. Real garments vary; these are reference swatches.
  var NAMED = [
    { slug: 'black', name: 'Black', hex: '#1B1B1B', neutral: true },
    { slug: 'charcoal', name: 'Charcoal', hex: '#3C3F44', neutral: true },
    { slug: 'gray', name: 'Gray', hex: '#8E9094', neutral: true },
    { slug: 'white', name: 'White', hex: '#FAFAF7', neutral: true },
    { slug: 'ivory', name: 'Ivory', hex: '#F3EDDF', neutral: true },
    { slug: 'beige', name: 'Beige', hex: '#D8C8AE', neutral: true },
    { slug: 'camel', name: 'Camel', hex: '#B98A57', neutral: true },
    { slug: 'brown', name: 'Brown', hex: '#6B4A33', neutral: true },
    { slug: 'navy', name: 'Navy', hex: '#1F2A44', neutral: true },
    { slug: 'denim-blue', name: 'Denim blue', hex: '#4A6584', neutral: true },
    { slug: 'olive-green', name: 'Olive green', hex: '#6B6B3A', neutral: false },
    { slug: 'khaki', name: 'Khaki', hex: '#B5A77D', neutral: true },
    { slug: 'burgundy', name: 'Burgundy', hex: '#6D1F2E', neutral: false },
    { slug: 'red', name: 'Red', hex: '#C1272D', neutral: false },
    { slug: 'rust', name: 'Rust', hex: '#A4502B', neutral: false },
    { slug: 'mustard-yellow', name: 'Mustard yellow', hex: '#D0A12B', neutral: false },
    { slug: 'blush-pink', name: 'Blush pink', hex: '#E8B9B0', neutral: false },
    { slug: 'hot-pink', name: 'Hot pink', hex: '#D9327A', neutral: false },
    { slug: 'lavender', name: 'Lavender', hex: '#B7A7D3', neutral: false },
    { slug: 'emerald-green', name: 'Emerald green', hex: '#11775A', neutral: false },
    { slug: 'sage-green', name: 'Sage green', hex: '#9CAF94', neutral: false },
    { slug: 'light-blue', name: 'Light blue', hex: '#A9C6E3', neutral: false },
    { slug: 'cobalt-blue', name: 'Cobalt blue', hex: '#1F4FB0', neutral: false },
    { slug: 'teal', name: 'Teal', hex: '#1D6E73', neutral: false },
    { slug: 'orange', name: 'Orange', hex: '#E0702A', neutral: false },
    { slug: 'purple', name: 'Purple', hex: '#5E2C7A', neutral: false }
  ];

  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }

  function normHex(hex) {
    var h = String(hex || '').trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return '#' + h.toUpperCase();
  }

  function hexToRgb(hex) {
    var h = normHex(hex);
    if (!h) return null;
    return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) };
  }

  function rgbToHex(c) {
    return '#' + [c.r, c.g, c.b].map(function (v) {
      return ('0' + clamp(Math.round(v), 0, 255).toString(16)).slice(-2);
    }).join('').toUpperCase();
  }

  function rgbToHsl(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    var l = (max + min) / 2, h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }

  function hslToRgb(c) {
    var h = ((c.h % 360) + 360) % 360, s = clamp(c.s, 0, 100) / 100, l = clamp(c.l, 0, 100) / 100;
    var k = (1 - Math.abs(2 * l - 1)) * s, x = k * (1 - Math.abs((h / 60) % 2 - 1)), m = l - k / 2;
    var p = h < 60 ? [k, x, 0] : h < 120 ? [x, k, 0] : h < 180 ? [0, k, x] : h < 240 ? [0, x, k] : h < 300 ? [x, 0, k] : [k, 0, x];
    return { r: (p[0] + m) * 255, g: (p[1] + m) * 255, b: (p[2] + m) * 255 };
  }

  function hexToHsl(hex) { return rgbToHsl(hexToRgb(hex)); }
  function hslToHex(hsl) { return rgbToHex(hslToRgb(hsl)); }

  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }

  function luminance(hex) {
    var c = hexToRgb(hex);
    return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  }

  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  function toOklab(hex) {
    var c = hexToRgb(hex), r = lin(c.r), g = lin(c.g), b = lin(c.b);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return {
      L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    };
  }

  function distance(a, b) {
    var p = toOklab(a), q = toOklab(b);
    return Math.sqrt(Math.pow(p.L - q.L, 2) + Math.pow(p.a - q.a, 2) + Math.pow(p.b - q.b, 2));
  }

  function nearestNamed(hex) {
    var best = null, bd = Infinity;
    NAMED.forEach(function (n) {
      var d = distance(hex, n.hex);
      if (d < bd) { bd = d; best = n; }
    });
    return best;
  }

  function bySlug(slug) {
    for (var i = 0; i < NAMED.length; i++) if (NAMED[i].slug === slug) return NAMED[i];
    return null;
  }

  // Text color (ink or white) that reads best on a swatch.
  function inkOn(hex) { return contrast(hex, '#171717') >= contrast(hex, '#FFFFFF') ? '#171717' : '#FFFFFF'; }

  function rotate(hex, deg) {
    var c = hexToHsl(hex);
    return hslToHex({ h: c.h + deg, s: c.s, l: c.l });
  }

  // Near-neutral colors (low saturation) have no meaningful hue, so hue rotation would return the same gray.
  // For those we build harmonies from tonal steps instead and say so.
  function isAchromatic(hex) { return hexToHsl(hex).s < 12 || hexToHsl(hex).l < 8 || hexToHsl(hex).l > 95; }

  function tints(hex, n) {
    var c = hexToHsl(hex), out = [];
    var lo = clamp(c.l - 30, 8, 92), hi = clamp(c.l + 30, 8, 94);
    for (var i = 0; i < n; i++) out.push(hslToHex({ h: c.h, s: c.s, l: lo + (hi - lo) * i / (n - 1) }));
    return out;
  }

  function harmonies(hex) {
    var base = normHex(hex);
    if (!base) return null;
    var achromatic = isAchromatic(base);
    return {
      base: base,
      achromatic: achromatic,
      complementary: [base, rotate(base, 180)],
      analogous: [rotate(base, -30), base, rotate(base, 30)],
      triadic: [base, rotate(base, 120), rotate(base, 240)],
      splitComplementary: [base, rotate(base, 150), rotate(base, 210)],
      monochromatic: tints(base, 5)
    };
  }

  // Neutrals ranked by how much they contrast with the base without clashing (OKLab distance, then contrast).
  function bestNeutrals(hex, n) {
    var base = normHex(hex);
    return NAMED.filter(function (x) { return x.neutral && distance(x.hex, base) > 0.08; })
      .map(function (x) { return { slug: x.slug, name: x.name, hex: x.hex, contrast: contrast(x.hex, base), distance: distance(x.hex, base) }; })
      .sort(function (a, b) { return b.distance - a.distance; })
      .slice(0, n || 4);
  }

  // 60-30-10 outfit split: a neutral for the largest area, the base color, and a harmony accent.
  function outfitPalette(hex) {
    var h = harmonies(hex);
    if (!h) return null;
    var neutrals = bestNeutrals(h.base, 3);
    var accent = h.achromatic ? null : h.splitComplementary[1];
    return {
      dominant: neutrals[0],
      secondary: { name: nearestNamed(h.base).name, hex: h.base },
      accent: accent ? { name: nearestNamed(accent).name, hex: accent } : { name: neutrals[1].name, hex: neutrals[1].hex }
    };
  }

  return {
    FACTS: FACTS, NAMED: NAMED, normHex: normHex, hexToRgb: hexToRgb, rgbToHex: rgbToHex, hexToHsl: hexToHsl,
    hslToHex: hslToHex, luminance: luminance, contrast: contrast, toOklab: toOklab, distance: distance,
    nearestNamed: nearestNamed, bySlug: bySlug, inkOn: inkOn, rotate: rotate, isAchromatic: isAchromatic,
    tints: tints, harmonies: harmonies, bestNeutrals: bestNeutrals, outfitPalette: outfitPalette
  };
});
