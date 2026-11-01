import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const P = createRequire(import.meta.url)('../src/lib/packing-core.js');
const qty = (r, id) => (r.groups.find((g) => g.id === id) || { items: [] }).items.reduce((s, i) => s + i.qty, 0);
const item = (r, name) => r.groups.flatMap((g) => g.items).find((i) => i.name === name);

test("7-day women's city trip, mild, no laundry (FAQ example)", () => {
  const r = P.plan({ days: 7, trip: 'city', weather: 'mild', wardrobe: 'women' });
  assert.equal(qty(r, 'tops'), 6);
  assert.equal(qty(r, 'bottoms'), 3);
  assert.equal(qty(r, 'dresses'), 1);
  assert.equal(qty(r, 'shoes'), 2);
  assert.equal(item(r, 'Underwear').qty, 8);
  assert.equal(r.outfits, 19);
});

test('laundry caps clothing at 7 days: 14 days with laundry = 7 days', () => {
  const a = P.plan({ days: 14, laundry: true, trip: 'city', weather: 'mild', wardrobe: 'men' });
  const b = P.plan({ days: 7, trip: 'city', weather: 'mild', wardrobe: 'men' });
  assert.equal(a.pieces, b.pieces);
  assert.equal(a.clothingDays, 7);
});

test('weather and trip type change the list', () => {
  const beach = P.plan({ days: 5, trip: 'beach', weather: 'hot', wardrobe: 'women' });
  assert.ok(item(beach, 'Swimsuit'));
  assert.ok(item(beach, 'Sandals'));
  assert.ok(!item(beach, 'Warm coat'));
  const cold = P.plan({ days: 5, trip: 'city', weather: 'cold', wardrobe: 'men' });
  assert.ok(item(cold, 'Warm coat'));
  assert.ok(item(cold, 'Wool scarf'));
  const work = P.plan({ days: 3, trip: 'business', weather: 'mild', wardrobe: 'men' });
  assert.ok(item(work, 'Suit jacket'));
  assert.ok(item(work, 'Leather dress shoes'));
});

test('every combination stays sensible', () => {
  for (const trip of Object.keys(P.TRIPS)) for (const weather of Object.keys(P.WEATHER)) for (const wardrobe of ['women', 'men'])
    for (const days of [1, 3, 10, 30]) for (const laundry of [true, false]) {
      const r = P.plan({ days, trip, weather, wardrobe, laundry });
      assert.ok(qty(r, 'tops') >= 2 && qty(r, 'tops') <= 31, `${trip} ${weather} ${days}`);
      assert.ok(qty(r, 'shoes') >= 2 && qty(r, 'shoes') <= 3);
      assert.ok(r.outfits >= 4);
    }
  assert.equal(P.plan({ days: 99 }).days, 30);
});
