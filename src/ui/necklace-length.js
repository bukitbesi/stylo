/*! SimplyStylo Necklace Length Visualizer UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/necklace-core.js'));
  else factory(root.SSUI, root.SSNecklace).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, N) {
  'use strict';

  var DEFAULT = { u: 'in', l: '16 18 22' };
  var COLORS = ['#B98A57', '#8E9094', '#C9A227', '#A0522D', '#5A6359', '#7B4B94'];
  function norm(st) { st = st || {}; return { u: st.u === 'cm' ? 'cm' : 'in', l: st.l != null && String(st.l).trim() !== '' ? String(st.l) : DEFAULT.l }; }
  function list(st) { return String(st.l).split(/[\s,;_]+/).filter(Boolean).slice(0, 6); }
  function calc(st) { return N.stack(list(st), st.u); }

  function summary(st) {
    var s = calc(st);
    if (!s.items.length) return 'Enter one or more necklace lengths between 12 and 60 in (30 to 150 cm).';
    return s.items.map(function (i) { return (/^(8|11|18)(\D|$)/.test(String(i.inches)) ? 'An ' : 'A ') + i.inches + ' in (' + i.cm + ' cm) necklace is ' + (/^[AEIOU]/.test(i.type.name) ? 'an ' : 'a ') + i.type.name.toLowerCase() + ' length: ' + i.type.where.charAt(0).toLowerCase() + i.type.where.slice(1); }).join(' ') +
      (s.close.length ? ' Space layered chains about 2 in (5 cm) apart: ' + s.close.map(function (p) { return p[0] + ' and ' + p[1] + ' in'; }).join(', ') + ' will overlap.' : '');
  }

  // Bust silhouette with each necklace drawn as a curve at its depth (0 = mid-neck, 1 = waist).
  function figure(s) {
    var top = 52, bottom = 300, lastLabel = -99, chains = s.items.map(function (it, i) {
      var y = top + it.depth * (bottom - top), ly = Math.max(y + 4, lastLabel + 14);
      var half = 22 + Math.min(1, it.depth * 2.2) * 58, c = COLORS[i % COLORS.length];
      lastLabel = ly;
      return '<path d="M' + (120 - 22) + ' ' + (top - 4) + ' Q' + (120 - half - 6) + ' ' + (y - 6) + ' 120 ' + y + ' Q' + (120 + half + 6) + ' ' + (y - 6) + ' ' + (120 + 22) + ' ' + (top - 4) + '" fill="none" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round"/>' +
        '<circle cx="120" cy="' + (y + 4) + '" r="4.5" fill="' + c + '"/><text x="232" y="' + ly + '" text-anchor="end" font-size="12" font-family="system-ui,sans-serif" fill="#171717">' + it.inches + ' in</text>';
    }).join('');
    return '<svg class="figure figure--fluid figure--tall" width="240" height="320" viewBox="0 0 240 320" role="img" aria-label="Necklaces drawn where they fall on the body">' +
      '<path d="M98 0h44v44c0 6 30 12 56 22 18 8 26 24 30 50l8 204H4l8-204c4-26 12-42 30-50 26-10 56-16 56-22z" fill="#EFE4D4" stroke="#B8A58D" stroke-width="2"/>' +
      '<path d="M60 70q30 10 52 6M180 70q-30 10-52 6" fill="none" stroke="#CDBBA3" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M50 170q35 34 66 6M190 170q-35 34-66 6" fill="none" stroke="#CDBBA3" stroke-width="2" stroke-linecap="round"/>' +
      chains + '</svg>';
  }

  function result(st) {
    var s = calc(st);
    if (!s.items.length) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var rows = s.items.map(function (i, n) {
      return '<li><span class="dot" style="background:' + COLORS[n % COLORS.length] + '"></span><span><b>' + i.inches + ' in (' + i.cm + ' cm): ' + U.esc(i.type.name) + '</b><br>' + U.esc(i.type.where) + ' ' + U.esc(i.type.best) +
        (i.doubled ? ' Doubled, it wears as ' + (/^(8|11|18)(\D|$)/.test(String(i.doubled.inches)) ? 'an ' : 'a ') + i.doubled.inches + ' in ' + U.esc(i.doubled.type.name.toLowerCase()) + '.' : '') + '</span></li>';
    }).join('');
    return '<div class="split"><div>' + figure(s) + '</div><div><p class="eyebrow">Where your necklaces fall</p>' +
      '<ul class="outfit">' + rows + '</ul>' +
      (s.close.length ? '<p class="callout">Chains less than about 2 in (5 cm) apart overlap and tangle: ' + s.close.map(function (p) { return p[0] + ' and ' + p[1] + ' in'; }).join(', ') + '. Try lengths such as 16, 18 and 20 in.</p>' : '') +
      '</div></div>' +
      '<p class="meta-line">Drawn for an average neck of about 14 in (36 cm); on a larger neck each length sits a little higher.</p>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="nl-u">Units</label><select id="nl-u" name="u"><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches</option><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters</option></select></div>' +
      '<div><label class="lbl" for="nl-l">Necklace lengths</label><input type="text" id="nl-l" name="l" value="' + U.esc(st.l) + '" inputmode="decimal" autocomplete="off"><span class="hint">Up to 6 lengths, separated by spaces or commas.</span></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=necklace-length]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash({ u: st.u, l: list(st).join('_') }); }
    root.querySelector('[name=u]').value = st.u; root.querySelector('[name=l]').value = list(st).join(' ');
    root.querySelector('[name=u]').addEventListener('change', function (e) {
      var f = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
      if (e.target.value !== st.u) st.l = list(st).map(function (v) { return isFinite(+v) ? String(Math.round(+v * f * 10) / 10) : v; }).join(' ');
      st.u = e.target.value; root.querySelector('[name=l]').value = st.l; draw(true);
    });
    root.querySelector('[name=l]').addEventListener('input', function (e) { st.l = e.target.value; draw(true); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount, figure: figure };
});
