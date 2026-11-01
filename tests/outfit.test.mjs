import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const O = createRequire(import.meta.url)('../src/lib/outfit-core.js');

test('temperature bands', () => {
  assert.equal(O.band(30).id, 'hot');
  assert.equal(O.band(25).id, 'hot');
  assert.equal(O.band(24).id, 'warm');
  assert.equal(O.band(12).id, 'mild');
  assert.equal(O.band(5).id, 'cool');
  assert.equal(O.band(-10).id, 'cold');
  assert.equal(Math.round(O.fToC(77)), 25);
});

test('same seed gives the same outfit', () => {
  const a = O.generate({ wardrobe: 'womenswear', occasion: 'smart', tempC: 15, seed: 42 });
  const b = O.generate({ wardrobe: 'womenswear', occasion: 'smart', tempC: 15, seed: 42 });
  assert.deepEqual(a, b);
});

test('every combination gives shoes and a top or dress; cold adds a coat; hot has no coat', () => {
  for (const wardrobe of ['womenswear', 'menswear']) for (const occasion of Object.keys(O.OCCASIONS)) {
    for (const t of [30, 20, 14, 8, -2]) for (let seed = 1; seed <= 40; seed++) {
      const r = O.generate({ wardrobe, occasion, tempC: t, seed });
      const slots = r.pieces.map((p) => p.slot);
      const where = `${wardrobe} ${occasion} ${t} ${seed}`;
      assert.ok(slots.includes('Shoes'), where);
      assert.ok(slots.includes('Dress') || (slots.includes('Top') && slots.includes('Bottom')), where);
      if (t === -2) assert.ok(slots.includes('Coat'), where);
      if (t === 30) assert.ok(!slots.includes('Coat'), where);
      r.pieces.forEach((p) => assert.ok(p.color && p.color.hex, where + ' ' + p.name));
    }
  }
});

test('formal menswear is a matching suit with the color on the tie or pocket square', () => {
  const r = O.generate({ wardrobe: 'menswear', occasion: 'formal', tempC: 20, seed: 3,
    palette: { anchor: { name: 'Burgundy', hex: '#6D1F2E' }, neutrals: [{ name: 'Navy', hex: '#1F2A44' }, { name: 'White', hex: '#FAFAF7' }] } });
  const trousers = r.pieces.find((p) => p.name === 'Suit trousers');
  const jacket = r.pieces.find((p) => p.name === 'Suit jacket');
  assert.equal(trousers.color.name, 'Navy');
  assert.equal(jacket.color.name, 'Navy');
});
