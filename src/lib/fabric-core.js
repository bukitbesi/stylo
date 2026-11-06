/*! SimplyStylo Fabric Weight (GSM), Drape & Season Analyzer engine. (c) SimplyStylo. All rights reserved. */
// Converts between GSM (grams per square meter) and oz/yd² (ounces per square yard), classifies fabric weight tiers,
// evaluates thermal comfort temperature range, drape stiffness, opacity, and garment suitability.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSFabric = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-06',
    method: 'ISO 3801 / ASTM D3776 Textile Mass per Unit Area (1 oz/yd² = 33.9057 g/m²)',
    conversion: '1 oz/yd² = 33.9057 GSM (g/m²); GSM ÷ 33.9057 = oz/yd²'
  };

  var OZ_FACTOR = 33.905747;

  var FIBERS = {
    cotton: {
      name: 'Cotton (Poplin, Jersey, Twill)',
      breathability: 'High (natural cellulose fiber absorbs 8% moisture without feeling damp)',
      drape: 'Crisp to structured; softens with washing',
      care: 'Machine wash 30–40 °C; low shrinkage when pre-shrunk (sanforized).'
    },
    linen: {
      name: 'Flax Linen',
      breathability: 'Maximum (hollow bast fibers conduct heat away rapidly in humid climates)',
      drape: 'Airy with signature lived-in crease; relaxes half a size with body heat',
      care: 'Gentle wash 30 °C, line dry, steam while damp.'
    },
    wool: {
      name: 'Merino / Worsted Wool (Tropical to Flannel)',
      breathability: 'Thermo-regulating (crimped keratin traps air in cold and breathes in heat)',
      drape: 'Fluid, elastic, and naturally crease-resistant (ideal Savile Row trouser & suit drape)',
      care: 'Brush after wear, air on a cedar hanger, dry clean or wool-cycle hand wash.'
    },
    denim: {
      name: 'Indigo Twill / Selvedge Denim',
      breathability: 'Moderate (tight 3×1 warp-faced twill weave blocks wind)',
      drape: 'Rigid above 13 oz (440 GSM); molds to body creases over 30+ wears',
      care: 'Wash inside out in cold water every 10–15 wears; line dry.'
    },
    silk: {
      name: 'Mulberry Silk (Charmeuse, Crepe de Chine, Momme)',
      breathability: 'High for weight (smooth protein filament glides over skin)',
      drape: 'Liquid, bias-skimming drape (1 momme = 4.3056 GSM; 19–22 momme is luxury grade)',
      care: 'Hand wash cold with pH-neutral silk detergent or dry clean.'
    },
    cashmere: {
      name: 'Cashmere / Fine Knitwear',
      breathability: 'High warmth-to-weight ratio (up to 3× warmer than sheep wool by weight)',
      drape: 'Lofty, soft halo; 2-ply 240–320 GSM resists pilling far better than loose 1-ply knits',
      care: 'Hand wash lukewarm, press in towel, dry flat away from direct heat.'
    }
  };

  var TIERS = [
    { id: 'ultralight', maxGsm: 130, name: 'Ultra-Lightweight (Sheer to Voile)', tempC: '24 to 35 °C (75–95 °F)', opacity: 'Semi-sheer (may need lining in white/ivory)', garments: 'Summer voile shirts, silk blouses, pocket squares, lining' },
    { id: 'light', maxGsm: 200, name: 'Lightweight (Everyday Shirting & Tees)', tempC: '18 to 28 °C (64–82 °F)', opacity: 'Opaque in mid-to-dark shades; crisp handfeel', garments: 'Dress shirts (120–150 GSM), classic T-shirts (160–190 GSM), tropical wool suits' },
    { id: 'mid', maxGsm: 300, name: 'Medium Weight (All-Season Tailoring)', tempC: '10 to 21 °C (50–70 °F)', opacity: 'Fully opaque; holds a clean press crease', garments: 'Four-season worsted suits (240–280 GSM), heavyweight tees (240 GSM), chinos, linen trousers' },
    { id: 'midheavy', maxGsm: 400, name: 'Medium-Heavy (Structured Workwear & Knits)', tempC: '4 to 15 °C (39–59 °F)', opacity: 'Structured & wind-resistant', garments: '10–12 oz everyday jeans, French terry sweatshirts, tweed sport coats, flannel trousers' },
    { id: 'heavy', maxGsm: 900, name: 'Heavyweight (Overcoating & Raw Denim)', tempC: '-10 to 8 °C (14–46 °F)', opacity: 'Dense architectural armor; zero wind penetration', garments: '14–18 oz selvedge denim, Melton wool overcoats (450–650 GSM), heavy Aran sweaters' }
  ];

  // m: { val, unit: 'gsm' | 'oz', fiber }
  function analyze(m) {
    var s = m || {};
    var u = s.unit === 'oz' ? 'oz' : 'gsm';
    var raw = parseFloat(s.val);
    if (!isFinite(raw) || raw <= 0) return null;

    var gsm = u === 'oz' ? raw * OZ_FACTOR : raw;
    if (gsm < 30 || gsm > 850) return null;

    var oz = gsm / OZ_FACTOR;
    var momme = gsm / 4.3056;
    var fiberId = FIBERS[s.fiber] ? s.fiber : 'cotton';
    var fiber = FIBERS[fiberId];

    var tier = TIERS[TIERS.length - 1];
    for (var i = 0; i < TIERS.length; i++) {
      if (gsm <= TIERS[i].maxGsm) { tier = TIERS[i]; break; }
    }

    var r1 = function (x) { return Math.round(x * 10) / 10; };

    return {
      unit: u,
      fiberId: fiberId,
      fiber: fiber,
      tier: tier,
      gsm: Math.round(gsm),
      oz: r1(oz),
      momme: r1(momme)
    };
  }

  return { FACTS: FACTS, FIBERS: FIBERS, TIERS: TIERS, analyze: analyze };
});
