/*! SimplyStylo Body Shape Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/body-core.js'));
  else factory(root.SSUI, root.SSBody).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, B) {
  'use strict';

  var DEFAULT = { u: 'in', b: '36', w: '27', hh: '34', h: '37' };
  var FIELDS = [['b', 'Bust', 'Around the fullest part of the bust'], ['w', 'Waist', 'Around the narrowest part of the waist'],
    ['hh', 'High hip', 'About 4 in (10 cm) below the waist, over the hip bones'], ['h', 'Hips', 'Around the fullest part of the hips and seat']];

  function norm(st) {
    var s = st || {}, o = { u: s.u === 'cm' ? 'cm' : 'in' };
    FIELDS.forEach(function (f) { o[f[0]] = s[f[0]] != null && s[f[0]] !== '' ? String(s[f[0]]) : DEFAULT[f[0]]; });
    return o;
  }
  function calc(st) { return B.classify({ bust: st.b, waist: st.w, highHip: st.hh, hips: st.h, unit: st.u }); }

  // A front-view figure drawn to the visitor's proportions: widths scale with bust, waist, high hip and hips.
  function figure(r) {
    var m = r.inches, max = Math.max(m.bust, m.hips, m.highHip, m.waist), k = 46 / max;
    var y = { bust: 52, waist: 96, hh: 118, hips: 140 }, cx = 60;
    var w = function (v) { return v * k; };
    var pts = [[cx - w(m.bust) * 0.86, 34], [cx - w(m.bust), y.bust], [cx - w(m.waist), y.waist], [cx - w(m.highHip), y.hh], [cx - w(m.hips), y.hips],
      [cx - w(m.hips) * 0.9, 176], [cx + w(m.hips) * 0.9, 176], [cx + w(m.hips), y.hips], [cx + w(m.highHip), y.hh], [cx + w(m.waist), y.waist],
      [cx + w(m.bust), y.bust], [cx + w(m.bust) * 0.86, 34]];
    var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1]; }).join(' L') + ' Z';
    var line = function (yy, v, label) {
      return '<line x1="' + (cx - w(v)).toFixed(1) + '" y1="' + yy + '" x2="' + (cx + w(v)).toFixed(1) + '" y2="' + yy + '" stroke="#5A6359" stroke-width="1.2" stroke-dasharray="3 3"/>' +
        '<text x="' + (cx + 56) + '" y="' + (yy + 4) + '" font-size="9" fill="#4E4B46">' + label + '</text>';
    };
    return '<svg class="figure" width="170" height="190" viewBox="0 0 170 190" role="img" aria-label="Figure drawn to your proportions">' +
      '<circle cx="60" cy="16" r="11" fill="#DED8CE"/><rect x="55" y="25" width="10" height="9" fill="#DED8CE"/>' +
      '<path d="' + d + '" fill="#E8DCCB" stroke="#B8A58D" stroke-width="1.5" stroke-linejoin="round"/>' +
      line(y.bust, m.bust, 'Bust') + line(y.waist, m.waist, 'Waist') + line(y.hh, m.highHip, 'High hip') + line(y.hips, m.hips, 'Hips') + '</svg>';
  }

  function controls(st) {
    return '<div class="row">' + FIELDS.map(function (f) {
      return '<div><label class="lbl" for="bs-' + f[0] + '">' + f[1] + '</label><input type="number" id="bs-' + f[0] + '" name="' + f[0] +
        '" value="' + U.esc(st[f[0]]) + '" step="0.5" min="0" inputmode="decimal" aria-describedby="bs-' + f[0] + '-hint">' +
        '<small class="hint" id="bs-' + f[0] + '-hint">' + f[2] + '</small></div>';
    }).join('') + '<div><label class="lbl" for="bs-u">Unit</label><select id="bs-u" name="u"><option value="in"' + (st.u === 'in' ? ' selected' : '') +
      '>Inches</option><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters</option></select></div></div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter all four measurements (between 15 and 80 inches, or 38 and 203 cm).';
    return 'Your body shape is ' + r.shape.name + ': ' + r.shape.look.charAt(0).toLowerCase() + r.shape.look.slice(1);
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var d = r.diffs;
    return '<div class="split"><div>' + figure(r) + '</div><div><p class="eyebrow">Your result</p><h2 class="big">' + U.esc(r.shape.name) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">' + U.esc(r.shape.rule) + '</p></div></div>' +
      '<div class="kpis"><div class="kpi"><span>Bust − hips</span><b>' + d.bustHips + ' in</b></div><div class="kpi"><span>Bust − waist</span><b>' + d.bustWaist +
      ' in</b></div><div class="kpi"><span>Hips − waist</span><b>' + d.hipsWaist + ' in</b></div><div class="kpi"><span>High hip ÷ waist</span><b>' + d.highHipWaist + '</b></div></div>' +
      '<h3>How to dress a ' + U.esc(r.shape.name.toLowerCase()) + ' shape</h3><ul>' + r.shape.tips.map(function (t) { return '<li>' + U.esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=body-shape]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'b', 'w', 'hh', 'h'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        // Switching unit converts the numbers so the figure stays the same.
        var f = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
        FIELDS.forEach(function (fl) { var v = parseFloat(st[fl[0]]); if (isFinite(v)) { st[fl[0]] = String(Math.round(v * f * 2) / 2); root.querySelector('[name=' + fl[0] + ']').value = st[fl[0]]; } });
      }
      st[k] = e.target.value;
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
