import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const C = createRequire(import.meta.url)('../src/lib/color-core.js');

test('hex parsing and round trip', () => {
  assert.equal(C.normHex('abc'), '#AABBCC');
  assert.equal(C.normHex('#1f2a44'), '#1F2A44');
  assert.equal(C.normHex('zzz'), null);
  assert.equal(C.hslToHex(C.hexToHsl('#6B6B3A')), '#6B6B3A');
});

test('WCAG contrast', () => {
  assert.equal(Math.round(C.contrast('#000000', '#FFFFFF') * 100) / 100, 21);
  assert.equal(C.contrast('#777777', '#777777'), 1);
  assert.equal(C.inkOn('#1F2A44'), '#FFFFFF');
  assert.equal(C.inkOn('#F3EDDF'), '#171717');
});

test('harmonies rotate the hue wheel', () => {
  const h = C.harmonies('#FF0000');
  assert.equal(h.complementary[1], '#00FFFF');
  assert.deepEqual(h.triadic, ['#FF0000', '#00FF00', '#0000FF']);
  assert.equal(h.analogous[0], '#FF0080');
  assert.equal(h.monochromatic.length, 5);
  assert.equal(C.harmonies('nope'), null);
});

test('navy is recognised and is a neutral; gray is achromatic', () => {
  assert.equal(C.nearestNamed('#20294A').slug, 'navy');
  assert.equal(C.isAchromatic('#8E9094'), true);
  assert.equal(C.isAchromatic('#C1272D'), false);
});

test('outfit palette uses a neutral as the dominant color', () => {
  const p = C.outfitPalette('#6B6B3A');
  assert.ok(C.bySlug(C.NAMED.find((n) => n.name === p.dominant.name).slug).neutral);
  assert.equal(p.secondary.hex, '#6B6B3A');
  assert.ok(C.normHex(p.accent.hex));
});

test('every named color has a valid hex and unique slug', () => {
  const slugs = new Set();
  for (const n of C.NAMED) { assert.ok(C.normHex(n.hex), n.slug); assert.ok(!slugs.has(n.slug)); slugs.add(n.slug); }
});
