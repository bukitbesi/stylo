/*! SimplyStylo Jeans Rise, Cut & Denim Fit Calculator engine. (c) SimplyStylo. All rights reserved. */
// Calculates ideal front rise (in/cm), hip-to-waist curve block (Straight vs Standard vs Curvy fit),
// finished denim inseam by leg cut and footwear, and leg-opening proportions.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSDenim = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-04',
    method: 'Apparel Patternmaking Rise-to-Torso Scaling & Hip-to-Waist Curve Differential (ASTM D5585)'
  };

  var CUTS = {
    straight: {
      name: 'Classic Straight Leg',
      hemOffsetIn: 0.25,
      kneeIn: 16.0,
      openingIn: 15.5,
      bestFor: 'Universal across all body proportions; skims the hip and falls straight from knee to ankle.',
      pocketTip: 'Medium mid-set pockets spaced 2.5 in apart create balanced rear proportion.'
    },
    wide: {
      name: 'Tailored Wide Leg / Trouser Jean',
      hemOffsetIn: 0.75,
      kneeIn: 19.5,
      openingIn: 21.0,
      bestFor: 'Elongates the lower body when paired with a high rise; balances broader shoulders or fuller hips.',
      pocketTip: 'Higher-set square pockets or welt pockets lift the visual seat line.'
    },
    barrel: {
      name: 'Barrel / Horseshoe Relaxed',
      hemOffsetIn: -0.5,
      kneeIn: 20.5,
      openingIn: 15.0,
      bestFor: 'Adds sculptural volume through the mid-leg while tapering neatly at the ankle bone.',
      pocketTip: 'Slightly oversized utility pockets suit the relaxed architectural silhouette.'
    },
    bootcut: {
      name: 'Bootcut / Micro-Flare',
      hemOffsetIn: 0.75,
      kneeIn: 15.0,
      openingIn: 18.5,
      bestFor: 'Contoured through the thigh with a subtle flare below the knee to balance hip curvature.',
      pocketTip: 'Slightly angled pockets follow the flare line and Visually narrow the hip.'
    },
    slim: {
      name: 'Slim / Cigarette Ankle',
      hemOffsetIn: -0.75,
      kneeIn: 14.5,
      openingIn: 13.0,
      bestFor: 'Clean ankle-grazing line that pairs effortlessly with loafers, ballet flats, and blazers.',
      pocketTip: 'Compact pockets set 0.5 in closer to the center seam streamline the silhouette.'
    }
  };

  var SHOES = {
    sneakers: { name: 'Low-Top Sneakers (1 in sole)', heelAddIn: 0, note: 'Standard everyday baseline; hem should lightly kiss the top of the heel counter.' },
    loafers: { name: 'Loafers / Ballet Flats (0.5 in)', heelAddIn: -0.25, note: 'Low profile; ankle-grazing or slight break keeps the hem off the pavement.' },
    boots: { name: 'Ankle / Chelsea Boots (1.75 in)', heelAddIn: 0.75, note: 'Straight, wide, and bootcut hems need +0.75 in so they drape smoothly over the boot shaft.' },
    heels: { name: 'Block Heels / Pumps (2.75 in)', heelAddIn: 1.5, note: 'Extend wide-leg or bootcut inseams by +1.5 in to skim 0.5 in above the floor.' }
  };

  var IN = 2.54;

  // m: { height, inseam, waist, hips, cut, shoe, unit: 'in' | 'cm' }
  function calculate(m) {
    var s = m || {};
    var u = s.unit === 'cm' ? 'cm' : 'in';
    var toIn = function (v) { var n = parseFloat(v); return u === 'cm' ? n / IN : n; };

    var heightIn = toIn(s.height);
    var inseamIn = toIn(s.inseam);
    var waistIn = toIn(s.waist);
    var hipsIn = toIn(s.hips);

    if (!isFinite(heightIn) || !isFinite(inseamIn) || !isFinite(waistIn) || !isFinite(hipsIn)) return null;
    if (heightIn < 54 || heightIn > 82 || inseamIn < 22 || inseamIn > 39 || waistIn < 20 || waistIn > 58 || hipsIn < 28 || hipsIn > 66) return null;
    if (inseamIn >= heightIn * 0.62) return null;

    var cutId = CUTS[s.cut] ? s.cut : 'straight';
    var shoeId = SHOES[s.shoe] ? s.shoe : 'sneakers';
    var cut = CUTS[cutId];
    var shoe = SHOES[shoeId];

    // Vertical leg ratio determines whether a high rise is needed to elongate the leg line
    var legRatio = (inseamIn / heightIn) * 100;
    // Base natural waist front rise scales with torso length (height - inseam)
    var torsoIn = heightIn - inseamIn;
    var idealRiseIn = Math.max(8.5, Math.min(12.5, (torsoIn * 0.305) + (legRatio < 46.5 ? 0.5 : legRatio > 49.5 ? -0.4 : 0)));

    var riseTier = idealRiseIn < 9.25 ? 'Mid Rise' : idealRiseIn < 11.0 ? 'High Rise' : 'Ultra-High Rise';
    var backRiseIn = idealRiseIn + 4.25;

    // Hip-to-waist differential determines denim pattern block (eliminates back waistband gap)
    var curveDiffIn = hipsIn - waistIn;
    var blockName, blockNote;
    if (curveDiffIn < 8.5) {
      blockName = 'Straight / Athletic Fit Block';
      blockNote = 'Your hip-to-waist difference is ' + (Math.round(curveDiffIn * 10) / 10) + ' in (< 8.5 in). Look for unisex, men\'s heritage, or straight-hip women\'s denim (e.g. Levi\'s 501 Original) for a smooth waist fit.';
    } else if (curveDiffIn <= 11.0) {
      blockName = 'Standard Fit Block';
      blockNote = 'Your hip-to-waist difference is ' + (Math.round(curveDiffIn * 10) / 10) + ' in (8.5–11 in), matching the standard retail denim block with a 10 in waist-to-hip grade.';
    } else {
      blockName = 'Curvy Fit Block (Anti-Gap Waist)';
      blockNote = 'Your hip-to-waist difference is ' + (Math.round(curveDiffIn * 10) / 10) + ' in (> 11 in). Choose dedicated "Curvy Fit" denim lines (cut with a contoured waistband and +2 in seat room) to prevent waistband gapping.';
    }

    var targetInseamIn = inseamIn + cut.hemOffsetIn + shoe.heelAddIn;
    var r1 = function (x) { return Math.round(x * 10) / 10; };
    var r2 = function (x) { return Math.round(x * 4) / 4; };

    return {
      unit: u,
      cutId: cutId,
      shoeId: shoeId,
      cut: cut,
      shoe: shoe,
      riseTier: riseTier,
      blockName: blockName,
      blockNote: blockNote,
      legPct: r1(legRatio),
      in: {
        frontRise: r2(idealRiseIn),
        backRise: r2(backRiseIn),
        targetInseam: r2(targetInseamIn),
        curveDiff: r1(curveDiffIn),
        legOpening: cut.openingIn
      },
      cm: {
        frontRise: r1(idealRiseIn * IN),
        backRise: r1(backRiseIn * IN),
        targetInseam: r1(targetInseamIn * IN),
        curveDiff: r1(curveDiffIn * IN),
        legOpening: r1(cut.openingIn * IN)
      }
    };
  }

  return { FACTS: FACTS, CUTS: CUTS, SHOES: SHOES, calculate: calculate };
});
