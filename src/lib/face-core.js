/*! SimplyStylo face shape & sunglasses engine. (c) SimplyStylo. All rights reserved. */
// Anthropometric facial index and contour ratios: Farkas (1994) Anthropometry of the Head and Face, combined with
// optical frame balance principles (Vision Council & optical dispensing guidelines). Measurements are compared in cm or in.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSFace = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-03',
    method: 'Facial Index & Width Ratios (Farkas 1994 Anthropometry of the Head and Face; Vision Council Eyewear Styling Rules)'
  };

  var SHAPES = {
    oval: {
      name: 'Oval',
      rule: 'Face length about 1.35 to 1.55 × cheekbone width, with cheekbones wider than the forehead and a softly rounded jawline.',
      look: 'Balanced proportions with gently curved cheekbones and a slightly narrower chin.',
      frames: ['Aviator', 'Wayfarer', 'Geometric', 'Cat-Eye'],
      avoid: 'Oversized frames that extend far past your cheekbones and hide your natural symmetry.',
      hair: 'Almost any cut works: blunt bobs, side-swept waves, or slick-back styles that keep the face open.',
      collars: 'All necklines work well; boat necks, V-necks, and structured lapels frame the collarbone cleanly.',
      tips: [
        'Choose frames as wide as (or slightly wider than) the broadest part of your face.',
        'Walnut, tortoiseshell, and metallic aviators highlight balanced cheekbones.',
        'Keep the top bar of the frame aligned with your natural brow line.'
      ]
    },
    round: {
      name: 'Round',
      rule: 'Face length and cheekbone width within 15% of each other (length ÷ cheekbones < 1.35) with soft, curved jaw contours.',
      look: 'Similar width and length with full cheeks and a soft, curved chin.',
      frames: ['Wayfarer', 'Rectangle', 'Cat-Eye', 'Geometric'],
      avoid: 'Small round frames or rimless circles, which echo the curve and make the face appear wider.',
      hair: 'Long layers past the chin, deep side parts, and crown volume to add vertical length.',
      collars: 'V-necks, open shirt collars, and pointed lapels draw the eye vertically.',
      tips: [
        'Pick angular, rectangular, or upswept cat-eye frames to add definition and structure.',
        'A higher bridge or keyhole bridge makes the nose and face read longer.',
        'Choose frames with slightly thicker temples and dark or tortoiseshell top rims.'
      ]
    },
    square: {
      name: 'Square',
      rule: 'Face length under 1.35 × cheekbone width, with forehead, cheekbones, and jawline all within 10% of each other.',
      look: 'Strong, angular jawline with a broad forehead and nearly equal width and length.',
      frames: ['Round', 'Oval', 'Aviator', 'Browline'],
      avoid: 'Sharp, boxy rectangular frames that emphasize jaw corners.',
      hair: 'Textured layers, soft curtain bangs, or side-parted waves that soften the jaw angle.',
      collars: 'Scoop necks, cowl necks, and rounded lapels counter the angular jaw.',
      tips: [
        'Round, oval, and teardrop aviator frames soften a strong jawline.',
        'Thin metal rims and browline frames draw attention upward to the eyes.',
        'Pick frames that sit slightly higher on the bridge of the nose.'
      ]
    },
    oblong: {
      name: 'Oblong (Rectangle)',
      rule: 'Face length at least 1.55 × cheekbone width, with forehead, cheekbones, and jawline similar in width.',
      look: 'Longer than wide, with straight cheek lines and a tall forehead.',
      frames: ['Oversized Wayfarer', 'Aviator', 'Clubmaster', 'Round'],
      avoid: 'Narrow, shallow rectangular frames that make the mid-face look longer.',
      hair: 'Horizontal volume: chin-length bobs, waves, or full fringe/bangs to shorten forehead height.',
      collars: 'Boat necks, crew necks, turtlenecks, and wide spread shirt collars add horizontal balance.',
      tips: [
        'Choose tall frames (deep lens height) such as oversized wayfarers or teardrop aviators.',
        'Decorative temples or contrasting top bars add width across the center of the face.',
        'A lower bridge placement visually shortens the nose line.'
      ]
    },
    heart: {
      name: 'Heart',
      rule: 'Forehead or cheekbones at least 15% wider than the jawline (jaw ÷ cheekbones ≤ 0.85), tapering to a narrow chin.',
      look: 'Wider forehead and high cheekbones tapering down to a narrow, defined chin.',
      frames: ['Aviator', 'Round', 'Rimless', 'Cat-Eye'],
      avoid: 'Heavy, decorative top bars that add extra bulk to the upper forehead.',
      hair: 'Chin-length lobs, side-swept bangs, or waves that flare out around the jawline.',
      collars: 'Scoop necks, V-necks, and raglan sleeves keep the shoulder-to-neck transition airy.',
      tips: [
        'Bottom-heavy frames like teardrop aviators or round frames balance a narrower chin.',
        'Light-colored, translucent, or rimless frames keep the top half of the face light.',
        'Subtle cat-eyes with rounded lower rims flatter high cheekbones.'
      ]
    },
    diamond: {
      name: 'Diamond',
      rule: 'Cheekbones at least 12% wider than both the forehead and the jawline (forehead ÷ cheekbones ≤ 0.88 and jaw ÷ cheekbones ≤ 0.88).',
      look: 'Dramatic, wide cheekbones with both a narrower forehead and a narrower chin.',
      frames: ['Cat-Eye', 'Browline', 'Oval', 'Horn-Rimmed'],
      avoid: 'Narrow frames that are narrower than your cheekbones, which make temples look pinched.',
      hair: 'Side parts, tucked-behind-ear styles that show the cheekbones, or chin-length texture.',
      collars: 'Boat necks, off-shoulder cuts, and spread collars widen the upper frame.',
      tips: [
        'Browline (Clubmaster) and cat-eye frames add width at the forehead to balance prominent cheekbones.',
        'Curved oval frames soften the angularity of the cheek contour.',
        'Avoid overly wide temples that flare past the cheekbone edge.'
      ]
    },
    triangle: {
      name: 'Triangle (Pear)',
      rule: 'Jawline at least 10% wider than the forehead (jaw ÷ forehead ≥ 1.10), with a narrower temple line.',
      look: 'Strong, wide jawline tapering upward to a narrower forehead.',
      frames: ['Browline', 'Cat-Eye', 'Aviator', 'D-Frame'],
      avoid: 'Low-slung, bottom-heavy frames that sit wide on the cheeks.',
      hair: 'Volume at the temples and crown, textured quiffs, or layered tops.',
      collars: 'V-necks and open collars keep the lower face and neck uncluttered.',
      tips: [
        'Choose browline, semi-rimless, or bold cat-eye frames with strong top rims to widen the forehead.',
        'Pick frames slightly wider than your jawline so the upper face looks balanced.',
        'Light or rimless bottom edges keep attention focused upward.'
      ]
    }
  };

  var IN = 2.54;

  // Evaluates measurements in centimeters: f = forehead, c = cheekbones, j = jawline, l = face length.
  function classify(m) {
    var k = m && m.unit === 'in' ? IN : 1;
    var f = +m.forehead * k, c = +m.cheekbones * k, j = +m.jawline * k, l = +m.length * k;
    if (![f, c, j, l].every(function (x) { return isFinite(x) && x >= 7 && x <= 35; })) return null;

    var lc = l / c;
    var fc = f / c;
    var jc = j / c;
    var jf = j / f;

    var id = 'oval';
    if (jf >= 1.10 && j > f) {
      id = 'triangle';
    } else if (fc <= 0.88 && jc <= 0.88) {
      id = 'diamond';
    } else if (jc <= 0.82 && f >= j * 1.18) {
      id = 'heart';
    } else if (lc >= 1.55) {
      id = 'oblong';
    } else if (lc < 1.35) {
      // Distinguish round vs square by how close jawline is to cheekbones/forehead
      if (jc >= 0.92 && fc >= 0.92) id = 'square';
      else id = 'round';
    } else {
      // Medium length ratio (1.35 to 1.55): check if square-jawed or oval
      if (jc >= 0.95 && fc >= 0.95 && lc < 1.42) id = 'square';
      else id = 'oval';
    }

    var r2 = function (x) { return Math.round(x * 100) / 100; };
    var r1 = function (x) { return Math.round(x * 10) / 10; };
    return {
      id: id,
      shape: SHAPES[id],
      cm: { forehead: r1(f), cheekbones: r1(c), jawline: r1(j), length: r1(l) },
      ratios: {
        lengthCheek: r2(lc),
        jawCheek: r2(jc),
        foreheadCheek: r2(fc),
        jawForehead: r2(jf)
      }
    };
  }

  return { FACTS: FACTS, SHAPES: SHAPES, classify: classify };
});
