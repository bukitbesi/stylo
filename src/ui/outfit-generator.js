/*! SimplyStylo Outfit Generator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/outfit-core.js'), require('../lib/color-core.js'), require('../lib/garments.js'));
  else factory(root.SSUI, root.SSOutfit, root.SSColor, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, O, C, G) {
  'use strict';

  var DEFAULT = { w: 'womenswear', o: 'smart', t: '20', u: 'c', c: 'burgundy', s: '7' };
  var COLORS = ['burgundy', 'navy', 'olive-green', 'camel', 'emerald-green', 'cobalt-blue', 'rust', 'blush-pink', 'mustard-yellow',
    'red', 'lavender', 'sage-green', 'light-blue', 'black', 'white', 'gray'];

  function norm(st) {
    var s = st || {};
    var t = parseFloat(s.t);
    return {
      w: s.w === 'menswear' ? 'menswear' : 'womenswear',
      o: O.OCCASIONS[s.o] ? s.o : DEFAULT.o,
      t: isFinite(t) ? String(t) : DEFAULT.t,
      u: s.u === 'f' ? 'f' : 'c',
      c: COLORS.indexOf(s.c) >= 0 ? s.c : DEFAULT.c,
      s: String((parseInt(s.s, 10) >>> 0) || 7)
    };
  }

  function palette(slug) {
    var n = C.bySlug(slug);
    return { anchor: { name: n.name, hex: n.hex }, neutrals: C.bestNeutrals(n.hex, 3).map(function (x) { return { name: x.name, hex: x.hex }; }) };
  }

  function outfit(st) {
    var tc = st.u === 'f' ? O.fToC(+st.t) : +st.t;
    return O.generate({ wardrobe: st.w, occasion: st.o, tempC: tc, seed: +st.s, palette: palette(st.c) });
  }

  function select(name, label, pairs, val) {
    return '<div><label class="lbl" for="og-' + name + '">' + label + '</label><select id="og-' + name + '" name="' + name + '">' +
      pairs.map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === val ? ' selected' : '') + '>' + U.esc(p[1]) + '</option>'; }).join('') + '</select></div>';
  }

  function controls(st) {
    return '<div class="row">' +
      select('w', 'Style', [['womenswear', 'Womenswear'], ['menswear', 'Menswear']], st.w) +
      select('o', 'Occasion', Object.keys(O.OCCASIONS).map(function (k) { return [k, O.OCCASIONS[k]]; }), st.o) +
      '<div><label class="lbl" for="og-t">Temperature</label><input type="number" id="og-t" name="t" value="' + U.esc(st.t) + '" step="1" inputmode="numeric"></div>' +
      select('u', 'Unit', [['c', '°C'], ['f', '°F']], st.u) +
      select('c', 'Color to wear', COLORS.map(function (s) { return [s, C.bySlug(s).name]; }), st.c) +
      '</div>';
  }

  function summary(st) {
    var r = outfit(st);
    return r.occasionLabel + ', ' + r.band.label.split(' (')[0].toLowerCase() + ': ' +
      r.pieces.map(function (p) { return p.color.name.toLowerCase() + ' ' + p.name.toLowerCase(); }).join(', ') + '.';
  }

  function result(st) {
    var r = outfit(st);
    return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>' +
      '<ul class="board" aria-label="Outfit flat lay">' + r.pieces.map(function (p) {
        return '<li>' + G.svg(p.name, p.color.hex, 76, true) + '<span><small>' + U.esc(p.slot) + '</small>' + U.esc(p.color.name) + ' ' +
          U.esc(p.name.charAt(0).toLowerCase() + p.name.slice(1)) + '</span></li>';
      }).join('') + '</ul>' +
      '<p><b>' + U.esc(r.band.label) + ':</b> ' + U.esc(r.tip) + '</p>' +
      '<p class="meta-line">Outfit #' + r.seed + '. Press “New outfit” for another idea; the link always reopens this one.</p>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=outfit-generator]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) {
      res.innerHTML = result(st);
      live.textContent = summary(st);
      if (write) U.writeHash(st);
    }
    ['w', 'o', 't', 'u', 'c'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      if (!e.target.name || !(e.target.name in DEFAULT)) return;
      var prevU = st.u;
      st[e.target.name] = e.target.value;
      // Switching unit converts the number so the weather stays the same.
      if (e.target.name === 'u' && prevU !== st.u) {
        var t = +st.t;
        st.t = String(Math.round(st.u === 'f' ? O.cToF(t) : O.fToC(t)));
        root.querySelector('[name=t]').value = st.t;
      }
      st = norm(st);
      draw(true);
    });
    root.querySelector('[data-shuffle]').addEventListener('click', function () {
      st.s = String(1 + Math.floor(Math.random() * 99999));
      draw(true);
      U.track('outfit_shuffle', { occasion: st.o });
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
