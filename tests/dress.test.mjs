import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const D = createRequire(import.meta.url)('../src/lib/dress-core.js');

test('every option combination draws a closed, valid SVG', () => {
  const O = D.OPTIONS;
  let n = 0;
  for (const neck of Object.keys(O.neckline)) for (const sleeve of Object.keys(O.sleeve)) for (const waist of Object.keys(O.waist))
    for (const sk of Object.keys(O.skirt)) for (const len of Object.keys(O.length)) {
      const s = D.svg({ n: neck, s: sleeve, w: waist, k: sk, l: len, p: 'solid', c: '1F2A44' });
      assert.match(s, /^<svg[^>]+viewBox="0 0 200 340"/);
      assert.ok(!/NaN|undefined/.test(s), `${neck} ${sleeve} ${waist} ${sk} ${len}`);
      n++;
    }
  assert.equal(n, 8 * 7 * 3 * 7 * 4);
});

test('patterns, photo fabric, belt and unique ids', () => {
  assert.match(D.svg({ p: 'dots' }, { id: 'x' }), /<pattern id="x-fab"/);
  assert.match(D.svg({ p: 'photo' }, { id: 'y', photo: 'data:image/jpeg;base64,AAAA' }), /<image href="data:image\/jpeg;base64,AAAA"/);
  assert.match(D.svg({ p: 'photo' }), /fill="#1F2A44"/); // photo pattern without a photo falls back to the color
  assert.match(D.svg({ b: 'C9A44C' }), /fill="#C9A44C"/);
  assert.match(D.svg({}, { credit: true }), /Designed on SimplyStylo\.com/);
});

test('bad input is normalized', () => {
  assert.deepEqual(D.norm({ n: 'nope', c: 'xyz', l: 'mini' }), { ...D.DEFAULT, l: 'mini' });
});

test('description and advice (FAQ example: default design)', () => {
  assert.equal(D.describe(D.DEFAULT), 'Midi fit-and-flare dress with a v-neck, short sleeves and a natural waist');
  const a = D.advise(D.DEFAULT);
  assert.equal(a.shapes[0].id, 'hourglass');
  assert.equal(a.code, 'smart-casual');
  const gown = D.advise(D.PRESETS.find((p) => p.id === 'bridal').d);
  assert.equal(gown.code, 'black-tie');
});

test('six presets, all valid', () => {
  assert.equal(D.PRESETS.length, 6);
  for (const p of D.PRESETS) assert.deepEqual(D.norm(p.d), p.d);
});
