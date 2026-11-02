/*! SimplyStylo Selfie Color Analysis UI. (c) SimplyStylo. All rights reserved. */
// The selfie stays on the device: it is drawn on a canvas, the visitor taps skin, hair, eyes (and optional white
// paper), and only the derived quiz answers are kept in the page address.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./common.js'), require('../lib/season-core.js'), require('../lib/selfie-core.js'), require('./color-analysis.js'));
  } else factory(root.SSUI, root.SSSeason, root.SSSelfie, root.SSQuizUI).mount(document);
})(typeof self !== 'undefined' ? self : this, function (U, SE, S, Q) {
  'use strict';

  var POINTS = [['skin', 'Skin', 'Tap your cheek or jaw, away from shadows and makeup'], ['hair', 'Hair', 'Tap your natural hair color near the face'],
    ['eyes', 'Eyes', 'Tap the colored part of one eye (zoom in first)'], ['white', 'White paper', 'Optional: tap a sheet of white paper held in the photo, to correct the lighting']];
  var MARK = { skin: '#E07A5F', hair: '#3D405B', eyes: '#2A9D8F', white: '#999999' };
  var UNDERTONE = ['veins', 'metal', 'white', 'sun'];

  function undertoneQs() { return SE.QUESTIONS.filter(function (q) { return UNDERTONE.indexOf(q.id) >= 0; }); }

  function controls() {
    return '<ol class="steps"><li><b>Take or choose a selfie</b> in daylight, facing a window, without filters.' +
      '<div><label class="lbl" for="sf-file">Selfie</label><input type="file" id="sf-file" name="file" accept="image/*" capture="user"></div></li>' +
      '<li><b>Tap the photo</b> for each point below.<div class="chips" role="group" aria-label="Point to tap">' + POINTS.map(function (p, i) {
        return '<button type="button" class="chip" data-point="' + p[0] + '" aria-pressed="' + (i === 0) + '"><span class="dot" style="background:' + MARK[p[0]] + '"></span>' + p[1] + '</button>';
      }).join('') + '</div><p class="hint" data-point-hint>' + POINTS[0][2] + '.</p>' +
      '<div class="selfie" hidden><canvas width="10" height="10" aria-label="Your selfie. Tap to pick colors."></canvas></div>' +
      '<ul class="swatches" data-samples></ul><p class="meta-line" data-readings></p></li>' +
      '<li><b>Confirm your undertone</b>: photos cannot show it reliably, so answer these four questions.' + undertoneQs().map(function (q) {
        return '<fieldset class="q"><legend>' + U.esc(q.q) + '</legend><div class="opts">' + q.options.map(function (o, j) {
          return '<label class="opt"><input type="radio" name="' + q.id + '" value="' + j + '"><span>' + U.esc(o.label) + '</span></label>';
        }).join('') + '</div></fieldset>';
      }).join('') + '</li></ol>';
  }

  function summary(state) {
    var need = [];
    ['skin', 'hair', 'eyes'].forEach(function (k) { if (!state.samples[k]) need.push(k); });
    var missing = UNDERTONE.filter(function (k) { return state.under[k] == null; }).length;
    if (need.length || missing) {
      return 'Still needed: ' + (need.length ? 'tap ' + need.join(', ') : '') + (need.length && missing ? '; ' : '') + (missing ? 'answer ' + missing + ' undertone question' + (missing > 1 ? 's' : '') : '') + '.';
    }
    var a = full(state);
    return Q.summary(a);
  }

  function full(state) {
    var m = S.answers(state.samples), a = {};
    if (!m) return null;
    Object.keys(m.answers).forEach(function (k) { a[k] = m.answers[k]; });
    UNDERTONE.forEach(function (k) { a[k] = state.under[k]; });
    return a;
  }

  function result(state) {
    var a = state.answers || (state.samples ? full(state) : null);
    if (!a || SE.answered(a) < SE.QUESTIONS.length) {
      return '<p class="summary" data-summary>' + U.esc(state.samples ? summary(state) : 'Choose a selfie, tap skin, hair and eyes, then answer the four undertone questions to see your color season.') + '</p>' +
        '<p class="meta-line">Your photo stays on your device. Prefer not to use a photo? Take the <a href="/tools/color-analysis/">8-question quiz</a> instead.</p>';
    }
    return Q.result(a);
  }

  // Photo readings are shown next to the result on the device that took the photo; they are not part of the shared link.
  function readings(state) {
    var m = state.samples && S.answers(state.samples);
    return m ? 'From your photo: skin lightness ' + m.readings.skinL + ', hair lightness ' + m.readings.hairL + ', hair/skin contrast ' + m.readings.contrast +
      (m.readings.balanced ? ' (lighting corrected with your white reference).' : '. Add a white paper reference for more accurate readings.') : '';
  }

  function mount(doc) {
    var root = doc.querySelector('[data-tool=selfie-analysis]');
    if (!root) return;
    var res = root.querySelector('[data-result]'), live = root.querySelector('[data-live]');
    var canvas = root.querySelector('canvas'), wrap = root.querySelector('.selfie'), hint = root.querySelector('[data-point-hint]');
    var readout = root.querySelector('[data-readings]'), list = root.querySelector('[data-samples]'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    var state = { samples: {}, under: {}, answers: null }, point = 'skin', img = null, marks = {};

    function draw(write) {
      state.answers = null;
      res.innerHTML = result(state);
      live.textContent = summary(state);
      if (readout) readout.textContent = readings(state);
      var a = full(state);
      if (write && a && SE.answered(a) === SE.QUESTIONS.length) { U.writeHash({ a: Q.encode(a) }); U.track('selfie_result', { season: SE.analyse(a).id }); }
    }
    function paint() {
      if (!img) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      Object.keys(marks).forEach(function (k) {
        ctx.beginPath(); ctx.arc(marks[k][0], marks[k][1], Math.max(6, canvas.width / 50), 0, Math.PI * 2);
        ctx.lineWidth = 3; ctx.strokeStyle = '#FFFFFF'; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = MARK[k]; ctx.stroke();
      });
      list.innerHTML = POINTS.filter(function (p) { return state.samples[p[0]]; }).map(function (p) {
        var c = state.samples[p[0]];
        return U.swatch('#' + [c.r, c.g, c.b].map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('').toUpperCase(), p[1]);
      }).join('');
    }
    function setPoint(p) {
      point = p;
      [].forEach.call(root.querySelectorAll('[data-point]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.point === p)); });
      hint.textContent = POINTS.filter(function (x) { return x[0] === p; })[0][2] + '.';
    }

    root.querySelector('[name=file]').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var done = function (bitmap) {
        img = bitmap;
        var scale = Math.min(1, 640 / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
        state.samples = {}; marks = {}; wrap.hidden = false; setPoint('skin'); paint(); draw(false);
      };
      (window.createImageBitmap ? createImageBitmap(file) : new Promise(function (ok, fail) {
        var fr = new FileReader(); fr.onload = function () { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = fail; im.src = fr.result; }; fr.readAsDataURL(file);
      })).then(done).catch(function () { live.textContent = 'That file could not be read. Try a JPG or PNG photo.'; });
    });
    canvas.addEventListener('click', function (e) {
      if (!img) return;
      var r = canvas.getBoundingClientRect(), x = Math.round((e.clientX - r.left) * canvas.width / r.width), y = Math.round((e.clientY - r.top) * canvas.height / r.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      state.samples[point] = S.sample(d.data, canvas.width, canvas.height, x, y, Math.max(3, Math.round(canvas.width / 120)));
      marks[point] = [x, y];
      var next = POINTS.map(function (p) { return p[0]; }).filter(function (k) { return k !== 'white' && !state.samples[k]; })[0];
      if (next) setPoint(next);
      paint(); draw(true);
    });
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-point]'); if (b) setPoint(b.dataset.point); });
    root.addEventListener('change', function (e) {
      if (e.target.type !== 'radio' || UNDERTONE.indexOf(e.target.name) < 0) return;
      state.under[e.target.name] = +e.target.value; draw(true);
    });
    U.bindCommon(root);
    var h = Q.decode(U.readHash().a);
    if (SE.answered(h) === SE.QUESTIONS.length) { state.answers = h; res.innerHTML = result(state); live.textContent = Q.summary(h); }
  }

  return { controls: controls, result: result, summary: summary, mount: mount };
});
