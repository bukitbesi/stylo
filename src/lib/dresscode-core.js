/*! SimplyStylo dress code engine. (c) SimplyStylo. All rights reserved. */
// What to wear for each common invitation dress code, from most to least formal. Garments follow the
// Emily Post Institute attire guide; Debrett's (UK) is noted where British usage differs.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSDress = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-02', source: 'Emily Post Institute attire guide; Debrett\'s dress code guidance' };

  // items: [garment, color hex, note]
  var CODES = [
    { id: 'white-tie', name: 'White Tie', aka: 'Full evening dress, "tails"', when: 'State dinners, royal and diplomatic events, the most formal balls.',
      menswear: [['Black tailcoat with matching trousers', '#1B1B1B'], ['White piqué wing-collar shirt', '#FAFAF7'], ['White piqué waistcoat', '#FAFAF7'],
        ['White bow tie', '#FAFAF7'], ['Black patent shoes', '#1B1B1B'], ['White or gray gloves', '#E4E4E0']],
      womenswear: [['Floor-length evening gown', '#2B2D6E'], ['Long gloves (optional)', '#FAFAF7'], ['Evening clutch', '#C9A44C'], ['Fine jewelry', '#C9A44C'], ['Evening heels', '#1B1B1B']],
      avoid: ['Business suits or tuxedos for men', 'Short or cocktail-length dresses (in US usage)', 'Daytime fabrics such as linen'],
      note: 'Debrett\'s (UK) allows women a floor-length dress and notes that knee-length cocktail dresses are now popular.' },
    { id: 'black-tie', name: 'Black Tie', aka: 'Evening dress, "formal"', when: 'Evening weddings, galas, formal dinners and the theater.',
      menswear: [['Black tuxedo jacket', '#1B1B1B'], ['Matching tuxedo trousers', '#1B1B1B'], ['White formal shirt', '#FAFAF7'], ['Black bow tie', '#1B1B1B'],
        ['Black cummerbund or waistcoat', '#1B1B1B'], ['Black patent shoes', '#1B1B1B']],
      womenswear: [['Floor-length evening gown or dressy cocktail dress', '#6D1F2E'], ['Evening clutch', '#1B1B1B'], ['Evening heels', '#1B1B1B'], ['Statement jewelry', '#C9A44C']],
      avoid: ['Business suits and long ties', 'Casual or daytime dresses', 'Very tight "red carpet" dresses with dramatic splits (Debrett\'s)'],
      note: 'Debrett\'s (UK) says a cocktail dress, long or short, is appropriate for women.' },
    { id: 'black-tie-optional', name: 'Black Tie Optional', aka: 'Black tie preferred', when: 'Formal evening events where hosts will wear black tie but guests may choose.',
      menswear: [['Tuxedo or dark suit', '#1F2A44'], ['White dress shirt', '#FAFAF7'], ['Black bow tie or conservative tie', '#1B1B1B'], ['Leather dress shoes', '#1B1B1B']],
      womenswear: [['Evening gown, cocktail dress or little black dress', '#1B1B1B'], ['Dressy separates', '#F3EDDF'], ['Evening heels', '#1B1B1B'], ['Clutch', '#C9A44C']],
      avoid: ['Light or casual suits', 'Daytime sundresses'], note: '' },
    { id: 'creative-black-tie', name: 'Creative Black Tie', aka: 'Festive black tie', when: 'Themed galas and parties that want black tie with personality.',
      menswear: [['Tuxedo jacket', '#1B1B1B'], ['Matching tuxedo trousers', '#1B1B1B'], ['White formal shirt', '#FAFAF7'], ['Colored or patterned bow tie', '#6D1F2E'],
        ['Matching cummerbund', '#6D1F2E'], ['Patent or velvet shoes', '#1B1B1B']],
      womenswear: [['Evening gown or cocktail dress', '#11775A'], ['Fun or unique accessories', '#C9A44C'], ['Statement clutch', '#D9327A'], ['Evening heels', '#1B1B1B']],
      avoid: ['Costumes, unless the invitation says so', 'Casual pieces'], note: '' },
    { id: 'cocktail', name: 'Cocktail / Semi-Formal', aka: 'Semi-formal, "after five"', when: 'Evening parties, receptions and many weddings.',
      menswear: [['Dark business suit', '#1F2A44'], ['Matching suit trousers', '#1F2A44'], ['Dress shirt', '#FAFAF7'], ['Silk tie', '#6D1F2E'], ['Leather dress shoes', '#1B1B1B']],
      womenswear: [['Cocktail dress or little black dress', '#1B1B1B'], ['Long dressy skirt and top', '#6D1F2E'], ['Heels or dressy flats', '#1B1B1B'], ['Clutch', '#C9A44C']],
      avoid: ['Jeans and sneakers', 'Floor-length gowns, unless it is late and very dressy'], note: 'For events after 6 p.m., lean toward the more formal choice.' },
    { id: 'business-formal', name: 'Business Formal', aka: 'Business attire, lounge suit (UK)', when: 'Board meetings, interviews, conferences and formal daytime events.',
      menswear: [['Dark business suit', '#1F2A44'], ['Matching suit trousers', '#1F2A44'], ['Dress shirt', '#FAFAF7'], ['Conservative tie', '#1F2A44'], ['Leather dress shoes', '#1B1B1B']],
      womenswear: [['Suit jacket', '#3C3F44'], ['Matching trousers or skirt', '#3C3F44'], ['Business-style dress', '#1F2A44'], ['Pumps, low or high heel', '#1B1B1B'], ['Leather tote', '#6B4A33']],
      avoid: ['Casual knitwear and polos', 'Sneakers and sandals', 'Bold patterns'],
      note: 'In the UK, "lounge suit" on an invitation means a suit worn with a shirt and tie (Debrett\'s).' },
    { id: 'business-casual', name: 'Business Casual', aka: 'Office casual', when: 'Many offices, client meetings and work events. Always check your company\'s own rules.',
      menswear: [['Blazer or sport coat', '#1F2A44'], ['Chinos or slacks', '#B5A77D'], ['Button-down or polo shirt', '#A9C6E3'], ['Loafers', '#6B4A33']],
      womenswear: [['Skirt, chinos or trousers', '#3C3F44'], ['Blouse, knit top or sweater', '#F3EDDF'], ['Dress', '#1F2A44'], ['Loafers or low heels', '#1B1B1B']],
      avoid: ['Spaghetti straps and low necklines', 'Ripped jeans and slogan tees', 'Flip-flops'], note: '' },
    { id: 'smart-casual', name: 'Smart Casual', aka: 'Dressy casual', when: 'Restaurants, parties at home, relaxed weddings and many social events.',
      menswear: [['Blazer or sport coat (optional)', '#1F2A44'], ['Slacks or dark jeans', '#2E3E57'], ['Dress shirt or polo', '#FAFAF7'], ['Loafers', '#6B4A33']],
      womenswear: [['Dress', '#9CAF94'], ['Skirt and dressy top', '#F3EDDF'], ['Nice jeans and dressy top', '#2E3E57'], ['Flats or ankle boots', '#6B4A33']],
      avoid: ['Gym wear', 'Worn or ripped clothing'], note: '' },
    { id: 'casual', name: 'Casual', aka: 'Relaxed', when: 'Barbecues, daytime parties and informal get-togethers.',
      menswear: [['Chinos or clean jeans', '#4A6584'], ['Plain T-shirt or polo', '#FAFAF7'], ['Sweater', '#8E9094'], ['Sneakers or loafers', '#FAFAF7']],
      womenswear: [['Sundress or skirt', '#E8B9B0'], ['Nice jeans', '#4A6584'], ['Plain T-shirt or casual blouse', '#FAFAF7'], ['Sneakers or sandals', '#D8C8AE']],
      avoid: ['T-shirts with slogans', 'Jeans with holes', 'Anything that needs ironing and isn\'t'], note: 'Shorts depend on the occasion and climate.' }
  ];

  function get(id) { for (var i = 0; i < CODES.length; i++) if (CODES[i].id === id) return CODES[i]; return null; }
  // 9 = most formal.
  function formality(id) { var i = CODES.map(function (c) { return c.id; }).indexOf(id); return i < 0 ? null : CODES.length - i; }

  return { FACTS: FACTS, CODES: CODES, get: get, formality: formality };
});
