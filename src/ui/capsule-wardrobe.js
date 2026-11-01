/*! SimplyStylo Capsule Wardrobe Planner UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/capsule-core.js'), require('../lib/color-core.js'), require('../lib/garments.js'));
  else factory(root.SSUI, root.SSCapsule, root.SSColor, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, K, C, G) {
  'use strict';

  var DEFAULT = { w: 'women', n: '25', f: 'balanced', cl: 'temperate', m: 'navy', s: 'white', a: 'burgundy' };
  var FIELDS = {
    w: { label: 'Wardrobe', opts: { women: "Women's", men: "Men's" } },
    n: { label: 'Number of pieces', opts: { 15: '15 pieces (minimal)', 25: '25 pieces (classic)', 35: '35 pieces (flexible)' } },
    f: { label: 'Your week is mostly', opts: { balanced: 'A mix of work and casual', work: 'Office and work', casual: 'Casual and weekend', smart: 'Smart and evening' } },
    cl: { label: 'Climate', opts: { temperate: 'Temperate (four seasons)', hot: 'Hot or tropical', cold: 'Cold winters' } },
    m: { label: 'Main neutral (60%)', colors: ['navy', 'black', 'charcoal', 'gray', 'camel', 'beige', 'brown', 'olive-green'] },
    s: { label: 'Second neutral (30%)', colors: ['white', 'ivory', 'beige', 'gray', 'camel', 'denim-blue', 'khaki'] },
    a: { label: 'Accent (10%)', colors: ['burgundy', 'rust', 'emerald-green', 'blush-pink', 'cobalt-blue', 'mustard-yellow', 'red', 'lavender', 'sage-green'] }
  };

  function norm(st) {
    var o = {};
    Object.keys(DEFAULT).forEach(function (k) {
      var f = FIELDS[k], v = st && st[k];
      var ok = f.opts ? Object.prototype.hasOwnProperty.call(f.opts, v) : f.colors.indexOf(v) >= 0;
      o[k] = ok ? v : DEFAULT[k];
    });
    return o;
  }

  function plan(st) {
    return K.build({ wardrobe: st.w, size: +st.n, focus: st.f, climate: st.cl, main: C.bySlug(st.m).name, second: C.bySlug(st.s).name, accent: C.bySlug(st.a).name });
  }

  function controls(st) {
    return '<div class="row">' + Object.keys(FIELDS).map(function (k) {
      var f = FIELDS[k];
      var opts = f.opts ? Object.keys(f.opts).map(function (v) { return [v, f.opts[v]]; }) : f.colors.map(function (s) { return [s, C.bySlug(s).name]; });
      return '<div><label class="lbl" for="cw-' + k + '">' + f.label + '</label><select id="cw-' + k + '" name="' + k + '">' +
        opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === st[k] ? ' selected' : '') + '>' + U.esc(o[1]) + '</option>'; }).join('') +
        '</select></div>';
    }).join('') + '</div>';
  }

  function summary(st) {
    var p = plan(st);
    return 'Your ' + p.total + '-piece capsule makes ' + p.outfits + ' outfits (' + p.counts.tops + ' tops × ' + p.counts.bottoms + ' bottoms' +
      (p.counts.onePiece ? ' + ' + p.counts.onePiece + ' dresses' : '') + '), or ' + p.withShoes + ' looks once you vary the shoes.';
  }

  function result(st) {
    var p = plan(st);
    var hex = { main: C.bySlug(st.m).hex, second: C.bySlug(st.s).hex, accent: C.bySlug(st.a).hex };
    return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>' +
      '<div class="kpis"><div class="kpi"><span>Pieces</span><b>' + p.total + '</b></div><div class="kpi"><span>Outfits</span><b>' + p.outfits +
      '</b></div><div class="kpi"><span>With shoe changes</span><b>' + p.withShoes + '</b></div><div class="kpi"><span>With layers</span><b>' + p.withLayers + '</b></div></div>' +
      '<h2>Your capsule palette and checklist</h2>' + U.bar([hex.main, hex.second, hex.accent], 'pal--outfit') +
      '<p class="meta-line">' + U.esc(C.bySlug(st.m).name) + ' 60% · ' + U.esc(C.bySlug(st.s).name) + ' 30% · ' + U.esc(C.bySlug(st.a).name) + ' 10%</p>' +
      '<div class="grid2">' + p.groups.map(function (g) {
        return '<div class="panel"><h3>' + U.esc(g.label) + ' (' + g.items.length + ')</h3><ul class="list-check">' + g.items.map(function (it) {
          var h = it.color ? hex[it.role] : (G.impliedHex(it.name) || '#B8A58D');
          var tag = it.color ? U.esc(it.color) : 'as named';
          return '<li><label><input type="checkbox">' + G.svg(it.name, h, 40, true) + U.esc(it.name) + '</label><span class="tag">' + tag + '</span></li>';
        }).join('') + '</ul></div>';
      }).join('') + '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=capsule-wardrobe]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) {
      res.innerHTML = result(st);
      live.textContent = summary(st);
      if (write) U.writeHash(st);
    }
    Object.keys(FIELDS).forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('change', function (e) {
      if (!FIELDS[e.target.name]) return;
      st[e.target.name] = e.target.value;
      st = norm(st);
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
