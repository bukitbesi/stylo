/*! SimplyStylo Packing List Generator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/packing-core.js'), require('../lib/garments.js'));
  else factory(root.SSUI, root.SSPack, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, P, G) {
  'use strict';

  var DEFAULT = { n: '7', t: 'city', w: 'mild', g: 'women', l: '0' };
  var PALETTE = ['#1F2A44', '#FAFAF7', '#B98A57', '#8E9094', '#6D1F2E'];

  function norm(st) {
    st = st || {};
    var n = parseInt(st.n, 10);
    return { n: String(isFinite(n) ? Math.max(1, Math.min(30, n)) : 7), t: P.TRIPS[st.t] ? st.t : 'city', w: P.WEATHER[st.w] ? st.w : 'mild', g: st.g === 'men' ? 'men' : 'women', l: st.l === '1' ? '1' : '0' };
  }
  function plan(st) { return P.plan({ days: +st.n, trip: st.t, weather: st.w, wardrobe: st.g, laundry: st.l === '1' }); }

  function summary(st) {
    var r = plan(st);
    return 'For ' + r.days + ' day' + (r.days === 1 ? '' : 's') + ' (' + P.TRIPS[r.trip].toLowerCase() + ', ' + r.weather + ' weather' + (r.laundry ? ', with laundry' : '') +
      '), pack ' + r.pieces + ' clothing pieces that make ' + r.outfits + ' outfits.';
  }

  function result(st) {
    var r = plan(st), k = 0;
    return '<h2>Your Packing List</h2><p class="summary" data-summary>' + U.esc(summary(st)) + '</p>' +
      '<div class="kpis"><div class="kpi"><span>Clothing pieces</span><b>' + r.pieces + '</b></div><div class="kpi"><span>Outfits</span><b>' + r.outfits +
      '</b></div><div class="kpi"><span>Days of clothes</span><b>' + r.clothingDays + '</b></div></div>' +
      '<div class="grid2">' + r.groups.map(function (g) {
        return '<div class="panel"><h3>' + U.esc(g.label) + '</h3><ul class="list-check">' + g.items.map(function (it) {
          var hex = G.impliedHex(it.name) || PALETTE[k++ % PALETTE.length];
          return '<li><label><input type="checkbox">' + G.svg(it.name, hex, 36, true) + U.esc(it.name) + '</label><span class="tag">× ' + it.qty + '</span></li>';
        }).join('') + '</ul></div>';
      }).join('') + '<div class="panel"><h3>Essentials</h3><ul class="list-check">' + r.essentials.map(function (e) {
        return '<li><label><input type="checkbox"> ' + U.esc(e) + '</label></li>';
      }).join('') + '</ul></div></div>';
  }

  function sel(name, label, map, val) {
    return '<div><label class="lbl" for="pk-' + name + '">' + label + '</label><select id="pk-' + name + '" name="' + name + '">' + Object.keys(map).map(function (k) {
      return '<option value="' + k + '"' + (k === val ? ' selected' : '') + '>' + U.esc(map[k]) + '</option>';
    }).join('') + '</select></div>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="pk-n">Trip length (days)</label><input type="number" id="pk-n" name="n" value="' + st.n + '" min="1" max="30" step="1" inputmode="numeric"></div>' +
      sel('t', 'Trip type', P.TRIPS, st.t) + sel('w', 'Weather', P.WEATHER, st.w) + sel('g', 'Wardrobe', { women: "Women's", men: "Men's" }, st.g) +
      '<div><span class="lbl">Laundry</span><label class="opt"><input type="checkbox" name="l"' + (st.l === '1' ? ' checked' : '') + '><span>I can do laundry on the trip</span></label></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=packing-list]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['n', 't', 'w', 'g'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.querySelector('[name=l]').checked = st.l === '1';
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!(k in DEFAULT) || e.target.closest('[data-result]')) return;
      st[k] = k === 'l' ? (e.target.checked ? '1' : '0') : e.target.value;
      st = norm(st);
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
