/*! SimplyStylo Hat Size Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/hat-core.js'));
  else factory(root.SSUI, root.SSHat).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, H) {
  'use strict';

  var SYSTEMS = { cm: 'Head circumference (cm)', in: 'Head circumference (inches)', us: 'US fitted hat size' };
  var DEFAULT = { s: 'cm', v: '57' };
  var DEF = { cm: '57', in: '22.4', us: '7.125' };

  function norm(st) { st = st || {}; return { s: SYSTEMS[st.s] ? st.s : 'cm', v: st.v != null && st.v !== '' ? String(st.v) : DEFAULT.v }; }

  function summary(st) {
    var r = H.convert(st.s, st.v);
    if (!r) return 'Enter a head circumference between 45 and 66 cm (about 17¾ to 26 in), or a US hat size between 5⅝ and 8¼.';
    return 'A ' + r.cm + ' cm (' + r.inchLabel + ' in) head is a US fitted hat size ' + r.usLabel + ' and EU size ' + r.eu + '.' +
      (r.between ? ' You are between sizes: try ' + r.usLabel + ' and ' + r.next + '; the larger size fits more comfortably.' : '');
  }

  // Front view of a head with the tape line where the hat band sits.
  function figure(r) {
    return '<svg class="figure figure--fluid" width="190" height="200" viewBox="0 0 190 200" role="img" aria-label="Where to measure: around the head about 1 cm above the ears">' +
      '<path d="M55 182c4-26 16-34 40-36s36 10 40 36" fill="#E8DCCB" stroke="#B8A58D" stroke-width="2"/>' +
      '<ellipse cx="95" cy="88" rx="46" ry="58" fill="#EFE4D4" stroke="#B8A58D" stroke-width="2"/>' +
      '<path d="M50 58c4-30 26-42 45-42s41 12 45 42c-12-12-28-16-45-16s-33 4-45 16z" fill="#6B4A33"/>' +
      '<ellipse cx="48" cy="96" rx="7" ry="13" fill="#E8DCCB" stroke="#B8A58D" stroke-width="2"/><ellipse cx="142" cy="96" rx="7" ry="13" fill="#E8DCCB" stroke="#B8A58D" stroke-width="2"/>' +
      '<path d="M78 98q4-3 8 0M104 98q4-3 8 0M90 120q5 3 10 0" fill="none" stroke="#6B5A48" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M47 76q48 22 96 0" fill="none" stroke="#C0392B" stroke-width="3" stroke-dasharray="6 4"/>' +
      '<path d="M47 76q48-14 96 0" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="3 5" opacity=".6"/>' +
      '<rect x="35" y="3" width="120" height="22" rx="11" fill="#171717"/><text x="95" y="18" text-anchor="middle" font-size="11.5" font-family="system-ui,sans-serif" fill="#fff">' +
      (r ? r.cm + ' cm · US ' + r.usLabel : 'Measure here') + '</text></svg>';
  }

  function result(st) {
    var r = H.convert(st.s, st.v);
    var kpi = function (l, v) { return '<div class="kpi"><span>' + l + '</span><b>' + v + '</b></div>'; };
    if (!r) return '<div class="split"><div>' + figure(null) + '</div><div><p class="summary" data-summary>' + U.esc(summary(st)) + '</p></div></div>';
    return '<div class="split"><div>' + figure(r) + '</div><div><p class="eyebrow">Your hat size</p><h2 class="big">US ' + U.esc(r.usLabel) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p></div></div><div class="kpis">' +
      kpi('US fitted size', U.esc(r.usLabel)) + kpi('EU / metric size', r.eu) + kpi('Circumference', r.cm + ' cm') + kpi('Circumference', U.esc(r.inchLabel) + ' in') + '</div>' +
      '<p class="meta-line">Stretch-fit and S/M/L hats use each brand\'s own ranges: compare your centimeters with the brand\'s chart. UK sizes are not shown because published charts disagree.</p>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="hs-s">I know my</label><select id="hs-s" name="s">' + Object.keys(SYSTEMS).map(function (k) {
      return '<option value="' + k + '"' + (k === st.s ? ' selected' : '') + '>' + SYSTEMS[k] + '</option>';
    }).join('') + '</select></div><div><label class="lbl" for="hs-v">Value</label><input type="number" id="hs-v" name="v" value="' + U.esc(st.v) +
      '" step="0.125" min="0" inputmode="decimal"></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=hat-size]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    root.querySelector('[name=s]').value = st.s; root.querySelector('[name=v]').value = st.v;
    root.querySelector('[name=s]').addEventListener('change', function (e) {
      var r = H.convert(st.s, st.v);
      st.s = e.target.value;
      st.v = r ? String(st.s === 'us' ? r.us : st.s === 'in' ? r.inches : r.cm) : DEF[st.s];
      root.querySelector('[name=v]').value = st.v;
      draw(true);
    });
    root.querySelector('[name=v]').addEventListener('input', function (e) { st.v = e.target.value; draw(true); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount, figure: figure };
});
