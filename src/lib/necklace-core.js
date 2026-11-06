/*! SimplyStylo necklace length engine. (c) SimplyStylo. All rights reserved. */
// Names the standard necklace length for any chain length and where it falls, using the ranges that published
// jewelry guides agree on. Where they disagree (between matinee and opera, and where opera ends and rope begins),
// the result says so instead of picking one.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSNecklace = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-05',
    ranges: 'Collar 12–13 in, choker 14–16 in, princess 17–19 in, matinee 20–24 in, opera from 28 in, rope 40 in and longer',
    conflict: 'Guides disagree where opera ends and rope begins (anywhere from 32 to 40 in), and some stretch matinee to 26 in.',
    neck: 'Positions are for an average neck of about 14 in (36 cm); on a larger neck each length sits a little higher.'
  };

  // id, name, from (in, inclusive), to (in, exclusive), where it falls, depth 0–1 for the illustration
  var TYPES = [
    { id: 'collar', name: 'Collar', from: 12, to: 14, range: '12–13 in (30–33 cm)', where: 'Sits snugly around the middle of the neck.', best: 'Open necklines: V-neck, off-shoulder and strapless.' },
    { id: 'choker', name: 'Choker', from: 14, to: 17, range: '14–16 in (36–41 cm)', where: 'Rests at the base of the neck.', best: 'Crew, boat, off-shoulder and strapless necklines.' },
    { id: 'princess', name: 'Princess', from: 17, to: 20, range: '17–19 in (43–48 cm), 18 in most common', where: 'Falls on or just below the collarbone.', best: 'Almost any neckline; the most popular length for pendants.' },
    { id: 'matinee', name: 'Matinee', from: 20, to: 25, range: '20–24 in (51–61 cm)', where: 'Falls on the upper chest, between the collarbone and the bust.', best: 'High necklines, crew necks and business wear.' },
    { id: 'gap', name: 'Between matinee and opera', from: 25, to: 28, range: '25–27 in (64–69 cm)', where: 'Falls just above the bust.', best: 'Sweaters and high necklines; guides do not agree on a name for this length.' },
    { id: 'opera', name: 'Opera', from: 28, to: 32, range: '28 in (71 cm) and longer', where: 'Falls at or just below the bust.', best: 'Evening wear and high necklines; can be doubled into a choker-length strand.' },
    { id: 'long', name: 'Long opera or rope', from: 32, to: 40, range: '32–39 in (81–99 cm)', where: 'Falls below the bust.', best: 'Layering, knotting or doubling; guides disagree on the name at this length.' },
    { id: 'rope', name: 'Rope', from: 40, to: 80, range: '40 in (102 cm) and longer', where: 'Falls to the waist or below; usually doubled or knotted.', best: 'Doubled or tripled over plain tops and dresses.' }
  ];

  function r1(x) { return Math.round(x * 10) / 10; }

  function classify(inches) {
    var x = +inches;
    if (!isFinite(x) || x < 10 || x > 80) return null;
    var t = TYPES.filter(function (t) { return x >= t.from && x < t.to; })[0];
    if (!t) t = { id: 'short', name: 'Shorter than collar', range: 'under 12 in (30 cm)', where: 'Shorter than standard adult lengths; check it fits around the neck.', best: 'Children\'s jewelry or very slim necks.' };
    // Illustration depth: 0 = mid-neck, 1 = waist; piecewise-linear through the category anchor points.
    var A = [[12, 0.02], [15, 0.1], [18, 0.2], [22, 0.33], [27, 0.45], [30, 0.52], [36, 0.68], [45, 0.9], [60, 1]];
    var d = 1;
    for (var i = 1; i < A.length; i++) if (x <= A[i][0]) { d = A[i - 1][1] + (A[i][1] - A[i - 1][1]) * (Math.max(x, A[0][0]) - A[i - 1][0]) / (A[i][0] - A[i - 1][0]); break; }
    return { inches: r1(x), cm: Math.round(x * 2.54), type: t, depth: Math.round(d * 1000) / 1000, doubled: x >= 32 ? classify(x / 2) : null };
  }

  // Several lengths for a layered stack, sorted shortest first; flags pairs under 2 in apart (they tangle and overlap).
  function stack(list, unit) {
    var f = unit === 'cm' ? 1 / 2.54 : 1;
    var items = list.map(function (v) { return classify(+v * f); }).filter(Boolean).sort(function (a, b) { return a.inches - b.inches; });
    var close = [];
    for (var i = 1; i < items.length; i++) if (items[i].inches - items[i - 1].inches < 2) close.push([items[i - 1].inches, items[i].inches]);
    return { items: items, close: close };
  }

  return { FACTS: FACTS, TYPES: TYPES, classify: classify, stack: stack };
});
