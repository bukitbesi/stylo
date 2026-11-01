import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const D = require('../src/lib/dresscode-core.js');
const G = require('../src/lib/garments.js');

test('9 dress codes from most to least formal', () => {
  assert.equal(D.CODES.length, 9);
  assert.equal(D.formality('white-tie'), 9);
  assert.equal(D.formality('casual'), 1);
  assert.equal(D.get('black-tie').name, 'Black Tie');
  assert.equal(D.get('nope'), null);
});

test('Emily Post essentials are present (FAQ facts)', () => {
  const men = (id) => D.get(id).menswear.map((i) => i[0]).join(' | ');
  assert.match(men('white-tie'), /tailcoat/);
  assert.match(men('white-tie'), /White bow tie/);
  assert.match(men('white-tie'), /waistcoat/);
  assert.match(men('black-tie'), /Black bow tie/);
  assert.match(men('black-tie-optional'), /Tuxedo or dark suit/);
  assert.match(D.get('white-tie').womenswear[0][0], /Floor-length/);
});

test('every item has a valid color and a matching garment drawing', () => {
  for (const c of D.CODES) for (const list of [c.menswear, c.womenswear]) for (const [name, hex] of list) {
    assert.match(hex, /^#[0-9A-F]{6}$/, name);
    assert.ok(G.SHAPES[G.shapeFor(name)], name);
  }
  assert.equal(G.shapeFor('White piqué waistcoat'), 'vest');
  assert.equal(G.shapeFor('Black cummerbund or waistcoat'), 'belt');
  assert.equal(G.shapeFor('White or gray gloves'), 'gloves');
  assert.equal(G.shapeFor('Tuxedo or dark suit'), 'jacket');
  assert.equal(G.shapeFor('Black tailcoat with matching trousers'), 'coat');
});
