/*! SimplyStylo selfie color analysis engine. (c) SimplyStylo. All rights reserved. */
// Turns colors sampled from a selfie (skin, hair, eyes and an optional white reference) into answers for the
// value and contrast questions of the season quiz. Undertone is NOT read from the photo: lighting shifts skin hue
// too much, so the visitor answers the undertone questions. The cut-offs are SimplyStylo's own scale, published on
// the methodology page; they are a guide, not a measurement standard.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./color-core.js'));
  else root.SSSelfie = factory(root.SSColor);
})(typeof self !== 'undefined' ? self : this, function (C) {
  'use strict';

  var FACTS = {
    verified: '2026-11-02',
    scale: {
      hair: 'Hair lightness (Oklab L): above 0.60 light, 0.38–0.60 medium, below 0.38 dark',
      skin: 'Skin lightness: above 0.82 fair or light, 0.62–0.82 medium, below 0.62 tan to deep',
      contrast: 'Hair vs skin lightness gap: above 0.40 high, 0.20–0.40 medium, below 0.20 low',
      eyes: 'Eye clarity (Oklab chroma × lightness gap to skin): high, medium or soft'
    }
  };

  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function unlin(v) { v = Math.max(0, Math.min(1, v)); v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.round(v * 255); }

  // Gray-world correction against a white reference: removes a color cast without changing brightness.
  function whiteBalance(rgb, white) {
    if (!white) return rgb;
    var w = [lin(white.r), lin(white.g), lin(white.b)], avg = (w[0] + w[1] + w[2]) / 3;
    if (!(w[0] > 0 && w[1] > 0 && w[2] > 0)) return rgb;
    return { r: unlin(lin(rgb.r) * avg / w[0]), g: unlin(lin(rgb.g) * avg / w[1]), b: unlin(lin(rgb.b) * avg / w[2]) };
  }

  function lab(rgb) {
    var o = C.toOklab(C.rgbToHex(rgb));
    return { L: o.L, C: Math.sqrt(o.a * o.a + o.b * o.b) };
  }

  // samples: { skin, hair, eyes, white } as {r,g,b}; white optional. Returns quiz answers (option indexes) + readings.
  function answers(samples) {
    var s = samples || {};
    if (!s.skin || !s.hair || !s.eyes) return null;
    var wb = function (x) { return whiteBalance(x, s.white); };
    var skin = lab(wb(s.skin)), hair = lab(wb(s.hair)), eyes = lab(wb(s.eyes));
    var gap = Math.abs(hair.L - skin.L), eyeGap = Math.abs(eyes.L - skin.L);
    var clarity = eyes.C * 4 + eyeGap; // saturated irises and a strong eye/skin gap read as "clear"
    var a = {
      hair: hair.L > 0.60 ? 0 : hair.L >= 0.38 ? 1 : 2,
      skin: skin.L > 0.82 ? 0 : skin.L >= 0.62 ? 1 : 2,
      contrast: gap > 0.40 ? 0 : gap >= 0.20 ? 1 : 2,
      eyes: clarity > 0.62 ? 0 : clarity >= 0.42 ? 1 : 2
    };
    return {
      answers: a,
      readings: { skinL: round(skin.L), hairL: round(hair.L), eyeChroma: round(eyes.C), contrast: round(gap), clarity: round(clarity), balanced: !!s.white }
    };
  }
  function round(x) { return Math.round(x * 100) / 100; }

  // Average color of a square of pixels around (x, y) in RGBA data of the given width/height.
  function sample(data, width, height, x, y, radius) {
    var r = radius || 4, sum = [0, 0, 0], n = 0;
    for (var j = Math.max(0, y - r); j <= Math.min(height - 1, y + r); j++) {
      for (var i = Math.max(0, x - r); i <= Math.min(width - 1, x + r); i++) {
        var o = (j * width + i) * 4;
        sum[0] += data[o]; sum[1] += data[o + 1]; sum[2] += data[o + 2]; n++;
      }
    }
    return n ? { r: Math.round(sum[0] / n), g: Math.round(sum[1] / n), b: Math.round(sum[2] / n) } : null;
  }

  return { FACTS: FACTS, whiteBalance: whiteBalance, answers: answers, sample: sample };
});
