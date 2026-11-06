/*! SimplyStylo Circle Skirt Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/skirt-core.js'));
  else factory(root.SSUI, root.SSSkirt).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, S) {
  'use strict';

  var UNITS = { cm: { s: '1.5', h: '2.5', f: '150', w: '70', l: '60' }, in: { s: '0.625', h: '1', f: '60', w: '28', l: '24' } };
  var DEFAULT = { u: 'cm', t: 'full', w: '70', l: '60', s: '1.5', h: '2.5', f: '150' };
  var FIELDS = [['w', 'Waist'], ['l', 'Skirt length'], ['s', 'Waist seam allowance'], ['h', 'Hem allowance'], ['f', 'Fabric width']];

  function norm(st) {
    st = st || {};
    var u = st.u === 'in' ? 'in' : 'cm', o = { u: u, t: S.TYPES[st.t] ? st.t : 'full' };
    FIELDS.forEach(function (f) { o[f[0]] = st[f[0]] != null && st[f[0]] !== '' ? String(st[f[0]]) : (u === DEFAULT.u ? DEFAULT[f[0]] : UNITS[u][f[0]]); });
    return o;
  }
  function calc(st) { return S.calc({ waist: st.w, length: st.l, type: st.t, seam: st.s, hem: st.h, width: st.f }); }
  function n(x) { return String(x).replace(/\.0+$/, ''); }

  function summary(st) {
    var r = calc(st), u = st.u;
    if (!r) return 'Enter your waist, skirt length and allowances to draft the pattern.';
    return 'For a ' + st.w + ' ' + u + ' waist, a ' + r.name.toLowerCase() + ' skirt has a waist radius of ' + n(r.r) + ' ' + u + '. Cut the waistline ' + n(r.inner) + ' ' + u + ' and the hem ' + n(r.outer) + ' ' + u + ' from the center. ' +
      (r.fabric != null ? 'You need about ' + n(r.fabric) + ' ' + u + ' of ' + st.f + ' ' + u + ' wide fabric (' + r.layout.panels + ' piece' + (r.layout.panels > 1 ? 's' : '') + ').' : 'The skirt is too long for ' + st.f + ' ' + u + ' wide fabric in one or two pieces: shorten it, use wider fabric or add more panels.');
  }

  // Pattern piece: the skirt sector with the waist and hem arcs and the radii marked.
  function pattern(r, u) {
    var W = 300, H = 210, cx = 150, cy = 22, sweep = Math.min(r.fraction, 0.5) * 2 * Math.PI, scale = (r.fraction >= 0.5 ? 140 : 170) / r.outer;
    var a0 = Math.PI / 2 + sweep / 2, a1 = Math.PI / 2 - sweep / 2;
    var pt = function (rad, a) { return [cx + rad * scale * Math.cos(a), cy + rad * scale * Math.sin(a)].map(function (v) { return Math.round(v * 10) / 10; }).join(' '); };
    var large = sweep > Math.PI ? 1 : 0, ro = r.outer * scale, ri = Math.max(r.inner * scale, 2);
    var d = 'M' + pt(r.inner, a0) + ' L' + pt(r.outer, a0) + ' A' + ro + ' ' + ro + ' 0 ' + large + ' 0 ' + pt(r.outer, a1) + ' L' + pt(r.inner, a1) + ' A' + ri + ' ' + ri + ' 0 ' + large + ' 1 ' + pt(r.inner, a0) + 'Z';
    if (r.fraction === 1) d = 'M' + (cx - ro) + ' ' + cy + 'A' + ro + ' ' + ro + ' 0 0 0 ' + (cx + ro) + ' ' + cy + 'L' + (cx + ri) + ' ' + cy + 'A' + ri + ' ' + ri + ' 0 0 1 ' + (cx - ri) + ' ' + cy + 'Z';
    var t = function (x, y, s, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="11" font-family="system-ui,sans-serif" fill="#171717" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; };
    return '<svg class="figure figure--fluid figure--wide" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Pattern piece with waist and hem radii">' +
      '<path d="' + d + '" fill="#E9DDC9" stroke="#8C7A62" stroke-width="1.5"/>' +
      '<path d="M' + cx + ' ' + cy + 'V' + (cy + ro) + '" stroke="#1F4FB0" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="#1F4FB0"/>' +
      t(cx + 6, cy + ri / 2 + 10, 'waist cut ' + n(r.inner) + ' ' + u, 'start') + t(cx + 6, cy + ro - 8, 'hem cut ' + n(r.outer) + ' ' + u, 'start') +
      (r.fraction === 1 ? t(cx, H - 4, 'Half shown: cut on a fold or as two halves') : r.fraction === 0.75 ? t(cx, H - 4, 'Half shown: add one quarter piece') : '') + '</svg>';
  }

  function result(st) {
    var r = calc(st), u = st.u;
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var kpi = function (l, v) { return '<div class="kpi"><span>' + l + '</span><b>' + v + '</b></div>'; };
    return '<div class="split"><div>' + pattern(r, u) + '</div><div><p class="eyebrow">' + U.esc(r.name) + ' skirt</p><h2 class="big">' + (r.fabric != null ? n(r.fabric) + ' ' + u + ' of fabric' : 'Fabric too narrow') + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p></div></div><div class="kpis">' +
      kpi('Waist radius', n(r.r) + ' ' + u) + kpi('Cut waistline at', n(r.inner) + ' ' + u) + kpi('Cut hem at', n(r.outer) + ' ' + u) + kpi('Hem circumference', n(r.hemSweep) + ' ' + u) + '</div>' +
      '<p class="meta-line">' + U.esc(S.FACTS.limits) + '</p>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="sk-u">Units</label><select id="sk-u" name="u"><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters</option><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches</option></select></div>' +
      '<div><label class="lbl" for="sk-t">Skirt type</label><select id="sk-t" name="t">' + Object.keys(S.TYPES).map(function (k) { return '<option value="' + k + '"' + (k === st.t ? ' selected' : '') + '>' + S.TYPES[k].name + '</option>'; }).join('') + '</select></div>' +
      FIELDS.map(function (f) { return '<div><label class="lbl" for="sk-' + f[0] + '">' + f[1] + '</label><input type="number" id="sk-' + f[0] + '" name="' + f[0] + '" value="' + U.esc(st[f[0]]) + '" step="0.1" min="0" inputmode="decimal"></div>'; }).join('') + '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=circle-skirt]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 't'].concat(FIELDS.map(function (f) { return f[0]; })).forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.querySelector('[name=u]').addEventListener('change', function (e) {
      var to = e.target.value, f = to === 'in' ? 1 / 2.54 : 2.54;
      if (to !== st.u) FIELDS.forEach(function (fl) { var k = fl[0]; if (isFinite(+st[k]) && st[k] !== '') st[k] = String(Math.round(+st[k] * f * 100) / 100); root.querySelector('[name=' + k + ']').value = st[k]; });
      st.u = to; draw(true);
    });
    root.querySelector('[name=t]').addEventListener('change', function (e) { st.t = e.target.value; draw(true); });
    FIELDS.forEach(function (fl) { root.querySelector('[name=' + fl[0] + ']').addEventListener('input', function (e) { st[fl[0]] = e.target.value; draw(true); }); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
