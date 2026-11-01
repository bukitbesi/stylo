import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const P = createRequire(import.meta.url)('../src/lib/cpw-core.js');

test('worked example: 150 coat worn 60 times a year for 5 years = 0.50 per wear (FAQ)', () => {
  const r = P.item({ price: 150, perYear: 60, years: 5 });
  assert.equal(r.wears, 300);
  assert.equal(r.cpw, 0.5);
});

test('worked example: 40 trend top worn 10 times = 4.00 per wear; coat is 8x better', () => {
  const r = P.compare({ price: 150, perYear: 60, years: 5 }, { price: 40, perYear: 10, years: 1 });
  assert.equal(r.b.cpw, 4);
  assert.equal(r.better, 'a');
  assert.equal(r.ratio, 8);
  assert.equal(r.breakEvenA, 38);
});

test('care costs and resale value', () => {
  const r = P.item({ price: 200, perYear: 20, years: 2, care: 1, resale: 60 });
  assert.equal(r.wears, 40);
  assert.equal(r.total, 180);
  assert.equal(r.cpw, 4.5);
});

test('zero wears gives no cost per wear; negatives are ignored', () => {
  assert.equal(P.item({ price: 50, perYear: 0, years: 3 }).cpw, null);
  assert.equal(P.item({ price: -5, perYear: 10, years: 1 }).cpw, 0);
});
