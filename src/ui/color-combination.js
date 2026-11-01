/*! SimplyStylo Color Combination Finder UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/color-core.js'));
  else factory(root.SSUI, root.SSColor).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, C) {
  'use strict';

  var DEFAULT = '#6B6B3A';
  var CHIPS = ['navy', 'black', 'white', 'beige', 'gray', 'camel', 'brown', 'olive-green', 'burgundy', 'red', 'blush-pink',
    'mustard-yellow', 'emerald-green', 'sage-green', 'light-blue', 'cobalt-blue', 'lavender', 'rust'];

  function label(hex) {
    var n = C.nearestNamed(hex);
    return C.distance(hex, n.hex) < 0.04 ? n.name : 'Close to ' + n.name.toLowerCase();
  }

  function group(title, hexes, note) {
    return '<div class="panel"><h3>' + title + '</h3>' + U.bar(hexes) +
      '<p>' + note + ' <span class="meta-line">' + hexes.join(' · ') + '</span></p></div>';
  }

  function controls(hex) {
    return '<fieldset><legend>Pick a clothing color</legend><div class="chips">' + CHIPS.map(function (slug) {
      var n = C.bySlug(slug);
      return '<button type="button" class="chip" data-hex="' + n.hex + '" aria-pressed="' + (n.hex === hex) + '">' +
        U.dot(n.hex) + U.esc(n.name) + '</button>';
    }).join('') + '</div></fieldset>' +
      '<div class="row"><div><label class="lbl" for="cc-picker">Or any color</label>' +
      '<input type="color" id="cc-picker" name="picker" value="' + hex.toLowerCase() + '"></div>' +
      '<div><label class="lbl" for="cc-hex">Hex code</label><input type="text" id="cc-hex" name="hex" value="' + hex +
      '" inputmode="text" autocomplete="off" spellcheck="false" maxlength="7" pattern="#?[0-9A-Fa-f]{3,6}"></div></div>';
  }

  function summary(hex) {
    var p = C.outfitPalette(hex);
    var name = label(hex);
    return name + ' (' + hex + ') goes best with ' + p.dominant.name.toLowerCase() + ' as the main color and ' +
      p.accent.name.toLowerCase() + ' as a small accent; ' +
      C.bestNeutrals(hex, 3).map(function (n) { return n.name.toLowerCase(); }).join(', ') + ' are its safest neutrals.';
  }

  function result(hex) {
    var h = C.harmonies(hex), p = C.outfitPalette(hex), neutrals = C.bestNeutrals(hex, 4);
    var out = '<h2 id="cc-title">Colors that go with ' + U.esc(label(hex).toLowerCase()) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(hex)) + '</p>' +
      '<h3>Ready-to-wear outfit split (60 / 30 / 10)</h3>' + U.bar([p.dominant.hex, p.secondary.hex, p.accent.hex], 'pal--outfit') +
      '<p>Wear <b>' + U.esc(p.dominant.name.toLowerCase()) + '</b> on the biggest area (coat, trousers or dress), <b>' +
      U.esc(label(hex).toLowerCase()) + '</b> on one main piece, and <b>' + U.esc(p.accent.name.toLowerCase()) +
      '</b> only in a small accessory such as a bag, scarf or shoes.</p>' +
      '<h3>Best neutrals for this color</h3><ul class="swatches">' +
      neutrals.map(function (n) { return U.swatch(n.hex, n.name); }).join('') + '</ul>';
    if (h.achromatic) {
      out += '<p class="callout">This is a neutral, so it has no hue to build a color wheel from. Neutrals pair with almost any color: ' +
        'pick one accent you love and use the tonal steps below for a polished monochrome look.</p>' +
        '<div class="grid2">' + group('Tonal (monochrome) outfit', h.monochromatic, 'Lighter and darker steps of the same neutral.') + '</div>';
      return out;
    }
    return out + '<h3>Color wheel combinations</h3><div class="grid2">' +
      group('Complementary', h.complementary, 'Opposite on the wheel: the boldest contrast. Keep one color small.') +
      group('Analogous', h.analogous, 'Neighbors on the wheel: calm and easy to wear together.') +
      group('Split complementary', h.splitComplementary, 'Softer than complementary, still lively.') +
      group('Triadic', h.triadic, 'Three evenly spaced hues: use one as the base and two as touches.') +
      group('Monochrome', h.monochromatic, 'One color in light-to-dark steps: always looks intentional.') + '</div>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=color-combination]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var picker = root.querySelector('[name=picker]'), text = root.querySelector('[name=hex]');
    var state = U.readHash();
    var hex = C.normHex(state.c) || DEFAULT;

    function set(h, fromText) {
      var n = C.normHex(h);
      if (!n) return;
      hex = n;
      picker.value = n.toLowerCase();
      if (!fromText) text.value = n;
      [].forEach.call(root.querySelectorAll('.chip'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.hex === n)); });
      res.innerHTML = result(n);
      live.textContent = summary(n);
      U.writeHash({ c: n.slice(1) });
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (b) { set(b.dataset.hex); U.track('color_pick', { color: b.dataset.hex }); }
    });
    picker.addEventListener('input', function () { set(picker.value); });
    text.addEventListener('input', function () { set(text.value, true); });
    U.bindCommon(root);
    if (hex !== DEFAULT) set(hex);
  }

  return { DEFAULT: DEFAULT, controls: controls, result: result, summary: summary, label: label, mount: mount };
});
