/*! SimplyStylo garment illustrations. (c) SimplyStylo. All rights reserved. */
// Bespoke tailored garment illustrations drawn as multi-layered inline SVG in any color, with subtle fabric highlights,
// drop shadows, stitch lines, and hardware accents so every outfit and capsule result looks like an editorial lookbook.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSGarment = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Each shape: filled body paths, optional secondary/collar fills, sole paths, and tailored stitch/fold detail strokes.
  var SHAPES = {
    tee: {
      body: ['M21 9 Q32 13 43 9 L55 18 L50 28 L45 24 L45 56 Q32 57 19 56 L19 24 L14 28 L9 18 Z'],
      detail: ['M23 9.5 Q32 15.5 41 9.5', 'M21 9 Q32 13 43 9', 'M19 52.5 Q32 53.5 45 52.5', 'M14 26 L18.5 22.5', 'M50 26 L45.5 22.5', 'M24 34 Q25 46 24 54']
    },
    shirt: {
      body: ['M21 9 L26 7 L32 13 L38 7 L43 9 L53 15 L58 46 L51 48 L46 23 L46 57 Q32 58.5 18 57 L18 23 L13 48 L6 46 L11 15 Z'],
      collar: ['M26 7 L32 13 L28 17 L23 11 Z', 'M38 7 L32 13 L36 17 L41 11 Z'],
      detail: ['M32 13 V57', 'M35 28 H42 V36 H35 Z', 'M7 43 L13.5 45', 'M57 43 L50.5 45', 'M32 20 V20.5', 'M32 28 V28.5', 'M32 36 V36.5', 'M32 44 V44.5']
    },
    sweater: {
      body: ['M21 9 Q32 14 43 9 L53 15 L58 47 L51 49 L46 24 L46 56 H18 L18 24 L13 49 L6 47 L11 15 Z'],
      detail: ['M23 9.5 Q32 16 41 9.5', 'M18 51 H46', 'M22 51 V56', 'M27 51 V56', 'M32 51 V56', 'M37 51 V56', 'M42 51 V56', 'M7 44 L13.5 46', 'M57 44 L50.5 46']
    },
    turtleneck: {
      body: ['M25 4 Q32 5 39 4 L40 10 Q32 12 24 10 Z', 'M21 10 L24 10 Q32 12 40 10 L43 10 L53 15 L58 47 L51 49 L46 24 L46 56 H18 L18 24 L13 49 L6 47 L11 15 Z'],
      detail: ['M25 7 Q32 8 39 7', 'M18 52 H46', 'M7 44 L13.5 46', 'M57 44 L50.5 46', 'M28 4 V10', 'M32 4.5 V10.5', 'M36 4 V10']
    },
    tank: {
      body: ['M23 6 L27 6 Q32 19 37 6 L41 6 Q41 18 45 22 L46 56 Q32 57 18 56 L19 22 Q23 18 23 6 Z'],
      detail: ['M25 6 Q32 21 39 6', 'M18 52.5 Q32 53.5 46 52.5']
    },
    polo: {
      body: ['M21 9 L26 7 L32 12 L38 7 L43 9 L55 18 L50 28 L45 24 L45 56 Q32 57 19 56 L19 24 L14 28 L9 18 Z'],
      collar: ['M26 7 L32 12 L28 16 L23 10 Z', 'M38 7 L32 12 L36 16 L41 10 Z'],
      detail: ['M30 12 H34 V24 H30 Z', 'M32 16 V16.5', 'M32 20 V20.5', 'M14 26 L18.5 22.5', 'M50 26 L45.5 22.5']
    },
    trousers: {
      body: ['M18 6 H46 L49 59 H36.5 L32 23 L27.5 59 H15 Z'],
      detail: ['M18 11 H46', 'M32 11 V23', 'M24 6 V11', 'M39 6 V11', 'M18 14 L23 21', 'M46 14 L41 21', 'M22.5 16 V56', 'M41.5 16 V56', 'M15 56 H27.5', 'M36.5 56 H49']
    },
    jeans: {
      body: ['M18 6 H46 L49 59 H36.5 L32 23 L27.5 59 H15 Z'],
      detail: ['M18 11 H46', 'M32 11 V23', 'M32 11 Q35 17 32 21', 'M18 15 Q23 19 25 11', 'M46 15 Q41 19 39 11', 'M24 6 V11', 'M40 6 V11', 'M15 55.5 H27.5', 'M36.5 55.5 H49']
    },
    shorts: {
      body: ['M17 11 H47 L51 43 H35.5 L32 27 L28.5 43 H13 Z'],
      detail: ['M17 16 H47', 'M32 16 V27', 'M17 19 L22 25', 'M47 19 L42 25', 'M13.5 40 H28.5', 'M35.5 40 H50.5']
    },
    skirt: {
      body: ['M22 7 H42 L53 56 Q32 59 11 56 Z'],
      detail: ['M22 12 H42', 'M27 12 L22 54', 'M32 12 V55', 'M37 12 L42 54']
    },
    dress: {
      body: ['M23 5 L27 5 Q32 12 37 5 L41 5 L43 17 L39 24 L54 59 Q32 62 10 59 L25 24 L21 17 Z'],
      detail: ['M25 24 H39', 'M28 24 L20 56', 'M32 24 V57', 'M36 24 L44 56']
    },
    gown: {
      body: ['M24 4 L28 4 Q32 10 36 4 L40 4 L42 16 L38 22 L57 61 Q32 64 7 61 L26 22 L22 16 Z'],
      detail: ['M26 22 H38', 'M29 22 L17 59', 'M32 22 V60', 'M35 22 L47 59']
    },
    jumpsuit: {
      body: ['M22 5 L27 5 Q32 11 37 5 L42 5 L44 24 L48 59 H36 L32 33 L28 59 H16 L20 24 Z'],
      detail: ['M20 24 H44', 'M32 11 V24', 'M22 28 L26 33', 'M42 28 L38 33']
    },
    jacket: {
      body: ['M20 7 L27 6 L32 26 L37 6 L44 7 L54 13 L58 50 L51 52 L47 26 L47 58 L33 58 L32 46 L31 58 L17 58 L17 26 L13 52 L6 50 L10 13 Z'],
      collar: ['M25 6.5 L20 14 L25 16 L23 20 L32 26 L27 6 Z', 'M39 6.5 L44 14 L39 16 L41 20 L32 26 L37 6 Z'],
      detail: ['M32 26 V46', 'M20 43 H27 V46 H20 Z', 'M37 43 H44 V46 H37 Z', 'M36 21 H42', 'M32 31 V31.5', 'M32 37 V37.5']
    },
    coat: {
      body: ['M19 5 L26 4 L32 23 L38 4 L45 5 L54 11 L58 53 L51 55 L47 26 L49 61 H15 L17 26 L13 55 L6 53 L10 11 Z'],
      collar: ['M24 4.5 L18 13 L24 15 L22 19 L32 23 L26 4 Z', 'M40 4.5 L46 13 L40 15 L42 19 L32 23 L38 4 Z'],
      detail: ['M32 23 V61', 'M16 37 H48 V41 H16 Z', 'M29 36 H35 V42 H29 Z', 'M28 29 V29.5', 'M36 29 V29.5', 'M28 47 V47.5', 'M36 47 V47.5']
    },
    cardigan: {
      body: ['M21 8 L26 7 L32 28 L38 7 L43 8 L53 14 L58 47 L51 49 L46 24 L46 56 H18 L18 24 L13 49 L6 47 L11 14 Z'],
      detail: ['M26 7 L32 28 L38 7', 'M32 28 V56', 'M18 52 H46', 'M21 42 H28 V48 H21 Z', 'M36 42 H43 V48 H36 Z', 'M32 34 V34.5', 'M32 40 V40.5', 'M32 46 V46.5']
    },
    vest: {
      body: ['M22 6 L26 5 L32 25 L38 5 L42 6 L46 18 L46 54 L39 58 L32 53 L25 58 L18 54 L18 18 Z'],
      detail: ['M26 5 L32 25 L38 5', 'M32 25 V53', 'M21 42 H28', 'M36 42 H43', 'M32 30 V30.5', 'M32 36 V36.5', 'M32 42 V42.5', 'M32 48 V48.5']
    },
    // Footwear: sculpted side profiles with realistic lasts, welts, heels, and hardware/stitch lines.
    sneakers: {
      body: ['M6 43 L7.5 31 Q8.5 24 13.5 25 L18 28.5 Q22 31.5 26.5 27.5 L30 22 Q33 21 35 24.5 L43 32 Q50 33.5 56.5 37.5 Q60 39.5 59 43.5 Z'],
      sole: ['M5 43.5 H60 Q61 47.5 59 50 Q56 51 8 51 Q5 51 5 47 Z'],
      tone: 'light',
      detail: ['M8.5 34 Q16 34 20 43.5', 'M25 33 Q34 38 40 43.5', 'M30 26 L34.5 24', 'M33 29.5 L37.5 27.5', 'M36 33 L40.5 31', 'M48 35.5 Q51.5 40.5 58 41.5', 'M5 47 H60']
    },
    loafers: {
      body: ['M6 43 Q5.5 32 10.5 29.5 L16 30.5 Q22 35 30 32 L33.5 27.5 Q36.5 26.5 39 29.5 Q47 33.5 55.5 36 Q60 38 59.5 43 Z'],
      sole: ['M5 43 H60 V45.5 Q60 47.5 57 47.5 H21 V52 H7 V47.5 Q5 47.5 5 45.5 Z'],
      tone: 'dark',
      hardware: ['M31 30.5 H38 V33 H31 Z', 'M33 29 V34.5', 'M36 29 V34.5'],
      detail: ['M15 33.5 Q28 40 50 37', 'M28.5 31.5 L36 36.5', 'M7 36 Q12 37 14 43', 'M5 45.5 H60']
    },
    heels: {
      body: ['M8 23 Q12.5 21.5 15 26.5 Q21 37.5 33 41.5 Q41.5 42.5 46.5 39.5 Q53.5 39.5 58.5 44 Q60 46 57 48 L36 48 Q23 44 9.5 34 Z'],
      sole: ['M9 33 L14 36.5 L13 57 H10.5 L9.5 36 Z', 'M9.5 34 Q23 44 36 48 L57 48 Q59 49.5 56 50.5 L35 50.5 Q22 46.5 9.5 35.5 Z'],
      tone: 'dark',
      detail: ['M14 25.5 Q22 36.5 34 41.5', 'M45 40 Q51 42 56 46', 'M13 54 H10.8']
    },
    boots: {
      body: ['M15 12 H20 V9.5 H23.5 V12 H32 L33.5 32 Q44.5 35 54.5 38 Q60 40 59 45 H13 L14 27 Z'],
      sole: ['M11 45 H60 V48.5 Q60 51 57 51 H25 V55 H11 V48.5 Z'],
      tone: 'dark',
      gore: ['M21 12 H28.5 V28 Q28.5 32.5 25 32.5 Q21 32.5 21 28 Z'],
      detail: ['M14 37 Q22 38 26 45', 'M11 47.5 H59', 'M20 9.5 Q21.8 7 23.5 9.5']
    },
    sandals: {
      body: ['M9 44 Q8 34 15 31 L27 29 L28 32.5 L16 34.5 Q12.5 36.5 12.5 44 Z', 'M14 29 H30 V32 H14 Z', 'M41 44 Q43 35 51 36 Q57 37 57 44 H53 Q53 40 49.5 40 Q45.5 40 45 44 Z'],
      sole: ['M5 44 H59 Q61 44 61 46.5 Q61 49 58 49 H20 V53 H7 V49 Q5 49 5 46.5 Z'],
      tone: 'tan',
      hardware: ['M21 28.5 H25 V32.5 H21 Z'],
      detail: ['M21 28.5 H25 V32.5 H21 Z']
    },
    bag: {
      body: ['M12 24 H52 L56 56 Q56 59 53 59 H11 Q8 59 8 56 Z'],
      collar: ['M12 24 H52 L50 36 Q32 39 14 36 Z'],
      detail: ['M23 24 V15 Q23 8 32 8 Q41 8 41 15 V24', 'M29 35 H35 V40 H29 Z', 'M15 28 V55', 'M49 28 V55']
    },
    scarf: {
      body: ['M22 7 Q32 5 42 7 V32 L48 56 H36 L32 37 L28 56 H16 L22 32 Z'],
      detail: ['M22 22 H42', 'M20 31 H44', 'M17 53 V58', 'M21 53 V58', 'M25 53 V58', 'M38 53 V58', 'M42 53 V58', 'M46 53 V58']
    },
    tie: {
      body: ['M27 6 H37 L39 13 L35 17 L41 49 L32 59 L23 49 L29 17 L25 13 Z'],
      detail: ['M25 13 H39', 'M29 17 H35', 'M32 17 V26', 'M27 36 L37 30', 'M26 44 L38 38']
    },
    square: {
      body: ['M14 28 H50 V56 Q50 58 48 58 H16 Q14 58 14 56 Z'],
      collar: ['M18 28 L25 11 L32 22 L39 9 L46 28 Z'],
      detail: ['M14 33 H50', 'M25 16 L31 28', 'M39 14 L34 28']
    },
    belt: {
      body: ['M5 27 H59 Q61 32 59 37 H5 Z'],
      collar: ['M21 24 H33 V40 H21 Z'],
      detail: ['M24 27 H30 V37 H24 Z', 'M28 32 H36', 'M43 32 H43.5', 'M47 32 H47.5', 'M51 32 H51.5']
    },
    watch: {
      body: ['M26 4 H38 V18 H26 Z', 'M26 46 H38 V60 H26 Z'],
      collar: ['M32 17 A15 15 0 1 1 31.9 17 Z'],
      detail: ['M32 20 A12 12 0 1 1 31.9 20 Z', 'M32 24 V32 L37 35', 'M47 30 V34', 'M29 10 H35', 'M29 52 H35']
    },
    sunglasses: {
      body: ['M5 24 H28 L27 36 Q26 43 16.5 43 Q7 43 6 36 Z', 'M36 24 H59 L58 36 Q57 43 47.5 43 Q38 43 37 36 Z'],
      detail: ['M3 24 H61', 'M27 28 Q32 25 37 28', 'M10 28 L15 38', 'M41 28 L46 38']
    },
    gloves: {
      body: ['M18 59 V32 L13 20 Q11.5 15 15.5 14.5 L20 23 V9 Q20 5 23 5 Q26 5 26 9 V21 V6.5 Q26 3 29 3 Q32 3 32 6.5 V21 V7.5 Q32 4 35 4 Q38 4 38 7.5 V22 V11 Q38 8 41 8 Q44 8 44 11 V39 L42 59 Z'],
      detail: ['M18 53 H42', 'M25 32 V45', 'M30 31 V46', 'M35 32 V45']
    },
    socks: {
      body: ['M23 5 H38 V35 L49 45 Q55 51 49 57 Q44 62 37 57 L24 45 Q22 42 23 37 Z'],
      detail: ['M23 11 H38', 'M23 15 H38', 'M23 36 Q31 36 33 44', 'M43 49 Q46 53 43 57']
    },
    jewelry: {
      body: ['M32 54 L39 44 L32 34 L25 44 Z'],
      detail: ['M12 8 Q32 44 52 8', 'M25 44 H39', 'M32 34 V54']
    }
  };

  var MATCH = [
    [/cummerbund/i, 'belt'], [/\btie\b/i, 'tie'], [/gloves/i, 'gloves'], [/socks|underwear/i, 'socks'], [/swim/i, 'tank'], [/pocket square/i, 'square'], [/belt/i, 'belt'], [/watch/i, 'watch'], [/sunglasses/i, 'sunglasses'],
    [/jewel/i, 'jewelry'], [/scarf/i, 'scarf'], [/bag|tote|clutch|backpack/i, 'bag'], [/sneakers/i, 'sneakers'],
    [/boots/i, 'boots'], [/heels|pumps/i, 'heels'], [/sandals|espadrilles/i, 'sandals'],
    [/loafers|flats|derbies|oxfords|shoes/i, 'loafers'], [/gown/i, 'gown'], [/jumpsuit/i, 'jumpsuit'], [/dress/i, 'dress'],
    [/skirt/i, 'skirt'], [/shorts/i, 'shorts'], [/waistcoat/i, 'vest'], [/coat|parka|trench|\bmac\b|puffer/i, 'coat'],
    [/blazer|jacket|harrington|overshirt|shacket|tuxedo|\bsuit\b|sport coat/i, 'jacket'], [/cardigan/i, 'cardigan'], [/vest|gilet|waistcoat/i, 'vest'],
    [/jeans/i, 'jeans'], [/trousers|chinos/i, 'trousers'], [/turtleneck|rollneck/i, 'turtleneck'],
    [/sleeveless|tank|cami|shell/i, 'tank'], [/polo/i, 'polo'],
    [/t-shirt|\btee\b|henley/i, 'tee'], [/sweater|knit|crew-neck|merino|quarter-zip|long-sleeve|fleece|sleepwear|activewear/i, 'sweater'], [/shirt|blouse|wrap top/i, 'shirt']
  ];

  function shapeFor(name) {
    for (var i = 0; i < MATCH.length; i++) if (MATCH[i][0].test(name)) return MATCH[i][1];
    return 'tee';
  }

  // Colors implied by a garment's own name, for pieces such as "White T-shirt" or "Dark jeans".
  var NAMED = [
    [/light blue/i, '#A9C6E3'], [/\bwhite\b/i, '#FAFAF7'], [/\bblack\b/i, '#1B1B1B'], [/\bnavy\b/i, '#1F2A44'],
    [/\bgr[ae]y\b/i, '#8E9094'], [/\bbrown\b/i, '#6B4A33'], [/\bstone\b/i, '#CFC6B0'], [/dark jeans/i, '#2E3E57'],
    [/chambray/i, '#8BA3C0'], [/jeans|denim/i, '#4A6584']
  ];
  function impliedHex(name) {
    for (var i = 0; i < NAMED.length; i++) if (NAMED[i][0].test(name)) return NAMED[i][1];
    return null;
  }

  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var m = function (v) { return Math.max(0, Math.min(255, Math.round(v * f))); };
    return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1).toUpperCase();
  }

  function lum(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  }

  // Sole tone contrasts with the upper: a white sneaker gets a warm rubber sole, a black boot gets an espresso leather welt.
  function soleFor(tone, fill) {
    var l = lum(fill);
    if (tone === 'light') return l > 0.85 ? '#D4CFC3' : '#F6F3EC';
    if (tone === 'tan') return l > 0.55 && l < 0.75 ? '#8A6A4A' : '#C9A27A';
    return l < 0.2 ? '#5E422F' : '#26211E';
  }

  // label is used as the accessible name; decorative=true hides it from screen readers (text is next to it).
  function svg(name, hex, size, decorative) {
    var s = SHAPES[shapeFor(name)];
    var fill = /^#[0-9A-F]{6}$/i.test(hex || '') ? hex.toUpperCase() : '#B8A58D';
    var l = lum(fill);
    var line = l < 0.25 ? shade(fill, 1.95) : shade(fill, 0.58);
    var collarFill = l < 0.25 ? shade(fill, 1.35) : shade(fill, 0.91);
    var px = size || 64;
    return '<svg class="garment" width="' + px + '" height="' + px + '" viewBox="0 0 64 64"' +
      (decorative ? ' aria-hidden="true"' : ' role="img" aria-label="' + String(name).replace(/"/g, '') + '"') + '>' +
      '<ellipse cx="32" cy="60.5" rx="19" ry="2" fill="rgba(17,17,16,0.09)"/>' +
      s.body.map(function (d) { return '<path d="' + d + '" fill="' + fill + '" stroke="' + line + '" stroke-width="1.35" stroke-linejoin="round"/>'; }).join('') +
      (s.collar || []).map(function (d) { return '<path d="' + d + '" fill="' + collarFill + '" stroke="' + line + '" stroke-width="1.2" stroke-linejoin="round"/>'; }).join('') +
      (s.gore || []).map(function (d) { return '<path d="' + d + '" fill="' + (l < 0.3 ? '#1E1D1B' : shade(fill, 0.72)) + '" stroke="' + line + '" stroke-width="1.1" stroke-linejoin="round"/>'; }).join('') +
      (s.sole || []).map(function (d) { return '<path d="' + d + '" fill="' + soleFor(s.tone, fill) + '" stroke="' + line + '" stroke-width="1.2" stroke-linejoin="round"/>'; }).join('') +
      (s.detail || []).map(function (d) { return '<path d="' + d + '" fill="none" stroke="' + line + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('') +
      (s.hardware || []).map(function (d) { return '<path d="' + d + '" fill="#C5A059" stroke="#8A6E30" stroke-width="0.85" stroke-linejoin="round"/>'; }).join('') +
      '</svg>';
  }

  // Editorial Lookbook Presets: fully coordinated high-fashion ensembles with color science ratios.
  var LOOKS = {
    savile: {
      id: 'savile',
      name: 'Savile Row Bespoke',
      subhead: 'Executive Sartorial Power',
      tagline: 'Classic British architectural tailoring with refined Italian drape',
      season: 'Deep Winter / Deep Autumn',
      seasonLink: '/seasons/deep-winter/',
      shirtHex: '#FAF8F5',
      blazerHex: '#1F2A44',
      trouserHex: '#384358',
      shoeHex: '#4A3326',
      shoeType: 'loafers',
      accentHex: '#6D1F2E',
      palette: [
        { role: '60% Base', hex: '#1F2A44', name: 'Midnight Navy', garment: 'Roped-Shoulder Blazer', tool: '/tools/color-combination/' },
        { role: '30% Secondary', hex: '#B98A57', name: 'Cashmere Camel', garment: 'Pleated Wool Trousers', tool: '/tools/pant-break-guide/' },
        { role: '10% Accent', hex: '#6D1F2E', name: 'Vintage Burgundy', garment: 'Silk Pocket Square', tool: '/tools/color-analysis/' }
      ],
      shoesName: 'Espresso Burnished Loafers',
      notes: 'The undisputed benchmark of international power dressing. Deep midnight navy commands authority, balanced by tactile cashmere and a flash of vintage burgundy.'
    },
    mayfair: {
      id: 'mayfair',
      name: 'Mayfair Quiet Luxury',
      subhead: 'Autumn Tweed & Knitwear',
      tagline: 'Understated British countryside elegance calibrated for the city',
      season: 'Soft Autumn / Warm Autumn',
      seasonLink: '/seasons/soft-autumn/',
      shirtHex: '#DDD0BE',
      blazerHex: '#263327',
      trouserHex: '#423A31',
      shoeHex: '#261F1A',
      shoeType: 'boots',
      accentHex: '#9E472A',
      palette: [
        { role: '60% Base', hex: '#263327', name: 'Forest Loden', garment: 'Tweed Sport Coat', tool: '/tools/color-combination/' },
        { role: '30% Secondary', hex: '#DDD0BE', name: 'Oatmeal Merino', garment: 'Crewneck Knit', tool: '/tools/capsule-wardrobe/' },
        { role: '10% Accent', hex: '#9E472A', name: 'Burnt Terracotta', garment: 'Silk Wool Scarf', tool: '/tools/color-analysis/' }
      ],
      shoesName: 'Burnished Chelsea Boots',
      notes: 'Low-contrast tonal sophistication. Deep forest green grounded with warm oatmeal wool and spiced with earthy terracotta creates effortless elegance.'
    },
    riviera: {
      id: 'riviera',
      name: 'Riviera Summer Linen',
      subhead: 'Mediterranean Sprezzatura',
      tagline: 'Sun-drenched, breathable tailoring with effortless nonchalance',
      season: 'Light Summer / Warm Spring',
      seasonLink: '/seasons/light-summer/',
      shirtHex: '#8BA3C0',
      blazerHex: '#C2B69D',
      trouserHex: '#EAE5D9',
      shoeHex: '#8A6A4A',
      shoeType: 'loafers',
      accentHex: '#C5A059',
      palette: [
        { role: '60% Base', hex: '#C2B69D', name: 'Sandstone Linen', garment: 'Unstructured Jacket', tool: '/tools/color-combination/' },
        { role: '30% Secondary', hex: '#8BA3C0', name: 'Chambray Sky', garment: 'Linen Popover Shirt', tool: '/tools/capsule-wardrobe/' },
        { role: '10% Accent', hex: '#C5A059', name: 'Champagne Brass', garment: 'Woven Hardware Belt', tool: '/tools/color-analysis/' }
      ],
      shoesName: 'Cognac Suede Horsebit Loafers',
      notes: 'Breezy coastal tailoring engineered for warm climates. Natural sand linen softens formal structure, lifted by sky blue chambray and warm brass.'
    }
  };

  // Renders a high-fashion styled model figure (editorial croquis) with layered garments and pin leaders.
  function figureSvg(lookId, width, height) {
    var look = LOOKS[lookId] || LOOKS.savile;
    var w = width || 260;
    var h = height || 410;
    var blazerFill = look.blazerHex;
    var blazerStroke = shade(blazerFill, 0.65);
    var blazerLapel = shade(blazerFill, 0.85);
    var shirtFill = look.shirtHex;
    var trouserFill = look.trouserHex;
    var trouserStroke = shade(trouserFill, 0.65);
    var shoeFill = look.shoeHex;
    var shoeStroke = shade(shoeFill, 0.6);
    var accentFill = look.accentHex;

    return '<svg class="lookbook-figure" width="' + w + '" height="' + h + '" viewBox="0 0 240 390" role="img" aria-label="' + look.name + ' styled model silhouette">' +
      '<defs>' +
      '  <radialGradient id="lb-halo" cx="50%" cy="40%" r="55%">' +
      '    <stop offset="0%" stop-color="#C5A059" stop-opacity="0.12"/>' +
      '    <stop offset="100%" stop-color="#FAF8F5" stop-opacity="0"/>' +
      '  </radialGradient>' +
      '</defs>' +
      '<!-- Editorial ambient halo -->' +
      '<ellipse cx="120" cy="180" rx="95" ry="160" fill="url(#lb-halo)"/>' +
      '<!-- Ground shadow -->' +
      '<ellipse cx="120" cy="370" rx="68" ry="7" fill="rgba(17,17,16,0.1)"/>' +
      '<ellipse cx="120" cy="370" rx="42" ry="4" fill="rgba(17,17,16,0.14)"/>' +

      '<!-- Head silhouette & sculpted chignon -->' +
      '<path d="M110 26 Q120 18 130 26 Q134 38 127 49 Q120 54 113 49 Q106 38 110 26 Z" fill="#D9CEBF" stroke="#9A8C7A" stroke-width="1.1"/>' +
      '<path d="M110 26 Q118 20 126 23 Q132 28 131 34 Q127 28 117 29 Q111 31 110 26 Z" fill="#2B241E"/>' +
      '<!-- Neck -->' +
      '<path d="M115 48 L115 67 Q120 70 125 67 L125 48 Z" fill="#D9CEBF"/>' +

      '<!-- Inner poplin shirt / knit collar -->' +
      '<path d="M114 66 L120 84 L112 92 L106 78 Z" fill="' + shirtFill + '" stroke="#CCC5B8" stroke-width="1"/>' +
      '<path d="M126 66 L120 84 L128 92 L134 78 Z" fill="' + shirtFill + '" stroke="#CCC5B8" stroke-width="1"/>' +
      '<path d="M120 84 V116" stroke="#BBB2A3" stroke-width="1" stroke-linecap="round"/>' +

      '<!-- Tailored Trousers (high-twist wool) -->' +
      '<path d="M94 176 L82 334 H112 L120 226 L128 334 H158 L146 176 Z" fill="' + trouserFill + '" stroke="' + trouserStroke + '" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<!-- Trouser pressed crease lines (Savile Row standard) -->' +
      '<line x1="97" y1="190" x2="97" y2="330" stroke="' + shade(trouserFill, 0.78) + '" stroke-width="1.1" stroke-dasharray="1 0"/>' +
      '<line x1="143" y1="190" x2="143" y2="330" stroke="' + shade(trouserFill, 0.78) + '" stroke-width="1.1" stroke-dasharray="1 0"/>' +
      '<!-- Trouser cuffs -->' +
      '<line x1="82" y1="330" x2="112" y2="330" stroke="' + trouserStroke + '" stroke-width="1.5"/>' +
      '<line x1="128" y1="330" x2="158" y2="330" stroke="' + trouserStroke + '" stroke-width="1.5"/>' +

      '<!-- Goodyear-welted Footwear -->' +
      '<!-- Left shoe -->' +
      '<path d="M82 334 Q79 346 83 356 Q87 360 106 360 Q114 360 114 354 L112 334 Z" fill="' + shoeFill + '" stroke="' + shoeStroke + '" stroke-width="1.2"/>' +
      '<path d="M80 356 H114 Q114 363 108 363 H84 Q80 363 80 356 Z" fill="#2A1E17"/>' +
      '<path d="M91 346 H103 V349 H91 Z" fill="#C5A059" stroke="#8A6E30" stroke-width="0.75"/>' +
      '<!-- Right shoe -->' +
      '<path d="M128 334 L126 354 Q126 360 134 360 Q153 360 157 356 Q161 346 158 334 Z" fill="' + shoeFill + '" stroke="' + shoeStroke + '" stroke-width="1.2"/>' +
      '<path d="M126 356 H160 Q160 363 156 363 H132 Q126 363 126 356 Z" fill="#2A1E17"/>' +
      '<path d="M137 346 H149 V349 H137 Z" fill="#C5A059" stroke="#8A6E30" stroke-width="0.75"/>' +

      '<!-- Tailored Roped-Shoulder Blazer / Jacket (Layered over trousers) -->' +
      '<path d="M115 67 L80 77 L66 142 L79 146 L89 104 L91 184 Q120 188 149 184 L151 104 L161 146 L174 142 L160 77 L125 67 Z" fill="' + blazerFill + '" stroke="' + blazerStroke + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<!-- Roped sleeve seams -->' +
      '<path d="M80 77 Q86 112 89 144" stroke="' + blazerStroke + '" stroke-width="1.1" fill="none"/>' +
      '<path d="M160 77 Q154 112 151 144" stroke="' + blazerStroke + '" stroke-width="1.1" fill="none"/>' +
      '<!-- Peaked Lapels -->' +
      '<path d="M115 67 L96 98 L114 128 L120 126 Z" fill="' + blazerLapel + '" stroke="' + blazerStroke + '" stroke-width="1.1"/>' +
      '<path d="M125 67 L144 98 L126 128 L120 126 Z" fill="' + blazerLapel + '" stroke="' + blazerStroke + '" stroke-width="1.1"/>' +
      '<!-- Center button closure -->' +
      '<circle cx="120" cy="138" r="2.8" fill="#C5A059" stroke="#8A6E30" stroke-width="0.8"/>' +
      '<circle cx="120" cy="154" r="2.8" fill="#C5A059" stroke="#8A6E30" stroke-width="0.8"/>' +
      '<!-- Flap pockets -->' +
      '<path d="M84 152 H102 V157 H84 Z" fill="' + shade(blazerFill, 0.88) + '" stroke="' + blazerStroke + '" stroke-width="1"/>' +
      '<path d="M138 152 H156 V157 H138 Z" fill="' + shade(blazerFill, 0.88) + '" stroke="' + blazerStroke + '" stroke-width="1"/>' +
      '<!-- Breast welt pocket with silk accent square -->' +
      '<path d="M96 108 H108 V111 H96 Z" fill="' + shade(blazerFill, 0.8) + '" stroke="' + blazerStroke + '" stroke-width="0.9"/>' +
      '<path d="M98 108 L101 99 L104 105 L106 100 L107 108 Z" fill="' + accentFill + '" stroke="' + shade(accentFill, 0.7) + '" stroke-width="0.8"/>' +

      '<!-- Sartorial Precision Callout Pins & Hairline Leaders -->' +
      '<!-- Pin 1: Outerwear / Top -->' +
      '<line x1="42" y1="102" x2="84" y2="102" stroke="#C5A059" stroke-width="1" stroke-dasharray="2 2"/>' +
      '<circle cx="84" cy="102" r="3" fill="#C5A059"/>' +
      '<!-- Pin 2: Accent Pocket Square -->' +
      '<line x1="42" y1="126" x2="101" y2="104" stroke="#C5A059" stroke-width="1" stroke-dasharray="2 2"/>' +
      '<circle cx="101" cy="104" r="3" fill="' + accentFill + '" stroke="#FAF8F5" stroke-width="1"/>' +
      '<!-- Pin 3: Tailored Inseam -->' +
      '<line x1="198" y1="242" x2="143" y2="242" stroke="#C5A059" stroke-width="1" stroke-dasharray="2 2"/>' +
      '<circle cx="143" cy="242" r="3" fill="#C5A059"/>' +
      '<!-- Pin 4: Hand-Burnished Footwear -->' +
      '<line x1="198" y1="352" x2="154" y2="352" stroke="#C5A059" stroke-width="1" stroke-dasharray="2 2"/>' +
      '<circle cx="154" cy="352" r="3" fill="#C5A059"/>' +

      '</svg>';
  }

  return { SHAPES: SHAPES, LOOKS: LOOKS, shapeFor: shapeFor, impliedHex: impliedHex, svg: svg, figureSvg: figureSvg };
});

