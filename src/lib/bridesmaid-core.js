/*! SimplyStylo bridesmaid palette engine. (c) SimplyStylo. All rights reserved. */
// One wedding color in, a full bridal party palette out: a color for every bridesmaid (ombre, mix-and-match or
// matching), groomsmen suit and tie colors, and a five-color wedding palette. Color maths in HSL; harmonies follow
// the color wheel (analogous ±25°).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./color-core.js'));
  else root.SSBridesmaid = factory(root.SSColor);
})(typeof self !== 'undefined' ? self : this, function (C) {
  'use strict';

  var FACTS = { verified: '2026-11-02' };

  var STYLES = { ombre: 'Ombre (light to dark)', mix: 'Mix and match', match: 'Matching color, different necklines' };
  var VIBES = { pastel: 'Soft pastel', jewel: 'Rich jewel tone', earthy: 'Earthy and muted', classic: 'As chosen' };
  var NECKS = ['v', 'off', 'sweetheart', 'halter', 'square', 'boat', 'scoop', 'crew'];

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  // Moves a color into the chosen vibe while keeping its hue.
  function tune(hex, vibe) {
    var h = C.hexToHsl(hex);
    if (vibe === 'pastel') { h.s = clamp(h.s, 25, 55); h.l = clamp(h.l, 78, 86); }
    else if (vibe === 'jewel') { h.s = clamp(Math.max(h.s, 55), 55, 80); h.l = clamp(h.l, 26, 38); }
    else if (vibe === 'earthy') { h.s = clamp(h.s, 22, 40); h.l = clamp(h.l, 42, 58); }
    return C.hslToHex(h);
  }

  function shift(hex, dh, dl) { var h = C.hexToHsl(hex); return C.hslToHex({ h: h.h + dh, s: h.s, l: clamp(h.l + dl, 8, 92) }); }

  // opts: { color: hex, style, vibe, count (2–12) }
  function plan(opts) {
    var o = opts || {};
    var base = C.normHex(o.color) || '#9CAF94';
    var style = STYLES[o.style] ? o.style : 'ombre', vibe = VIBES[o.vibe] ? o.vibe : 'classic';
    var count = clamp(parseInt(o.count, 10) || 5, 2, 12);
    var main = vibe === 'classic' ? base : tune(base, vibe);
    var mh = C.hexToHsl(main);

    // Five-color wedding palette: main, two analogous neighbors, a light tint and a deep shade.
    var palette = [main, shift(main, -25, 0), shift(main, 25, 0), C.hslToHex({ h: mh.h, s: mh.s * 0.6, l: clamp(mh.l + 28, 70, 94) }), C.hslToHex({ h: mh.h, s: mh.s, l: clamp(mh.l - 22, 12, 40) })];

    var maids = [];
    for (var i = 0; i < count; i++) {
      var hex;
      if (style === 'match') hex = main;
      else if (style === 'mix') hex = palette[i % 5];
      else {
        var lo = clamp(mh.l - 22, 14, 60), hi = clamp(mh.l + 22, 40, 92);
        hex = C.hslToHex({ h: mh.h, s: mh.s, l: count === 1 ? mh.l : hi - (hi - lo) * i / (count - 1) });
      }
      maids.push({ hex: hex, name: C.nearestNamed(hex).name, neckline: style === 'ombre' ? 'v' : NECKS[i % NECKS.length] });
    }

    // Groomsmen: a neutral suit that sets off the main color, tie in the main color.
    var light = C.luminance(main) > 0.45;
    var suit = vibe === 'earthy' ? { name: 'Tan', hex: '#B5A77D' } : vibe === 'pastel' || light ? { name: 'Light gray', hex: '#8E9094' } : { name: 'Navy', hex: '#1F2A44' };
    if (C.distance(suit.hex, main) < 0.12) {
      // Too close to the main color: use the classic suit color that contrasts most with it.
      suit = [{ name: 'Navy', hex: '#1F2A44' }, { name: 'Light gray', hex: '#8E9094' }, { name: 'Tan', hex: '#B5A77D' }, { name: 'Charcoal', hex: '#3C3F44' }]
        .sort(function (a, b) { return C.distance(b.hex, main) - C.distance(a.hex, main); })[0];
    }

    return { main: main, mainName: C.nearestNamed(main).name, style: style, vibe: vibe, count: count, palette: palette, maids: maids,
      groomsmen: { suit: suit, tie: { name: C.nearestNamed(main).name, hex: main } } };
  }

  return { FACTS: FACTS, STYLES: STYLES, VIBES: VIBES, tune: tune, plan: plan };
});
