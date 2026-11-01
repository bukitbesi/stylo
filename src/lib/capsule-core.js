/*! SimplyStylo capsule wardrobe engine. (c) SimplyStylo. All rights reserved. */
// Builds a 15, 25 or 35 piece capsule from a ranked item library, assigns colors with a 60/30/10 split and counts
// the outfits it makes. Outfit count = tops × bottoms + one-piece outfits (dresses, jumpsuits); shoes and layers
// multiply that, and are reported separately so the headline number stays realistic.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSCapsule = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-01' };

  // Category counts per wardrobe and size, before the climate adjustment.
  var SPLITS = {
    women: {
      15: { tops: 5, bottoms: 4, onePiece: 1, layers: 3, shoes: 2 },
      25: { tops: 9, bottoms: 6, onePiece: 3, layers: 4, shoes: 3 },
      35: { tops: 12, bottoms: 8, onePiece: 5, layers: 6, shoes: 4 }
    },
    men: {
      15: { tops: 6, bottoms: 4, onePiece: 0, layers: 3, shoes: 2 },
      25: { tops: 10, bottoms: 6, onePiece: 0, layers: 5, shoes: 4 },
      35: { tops: 14, bottoms: 9, onePiece: 0, layers: 7, shoes: 5 }
    }
  };

  var CATEGORY_LABELS = { tops: 'Tops', bottoms: 'Bottoms', onePiece: 'Dresses & one-pieces', layers: 'Layers', shoes: 'Shoes' };

  // tags: w = work, c = casual, s = smart/evening, hot = warm climate, cold = cold climate. Order = priority, and the
  // first three of each category are core basics that get a bonus so every capsule keeps them.
  var LIB = {
    women: {
      tops: [
        ['White T-shirt', 'c w'], ['Button-down shirt', 'w s'], ['Striped long-sleeve top', 'c'], ['Fine-knit sweater', 'w c cold'],
        ['Silk-feel blouse', 'w s'], ['Black T-shirt', 'c'], ['Tank or shell top', 'c hot w'], ['Crew-neck sweater', 'c cold'],
        ['Linen shirt', 'c hot'], ['Turtleneck', 'w cold s'], ['Fitted long-sleeve tee', 'c cold'], ['Camisole', 's hot'],
        ['Polo or knit tee', 'w c hot'], ['Chunky cardigan sweater', 'c cold'], ['Wrap top', 's w'], ['Sleeveless knit', 'w hot']],
      bottoms: [
        ['Straight-leg jeans', 'c s'], ['Tailored trousers', 'w s'], ['Midi skirt', 'w s c'], ['Wide-leg trousers', 'w c'],
        ['Dark jeans', 'c s'], ['Linen trousers', 'c hot'], ['Pencil skirt', 'w'], ['Shorts', 'c hot'],
        ['Wool trousers', 'w cold'], ['Pleated skirt', 's c'], ['Cropped trousers', 'w c hot']],
      onePiece: [
        ['Shirt dress', 'w c'], ['Little black dress', 's w'], ['Knit midi dress', 'c w cold'], ['Slip dress', 's hot'],
        ['Jumpsuit', 'c s'], ['Wrap dress', 'w s'], ['Sundress', 'c hot']],
      layers: [
        ['Tailored blazer', 'w s'], ['Trench coat', 'w c'], ['Cardigan', 'c w'], ['Denim jacket', 'c hot'],
        ['Wool coat', 'w s cold'], ['Leather or faux-leather jacket', 'c s'], ['Puffer or insulated coat', 'c cold'],
        ['Linen overshirt', 'c hot'], ['Knitted vest', 'c w']],
      shoes: [
        ['White sneakers', 'c'], ['Loafers or flats', 'w c'], ['Ankle boots', 'c w cold'], ['Block heels', 's w'],
        ['Sandals', 'c hot'], ['Knee boots', 's cold'], ['Strappy heels', 's hot']]
    },
    men: {
      tops: [
        ['White T-shirt', 'c'], ['Oxford shirt', 'w c'], ['Navy T-shirt', 'c'], ['Merino crew-neck', 'w c cold'],
        ['Polo shirt', 'c w hot'], ['White dress shirt', 'w s'], ['Light blue dress shirt', 'w s'], ['Gray T-shirt', 'c'],
        ['Linen shirt', 'c hot'], ['Henley', 'c'], ['Rollneck', 's cold w'], ['Chambray shirt', 'c'],
        ['Long-sleeve tee', 'c cold'], ['Knitted polo', 'w s hot'], ['Flannel shirt', 'c cold'], ['Quarter-zip knit', 'c w cold']],
      bottoms: [
        ['Dark jeans', 'c s'], ['Chinos', 'w c'], ['Tailored trousers', 'w s'], ['Stone chinos', 'c hot'],
        ['Gray wool trousers', 'w s cold'], ['Shorts', 'c hot'], ['Black jeans', 'c s'], ['Linen trousers', 'c hot'],
        ['Corduroy trousers', 'c cold'], ['Drawstring trousers', 'c']],
      onePiece: [],
      layers: [
        ['Navy blazer', 'w s'], ['Overshirt or shacket', 'c'], ['Light jacket (Harrington or bomber)', 'c'],
        ['Wool overcoat', 'w s cold'], ['Cardigan', 'c w'], ['Denim jacket', 'c'], ['Insulated jacket', 'c cold'],
        ['Suit jacket (matching trousers)', 's w'], ['Gilet', 'c cold']],
      shoes: [
        ['White leather sneakers', 'c s'], ['Brown leather shoes', 'w s'], ['Chelsea boots', 'c w cold'], ['Loafers', 'w s hot'],
        ['Black dress shoes', 's'], ['Suede desert boots', 'c'], ['Sandals or espadrilles', 'c hot']]
    }
  };

  var FOCUS_WEIGHT = {
    work: { w: 3, c: 1, s: 1 }, casual: { w: 0, c: 3, s: 1 }, smart: { w: 1, c: 1, s: 3 }, balanced: { w: 2, c: 2, s: 1 }
  };

  function split(wardrobe, size, climate) {
    var base = SPLITS[wardrobe] && SPLITS[wardrobe][size];
    if (!base) return null;
    var s = { tops: base.tops, bottoms: base.bottoms, onePiece: base.onePiece, layers: base.layers, shoes: base.shoes };
    // Trade one piece between tops and layers; total size never changes.
    if (climate === 'hot') { s.layers -= 1; s.tops += 1; }
    if (climate === 'cold') { s.tops -= 1; s.layers += 1; }
    return s;
  }

  function scoreItem(tags, focus, climate) {
    var t = tags.split(' '), wgt = FOCUS_WEIGHT[focus] || FOCUS_WEIGHT.balanced, sc = 0;
    t.forEach(function (x) { if (wgt[x] != null) sc += wgt[x]; });
    if (climate === 'hot' && t.indexOf('cold') >= 0) sc -= 4;
    if (climate === 'cold' && t.indexOf('hot') >= 0) sc -= 4;
    if (climate !== 'temperate' && t.indexOf(climate) >= 0) sc += 2;
    return sc;
  }

  // Color roles cycle 60/30/10: of every 10 pieces, 6 main neutral, 3 second neutral, 1 accent.
  var ROLE_CYCLE = ['main', 'second', 'main', 'main', 'second', 'main', 'accent', 'main', 'second', 'main'];

  var FIXED = /\b(white|black|navy|gray|light blue|brown|dark|stone|denim|chambray|jeans)\b/i;

  function build(opts) {
    var o = opts || {};
    var wardrobe = o.wardrobe === 'men' ? 'men' : 'women';
    var size = [15, 25, 35].indexOf(+o.size) >= 0 ? +o.size : 25;
    var focus = FOCUS_WEIGHT[o.focus] ? o.focus : 'balanced';
    var climate = ['hot', 'temperate', 'cold'].indexOf(o.climate) >= 0 ? o.climate : 'temperate';
    var colors = { main: o.main || 'Navy', second: o.second || 'White', accent: o.accent || 'Burgundy' };
    var counts = split(wardrobe, size, climate);
    var groups = [], n = 0;
    Object.keys(CATEGORY_LABELS).forEach(function (cat) {
      var want = counts[cat];
      if (!want) return;
      var ranked = LIB[wardrobe][cat].map(function (it, i) { return { name: it[0], score: scoreItem(it[1], focus, climate) + (i < 3 ? 1.5 : 0), i: i }; })
        .sort(function (a, b) { return b.score - a.score || a.i - b.i; })
        .slice(0, want);
      groups.push({
        id: cat, label: CATEGORY_LABELS[cat],
        items: ranked.map(function (it) {
          // Pieces whose color is part of the name (white sneakers, dark jeans) keep it.
          if (FIXED.test(it.name)) return { name: it.name, role: 'fixed', color: null };
          var role = ROLE_CYCLE[n++ % ROLE_CYCLE.length];
          return { name: it.name, role: role, color: colors[role] };
        })
      });
    });
    var c = counts;
    var outfits = c.tops * c.bottoms + c.onePiece;
    return {
      wardrobe: wardrobe, size: size, focus: focus, climate: climate, colors: colors, counts: c, groups: groups,
      total: c.tops + c.bottoms + c.onePiece + c.layers + c.shoes,
      outfits: outfits, withShoes: outfits * c.shoes, withLayers: outfits * (c.layers + 1)
    };
  }

  return { FACTS: FACTS, SPLITS: SPLITS, LIB: LIB, CATEGORY_LABELS: CATEGORY_LABELS, split: split, build: build };
});
