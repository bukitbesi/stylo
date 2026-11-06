import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const DenimCore = require('../src/lib/denim-core.js');
const DenimUI = require('../src/ui/jeans-fit.js');
const BraCore = require('../src/lib/bra-core.js');
const BraUI = require('../src/ui/bra-size.js');
const FabricCore = require('../src/lib/fabric-core.js');
const FabricUI = require('../src/ui/fabric-gsm.js');

test('DenimCore calculates rise, curvy block, and finished inseam accurately', () => {
  const r = DenimCore.calculate({ unit: 'in', height: 66, waist: 27, hips: 39, inseam: 30, cut: 'straight', shoe: 'sneakers' });
  assert.ok(r);
  assert.equal(r.blockName, 'Curvy Fit Block (Anti-Gap Waist)'); // 39 - 27 = 12 in > 11 in
  assert.equal(r.in.targetInseam, 30.25); // 30 + 0.25 + 0
  assert.ok(DenimUI.result(DenimUI.norm(DenimUI.DEFAULT)).includes('svg'));

  const straightBlock = DenimCore.calculate({ unit: 'cm', height: 175, waist: 78, hips: 96, inseam: 81, cut: 'wide', shoe: 'heels' });
  assert.ok(straightBlock);
  assert.equal(straightBlock.blockName, 'Straight / Athletic Fit Block'); // 18 cm (~7.1 in < 8.5 in)
});

test('BraCore calculates UK, US, EU, and AU bra sizes plus sister sizes', () => {
  const b = BraCore.calculate({ unit: 'in', underbust: 31.5, bust: 36, fit: 'snug' });
  assert.ok(b);
  assert.equal(b.primary.band, 32);
  assert.equal(b.primary.uk, '32D');
  assert.equal(b.primary.us, '32D');
  assert.equal(b.primary.eu, '70D');
  assert.equal(b.primary.au, '10D');
  assert.equal(b.sisterDown.uk, '30DD');
  assert.equal(b.sisterUp.uk, '34C');
  assert.ok(BraUI.result(BraUI.norm(BraUI.DEFAULT)).includes('svg'));

  // Test above D cup where UK and US diverge
  const fuller = BraCore.calculate({ unit: 'in', underbust: 34, bust: 42, fit: 'snug' }); // 8 in diff -> UK FF / US H
  assert.equal(fuller.primary.uk, '34FF');
  assert.equal(fuller.primary.us, '34H');
});

test('FabricCore converts GSM and oz/yd² and classifies textile tiers', () => {
  const w = FabricCore.analyze({ val: 260, unit: 'gsm', fiber: 'wool' });
  assert.ok(w);
  assert.equal(w.gsm, 260);
  assert.equal(w.oz, 7.7);
  assert.equal(w.tier.id, 'mid');
  assert.ok(FabricUI.result(FabricUI.norm(FabricUI.DEFAULT)).includes('svg'));

  const denim = FabricCore.analyze({ val: 14, unit: 'oz', fiber: 'denim' });
  assert.ok(denim);
  assert.equal(denim.gsm, 475);
  assert.equal(denim.tier.id, 'heavy');
});
