/*! SimplyStylo International Size Converter UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/size-core.js'));
  else factory(root.SSUI, root.SSSize).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, S) {
  'use strict';

  var KINDS = {
    shoes: { label: 'Shoes (adult)', systems: { uk: 'UK', usMen: "US men's", usWomen: "US women's", eu: 'EU', cm: 'Foot length (cm)', in: 'Foot length (in)', mondo: 'Mondopoint (mm)' }, def: ['uk', '8'] },
    women: { label: "Women's clothing (dresses, tops)", systems: { us: 'US', uk: 'UK', au: 'AU', eu: 'EU' }, def: ['us', '8'] },
    jacket: { label: "Men's suits & jackets", systems: { us: 'US / UK chest (in)', eu: 'EU' }, def: ['us', '40'] },
    collar: { label: "Men's shirt collar", systems: { in: 'Inches', cm: 'Centimeters' }, def: ['in', '15.5'] }
  };
  var DEFAULT = { k: 'shoes', s: 'uk', v: '8' };

  function fmt(x) { return String(x).replace(/\.0$/, ''); }
  function kpi(label, value) { return '<div class="kpi"><span>' + U.esc(label) + '</span><b>' + U.esc(value) + '</b></div>'; }

  function compute(st) {
    var v = parseFloat(st.v);
    if (st.k === 'shoes') return S.convertShoe(st.s, v);
    if (st.k === 'women') return S.womenFrom(st.s, v);
    if (st.k === 'jacket') return S.menJacket(st.s === 'eu' ? v - 10 : v);
    if (st.k === 'collar') return st.s === 'cm' ? { in: Math.round(v / 2.54 * 2) / 2, cm: Math.round(v) } : S.collar(v);
    return null;
  }

  function summary(st) {
    var r = compute(st), from = KINDS[st.k].systems[st.s] + ' ' + st.v;
    if (!r) return 'Enter a valid ' + KINDS[st.k].systems[st.s] + ' size to convert.';
    if (st.k === 'shoes') return from + ' is about UK ' + fmt(r.uk) + ', US men ' + fmt(r.usMen) + ', US women ' + r.usWomen.join('–') + ' and EU ' + fmt(r.eu) + ' (foot length ' + r.footCm + ' cm).';
    if (st.k === 'women') return from + ' is US ' + r.us + ', UK ' + r.uk + ', AU ' + r.au + ' and EU ' + r.eu + '.';
    if (st.k === 'jacket') return from + ' is US/UK ' + r.us + ' and EU ' + r.eu + ' (chest about ' + r.chestCm + ' cm).';
    return from + ' is ' + r.in + ' in, or ' + r.cm + ' cm.';
  }

  function result(st) {
    var r = compute(st);
    if (!r) return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p>';
    var k = '';
    if (st.k === 'shoes') k = kpi('UK', fmt(r.uk)) + kpi("US men's", fmt(r.usMen)) + kpi("US women's", r.usWomen.join('–')) + kpi('EU', fmt(r.eu)) +
      kpi('Foot length', r.footCm + ' cm / ' + r.footIn + ' in') + kpi('Mondopoint', r.mondo + ' mm');
    else if (st.k === 'women') k = kpi('US', r.us) + kpi('UK', r.uk) + kpi('AU', r.au) + kpi('EU', r.eu);
    else if (st.k === 'jacket') k = kpi('US / UK', r.us) + kpi('EU', r.eu) + kpi('Chest', r.us + ' in / ' + r.chestCm + ' cm');
    else k = kpi('Inches', r.in) + kpi('Centimeters', r.cm);
    var note = st.k === 'shoes'
      ? 'Sizes are rounded to the nearest half size. Brands can differ by half to one size, so check the brand chart against your foot length.'
      : st.k === 'women' ? 'French and Italian labels use different numbers, and sources disagree on them, so they are not converted here.'
        : 'Always compare with the brand’s own measurement chart before buying.';
    return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><div class="kpis">' + k + '</div><p class="meta-line">' + note + '</p>';
  }

  function options(map, sel) {
    return Object.keys(map).map(function (k) {
      return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + U.esc(map[k].label || map[k]) + '</option>';
    }).join('');
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="sz-k">Convert</label><select id="sz-k" name="k">' + options(KINDS, st.k) + '</select></div>' +
      '<div><label class="lbl" for="sz-s">From</label><select id="sz-s" name="s">' + options(KINDS[st.k].systems, st.s) + '</select></div>' +
      '<div><label class="lbl" for="sz-v">Size</label><input type="number" id="sz-v" name="v" value="' + U.esc(st.v) +
      '" step="0.5" min="0" inputmode="decimal"></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=size-converter]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var k = root.querySelector('[name=k]'), s = root.querySelector('[name=s]'), v = root.querySelector('[name=v]');
    var h = U.readHash();
    var st = { k: KINDS[h.k] ? h.k : DEFAULT.k, s: h.s, v: h.v };
    if (!KINDS[st.k].systems[st.s]) st.s = KINDS[st.k].def[0];
    if (!st.v) st.v = KINDS[st.k].def[1];

    function draw(write) {
      res.innerHTML = result(st);
      live.textContent = summary(st);
      if (write) U.writeHash(st);
    }
    function sync() { k.value = st.k; s.innerHTML = options(KINDS[st.k].systems, st.s); v.value = st.v; }

    k.addEventListener('change', function () {
      st = { k: k.value, s: KINDS[k.value].def[0], v: KINDS[k.value].def[1] };
      sync(); draw(true);
    });
    s.addEventListener('change', function () { st.s = s.value; draw(true); });
    v.addEventListener('input', function () { st.v = v.value; draw(true); });
    U.bindCommon(root);
    if (h.k || h.s || h.v) { sync(); draw(false); }
  }

  return { DEFAULT: DEFAULT, KINDS: KINDS, controls: controls, result: result, summary: summary, mount: mount };
});
