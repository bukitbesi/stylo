/*! SimplyStylo Laundry Symbol Decoder UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/care-core.js'));
  else factory(root.SSUI, root.SSCare).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, C) {
  'use strict';

  var DEFAULT = { w: '40m', b: 'oxygen', t: 'low', i: 'medium', p: 'P' };
  function norm(st) {
    st = st || {};
    var out = {};
    C.GROUPS.forEach(function (g) { var v = st[g.key]; out[g.key] = v === '' || (v != null && C.find(g, v)) ? v : DEFAULT[g.key]; });
    return out;
  }

  function summary(st) {
    var d = C.decode(st);
    if (!d.length) return 'Choose the symbols on your care label to see what each one means.';
    return d.map(function (x) { return x.text; }).join(' ');
  }

  function label(d) {
    return '<div class="care-label" aria-label="Your care label">' + (d.length ? d.map(function (x) { return C.svg(x.shape, x.spec, 48, x.group + ': ' + x.label); }).join('') : '<span class="meta-line">No symbols chosen</span>') + '</div>';
  }

  function result(st) {
    var d = C.decode(st);
    return '<div class="care-result">' + label(d) +
      '<ul class="care-list">' + d.map(function (x) {
        return '<li>' + C.svg(x.shape, x.spec, 40) + '<span><b>' + U.esc(x.group) + ': ' + U.esc(x.label) + '</b><br>' + U.esc(x.text) + '</span></li>';
      }).join('') + '</ul>' +
      '<p class="summary" data-summary>' + U.esc(C.FACTS.milder) + '. When a symbol is missing, the label gives no instruction for that treatment.</p></div>';
  }

  function controls(st) {
    return '<div class="row">' + C.GROUPS.map(function (g) {
      return '<div><label class="lbl" for="cl-' + g.key + '">' + g.name + '</label><select id="cl-' + g.key + '" name="' + g.key + '"><option value=""' + (st[g.key] === '' ? ' selected' : '') + '>Not on the label</option>' +
        g.list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === st[g.key] ? ' selected' : '') + '>' + U.esc(o[1]) + '</option>'; }).join('') + '</select></div>';
    }).join('') + '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=care-label]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    C.GROUPS.forEach(function (g) {
      var el = root.querySelector('[name=' + g.key + ']');
      el.value = st[g.key];
      el.addEventListener('change', function () { st[g.key] = el.value; draw(true); });
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
