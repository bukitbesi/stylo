/*! SimplyStylo garment illustrations. (c) SimplyStylo. All rights reserved. */
// Flat-lay garment silhouettes drawn as inline SVG in any color, so every outfit and capsule result shows the
// exact pieces in the exact colors (a photo can't be recolored per result). 64 × 64 viewBox.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSGarment = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Each shape: filled body paths, plus optional detail strokes drawn darker on top.
  var SHAPES = {
    tee: { body: ['M20 10 L27 8 Q32 13 37 8 L44 10 L56 20 L50 28 L46 25 L46 56 L18 56 L18 25 L14 28 L8 20 Z'] },
    shirt: { body: ['M22 8 L28 6 L32 12 L36 6 L42 8 L52 14 L58 44 L51 46 L46 24 L46 58 L18 58 L18 24 L13 46 L6 44 L12 14 Z'],
      detail: ['M32 12 L32 58', 'M28 6 L32 14 L36 6'] },
    sweater: { body: ['M22 8 Q32 15 42 8 L52 13 L58 46 L51 48 L46 24 L46 56 L18 56 L18 24 L13 48 L6 46 L12 13 Z'],
      detail: ['M18 52 L46 52', 'M7 42 L13 44', 'M57 42 L51 44'] },
    turtleneck: { body: ['M26 3 H38 V10 H26 Z', 'M22 9 L26 9 Q32 12 38 9 L42 9 L52 13 L58 46 L51 48 L46 24 L46 56 L18 56 L18 24 L13 48 L6 46 L12 13 Z'],
      detail: ['M18 52 L46 52', 'M26 6 H38'] },
    tank: { body: ['M23 6 L27 6 Q32 20 37 6 L41 6 L44 22 L46 56 L18 56 L20 22 Z'] },
    polo: { body: ['M20 10 L27 8 Q32 13 37 8 L44 10 L56 20 L50 28 L46 25 L46 56 L18 56 L18 25 L14 28 L8 20 Z'],
      detail: ['M27 8 L32 16 L37 8', 'M32 13 L32 22'] },
    trousers: { body: ['M18 6 H46 L50 60 H37 L32 22 L27 60 H14 Z'], detail: ['M18 11 H46', 'M32 11 V22'] },
    jeans: { body: ['M18 6 H46 L50 60 H37 L32 22 L27 60 H14 Z'], detail: ['M18 11 H46', 'M32 11 V22', 'M21 14 Q24 20 28 14', 'M36 14 Q40 20 43 14'] },
    shorts: { body: ['M16 12 H48 L52 44 H36 L32 28 L28 44 H12 Z'], detail: ['M16 17 H48'] },
    skirt: { body: ['M22 8 H42 L52 56 H12 Z'], detail: ['M22 13 H42'] },
    dress: { body: ['M24 4 L28 4 Q32 10 36 4 L40 4 L42 18 L38 24 L52 60 H12 L26 24 L22 18 Z'], detail: ['M26 24 H38'] },
    gown: { body: ['M25 3 L28 3 Q32 9 36 3 L39 3 L41 17 L37 23 L56 62 H8 L27 23 L23 17 Z'], detail: ['M27 23 H37'] },
    jumpsuit: { body: ['M22 4 L27 4 Q32 10 37 4 L42 4 L44 26 L48 60 H36 L32 34 L28 60 H16 L20 26 Z'], detail: ['M20 26 H44'] },
    jacket: { body: ['M20 7 L32 26 L44 7 L54 13 L58 50 L51 52 L47 28 L47 58 L17 58 L17 28 L13 52 L6 50 L10 13 Z'],
      detail: ['M20 7 L27 22 L32 26', 'M44 7 L37 22 L32 26', 'M32 26 L32 58', 'M21 44 H28'] },
    coat: { body: ['M20 5 L32 24 L44 5 L54 11 L58 54 L51 56 L47 28 L48 62 L16 62 L17 28 L13 56 L6 54 L10 11 Z'],
      detail: ['M20 5 L27 20 L32 24', 'M44 5 L37 20 L32 24', 'M32 24 L32 62', 'M17 40 H47'] },
    cardigan: { body: ['M22 8 L32 30 L42 8 L52 13 L58 46 L51 48 L46 24 L46 56 L18 56 L18 24 L13 48 L6 46 L12 13 Z'],
      detail: ['M32 30 L32 56', 'M18 52 L46 52'] },
    vest: { body: ['M22 6 L32 26 L42 6 L46 10 L46 56 L18 56 L18 10 Z'], detail: ['M32 26 L32 56'] },
    // Shoes are drawn side-on (heel left, toe right) with a sole in a separate tone so they read as shoes at 36 px.
    sneakers: { body: ['M7 45 L7 31 Q7 26 12 26 L16 26 Q19 31 23 29 L26 24 Q30 23 31 26 L36 33 Q49 35 56 39 Q59 41 59 45 Z'],
      sole: ['M5 44 H60 Q61 50 57 51 H8 Q5 51 5 47 Z'], tone: 'light',
      detail: ['M27 30 L31 28', 'M30 33 L34 31', 'M14 41 Q26 34 40 40', 'M47 36 Q50 41 59 43', 'M5 48 H60'] },
    loafers: { body: ['M6 45 Q6 37 12 36 Q20 35 27 37 Q38 34 50 37 Q58 40 59 45 Z'],
      sole: ['M5 45 H60 V47 Q60 49 57 49 H18 V53 H7 V49 Q5 49 5 47 Z'], tone: 'dark',
      detail: ['M30 37 Q40 33 52 39', 'M31 40 H45', 'M36 40 V42 H40 V40'] },
    heels: { body: ['M9 25 Q12 24 13 27 Q22 37 38 39 Q52 40 58 44 Q60 46 58 48 L38 48 Q22 44 10 36 Z'],
      sole: ['M9 35 L15 38.5 L14 58 L11 58 Z', 'M36 47 Q48 48.5 59 47 Q60 49 58 50.5 Q48 51 36 49.5 Z'], tone: 'dark',
      detail: ['M13 27 Q20 33 26 36'] },
    boots: { body: ['M14 16 H32 V37 Q46 38 54 42 Q59 44 59 48 H13 Z'],
      sole: ['M12 48 H60 V51 Q60 53 58 53 H24 V57 H12 Z'], tone: 'dark',
      detail: ['M22 17 Q22 29 29 36', 'M14 44 H59'] },
    sandals: { body: ['M8 44 Q8 34 14 32 L26 30 L27 33 L16 35 Q12 37 12 44 Z', 'M34 44 Q38 34 50 36 Q56 38 56 44 H51 Q51 40 47 40 Q41 40 39 44 Z'],
      sole: ['M5 47 Q4 44 9 44 H55 Q60 44 60 47 Q60 50 56 50 H9 Q5 50 5 47 Z', 'M7 50 H17 V55 H7 Z'], tone: 'tan' },
    bag: { body: ['M12 24 H52 L55 58 H9 Z'], detail: ['M24 24 Q24 10 32 10 Q40 10 40 24', 'M12 32 H52'] },
    scarf: { body: ['M24 6 H40 V34 L46 58 H36 L32 40 L28 58 H18 L24 34 Z'], detail: ['M19 54 H27', 'M37 54 H45'] },
    tie: { body: ['M28 6 H36 L38 13 L35 16 L40 50 L32 58 L24 50 L29 16 L26 13 Z'], detail: ['M26 13 H38'] },
    square: { body: ['M14 26 H50 V56 H14 Z', 'M20 26 L26 10 L32 22 L38 8 L44 26 Z'] },
    belt: { body: ['M4 26 H60 V38 H4 Z'], detail: ['M22 24 H32 V40 H22 Z', 'M27 32 H38'] },
    watch: { body: ['M26 4 H38 V20 H26 Z', 'M26 44 H38 V60 H26 Z', 'M32 18 A14 14 0 1 1 31.9 18 Z'], detail: ['M32 26 V32 L36 35'] },
    sunglasses: { body: ['M6 26 H28 V34 Q28 44 17 44 Q6 44 6 34 Z', 'M36 26 H58 V34 Q58 44 47 44 Q36 44 36 34 Z'], detail: ['M28 29 Q32 26 36 29'] },
    gloves: { body: ['M18 60 V30 L14 18 Q13 14 16 14 L20 24 V8 Q20 5 23 5 Q26 5 26 8 V22 V6 Q26 3 29 3 Q32 3 32 6 V22 V7 Q32 4 35 4 Q38 4 38 7 V23 V11 Q38 8 41 8 Q44 8 44 11 V40 L42 60 Z'] },
    socks: { body: ['M24 4 H38 V36 L48 46 Q54 52 48 58 Q44 62 38 58 L26 46 Q24 44 24 40 Z'], detail: ['M24 10 H38'] },
    jewelry: { body: ['M32 52 L38 44 L32 36 L26 44 Z'], detail: ['M12 8 Q32 46 52 8'] }
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

  // Sole tone contrasts with the upper: a white sneaker gets a grey sole, a black boot a brown one.
  function soleFor(tone, fill) {
    var l = lum(fill);
    if (tone === 'light') return l > 0.85 ? '#C9C4B8' : '#F4F1EA';
    if (tone === 'tan') return l > 0.55 && l < 0.75 ? '#8A6A4A' : '#C9A27A';
    return l < 0.2 ? '#6B4A33' : '#2A2522';
  }

  // label is used as the accessible name; decorative=true hides it from screen readers (text is next to it).
  function svg(name, hex, size, decorative) {
    var s = SHAPES[shapeFor(name)];
    var fill = /^#[0-9A-F]{6}$/i.test(hex || '') ? hex.toUpperCase() : '#B8A58D';
    var line = lum(fill) < 0.3 ? shade(fill, 1.9) : shade(fill, 0.62);
    var px = size || 64;
    return '<svg class="garment" width="' + px + '" height="' + px + '" viewBox="0 0 64 64"' +
      (decorative ? ' aria-hidden="true"' : ' role="img" aria-label="' + String(name).replace(/"/g, '') + '"') + '>' +
      s.body.map(function (d) { return '<path d="' + d + '" fill="' + fill + '" stroke="' + line + '" stroke-width="1.5" stroke-linejoin="round"/>'; }).join('') +
      (s.sole || []).map(function (d) { return '<path d="' + d + '" fill="' + soleFor(s.tone, fill) + '" stroke="' + line + '" stroke-width="1.2" stroke-linejoin="round"/>'; }).join('') +
      (s.detail || []).map(function (d) { return '<path d="' + d + '" fill="none" stroke="' + line + '" stroke-width="1.5" stroke-linecap="round"/>'; }).join('') +
      '</svg>';
  }

  return { SHAPES: SHAPES, shapeFor: shapeFor, impliedHex: impliedHex, svg: svg };
});
