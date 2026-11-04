/*! SimplyStylo golden ratio & body proportion engine. (c) SimplyStylo. All rights reserved. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSProportion = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-03',
    goldenRatio: 1.6180339887,
    ruleOfThirds: '1:2 vertical ratio (top:bottom) creates optimal optical elongation'
  };

  // Neoclassical canon of 8 heads (Lysippos / Vitruvian proportion)
  // Leg-to-body proportion:
  // Leg length (inseam to floor) / Total Height:
  // < 0.45: Long Torso / Shorter Legs (Needs high-rise, cropped jackets, tucking)
  // 0.45 to 0.49: Balanced / Golden Mean (Versatile styling)
  // > 0.49: Long Legs / Shorter Torso (Needs mid/low-rise, longer cardigans, untucked tops)
  function analyze(params) {
    var unit = params.unit === 'cm' ? 'cm' : 'in';
    var height = Number(params.height) || (unit === 'cm' ? 170 : 67);
    var inseam = Number(params.inseam) || (unit === 'cm' ? 78 : 31);
    var shoulder = Number(params.shoulder) || (unit === 'cm' ? 42 : 16.5);
    var waist = Number(params.waist) || (unit === 'cm' ? 76 : 30);
    var gender = params.gender === 'menswear' ? 'menswear' : 'womenswear';

    // Normalize to inches for standardized internal calculations
    var hIn = unit === 'cm' ? height / 2.54 : height;
    var insIn = unit === 'cm' ? inseam / 2.54 : inseam;
    var shIn = unit === 'cm' ? shoulder / 2.54 : shoulder;
    var wIn = unit === 'cm' ? waist / 2.54 : waist;

    // Bounds check
    hIn = Math.max(48, Math.min(84, hIn));
    insIn = Math.max(20, Math.min(42, insIn));

    var legRatio = insIn / hIn; // Typical range: 0.42 - 0.53
    var torsoIn = hIn - insIn;
    var torsoRatio = torsoIn / hIn;

    var verticalType = 'balanced';
    var verticalTitle = 'Balanced Proportions';
    var verticalSummary = '';
    var riseGuidance = 'Mid-rise trousers and regular length tops';
    var tuckGuidance = 'French tuck (half-tuck) or full tuck with a clean belt';
    var jacketGuidance = 'Jackets hitting at the mid-hip point';

    if (legRatio < 0.46) {
      verticalType = 'long-torso';
      verticalTitle = 'Long Torso & Shorter Legs';
      verticalSummary = 'Your legs represent ' + Math.round(legRatio * 100) + '% of your total height. Creating an optical 1:2 ratio (short top, long bottom) will instantly elongate your silhouette.';
      riseGuidance = 'High-rise trousers (sitting above the natural waist) to visually extend the leg line';
      tuckGuidance = 'Always full-tuck tops into high-waisted bottoms to shorten the visual torso line';
      jacketGuidance = 'Cropped jackets, boleros, or blazers ending at or above the hip bone to raise the perceived waistline';
    } else if (legRatio > 0.495) {
      verticalType = 'long-legs';
      verticalTitle = 'Long Legs & Shorter Torso';
      verticalSummary = 'Your legs represent ' + Math.round(legRatio * 100) + '% of your total height. Your natural leg line is already elongated; the goal is creating torso definition and balancing vertical visual weight.';
      riseGuidance = 'Mid-rise or classic low-rise bottoms to avoid crowding your ribcage';
      tuckGuidance = 'Untucked tops, tunics, or leaving shirt hems loose to lengthen the upper body';
      jacketGuidance = 'Longline blazers, car coats, and duster cardigans that extend past the hip';
    } else {
      verticalType = 'balanced';
      verticalTitle = 'Balanced Vertical Proportions';
      verticalSummary = 'Your legs represent ' + Math.round(legRatio * 100) + '% of your total height, matching the classic golden proportion. You have maximum freedom across garment lengths.';
      riseGuidance = 'Classic mid-rise or high-rise depending on preference';
      tuckGuidance = 'French tuck, full tuck, or neatly tailored untucked shirts';
      jacketGuidance = 'Classic hip-length jackets and standard tailored blazers';
    }

    // Shoulder width (biacromial breadth across back) vs waist diameter (waist circumference / PI)
    // The classical golden Adonis V-taper ratio of shoulder breadth to waist diameter is ~1.618
    var waistDiameterIn = wIn / Math.PI;
    var shToWaist = shIn / waistDiameterIn;
    var horizontalSummary = '';
    if (gender === 'menswear') {
      if (shToWaist >= 1.6) {
        horizontalSummary = 'Strong Athletic V-Taper (Shoulder breadth to waist ratio: ' + shToWaist.toFixed(2) + '). Best in structured shoulders with fitted waists.';
      } else if (shToWaist >= 1.4) {
        horizontalSummary = 'Classic Tailored Proportion (Shoulder breadth to waist ratio: ' + shToWaist.toFixed(2) + '). Enhances natural shoulder line with standard canvassed blazers.';
      } else {
        horizontalSummary = 'Linear Column Proportion (Shoulder breadth to waist ratio: ' + shToWaist.toFixed(2) + '). Build upper body width with roped shoulder jackets, boatnecks, or horizontal chest stripes.';
      }
    } else {
      if (shToWaist >= 1.55) {
        horizontalSummary = 'Statuesque Broad Shoulder Line. Balance with A-line skirts, wide-leg trousers, and scoop or V-neck tops.';
      } else {
        horizontalSummary = 'Proportional Shoulder-to-Waist Frame. Complements boatnecks, puff sleeves, and tailored waist-cinching belts.';
      }
    }

    // Rule of Thirds outfit split calculation:
    // Ideal 1:2 split = Top is 1/3, Bottom is 2/3 of total vertical height
    var idealTopLengthIn = Math.round((hIn * 0.333) * 10) / 10;
    var idealBottomLengthIn = Math.round((hIn * 0.667) * 10) / 10;

    return {
      height: height,
      inseam: inseam,
      unit: unit,
      gender: gender,
      legPercent: Math.round(legRatio * 100),
      torsoPercent: Math.round(torsoRatio * 100),
      verticalType: verticalType,
      verticalTitle: verticalTitle,
      verticalSummary: verticalSummary,
      horizontalSummary: horizontalSummary,
      riseGuidance: riseGuidance,
      tuckGuidance: tuckGuidance,
      jacketGuidance: jacketGuidance,
      idealTopLength: unit === 'cm' ? Math.round(idealTopLengthIn * 2.54) : idealTopLengthIn,
      idealBottomLength: unit === 'cm' ? Math.round(idealBottomLengthIn * 2.54) : idealBottomLengthIn
    };
  }

  return {
    FACTS: FACTS,
    analyze: analyze
  };
});
