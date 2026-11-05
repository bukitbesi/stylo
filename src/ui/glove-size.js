/*! SimplyStylo Glove Size Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/glove-core.js'));
  else factory(root.SSUI, root.SSGlove).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, G) {
  'use strict';

  var DEFAULT = { u: 'cm', c: '20.3', l: '18.2' };
  function norm(st) {
    st = st || {};
    return { u: st.u === 'in' ? 'in' : 'cm', c: st.c != null && st.c !== '' ? String(st.c) : DEFAULT.c, l: st.l != null ? String(st.l) : DEFAULT.l };
  }
  function mm(st, v) { return v === '' ? '' : +v * (st.u === 'in' ? 25.4 : 10); }
  function calc(st) { return G.size(mm(st, st.c), mm(st, st.l)); }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter your hand circumference: about 15 to 28 cm (6 to 11 in) around the palm.';
    var s = 'A hand ' + (r.circ / 10) + ' cm (' + r.inches + ' in) around is glove size ' + r.size + ' (EN ISO 21420).';
    if (!r.inStandard) s += ' That is outside the standard 6 to 11 range, so check the brand\'s own chart.';
    if (r.lengthSize && r.lengthSize !== r.size) s += ' Your hand length matches size ' + r.lengthSize + ', so try both sizes or a model cut for ' + (r.lengthSize > r.size ? 'longer' : 'shorter') + ' fingers.';
    return s;
  }

  // Open hand with the circumference band (around the palm) and the length line (wrist crease to middle fingertip).
  function figure(r) {
    return '<svg class="figure figure--fluid" width="170" height="220" viewBox="0 0 170 220" role="img" aria-label="Where to measure: around the palm below the knuckles, and from the wrist crease to the middle fingertip">' +
      '<path d="M52 205V150c-14-12-26-30-34-46-4-8 4-14 10-8l20 22V40c0-8 12-8 12 0v58V24c0-8 12-8 12 0v74V20c0-8 12-8 12 0v78V34c0-8 12-8 12 0v80c0 18-4 30-12 38v53z" fill="#EFE4D4" stroke="#B8A58D" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M46 112h74" stroke="#C0392B" stroke-width="4" stroke-dasharray="7 4"/>' +
      '<path d="M146 22v164" stroke="#1F4FB0" stroke-width="2"/><path d="M141 22h10M141 186h10" stroke="#1F4FB0" stroke-width="2"/><path d="M50 186h70" stroke="#1F4FB0" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '<text x="83" y="132" text-anchor="middle" font-size="11" font-family="system-ui,sans-serif" fill="#8C2A20">' + (r ? r.circ / 10 + ' cm around' : 'Around palm') + '</text>' +
      '<text x="140" y="108" text-anchor="end" font-size="11" font-family="system-ui,sans-serif" fill="#173B85" transform="rotate(-90 140 108)">' + (r && r.len ? r.len / 10 + ' cm long' : 'Hand length') + '</text>' +
      '</svg>';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<div class="split"><div>' + figure(null) + '</div><div><p class="summary" data-summary>' + U.esc(summary(st)) + '</p></div></div>';
    var rows = G.table().map(function (t) {
      return '<tr' + (t.size === r.size ? ' class="is-match"' : '') + '><th scope="row">' + t.size + (t.size === r.size ? ' ✓' : '') + '</th><td>' + t.circ / 10 + ' cm (' + t.inches + ' in)</td><td>' + t.len / 10 + ' cm</td></tr>';
    }).join('');
    return '<div class="split"><div>' + figure(r) + '</div><div><p class="eyebrow">Your glove size</p><h2 class="big">Size ' + r.size + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p></div></div>' +
      '<div class="table-wrap"><table><caption>EN ISO 21420 glove sizes (your size marked)</caption><thead><tr><th scope="col">Size</th><th scope="col">Around the palm</th><th scope="col">Length</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="meta-line">Letter sizes (S, M, L) differ by brand, so compare the number size or your centimeters with the brand\'s chart.</p>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="gs-u">Units</label><select id="gs-u" name="u"><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters</option><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches</option></select></div>' +
      '<div><label class="lbl" for="gs-c">Hand circumference</label><input type="number" id="gs-c" name="c" value="' + U.esc(st.c) + '" step="0.1" min="0" inputmode="decimal"><span class="hint">Around the palm below the knuckles, thumb out.</span></div>' +
      '<div><label class="lbl" for="gs-l">Hand length (optional)</label><input type="number" id="gs-l" name="l" value="' + U.esc(st.l) + '" step="0.1" min="0" inputmode="decimal"><span class="hint">Wrist crease to middle fingertip.</span></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=glove-size]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'c', 'l'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.querySelector('[name=u]').addEventListener('change', function (e) {
      // Keep the same hand when switching units.
      var f = e.target.value === 'in' ? 1 / 2.54 : 2.54;
      if (e.target.value !== st.u) ['c', 'l'].forEach(function (k) { if (st[k] !== '' && isFinite(+st[k])) st[k] = String(Math.round(+st[k] * f * 10) / 10); root.querySelector('[name=' + k + ']').value = st[k]; });
      st.u = e.target.value; draw(true);
    });
    ['c', 'l'].forEach(function (k) { root.querySelector('[name=' + k + ']').addEventListener('input', function (e) { st[k] = e.target.value; draw(true); }); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
