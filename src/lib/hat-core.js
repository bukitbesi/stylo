/*! SimplyStylo hat size engine. (c) SimplyStylo. All rights reserved. */
// US fitted hat size = head diameter in inches = circumference ÷ π (circumference in cm ÷ 2.54π, almost exactly
// cm ÷ 8), rounded to the nearest 1/8. EU hats use the circumference in cm. UK sizes are left out: published charts
// disagree on whether UK runs 1/8 smaller than US or the same.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSHat = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-05',
    us: 'US fitted size = head circumference ÷ π in inches (≈ circumference in cm ÷ 8), to the nearest 1/8',
    eu: 'EU / metric size = head circumference in centimeters',
    measure: 'Measure around the head about 1 cm (⅜ in) above the ears and across the forehead',
    uk: 'UK sizes are not converted because published charts disagree by 1/8 of a size.'
  };

  var K = 2.54 * Math.PI;
  var FR = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];
  function eighth(x) { return Math.round(x * 8) / 8; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function label(x) {
    var e = Math.round(x * 8), w = Math.floor(e / 8), f = e % 8;
    return (w ? String(w) : '') + (f ? (w ? ' ' : '') + FR[f] : '') || '0';
  }

  function fromCm(cm) {
    cm = +cm;
    if (!isFinite(cm) || cm < 45 || cm > 66) return null;
    var exact = cm / K, us = eighth(exact);
    return {
      cm: r1(cm), inches: r1(cm / 2.54), inchLabel: label(cm / 2.54), us: us, usLabel: label(us), eu: Math.round(cm), exactUs: exact,
      // Between sizes: the measurement sits more than 1/32 in of diameter above the rounded size.
      between: exact - us > 1 / 32, next: label(us + 0.125)
    };
  }

  // system: cm | in | us
  function convert(system, value) {
    var v = +value;
    if (!isFinite(v) || v <= 0) return null;
    if (system === 'cm') return fromCm(v);
    if (system === 'in') return fromCm(v * 2.54);
    if (system === 'us') return fromCm(v * K);
    return null;
  }

  function table() {
    var rows = [];
    for (var s = 6.5; s <= 8.0001; s += 0.125) rows.push(convert('us', s));
    return rows;
  }

  return { FACTS: FACTS, convert: convert, fromCm: fromCm, table: table, label: label };
});
