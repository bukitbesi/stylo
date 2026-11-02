/*! SimplyStylo Bridesmaid Palette Generator UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/bridesmaid-core.js'), require('../lib/dress-core.js'), require('../lib/garments.js'));
  } else factory(root.SSUI, root.SSBridesmaid, root.SSDressDesign, root.SSGarment).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, B, D, G) {
  'use strict';

  var DEFAULT = { c: '9CAF94', y: 'ombre', v: 'classic', n: '5' };

  function norm(st) {
    st = st || {};
    var n = parseInt(st.n, 10);
    return { c: /^[0-9A-F]{6}$/i.test(st.c || '') ? st.c.toUpperCase() : DEFAULT.c, y: B.STYLES[st.y] ? st.y : DEFAULT.y, v: B.VIBES[st.v] ? st.v : DEFAULT.v,
      n: String(n >= 2 && n <= 12 ? n : 5) };
  }
  function plan(st) { return B.plan({ color: '#' + st.c, style: st.y, vibe: st.v, count: +st.n }); }
  function dressFor(m) { return { n: m.neckline, s: 'none', w: 'natural', k: 'aline', l: 'maxi', p: 'solid', c: m.hex.slice(1), a: 'FAFAF7', b: '' }; }

  function summary(st) {
    var r = plan(st);
    return r.count + ' bridesmaids in ' + B.STYLES[r.style].toLowerCase() + ' ' + r.mainName.toLowerCase() + (r.style === 'mix' ? ' and its neighbors' : '') +
      '; groomsmen in ' + r.groomsmen.suit.name.toLowerCase() + ' suits with ' + r.groomsmen.tie.name.toLowerCase() + ' ties.';
  }

  // The whole bridal party side by side, as one SVG (also used for the PNG download).
  function lineup(r, credit) {
    var w = 120, total = r.maids.length * w;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + (credit ? 232 : 214) + '" width="' + total + '" height="' + (credit ? 232 : 214) + '" role="img" aria-label="Bridesmaid dresses: ' +
      r.maids.map(function (m) { return m.name; }).join(', ') + '">' + (credit ? '<rect width="' + total + '" height="232" fill="#F5F1E9"/>' : '') +
      r.maids.map(function (m, i) { return D.svg(dressFor(m), { id: 'bm' + i, width: w }).replace('<svg ', '<svg x="' + (i * w) + '" '); }).join('') +
      (credit ? '<text x="' + (total / 2) + '" y="226" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#6B665D">Designed on SimplyStylo.com</text>' : '') + '</svg>';
  }

  function result(st) {
    var r = plan(st);
    return '<h2>Your Bridal Party Palette</h2><p class="summary" data-summary>' + U.esc(summary(st)) + '</p>' +
      '<div class="lineup" data-lineup>' + lineup(r, false) + '</div>' +
      '<ul class="swatches">' + r.maids.map(function (m, i) { return U.swatch(m.hex, (i + 1) + ' · ' + m.name); }).join('') + '</ul>' +
      '<h3>Wedding palette</h3>' + U.bar(r.palette) + '<p class="meta-line">' + r.palette.join(' · ') + '</p>' +
      '<div class="grid2"><div class="panel"><h3>Groomsmen</h3><ul class="list-check"><li>' + G.svg('Suit jacket', r.groomsmen.suit.hex, 36, true) + U.esc(r.groomsmen.suit.name) + ' suit</li>' +
      '<li>' + G.svg('Silk tie', r.groomsmen.tie.hex, 36, true) + U.esc(r.groomsmen.tie.name) + ' tie or pocket square</li></ul></div>' +
      '<div class="panel"><h3>Tip</h3><p>' + U.esc(r.style === 'ombre' ? 'Line bridesmaids up from lightest to darkest so the gradient shows in photos.'
        : r.style === 'mix' ? 'Keep one thing the same (fabric, length or neckline) so mixed colors still look like a set.'
          : 'With one color, let each bridesmaid choose the neckline that flatters her.') + '</p></div></div>';
  }

  function controls(st) {
    var sel = function (name, label, map) {
      return '<div><label class="lbl" for="bp-' + name + '">' + label + '</label><select id="bp-' + name + '" name="' + name + '">' + Object.keys(map).map(function (k) {
        return '<option value="' + k + '"' + (k === st[name] ? ' selected' : '') + '>' + U.esc(map[k]) + '</option>';
      }).join('') + '</select></div>';
    };
    return '<div class="row"><div><label class="lbl" for="bp-c">Main wedding color</label><input type="color" id="bp-c" name="c" value="#' + st.c.toLowerCase() + '"></div>' +
      sel('y', 'Style', B.STYLES) + sel('v', 'Mood', B.VIBES) +
      '<div><label class="lbl" for="bp-n">Bridesmaids</label><input type="number" id="bp-n" name="n" value="' + st.n + '" min="2" max="12" step="1" inputmode="numeric"></div></div>';
  }

  function download(st) {
    var src = lineup(plan(st), true), img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'), scale = 3;
      c.width = img.width * scale; c.height = img.height * scale;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'simplystylo-bridesmaids.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=bridesmaid-palette]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var h = U.readHash(), st = norm(h);
    function draw(write) { res.innerHTML = result(st); live.textContent = summary(st); if (write) U.writeHash(st); }
    root.querySelector('[name=c]').value = '#' + st.c.toLowerCase();
    ['y', 'v', 'n'].forEach(function (k) { root.querySelector('[name=' + k + ']').value = st[k]; });
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!(k in DEFAULT)) return;
      st[k] = k === 'c' ? e.target.value.replace('#', '').toUpperCase() : e.target.value;
      st = norm(st); draw(true);
    });
    root.querySelector('[data-download]').addEventListener('click', function () { download(st); U.track('bridesmaid_download'); });
    U.bindCommon(root);
    if (Object.keys(h).length) draw(false);
  }

  return { DEFAULT: DEFAULT, norm: norm, controls: controls, result: result, summary: summary, mount: mount };
});
