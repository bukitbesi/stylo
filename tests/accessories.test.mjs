import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('../src/lib/hat-core.js');
const G = require('../src/lib/glove-core.js');
const N = require('../src/lib/necklace-core.js');

test('hat: 57 cm = US 7⅛ = EU 57 = 22½ in (FAQ example); 54 cm = US 6¾; 59 cm = US 7⅜', () => {
  const r = H.convert('cm', 57);
  assert.equal(r.usLabel, '7 ⅛');
  assert.equal(r.eu, 57);
  assert.equal(r.inchLabel, '22 ½');
  assert.equal(H.convert('cm', 54).usLabel, '6 ¾');
  assert.equal(H.convert('cm', 59).usLabel, '7 ⅜');
});

test('hat: US size × 2.54π gives the circumference; inches convert too', () => {
  assert.equal(H.convert('us', 7).cm, 55.9);
  assert.equal(H.convert('us', 7.25).cm, 57.9);
  assert.equal(H.convert('in', 22.5).usLabel, '7 ⅛');
  assert.equal(H.convert('cm', 30), null);
  assert.equal(H.table().length, 13);
});

test('glove: EN ISO 21420 size 8 = 203 mm around, 182 mm long (FAQ example); size n ≈ n inches', () => {
  const r = G.size(203, 182);
  assert.equal(r.size, 8);
  assert.equal(r.lengthSize, 8);
  assert.equal(r.inches, 8);
  assert.deepEqual(G.table().map((t) => t.circ), [152, 178, 203, 229, 254, 279]);
});

test('glove: nearest size, length mismatch and out-of-standard hands', () => {
  const r = G.size(215, 171);
  assert.equal(r.size, 8);
  assert.equal(r.lengthSize, 7);
  assert.equal(G.size(178).size, 7);
  assert.equal(G.size(300).inStandard, false);
  assert.equal(G.size(50), null);
});

test('necklace: 16 in choker, 18 in princess, 22 in matinee, 30 in opera, 48 in rope (FAQ examples)', () => {
  assert.equal(N.classify(16).type.id, 'choker');
  assert.equal(N.classify(18).type.id, 'princess');
  assert.equal(N.classify(22).type.id, 'matinee');
  assert.equal(N.classify(30).type.id, 'opera');
  assert.equal(N.classify(48).type.id, 'rope');
  assert.equal(N.classify(18).cm, 46);
});

test('necklace: disputed lengths say so; doubled long chains; layering gaps under 2 in are flagged', () => {
  assert.equal(N.classify(26).type.id, 'gap');
  assert.equal(N.classify(36).type.id, 'long');
  assert.equal(N.classify(36).doubled.type.id, 'princess');
  const s = N.stack(['22', '16', '17'], 'in');
  assert.deepEqual(s.items.map((i) => i.inches), [16, 17, 22]);
  assert.deepEqual(s.close, [[16, 17]]);
  assert.equal(N.stack(['16', '18', '20'], 'in').close.length, 0);
  assert.equal(N.stack(['45.7'], 'cm').items[0].type.id, 'princess');
});
