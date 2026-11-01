import test from 'node:test';
import assert from 'node:assert/strict';
import { changedUrls } from '../scripts/indexnow.mjs';

test('only new or changed URLs are sent', () => {
  const prev = { 'https://x/a/': '1', 'https://x/b/': '2', 'https://x/gone/': '3' };
  const next = { 'https://x/a/': '1', 'https://x/b/': '9', 'https://x/c/': '4' };
  assert.deepEqual(changedUrls(prev, next), ['https://x/b/', 'https://x/c/']);
  assert.deepEqual(changedUrls({}, { 'https://x/a/': '1' }), ['https://x/a/']);
  assert.deepEqual(changedUrls(next, next), []);
});
