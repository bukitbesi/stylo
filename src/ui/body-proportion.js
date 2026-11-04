/*! SimplyStylo golden ratio & body proportion UI. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../lib/proportion-core.js'), require('./common.js'));
  } else {
    root.SSUIProportion = factory(root.SSProportion, root.SSUI);
  }
})(typeof self !== 'undefined' ? self : this, function (PC, U) {
  'use strict';

  var esc = U.esc;

  var DEFAULT = {
    unit: 'in',
    gender: 'womenswear',
    height: 67,
    inseam: 31,
    shoulder: 16.5,
    waist: 28
  };

  function norm(p) {
    p = p || {};
    var unit = p.unit === 'cm' ? 'cm' : 'in';
    return {
      unit: unit,
      gender: p.gender === 'menswear' ? 'menswear' : 'womenswear',
      height: Number(p.height) || (unit === 'cm' ? 170 : 67),
      inseam: Number(p.inseam) || (unit === 'cm' ? 78 : 31),
      shoulder: Number(p.shoulder) || (unit === 'cm' ? 42 : 16.5),
      waist: Number(p.waist) || (unit === 'cm' ? 71 : 28)
    };
  }

  function controls(val) {
    val = norm(val);
    var isCm = val.unit === 'cm';
    var uLabel = isCm ? 'cm' : 'in';

    return '' +
      '<div class="grid3">' +
        '<label>Unit' +
          '<select name="unit">' +
            '<option value="in"' + (!isCm ? ' selected' : '') + '>Inches (in)</option>' +
            '<option value="cm"' + (isCm ? ' selected' : '') + '>Centimeters (cm)</option>' +
          '</select>' +
        '</label>' +
        '<label>Perspective' +
          '<select name="gender">' +
            '<option value="womenswear"' + (val.gender === 'womenswear' ? ' selected' : '') + '>Womenswear</option>' +
            '<option value="menswear"' + (val.gender === 'menswear' ? ' selected' : '') + '>Menswear</option>' +
          '</select>' +
        '</label>' +
        '<label>Total height (' + uLabel + ')' +
          '<input type="number" name="height" min="' + (isCm ? 120 : 48) + '" max="' + (isCm ? 220 : 86) + '" step="0.5" value="' + val.height + '" required>' +
        '</label>' +
      '</div>' +
      '<div class="grid3" style="margin-top:12px">' +
        '<label>Inseam / leg length (' + uLabel + ')' +
          '<input type="number" name="inseam" min="' + (isCm ? 50 : 20) + '" max="' + (isCm ? 110 : 44) + '" step="0.5" value="' + val.inseam + '" required>' +
        '</label>' +
        '<label>Shoulder width (' + uLabel + ')' +
          '<input type="number" name="shoulder" min="' + (isCm ? 30 : 12) + '" max="' + (isCm ? 65 : 26) + '" step="0.5" value="' + val.shoulder + '">' +
        '</label>' +
        '<label>Natural waist (' + uLabel + ')' +
          '<input type="number" name="waist" min="' + (isCm ? 50 : 20) + '" max="' + (isCm ? 140 : 56) + '" step="0.5" value="' + val.waist + '">' +
        '</label>' +
      '</div>';
  }

  function renderSilhouetteSVG(res) {
    var legPct = res.legPercent;
    // Base coordinate system: 200 width, 300 height
    // Head: 20 to 60 (height 40)
    // Total body height: 260px (from 20 to 280)
    var totalH = 240;
    var legPx = Math.round(totalH * (legPct / 100));
    var torsoPx = totalH - legPx;
    var crotchY = 280 - legPx;
    var waistY = Math.round(crotchY - (torsoPx * 0.45));

    // Ideal 1:2 Golden Split line
    var goldenSplitY = Math.round(40 + (totalH * 0.333));

    return '' +
      '<svg viewBox="0 0 200 300" width="100%" height="260" style="max-width:220px;display:block;margin:0 auto" aria-label="Body vertical proportion diagram">' +
        '<!-- Ground shadow -->' +
        '<ellipse cx="100" cy="285" rx="55" ry="7" fill="rgba(23,23,23,0.08)"/>' +
        '<!-- Head -->' +
        '<ellipse cx="100" cy="35" rx="14" ry="18" fill="var(--sand)" stroke="var(--text)" stroke-width="1.8"/>' +
        '<!-- Neck -->' +
        '<rect x="96" y="53" width="8" height="10" fill="var(--sand)"/>' +
        '<!-- Torso -->' +
        '<path d="M72 63 L128 63 L118 ' + waistY + ' L122 ' + crotchY + ' L78 ' + crotchY + ' L82 ' + waistY + ' Z" fill="var(--surface)" stroke="var(--text)" stroke-width="1.8"/>' +
        '<!-- Legs -->' +
        '<path d="M78 ' + crotchY + ' L80 278 L93 278 L97 ' + crotchY + ' Z" fill="var(--sand)" stroke="var(--text)" stroke-width="1.8"/>' +
        '<path d="M103 ' + crotchY + ' L107 278 L120 278 L122 ' + crotchY + ' Z" fill="var(--sand)" stroke="var(--text)" stroke-width="1.8"/>' +
        '<!-- Shoes -->' +
        '<rect x="76" y="278" width="18" height="6" rx="2" fill="var(--accent)"/>' +
        '<rect x="106" y="278" width="18" height="6" rx="2" fill="var(--accent)"/>' +
        '<!-- Natural Waist Line -->' +
        '<line x1="45" y1="' + waistY + '" x2="155" y2="' + waistY + '" stroke="#D97706" stroke-width="2" stroke-dasharray="3 3"/>' +
        '<text x="160" y="' + (waistY + 3) + '" font-size="9" fill="#D97706" font-weight="600">Waist</text>' +
        '<!-- Crotch/Inseam Line -->' +
        '<line x1="45" y1="' + crotchY + '" x2="155" y2="' + crotchY + '" stroke="var(--focus)" stroke-width="1.5" stroke-dasharray="2 2"/>' +
        '<text x="160" y="' + (crotchY + 3) + '" font-size="9" fill="var(--focus)">Legs (' + legPct + '%)</text>' +
        '<!-- Ideal 1:2 Golden Third Line -->' +
        '<line x1="30" y1="' + goldenSplitY + '" x2="155" y2="' + goldenSplitY + '" stroke="#10B981" stroke-width="1.8"/>' +
        '<text x="160" y="' + (goldenSplitY + 3) + '" font-size="9" fill="#10B981" font-weight="bold">1:2 Third</text>' +
      '</svg>';
  }

  function result(val) {
    val = norm(val);
    var res = PC.analyze(val);

    return '' +
      '<div class="grid2" style="align-items:center;gap:24px">' +
        '<div>' +
          renderSilhouetteSVG(res) +
        '</div>' +
        '<div>' +
          '<div style="display:inline-block;padding:4px 10px;border-radius:4px;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;background:var(--sand);color:var(--text);margin-bottom:8px">' +
            esc(res.verticalTitle) +
          '</div>' +
          '<h3 style="margin:0 0 10px;font-size:1.4rem">' + res.legPercent + '% Legs · ' + res.torsoPercent + '% Torso</h3>' +
          '<p class="prose" style="font-size:0.95rem;margin-bottom:12px">' + esc(res.verticalSummary) + '</p>' +
          '<p class="prose" style="font-size:0.92rem;color:var(--text-2);margin-bottom:16px"><b>Upper Frame:</b> ' + esc(res.horizontalSummary) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="grid3" style="margin-top:20px">' +
        '<div class="panel">' +
          '<h4 style="margin:0 0 6px;font-size:0.95rem;color:var(--text)">Optimal Trouser Rise</h4>' +
          '<p style="margin:0;font-size:0.88rem;color:var(--text-2)">' + esc(res.riseGuidance) + '</p>' +
        '</div>' +
        '<div class="panel">' +
          '<h4 style="margin:0 0 6px;font-size:0.95rem;color:var(--text)">Tucking &amp; Hem Strategy</h4>' +
          '<p style="margin:0;font-size:0.88rem;color:var(--text-2)">' + esc(res.tuckGuidance) + '</p>' +
        '</div>' +
        '<div class="panel">' +
          '<h4 style="margin:0 0 6px;font-size:0.95rem;color:var(--text)">Jacket &amp; Layer Length</h4>' +
          '<p style="margin:0;font-size:0.88rem;color:var(--text-2)">' + esc(res.jacketGuidance) + '</p>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:16px;padding:12px 16px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-md);font-size:0.9rem">' +
        '<b>The Golden Rule of Thirds Target:</b> For your ' + res.height + ' ' + res.unit + ' height, aim for tops to visually end at <b>' + res.idealTopLength + ' ' + res.unit + '</b> from the shoulder, letting bottoms cover <b>' + res.idealBottomLength + ' ' + res.unit + '</b> to preserve the 1:2 aesthetic elongation.' +
      '</div>';
  }

  function summary(val) {
    var res = PC.analyze(norm(val));
    return res.verticalTitle + ' (' + res.legPercent + '% legs / ' + res.torsoPercent + '% torso). Best with ' + res.riseGuidance.toLowerCase() + '.';
  }

  function init(rootEl) {
    var form = rootEl.querySelector('form') || rootEl;
    var resEl = rootEl.querySelector('[data-result]');
    var liveEl = rootEl.querySelector('[data-live]');

    function update() {
      var fd = new FormData(form);
      var obj = {
        unit: fd.get('unit') || 'in',
        gender: fd.get('gender') || 'womenswear',
        height: fd.get('height') || '67',
        inseam: fd.get('inseam') || '31',
        shoulder: fd.get('shoulder') || '16.5',
        waist: fd.get('waist') || '28'
      };
      if (resEl) resEl.innerHTML = result(obj);
      if (liveEl) liveEl.textContent = summary(obj);
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
  }

  return {
    DEFAULT: DEFAULT,
    norm: norm,
    controls: controls,
    result: result,
    summary: summary,
    init: init
  };
});
