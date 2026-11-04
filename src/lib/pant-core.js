/*! SimplyStylo Trousers Hem & Pant Break Guide engine. (c) SimplyStylo. All rights reserved. */
// Bespoke Savile Row & American tailoring hem rules: calculates exact pant inseam, outseam, leg opening width,
// and optimal cuff height from body inseam, break preference, shoe style, and trouser fit.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSPant = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-03',
    method: 'Savile Row & Classical Tailoring Hem Standards (No Break to Full Break Offsets & Shoe Vamp Clearance)'
  };

  var BREAKS = {
    cropped: {
      name: 'Cropped (Ankle)',
      offsetIn: -1.0,
      crease: 0,
      look: 'Hem finishes 1 inch (2.5 cm) above the shoe vamp, showing the ankle bone or dress sock.',
      vibe: 'Modern casual, summer linen, loafers with no-show socks.',
      cuffRec: 'Works well with a 1.75 in (4.5 cm) turn-up cuff on tapered chinos or linen trousers.'
    },
    none: {
      name: 'No Break (Clean)',
      offsetIn: 0,
      crease: 0,
      look: 'Hem just kisses the top of the shoe vamp with zero horizontal folding in the fabric.',
      vibe: 'Sharp contemporary tailoring, slim and tailored suits, Chelsea boots, and loafers.',
      cuffRec: 'Best with a plain hem or a crisp 1.75 in (4.5 cm) cuff to weight the drape.'
    },
    quarter: {
      name: 'Quarter Break (Slight)',
      offsetIn: 0.4,
      crease: 1,
      look: 'Hem touches the shoe vamp and forms one subtle, shallow dimple at the front of the ankle.',
      vibe: 'The universal gold standard for business suits, wedding guest tailoring, and dress trousers.',
      cuffRec: 'Ideal with either a plain angled hem (military hem) or a 1.5 to 1.75 in (4–4.5 cm) cuff.'
    },
    half: {
      name: 'Half Break (Medium)',
      offsetIn: 0.75,
      crease: 2,
      look: 'Hem extends halfway down the shoe vamp and forms a distinct single horizontal fold.',
      vibe: 'Classic Savile Row & Brooks Brothers tailoring; drapes cleanly in medium-to-heavy wool.',
      cuffRec: 'Pairs naturally with a 1.75 to 2 in (4.5–5 cm) turn-up cuff on pleated trousers.'
    },
    full: {
      name: 'Full Break (Traditional)',
      offsetIn: 1.25,
      crease: 3,
      look: 'Hem reaches the back heel counter and forms a deeper fold across the front of the shoe.',
      vibe: 'Traditional formalwear, wider-leg trousers, and heavier flannel or tweed fabrics.',
      cuffRec: 'Usually finished with a plain hem or a 2 in (5 cm) cuff on wide-leg cuts.'
    }
  };

  var SHOES = {
    loafers: { name: 'Loafers / Slip-ons', vampAdjustIn: -0.25, note: 'Low vamp sits lower on the instep; hem must be 0.25 in shorter so it does not pool.' },
    oxfords: { name: 'Oxfords / Derbies', vampAdjustIn: 0, note: 'Standard dress shoe vamp height; the baseline reference for suit alterations.' },
    boots: { name: 'Dress / Chelsea Boots', vampAdjustIn: 0.25, note: 'Higher shaft supports the trouser leg; quarter or no break prevents catching on the pull tab.' },
    sneakers: { name: 'Minimalist Sneakers', vampAdjustIn: -0.25, note: 'Padded collar sits high; a clean no-break or slight quarter break keeps the sneaker profile crisp.' }
  };

  var FITS = {
    slim: { name: 'Slim Fit', openingIn: 7.0, bestBreaks: ['cropped', 'none', 'quarter'], note: 'Narrow 7 in (17.8 cm) leg opening catches high on the shoe; avoid full breaks or fabric will bunch.' },
    tailored: { name: 'Tailored / Straight', openingIn: 7.75, bestBreaks: ['none', 'quarter', 'half'], note: 'Balanced 7.75 in (19.7 cm) leg opening drapes cleanly over both oxfords and loafers.' },
    relaxed: { name: 'Relaxed / Wide Leg', openingIn: 8.75, bestBreaks: ['quarter', 'half', 'full'], note: 'Generous 8.75 in (22.2 cm) opening accommodates the shoe instep and allows a classic half or full break.' }
  };

  var IN = 2.54;

  // m: { inseam, brk, shoe, fit, cuff, unit: 'in' | 'cm' }
  function calculate(m) {
    var s = m || {};
    var u = s.unit === 'cm' ? 'cm' : 'in';
    var raw = parseFloat(s.inseam);
    var inseamIn = u === 'cm' ? raw / IN : raw;
    if (!isFinite(inseamIn) || inseamIn < 22 || inseamIn > 40) return null;

    var brkId = BREAKS[s.brk] ? s.brk : 'quarter';
    var shoeId = SHOES[s.shoe] ? s.shoe : 'oxfords';
    var fitId = FITS[s.fit] ? s.fit : 'tailored';
    var cuffed = s.cuff === 'yes';

    var brk = BREAKS[brkId];
    var shoe = SHOES[shoeId];
    var fit = FITS[fitId];

    // Effective trouser inseam = baseline crotch-to-shoe-top inseam + break offset + shoe vamp offset
    var hemIn = inseamIn + brk.offsetIn + shoe.vampAdjustIn;
    // Extra cloth required for turn-up cuff (2x cuff height + 0.5 in fold allowance = ~4 in)
    var clothNeededIn = hemIn + (cuffed ? 4.0 : 1.5);
    var cuffHeightIn = fitId === 'slim' ? 1.5 : fitId === 'tailored' ? 1.75 : 2.0;

    var r1 = function (x) { return Math.round(x * 10) / 10; };
    var r2 = function (x) { return Math.round(x * 4) / 4; }; // nearest quarter inch

    var warning = null;
    if (fitId === 'slim' && (brkId === 'half' || brkId === 'full')) {
      warning = 'A slim 7 in leg opening is too narrow to slip over the shoe vamp for a ' + brk.name.toLowerCase() + '; ask your tailor for a Quarter Break or No Break instead.';
    } else if (cuffed && brkId === 'full') {
      warning = 'Turn-up cuffs add weight at the ankle and look cleanest with No Break, Quarter Break, or Half Break rather than a Full Break.';
    }

    return {
      unit: u,
      brkId: brkId,
      shoeId: shoeId,
      fitId: fitId,
      cuffed: cuffed,
      brk: brk,
      shoe: shoe,
      fit: fit,
      in: {
        baseInseam: r2(inseamIn),
        targetInseam: r2(hemIn),
        delta: r2(brk.offsetIn + shoe.vampAdjustIn),
        opening: fit.openingIn,
        cuffHeight: cuffed ? cuffHeightIn : 0,
        clothRequired: r2(clothNeededIn)
      },
      cm: {
        baseInseam: r1(inseamIn * IN),
        targetInseam: r1(hemIn * IN),
        delta: r1((brk.offsetIn + shoe.vampAdjustIn) * IN),
        opening: r1(fit.openingIn * IN),
        cuffHeight: cuffed ? r1(cuffHeightIn * IN) : 0,
        clothRequired: r1(clothNeededIn * IN)
      },
      warning: warning
    };
  }

  return { FACTS: FACTS, BREAKS: BREAKS, SHOES: SHOES, FITS: FITS, calculate: calculate };
});
