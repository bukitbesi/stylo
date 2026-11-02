import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, mime, compose, handle, TOPICS } from '../worker/contact.js';

const NOW = Date.UTC(2026, 10, 2, 10, 0, 0);
const good = { name: 'Ana Lee', email: 'ana@example.com', company: 'Atelier Ana', topic: 'advertising', message: 'We would like to sponsor a bridal guide.', t: String(NOW - 20000), website: '' };
const form = (o) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.append(k, v); return f; };
const req = (o, headers = {}) => new Request('https://simplystylo.com/api/contact', { method: 'POST', body: form(o), headers: { Origin: 'https://simplystylo.com', ...headers } });
class FakeMessage { constructor(from, to, raw) { Object.assign(this, { from, to, raw }); } }
const mailer = () => { const sent = []; return { sent, send: async (m) => { sent.push(m); } }; };

test('a genuine message validates and keeps its topic', () => {
  const v = validate(good, NOW);
  assert.equal(v.ok, true);
  assert.equal(v.data.topic, 'advertising');
  assert.equal(TOPICS[v.data.topic], 'Advertising and sponsorship');
});

test('spam signals are rejected: honeypot, under 3 seconds, bad email, short message, many links', () => {
  assert.equal(validate({ ...good, website: 'http://x' }, NOW).error, 'spam');
  assert.equal(validate({ ...good, t: String(NOW - 1000) }, NOW).error, 'too-fast');
  assert.equal(validate({ ...good, email: 'ana@example' }, NOW).error, 'email');
  assert.equal(validate({ ...good, message: 'hi' }, NOW).error, 'message');
  assert.equal(validate({ ...good, message: 'http://a http://b http://c http://d' }, NOW).error, 'links');
  assert.equal(validate({ ...good, topic: 'casino' }, NOW).data.topic, 'general');
});

test('header injection is impossible: line breaks in name and email are flattened', () => {
  const v = validate({ ...good, name: 'Ana\r\nBcc: x@y.z' }, NOW);
  assert.equal(v.data.name, 'Ana Bcc: x@y.z');
  const raw = mime({ from: 'form@simplystylo.com', to: 'me@example.com', replyTo: v.data.email, ...compose(v.data), now: NOW, id: 'abc' });
  assert.equal(raw.split('\r\n').filter((l) => /^Bcc:/i.test(l)).length, 0);
});

test('MIME message: UTF-8 subject encoded, Reply-To is the sender, body decodes back', () => {
  const raw = mime({ from: 'form@simplystylo.com', to: 'me@example.com', replyTo: 'ana@example.com', subject: 'Café — hello', text: 'Olá ✓', now: NOW, id: 'abc' });
  assert.match(raw, /^Subject: =\?UTF-8\?B\?/m);
  assert.match(raw, /^Reply-To: <ana@example.com>$/m);
  assert.match(raw, /^Date: Mon, 02 Nov 2026 10:00:00 GMT$/m);
  const body = raw.split('\r\n\r\n')[1].replace(/\r\n/g, '');
  assert.equal(new TextDecoder().decode(Uint8Array.from(atob(body), (c) => c.charCodeAt(0))), 'Olá ✓');
});

test('handler sends one email to CONTACT_TO and answers JSON or redirects', async () => {
  const m = mailer();
  const env = { MAILER: m, CONTACT_TO: 'owner@example.com' };
  const r1 = await handle(req(good, { Accept: 'application/json' }), env, FakeMessage, NOW);
  assert.equal(r1.status, 200);
  assert.deepEqual(await r1.json(), { ok: true });
  assert.equal(m.sent.length, 1);
  assert.equal(m.sent[0].from, 'form@simplystylo.com');
  assert.equal(m.sent[0].to, 'owner@example.com');
  assert.match(m.sent[0].raw, /^Subject: \[Advertising and sponsorship\] Ana Lee \(Atelier Ana\)$/m);
  const r2 = await handle(req(good), env, FakeMessage, NOW);
  assert.equal(r2.status, 303);
  assert.equal(r2.headers.get('Location'), 'https://simplystylo.com/contact/sent/');
});

test('handler refuses other sites, missing config and bad input without sending', async () => {
  const m = mailer();
  const env = { MAILER: m, CONTACT_TO: 'owner@example.com' };
  assert.equal((await handle(req(good, { Origin: 'https://evil.example' }), env, FakeMessage, NOW)).status, 403);
  assert.equal((await handle(req(good, { Accept: 'application/json' }), {}, FakeMessage, NOW)).status, 503);
  const bad = await handle(req({ ...good, email: 'nope' }, { Accept: 'application/json' }), env, FakeMessage, NOW);
  assert.equal(bad.status, 400);
  assert.match((await bad.json()).error, /valid email/);
  const spam = await handle(req({ ...good, website: 'x' }, { Accept: 'application/json' }), env, FakeMessage, NOW);
  assert.equal(spam.status, 200);
  assert.equal(m.sent.length, 0);
});
