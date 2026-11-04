/*! SimplyStylo Face Shape & Sunglasses Matcher UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/face-core.js'));
  else factory(root.SSUI, root.SSFace).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, F) {
  'use strict';

  var DEFAULT = { u: 'cm', f: '13.5', c: '14', j: '11.8', l: '19.5' };
  var FIELDS = [
    ['f', 'Forehead width', 'Across the widest part of your forehead, halfway between eyebrows and hairline'],
    ['c', 'Cheekbone width', 'From the outer corner of one cheekbone to the other across the bridge of your nose'],
    ['j', 'Jawline width', 'Across the widest angle of your jaw, just below your ears'],
    ['l', 'Face length', 'From the center of your hairline straight down to the tip of your chin']
  ];

  function norm(st) {
    var s = st || {}, o = { u: s.u === 'in' ? 'in' : 'cm' };
    FIELDS.forEach(function (fl) {
      o[fl[0]] = s[fl[0]] != null && s[fl[0]] !== '' ? String(s[fl[0]]) : DEFAULT[fl[0]];
    });
    return o;
  }

  function calc(st) {
    return F.classify({ forehead: st.f, cheekbones: st.c, jawline: st.j, length: st.l, unit: st.u });
  }

  // Draws the visitor's face contour and overlays their recommended top sunglasses silhouette.
  function faceSvg(r) {
    var m = r.cm, max = Math.max(m.forehead, m.cheekbones, m.jawline, m.length * 0.78), k = 48 / max;
    var cx = 85, top = 22, len = Math.min(148, Math.max(106, m.length * k * 1.45));
    var bot = top + len;
    var yF = Math.round(top + len * 0.25), yC = Math.round(top + len * 0.50), yJ = Math.round(top + len * 0.78);
    var wF = m.forehead * k, wC = m.cheekbones * k, wJ = m.jawline * k;

    var path = 'M ' + cx + ' ' + top +
      ' C ' + (cx + wF * 0.85).toFixed(1) + ' ' + top + ', ' + (cx + wF).toFixed(1) + ' ' + (yF - 10) + ', ' + (cx + wF).toFixed(1) + ' ' + yF +
      ' C ' + (cx + wC * 1.02).toFixed(1) + ' ' + ((yF + yC) / 2).toFixed(1) + ', ' + (cx + wC).toFixed(1) + ' ' + (yC - 4) + ', ' + (cx + wC).toFixed(1) + ' ' + yC +
      ' C ' + (cx + wC * 0.98).toFixed(1) + ' ' + ((yC + yJ) / 2).toFixed(1) + ', ' + (cx + wJ * 1.02).toFixed(1) + ' ' + (yJ - 6) + ', ' + (cx + wJ).toFixed(1) + ' ' + yJ +
      ' C ' + (cx + wJ * 0.75).toFixed(1) + ' ' + (bot - 4) + ', ' + (cx + 12) + ' ' + bot + ', ' + cx + ' ' + bot +
      ' C ' + (cx - 12) + ' ' + bot + ', ' + (cx - wJ * 0.75).toFixed(1) + ' ' + (bot - 4) + ', ' + (cx - wJ).toFixed(1) + ' ' + yJ +
      ' C ' + (cx - wJ * 1.02).toFixed(1) + ' ' + (yJ - 6) + ', ' + (cx - wC * 0.98).toFixed(1) + ' ' + ((yC + yJ) / 2).toFixed(1) + ', ' + (cx - wC).toFixed(1) + ' ' + yC +
      ' C ' + (cx - wC).toFixed(1) + ' ' + (yC - 4) + ', ' + (cx - wC * 1.02).toFixed(1) + ' ' + ((yF + yC) / 2).toFixed(1) + ', ' + (cx - wF).toFixed(1) + ' ' + yF +
      ' C ' + (cx - wF).toFixed(1) + ' ' + (yF - 10) + ', ' + (cx - wF * 0.85).toFixed(1) + ' ' + top + ', ' + cx + ' ' + top + ' Z';

    // Sunglasses frame overlay at yC - 6
    var gy = yC - 6, gw = Math.max(36, wC * 0.94);
    var glasses = '<g stroke="#1C2D22" stroke-width="2.2" fill="rgba(28,45,34,0.14)">' +
      '<rect x="' + (cx - gw).toFixed(1) + '" y="' + (gy - 11) + '" width="' + (gw - 5).toFixed(1) + '" height="20" rx="6"/>' +
      '<rect x="' + (cx + 5).toFixed(1) + '" y="' + (gy - 11) + '" width="' + (gw - 5).toFixed(1) + '" height="20" rx="6"/>' +
      '<line x1="' + (cx - 5) + '" y1="' + (gy - 5) + '" x2="' + (cx + 5) + '" y2="' + (gy - 5) + '"/>' +
      '</g>';

    var guide = function (yy, w, lbl) {
      return '<line x1="' + (cx - w).toFixed(1) + '" y1="' + yy + '" x2="' + (cx + w).toFixed(1) + '" y2="' + yy + '" stroke="#67625B" stroke-width="1" stroke-dasharray="3 3"/>' +
        '<text x="' + (cx + 50) + '" y="' + (yy + 3) + '" font-size="8.5" fill="#45423E">' + lbl + '</text>';
    };

    return '<svg class="figure" width="170" height="190" viewBox="0 0 170 190" role="img" aria-label="Face contour and sunglasses frame proportion diagram">' +
      '<path d="' + path + '" fill="#EFE9DF" stroke="#A89882" stroke-width="1.6" stroke-linejoin="round"/>' +
      guide(yF, wF, 'Forehead') + guide(yC, wC, 'Cheeks') + guide(yJ, wJ, 'Jaw') +
      glasses + '</svg>';
  }

  function controls(st) {
    return '<div class="row">' + FIELDS.map(function (fl) {
      return '<div><label class="lbl" for="fs-' + fl[0] + '">' + fl[1] + '</label><input type="number" id="fs-' + fl[0] + '" name="' + fl[0] +
        '" value="' + U.esc(st[fl[0]]) + '" step="0.2" min="0" inputmode="decimal" aria-describedby="fs-' + fl[0] + '-hint">' +
        '<small class="hint" id="fs-' + fl[0] + '-hint">' + fl[2] + '</small></div>';
    }).join('') + '<div><label class="lbl" for="fs-u">Unit</label><select id="fs-u" name="u"><option value="cm"' + (st.u === 'cm' ? ' selected' : '') +
      '>Centimeters</option><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches</option></select></div></div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter all four facial measurements (between 7 and 35 cm, or 2.8 and 13.8 in).';
    return 'Your face shape is ' + r.shape.name + ' (length-to-cheekbone ratio ' + r.ratios.lengthCheek + '). Best sunglasses: ' + r.shape.frames.join(', ') + '.';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var rt = r.ratios;
    return '<div class="split"><div>' + faceSvg(r) + '</div><div><p class="eyebrow">Your result</p><h2 class="big">' + U.esc(r.shape.name) + ' Face</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">' + U.esc(r.shape.rule) + '</p></div></div>' +
      '<div class="kpis">' +
      '<div class="kpi"><span>Length ÷ Cheekbones</span><b>' + rt.lengthCheek + '</b></div>' +
      '<div class="kpi"><span>Jaw ÷ Cheekbones</span><b>' + rt.jawCheek + '</b></div>' +
      '<div class="kpi"><span>Forehead ÷ Cheekbones</span><b>' + rt.foreheadCheek + '</b></div>' +
      '<div class="kpi"><span>Best Frame Styles</span><b>' + U.esc(r.shape.frames.slice(0, 2).join(', ')) + '</b></div>' +
      '</div>' +
      '<div class="grid2"><div class="panel"><h3>Best sunglasses and eyewear</h3><p>' + U.esc(r.shape.frames.join(', ')) + '. Avoid: ' + U.esc(r.shape.avoid.charAt(0).toLowerCase() + r.shape.avoid.slice(1)) + '</p></div>' +
      '<div class="panel"><h3>Hairstyles and necklines</h3><p><b>Hair:</b> ' + U.esc(r.shape.hair) + ' <b>Necklines:</b> ' + U.esc(r.shape.collars) + '</p></div></div>' +
      '<h3>Styling tips for an ' + U.esc(r.shape.name.toLowerCase()) + ' face</h3><ul>' + r.shape.tips.map(function (t) { return '<li>' + U.esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=face-shape]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'f', 'c', 'j', 'l'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        var factor = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
        FIELDS.forEach(function (fl) {
          var v = parseFloat(st[fl[0]]);
          if (isFinite(v)) {
            st[fl[0]] = String(Math.round(v * factor * 10) / 10);
            root.querySelector('[name=' + fl[0] + ']').value = st[fl[0]];
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
