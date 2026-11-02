/*! SimplyStylo wedding guest outfit engine. (c) SimplyStylo. All rights reserved. */
// Builds a wedding guest outfit from the invitation dress code, time of day, season and venue. Garments come from the
// dress code engine (Emily Post Institute); guest etiquette follows The Knot and Zola: no white, ivory, cream or
// beige unless the couple asks, and shoes that suit the ground.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./dresscode-core.js'));
  else root.SSWedGuest = factory(root.SSDress);
})(typeof self !== 'undefined' ? self : this, function (DC) {
  'use strict';

  var FACTS = { verified: '2026-11-02', source: 'Emily Post Institute (dress codes); The Knot and Zola (guest etiquette)' };

  var CODES = { 'black-tie': 'Black tie / formal', 'black-tie-optional': 'Black tie optional', cocktail: 'Cocktail / semi-formal', 'smart-casual': 'Dressy casual', casual: 'Casual / beach' };
  var TIMES = { day: 'Daytime (before 5 p.m.)', evening: 'Evening' };
  var SEASONS = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };
  var VENUES = { ballroom: 'Ballroom or hotel', church: 'Church or place of worship', garden: 'Garden or vineyard', barn: 'Barn or rustic', beach: 'Beach', city: 'City hall or restaurant' };

  // Colors suited to each season and time of day (none near white).
  var PALETTES = {
    spring: { day: [['Sage green', '9CAF94'], ['Lavender', 'B7A7D3'], ['Blush pink', 'E8B9B0'], ['Light blue', 'A9C6E3']], evening: [['Emerald green', '11775A'], ['Cobalt blue', '1F4FB0'], ['Dusty rose', 'C4708E'], ['Navy', '1F2A44']] },
    summer: { day: [['Coral', 'F28C8C'], ['Aqua', '8FD3C8'], ['Marigold', 'F2A541'], ['Cornflower blue', '7FA3C8']], evening: [['Fuchsia', 'D9327A'], ['Teal', '1D6E73'], ['Cobalt blue', '1F4FB0'], ['Navy', '1F2A44']] },
    fall: { day: [['Rust', 'A4502B'], ['Mustard yellow', 'D0A12B'], ['Olive green', '6B6B3A'], ['Terracotta', 'C98B78']], evening: [['Burgundy', '6D1F2E'], ['Emerald green', '11775A'], ['Plum', '5E2C7A'], ['Black', '1B1B1B']] },
    winter: { day: [['Burgundy', '6D1F2E'], ['Forest green', '2E4A3F'], ['Sapphire', '2B2D6E'], ['Charcoal', '3C3F44']], evening: [['Black', '1B1B1B'], ['Emerald green', '11775A'], ['Deep red', 'B3123A'], ['Navy', '1F2A44']] }
  };

  function pick(map, v, d) { return map[v] ? v : d; }

  // opts: { code, time, season, venue, style: womenswear|menswear, color: index 0–3 }
  function plan(opts) {
    var o = opts || {};
    var code = pick(CODES, o.code, 'cocktail'), time = pick(TIMES, o.time, 'evening'), season = pick(SEASONS, o.season, 'summer'),
      venue = pick(VENUES, o.venue, 'garden'), style = o.style === 'menswear' ? 'menswear' : 'womenswear';
    var pal = PALETTES[season][time], ci = Math.max(0, Math.min(3, parseInt(o.color, 10) || 0)), color = pal[ci];
    var outdoor = venue === 'garden' || venue === 'barn' || venue === 'beach';
    var pieces = [], notes = [];

    if (style === 'womenswear') {
      var dress = code === 'black-tie' ? 'Floor-length evening gown' : code === 'black-tie-optional' ? (time === 'evening' ? 'Floor-length or dressy cocktail dress' : 'Dressy cocktail dress')
        : code === 'cocktail' ? 'Cocktail dress (knee to midi length)' : code === 'smart-casual' ? 'Midi dress or dressy separates' : 'Sundress or flowy midi dress';
      pieces.push([dress, color[1]]);
      pieces.push([venue === 'beach' ? 'Flat dressy sandals' : outdoor ? 'Block heels or wedges' : code === 'black-tie' ? 'Evening heels' : 'Heels or dressy flats', venue === 'beach' ? 'D8C8AE' : '1B1B1B']);
      pieces.push([code === 'black-tie' || time === 'evening' ? 'Evening clutch' : 'Small crossbody bag', 'C9A44C']);
      if (season === 'winter' || (season !== 'summer' && time === 'evening')) pieces.push([season === 'winter' ? 'Wool coat' : 'Pashmina or light wrap', season === 'winter' ? '3C3F44' : 'F3EDDF']);
      pieces.push(['Delicate jewelry', 'C9A44C']);
    } else {
      if (code === 'black-tie') pieces.push(['Black tuxedo jacket', '1B1B1B'], ['Matching tuxedo trousers', '1B1B1B'], ['White formal shirt', 'FAFAF7'], ['Black bow tie', '1B1B1B'], ['Black patent shoes', '1B1B1B']);
      else {
        var suit = code === 'casual' ? (season === 'summer' || venue === 'beach' ? ['Linen trousers', 'D8C8AE'] : ['Chinos', 'B5A77D']) : null;
        var jacket = code === 'black-tie-optional' ? (time === 'evening' ? 'Tuxedo or dark suit' : 'Dark suit') : code === 'cocktail' ? (season === 'summer' && time === 'day' ? 'Light gray or tan suit' : 'Dark suit')
          : code === 'smart-casual' ? 'Blazer or sport coat' : null;
        var jacketHex = /tan/.test(jacket || '') ? 'B5A77D' : /Light gray/.test(jacket || '') ? '8E9094' : code === 'smart-casual' ? '1F2A44' : '2B2D44';
        if (jacket) pieces.push([jacket, jacketHex]);
        pieces.push(suit || [code === 'smart-casual' ? 'Chinos or tailored trousers' : 'Matching suit trousers', code === 'smart-casual' ? 'B5A77D' : jacketHex]);
        pieces.push([code === 'casual' ? 'Linen or Oxford shirt' : 'Dress shirt', 'FAFAF7']);
        if (code !== 'casual') pieces.push([code === 'smart-casual' ? 'Pocket square (optional tie)' : 'Silk tie', color[1]]);
        pieces.push([venue === 'beach' ? 'Loafers or espadrilles' : 'Leather dress shoes', venue === 'beach' ? 'B98A57' : '6B4A33']);
        if (code === 'casual') pieces.push(['Pocket square in your color', color[1]]);
      }
    }

    notes.push('Avoid white, ivory, cream and beige unless the couple asks for them: they can photograph as white.');
    if (outdoor && venue !== 'beach') notes.push('Grass and gravel: skip stilettos; block heels, wedges or flats stay steady.');
    if (venue === 'beach') notes.push('Sand: flat sandals or loafers, light fabrics such as linen and chiffon, and hair that can handle wind.');
    if (venue === 'church') notes.push('Some places of worship expect covered shoulders: bring a wrap or jacket for the ceremony.');
    if (time === 'evening') notes.push('Evening weddings lean more formal and darker; black is widely accepted today, though some traditions still avoid it.');
    if (season === 'winter') notes.push('Winter: heavier fabrics (velvet, wool crepe) and a proper coat for photos outside.');
    if (season === 'summer' && time === 'day') notes.push('Summer daytime: breathable fabrics and lighter colors keep you cool.');
    notes.push('Check the invitation and wedding website first: the couple\'s request always wins.');

    var length = code === 'black-tie' ? 'maxi' : code === 'black-tie-optional' && time === 'evening' ? 'maxi' : code === 'casual' ? 'midi' : code === 'smart-casual' ? 'midi' : 'knee';
    var dress = { n: venue === 'beach' ? 'v' : season === 'winter' ? 'boat' : 'v', s: season === 'winter' ? 'long' : season === 'fall' ? 'three' : code === 'black-tie' ? 'none' : 'short',
      w: 'natural', k: venue === 'beach' || venue === 'garden' ? 'aline' : code === 'black-tie' ? 'flare' : 'aline', l: length, p: 'solid', c: color[1], a: 'FAFAF7', b: '' };

    return { code: code, codeName: CODES[code], time: time, season: season, venue: venue, style: style, palette: pal, color: color,
      pieces: pieces, notes: notes, dress: dress, formality: DC.formality(code) };
  }

  return { FACTS: FACTS, CODES: CODES, TIMES: TIMES, SEASONS: SEASONS, VENUES: VENUES, PALETTES: PALETTES, plan: plan };
});
