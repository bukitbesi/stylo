import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const K = createRequire(import.meta.url)('../src/lib/capsule-core.js');

test("women's 25-piece capsule: 9 tops × 6 bottoms + 3 dresses = 57 outfits (FAQ example)", () => {
  const r = K.build({ wardrobe: 'women', size: 25, climate: 'temperate' });
  assert.equal(r.total, 25);
  assert.equal(r.outfits, 57);
  assert.equal(r.withShoes, 171);
});

test("men's 25-piece capsule: 10 tops × 6 bottoms = 60 outfits", () => {
  const r = K.build({ wardrobe: 'men', size: 25 });
  assert.equal(r.total, 25);
  assert.equal(r.outfits, 60);
});

test('every size and climate keeps the total and has enough items in the library', () => {
  for (const wardrobe of ['women', 'men']) for (const size of [15, 25, 35]) for (const climate of ['hot', 'temperate', 'cold']) {
    for (const focus of ['work', 'casual', 'smart', 'balanced']) {
      const r = K.build({ wardrobe, size, climate, focus });
      assert.equal(r.total, size);
      const listed = r.groups.reduce((s, g) => s + g.items.length, 0);
      assert.equal(listed, size, `${wardrobe} ${size} ${climate} ${focus}`);
      const names = r.groups.flatMap((g) => g.items.map((i) => g.id + i.name));
      assert.equal(new Set(names).size, names.length);
    }
  }
});

test('hot climate avoids cold-weather pieces', () => {
  const r = K.build({ wardrobe: 'women', size: 25, climate: 'hot' });
  const names = r.groups.flatMap((g) => g.items.map((i) => i.name));
  assert.ok(!names.includes('Puffer or insulated coat'));
  assert.ok(!names.includes('Wool coat'));
});

test('named colors stay fixed; others take the chosen palette', () => {
  const r = K.build({ wardrobe: 'men', size: 15, main: 'Navy', second: 'White', accent: 'Rust' });
  const all = r.groups.flatMap((g) => g.items);
  assert.ok(all.filter((i) => /white|jeans|brown/i.test(i.name)).every((i) => i.role === 'fixed' && i.color === null));
  assert.ok(r.groups.flatMap((g) => g.items).some((i) => i.color === 'Navy'));
});
