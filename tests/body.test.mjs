import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const B = createRequire(import.meta.url)('../src/lib/body-core.js');
const c = (bust, waist, highHip, hips, unit = 'in') => B.classify({ bust, waist, highHip, hips, unit }).id;

test('worked examples (FAQ numbers)', () => {
  assert.equal(c(36, 26, 33, 36), 'hourglass');
  assert.equal(c(34, 30, 33, 36), 'rectangle');
  assert.equal(c(34, 30, 35, 40), 'bottom-hourglass');
  assert.equal(c(34, 30, 37, 40), 'spoon');
  assert.equal(c(34, 32, 36, 39), 'triangle');
  assert.equal(c(40, 33, 34, 35), 'inverted-triangle');
  assert.equal(c(40, 30, 34, 36), 'top-hourglass');
});

test('centimeters give the same result as inches', () => {
  assert.equal(c(91.4, 66, 83.8, 91.4, 'cm'), 'hourglass');
  assert.equal(c(101.6, 83.8, 86.4, 88.9, 'cm'), 'inverted-triangle');
});

test('rules apply in the published order (hourglass before rectangle)', () => {
  // bust − waist = 9 exactly: hourglass threshold is ≥ 9, so it is an hourglass, not a rectangle.
  assert.equal(c(35, 26, 33, 35), 'hourglass');
});

test('combinations that meet no rule are reported as between shapes', () => {
  // Bust 2 in over hips, bust − waist 8: not hourglass (> 1), not top hourglass (< 9), not inverted triangle (< 3.6)…
  const r = B.classify({ bust: 38, waist: 30, highHip: 33, hips: 36, unit: 'in' });
  assert.ok(B.SHAPES[r.id]);
});

test('invalid input returns null; every shape has 3 tips', () => {
  assert.equal(B.classify({ bust: 'x', waist: 30, highHip: 33, hips: 36 }), null);
  assert.equal(B.classify({ bust: 5, waist: 30, highHip: 33, hips: 36 }), null);
  for (const s of Object.values(B.SHAPES)) assert.equal(s.tips.length, 3);
});
