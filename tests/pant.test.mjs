import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const P = createRequire(import.meta.url)('../src/lib/pant-core.js');

test('break offsets and shoe adjustments calculate exact finished inseam', () => {
  const q = P.calculate({ inseam: 31, brk: 'quarter', shoe: 'oxfords', fit: 'tailored', cuff: 'no', unit: 'in' });
  assert.equal(q.in.targetInseam, 31.5); // 31 + 0.4 rounded to nearest quarter inch = 31.5
  assert.equal(q.in.opening, 7.75);

  const loafer = P.calculate({ inseam: 31, brk: 'none', shoe: 'loafers', fit: 'slim', cuff: 'yes', unit: 'in' });
  assert.equal(loafer.in.targetInseam, 30.75); // 31 - 0.25
  assert.equal(loafer.in.cuffHeight, 1.5);
});

test('slim fit with full break triggers tailoring warning', () => {
  const w = P.calculate({ inseam: 32, brk: 'full', shoe: 'oxfords', fit: 'slim', cuff: 'no', unit: 'in' });
  assert.ok(w.warning);
  assert.match(w.warning, /too narrow/);
});

test('centimeters and out-of-range inputs are handled accurately', () => {
  const cm = P.calculate({ inseam: 78.7, brk: 'half', shoe: 'oxfords', fit: 'relaxed', cuff: 'yes', unit: 'cm' });
  assert.ok(cm.cm.targetInseam > 80);
  assert.equal(cm.in.cuffHeight, 2.0);
  assert.equal(P.calculate({ inseam: 10, unit: 'in' }), null);
});
