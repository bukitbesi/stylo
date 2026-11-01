/*! SimplyStylo Ring Size Converter UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/ring-core.js'));
  else factory(root.SSUI, root.SSRing).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, R) {
  'use strict';

  var SYSTEMS = { us: 'US / Canada size', eu: 'EU / ISO size', diameter: 'Inner diameter (mm)', circumference: 'Inner circumference (mm)' };
  var DEFAULT = { s: 'us', v: '7' };

  function norm(st) { st = st || {}; return { s: SYSTEMS[st.s] ? st.s : 'us', v: st.v != null && st.v !== '' ? String(st.v) : DEFAULT.v }; }
  function f(x) { return String(x).replace(/\.0$/, ''); }
  function usLabel(us) { return f(us).replace(/\.25$/, '¼').replace(/\.5$/, '½').replace(/\.75$/, '¾'); }

  function summary(st) {
    var r = R.convert(st.s, st.v);
    if (!r) return 'Enter a valid ' + SYSTEMS[st.s].toLowerCase() + ' (adult rings, about US 1 to 18).';
    return SYSTEMS[st.s] + ' ' + st.v + ' is about US ' + usLabel(r.us) + ' and EU/ISO ' + r.eu + ', an inner diameter of ' + r.diameter + ' mm (' + r.circumference + ' mm around).';
  }

  function result(st) {
    var r = R.convert(st.s, st.v);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var kpi = function (l, v) { return '<div class="kpi"><span>' + l + '</span><b>' + v + '</b></div>'; };
    return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><div class="kpis">' + kpi('US / Canada', usLabel(r.us)) + kpi('EU / ISO 8653', r.eu) +
      kpi('Inner diameter', r.diameter + ' mm') + kpi('Inner circumference', r.circumference + ' mm') + '</div>' +
      '<p class="meta-line">US sizes are rounded to the nearest quarter size. Wide bands (over 6 mm) usually need a quarter to half size larger.</p>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="rs-s">I know my</label><select id="rs-s" name="s">' + Object.keys(SYSTEMS).map(function (k) {
      return '<option value="' + k + '"' + (k === st.s ? ' selected' : '') + '>' + SYSTEMS[k] + '</option>';
    }).join('') + '</select></div><div><label class="lbl" for="rs-v">Value</label><input type="number" id="rs-v" name="v" value="' + U.esc(st.v) +
      '" step="0.25" min="0" inputmode="decimal"></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=ring-size]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    var DEF = { us: '7', eu: '54', diameter: '17.3', circumference: '54.4' };
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    root.querySelector('[name=s]').value = st.s; root.querySelector('[name=v]').value = st.v;
    root.querySelector('[name=s]').addEventListener('change', function (e) {
      // Keep the same ring when the system changes: convert the current value into the new system.
      var r = R.convert(st.s, st.v);
      st.s = e.target.value;
      st.v = r ? String(st.s === 'us' ? r.us : st.s === 'eu' ? r.eu : r[st.s]) : DEF[st.s];
      root.querySelector('[name=v]').value = st.v;
      draw(true);
    });
    root.querySelector('[name=v]').addEventListener('input', function (e) { st.v = e.target.value; draw(true); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, usLabel: usLabel, mount: mount };
});
