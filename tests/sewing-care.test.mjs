import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const S = require('../src/lib/skirt-core.js');
const C = require('../src/lib/care-core.js');

const base = { waist: 70, length: 60, seam: 1.5, hem: 2.5, width: 150 };

test('circle skirt: 70 cm waist full circle = 11.14 cm radius, cut 9.64 / 73.64 cm, 147.3 cm of 150 cm fabric (FAQ example)', () => {
  const r = S.calc({ ...base, type: 'full' });
  assert.equal(r.r, 11.14);
  assert.equal(r.inner, 9.64);
  assert.equal(r.outer, 73.64);
  assert.equal(r.fabric, 147.3);
  assert.equal(r.layout.panels, 1);
  assert.equal(r.hemSweep, 447);
});

test('circle skirt: half and quarter radii double and quadruple the full-circle radius', () => {
  assert.equal(S.calc({ ...base, type: 'half' }).r, 22.28);
  assert.equal(S.calc({ ...base, type: 'quarter' }).r, 44.56);
  assert.equal(S.calc({ ...base, type: 'half' }).fabric, 169.6);
  assert.equal(S.calc({ ...base, type: 'quarter' }).fabric, 107.1);
});

test('circle skirt: narrow fabric needs two half-circle pieces; too-narrow fabric gives no layout', () => {
  const r = S.calc({ ...base, type: 'full', width: 110 });
  assert.equal(r.fabric, 294.6);
  assert.equal(r.layout.panels, 2);
  assert.equal(S.calc({ ...base, type: 'full', width: 60 }).fabric, null);
  assert.equal(S.calc({ ...base, waist: 0, type: 'full' }), null);
});

test('circle skirt in inches: 28 in waist full circle = 4.46 in radius', () => {
  const r = S.calc({ waist: 28, length: 24, type: 'full', seam: 0.625, hem: 1, width: 60 });
  assert.equal(r.r, 4.46);
  assert.equal(r.fabric, 58.9);
});

test('care label: ISO 3758 washing table has 12 machine washes plus hand wash and do not wash', () => {
  assert.equal(C.WASH.length, 14);
  assert.deepEqual(C.WASH.filter((w) => w[3].bars === 2).map((w) => w[0]), ['40vm', '30vm']);
  assert.match(C.find(C.GROUPS[0], 'hand')[2], /40 °C/);
});

test('care label: decode keeps the prescribed order and skips symbols not on the label', () => {
  const d = C.decode({ w: '40m', b: 'oxygen', t: '', i: 'medium', p: 'P' });
  assert.deepEqual(d.map((x) => x.group), ['Washing', 'Bleaching', 'Ironing', 'Professional care']);
  assert.match(d[2].text, /150 °C/);
  assert.match(C.svg('tub', { t: 40, bars: 1 }, 40, 'x'), /<text[^>]*>40<\/text>/);
  assert.match(C.svg('iron', { cross: true }), /M6 6 30 30/);
});
