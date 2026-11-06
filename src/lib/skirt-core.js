/*! SimplyStylo circle skirt engine. (c) SimplyStylo. All rights reserved. */
// Circle skirt geometry: the waist is an arc of a circle, so waist radius r = waist ÷ (2π × fraction of a circle).
// The waistline is cut r − seam allowance from the center; the hem is cut r + length + hem allowance away.
// Fabric is estimated from the bounding rectangles of the pieces, measured along the fabric length.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSSkirt = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-06',
    radius: 'Waist radius = waist ÷ (2π × circle fraction): full 1, three-quarter 0.75, half 0.5, quarter 0.25',
    cut: 'Cut the waistline at the waist radius minus the seam allowance, and the hem at waist radius + skirt length + hem allowance',
    fabric: 'Fabric: one piece when the fabric is at least twice the outer radius wide (length 2R for a full or three-quarter skirt, R for half or quarter); otherwise half-circle pieces laid lengthwise, R wide and 2R long',
    limits: 'Estimates exclude pattern matching, nap, shrinkage and the waistband; add 10% for safety.'
  };

  var TYPES = { full: { name: 'Full circle', f: 1 }, three: { name: 'Three-quarter circle', f: 0.75 }, half: { name: 'Half circle', f: 0.5 }, quarter: { name: 'Quarter circle', f: 0.25 } };
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }

  // o: { waist, length, type, seam, hem, width } all in one unit (cm or in).
  function calc(o) {
    var t = TYPES[o.type] || TYPES.full, waist = +o.waist, length = +o.length, seam = +o.seam || 0, hem = +o.hem || 0, width = +o.width;
    if (!(waist > 0) || !(length > 0) || seam < 0 || hem < 0) return null;
    var r = waist / (2 * Math.PI * t.f), inner = r - seam, R = r + length + hem;
    if (inner <= 0) return null;
    var quarters = Math.round(4 * t.f), layout;
    // Wide fabric: the whole skirt is one piece inside a 2R-wide rectangle. Narrower fabric (at least R): half-circle
    // pieces laid lengthwise, each 2R long, plus a quarter for a three-quarter skirt.
    if (width >= 2 * R) layout = { wide: true, rows: Math.ceil(quarters / 2), panels: 1 };
    else if (width >= R) layout = { wide: false, rows: quarters, panels: Math.ceil(quarters / 2) };
    else layout = null;
    var fabric = layout ? layout.rows * R : null;
    return {
      type: o.type in TYPES ? o.type : 'full', name: t.name, fraction: t.f,
      r: r2(r), inner: r2(inner), outer: r2(R), hemSweep: r1(2 * Math.PI * (r + length) * t.f),
      quarters: quarters, layout: layout, fabric: fabric == null ? null : r1(fabric), width: width,
      area: r1(Math.PI * (R * R - inner * inner) * t.f)
    };
  }

  return { FACTS: FACTS, TYPES: TYPES, calc: calc };
});
