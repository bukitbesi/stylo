/*! SimplyStylo body shape engine. (c) SimplyStylo. All rights reserved. */
// Female Figure Identification Technique (FFIT for Apparel): Simmons, Istook & Devarajan (2004), with the
// mathematical rules published by Lee, Istook, Nam & Park (2007). Rules are tested in the published order;
// the first match wins. Measurements are compared in inches.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSBody = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-02', method: 'FFIT for Apparel (Simmons, Istook & Devarajan 2004; formulas: Lee, Istook, Nam & Park 2007)' };

  var SHAPES = {
    hourglass: { name: 'Hourglass', rule: 'Bust and hips within about 1 in of each other, with a clearly defined waist (bust − waist ≥ 9 in or hips − waist ≥ 10 in).',
      look: 'Balanced bust and hips with a defined waist.',
      tips: ['Show the waist: wrap dresses, belted coats and high-rise trousers.', 'Choose fabrics that follow the body rather than stiff boxy cuts.', 'Fit-and-flare and pencil skirts both work; follow the curve.'] },
    'bottom-hourglass': { name: 'Bottom Hourglass', rule: 'Hips 3.6–10 in larger than the bust, a defined waist (hips − waist ≥ 9 in) and a high hip less than 1.193 × the waist.',
      look: 'Hourglass curves with fuller hips than bust.',
      tips: ['Define the waist and add a little structure at the shoulders.', 'Brighter colors and details on top, darker plainer bottoms.', 'A-line and fit-and-flare skirts skim the hips.'] },
    'top-hourglass': { name: 'Top Hourglass', rule: 'Bust 1–10 in larger than the hips with a defined waist (bust − waist ≥ 9 in).',
      look: 'Hourglass curves with a fuller bust than hips.',
      tips: ['V-necks and wrap tops balance the bust.', 'Belt at the natural waist.', 'Add volume below: A-line skirts, wide-leg trousers.'] },
    spoon: { name: 'Spoon', rule: 'Hips more than 2 in larger than the bust, hips − waist ≥ 7 in, and a high hip at least 1.193 × the waist (a "shelf" at the high hip).',
      look: 'Fuller hips with a pronounced high hip.',
      tips: ['Mid-rise to high-rise bottoms that sit above the high hip.', 'Structured shoulders and statement necklines.', 'Straight or bootcut legs and A-line skirts.'] },
    triangle: { name: 'Triangle (Pear)', rule: 'Hips at least 3.6 in larger than the bust, with less waist definition (hips − waist < 9 in).',
      look: 'Hips wider than bust, softer waist.',
      tips: ['Draw the eye up: boat necks, puff sleeves, details at the shoulder.', 'Darker, simple bottoms and lighter tops.', 'A-line skirts and straight or wide-leg trousers.'] },
    'inverted-triangle': { name: 'Inverted Triangle', rule: 'Bust at least 3.6 in larger than the hips, with less waist definition (bust − waist < 9 in).',
      look: 'Shoulders and bust wider than hips.',
      tips: ['Simple tops, V-necks and raglan sleeves.', 'Add volume below: wide-leg trousers, pleated or A-line skirts.', 'Avoid shoulder pads and heavy details at the shoulder.'] },
    rectangle: { name: 'Rectangle', rule: 'Bust and hips within 3.6 in of each other, with little waist definition (bust − waist < 9 in and hips − waist < 10 in).',
      look: 'Bust, waist and hips similar in width.',
      tips: ['Create shape with belts, peplums and wrap styles.', 'Straight-cut tailoring and shift dresses look sharp.', 'Layering and texture add dimension.'] },
    between: { name: 'Between Shapes', rule: 'Your measurements do not meet any single FFIT rule; this is common near a boundary.',
      look: 'Close to the edge between two shapes.',
      tips: ['Read the two nearest shapes below and choose the advice that fits you.', 'Re-measure: a 1 in difference can change the result.', 'Fit and proportion matter more than the label.'] }
  };

  var IN = 2.54;

  // Published FFIT order. Each test receives the four measurements in inches.
  var RULES = [
    ['hourglass', function (b, w, hh, h) { return (b - h) <= 1 && (h - b) < 3.6 && ((b - w) >= 9 || (h - w) >= 10); }],
    ['bottom-hourglass', function (b, w, hh, h) { return (h - b) >= 3.6 && (h - b) < 10 && (h - w) >= 9 && (hh / w) < 1.193; }],
    ['top-hourglass', function (b, w, hh, h) { return (b - h) > 1 && (b - h) < 10 && (b - w) >= 9; }],
    ['spoon', function (b, w, hh, h) { return (h - b) > 2 && (h - w) >= 7 && (hh / w) >= 1.193; }],
    ['triangle', function (b, w, hh, h) { return (h - b) >= 3.6 && (h - w) < 9; }],
    ['inverted-triangle', function (b, w, hh, h) { return (b - h) >= 3.6 && (b - w) < 9; }],
    ['rectangle', function (b, w, hh, h) { return (h - b) < 3.6 && (b - h) < 3.6 && (b - w) < 9 && (h - w) < 10; }]
  ];

  // m: { bust, waist, highHip, hips, unit: 'in' | 'cm' }
  function classify(m) {
    var f = m && m.unit === 'cm' ? 1 / IN : 1;
    var b = +m.bust * f, w = +m.waist * f, hh = +m.highHip * f, h = +m.hips * f;
    if (![b, w, hh, h].every(function (x) { return isFinite(x) && x >= 15 && x <= 80; })) return null;
    var id = 'between';
    for (var i = 0; i < RULES.length; i++) if (RULES[i][1](b, w, hh, h)) { id = RULES[i][0]; break; }
    var r1 = function (x) { return Math.round(x * 10) / 10; };
    return {
      id: id, shape: SHAPES[id],
      inches: { bust: r1(b), waist: r1(w), highHip: r1(hh), hips: r1(h) },
      diffs: { bustHips: r1(b - h), bustWaist: r1(b - w), hipsWaist: r1(h - w), highHipWaist: Math.round(hh / w * 1000) / 1000 },
      waistHip: Math.round(w / h * 100) / 100
    };
  }

  return { FACTS: FACTS, SHAPES: SHAPES, RULES: RULES, classify: classify };
});
