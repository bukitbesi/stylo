import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const S = createRequire(import.meta.url)('../src/lib/season-core.js');

const all = (i) => Object.fromEntries(S.QUESTIONS.map((q) => [q.id, i]));

test('12 seasons, each with 10 colors and 4 neutrals', () => {
  assert.equal(Object.keys(S.SEASONS).length, 12);
  for (const [id, s] of Object.entries(S.SEASONS)) {
    assert.equal(s.palette.length, 10, id);
    assert.equal(s.neutrals.length, 4, id);
  }
});

test('cool + light + soft answers → Light Summer family', () => {
  const r = S.analyse({ veins: 0, metal: 0, white: 1, sun: 0, hair: 0, skin: 0, eyes: 2, contrast: 2 });
  assert.equal(r.season.family, 'Summer');
});

test('warm + deep answers → Deep Autumn', () => {
  const r = S.analyse({ veins: 2, metal: 2, white: 2, sun: 2, hair: 2, skin: 2, eyes: 1, contrast: 1 });
  assert.equal(r.id, 'deep-autumn');
});

test('cool + deep + bright answers → Winter', () => {
  const r = S.analyse({ veins: 0, metal: 0, white: 0, sun: 0, hair: 2, skin: 1, eyes: 0, contrast: 0 });
  assert.equal(r.season.family, 'Winter');
});

test('warm + light + bright answers → Spring', () => {
  const r = S.analyse({ veins: 2, metal: 2, white: 0, sun: 2, hair: 0, skin: 0, eyes: 0, contrast: 0 });
  assert.equal(r.season.family, 'Spring');
});

test('all-middle answers are flagged borderline', () => {
  const r = S.analyse(all(1));
  assert.equal(r.borderline, true);
  assert.equal(S.answered({}), 0);
  assert.equal(S.answered(all(1)), S.QUESTIONS.length);
});

test('every combination of answers maps to a season', () => {
  const qs = S.QUESTIONS;
  let n = 0;
  const walk = (i, acc) => {
    if (i === qs.length) { const r = S.analyse(acc); assert.ok(S.SEASONS[r.id], JSON.stringify(acc)); n++; return; }
    for (let k = 0; k < 3; k++) walk(i + 1, { ...acc, [qs[i].id]: k });
  };
  walk(0, {});
  assert.equal(n, 3 ** qs.length);
});
