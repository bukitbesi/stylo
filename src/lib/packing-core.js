/*! SimplyStylo packing list engine. (c) SimplyStylo. All rights reserved. */
// A trip-sized capsule: counts follow SimplyStylo's packing rules (documented on the methodology page), so a
// 7-day trip with laundry and a 14-day trip with laundry pack the same amount of clothing.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSPack = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = {
    verified: '2026-11-02',
    rules: [
      'Clothing days = trip days, capped at 7 when you can do laundry.',
      'Tops = 3 per 4 clothing days (at least 2); one extra in hot weather.',
      'Bottoms = 1 per 3 clothing days, at least 2.',
      'Underwear and socks = clothing days + 1.',
      'Shoes: 2 pairs, plus 1 for beach or business trips (maximum 3).'
    ]
  };

  var TRIPS = { city: 'City break', beach: 'Beach holiday', business: 'Business trip', outdoor: 'Outdoor / hiking', mixed: 'Mixed' };
  var WEATHER = { hot: 'Hot (25 °C / 77 °F and above)', mild: 'Mild (12–24 °C / 54–76 °F)', cold: 'Cold (below 12 °C / 54 °F)' };

  var TOPS = {
    women: { city: ['T-shirt', 'Silk-feel blouse', 'Striped long-sleeve top', 'Fine-knit sweater'], beach: ['Tank top', 'Linen shirt', 'T-shirt'],
      business: ['Button-down shirt', 'Silk-feel blouse', 'Fine-knit sweater'], outdoor: ['Long-sleeve tee', 'T-shirt', 'Fleece sweater'], mixed: ['T-shirt', 'Silk-feel blouse', 'Linen shirt'] },
    men: { city: ['T-shirt', 'Oxford shirt', 'Merino sweater', 'Polo shirt'], beach: ['T-shirt', 'Linen shirt', 'Polo shirt'],
      business: ['Dress shirt', 'Oxford shirt', 'Merino sweater'], outdoor: ['Long-sleeve tee', 'T-shirt', 'Fleece sweater'], mixed: ['T-shirt', 'Oxford shirt', 'Polo shirt'] }
  };
  var BOTTOMS = {
    women: { city: ['Straight-leg jeans', 'Tailored trousers', 'Midi skirt'], beach: ['Shorts', 'Linen trousers', 'Midi skirt'], business: ['Tailored trousers', 'Pencil skirt', 'Dark jeans'],
      outdoor: ['Hiking trousers', 'Shorts', 'Jeans'], mixed: ['Straight-leg jeans', 'Tailored trousers', 'Shorts'] },
    men: { city: ['Dark jeans', 'Chinos', 'Tailored trousers'], beach: ['Shorts', 'Linen trousers', 'Chinos'], business: ['Suit trousers', 'Chinos', 'Dark jeans'],
      outdoor: ['Hiking trousers', 'Shorts', 'Jeans'], mixed: ['Dark jeans', 'Chinos', 'Shorts'] }
  };

  function n(x, d) { x = parseInt(x, 10); return isFinite(x) ? x : d; }
  function pick(list, count) { var out = []; for (var i = 0; i < count; i++) out.push(list[i % list.length]); return out; }
  function group(names) {
    var map = {}, order = [];
    names.forEach(function (x) { if (!map[x]) { map[x] = 0; order.push(x); } map[x]++; });
    return order.map(function (x) { return { name: x, qty: map[x] }; });
  }

  // opts: { days, trip, weather, laundry (bool), wardrobe: women|men }
  function plan(opts) {
    var o = opts || {};
    var days = Math.max(1, Math.min(30, n(o.days, 7)));
    var trip = TRIPS[o.trip] ? o.trip : 'city';
    var weather = WEATHER[o.weather] ? o.weather : 'mild';
    var wardrobe = o.wardrobe === 'men' ? 'men' : 'women';
    var laundry = !!o.laundry;
    var cd = laundry ? Math.min(days, 7) : days;

    var tops = Math.max(2, Math.ceil(cd * 0.75)) + (weather === 'hot' ? 1 : 0);
    tops = Math.min(tops, cd + 1);
    var bottoms = Math.max(2, Math.ceil(cd / 3));
    var dresses = wardrobe === 'women' && trip !== 'outdoor' ? Math.floor(cd / 4) + (trip === 'business' ? 0 : 0) : 0;
    var shoes = Math.min(3, 2 + (trip === 'beach' || trip === 'business' ? 1 : 0));

    var groups = [];
    groups.push({ id: 'tops', label: 'Tops', items: group(pick(TOPS[wardrobe][trip], tops)) });
    groups.push({ id: 'bottoms', label: 'Bottoms', items: group(pick(BOTTOMS[wardrobe][trip], bottoms)) });
    if (dresses) groups.push({ id: 'dresses', label: 'Dresses', items: group(pick(trip === 'beach' || weather === 'hot' ? ['Sundress', 'Slip dress'] : ['Wrap dress', 'Knit dress'], dresses)) });
    if (trip === 'business') groups.push({ id: 'suit', label: 'Suit', items: [{ name: wardrobe === 'men' ? 'Suit jacket' : 'Tailored blazer', qty: 1 }] });

    var layers = [];
    if (weather === 'hot') layers.push(trip === 'business' ? 'Light blazer' : 'Light cardigan');
    if (weather === 'mild') layers.push('Denim jacket', trip === 'business' ? 'Light blazer' : 'Cardigan');
    if (weather === 'cold') layers.push('Warm coat', 'Chunky sweater');
    if (trip === 'outdoor') layers.push('Waterproof jacket');
    groups.push({ id: 'layers', label: 'Layers', items: group(layers) });

    var shoeList = [trip === 'business' ? (wardrobe === 'men' ? 'Leather dress shoes' : 'Block heels') : 'White sneakers'];
    if (trip === 'outdoor') shoeList = ['Hiking boots', 'White sneakers'];
    else shoeList.push(weather === 'cold' ? 'Ankle boots' : wardrobe === 'men' ? 'Loafers' : 'Loafers or flats');
    if (shoes > shoeList.length) shoeList.push(trip === 'beach' ? 'Sandals' : 'White sneakers');
    groups.push({ id: 'shoes', label: 'Shoes', items: group(shoeList.slice(0, shoes)) });

    var extras = [{ name: 'Underwear', qty: cd + 1 }, { name: 'Socks', qty: cd + 1 }, { name: 'Sleepwear', qty: 1 }];
    if (trip === 'beach' || weather === 'hot') extras.push({ name: 'Swimsuit', qty: 2 });
    if (trip === 'outdoor') extras.push({ name: 'Activewear set', qty: 2 });
    groups.push({ id: 'basics', label: 'Underwear & extras', items: extras });

    var acc = ['Crossbody bag'];
    if (weather !== 'cold') acc.push('Sunglasses'); else acc.push('Wool scarf');
    if (trip === 'business') acc.push(wardrobe === 'men' ? 'Leather belt' : 'Leather tote');
    groups.push({ id: 'accessories', label: 'Accessories', items: group(acc) });

    var count = function (id) { var g = groups.filter(function (x) { return x.id === id; })[0]; return g ? g.items.reduce(function (s, i) { return s + i.qty; }, 0) : 0; };
    var clothing = groups.filter(function (g) { return g.id !== 'basics' && g.id !== 'accessories'; }).reduce(function (s, g) { return s + g.items.reduce(function (a, i) { return a + i.qty; }, 0); }, 0);
    return {
      days: days, trip: trip, weather: weather, wardrobe: wardrobe, laundry: laundry, clothingDays: cd, groups: groups,
      pieces: clothing, outfits: count('tops') * count('bottoms') + count('dresses'),
      essentials: ['Passport or ID', 'Phone charger and plug adapter', 'Medication', 'Toiletries (liquids under 100 ml for carry-on)', 'Reusable water bottle']
    };
  }

  return { FACTS: FACTS, TRIPS: TRIPS, WEATHER: WEATHER, plan: plan };
});
