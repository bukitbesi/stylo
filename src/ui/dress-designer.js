/*! SimplyStylo Dress Designer UI. (c) SimplyStylo. All rights reserved. */
// The design lives in the page address so it can be shared. A fabric photo stays on the device: it is shrunk to a
// small tile on a canvas and used only in this browser (it is not part of the shared link).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/dress-core.js'), require('../lib/color-core.js'), require('../lib/palette-core.js'));
  } else factory(root.SSUI, root.SSDressDesign, root.SSColor, root.SSPalette).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, D, C, P) {
  'use strict';

  var GROUPS = [['n', 'neckline', 'Neckline'], ['s', 'sleeve', 'Sleeves'], ['w', 'waist', 'Waist'], ['k', 'skirt', 'Skirt'], ['l', 'length', 'Length'], ['p', 'pattern', 'Fabric']];

  function summary(d) {
    var a = D.advise(d);
    return D.describe(d) + '. Suits ' + a.shapes.map(function (s) { return s.name.toLowerCase(); }).join(', ') + ' shapes; best for ' + a.codeName.toLowerCase() + '.';
  }

  function result(design, photo) {
    var d = D.norm(design), a = D.advise(d);
    var seasons = P.seasonMatch([{ hex: '#' + d.c, share: 100 }], 2);
    var colorName = C.nearestNamed('#' + d.c).name;
    return '<div class="split"><div class="dress-stage" data-stage>' + D.svg(d, { id: 'main', width: 220, photo: photo, label: D.describe(d) }) + '</div>' +
      '<div><h2>Your Dress</h2><p class="summary" data-summary>' + U.esc(summary(d)) + '</p>' +
      '<div class="panel"><h3>Flatters</h3><p>' + a.shapes.map(function (s) { return '<a href="/tools/body-shape-calculator/">' + U.esc(s.name) + '</a>'; }).join(', ') + ' body shapes.</p></div>' +
      '<div class="panel"><h3>Wear it to</h3><p><a href="/tools/dress-code-guide/#d=' + a.code + '&s=womenswear">' + U.esc(a.codeName) + '</a></p></div>' +
      '<div class="panel"><h3>Color</h3><p>' + U.esc(colorName) + ' (#' + d.c + ') belongs in the ' + seasons.map(function (s) {
        return '<a href="/seasons/' + s.id + '/">' + U.esc(s.name) + '</a>';
      }).join(' and ') + ' palettes.</p></div></div></div>' +
      '<h3>Why these choices work</h3><ul>' + a.tips.map(function (t) { return '<li>' + U.esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function controls(design) {
    var d = D.norm(design);
    return '<div class="row">' + GROUPS.map(function (g) {
      var opts = D.OPTIONS[g[1]];
      return '<div><label class="lbl" for="dd-' + g[0] + '">' + g[2] + '</label><select id="dd-' + g[0] + '" name="' + g[0] + '">' + Object.keys(opts).map(function (k) {
        return '<option value="' + k + '"' + (k === d[g[0]] ? ' selected' : '') + '>' + U.esc(opts[k].name) + '</option>';
      }).join('') + '</select></div>';
    }).join('') +
      '<div><label class="lbl" for="dd-c">Main color</label><input type="color" id="dd-c" name="c" value="#' + d.c.toLowerCase() + '"></div>' +
      '<div><label class="lbl" for="dd-a">Pattern color</label><input type="color" id="dd-a" name="a" value="#' + d.a.toLowerCase() + '"></div>' +
      '<div><label class="lbl" for="dd-b">Belt</label><select id="dd-b" name="b"><option value="">No belt</option>' +
      [['1B1B1B', 'Black'], ['FAFAF7', 'White'], ['C9A44C', 'Gold'], ['6B4A33', 'Brown'], ['6D1F2E', 'Burgundy']].map(function (b) {
        return '<option value="' + b[0] + '"' + (b[0] === d.b ? ' selected' : '') + '>' + b[1] + '</option>';
      }).join('') + '</select></div>' +
      '<div data-photo-field' + (d.p === 'photo' ? '' : ' hidden') + '><label class="lbl" for="dd-photo">Fabric or print photo</label><input type="file" id="dd-photo" name="photo" accept="image/*">' +
      '<small class="hint">Stays on your device; not included in shared links.</small></div></div>';
  }

  function gallery() {
    return '<ul class="looks">' + D.PRESETS.map(function (p) {
      var hash = Object.keys(p.d).map(function (k) { return k + '=' + p.d[k]; }).join('&');
      return '<li><a href="#' + hash + '" data-preset="' + p.id + '">' + D.svg(p.d, { id: 'pre-' + p.id, width: 120 }) + '<span>' + U.esc(p.name) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  // Makes a small tiled copy of the fabric photo so the pattern stays light.
  function photoTile(file) {
    var read = window.createImageBitmap ? createImageBitmap(file) : new Promise(function (ok, fail) {
      var fr = new FileReader(); fr.onload = function () { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = fail; i.src = fr.result; }; fr.readAsDataURL(file);
    });
    return read.then(function (img) {
      var c = document.createElement('canvas'), s = Math.min(img.width, img.height);
      c.width = 128; c.height = 128;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 128, 128);
      return c.toDataURL('image/jpeg', 0.85);
    });
  }

  function download(design, photo) {
    var src = D.svg(design, { id: 'png', width: 600, photo: photo, credit: true });
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas');
      c.width = 600; c.height = 1020;
      c.getContext('2d').drawImage(img, 0, 0, 600, 1020);
      c.toBlob(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'simplystylo-dress.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=dress-designer]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]'), photo = null;
    var d = D.norm(U.readHash());
    var hadHash = !!location.hash;
    function sync() {
      GROUPS.forEach(function (g) { root.querySelector('[name=' + g[0] + ']').value = d[g[0]]; });
      root.querySelector('[name=c]').value = '#' + d.c.toLowerCase();
      root.querySelector('[name=a]').value = '#' + d.a.toLowerCase();
      root.querySelector('[name=b]').value = d.b;
      root.querySelector('[data-photo-field]').hidden = d.p !== 'photo';
    }
    function draw(write) {
      res.innerHTML = result(d, photo);
      live.textContent = summary(d);
      if (write) U.writeHash(d);
    }
    root.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || k === 'photo' || !(k in D.DEFAULT)) return;
      d[k] = k === 'c' || k === 'a' ? e.target.value.replace('#', '').toUpperCase() : e.target.value;
      d = D.norm(d);
      root.querySelector('[data-photo-field]').hidden = d.p !== 'photo';
      draw(true);
    });
    root.querySelector('[name=photo]').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      photoTile(f).then(function (url) { photo = url; draw(false); U.track('dress_photo_fabric'); })
        .catch(function () { live.textContent = 'That photo could not be read. Try a JPG or PNG.'; });
    });
    root.querySelector('[data-download]').addEventListener('click', function () { download(d, photo); U.track('dress_download'); });
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('[data-preset]');
      if (!a) return;
      e.preventDefault();
      var p = D.PRESETS.filter(function (x) { return x.id === a.dataset.preset; })[0];
      d = D.norm(p.d); sync(); draw(true);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    U.bindCommon(root);
    if (hadHash) { sync(); draw(false); }
  }

  return { controls: controls, result: result, summary: summary, gallery: gallery, mount: mount };
});
