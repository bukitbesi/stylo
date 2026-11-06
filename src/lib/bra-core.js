/*! SimplyStylo Bra & Band Sister-Size Calculator engine. (c) SimplyStylo. All rights reserved. */
// Modern +0 anatomical underbust method vs legacy +4 store method. Converts between UK, US, EU, and AU/NZ
// bra sizes, computes Sister Size Up and Sister Size Down, and estimates cup volume (cc).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSBra = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-04',
    method: 'Modern +0 Direct Underbust Fitting Standard (1 inch cup progression) with UK / US / EU / AU Cross-Grading'
  };

  // Index 1 = 1 inch difference (A cup) up to 15 inches (UK K / US O)
  var UK_CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K'];
  var US_CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD/E', 'DDD/F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  var EU_CUPS = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

  // Approximate single-breast cup volume (cc / ml) for a 34 band baseline; scales by 1 step per band
  var VOL_34 = [130, 180, 240, 310, 390, 480, 590, 710, 850, 1000, 1180, 1370, 1580, 1810, 2060, 2340];

  var IN = 2.54;

  function bandToEU(ukBand) {
    // 28 -> 60, 30 -> 65, 32 -> 70, 34 -> 75, 36 -> 80, 38 -> 85, 40 -> 90
    return (ukBand - 4) * 2.5;
  }

  function bandToAU(ukBand) {
    // UK 28 -> AU 6, UK 30 -> AU 8, UK 32 -> AU 10, UK 34 -> AU 12, UK 36 -> AU 14, UK 38 -> AU 16
    return ukBand - 22;
  }

  function formatSize(band, cupIdx) {
    var idx = Math.max(0, Math.min(UK_CUPS.length - 1, cupIdx));
    var euBand = bandToEU(band);
    var auBand = bandToAU(band);
    return {
      band: band,
      cupIdx: idx,
      uk: band + UK_CUPS[idx],
      us: band + US_CUPS[idx],
      eu: euBand + EU_CUPS[idx],
      au: auBand + UK_CUPS[idx]
    };
  }

  // m: { underbust, bust, fit: 'snug' | 'comfort', unit: 'in' | 'cm' }
  function calculate(m) {
    var s = m || {};
    var u = s.unit === 'cm' ? 'cm' : 'in';
    var rawUnder = parseFloat(s.underbust);
    var rawBust = parseFloat(s.bust);
    var underIn = u === 'cm' ? rawUnder / IN : rawUnder;
    var bustIn = u === 'cm' ? rawBust / IN : rawBust;

    if (!isFinite(underIn) || !isFinite(bustIn)) return null;
    if (underIn < 24 || underIn > 48 || bustIn < 26 || bustIn > 62 || bustIn < underIn) return null;

    // Modern +0 method: round snug underbust to nearest even band number (or next even up if comfort fit)
    var baseBand = Math.round(underIn / 2) * 2;
    if (s.fit === 'comfort' && baseBand < underIn + 0.75) baseBand += 2;
    baseBand = Math.max(26, Math.min(48, baseBand));

    // Cup index = bust - band (1 inch = index 1 = A cup; < 1 inch = index 0 = AA)
    var diffIn = bustIn - baseBand;
    var cupIdx = Math.max(0, Math.min(UK_CUPS.length - 1, Math.round(diffIn)));

    var primary = formatSize(baseBand, cupIdx);

    // Sister size down: band - 2, cupIdx + 1 (same cup volume, firmer band)
    var sisterDown = baseBand >= 28 && cupIdx < UK_CUPS.length - 1 ? formatSize(baseBand - 2, cupIdx + 1) : null;
    // Sister size up: band + 2, cupIdx - 1 (same cup volume, looser band)
    var sisterUp = baseBand <= 46 && cupIdx >= 1 ? formatSize(baseBand + 2, cupIdx - 1) : null;

    // Legacy "+4 store method" comparison (why traditional charts misfit 80% of wearers)
    var legacyBand = Math.min(48, baseBand + 4);
    var legacyCupIdx = Math.max(0, Math.round(bustIn - legacyBand));
    var legacySize = formatSize(legacyBand, legacyCupIdx);

    // Volume index relative to a 34 band
    var volShift = (baseBand - 34) / 2;
    var volIdx = Math.max(0, Math.min(VOL_34.length - 1, Math.round(cupIdx + volShift)));
    var volumeCc = VOL_34[volIdx];

    var r1 = function (x) { return Math.round(x * 10) / 10; };

    return {
      unit: u,
      fit: s.fit === 'comfort' ? 'comfort' : 'snug',
      underIn: r1(underIn),
      bustIn: r1(bustIn),
      underCm: r1(underIn * IN),
      bustCm: r1(bustIn * IN),
      diffIn: r1(bustIn - underIn),
      primary: primary,
      sisterDown: sisterDown,
      sisterUp: sisterUp,
      legacySize: legacySize,
      volumeCc: volumeCc
    };
  }

  function tableRows() {
    var rows = [];
    for (var i = 1; i <= 11; i++) {
      rows.push({ diffIn: i, diffCm: Math.round(i * 2.54 * 10) / 10, uk: UK_CUPS[i], us: US_CUPS[i], eu: EU_CUPS[i] });
    }
    return rows;
  }

  return { FACTS: FACTS, UK_CUPS: UK_CUPS, US_CUPS: US_CUPS, EU_CUPS: EU_CUPS, calculate: calculate, tableRows: tableRows };
});
