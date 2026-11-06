/*! SimplyStylo glove size engine. (c) SimplyStylo. All rights reserved. */
// EN ISO 21420 (formerly EN 420) glove sizes 6 to 11: each size is a hand circumference (around the palm at the
// knuckles, thumb excluded) and a hand length (wrist crease to middle fingertip). Size n ≈ n inches around.
// Letter sizes (S, M, L) are left out: brands map them to different numbers.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSGlove = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-05',
    standard: 'EN ISO 21420:2020 (formerly EN 420) hand sizes 6 to 11',
    circumference: 'Hand circumference: around the palm just below the knuckles, thumb excluded',
    length: 'Hand length: from the wrist crease to the tip of the middle finger',
    letters: 'Letter sizes (XS to XXL) are not converted because brands map them to different numbers.'
  };

  // [size, circumference mm, hand length mm]
  var SIZES = [[6, 152, 160], [7, 178, 171], [8, 203, 182], [9, 229, 192], [10, 254, 204], [11, 279, 215]];

  function nearest(mm, col) {
    var best = SIZES[0];
    SIZES.forEach(function (s) { if (Math.abs(s[col] - mm) < Math.abs(best[col] - mm)) best = s; });
    return best;
  }
  function inRange(mm, col, step) { return mm >= SIZES[0][col] - step / 2 && mm <= SIZES[SIZES.length - 1][col] + step / 2; }

  // circ and len in mm (len optional). Returns null when the circumference is not a hand measurement.
  function size(circ, len) {
    circ = +circ; len = len === '' || len == null ? NaN : +len;
    if (!isFinite(circ) || circ < 100 || circ > 350) return null;
    var c = nearest(circ, 1), inside = inRange(circ, 1, 25.4);
    var out = { circ: Math.round(circ), size: c[0], sizeCirc: c[1], sizeLen: c[2], inStandard: inside, inches: Math.round(circ / 25.4 * 10) / 10 };
    if (isFinite(len) && len >= 120 && len <= 260) {
      var l = nearest(len, 2);
      out.len = Math.round(len); out.lengthSize = l[0]; out.lengthInStandard = inRange(len, 2, 11);
    }
    return out;
  }

  function table() { return SIZES.map(function (s) { return { size: s[0], circ: s[1], len: s[2], inches: Math.round(s[1] / 25.4 * 10) / 10 }; }); }

  return { FACTS: FACTS, SIZES: SIZES, size: size, table: table };
});
