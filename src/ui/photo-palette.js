/*! SimplyStylo Photo Color Palette UI. (c) SimplyStylo. All rights reserved. */
// The photo never leaves the device: it is decoded and scaled on a canvas, and only the resulting color list is kept
// (in the page address, so the palette can be shared without the photo).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/color-core.js'), require('../lib/palette-core.js'));
  } else factory(root.SSUI, root.SSColor, root.SSPalette).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, C, P) {
  'use strict';

  var GUIDES = ['navy', 'black', 'white', 'beige', 'gray', 'camel', 'brown', 'olive-green', 'burgundy', 'blush-pink', 'red', 'emerald-green', 'mustard-yellow', 'sage-green'];
  var DEMO = [['#1F2A44', 0.5], ['#B98A57', 0.3], ['#FAFAF7', 0.15], ['#6D1F2E', 0.05]];

  function demo() { return P.extract(P.demoPixels(DEMO)); }
  function encode(colors) { return colors.map(function (c) { return c.hex.slice(1) + '.' + c.share; }).join('-'); }
  function decode(str) {
    return String(str || '').split('-').map(function (p) {
      var m = p.match(/^([0-9A-Fa-f]{6})\.(\d{1,3})$/);
      if (!m) return null;
      var hex = '#' + m[1].toUpperCase(), n = C.nearestNamed(hex);
      return { hex: hex, share: Math.min(100, +m[2]), name: n.name, slug: n.slug, neutral: n.neutral };
    }).filter(Boolean).slice(0, 8);
  }

  function summary(colors) {
    if (!colors.length) return 'Choose a photo to find its colors.';
    return 'Main colors: ' + colors.slice(0, 4).map(function (c) { return c.name.toLowerCase() + ' (' + c.share + '%)'; }).join(', ') + '.';
  }

  function result(colors, isDemo) {
    if (!colors.length) return '<p class="summary" data-summary>' + U.esc(summary(colors)) + '</p>';
    var seasons = P.seasonMatch(colors, 3);
    var neutrals = colors.filter(function (c) { return c.neutral; }).reduce(function (s, c) { return s + c.share; }, 0);
    return (isDemo ? '<h2>Example Result: Navy, Camel and White Outfit</h2>' : '<h2>Your Photo’s Palette</h2>') +
      '<p class="summary" data-summary>' + U.esc(summary(colors)) + '</p>' +
      '<div class="pal" role="img" aria-label="Palette by share">' + colors.map(function (c) {
        return '<span style="background:' + c.hex + ';flex:' + Math.max(1, c.share) + '"></span>';
      }).join('') + '</div>' +
      '<ul class="swatches">' + colors.map(function (c) { return U.swatch(c.hex, c.name + ' · ' + c.share + '%'); }).join('') + '</ul>' +
      '<div class="grid2"><div class="panel"><h3>Color balance</h3><p>Neutrals make up ' + neutrals + '% of this image. ' +
      (neutrals >= 50 ? 'That is a classic 60/30/10 base: add one accent color and it will look intentional.' : 'Color leads this look; keep the rest of the outfit neutral so it does not compete.') + '</p></div>' +
      '<div class="panel"><h3>Closest color seasons</h3><p>' + seasons.map(function (s) {
        return '<a href="/seasons/' + s.id + '/">' + U.esc(s.name) + '</a>';
      }).join(', ') + '</p></div></div>' +
      '<p class="meta-line">Color guides for these colors: ' + colors.filter(function (c) { return GUIDES.indexOf(c.slug) >= 0; })
        .filter(function (c, i, a) { return a.findIndex(function (x) { return x.slug === c.slug; }) === i; })
        .map(function (c) { return '<a href="/colors/' + c.slug + '/">' + U.esc(c.name) + '</a>'; }).join(', ') + '.</p>';
  }

  function controls() {
    return '<div class="row"><div><label class="lbl" for="pp-file">Outfit or inspiration photo</label>' +
      '<input type="file" id="pp-file" name="file" accept="image/*" aria-describedby="pp-hint"><small class="hint" id="pp-hint">JPG, PNG, WebP or HEIC from your camera roll. It stays on your device.</small></div></div>';
  }

  function readImage(file) {
    if (window.createImageBitmap) return createImageBitmap(file);
    return new Promise(function (ok, fail) {
      var fr = new FileReader();
      fr.onload = function () { var img = new Image(); img.onload = function () { ok(img); }; img.onerror = fail; img.src = fr.result; };
      fr.onerror = fail;
      fr.readAsDataURL(file);
    });
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=photo-palette]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var input = root.querySelector('[name=file]');
    function show(colors, isDemo, write) {
      res.innerHTML = result(colors, isDemo);
      live.textContent = summary(colors);
      if (write) U.writeHash({ p: encode(colors) });
    }
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      live.textContent = 'Reading colors…';
      readImage(file).then(function (img) {
        var scale = Math.min(1, 200 / Math.max(img.width, img.height));
        var c = doc.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale)); c.height = Math.max(1, Math.round(img.height * scale));
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        show(P.extract(ctx.getImageData(0, 0, c.width, c.height).data, 6), false, true);
        U.track('palette_photo');
      }).catch(function () { live.textContent = 'That file could not be read. Try a JPG or PNG photo.'; res.innerHTML = '<p class="summary">That file could not be read. Try a JPG or PNG photo.</p>'; });
    });
    var demoBtn = root.querySelector('[data-demo]');
    if (demoBtn) demoBtn.addEventListener('click', function () { input.value = ''; show(demo(), true, false); history.replaceState(null, '', location.pathname); });
    U.bindCommon(root);
    var h = decode(U.readHash().p);
    if (h.length) show(h, false, false);
  }

  return { DEMO: DEMO, demo: demo, encode: encode, decode: decode, controls: controls, result: result, summary: summary, mount: mount };
});
