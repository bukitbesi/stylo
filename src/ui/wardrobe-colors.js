/*! SimplyStylo Wardrobe Color Checker UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/color-core.js'), require('../lib/wardrobe-core.js'), require('../lib/palette-core.js'));
  } else factory(root.SSUI, root.SSColor, root.SSWardrobe, root.SSPalette).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, C, W, P) {
  'use strict';

  var DEFAULT = { navy: 4, white: 3, gray: 2, burgundy: 2, 'olive-green': 1 };
  var VERDICT = {
    strong: 'Strong neutral base: almost everything combines. Add one or two accent colors to keep it interesting.',
    balanced: 'Balanced: enough neutrals to anchor most outfits. Keep new purchases mostly neutral.',
    'color-heavy': 'Color-heavy: fun, but harder to combine. Add neutrals so each color piece has more partners.'
  };

  function encode(o) { return Object.keys(o).filter(function (k) { return +o[k] > 0; }).map(function (k) { return k + '.' + o[k]; }).join('_'); }
  function decode(s) {
    var o = {};
    String(s || '').split('_').forEach(function (p) { var m = p.match(/^([a-z-]+)\.(\d{1,2})$/); if (m && C.bySlug(m[1])) o[m[1]] = Math.min(50, +m[2]); });
    return o;
  }

  function summary(o) {
    var r = W.analyse(o);
    if (!r) return 'Enter how many pieces you own in each color.';
    return r.total + ' pieces, ' + r.neutralShare + '% neutrals: ' + r.easyPairs + '% of color pairings combine easily. Best colors to add: ' +
      r.suggestions.map(function (s) { return s.name.toLowerCase(); }).join(', ') + '.';
  }

  function result(o) {
    var r = W.analyse(o);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(o)) + '</p>';
    var seasons = P.seasonMatch(r.items.map(function (i) { return { hex: i.hex, share: i.count }; }), 3);
    return '<h2>Your Wardrobe Colors</h2><p class="summary" data-summary>' + U.esc(summary(o)) + '</p>' +
      '<div class="pal" role="img" aria-label="Your wardrobe colors by share">' + r.items.map(function (i) {
        return '<span style="background:' + i.hex + ';flex:' + i.count + '"></span>';
      }).join('') + '</div>' +
      '<div class="kpis"><div class="kpi"><span>Pieces</span><b>' + r.total + '</b></div><div class="kpi"><span>Neutrals</span><b>' + r.neutralShare +
      '%</b></div><div class="kpi"><span>Easy pairings</span><b>' + r.easyPairs + '%</b></div></div>' +
      '<p>' + U.esc(VERDICT[r.balance]) + '</p>' +
      '<h3>Best colors to add next</h3><ul class="swatches">' + r.suggestions.map(function (s) { return U.swatch(s.hex, s.name + ' · ' + s.score + '%'); }).join('') + '</ul>' +
      '<p class="meta-line">The percentage is how well each color pairs with what you own, weighted by how many pieces you have.</p>' +
      (r.hardPairs.length ? '<div class="panel"><h3>Harder to combine</h3><p>' + r.hardPairs.map(function (p) { return U.esc(p[0] + ' + ' + p[1]); }).join('; ') +
        '. Put a neutral between them, or wear them apart.</p></div>' : '') +
      '<p>Your wardrobe colors are closest to: ' + seasons.map(function (s) { return '<a href="/seasons/' + s.id + '/">' + U.esc(s.name) + '</a>'; }).join(', ') + '.</p>';
  }

  function controls(o) {
    return '<fieldset><legend>How many pieces do you own in each color?</legend><div class="counts">' + C.NAMED.map(function (c) {
      return '<label class="count" for="wc-' + c.slug + '">' + U.dot(c.hex) + '<span>' + U.esc(c.name) + '</span><input type="number" id="wc-' + c.slug + '" name="' + c.slug +
        '" value="' + (o[c.slug] || 0) + '" min="0" max="50" step="1" inputmode="numeric"></label>';
    }).join('') + '</div></fieldset>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=wardrobe-colors]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var fromHash = decode(U.readHash().o), o = Object.keys(fromHash).length ? fromHash : JSON.parse(JSON.stringify(DEFAULT));
    function draw(write) { res.innerHTML = result(o); live.textContent = summary(o); if (write) U.writeHash({ o: encode(o) }); }
    C.NAMED.forEach(function (c) { root.querySelector('[name=' + c.slug + ']').value = o[c.slug] || 0; });
    root.addEventListener('input', function (e) {
      var c = C.bySlug(e.target.name);
      if (!c) return;
      var v = parseInt(e.target.value, 10);
      if (isFinite(v) && v > 0) o[c.slug] = Math.min(50, v); else delete o[c.slug];
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(fromHash).length) draw(false);
  }

  return { DEFAULT: DEFAULT, encode: encode, decode: decode, controls: controls, result: result, summary: summary, mount: mount };
});
