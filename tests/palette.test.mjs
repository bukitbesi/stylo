import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const P = require('../src/lib/palette-core.js');
const C = require('../src/lib/color-core.js');

test('Oklab round trip is lossless for sRGB colors', () => {
  for (const hex of ['#1F2A44', '#B98A57', '#FAFAF7', '#C1272D', '#000000']) {
    const rgb = C.hexToRgb(hex);
    assert.equal(P.toHex(P.toLab(rgb.r, rgb.g, rgb.b)), hex);
  }
});

test('finds the colors of a navy / camel / white / burgundy outfit in the right order (example result)', () => {
  const px = P.demoPixels([['#1F2A44', 0.5], ['#B98A57', 0.3], ['#FAFAF7', 0.15], ['#6D1F2E', 0.05]]);
  const out = P.extract(px, 6);
  assert.deepEqual(out.map((c) => c.slug), ['navy', 'camel', 'white', 'burgundy']);
  assert.deepEqual(out.map((c) => c.share), [50, 30, 15, 5]);
});

test('same input gives the same palette; transparent pixels are ignored', () => {
  const px = P.demoPixels([['#6B6B3A', 0.6], ['#D8C8AE', 0.4]]);
  assert.deepEqual(P.extract(px), P.extract(px));
  assert.deepEqual(P.extract(new Uint8ClampedArray(400)), []);
});

test('season match ranks a muted earthy palette as autumn', () => {
  const m = P.seasonMatch([{ hex: '#C9A27E', share: 50 }, { hex: '#8A9A6E', share: 30 }, { hex: '#EFE6D6', share: 20 }], 3);
  assert.equal(m.length, 3);
  assert.match(m[0].name, /Autumn/);
});
