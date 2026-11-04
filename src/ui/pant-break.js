/*! SimplyStylo Trouser Hem & Pant Break Guide UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/pant-core.js'));
  else factory(root.SSUI, root.SSPant).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, P) {
  'use strict';

  var DEFAULT = { u: 'in', i: '31', b: 'quarter', s: 'oxfords', f: 'tailored', c: 'no' };

  function norm(st) {
    var s = st || {};
    return {
      u: s.u === 'cm' ? 'cm' : 'in',
      i: s.i != null && s.i !== '' ? String(s.i) : DEFAULT.i,
      b: P.BREAKS[s.b] ? s.b : DEFAULT.b,
      s: P.SHOES[s.s] ? s.s : DEFAULT.s,
      f: P.FITS[s.f] ? s.f : DEFAULT.f,
      c: s.c === 'yes' ? 'yes' : 'no'
    };
  }

  function calc(st) {
    return P.calculate({ inseam: st.i, brk: st.b, shoe: st.s, fit: st.f, cuff: st.c, unit: st.u });
  }

  // Side-elevation Savile Row trouser & shoe silhouette showing exact hem height, break fold, and optional turn-up cuff.
  function breakSvg(r) {
    // Hem Y position scales from 106 (cropped) down to 132 (full break)
    var hemY = { cropped: 106, none: 117, quarter: 121, half: 126, full: 132 }[r.brkId] || 121;
    var legW = { slim: 38, tailored: 44, relaxed: 52 }[r.fitId] || 44;
    var leftX = 48, rightX = leftX + legW;
    var crease = r.brk.crease;

    // Front trouser leg edge: straight for cropped/no-break, dimpled for quarter/half/full break
    var frontEdge = crease === 0
      ? 'L ' + rightX + ' ' + hemY
      : crease === 1
      ? 'L ' + rightX + ' ' + (hemY - 16) + ' L ' + (rightX - 4) + ' ' + (hemY - 8) + ' L ' + (rightX + 1) + ' ' + hemY
      : crease === 2
      ? 'L ' + rightX + ' ' + (hemY - 22) + ' L ' + (rightX - 6) + ' ' + (hemY - 11) + ' L ' + (rightX + 2) + ' ' + hemY
      : 'L ' + rightX + ' ' + (hemY - 28) + ' L ' + (rightX - 7) + ' ' + (hemY - 18) + ' L ' + (rightX + 2) + ' ' + (hemY - 8) + ' L ' + (rightX - 4) + ' ' + hemY;

    // Back trouser leg drops slightly lower toward the heel (military slant)
    var backHemY = Math.min(136, hemY + 3);
    var pantPath = 'M ' + (leftX + 2) + ' 14 L ' + (rightX - 2) + ' 14 ' + frontEdge + ' L ' + leftX + ' ' + backHemY + ' Z';

    var cuffRect = r.cuffed
      ? '<rect x="' + leftX + '" y="' + (hemY - 10) + '" width="' + (legW + 1) + '" height="11" rx="1" fill="#2A3A2E" stroke="#111110" stroke-width="1.2"/>'
      : '';

    var foldLines = crease >= 1
      ? '<path d="M ' + (rightX - 18) + ' ' + (hemY - 9) + ' Q ' + (rightX - 7) + ' ' + (hemY - 6) + ' ' + (rightX - 3) + ' ' + (hemY - 8) + '" fill="none" stroke="#111110" stroke-width="1.2" stroke-linecap="round"/>' +
        (crease >= 2 ? '<path d="M ' + (rightX - 22) + ' ' + (hemY - 17) + ' Q ' + (rightX - 10) + ' ' + (hemY - 14) + ' ' + (rightX - 5) + ' ' + (hemY - 15) + '" fill="none" stroke="#111110" stroke-width="1.1" stroke-linecap="round"/>' : '')
      : '';

    return '<svg class="figure" width="170" height="175" viewBox="0 0 170 175" role="img" aria-label="Side profile diagram of ' + U.esc(r.brk.name) + ' trouser hem over shoe">' +
      // Sock / ankle
      '<rect x="' + (leftX + 8) + '" y="96" width="24" height="44" fill="#D8D2C5" stroke="#A89882" stroke-width="1"/>' +
      // Shoe upper + welt + heel
      '<path d="M 44 152 Q 43 132 52 128 L 70 128 Q 84 118 96 122 Q 114 130 132 135 Q 142 138 140 148 L 44 148 Z" fill="#4A3222" stroke="#1F1610" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M 41 148 H 142 V 153 Q 142 155 138 155 H 74 V 160 H 43 V 155 Q 41 155 41 152 Z" fill="#231B16"/>' +
      // Trouser leg
      '<path d="' + pantPath + '" fill="#36483B" stroke="#111110" stroke-width="1.5" stroke-linejoin="round"/>' +
      // Center press crease
      '<line x1="' + (leftX + legW * 0.55).toFixed(1) + '" y1="18" x2="' + (leftX + legW * 0.55).toFixed(1) + '" y2="' + (hemY - 6) + '" stroke="rgba(250,248,245,0.35)" stroke-width="1" stroke-dasharray="4 3"/>' +
      foldLines +
      cuffRect +
      // Hem reference marker line
      '<line x1="18" y1="' + hemY + '" x2="152" y2="' + hemY + '" stroke="#A89882" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<text x="16" y="' + (hemY - 4) + '" font-size="9" fill="#45423E">Hem</text>' +
      '</svg>';
  }

  function controls(st) {
    var opt = function (map, cur) {
      return Object.keys(map).map(function (k) {
        return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + U.esc(map[k].name) + '</option>';
      }).join('');
    };
    return '<div class="row">' +
      '<div><label class="lbl" for="pb-i">No-break body inseam</label><input type="number" id="pb-i" name="i" value="' + U.esc(st.i) + '" step="0.25" min="20" max="105" inputmode="decimal" aria-describedby="pb-i-hint"><small class="hint" id="pb-i-hint">Crotch seam straight down to the top of your shoe vamp</small></div>' +
      '<div><label class="lbl" for="pb-u">Unit</label><select id="pb-u" name="u"><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches (in)</option><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters (cm)</option></select></div>' +
      '<div><label class="lbl" for="pb-b">Trouser break style</label><select id="pb-b" name="b">' + opt(P.BREAKS, st.b) + '</select></div>' +
      '<div><label class="lbl" for="pb-s">Primary footwear</label><select id="pb-s" name="s">' + opt(P.SHOES, st.s) + '</select></div>' +
      '<div><label class="lbl" for="pb-f">Trouser cut / fit</label><select id="pb-f" name="f">' + opt(P.FITS, st.f) + '</select></div>' +
      '<div><label class="lbl" for="pb-c">Turn-up cuffs</label><select id="pb-c" name="c"><option value="no"' + (st.c === 'no' ? ' selected' : '') + '>Plain hem (no cuff)</option><option value="yes"' + (st.c === 'yes' ? ' selected' : '') + '>Turn-up cuff</option></select></div>' +
      '</div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter a body inseam between 22 and 40 inches (56 to 101 cm).';
    var m = r[r.unit], u = r.unit;
    var sign = m.delta > 0 ? '+' + m.delta : String(m.delta);
    return 'For a ' + r.brk.name + ' with ' + r.shoe.name.toLowerCase() + ', hem your trousers to ' + m.targetInseam + ' ' + u + ' (' + sign + ' ' + u + ' from baseline) with a ' + m.opening + ' ' + u + ' leg opening.';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var m = r[r.unit], alt = r[r.unit === 'in' ? 'cm' : 'in'], u = r.unit, au = r.unit === 'in' ? 'cm' : 'in';
    var sign = m.delta > 0 ? '+' + m.delta : String(m.delta);
    return '<div class="split"><div>' + breakSvg(r) + '</div><div><p class="eyebrow">Tailor specification</p><h2 class="big">' + m.targetInseam + ' ' + u + ' Inseam</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">' + U.esc(r.brk.look) + '</p></div></div>' +
      (r.warning ? '<p class="callout">' + U.esc(r.warning) + '</p>' : '') +
      '<div class="kpis">' +
      '<div class="kpi"><span>Finished Inseam</span><b>' + m.targetInseam + ' ' + u + '</b><span>' + alt.targetInseam + ' ' + au + '</span></div>' +
      '<div class="kpi"><span>Break Offset</span><b>' + sign + ' ' + u + '</b><span>' + r.brk.name + '</span></div>' +
      '<div class="kpi"><span>Leg Opening (flat)</span><b>' + m.opening + ' ' + u + '</b><span>' + alt.opening + ' ' + au + '</span></div>' +
      '<div class="kpi"><span>' + (r.cuffed ? 'Recommended Cuff' : 'Unhemmed Cloth Needed') + '</span><b>' + (r.cuffed ? m.cuffHeight : m.clothRequired) + ' ' + u + '</b><span>' + (r.cuffed ? alt.cuffHeight + ' ' + au + ' turn-up' : 'Includes hem allowance') + '</span></div>' +
      '</div>' +
      '<div class="grid2"><div class="panel"><h3>What to tell your tailor</h3><p>Ask for a <b>' + U.esc(r.brk.name.toLowerCase()) + '</b> (' + m.targetInseam + ' ' + u + ' inseam) tapered to a <b>' + m.opening + ' ' + u + '</b> leg opening' + (r.cuffed ? ' with a <b>' + m.cuffHeight + ' ' + u + ' turn-up cuff</b>' : ' with a slight military slant toward the heel') + '.</p></div>' +
      '<div class="panel"><h3>Footwear &amp; fit pairing</h3><p>' + U.esc(r.shoe.note) + ' ' + U.esc(r.fit.note) + '</p></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=pant-break]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'i', 'b', 's', 'f', 'c'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        var factor = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
        var v = parseFloat(st.i);
        if (isFinite(v)) {
          st.i = String(Math.round(v * factor * 4) / 4);
          root.querySelector('[name=i]').value = st.i;
        }
      }
      st[k] = e.target.value;
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
