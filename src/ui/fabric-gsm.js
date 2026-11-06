/*! SimplyStylo Fabric Weight (GSM), Drape & Season Analyzer UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/fabric-core.js'));
  else factory(root.SSUI, root.SSFabric).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, F) {
  'use strict';

  var DEFAULT = { u: 'gsm', v: '240', fb: 'wool' };

  function norm(st) {
    var s = st || {};
    return {
      u: s.u === 'oz' ? 'oz' : 'gsm',
      v: s.v != null && s.v !== '' ? String(s.v) : DEFAULT.v,
      fb: F.FIBERS[s.fb] ? s.fb : DEFAULT.fb
    };
  }

  function calc(st) {
    return F.analyze({ val: st.v, unit: st.u, fiber: st.fb });
  }

  // Technical textile weave & drape curve SVG showing yarn density and fabric fold behavior.
  function fabricSvg(r) {
    // Stiffness of drape curve scales with GSM (60 GSM = tight fluid waves; 500 GSM = wide rigid arch)
    var waveAmp = r.gsm < 160 ? 18 : r.gsm < 300 ? 12 : 6;
    var strokeW = r.gsm < 160 ? 1.4 : r.gsm < 320 ? 2.2 : 3.2;

    return '<svg class="figure" width="170" height="165" viewBox="0 0 170 165" role="img" aria-label="Textile weave and drape diagram for ' + r.gsm + ' GSM ' + U.esc(r.fiber.name) + '">' +
      // Weave grid swatch box
      '<rect x="24" y="20" width="122" height="68" rx="6" fill="#EDE8DD" stroke="#111110" stroke-width="1.3"/>' +
      '<path d="M 38 20 V 88 M 56 20 V 88 M 74 20 V 88 M 92 20 V 88 M 110 20 V 88 M 128 20 V 88 M 24 36 H 146 M 24 54 H 146 M 24 72 H 146" stroke="#B98A57" stroke-width="' + strokeW + '" opacity="0.55"/>' +
      // Drape wave profile at bottom
      '<path d="M 22 126 Q 48 ' + (126 - waveAmp) + ' 68 126 T 112 126 T 148 126" fill="none" stroke="#1C2D22" stroke-width="' + (strokeW + 0.8) + '" stroke-linecap="round"/>' +
      '<text x="85" y="108" text-anchor="middle" font-size="10.5" font-weight="600" fill="#111110">' + r.gsm + ' GSM · ' + r.oz + ' oz/yd²</text>' +
      '<text x="85" y="150" text-anchor="middle" font-size="9.5" fill="#45423E">' + U.esc(r.tier.name.split(' (')[0]) + ' Drape</text>' +
      '</svg>';
  }

  function controls(st) {
    var opt = function (map, cur) {
      return Object.keys(map).map(function (k) {
        return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + U.esc(map[k].name) + '</option>';
      }).join('');
    };
    return '<div class="row">' +
      '<div><label class="lbl" for="fg-v">Fabric weight</label><input type="number" id="fg-v" name="v" value="' + U.esc(st.v) + '" step="5" min="1" max="850" inputmode="decimal" aria-describedby="fg-v-hint"><small class="hint" id="fg-v-hint">Enter 30–850 GSM or 1–25 oz/yd²</small></div>' +
      '<div><label class="lbl" for="fg-u">Weight unit</label><select id="fg-u" name="u"><option value="gsm"' + (st.u === 'gsm' ? ' selected' : '') + '>GSM (g/m² · Metric)</option><option value="oz"' + (st.u === 'oz' ? ' selected' : '') + '>oz/yd² (Ounces · US/UK)</option></select></div>' +
      '<div><label class="lbl" for="fg-fb">Primary fiber / weave</label><select id="fg-fb" name="fb">' + opt(F.FIBERS, st.fb) + '</select></div>' +
      '</div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter a fabric weight between 30 and 850 GSM (or 1 to 25 oz/yd²).';
    return r.gsm + ' GSM (' + r.oz + ' oz/yd²) is a ' + r.tier.name.toLowerCase() + ' fabric ideal for ' + r.tier.tempC + ', commonly used for ' + r.tier.garments.toLowerCase() + '.';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    return '<div class="split"><div>' + fabricSvg(r) + '</div><div><p class="eyebrow">' + U.esc(r.fiber.name) + '</p><h2 class="big">' + r.gsm + ' GSM (' + r.oz + ' oz/yd²)</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">Silk equivalent: ' + r.momme + ' momme · Comfort band: ' + U.esc(r.tier.tempC) + '</p></div></div>' +
      '<div class="kpis">' +
      '<div class="kpi"><span>Metric Weight</span><b>' + r.gsm + ' GSM</b><span>Grams per sq. meter</span></div>' +
      '<div class="kpi"><span>Imperial Weight</span><b>' + r.oz + ' oz/yd²</b><span>Ounces per sq. yard</span></div>' +
      '<div class="kpi"><span>Comfort Range</span><b>' + U.esc(r.tier.tempC.split(' (')[0]) + '</b><span>' + U.esc((r.tier.tempC.split('(')[1] || '').replace(')', '')) + '</span></div>' +
      '<div class="kpi"><span>Silk Momme Equiv.</span><b>' + r.momme + ' mm</b><span>1 mm = 4.31 GSM</span></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="panel"><h3>Best garment applications</h3><p>' + U.esc(r.tier.garments) + '. Opacity: ' + U.esc(r.tier.opacity) + '.</p></div>' +
      '<div class="panel"><h3>Fiber breathability &amp; care</h3><p>' + U.esc(r.fiber.breathability) + '. ' + U.esc(r.fiber.drape) + '. ' + U.esc(r.fiber.care) + '</p></div>' +
      '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=fabric-gsm]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'v', 'fb'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        var val = parseFloat(st.v);
        if (isFinite(val)) {
          st.v = e.target.value === 'oz' ? String(Math.round((val / 33.9057) * 10) / 10) : String(Math.round(val * 33.9057));
          root.querySelector('[name=v]').value = st.v;
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
