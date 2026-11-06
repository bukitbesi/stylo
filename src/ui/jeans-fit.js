/*! SimplyStylo Jeans Rise, Cut & Denim Fit Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/denim-core.js'));
  else factory(root.SSUI, root.SSDenim).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, D) {
  'use strict';

  var DEFAULT = { u: 'in', h: '66', i: '30', w: '28', hp: '39', c: 'straight', s: 'sneakers' };

  function norm(st) {
    var s = st || {};
    var val = function (k) { return s[k] != null && s[k] !== '' ? String(s[k]) : DEFAULT[k]; };
    return {
      u: s.u === 'cm' ? 'cm' : 'in',
      h: val('h'), i: val('i'), w: val('w'), hp: val('hp'),
      c: D.CUTS[s.c] ? s.c : DEFAULT.c,
      s: D.SHOES[s.s] ? s.s : DEFAULT.s
    };
  }

  function calc(st) {
    return D.calculate({ height: st.h, inseam: st.i, waist: st.w, hips: st.hp, cut: st.c, shoe: st.s, unit: st.u });
  }

  // Front-elevation technical denim pattern SVG showing waist rise, hip curve block, knee width, and leg cut.
  function denimSvg(r) {
    var waistY = r.in.frontRise >= 11 ? 20 : r.in.frontRise >= 9.5 ? 26 : 32;
    var crotchY = 66;
    var hipFlare = r.in.curveDiff > 11 ? 8 : r.in.curveDiff < 8.5 ? 2 : 5;
    var kneeW = r.cutId === 'wide' ? 22 : r.cutId === 'barrel' ? 25 : r.cutId === 'slim' ? 14 : 17;
    var hemW = r.cutId === 'wide' ? 24 : r.cutId === 'bootcut' ? 21 : r.cutId === 'slim' ? 13 : 16;

    var leftWaist = 56, rightWaist = 114;
    var leftHip = 48 - hipFlare, rightHip = 122 + hipFlare;

    return '<svg class="figure" width="170" height="180" viewBox="0 0 170 180" role="img" aria-label="Technical denim silhouette for ' + U.esc(r.riseTier) + ' ' + U.esc(r.cut.name) + '">' +
      // Denim body path
      '<path d="M ' + leftWaist + ' ' + waistY + ' L ' + rightWaist + ' ' + waistY +
      ' Q ' + rightHip + ' 45 ' + (96 + kneeW) + ' 110 L ' + (96 + hemW) + ' 164 L ' + (96 - hemW + 14) + ' 164 L 85 ' + crotchY +
      ' L ' + (74 + hemW - 14) + ' 164 L ' + (74 - hemW) + ' 164 L ' + (74 - kneeW) + ' 110 Q ' + leftHip + ' 45 ' + leftWaist + ' ' + waistY + ' Z" fill="#2E4466" stroke="#111110" stroke-width="1.5" stroke-linejoin="round"/>' +
      // Waistband & button
      '<path d="M ' + leftWaist + ' ' + (waistY + 7) + ' L ' + rightWaist + ' ' + (waistY + 7) + '" stroke="#D8B77D" stroke-width="1.1"/>' +
      '<circle cx="85" cy="' + (waistY + 3.5) + '" r="2" fill="#D8B77D"/>' +
      // Front rise J-stitch fly
      '<path d="M 85 ' + (waistY + 7) + ' L 85 ' + (crotchY - 8) + ' Q 85 ' + (crotchY - 3) + ' 91 ' + (crotchY - 3) + '" fill="none" stroke="#D8B77D" stroke-width="1.1"/>' +
      // Front scoop pockets
      '<path d="M ' + (leftWaist + 2) + ' ' + (waistY + 7) + ' Q ' + (leftWaist + 12) + ' ' + (waistY + 20) + ' ' + (leftHip + 4) + ' ' + (waistY + 22) + '" fill="none" stroke="#D8B77D" stroke-width="1.1"/>' +
      '<path d="M ' + (rightWaist - 2) + ' ' + (waistY + 7) + ' Q ' + (rightWaist - 12) + ' ' + (waistY + 20) + ' ' + (rightHip - 4) + ' ' + (waistY + 22) + '" fill="none" stroke="#D8B77D" stroke-width="1.1"/>' +
      // Rise dimension callout
      '<line x1="22" y1="' + waistY + '" x2="22" y2="' + crotchY + '" stroke="#1C2D22" stroke-width="1.2"/>' +
      '<text x="6" y="' + Math.round((waistY + crotchY) / 2 + 3) + '" font-size="9" font-weight="600" fill="#1C2D22">Rise</text>' +
      '</svg>';
  }

  function controls(st) {
    var opt = function (map, cur) {
      return Object.keys(map).map(function (k) {
        return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + U.esc(map[k].name) + '</option>';
      }).join('');
    };
    return '<div class="row">' +
      '<div><label class="lbl" for="jf-u">Unit</label><select id="jf-u" name="u"><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches (in)</option><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters (cm)</option></select></div>' +
      '<div><label class="lbl" for="jf-w">Natural waist</label><input type="number" id="jf-w" name="w" value="' + U.esc(st.w) + '" step="0.5" min="20" max="150" inputmode="decimal"></div>' +
      '<div><label class="lbl" for="jf-hp">Fullest hips</label><input type="number" id="jf-hp" name="hp" value="' + U.esc(st.hp) + '" step="0.5" min="28" max="170" inputmode="decimal"></div>' +
      '<div><label class="lbl" for="jf-h">Total height</label><input type="number" id="jf-h" name="h" value="' + U.esc(st.h) + '" step="0.5" min="54" max="210" inputmode="decimal"></div>' +
      '<div><label class="lbl" for="jf-i">Ankle inseam</label><input type="number" id="jf-i" name="i" value="' + U.esc(st.i) + '" step="0.5" min="22" max="102" inputmode="decimal"></div>' +
      '<div><label class="lbl" for="jf-c">Denim cut</label><select id="jf-c" name="c">' + opt(D.CUTS, st.c) + '</select></div>' +
      '<div><label class="lbl" for="jf-s">Primary footwear</label><select id="jf-s" name="s">' + opt(D.SHOES, st.s) + '</select></div>' +
      '</div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter valid waist, hip, height and inseam measurements to calculate your denim spec.';
    var m = r[r.unit], u = r.unit;
    return 'Your ideal denim spec is a ' + m.frontRise + ' ' + u + ' ' + r.riseTier.toLowerCase() + ' in a ' + r.blockName + ', hemmed to a ' + m.targetInseam + ' ' + u + ' inseam for ' + r.cut.name.toLowerCase() + ' jeans.';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var m = r[r.unit], alt = r[r.unit === 'in' ? 'cm' : 'in'], u = r.unit, au = r.unit === 'in' ? 'cm' : 'in';
    return '<div class="split"><div>' + denimSvg(r) + '</div><div><p class="eyebrow">' + U.esc(r.blockName) + '</p><h2 class="big">' + m.frontRise + ' ' + u + ' ' + U.esc(r.riseTier) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">Hip-to-waist differential: ' + m.curveDiff + ' ' + u + ' (' + alt.curveDiff + ' ' + au + ') · Leg ratio: ' + r.legPct + '%</p></div></div>' +
      '<div class="kpis">' +
      '<div class="kpi"><span>Ideal Front Rise</span><b>' + m.frontRise + ' ' + u + '</b><span>' + alt.frontRise + ' ' + au + ' (' + U.esc(r.riseTier) + ')</span></div>' +
      '<div class="kpi"><span>Target Inseam</span><b>' + m.targetInseam + ' ' + u + '</b><span>' + alt.targetInseam + ' ' + au + ' with shoes</span></div>' +
      '<div class="kpi"><span>Pattern Block</span><b>' + U.esc(r.blockName.split(' ')[0]) + ' Fit</b><span>' + m.curveDiff + ' ' + u + ' hip curve</span></div>' +
      '<div class="kpi"><span>Hem Opening (circum.)</span><b>' + m.legOpening + ' ' + u + '</b><span>' + alt.legOpening + ' ' + au + ' (' + U.esc(r.cut.name.split(' ')[0]) + ')</span></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="panel"><h3>Waistband &amp; hip curve diagnosis</h3><p>' + U.esc(r.blockNote) + '</p></div>' +
      '<div class="panel"><h3>Silhouette &amp; pocket placement</h3><p>' + U.esc(r.cut.bestFor) + ' ' + U.esc(r.cut.pocketTip) + '</p></div>' +
      '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=jeans-fit]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'h', 'i', 'w', 'hp', 'c', 's'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        var factor = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
        ['h', 'i', 'w', 'hp'].forEach(function (f) {
          var v = parseFloat(st[f]);
          if (isFinite(v)) {
            st[f] = String(Math.round(v * factor * 2) / 2);
            root.querySelector('[name=' + f + ']').value = st[f];
          }
        });
      }
      st[k] = e.target.value;
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
