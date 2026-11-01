/*! SimplyStylo Personal Color Analysis UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./common.js'), require('../lib/season-core.js'));
  else factory(root.SSUI, root.SSSeason).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, S) {
  'use strict';

  var Q = S.QUESTIONS;
  var NEIGHBORS = {
    light: 'Light seasons sit between Spring and Summer', deep: 'Deep seasons sit between Autumn and Winter',
    bright: 'Bright seasons sit between Spring and Winter', soft: 'Soft seasons sit between Summer and Autumn',
    warm: 'Warm seasons sit between Spring and Autumn', cool: 'Cool seasons sit between Summer and Winter'
  };

  // Answers ⇄ hash string: one digit per question, "-" when unanswered.
  function decode(str) {
    var a = {};
    Q.forEach(function (q, i) { var c = (str || '').charAt(i); if (/[0-2]/.test(c)) a[q.id] = +c; });
    return a;
  }
  function encode(a) { return Q.map(function (q) { return a[q.id] != null ? a[q.id] : '-'; }).join(''); }

  function controls(a) {
    return Q.map(function (q, i) {
      return '<fieldset class="q"><legend>' + (i + 1) + '. ' + U.esc(q.q) + '</legend><div class="opts">' +
        q.options.map(function (o, j) {
          return '<label class="opt"><input type="radio" name="' + q.id + '" value="' + j + '"' + (a[q.id] === j ? ' checked' : '') + '>' +
            '<span>' + U.esc(o.label) + '</span></label>';
        }).join('') + '</div></fieldset>';
    }).join('');
  }

  function summary(a) {
    var n = S.answered(a);
    if (n < Q.length) return 'Answer ' + (Q.length - n) + ' more question' + (Q.length - n === 1 ? '' : 's') + ' to see your season.';
    var r = S.analyse(a);
    return 'Your likely season is ' + r.season.name + ': ' + r.season.traits + '.';
  }

  function result(a) {
    var n = S.answered(a);
    if (n < Q.length) {
      return '<p class="summary" data-summary>' + U.esc(summary(a)) + '</p><p class="meta-line">Your result appears here as soon as all ' +
        Q.length + ' questions are answered. Nothing is uploaded: the quiz runs in your browser.</p>';
    }
    var r = S.analyse(a), s = r.season;
    return '<p class="eyebrow">Your result</p><h2 class="big">' + U.esc(s.name) + '</h2>' +
      '<p class="summary" data-summary>' + U.esc(summary(a)) + ' ' + U.esc(NEIGHBORS[r.dominant]) + ', and your strongest trait is <b>' +
      U.esc(r.dominant) + '</b>.</p>' +
      (r.borderline ? '<p class="callout">Your answers are close to the middle on every scale, so neighboring seasons may suit you just as well. ' +
        'Compare this palette with the ' + U.esc(s.family) + ' seasons in the table below, in daylight, next to your face.</p>' : '') +
      '<h3>Your best colors</h3><ul class="swatches">' + s.palette.map(function (h) { return U.swatch(h); }).join('') + '</ul>' +
      '<h3>Your neutrals</h3><ul class="swatches">' + s.neutrals.map(function (h) { return U.swatch(h); }).join('') + '</ul>' +
      '<h3>Wear away from your face</h3><ul class="swatches">' + s.avoid.map(function (h) { return U.swatch(h); }).join('') + '</ul>' +
      '<p class="meta-line">“Away from your face” means trousers, skirts, shoes and bags are still fine in these colors.</p>' +
      '<p><a class="btn" href="/seasons/' + r.id + '/">Full ' + U.esc(s.name) + ' guide: makeup, metals and outfits</a></p>';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=color-analysis]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var a = decode(U.readHash().a);
    var reported = false;

    function draw(write) {
      res.innerHTML = result(a);
      live.textContent = summary(a);
      if (write) U.writeHash({ a: encode(a) });
      if (!reported && S.answered(a) === Q.length) { reported = true; U.track('season_result', { season: S.analyse(a).id }); }
    }
    Q.forEach(function (q) {
      if (a[q.id] != null) { var el = root.querySelector('input[name=' + q.id + '][value="' + a[q.id] + '"]'); if (el) el.checked = true; }
    });
    root.addEventListener('change', function (e) {
      if (e.target.type !== 'radio') return;
      a[e.target.name] = +e.target.value;
      draw(true);
    });
    var reset = root.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', function () {
      a = {};
      [].forEach.call(root.querySelectorAll('input[type=radio]'), function (el) { el.checked = false; });
      draw(true);
    });
    U.bindCommon(root);
    if (S.answered(a)) draw(false);
  }

  return { controls: controls, result: result, summary: summary, decode: decode, encode: encode, mount: mount };
});
