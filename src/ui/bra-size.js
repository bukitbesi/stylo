/*! SimplyStylo Bra & Band Sister-Size Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/bra-core.js'));
  else factory(root.SSUI, root.SSBra).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, B) {
  'use strict';

  var DEFAULT = { u: 'in', ub: '32', b: '36', f: 'snug' };

  function norm(st) {
    var s = st || {};
    return {
      u: s.u === 'cm' ? 'cm' : 'in',
      ub: s.ub != null && s.ub !== '' ? String(s.ub) : DEFAULT.ub,
      b: s.b != null && s.b !== '' ? String(s.b) : DEFAULT.b,
      f: s.f === 'comfort' ? 'comfort' : 'snug'
    };
  }

  function calc(st) {
    return B.calculate({ underbust: st.ub, bust: st.b, fit: st.f, unit: st.u });
  }

  // Technical anatomical bra fit diagram showing level underband (80% support), center gore tack, and cup encapsulation.
  function braSvg(r) {
    return '<svg class="figure" width="170" height="165" viewBox="0 0 170 165" role="img" aria-label="Technical bra fit diagram for ' + U.esc(r.primary.uk) + ' showing level underband and center gore">' +
      // Torso outline
      '<path d="M 38 18 L 36 150 M 132 18 L 134 150" stroke="#A89882" stroke-width="1.3" stroke-linecap="round"/>' +
      // Straps
      '<path d="M 52 20 L 52 62 M 118 20 L 118 62" stroke="#1C2D22" stroke-width="2.2" stroke-linecap="round"/>' +
      // Underband (level horizontal anchor)
      '<rect x="36" y="102" width="98" height="11" rx="2" fill="#E6E1D8" stroke="#111110" stroke-width="1.4"/>' +
      // Left & Right Cups
      '<path d="M 37 102 Q 36 62 56 60 Q 79 62 82 94 L 82 102 Z" fill="#E8B9B0" stroke="#111110" stroke-width="1.4"/>' +
      '<path d="M 133 102 Q 134 62 114 60 Q 91 62 88 94 L 88 102 Z" fill="#E8B9B0" stroke="#111110" stroke-width="1.4"/>' +
      // Center Gore bridge
      '<rect x="82" y="88" width="6" height="14" fill="#1C2D22"/>' +
      // Underwire curve callout
      '<path d="M 40 98 Q 60 112 81 94 M 89 94 Q 110 112 130 98" fill="none" stroke="#1C2D22" stroke-width="1.8"/>' +
      // Measurement labels
      '<text x="85" y="46" text-anchor="middle" font-size="11" font-weight="600" fill="#111110">UK ' + U.esc(r.primary.uk) + ' · US ' + U.esc(r.primary.us) + '</text>' +
      '<text x="85" y="132" text-anchor="middle" font-size="9.5" fill="#45423E">Band: ' + r.primary.band + ' · EU ' + U.esc(r.primary.eu) + '</text>' +
      '</svg>';
  }

  function controls(st) {
    return '<div class="row">' +
      '<div><label class="lbl" for="br-u">Unit</label><select id="br-u" name="u"><option value="in"' + (st.u === 'in' ? ' selected' : '') + '>Inches (in)</option><option value="cm"' + (st.u === 'cm' ? ' selected' : '') + '>Centimeters (cm)</option></select></div>' +
      '<div><label class="lbl" for="br-ub">Snug underbust</label><input type="number" id="br-ub" name="ub" value="' + U.esc(st.ub) + '" step="0.5" min="24" max="125" inputmode="decimal" aria-describedby="br-ub-hint"><small class="hint" id="br-ub-hint">Measure level around ribcage directly under the bust</small></div>' +
      '<div><label class="lbl" for="br-b">Full bust</label><input type="number" id="br-b" name="b" value="' + U.esc(st.b) + '" step="0.5" min="26" max="160" inputmode="decimal" aria-describedby="br-b-hint"><small class="hint" id="br-b-hint">Measure loosely across the fullest part of the bust</small></div>' +
      '<div><label class="lbl" for="br-f">Band fit preference</label><select id="br-f" name="f"><option value="snug"' + (st.f === 'snug' ? ' selected' : '') + '>Standard anatomical (+0 method)</option><option value="comfort"' + (st.f === 'comfort' ? ' selected' : '') + '>Relaxed / comfort band (size up when between bands)</option></select></div>' +
      '</div>';
  }

  function summary(st) {
    var r = calc(st);
    if (!r) return 'Enter a valid underbust (24–48 in / 61–122 cm) and full bust measurement (must be at least your underbust).';
    return 'With a ' + (r.unit === 'cm' ? r.underCm + ' cm' : r.underIn + ' in') + ' underbust and ' + (r.unit === 'cm' ? r.bustCm + ' cm' : r.bustIn + ' in') + ' full bust (' + r.diffIn + ' in difference), your anatomical size is UK ' + r.primary.uk + ' / US ' + r.primary.us + ' / EU ' + r.primary.eu + '.';
  }

  function result(st) {
    var r = calc(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    return '<div class="split"><div>' + braSvg(r) + '</div><div><p class="eyebrow">Anatomical +0 fit result</p><h2 class="big">UK ' + U.esc(r.primary.uk) + ' · US ' + U.esc(r.primary.us) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p class="meta-line">EU ' + U.esc(r.primary.eu) + ' · AU/NZ ' + U.esc(r.primary.au) + ' · Est. cup volume: ~' + r.volumeCc + ' cc</p></div></div>' +
      '<div class="kpis">' +
      '<div class="kpi"><span>UK /US Size</span><b>' + U.esc(r.primary.uk) + ' / ' + U.esc(r.primary.us) + '</b><span>Primary anatomical fit</span></div>' +
      '<div class="kpi"><span>EU / AU Size</span><b>' + U.esc(r.primary.eu) + ' / ' + U.esc(r.primary.au) + '</b><span>International labels</span></div>' +
      '<div class="kpi"><span>Sister Size Down</span><b>' + (r.sisterDown ? 'UK ' + U.esc(r.sisterDown.uk) : '—') + '</b><span>' + (r.sisterDown ? 'US ' + U.esc(r.sisterDown.us) + ' (firmer band)' : 'Minimum band') + '</span></div>' +
      '<div class="kpi"><span>Sister Size Up</span><b>' + (r.sisterUp ? 'UK ' + U.esc(r.sisterUp.uk) : '—') + '</b><span>' + (r.sisterUp ? 'US ' + U.esc(r.sisterUp.us) + ' (looser band)' : 'Maximum band') + '</span></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="panel"><h3>How sister sizes work</h3><p>Cup letters are proportional to band size, not static volumes. Your <b>UK ' + U.esc(r.primary.uk) + '</b> holds the exact same cup volume (~' + r.volumeCc + ' cc) as ' +
      (r.sisterDown ? '<b>UK ' + U.esc(r.sisterDown.uk) + '</b> on a snugger band' : '') + (r.sisterDown && r.sisterUp ? ' and ' : '') + (r.sisterUp ? '<b>UK ' + U.esc(r.sisterUp.uk) + '</b> on a looser band' : '') + '.</p></div>' +
      '<div class="panel"><h3>Why store charts say ' + U.esc(r.legacySize.uk) + ' (+4 rule)</h3><p>Legacy charts add 4 inches to your underbust, putting you in <b>' + U.esc(r.legacySize.uk) + '</b>. Modern elastic fabrics do not need +4 inches: a band 4 inches larger than your ribcage rides up the back and drops support onto your shoulders.</p></div>' +
      '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=bra-size]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    ['u', 'ub', 'b', 'f'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || !(k in DEFAULT)) return;
      if (k === 'u' && st.u !== e.target.value) {
        var factor = e.target.value === 'cm' ? 2.54 : 1 / 2.54;
        ['ub', 'b'].forEach(function (f) {
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
