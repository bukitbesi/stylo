// Contact form handler for POST /api/contact. Pure and runtime-agnostic (tested in Node): the Worker entry injects
// Cloudflare's EmailMessage class. Mail goes to the address in the CONTACT_TO secret (a verified Email Routing
// destination), so no personal address is ever stored in this repository.

export const TOPICS = {
  general: 'General question',
  correction: 'Correction or error report',
  tool: 'Tool idea or feedback',
  advertising: 'Advertising and sponsorship',
  partnership: 'Affiliate or brand partnership',
  press: 'Press and media'
};
const LIMITS = { name: 100, email: 200, company: 120, message: 5000 };
const MIN_SECONDS = 3;
const ORIGIN = 'https://simplystylo.com';

const oneLine = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

// Returns { ok: true, data } or { ok: false, error } with a reader-friendly reason.
export function validate(form, now = Date.now()) {
  const f = (k) => (form.get ? form.get(k) : form[k]) ?? '';
  if (oneLine(f('website'))) return { ok: false, error: 'spam' };
  const started = Number(f('t'));
  if (started && (now - started) / 1000 < MIN_SECONDS) return { ok: false, error: 'too-fast' };
  const data = {
    name: oneLine(f('name')).slice(0, LIMITS.name),
    email: oneLine(f('email')).slice(0, LIMITS.email),
    company: oneLine(f('company')).slice(0, LIMITS.company),
    topic: TOPICS[f('topic')] ? f('topic') : 'general',
    message: String(f('message')).replace(/\r\n?/g, '\n').trim().slice(0, LIMITS.message)
  };
  if (data.name.length < 2) return { ok: false, error: 'name' };
  if (!EMAIL.test(data.email)) return { ok: false, error: 'email' };
  if (data.message.length < 10) return { ok: false, error: 'message' };
  if ((data.message.match(/https?:\/\//gi) || []).length > 3) return { ok: false, error: 'links' };
  return { ok: true, data };
}

export const ERRORS = {
  spam: 'Message not sent.',
  'too-fast': 'That was quick. Please wait a few seconds and send again.',
  name: 'Please enter your name.',
  email: 'Please enter a valid email address so we can reply.',
  message: 'Please write a message of at least 10 characters.',
  links: 'Please include no more than three links.',
  method: 'Use the form on the contact page.',
  origin: 'Message not sent.',
  config: 'The form is not available right now. Please email hello@simplystylo.com.',
  send: 'Your message could not be sent. Please try again or email hello@simplystylo.com.'
};

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
const word = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);

// A minimal RFC 5322 message: UTF-8 plain text, base64 body, Reply-To set to the sender so "Reply" just works.
export function mime({ from, to, replyTo, subject, text, now = Date.now(), id = crypto.randomUUID() }) {
  const body = b64(text).replace(/.{76}/g, '$&\r\n');
  return [
    `From: ${word('SimplyStylo contact form')} <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${replyTo}>`,
    `Subject: ${word(subject)}`,
    `Date: ${new Date(now).toUTCString()}`,
    `Message-ID: <${id}@simplystylo.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body
  ].join('\r\n');
}

export function compose(data, meta = {}) {
  const subject = `[${TOPICS[data.topic]}] ${data.name}${data.company ? ' (' + data.company + ')' : ''}`;
  const text = `${data.message}\n\n---\nName: ${data.name}\nEmail: ${data.email}\n${data.company ? 'Company: ' + data.company + '\n' : ''}` +
    `Topic: ${TOPICS[data.topic]}\nSent from: ${meta.page || ORIGIN + '/contact/'}\nCountry: ${meta.country || 'unknown'}\n`;
  return { subject, text };
}

const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const text = (status, msg) => new Response(msg + '\n\nGo back: ' + ORIGIN + '/contact/', { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

// Scripted submissions get JSON; a plain HTML form post (no JavaScript) is redirected to the thank-you page.
export async function handle(request, env, EmailMessage, now = Date.now()) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const fail = (status, error) => (wantsJson ? json(status, { ok: false, error: ERRORS[error] }) : text(status, ERRORS[error]));
  if (request.method !== 'POST') return fail(405, 'method');
  const origin = request.headers.get('Origin');
  if (origin && origin !== ORIGIN && !/^http:\/\/localhost(:\d+)?$/.test(origin)) return fail(403, 'origin');

  let form;
  try { form = await request.formData(); } catch { return fail(400, 'message'); }
  const v = validate(form, now);
  // Spam is answered like a success so bots learn nothing.
  if (!v.ok && v.error === 'spam') return wantsJson ? json(200, { ok: true }) : Response.redirect(ORIGIN + '/contact/sent/', 303);
  if (!v.ok) return fail(400, v.error);
  if (!env.MAILER || !env.CONTACT_TO) return fail(503, 'config');

  const from = env.CONTACT_FROM || 'form@simplystylo.com';
  const { subject, text: body } = compose(v.data, { page: request.headers.get('Referer'), country: request.cf?.country });
  try {
    await env.MAILER.send(new EmailMessage(from, env.CONTACT_TO, mime({ from, to: env.CONTACT_TO, replyTo: v.data.email, subject, text: body, now })));
  } catch (e) {
    console.error('contact send failed', e && e.message);
    return fail(502, 'send');
  }
  return wantsJson ? json(200, { ok: true }) : Response.redirect(ORIGIN + '/contact/sent/', 303);
}
