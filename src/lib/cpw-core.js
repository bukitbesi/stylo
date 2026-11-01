/*! SimplyStylo cost-per-wear engine. (c) SimplyStylo. All rights reserved. */
// Cost per wear = (price + care costs − resale value) ÷ number of wears. Pure arithmetic: no rates or data.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSCpw = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-02', formula: 'Cost per wear = (price + care cost per wear × wears − resale value) ÷ total wears' };

  function n(x, d) { x = +x; return isFinite(x) && x >= 0 ? x : d; }

  // item: { price, perYear (wears per year), years, care (per wear), resale }
  function item(it) {
    var price = n(it.price, 0), perYear = n(it.perYear, 0), years = n(it.years, 0), care = n(it.care, 0), resale = n(it.resale, 0);
    var wears = Math.round(perYear * years);
    if (!wears) return { price: price, wears: 0, total: price, cpw: null };
    var total = price + care * wears - Math.min(resale, price + care * wears);
    return { price: price, wears: wears, total: Math.round(total * 100) / 100, cpw: Math.round(total / wears * 100) / 100 };
  }

  // How many wears item A needs to reach item B's cost per wear.
  function breakEven(a, b) {
    var A = item(a), B = item(b);
    if (!B.cpw) return null;
    return Math.ceil(A.total / B.cpw);
  }

  function compare(a, b) {
    var A = item(a), B = item(b);
    var ratio = A.cpw && B.cpw ? Math.round(Math.max(A.cpw, B.cpw) / Math.min(A.cpw, B.cpw) * 10) / 10 : null;
    var better = A.cpw == null || B.cpw == null ? null : A.cpw < B.cpw ? 'a' : A.cpw > B.cpw ? 'b' : 'same';
    return { a: A, b: B, better: better, ratio: ratio, breakEvenA: breakEven(a, b) };
  }

  return { FACTS: FACTS, item: item, compare: compare, breakEven: breakEven };
});
