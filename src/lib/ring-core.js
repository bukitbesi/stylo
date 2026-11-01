/*! SimplyStylo ring size engine. (c) SimplyStylo. All rights reserved. */
// US/Canada ring sizes: inner diameter (mm) = 11.63 + 0.8128 × size (US 7 = 17.32 mm). ISO 8653 (used across
// Europe) names a size by its inner circumference in mm. UK/Australian letter sizes are left out: published charts
// disagree by about half a letter.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSRing = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-02',
    us: 'Inner diameter (mm) = 11.63 + 0.8128 × US size',
    iso: 'ISO 8653 / EU size = inner circumference in mm',
    uk: 'UK and Australian letter sizes are not converted because published charts disagree by about half a letter.'
  };

  var BASE = 11.63, STEP = 0.8128;
  function q(x) { return Math.round(x * 4) / 4; }
  function r1(x) { return Math.round(x * 10) / 10; }

  function fromDiameter(d) {
    d = +d;
    if (!isFinite(d) || d < 12 || d > 26) return null;
    var c = Math.PI * d, us = (d - BASE) / STEP;
    return { diameter: r1(d), circumference: r1(c), us: q(us), eu: Math.round(c), exactUs: us };
  }

  // system: diameter | circumference | us | eu
  function convert(system, value) {
    var v = +value;
    if (!isFinite(v)) return null;
    if (system === 'diameter') return fromDiameter(v);
    if (system === 'circumference' || system === 'eu') return fromDiameter(v / Math.PI);
    if (system === 'us') return fromDiameter(BASE + STEP * v);
    return null;
  }

  function table() {
    var rows = [];
    for (var s = 3; s <= 13; s += 0.5) rows.push(convert('us', s));
    return rows;
  }

  return { FACTS: FACTS, fromDiameter: fromDiameter, convert: convert, table: table };
});
