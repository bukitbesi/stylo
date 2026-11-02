/*! SimplyStylo Wedding Guest Outfit Finder UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/wedguest-core.js'), require('../lib/dress-core.js'), require('../lib/garments.js'));
  } else factory(root.SSUI, root.SSWedGuest, root.SSDressDesign, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, W, D, G) {
  'use strict';

  var DEFAULT = { c: 'cocktail', t: 'evening', s: 'summer', v: 'garden', g: 'womenswear', i: '0' };
  var FIELDS = [['c', 'Dress code on the invitation', W.CODES], ['t', 'Time', W.TIMES], ['s', 'Season', W.SEASONS], ['v', 'Venue', W.VENUES],
    ['g', 'Style', { womenswear: 'Womenswear', menswear: 'Menswear' }]];

  function norm(st) {
    st = st || {};
    var o = {};
    FIELDS.forEach(function (f) { o[f[0]] = f[2][st[f[0]]] ? st[f[0]] : DEFAULT[f[0]]; });
    var i = parseInt(st.i, 10);
    o.i = String(i >= 0 && i <= 3 ? i : 0);
    return o;
  }
  function plan(st) { return W.plan({ code: st.c, time: st.t, season: st.s, venue: st.v, style: st.g, color: st.i }); }

  function summary(st) {
    var r = plan(st);
    return W.CODES[r.code] + ', ' + W.TIMES[r.time].split(' (')[0].toLowerCase() + ', ' + W.SEASONS[r.season].toLowerCase() + ', ' + W.VENUES[r.venue].toLowerCase() + ': wear ' +
      r.pieces.map(function (p) { return p[0].toLowerCase(); }).join(', ') + ', in ' + r.color[0].toLowerCase() + '.';
  }

  function result(st) {
    var r = plan(st);
    var hash = Object.keys(r.dress).map(function (k) { return k + '=' + r.dress[k]; }).join('&');
    var visual = r.style === 'womenswear'
      ? '<div class="dress-stage">' + D.svg(r.dress, { id: 'wg', width: 200, label: 'Suggested guest dress in ' + r.color[0] }) + '</div>'
      : '<ul class="board" aria-label="Outfit">' + r.pieces.map(function (p) { return '<li>' + G.svg(p[0], '#' + p[1], 64, true) + '<span>' + U.esc(p[0]) + '</span></li>'; }).join('') + '</ul>';
    return '<h2>Your Wedding Guest Outfit</h2><p class="summary" data-summary>' + U.esc(summary(st)) + '</p>' +
      '<div class="split"><div>' + visual + '</div><div><ul class="list-check">' + r.pieces.map(function (p) {
        return '<li>' + G.svg(p[0], '#' + p[1], 36, true) + '<span>' + U.esc(p[0]) + '</span></li>';
      }).join('') + '</ul>' +
      (r.style === 'womenswear' ? '<p><a class="btn btn--ghost" href="/tools/dress-designer/#' + hash + '">Customize this dress in the dress designer</a></p>' : '') + '</div></div>' +
      '<h3>Colors for this wedding</h3><div class="chips">' + r.palette.map(function (c, i) {
        return '<button type="button" class="chip" data-color="' + i + '" aria-pressed="' + (String(i) === st.i) + '">' + U.dot('#' + c[1]) + U.esc(c[0]) + '</button>';
      }).join('') + '</div>' +
      '<h3>Etiquette for this wedding</h3><ul>' + r.notes.map(function (n) { return '<li>' + U.esc(n) + '</li>'; }).join('') + '</ul>';
  }

  function controls(st) {
    return '<div class="row">' + FIELDS.map(function (f) {
      return '<div><label class="lbl" for="wg-' + f[0] + '">' + f[1] + '</label><select id="wg-' + f[0] + '" name="' + f[0] + '">' + Object.keys(f[2]).map(function (k) {
        return '<option value="' + k + '"' + (k === st[f[0]] ? ' selected' : '') + '>' + U.esc(f[2][k]) + '</option>';
      }).join('') + '</select></div>';
    }).join('') + '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=wedding-guest]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    FIELDS.forEach(function (f) { root.querySelector('[name=' + f[0] + ']').value = st[f[0]]; });
    root.addEventListener('change', function (e) {
      if (!e.target.name || !(e.target.name in DEFAULT)) return;
      st[e.target.name] = e.target.value;
      if (e.target.name === 's' || e.target.name === 't') st.i = '0';
      st = norm(st); draw(true);
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-color]');
      if (!b) return;
      st.i = b.dataset.color; draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
