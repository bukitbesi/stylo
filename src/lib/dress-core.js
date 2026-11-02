/*! SimplyStylo dress designer engine. (c) SimplyStylo. All rights reserved. */
// Draws a dress on a dress form as SVG from a set of design choices, and gives styling notes for the design.
// Pure string output so the same drawing is rendered at build time, in the browser and in the PNG download.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSDressDesign = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-02' };

  // Body shape ids match the body shape calculator (FFIT shapes).
  var OPTIONS = {
    neckline: {
      crew: { name: 'Crew neck', tip: 'Classic and covered; good for layering necklaces.', suits: ['inverted-triangle', 'rectangle'] },
      v: { name: 'V-neck', tip: 'Lengthens the neck and balances a fuller bust.', suits: ['top-hourglass', 'inverted-triangle', 'hourglass'] },
      scoop: { name: 'Scoop neck', tip: 'Soft and open; flattering on most shapes.', suits: ['hourglass', 'rectangle', 'triangle'] },
      square: { name: 'Square neck', tip: 'Frames the collarbone and adds structure to the top.', suits: ['triangle', 'spoon', 'rectangle'] },
      sweetheart: { name: 'Sweetheart (strapless)', tip: 'Romantic and formal; draws the eye up.', suits: ['triangle', 'spoon', 'hourglass'] },
      halter: { name: 'Halter', tip: 'Shows the shoulders; best when shoulders are narrower than hips.', suits: ['triangle', 'spoon'] },
      off: { name: 'Off-shoulder', tip: 'Widens the shoulder line to balance fuller hips.', suits: ['triangle', 'spoon', 'bottom-hourglass'] },
      boat: { name: 'Boat neck', tip: 'Wide and elegant; broadens narrow shoulders.', suits: ['triangle', 'spoon', 'rectangle'] }
    },
    sleeve: {
      none: { name: 'Sleeveless', tip: 'Clean and summery.', suits: [] },
      cap: { name: 'Cap sleeves', tip: 'A little coverage without bulk.', suits: ['triangle'] },
      short: { name: 'Short sleeves', tip: 'Easy everyday coverage.', suits: ['rectangle'] },
      puff: { name: 'Puff sleeves', tip: 'Adds volume up top to balance the hips.', suits: ['triangle', 'spoon'] },
      three: { name: 'Three-quarter sleeves', tip: 'Shows the wrist; works across seasons.', suits: ['hourglass', 'inverted-triangle'] },
      long: { name: 'Long sleeves', tip: 'Covered and elegant; good for cooler months.', suits: ['rectangle', 'hourglass'] },
      bell: { name: 'Bell sleeves', tip: 'Boho movement at the wrist.', suits: ['triangle'] }
    },
    waist: {
      natural: { name: 'Natural waist', tip: 'Defines the waist; the most versatile seam.', suits: ['hourglass', 'bottom-hourglass', 'top-hourglass'] },
      empire: { name: 'Empire waist', tip: 'Seam under the bust; skims the tummy and hips.', suits: ['rectangle', 'triangle', 'inverted-triangle'] },
      drop: { name: 'Drop waist', tip: 'Relaxed 1920s line; long torso look.', suits: ['rectangle', 'inverted-triangle'] }
    },
    skirt: {
      aline: { name: 'A-line', tip: 'Skims the hips; flattering on almost everyone.', suits: ['triangle', 'spoon', 'bottom-hourglass', 'rectangle'] },
      flare: { name: 'Fit-and-flare', tip: 'Full skirt that creates a waist.', suits: ['rectangle', 'hourglass', 'inverted-triangle'] },
      pencil: { name: 'Pencil', tip: 'Follows the curves; sharp and polished.', suits: ['hourglass', 'top-hourglass'] },
      column: { name: 'Column / slip', tip: 'Straight and minimal; long lean line.', suits: ['rectangle', 'inverted-triangle'] },
      tiered: { name: 'Tiered', tip: 'Playful volume at the hem.', suits: ['inverted-triangle', 'rectangle'] },
      mermaid: { name: 'Mermaid', tip: 'Fitted to the knee, then flared; dramatic and formal.', suits: ['hourglass', 'bottom-hourglass'] },
      pleated: { name: 'Pleated', tip: 'Movement and texture; skims the hips.', suits: ['inverted-triangle', 'rectangle', 'top-hourglass'] }
    },
    length: {
      mini: { name: 'Mini', hem: 196 }, knee: { name: 'Knee length', hem: 236 }, midi: { name: 'Midi', hem: 272 }, maxi: { name: 'Maxi / floor length', hem: 318 }
    },
    pattern: { solid: { name: 'Solid' }, dots: { name: 'Polka dots' }, stripes: { name: 'Stripes' }, gingham: { name: 'Gingham' }, floral: { name: 'Floral' }, photo: { name: 'My photo / fabric' } }
  };

  var SHAPE_NAMES = { hourglass: 'Hourglass', 'bottom-hourglass': 'Bottom Hourglass', 'top-hourglass': 'Top Hourglass', spoon: 'Spoon',
    triangle: 'Triangle (Pear)', 'inverted-triangle': 'Inverted Triangle', rectangle: 'Rectangle' };

  var DEFAULT = { n: 'v', s: 'short', w: 'natural', k: 'flare', l: 'midi', p: 'dots', c: '1F2A44', a: 'FAFAF7', b: '' };

  var PRESETS = [
    { id: 'wedding-guest', name: 'Wedding Guest Midi', d: { n: 'v', s: 'three', w: 'natural', k: 'aline', l: 'midi', p: 'floral', c: '9CAF94', a: 'FAFAF7', b: '' } },
    { id: 'bridal', name: 'Bridal Gown', d: { n: 'sweetheart', s: 'none', w: 'natural', k: 'mermaid', l: 'maxi', p: 'solid', c: 'FAFAF7', a: 'FAFAF7', b: '' } },
    { id: 'prom', name: 'Prom Ball Gown', d: { n: 'off', s: 'none', w: 'natural', k: 'flare', l: 'maxi', p: 'solid', c: '6D1F2E', a: 'C9A44C', b: 'C9A44C' } },
    { id: 'office', name: 'Office Sheath', d: { n: 'boat', s: 'three', w: 'natural', k: 'pencil', l: 'knee', p: 'solid', c: '3C3F44', a: '1B1B1B', b: '1B1B1B' } },
    { id: 'swing', name: '1950s Swing Dress', d: { n: 'square', s: 'cap', w: 'natural', k: 'flare', l: 'knee', p: 'dots', c: 'C1272D', a: 'FAFAF7', b: 'FAFAF7' } },
    { id: 'boho', name: 'Boho Maxi', d: { n: 'v', s: 'bell', w: 'empire', k: 'tiered', l: 'maxi', p: 'floral', c: 'B98A57', a: 'F3EDDF', b: '' } }
  ];

  function hexOk(h) { return /^[0-9A-F]{6}$/i.test(h || '') ? h.toUpperCase() : null; }

  function norm(d) {
    d = d || {};
    var o = {};
    ['n', 's', 'w', 'k', 'l', 'p'].forEach(function (k) {
      var group = { n: 'neckline', s: 'sleeve', w: 'waist', k: 'skirt', l: 'length', p: 'pattern' }[k];
      o[k] = OPTIONS[group][d[k]] ? d[k] : DEFAULT[k];
    });
    o.c = hexOk(d.c) || DEFAULT.c;
    o.a = hexOk(d.a) || DEFAULT.a;
    o.b = hexOk(d.b) || '';
    if (o.n === 'halter' || o.n === 'sweetheart') o.s = o.s === 'none' ? 'none' : o.s; // allowed; sleeves drawn as straps-free
    return o;
  }

  function shade(hex, f) {
    var n = parseInt(hex, 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var m = function (v) { return Math.max(0, Math.min(255, Math.round(v * f))); };
    return ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1).toUpperCase();
  }
  function lum(hex) { var n = parseInt(hex, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }

  // Fabric fill: a <pattern> definition per design, ids made unique per drawing.
  function fabric(d, id, photo) {
    var c = '#' + d.c, a = '#' + d.a, p = d.p;
    if (p === 'solid' || (p === 'photo' && !photo)) return { defs: '', fill: c };
    var body;
    if (p === 'dots') body = '<rect width="14" height="14" fill="' + c + '"/><circle cx="4" cy="4" r="2.3" fill="' + a + '"/><circle cx="11" cy="11" r="2.3" fill="' + a + '"/>';
    else if (p === 'stripes') body = '<rect width="12" height="12" fill="' + c + '"/><rect y="0" width="12" height="4.5" fill="' + a + '"/>';
    else if (p === 'gingham') body = '<rect width="12" height="12" fill="' + c + '"/><rect width="6" height="12" fill="' + a + '" opacity=".45"/><rect width="12" height="6" fill="' + a + '" opacity=".45"/>';
    else if (p === 'floral') body = '<rect width="24" height="24" fill="' + c + '"/><g fill="' + a + '"><circle cx="8" cy="5" r="2.2"/><circle cx="11" cy="8" r="2.2"/><circle cx="8" cy="11" r="2.2"/><circle cx="5" cy="8" r="2.2"/></g>' +
      '<circle cx="8" cy="8" r="1.6" fill="#' + shade(d.a, 0.75) + '"/><ellipse cx="19" cy="18" rx="3.2" ry="1.4" fill="' + a + '" opacity=".7" transform="rotate(-35 19 18)"/>';
    else body = '<image href="' + photo + '" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>';
    var size = p === 'dots' ? 14 : p === 'floral' ? 24 : p === 'photo' ? 64 : 12;
    return { defs: '<pattern id="' + id + '" width="' + size + '" height="' + size + '" patternUnits="userSpaceOnUse">' + body + '</pattern>', fill: 'url(#' + id + ')' };
  }

  function geometry(d) {
    var wy = d.w === 'empire' ? 100 : d.w === 'drop' ? 152 : 128;
    var wl = d.w === 'empire' ? 73 : d.w === 'drop' ? 72 : 79;
    return { wy: wy, wl: wl, wr: 200 - wl, hem: OPTIONS.length[d.l].hem };
  }

  // Bodice outline: top edge depends on the neckline; sides run down to the waist seam.
  function bodice(d, g) {
    var top = {
      crew: [[64, 58], [136, 58], 'L112 55 Q100 72 88 55'], v: [[64, 58], [136, 58], 'L112 55 L100 100 L88 55'],
      scoop: [[64, 58], [136, 58], 'L114 56 Q100 92 86 56'], square: [[64, 58], [136, 58], 'L114 56 L114 80 L86 80 L86 56'],
      boat: [[62, 58], [138, 58], 'L120 56 Q100 63 80 56'], sweetheart: [[70, 80], [130, 80], 'Q118 64 100 82 Q82 64 70 80'],
      off: [[56, 72], [144, 72], 'Q100 80 56 72'], halter: [[71, 84], [129, 84], 'L106 40 L94 40']
    }[d.n];
    var L = top[0], R = top[1];
    var side = [[70, 84]];
    if (g.wy > 100) side.push([73, 104]);
    if (g.wy > 128) side.push([79, 128]);
    side.push([g.wl, g.wy]);
    var left = side.filter(function (p) { return p[1] > L[1]; });
    var pts = [L].concat(left);
    var right = left.slice().reverse().map(function (p) { return [200 - p[0], p[1]]; });
    return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' L' + right.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') +
      ' L' + R[0] + ' ' + R[1] + ' ' + top[2] + ' Z';
  }

  function skirt(d, g) {
    var H = g.hem, wy = g.wy, wh = 100 - g.wl, drop = H - wy, path, lines = '';
    if (d.k === 'pencil') path = 'M' + (100 - wh) + ' ' + wy + ' L' + 66 + ' ' + Math.max(wy + 12, 166) + ' L70 ' + H + ' L130 ' + H + ' L134 ' + Math.max(wy + 12, 166) + ' L' + (100 + wh) + ' ' + wy + ' Z';
    else if (d.k === 'column') {
      var y2 = Math.max(wy + 14, 168);
      path = 'M' + (100 - wh) + ' ' + wy + ' L64 ' + y2 + ' L63 ' + H + ' Q100 ' + (H + 3) + ' 137 ' + H + ' L136 ' + y2 + ' L' + (100 + wh) + ' ' + wy + ' Z';
    }
    else if (d.k === 'mermaid') {
      var knee = H - drop * 0.3;
      path = 'M' + (100 - wh) + ' ' + wy + ' L66 ' + Math.max(wy + 12, 166) + ' L70 ' + knee + ' Q58 ' + (H - 10) + ' 44 ' + H + ' Q100 ' + (H + 8) + ' 156 ' + H + ' Q142 ' + (H - 10) + ' 130 ' + knee + ' L134 ' + Math.max(wy + 12, 166) + ' L' + (100 + wh) + ' ' + wy + ' Z';
    } else {
      var spread = d.k === 'flare' ? 0.48 : d.k === 'tiered' ? 0.34 : 0.28;
      var hw = Math.min(92, wh + 6 + drop * spread);
      path = 'M' + (100 - wh) + ' ' + wy + ' Q' + (100 - wh - 6) + ' ' + (wy + 20) + ' ' + (100 - hw) + ' ' + H + ' Q100 ' + (H + (d.k === 'flare' ? 10 : 6)) + ' ' + (100 + hw) + ' ' + H +
        ' Q' + (100 + wh + 6) + ' ' + (wy + 20) + ' ' + (100 + wh) + ' ' + wy + ' Z';
      if (d.k === 'tiered') for (var t = 1; t <= 2; t++) {
        var y = wy + drop * t / 3, w2 = wh + 6 + drop * spread * t / 3;
        lines += '<path d="M' + (100 - w2 - 1) + ' ' + y + ' Q100 ' + (y + 5) + ' ' + (100 + w2 + 1) + ' ' + y + '" class="ln"/>';
      }
      if (d.k === 'pleated' || d.k === 'flare') {
        var n = d.k === 'pleated' ? 7 : 4;
        for (var i = 1; i < n; i++) {
          var fx = -1 + 2 * i / n;
          lines += '<path d="M' + (100 + fx * wh * 0.8).toFixed(1) + ' ' + (wy + 4) + ' L' + (100 + fx * hw * 0.92).toFixed(1) + ' ' + (H - 2) + '" class="ln"/>';
        }
      }
    }
    return { path: path, lines: lines };
  }

  var SLEEVES = {
    cap: 'M64 58 Q53 62 54 76 L70 84 Z', short: 'M64 58 L50 66 L45 98 L67 97 L70 84 Z', puff: 'M64 58 Q38 54 43 86 Q47 102 67 96 L70 84 Z',
    three: 'M64 58 L50 66 L40 160 L56 162 L70 84 Z', long: 'M64 58 L50 66 L36 200 L52 202 L70 84 Z',
    bell: 'M64 58 L50 66 L43 140 L28 180 L62 182 L58 140 L70 84 Z'
  };

  // Full SVG. opts: { id: unique id prefix, photo: data URL for the photo pattern, credit: bool (PNG export) }
  function svg(design, opts) {
    var d = norm(design), o = opts || {}, id = (o.id || 'dd') + '-fab';
    var g = geometry(d), f = fabric(d, id, o.photo), line = '#' + (lum(d.c) < 0.35 ? shade(d.c, 2.2) : shade(d.c, 0.6));
    var sk = skirt(d, g), sleeves = '';
    if (d.s !== 'none' && d.n !== 'halter' && d.n !== 'sweetheart') {
      var shift = d.n === 'off' ? ' transform="translate(-8 14)"' : '';
      var mirror = d.n === 'off' ? ' transform="translate(208 14) scale(-1 1)"' : ' transform="translate(200 0) scale(-1 1)"';
      sleeves = '<path d="' + SLEEVES[d.s] + '" fill="' + f.fill + '"' + shift + '/><path d="' + SLEEVES[d.s] + '" fill="' + f.fill + '"' + mirror + '/>';
    }
    var belt = d.b ? '<rect x="' + (g.wl - 1) + '" y="' + (g.wy - 4) + '" width="' + (g.wr - g.wl + 2) + '" height="8" rx="2" fill="#' + d.b + '" stroke="' + line + '" stroke-width="1"/>' : '';
    var credit = o.credit ? '<text x="100" y="337" text-anchor="middle" font-family="Georgia,serif" font-size="8" fill="#6B665D">Designed on SimplyStylo.com</text>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="' + (o.width || 200) + '" height="' + Math.round((o.width || 200) * 1.7) + '"' +
      (o.label ? ' role="img" aria-label="' + o.label.replace(/"/g, '') + '"' : ' aria-hidden="true"') + '>' +
      '<defs>' + f.defs + '<style>.ln{fill:none;stroke:' + line + ';stroke-width:1;opacity:.6}</style></defs>' +
      (o.credit ? '<rect width="200" height="340" fill="#F5F1E9"/>' : '') +
      '<ellipse cx="100" cy="331" rx="34" ry="5" fill="#CFC6B6"/><rect x="98" y="150" width="4" height="181" fill="#B8A58D"/>' +
      '<ellipse cx="100" cy="24" rx="9" ry="5" fill="#B8A58D"/><rect x="92" y="26" width="16" height="30" rx="3" fill="#E4DACB"/>' +
      '<path d="M64 58 L136 58 L130 84 L122 128 L134 166 L66 166 L78 128 L70 84 Z" fill="#E4DACB"/>' +
      '<g stroke="' + line + '" stroke-width="1.4" stroke-linejoin="round">' + sleeves +
      '<path d="' + sk.path + '" fill="' + f.fill + '"/><path d="' + bodice(d, g) + '" fill="' + f.fill + '"/></g>' +
      (sk.lines ? '<clipPath id="' + id + '-clip"><path d="' + sk.path + '"/></clipPath><g clip-path="url(#' + id + '-clip)">' + sk.lines + '</g>' : '') +
      '<path d="M' + g.wl + ' ' + g.wy + ' L' + g.wr + ' ' + g.wy + '" class="ln"/>' + belt + credit + '</svg>';
  }

  function describe(design) {
    var d = norm(design), O = OPTIONS;
    return O.length[d.l].name + ' ' + O.skirt[d.k].name.toLowerCase() + ' dress with a ' + O.neckline[d.n].name.toLowerCase() + ', ' +
      (d.n === 'halter' || d.n === 'sweetheart' ? 'no sleeves' : O.sleeve[d.s].name.toLowerCase()) + ' and a ' + O.waist[d.w].name.toLowerCase();
  }

  // Styling notes: body shapes the design suits most often, and the dress code it fits best.
  function advise(design) {
    var d = norm(design), O = OPTIONS, score = {};
    var parts = [O.neckline[d.n], O.waist[d.w], O.skirt[d.k]];
    if (!(d.n === 'halter' || d.n === 'sweetheart')) parts.push(O.sleeve[d.s]);
    parts.forEach(function (p) { p.suits.forEach(function (s) { score[s] = (score[s] || 0) + 1; }); });
    var shapes = Object.keys(score).sort(function (a, b) { return score[b] - score[a] || a.localeCompare(b); }).slice(0, 3)
      .map(function (id) { return { id: id, name: SHAPE_NAMES[id] }; });
    var formal = (d.l === 'maxi' ? 3 : d.l === 'midi' ? 2 : d.l === 'knee' ? 1 : 0) + (['sweetheart', 'off'].indexOf(d.n) >= 0 ? 2 : 0) +
      (d.k === 'mermaid' ? 2 : d.k === 'pencil' || d.k === 'column' ? 1 : 0) + (d.p === 'solid' ? 1 : 0);
    var code = formal >= 6 ? 'black-tie' : formal >= 4 ? 'cocktail' : d.k === 'pencil' && d.l === 'knee' ? 'business-formal' : formal >= 2 ? 'smart-casual' : 'casual';
    var codeName = { 'black-tie': 'Black tie and formal events', cocktail: 'Cocktail parties and weddings', 'business-formal': 'Office and business', 'smart-casual': 'Smart casual and day events', casual: 'Casual and weekend' }[code];
    return { shapes: shapes, code: code, codeName: codeName, tips: parts.map(function (p) { return p.tip; }) };
  }

  return { FACTS: FACTS, OPTIONS: OPTIONS, DEFAULT: DEFAULT, PRESETS: PRESETS, SHAPE_NAMES: SHAPE_NAMES, norm: norm, svg: svg, describe: describe, advise: advise };
});
