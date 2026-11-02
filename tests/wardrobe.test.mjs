import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const W = createRequire(import.meta.url)('../src/lib/wardrobe-core.js');

test('neutral-heavy wardrobe (FAQ example): 70% neutrals, every pair easy, suggests colors', () => {
  const r = W.analyse({ navy: 4, white: 3, gray: 2, burgundy: 2, 'olive-green': 1 });
  assert.equal(r.total, 12);
  assert.equal(r.neutralShare, 75);
  assert.equal(r.balance, 'strong');
  assert.equal(r.suggestions.length, 3);
  assert.ok(r.suggestions.every((s) => !s.neutral));
});

test('color-heavy wardrobe gets neutral suggestions and flags hard pairs', () => {
  const r = W.analyse({ red: 3, 'emerald-green': 2, purple: 2, 'mustard-yellow': 2, navy: 1 });
  assert.equal(r.balance, 'color-heavy');
  assert.ok(r.suggestions.every((s) => s.neutral));
  assert.ok(r.hardPairs.length > 0);
  assert.ok(r.easyPairs < 100);
});

test('pair rules', () => {
  const C = { neutral: false };
  assert.equal(W.pairScore({ ...C, hex: '#FF0000' }, { ...C, hex: '#00FFFF' }), 0.9);
  assert.equal(W.pairScore({ ...C, hex: '#FF0000' }, { ...C, hex: '#FF4000' }), 0.8);
  assert.equal(W.pairScore({ ...C, hex: '#FF0000' }, { ...C, hex: '#00FF00' }), 0.6);
  assert.equal(W.pairScore({ ...C, hex: '#FF0000' }, { ...C, hex: '#FFFF00' }), 0.2);
  assert.equal(W.pairScore({ neutral: true, hex: '#1F2A44' }, { ...C, hex: '#FFFF00' }), 1);
  assert.equal(W.analyse({}), null);
});

test('share links keep hyphenated color names (olive-green)', async () => {
  const { createRequire } = await import('node:module');
  const UI = createRequire(import.meta.url)('../src/ui/wardrobe-colors.js');
  const o = { navy: 2, 'olive-green': 1, 'blush-pink': 3 };
  assert.deepEqual(UI.decode(UI.encode(o)), o);
});
