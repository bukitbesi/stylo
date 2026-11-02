/*! SimplyStylo contact form. (c) SimplyStylo. All rights reserved. */
// Sends the form with fetch so the reader stays on the page; without JavaScript the form still posts normally.
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  var form = document.querySelector('[data-contact]');
  if (!form) return;
  var status = form.querySelector('[data-status]'), btn = form.querySelector('button[type=submit]');
  form.querySelector('input[name=t]').value = String(Date.now());
  var topic = new URLSearchParams(location.search).get('topic');
  if (topic && form.topic.querySelector('option[value="' + topic.replace(/[^a-z]/g, '') + '"]')) form.topic.value = topic;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    btn.disabled = true; btn.textContent = 'Sending…';
    status.className = 'form-status'; status.textContent = '';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        if (j.ok) {
          form.innerHTML = '<div class="form-done" tabindex="-1"><h2>Thank you, your message is on its way</h2><p>We reply to every genuine message, usually within two working days. Check your spam folder if you have not heard back.</p></div>';
          form.querySelector('.form-done').focus();
          return;
        }
        throw new Error(j.error || 'Your message could not be sent.');
      })
      .catch(function (err) {
        status.className = 'form-status form-status--err';
        status.textContent = (err && err.message && err.message !== 'Failed to fetch' ? err.message : 'Your message could not be sent.') + ' You can also email hello@simplystylo.com.';
        btn.disabled = false; btn.textContent = 'Send message';
      });
  });
})();
