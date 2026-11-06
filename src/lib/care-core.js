/*! SimplyStylo care label engine. (c) SimplyStylo. All rights reserved. */
// Decodes the five care symbols of ISO 3758 / GINETEX in their prescribed order: washing, bleaching, drying,
// ironing, professional textile care. Washing follows ISO 3758 Table 1 (temperature + normal / mild / very mild
// process); bars under a symbol mean a milder process; a cross means the treatment is not permitted.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSCare = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-06',
    order: 'Symbols appear in the order washing, bleaching, drying, ironing, professional textile care',
    milder: 'A milder treatment than the one shown is always acceptable',
    wash: 'The number in the tub is the maximum washing temperature in °C; one bar = mild process, two bars = very mild process',
    iron: 'Ironing dots: one = 110 °C, two = 150 °C, three = 200 °C maximum sole-plate temperature',
    us: 'US labels (ASTM D5489) can show washing temperature as dots instead of numbers: 1 dot 30 °C, 2 dots 40 °C, 3 dots 50 °C, 4 dots 60 °C.',
    natural: 'Natural drying symbols (line, drip, flat and shade drying) are drawn differently on ISO and US labels, so they are described here rather than decoded.',
    trademark: 'The care symbols are trademarks of GINETEX, shown here to explain care labels.'
  };

  // [code, label, plain-English instruction, symbol spec]
  var WASH = [
    ['95', '95 °C, normal', 'Machine wash at up to 95 °C on a normal (cotton) cycle. Typical for white cotton and linen.', { t: 95, bars: 0 }],
    ['70', '70 °C, normal', 'Machine wash at up to 70 °C on a normal cycle.', { t: 70, bars: 0 }],
    ['60', '60 °C, normal', 'Machine wash at up to 60 °C on a normal cycle.', { t: 60, bars: 0 }],
    ['60m', '60 °C, mild', 'Machine wash at up to 60 °C on a mild (easy-care or synthetics) cycle with reduced agitation.', { t: 60, bars: 1 }],
    ['50', '50 °C, normal', 'Machine wash at up to 50 °C on a normal cycle.', { t: 50, bars: 0 }],
    ['50m', '50 °C, mild', 'Machine wash at up to 50 °C on a mild (easy-care or synthetics) cycle.', { t: 50, bars: 1 }],
    ['40', '40 °C, normal', 'Machine wash at up to 40 °C on a normal cycle.', { t: 40, bars: 0 }],
    ['40m', '40 °C, mild', 'Machine wash at up to 40 °C on a mild (easy-care or synthetics) cycle.', { t: 40, bars: 1 }],
    ['40vm', '40 °C, very mild', 'Machine wash at up to 40 °C on a very mild (wool or delicates) cycle with minimal agitation.', { t: 40, bars: 2 }],
    ['30', '30 °C, normal', 'Machine wash at up to 30 °C on a normal cycle.', { t: 30, bars: 0 }],
    ['30m', '30 °C, mild', 'Machine wash at up to 30 °C on a mild (easy-care or synthetics) cycle.', { t: 30, bars: 1 }],
    ['30vm', '30 °C, very mild', 'Machine wash at up to 30 °C on a very mild (wool or delicates) cycle.', { t: 30, bars: 2 }],
    ['hand', 'Hand wash', 'Wash by hand only, at no more than 40 °C. Do not rub or wring.', { hand: true }],
    ['no', 'Do not wash', 'Do not wash at home. Check the professional care symbol.', { cross: true }]
  ];
  var BLEACH = [
    ['any', 'Any bleach', 'Any bleach may be used, including chlorine.', {}],
    ['oxygen', 'Non-chlorine only', 'Use only oxygen (non-chlorine) bleach. Chlorine bleach is not allowed.', { lines: true }],
    ['no', 'Do not bleach', 'Do not use any bleach.', { cross: true }]
  ];
  var DRY = [
    ['low', 'Tumble dry, low heat', 'Tumble dry at a reduced (low) temperature.', { dots: 1 }],
    ['normal', 'Tumble dry, normal', 'Tumble dry at a normal temperature.', { dots: 2 }],
    ['no', 'Do not tumble dry', 'Do not tumble dry. Dry naturally (on a line, hanger or flat) as the label or fabric suggests.', { cross: true }]
  ];
  var IRON = [
    ['low', 'Iron, low (110 °C)', 'Iron at a maximum sole-plate temperature of 110 °C (silk, acrylic, nylon). Steam may damage the fabric.', { dots: 1 }],
    ['medium', 'Iron, medium (150 °C)', 'Iron at a maximum sole-plate temperature of 150 °C (wool, polyester, viscose).', { dots: 2 }],
    ['high', 'Iron, high (200 °C)', 'Iron at a maximum sole-plate temperature of 200 °C (cotton, linen).', { dots: 3 }],
    ['no', 'Do not iron', 'Do not iron or steam.', { cross: true }]
  ];
  var PRO = [
    ['P', 'Dry clean (P)', 'Professional dry cleaning in tetrachloroethylene (perc) or hydrocarbon solvents, normal process.', { letter: 'P', bars: 0 }],
    ['P1', 'Dry clean (P), mild', 'Professional dry cleaning in tetrachloroethylene or hydrocarbon solvents, mild process.', { letter: 'P', bars: 1 }],
    ['F', 'Dry clean (F)', 'Professional dry cleaning in hydrocarbon solvents only, normal process.', { letter: 'F', bars: 0 }],
    ['F1', 'Dry clean (F), mild', 'Professional dry cleaning in hydrocarbon solvents only, mild process.', { letter: 'F', bars: 1 }],
    ['W', 'Wet clean (W)', 'Professional wet cleaning, normal process.', { letter: 'W', bars: 0 }],
    ['W1', 'Wet clean (W), mild', 'Professional wet cleaning, mild process.', { letter: 'W', bars: 1 }],
    ['W2', 'Wet clean (W), very mild', 'Professional wet cleaning, very mild process.', { letter: 'W', bars: 2 }],
    ['no', 'Do not dry clean', 'Do not dry clean.', { cross: true }]
  ];
  var GROUPS = [
    { key: 'w', name: 'Washing', shape: 'tub', list: WASH },
    { key: 'b', name: 'Bleaching', shape: 'triangle', list: BLEACH },
    { key: 't', name: 'Tumble drying', shape: 'tumble', list: DRY },
    { key: 'i', name: 'Ironing', shape: 'iron', list: IRON },
    { key: 'p', name: 'Professional care', shape: 'circle', list: PRO }
  ];

  function find(group, code) { return group.list.filter(function (o) { return o[0] === code; })[0] || null; }

  // state: { w, b, t, i, p } with '' meaning "symbol not on the label".
  function decode(state) {
    return GROUPS.map(function (g) {
      var o = find(g, state[g.key]);
      return o ? { group: g.name, key: g.key, shape: g.shape, code: o[0], label: o[1], text: o[2], spec: o[3] } : null;
    }).filter(Boolean);
  }

  // Inline SVG for one symbol. 36 × 36 viewBox; stroke uses currentColor so it prints and works in dark mode.
  function svg(shape, spec, size, label) {
    var s = spec || {}, px = size || 44, a = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    var bars = function (n, y) { var o = ''; for (var k = 0; k < (n || 0); k++) o += '<path d="M7 ' + (y + k * 3.5) + 'H29" ' + a + '/>'; return o; };
    var dots = function (n, cx, cy, gap) { var o = ''; for (var k = 0; k < n; k++) o += '<circle cx="' + (cx + (k - (n - 1) / 2) * gap) + '" cy="' + cy + '" r="1.6" fill="currentColor"/>'; return o; };
    var body = '';
    if (shape === 'tub') {
      body = '<path d="M4 9 7.5 24h21L32 9" ' + a + '/><path d="M4 9q3-2.6 5.6 0t5.6 0 5.6 0 5.6 0 5.6 0" ' + a + '/>';
      if (s.hand) body += '<path d="M13 22v-5.5q0-1.3 1.2-1.3t1.2 1.3V14q0-1.3 1.2-1.3t1.2 1.3v2.3-1.5q0-1.2 1.2-1.2t1.2 1.2V22q0 .6-.6.6H13.6q-.6 0-.6-.6z" ' + a + ' stroke-width="1.4"/>';
      else if (s.t) body += '<text x="18" y="21" text-anchor="middle" font-size="9.5" font-weight="700" font-family="system-ui,sans-serif" fill="currentColor">' + s.t + '</text>';
      body += bars(s.bars, 28);
    } else if (shape === 'triangle') {
      body = '<path d="M18 5 32 29H4z" ' + a + '/>';
      if (s.lines) body += '<path d="M13.5 26.5 19.5 16M18.5 26.5 24 17" ' + a + ' stroke-width="1.6"/>';
    } else if (shape === 'tumble') {
      body = '<rect x="5" y="5" width="26" height="26" rx="1" ' + a + '/><circle cx="18" cy="18" r="10" ' + a + '/>' + dots(s.dots || 0, 18, 18, 5.5);
    } else if (shape === 'iron') {
      body = '<path d="M4 27h26q0-9-4-12.5T16 11H11l-1.5 4H24" ' + a + '/><path d="M4 27q.5-8 8-12" ' + a + '/>' + dots(s.dots || 0, 19, 21.5, 4.5);
    } else if (shape === 'circle') {
      body = '<circle cx="18" cy="16" r="11" ' + a + '/>' + (s.letter ? '<text x="18" y="20.5" text-anchor="middle" font-size="12" font-weight="700" font-family="system-ui,sans-serif" fill="currentColor">' + s.letter + '</text>' : '') + bars(s.bars, 30);
    }
    if (s.cross) body += '<path d="M6 6 30 30M30 6 6 30" ' + a + ' stroke-width="2.2"/>';
    return '<svg class="care-sym" width="' + px + '" height="' + px + '" viewBox="0 0 36 36" ' + (label ? 'role="img" aria-label="' + String(label).replace(/"/g, '') + '"' : 'aria-hidden="true"') + '>' + body + '</svg>';
  }

  return { FACTS: FACTS, GROUPS: GROUPS, WASH: WASH, BLEACH: BLEACH, DRY: DRY, IRON: IRON, PRO: PRO, decode: decode, find: find, svg: svg };
});
