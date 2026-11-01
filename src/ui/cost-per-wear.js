/*! SimplyStylo Cost Per Wear Calculator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/cpw-core.js'));
  else factory(root.SSUI, root.SSCpw).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, P) {
  'use strict';

  var CUR = { usd: '$', gbp: '£', eur: '€', aud: 'A$', cad: 'C$' };
  var DEFAULT = { cur: 'usd', an: 'Wool coat', ap: '150', ay: '60', ag: '5', ac: '0', ar: '0', bn: 'Trend top', bp: '40', by: '10', bg: '1', bc: '0', br: '0' };
  var F = [['p', 'Price'], ['y', 'Wears per year'], ['g', 'Years you will keep it'], ['c', 'Care cost per wear (optional)'], ['r', 'Resale value (optional)']];

  function norm(st) {
    var s = st || {}, o = {};
    Object.keys(DEFAULT).forEach(function (k) { o[k] = s[k] != null && s[k] !== '' ? String(s[k]) : DEFAULT[k]; });
    if (!CUR[o.cur]) o.cur = 'usd';
    return o;
  }
  function itemOf(st, x) { return { price: st[x + 'p'], perYear: st[x + 'y'], years: st[x + 'g'], care: st[x + 'c'], resale: st[x + 'r'] }; }
  function money(st, v) { return v == null ? '–' : CUR[st.cur] + (+v).toFixed(2); }

  function summary(st) {
    var r = P.compare(itemOf(st, 'a'), itemOf(st, 'b'));
    if (r.a.cpw == null || r.b.cpw == null) return 'Enter how often you will wear each item to compare cost per wear.';
    if (r.better === 'same') return 'Both items cost ' + money(st, r.a.cpw) + ' per wear.';
    var win = r.better === 'a' ? st.an : st.bn, lose = r.better === 'a' ? st.bn : st.an;
    return st.an + ' costs ' + money(st, r.a.cpw) + ' per wear and ' + st.bn + ' costs ' + money(st, r.b.cpw) + ' per wear: ' + win + ' is ' + r.ratio + '× better value per wear than ' + lose + '.';
  }

  function result(st) {
    var r = P.compare(itemOf(st, 'a'), itemOf(st, 'b'));
    var card = function (x, it) {
      return '<div class="kpi"><span>' + U.esc(st[x + 'n']) + '</span><b>' + money(st, it.cpw) + '</b><span>per wear · ' + it.wears + ' wears · ' + money(st, it.total) + ' total</span></div>';
    };
    var be = r.breakEvenA && r.better === 'b'
      ? '<p>To match ' + U.esc(st.bn) + ', you would need to wear ' + U.esc(st.an) + ' about <b>' + r.breakEvenA + ' times</b>.</p>' : '';
    return '<p class="summary" data-summary>' + U.esc(summary(st)) + '</p><div class="kpis">' + card('a', r.a) + card('b', r.b) + '</div>' + be;
  }

  function block(st, x, title) {
    return '<fieldset><legend>' + title + '</legend><div class="row"><div><label class="lbl" for="cpw-' + x + 'n">Item name</label><input type="text" id="cpw-' + x +
      'n" name="' + x + 'n" value="' + U.esc(st[x + 'n']) + '" maxlength="40"></div>' + F.map(function (f) {
      return '<div><label class="lbl" for="cpw-' + x + f[0] + '">' + f[1] + '</label><input type="number" id="cpw-' + x + f[0] + '" name="' + x + f[0] +
        '" value="' + U.esc(st[x + f[0]]) + '" min="0" step="any" inputmode="decimal"></div>';
    }).join('') + '</div></fieldset>';
  }

  function controls(st) {
    return '<div class="row"><div><label class="lbl" for="cpw-cur">Currency</label><select id="cpw-cur" name="cur">' + Object.keys(CUR).map(function (k) {
      return '<option value="' + k + '"' + (k === st.cur ? ' selected' : '') + '>' + CUR[k] + ' ' + k.toUpperCase() + '</option>';
    }).join('') + '</select></div></div>' + block(st, 'a', 'Item A') + block(st, 'b', 'Item B');
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=cost-per-wear]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    Object.keys(DEFAULT).forEach(function (k) { var el = root.querySelector('[name=' + k + ']'); if (el) el.value = st[k]; });
    root.addEventListener('input', function (e) {
      if (!e.target.name || !(e.target.name in DEFAULT)) return;
      st[e.target.name] = e.target.value;
      st = norm(st);
      draw(true);
    });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
