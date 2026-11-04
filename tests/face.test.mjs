import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const F = createRequire(import.meta.url)('../src/lib/face-core.js');
const c = (forehead, cheekbones, jawline, length, unit = 'cm') => F.classify({ forehead, cheekbones, jawline, length, unit }).id;

test('worked examples for all 7 face shapes (cm)', () => {
  assert.equal(c(13.5, 14, 11.8, 19.5), 'oval');
  assert.equal(c(13.2, 14.5, 12.2, 18.0), 'round');
  assert.equal(c(14.0, 14.2, 13.8, 18.2), 'square');
  assert.equal(c(13.2, 13.6, 12.8, 22.0), 'oblong');
  assert.equal(c(14.2, 14.4, 11.2, 19.0), 'heart');
  assert.equal(c(11.8, 14.6, 11.5, 19.8), 'diamond');
  assert.equal(c(12.0, 13.8, 14.2, 19.2), 'triangle');
});

test('inches give the same result as centimeters', () => {
  assert.equal(c(5.3, 5.5, 4.6, 7.7, 'in'), 'oval');
  assert.equal(c(5.5, 5.6, 5.4, 7.2, 'in'), 'square');
});

test('invalid input returns null; every shape has 4 frames and 3 tips', () => {
  assert.equal(F.classify({ forehead: 'x', cheekbones: 14, jawline: 12, length: 19 }), null);
  assert.equal(F.classify({ forehead: 2, cheekbones: 14, jawline: 12, length: 19 }), null);
  for (const s of Object.values(F.SHAPES)) {
    assert.equal(s.frames.length, 4);
    assert.equal(s.tips.length, 3);
  }
});
