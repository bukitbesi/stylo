import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const G = require('../src/lib/garments.js');
const K = require('../src/lib/capsule-core.js');
const O = require('../src/lib/outfit-core.js');

test('garment names map to the right silhouette', () => {
  const cases = { 'Oxford shirt': 'shirt', 'Black oxfords': 'loafers', 'Shirt dress': 'dress', 'Suit jacket (matching trousers)': 'jacket',
    'Linen overshirt': 'jacket', 'Chunky cardigan sweater': 'cardigan', 'Knitted polo': 'polo', 'Sleeveless knit': 'tank',
    'Dark jeans': 'jeans', 'White leather sneakers': 'sneakers', 'Silk tie': 'tie', 'Trench or mac': 'coat', 'Floor-length gown': 'gown',
    'T-shirt': 'tee', 'Knit midi dress': 'dress', 'Puffer or insulated coat': 'coat', 'Silk scarf': 'scarf' };
  for (const [name, shape] of Object.entries(cases)) assert.equal(G.shapeFor(name), shape, name);
});

test('every garment in every library has a drawing other than the fallback, unless it is a tee', () => {
  const names = new Set();
  for (const w of Object.values(K.LIB)) for (const cat of Object.values(w)) cat.forEach(([n]) => names.add(n));
  for (const w of Object.values(O.LIB)) for (const slot of Object.values(w)) slot.forEach(([n]) => names.add(n));
  for (const n of names) {
    const s = G.shapeFor(n);
    assert.ok(G.SHAPES[s], n);
    if (s === 'tee') assert.match(n, /t-shirt|tee|henley/i, n);
  }
});

test('svg output is valid-looking and colored', () => {
  const out = G.svg('Dark jeans', '#2E3E57', 48);
  assert.match(out, /^<svg[^>]*width="48"/);
  assert.match(out, /fill="#2E3E57"/);
  assert.match(out, /aria-label="Dark jeans"/);
  assert.match(G.svg('Belt', 'bad', 64, true), /aria-hidden="true"/);
  assert.equal(G.impliedHex('White T-shirt'), '#FAFAF7');
  assert.equal(G.impliedHex('Light blue dress shirt'), '#A9C6E3');
  assert.equal(G.impliedHex('Chinos'), null);
});
