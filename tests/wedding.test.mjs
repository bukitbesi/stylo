import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const W = require('../src/lib/wedguest-core.js');
const B = require('../src/lib/bridesmaid-core.js');
const D = require('../src/lib/dress-core.js');
const C = require('../src/lib/color-core.js');

test('wedding guest: cocktail summer garden evening womenswear (FAQ example)', () => {
  const r = W.plan({ code: 'cocktail', time: 'evening', season: 'summer', venue: 'garden', style: 'womenswear' });
  assert.equal(r.pieces[0][0], 'Cocktail dress (knee to midi length)');
  assert.equal(r.pieces[1][0], 'Block heels or wedges');
  assert.equal(r.color[0], 'Fuchsia');
  assert.ok(r.notes.some((n) => /white, ivory, cream and beige/.test(n)));
  assert.equal(r.dress.l, 'knee');
});

test('wedding guest: black tie menswear is a tuxedo; beach casual menswear gets loafers or espadrilles', () => {
  assert.match(W.plan({ code: 'black-tie', style: 'menswear' }).pieces[0][0], /tuxedo/);
  const beach = W.plan({ code: 'casual', venue: 'beach', season: 'summer', style: 'menswear' });
  assert.ok(beach.pieces.some((p) => /espadrilles/.test(p[0])));
  assert.ok(beach.notes.some((n) => /Sand/.test(n)));
});

test('wedding guest: no palette color is near white, and every combination is complete', () => {
  for (const s of Object.values(W.PALETTES)) for (const t of Object.values(s)) for (const [, hex] of t) for (const w of ['#FFFFFF', '#F3EDDF']) assert.ok(C.distance('#' + hex, w) > 0.1, hex + ' vs ' + w);
  for (const code of Object.keys(W.CODES)) for (const time of Object.keys(W.TIMES)) for (const season of Object.keys(W.SEASONS))
    for (const venue of Object.keys(W.VENUES)) for (const style of ['womenswear', 'menswear']) {
      const r = W.plan({ code, time, season, venue, style });
      assert.ok(r.pieces.length >= 4, `${code} ${time} ${season} ${venue} ${style}`);
      assert.ok(D.svg(r.dress).startsWith('<svg'));
    }
});

test('bridesmaids: ombre runs light to dark; mix uses the 5-color palette; match is one color', () => {
  const o = B.plan({ color: '#9CAF94', style: 'ombre', count: 5 });
  assert.equal(o.maids.length, 5);
  const L = o.maids.map((m) => C.hexToHsl(m.hex).l);
  for (let i = 1; i < L.length; i++) assert.ok(L[i] < L[i - 1]);
  const m = B.plan({ color: '#6D1F2E', style: 'mix', count: 7 });
  assert.equal(m.palette.length, 5);
  assert.equal(m.maids[5].hex, m.palette[0]);
  const s = B.plan({ color: '#1F4FB0', style: 'match', count: 4 });
  assert.ok(s.maids.every((x) => x.hex === s.main));
  assert.equal(new Set(s.maids.map((x) => x.neckline)).size, 4);
});

test('bridesmaids: vibes tune lightness; groomsmen suit never matches the main color', () => {
  assert.ok(C.hexToHsl(B.tune('#6D1F2E', 'pastel')).l >= 77.5);
  assert.ok(C.hexToHsl(B.tune('#E8B9B0', 'jewel')).l <= 38.5);
  for (const color of ['#1F2A44', '#8E9094', '#B5A77D', '#E8B9B0', '#11775A']) for (const vibe of Object.keys(B.VIBES)) {
    const r = B.plan({ color, vibe });
    assert.ok(C.distance(r.groomsmen.suit.hex, r.main) >= 0.12, color + vibe);
  }
  assert.equal(B.plan({ count: 99 }).count, 12);
});

test('dress engine: train only on floor length, veil and slit drawn, presets valid', () => {
  assert.match(D.svg({ l: 'maxi', t: 'royal' }), /Q100 3/);
  assert.equal(D.svg({ l: 'knee', t: 'royal' }), D.svg({ l: 'knee' }));
  assert.match(D.svg({ v: 'cathedral' }), /fill-opacity="\.42"/);
  assert.match(D.describe({ l: 'maxi', x: 'side', t: 'chapel', v: 'fingertip' }), /side slit, chapel train, fingertip veil/);
  for (const p of [...D.WEDDING_PRESETS, ...D.PROM_PRESETS]) { assert.deepEqual(D.norm(p.d), p.d); assert.ok(!/NaN/.test(D.svg(p.d))); }
  assert.equal(D.advise(D.WEDDING_PRESETS[0].d).code, 'black-tie');
});
