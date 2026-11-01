/*! SimplyStylo outfit generator engine. (c) SimplyStylo. All rights reserved. */
// Rule-based outfits: the occasion sets which garments are allowed, the temperature band sets fabrics and layers,
// and a seeded random pick makes every result reproducible from its URL. Colors follow a simple rule: the chosen
// color goes on one statement piece, neutrals that suit it go everywhere else.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSOutfit = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-01' };

  var OCCASIONS = {
    casual: 'Casual day out', smart: 'Smart casual', business: 'Office / business', formal: 'Formal event', date: 'Date night'
  };

  // Lower bound (°C) of each band, warmest first.
  var BANDS = [
    { id: 'hot', min: 25, label: 'Hot (25 °C / 77 °F and above)', tip: 'Choose breathable linen, cotton or lightweight blends and skip layers.' },
    { id: 'warm', min: 18, label: 'Warm (18–24 °C / 64–76 °F)', tip: 'Light fabrics; carry a thin layer for air-conditioning or the evening.' },
    { id: 'mild', min: 12, label: 'Mild (12–17 °C / 54–63 °F)', tip: 'One light layer you can take off is enough.' },
    { id: 'cool', min: 5, label: 'Cool (5–11 °C / 41–53 °F)', tip: 'Wear a knit or jacket and closed shoes.' },
    { id: 'cold', min: -99, label: 'Cold (below 5 °C / 41 °F)', tip: 'Layer a knit under a warm coat, and add a scarf.' }
  ];

  // [name, occasions, bands]. Band letters: h hot, w warm, m mild, c cool, k cold.
  var LIB = {
    womenswear: {
      top: [['T-shirt', 'casual date', 'hwm'], ['Linen shirt', 'casual smart', 'hw'], ['Silk-feel blouse', 'smart business date formal', 'hwmck'],
        ['Fine-knit sweater', 'casual smart business', 'mck'], ['Button-down shirt', 'smart business', 'hwmck'], ['Camisole', 'date formal', 'hw'],
        ['Turtleneck', 'smart business date', 'ck'], ['Striped long-sleeve top', 'casual smart', 'mc']],
      bottom: [['Straight-leg jeans', 'casual smart date', 'wmck'], ['Tailored trousers', 'smart business formal', 'hwmck'],
        ['Midi skirt', 'smart business date', 'hwm'], ['Wide-leg linen trousers', 'casual smart', 'hw'], ['Shorts', 'casual', 'h'],
        ['Wool trousers', 'business smart', 'ck'], ['Satin skirt', 'date formal', 'wmc']],
      onePiece: [['Shirt dress', 'casual smart business', 'hwm'], ['Midi wrap dress', 'smart business date', 'hwm'],
        ['Slip dress', 'date formal', 'hw'], ['Knit dress', 'smart business date', 'ck'], ['Floor-length gown', 'formal', 'hwmck'],
        ['Sundress', 'casual', 'h'], ['Jumpsuit', 'smart date', 'hwm']],
      layer: [['Tailored blazer', 'smart business formal date', 'wmc'], ['Cardigan', 'casual smart business', 'wmc'],
        ['Denim jacket', 'casual', 'wm'], ['Leather jacket', 'casual date', 'mc'], ['Chunky knit', 'casual', 'ck']],
      outer: [['Wool coat', 'smart business formal date', 'ck'], ['Trench coat', 'casual smart business', 'mc'],
        ['Puffer coat', 'casual', 'k']],
      shoes: [['White sneakers', 'casual smart', 'hwm'], ['Loafers', 'smart business', 'hwmc'], ['Ankle boots', 'casual smart date', 'mck'],
        ['Block heels', 'business date formal', 'hwmc'], ['Strappy sandals', 'casual date formal', 'hw'], ['Knee boots', 'smart date', 'ck'],
        ['Pointed pumps', 'business formal', 'hwmck']],
      accessory: [['Leather tote', 'business smart', 'hwmck'], ['Crossbody bag', 'casual date', 'hwmck'], ['Clutch', 'formal date', 'hwmck'],
        ['Silk scarf', 'smart business', 'wmc'], ['Wool scarf', 'casual smart business date', 'k'], ['Sunglasses', 'casual', 'hw'],
        ['Delicate gold or silver jewelry', 'date formal smart', 'hwmck']]
    },
    menswear: {
      top: [['T-shirt', 'casual', 'hwm'], ['Linen shirt', 'casual smart date', 'hw'], ['Oxford shirt', 'casual smart business', 'hwmck'],
        ['Polo shirt', 'casual smart', 'hw'], ['Dress shirt', 'business formal', 'hwmck'], ['Merino sweater', 'smart business date', 'mck'],
        ['Rollneck', 'smart date', 'ck'], ['Henley', 'casual', 'mc'], ['Knitted polo', 'smart date', 'hwm']],
      bottom: [['Dark jeans', 'casual smart date', 'wmck'], ['Chinos', 'casual smart business date', 'hwmc'], ['Shorts', 'casual', 'h'],
        ['Linen trousers', 'casual smart', 'hw'], ['Tailored trousers', 'business smart date', 'hwmck'], ['Suit trousers', 'formal', 'hwmck'],
        ['Wool trousers', 'business smart', 'ck']],
      onePiece: [],
      layer: [['Navy blazer', 'smart business date', 'wmc'], ['Suit jacket', 'formal business', 'hwmck'], ['Overshirt', 'casual smart', 'mc'],
        ['Harrington jacket', 'casual', 'wm'], ['Cardigan', 'casual smart', 'mc'], ['Chunky knit', 'casual', 'ck']],
      outer: [['Wool overcoat', 'smart business formal date', 'ck'], ['Trench or mac', 'casual smart business', 'mc'],
        ['Insulated parka', 'casual', 'k']],
      shoes: [['White leather sneakers', 'casual smart', 'hwm'], ['Loafers', 'smart business date', 'hwm'], ['Chelsea boots', 'casual smart date', 'mck'],
        ['Brown derbies', 'smart business', 'hwmck'], ['Black oxfords', 'business formal', 'hwmck'], ['Espadrilles', 'casual', 'h'],
        ['Suede desert boots', 'casual smart', 'mc']],
      accessory: [['Leather belt', 'smart business date', 'hwmck'], ['Silk tie', 'business formal', 'hwmck'], ['Pocket square', 'formal date', 'hwmck'],
        ['Minimal watch', 'casual smart business date formal', 'hwmck'], ['Sunglasses', 'casual', 'hw'], ['Wool scarf', 'casual smart business', 'k'],
        ['Canvas tote or backpack', 'casual', 'hwmc']]
    }
  };

  var BAND_LETTER = { hot: 'h', warm: 'w', mild: 'm', cool: 'c', cold: 'k' };

  function band(tempC) {
    var t = +tempC;
    if (!isFinite(t)) t = 20;
    for (var i = 0; i < BANDS.length; i++) if (t >= BANDS[i].min) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }

  function fToC(f) { return (f - 32) * 5 / 9; }
  function cToF(c) { return c * 9 / 5 + 32; }

  // mulberry32: small, fast, good enough for picking garments, and identical in every browser.
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function options(wardrobe, slot, occasion, b) {
    return (LIB[wardrobe][slot] || []).filter(function (it) {
      return it[1].split(' ').indexOf(occasion) >= 0 && it[2].indexOf(BAND_LETTER[b.id]) >= 0;
    }).map(function (it) { return it[0]; });
  }

  function choose(list, r) { return list.length ? list[Math.floor(r() * list.length)] : null; }

  var DEFAULT_PALETTE = {
    anchor: { name: 'Navy', hex: '#1F2A44' },
    neutrals: [{ name: 'White', hex: '#FAFAF7' }, { name: 'Beige', hex: '#D8C8AE' }, { name: 'Charcoal', hex: '#3C3F44' }]
  };

  // opts: { wardrobe, occasion, tempC, seed, palette: { anchor: {name, hex}, neutrals: [{name, hex}, ...] } }
  function generate(opts) {
    var o = opts || {};
    var wardrobe = o.wardrobe === 'menswear' ? 'menswear' : 'womenswear';
    var occasion = OCCASIONS[o.occasion] ? o.occasion : 'smart';
    var b = band(o.tempC);
    var seed = (+o.seed >>> 0) || 1;
    var r = rng(seed);
    var pal = o.palette && o.palette.anchor ? o.palette : DEFAULT_PALETTE;
    var pieces = [];

    var dresses = options(wardrobe, 'onePiece', occasion, b);
    var useDress = dresses.length && (occasion === 'formal' && wardrobe === 'womenswear' ? r() < 0.7 : r() < 0.35);
    var formalMen = wardrobe === 'menswear' && occasion === 'formal';

    if (useDress) {
      pieces.push({ slot: 'Dress', name: choose(dresses, r) });
    } else {
      pieces.push({ slot: 'Top', name: choose(options(wardrobe, 'top', occasion, b), r) });
      pieces.push({ slot: 'Bottom', name: formalMen ? 'Suit trousers' : choose(options(wardrobe, 'bottom', occasion, b), r) });
    }
    var needLayer = formalMen || b.id === 'cool' || b.id === 'cold' || (b.id === 'mild' && r() < 0.7) ||
      ((occasion === 'business') && b.id !== 'hot');
    if (needLayer) {
      var layer = formalMen ? 'Suit jacket' : choose(options(wardrobe, 'layer', occasion, b), r);
      if (layer) pieces.push({ slot: 'Layer', name: layer });
    }
    if (b.id === 'cold' || (b.id === 'cool' && r() < 0.5)) {
      var outer = choose(options(wardrobe, 'outer', occasion, b), r);
      if (outer) pieces.push({ slot: 'Coat', name: outer });
    }
    pieces.push({ slot: 'Shoes', name: choose(options(wardrobe, 'shoes', occasion, b), r) });
    var acc = choose(options(wardrobe, 'accessory', occasion, b), r);
    if (acc) pieces.push({ slot: 'Accessory', name: acc });

    // Color: the statement piece (dress, or the top unless the layer is the outermost visible piece) gets the anchor.
    var statement = useDress ? 0 : (formalMen ? -1 : 0);
    var ni = 0;
    pieces.forEach(function (p, i) {
      if (/sneakers/i.test(p.name) && /white/i.test(p.name)) { p.color = { name: 'White', hex: '#FAFAF7' }; return; }
      if (/jeans/i.test(p.name)) { p.color = { name: 'Denim blue', hex: '#4A6584' }; return; }
      if (/black/i.test(p.name)) { p.color = { name: 'Black', hex: '#1B1B1B' }; return; }
      if (i === statement) { p.color = pal.anchor; return; }
      p.color = pal.neutrals[ni++ % pal.neutrals.length];
    });
    if (formalMen) {
      // A suit is one color top to bottom; the chosen color moves to the tie or pocket square.
      var suit = pal.neutrals.filter(function (n) { return /navy|charcoal|black|gray|brown/i.test(n.name); })[0] ||
        { name: 'Charcoal', hex: '#3C3F44' };
      pieces.forEach(function (p) {
        if (p.slot === 'Top') p.color = { name: 'White', hex: '#FAFAF7' };
        if (p.name === 'Suit trousers' || p.name === 'Suit jacket') p.color = suit;
        if (p.slot === 'Accessory' && /tie|pocket/i.test(p.name)) p.color = pal.anchor;
      });
    }

    return {
      wardrobe: wardrobe, occasion: occasion, occasionLabel: OCCASIONS[occasion], band: b, seed: seed,
      pieces: pieces.filter(function (p) { return p.name; }), tip: b.tip
    };
  }

  return { FACTS: FACTS, OCCASIONS: OCCASIONS, BANDS: BANDS, LIB: LIB, band: band, fToC: fToC, cToF: cToF, rng: rng, generate: generate };
});
