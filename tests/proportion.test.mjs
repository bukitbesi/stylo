import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const PC = require('../src/lib/proportion-core.js');

test('balanced proportion: 67 in height with 31 in inseam (approx 46.3% legs)', () => {
  const res = PC.analyze({ height: 67, inseam: 31, unit: 'in' });
  assert.equal(res.legPercent, 46);
  assert.equal(res.torsoPercent, 54);
  assert.equal(res.verticalType, 'balanced');
  assert.match(res.riseGuidance, /mid-rise/i);
});

test('long torso / shorter legs: 68 in height with 29 in inseam (< 46% legs)', () => {
  const res = PC.analyze({ height: 68, inseam: 29, unit: 'in' });
  assert.equal(res.legPercent, 43);
  assert.equal(res.verticalType, 'long-torso');
  assert.match(res.riseGuidance, /high-rise/i);
  assert.match(res.jacketGuidance, /cropped/i);
});

test('long legs / shorter torso: 66 in height with 34 in inseam (> 49.5% legs)', () => {
  const res = PC.analyze({ height: 66, inseam: 34, unit: 'in' });
  assert.equal(res.legPercent, 52);
  assert.equal(res.verticalType, 'long-legs');
  assert.match(res.riseGuidance, /low-rise|mid-rise/i);
  assert.match(res.tuckGuidance, /untucked/i);
});

test('metric conversions and rule of thirds top/bottom length', () => {
  const res = PC.analyze({ height: 175, inseam: 82, unit: 'cm' });
  assert.equal(res.unit, 'cm');
  assert.equal(res.legPercent, 47);
  assert.equal(res.idealTopLength, 58); // 175 * 0.333 ≈ 58 cm
  assert.equal(res.idealBottomLength, 117); // 175 * 0.667 ≈ 117 cm
});

test('menswear V-taper / athletic proportion evaluation', () => {
  const athletic = PC.analyze({ height: 71, inseam: 32, shoulder: 19, waist: 31, gender: 'menswear' });
  assert.match(athletic.horizontalSummary, /athletic v-taper/i);

  const column = PC.analyze({ height: 71, inseam: 32, shoulder: 15, waist: 36, gender: 'menswear' });
  assert.match(column.horizontalSummary, /linear column/i);
});
