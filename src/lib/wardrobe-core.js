/*! SimplyStylo wardrobe color engine. (c) SimplyStylo. All rights reserved. */
// Scores how well the colors someone owns work together and which color to add next. A pair "works" when one
// color is a neutral, or when their hues are analogous, complementary or triadic on the color wheel.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./color-core.js'));
  else root.SSWardrobe = factory(root.SSColor);
})(typeof self !== 'undefined' ? self : this, function (C) {
  'use strict';

  var FACTS = { verified: '2026-11-02', rule: 'Neutral + anything = easy pair; hue difference ≤ 35° analogous, 110–130° triadic, 150–210° complementary; other color pairs are harder to combine.' };

  function hueGap(a, b) {
    var d = Math.abs(C.hexToHsl(a).h - C.hexToHsl(b).h) % 360;
    return d > 180 ? 360 - d : d;
  }

  // 1 = easy, 0.6–0.9 = works with a rule, 0.2 = hard.
  function pairScore(a, b) {
    if (a.neutral || b.neutral || C.isAchromatic(a.hex) || C.isAchromatic(b.hex)) return 1;
    var d = hueGap(a.hex, b.hex);
    if (d <= 35) return 0.8;
    if (d >= 150) return 0.9;
    if (d >= 110 && d <= 130) return 0.6;
    return 0.2;
  }

  // owned: { slug: count }
  function analyse(owned) {
    var items = Object.keys(owned || {}).map(function (s) { var c = C.bySlug(s); return c && +owned[s] > 0 ? { slug: s, name: c.name, hex: c.hex, neutral: c.neutral, count: +owned[s] } : null; })
      .filter(Boolean);
    var total = items.reduce(function (s, i) { return s + i.count; }, 0);
    if (!total) return null;
    var neutral = items.filter(function (i) { return i.neutral; }).reduce(function (s, i) { return s + i.count; }, 0);

    var pairs = 0, easy = 0, hard = [];
    for (var i = 0; i < items.length; i++) for (var j = i + 1; j < items.length; j++) {
      var sc = pairScore(items[i], items[j]), w = items[i].count * items[j].count;
      pairs += w; if (sc >= 0.6) easy += w;
      if (sc < 0.6) hard.push([items[i].name, items[j].name]);
    }
    // Pieces of the same color always combine with each other too.
    items.forEach(function (it) { var w = it.count * (it.count - 1) / 2; pairs += w; easy += w; });

    var neutralShare = Math.round(neutral / total * 100);
    var wantNeutral = neutralShare < 60;
    var suggestions = C.NAMED.filter(function (c) { return !owned[c.slug] && c.neutral === wantNeutral; }).map(function (c) {
      var score = items.reduce(function (s, it) { return s + it.count * pairScore(c, it); }, 0) / total;
      return { slug: c.slug, name: c.name, hex: c.hex, neutral: c.neutral, score: Math.round(score * 100) };
    }).sort(function (a, b) { return b.score - a.score || a.name.localeCompare(b.name); }).slice(0, 3);

    return {
      items: items, total: total, neutralShare: neutralShare, colorShare: 100 - neutralShare,
      easyPairs: pairs ? Math.round(easy / pairs * 100) : 100, hardPairs: hard.slice(0, 5), suggestions: suggestions,
      balance: neutralShare >= 60 ? 'strong' : neutralShare >= 40 ? 'balanced' : 'color-heavy'
    };
  }

  return { FACTS: FACTS, pairScore: pairScore, hueGap: hueGap, analyse: analyse };
});
