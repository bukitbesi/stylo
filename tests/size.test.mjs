import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const S = createRequire(import.meta.url)('../src/lib/size-core.js');

test('UK 8 shoe (FAQ example)', () => {
  const r = S.convertShoe('uk', 8);
  assert.equal(r.uk, 8);
  assert.equal(r.usMen, 9);
  assert.deepEqual(r.usWomen, [10, 10.5]);
  assert.equal(r.eu, 41.5);
  assert.equal(r.footCm, 26.2);
});

test('UK 5 shoe (FAQ example)', () => {
  const r = S.convertShoe('uk', 5);
  assert.equal(r.usMen, 6);
  assert.deepEqual(r.usWomen, [7, 7.5]);
  assert.equal(r.eu, 37.5);
  assert.equal(r.footCm, 23.7);
});

test('foot length 26.5 cm', () => {
  const r = S.shoeFromFoot(26.5);
  assert.equal(r.uk, 8.5);
  assert.equal(r.eu, 42);
  assert.equal(r.mondo, 265);
});

test('EU 38 → UK 5.5, US women 7.5–8; US women 7.5 → UK 5 (common scale)', () => {
  const r = S.convertShoe('eu', 38);
  assert.equal(r.footCm, 24);
  assert.equal(r.uk, 5.5);
  assert.deepEqual(r.usWomen, [7.5, 8]);
  const w = S.convertShoe('usWomen', 7.5);
  assert.equal(w.uk, 5);
  assert.equal(S.convertShoe('usWomen', 7, 'fia').uk, 5);
});

test('out of range input returns null', () => {
  assert.equal(S.convertShoe('uk', 40), null);
  assert.equal(S.convertShoe('uk', 'x'), null);
});

test('women clothing: US 4 = UK 8 = AU 8 = EU 36', () => {
  assert.deepEqual(S.womenClothing(4), { us: 4, uk: 8, au: 8, eu: 36 });
  assert.deepEqual(S.womenFrom('eu', 40), { us: 8, uk: 12, au: 12, eu: 40 });
  assert.equal(S.womenClothing(5), null);
  assert.equal(S.womenTable().length, 11);
});

test('men: jacket 40 = EU 50; collar 15.5 in = 39 cm, 16 in = 41 cm', () => {
  assert.equal(S.menJacket(40).eu, 50);
  assert.equal(S.menJacket(40).chestCm, 102);
  assert.equal(S.collar(15.5).cm, 39);
  assert.equal(S.collar(16).cm, 41);
  assert.equal(S.inToCm(32), 81.3);
  assert.equal(S.cmToIn(81.3), 32);
});
