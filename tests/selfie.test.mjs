import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const S = require('../src/lib/selfie-core.js');
const C = require('../src/lib/color-core.js');
const SE = require('../src/lib/season-core.js');
const rgb = (h) => C.hexToRgb(h);

test('light hair, fair skin, clear blue eyes read as light / fair / low contrast / clear', () => {
  const r = S.answers({ skin: rgb('#F1D2C2'), hair: rgb('#D9B98A'), eyes: rgb('#5B86B8') });
  assert.deepEqual(r.answers, { hair: 0, skin: 0, contrast: 2, eyes: 0 });
});

test('black hair and medium skin read as dark / medium / high contrast', () => {
  const r = S.answers({ skin: rgb('#C68E6E'), hair: rgb('#1C1A1A'), eyes: rgb('#3A2618') });
  assert.equal(r.answers.hair, 2);
  assert.equal(r.answers.skin, 1);
  assert.equal(r.answers.contrast, 0);
});

test('photo answers plus undertone answers give a full season result', () => {
  const r = S.answers({ skin: rgb('#C68E6E'), hair: rgb('#1C1A1A'), eyes: rgb('#3A2618') });
  const res = SE.analyse({ ...r.answers, veins: 0, metal: 0, white: 0, sun: 0 });
  assert.equal(res.season.family, 'Winter');
});

test('white balance removes a warm color cast', () => {
  const white = { r: 255, g: 230, b: 200 }; // white paper under warm light
  const fixed = S.whiteBalance(white, white);
  assert.ok(Math.abs(fixed.r - fixed.b) <= 2);
  assert.deepEqual(S.whiteBalance({ r: 10, g: 20, b: 30 }), { r: 10, g: 20, b: 30 });
});

test('sampling averages a square of pixels; missing samples return null', () => {
  const data = new Uint8ClampedArray(10 * 10 * 4).fill(100);
  assert.deepEqual(S.sample(data, 10, 10, 5, 5, 2), { r: 100, g: 100, b: 100 });
  assert.equal(S.answers({ skin: rgb('#C68E6E') }), null);
});
