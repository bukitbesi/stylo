import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const R = createRequire(import.meta.url)('../src/lib/ring-core.js');

test('US 7 = 17.3 mm diameter = 54.4 mm circumference = EU 54 (FAQ example)', () => {
  const r = R.convert('us', 7);
  assert.equal(r.diameter, 17.3);
  assert.equal(r.circumference, 54.4);
  assert.equal(r.eu, 54);
});

test('US 6 = 16.5 mm; 18.1 mm ≈ US 8', () => {
  assert.equal(R.convert('us', 6).diameter, 16.5);
  assert.equal(R.convert('diameter', 18.1).us, 8);
});

test('round trips between systems', () => {
  assert.equal(R.convert('eu', 54).us, 6.75);
  assert.equal(R.convert('eu', 54.4).us, 7);
  assert.equal(R.convert('circumference', 57).us, 8);
  assert.equal(R.convert('eu', 50).us, 5.25);
});

test('out of range returns null; table covers US 3 to 13', () => {
  assert.equal(R.convert('diameter', 40), null);
  assert.equal(R.convert('us', 'x'), null);
  const t = R.table();
  assert.equal(t.length, 21);
  assert.equal(t[0].us, 3);
  assert.equal(t[t.length - 1].us, 13);
});
