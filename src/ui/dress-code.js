/*! SimplyStylo Dress Code Guide UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/dresscode-core.js'), require('../lib/garments.js'));
  else factory(root.SSUI, root.SSDress, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, D, G) {
  'use strict';

  var DEFAULT = { d: 'cocktail', s: 'womenswear' };
  function norm(st) { st = st || {}; return { d: D.get(st.d) ? st.d : DEFAULT.d, s: st.s === 'menswear' ? 'menswear' : 'womenswear' }; }

  function summary(st) {
    var c = D.get(st.d), items = c[st.s];
    return c.name + ' (' + (st.s === 'menswear' ? 'menswear' : 'womenswear') + '): ' + items.map(function (i) { return i[0].toLowerCase(); }).join(', ') + '.';
  }

  function meter(id) {
    var f = D.formality(id), out = '';
    for (var i = 1; i <= D.CODES.length; i++) out += '<span class="meter__dot' + (i <= f ? ' is-on' : '') + '"></span>';
    return '<div class="meter" role="img" aria-label="Formality ' + f + ' of ' + D.CODES.length + '">' + out + '</div>';
  }

  function result(st) {
    var c = D.get(st.d), items = c[st.s];
    return '<h2>' + U.esc(c.name) + '</h2><p class="meta-line">Also called: ' + U.esc(c.aka) + '</p>' + meter(c.id) +
      '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><p>' + U.esc(c.when) + '</p>' +
      '<ul class="board" aria-label="What to wear">' + items.map(function (i) {
        return '<li>' + G.svg(i[0], i[1], 72, true) + '<span>' + U.esc(i[0]) + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="panel"><h3>Avoid</h3><ul>' + c.avoid.map(function (a) { return '<li>' + U.esc(a) + '</li>'; }).join('') + '</ul>' +
      (c.note ? '<p>' + U.esc(c.note) + '</p>' : '') + '</div>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="dc-d">Dress code on the invitation</label><select id="dc-d" name="d">' + D.CODES.map(function (c) {
      return '<option value="' + c.id + '"' + (c.id === st.d ? ' selected' : '') + '>' + U.esc(c.name) + '</option>';
    }).join('') + '</select></div><div><label class="lbl" for="dc-s">Style</label><select id="dc-s" name="s"><option value="womenswear"' +
      (st.s === 'womenswear' ? ' selected' : '') + '>Womenswear</option><option value="menswear"' + (st.s === 'menswear' ? ' selected' : '') + '>Menswear</option></select></div></div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=dress-code]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    root.querySelector('[name=d]').value = st.d; root.querySelector('[name=s]').value = st.s;
    root.addEventListener('change', function (e) { if (e.target.name in DEFAULT) { st[e.target.name] = e.target.value; st = norm(st); draw(true); } });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
