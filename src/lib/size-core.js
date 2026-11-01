/*! SimplyStylo international size engine. (c) SimplyStylo. All rights reserved. */
// Adult shoe and clothing size conversions. Shoes pivot on foot length using the published relations between the
// UK/US barleycorn systems, the Continental Paris point and Mondopoint. Clothing uses the conversions retail size
// charts agree on; scales where sources disagree (French/Italian dress numbers, EU trouser numbers) are left out.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSSize = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-01',
    shoe: {
      // Foot-length forms (Wikipedia "Shoe size", from ISO/TS 19407 and the Brannock formulas): size from foot length
      // already includes the usual last allowance of about 2 barleycorns / 2 Paris points.
      uk: 'UK ≈ 3 × foot length (in) − 23',
      usMen: 'US men ≈ 3 × foot length (in) − 22 (UK + 1)',
      usWomen: 'US women: UK + 2 on the standard (FIA) scale, UK + 2.5 on the common US retail scale',
      eu: 'EU ≈ 1.5 × foot length (cm) + 2 (Paris points of 2/3 cm)',
      mondo: 'Mondopoint = foot length in millimetres (ISO 9407)'
    },
    clothing: {
      womenUK: 'UK = US + 4', womenAU: 'AU = UK', womenEU: 'EU (retailer charts) = US + 32',
      menJacketEU: 'EU = US/UK chest size + 10', collar: 'cm = inches × 2.54, rounded to the nearest whole cm'
    }
  };

  var IN = 2.54;
  function r05(x) { return Math.round(x * 2) / 2; }
  function r1(x) { return Math.round(x * 10) / 10; }

  // System sizes from foot length (cm). Unrounded values are kept for tests; display uses the rounded ones.
  function shoeFromFoot(cm) {
    var inch = cm / IN, uk = 3 * inch - 23;
    return {
      footCm: r1(cm), footIn: Math.round(inch * 100) / 100,
      uk: r05(uk), usMen: r05(uk + 1), usWomen: [r05(uk + 2), r05(uk + 2.5)],
      eu: r05(1.5 * cm + 2), mondo: Math.round(cm * 10 / 5) * 5,
      exact: { uk: uk, eu: 1.5 * cm + 2 }
    };
  }

  // Foot length (cm) a size corresponds to. system: uk | usMen | usWomen | eu | mondo | cm | in.
  // US women's uses the common retail scale (UK + 2.5) unless scale === 'fia'.
  function footFromSize(system, size, scale) {
    var s = +size;
    if (!isFinite(s) || s <= 0) return null;
    switch (system) {
      case 'uk': return (s + 23) / 3 * IN;
      case 'usMen': return (s - 1 + 23) / 3 * IN;
      case 'usWomen': return (s - (scale === 'fia' ? 2 : 2.5) + 23) / 3 * IN;
      case 'eu': return (s - 2) / 1.5;
      case 'mondo': return s / 10;
      case 'cm': return s;
      case 'in': return s * IN;
    }
    return null;
  }

  function convertShoe(system, size, scale) {
    var cm = footFromSize(system, size, scale);
    if (cm == null || cm < 15 || cm > 35) return null;
    return shoeFromFoot(cm);
  }

  function shoeTable() {
    var rows = [];
    for (var uk = 3; uk <= 13; uk += 1) rows.push(shoeFromFoot(footFromSize('uk', uk)));
    return rows;
  }

  function womenClothing(us) {
    var s = +us;
    if (!isFinite(s) || s < 0 || s > 30 || s % 2) return null;
    return { us: s, uk: s + 4, au: s + 4, eu: s + 32 };
  }

  function womenFrom(system, size) {
    var s = +size, off = { us: 0, uk: 4, au: 4, eu: 32 }[system];
    if (off == null) return null;
    return womenClothing(s - off);
  }

  function womenTable() {
    var rows = [];
    for (var us = 0; us <= 20; us += 2) rows.push(womenClothing(us));
    return rows;
  }

  function menJacket(chestIn) {
    var c = +chestIn;
    if (!isFinite(c) || c < 30 || c > 60 || c % 2) return null;
    return { us: c, uk: c, eu: c + 10, chestCm: Math.round(c * IN) };
  }

  function menJacketTable() {
    var rows = [];
    for (var c = 34; c <= 52; c += 2) rows.push(menJacket(c));
    return rows;
  }

  function collar(inches) {
    var i = +inches;
    if (!isFinite(i) || i < 12 || i > 21) return null;
    return { in: i, cm: Math.round(i * IN) };
  }

  function collarTable() {
    var rows = [];
    for (var i = 14; i <= 18.5; i += 0.5) rows.push(collar(i));
    return rows;
  }

  function inToCm(x) { return r1(x * IN); }
  function cmToIn(x) { return r1(x / IN); }

  return {
    FACTS: FACTS, shoeFromFoot: shoeFromFoot, footFromSize: footFromSize, convertShoe: convertShoe, shoeTable: shoeTable,
    womenClothing: womenClothing, womenFrom: womenFrom, womenTable: womenTable, menJacket: menJacket,
    menJacketTable: menJacketTable, collar: collar, collarTable: collarTable, inToCm: inToCm, cmToIn: cmToIn
  };
});
