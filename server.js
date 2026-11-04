import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validate, ERRORS } from './worker/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.join(__dirname, 'dist');

// Ensure dist is built before serving
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.log('dist/ not found, building static site...');
  execSync('node scripts/build.mjs', { stdio: 'inherit', cwd: __dirname });
}

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Known legacy redirects from dist/_redirects
app.get('/tools/color-combinations/', (req, res) => res.redirect(301, '/tools/color-combination/'));
app.get('/tools/color-combinations', (req, res) => res.redirect(301, '/tools/color-combination/'));
app.get('/tools/size-chart/', (req, res) => res.redirect(301, '/tools/size-converter/'));
app.get('/tools/size-chart', (req, res) => res.redirect(301, '/tools/size-converter/'));

// Contact form API handler
app.post('/api/contact', async (req, res) => {
  const wantsJson = (req.headers['accept'] || '').includes('application/json');
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (Array.isArray(v)) for (const item of v) headers.append(k, item);
      else if (v) headers.set(k, v);
    }

    const hostHeader = req.headers['host'] || `localhost:${PORT}`;
    const webReq = new Request(`http://${hostHeader}${req.originalUrl || req.url}`, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' && body.length > 0 ? body : undefined,
      duplex: 'half',
    });

    const form = await webReq.formData();
    const v = validate(form, Date.now());

    if (!v.ok && v.error === 'spam') {
      return wantsJson ? res.json({ ok: true }) : res.redirect(303, '/contact/sent/');
    }

    if (!v.ok) {
      const errMsg = ERRORS[v.error] || 'Invalid form submission.';
      return wantsJson ? res.status(400).json({ ok: false, error: errMsg }) : res.status(400).send(errMsg);
    }

    // Successfully validated
    return wantsJson ? res.json({ ok: true }) : res.redirect(303, '/contact/sent/');
  } catch (err) {
    console.error('Error handling contact form:', err);
    const errMsg = ERRORS.send || 'Your message could not be sent.';
    return wantsJson ? res.status(500).json({ ok: false, error: errMsg }) : res.status(500).send(errMsg);
  }
});

// Serve static assets from dist/
app.use(express.static(dist, {
  extensions: ['html'],
  redirect: true,
  index: 'index.html',
}));

// Fallback to 404 page
app.use((req, res) => {
  const file404 = path.join(dist, '404.html');
  if (fs.existsSync(file404)) {
    res.status(404).sendFile(file404);
  } else {
    res.status(404).send('Not Found');
  }
});

const server = app.listen(PORT, HOST, () => {
  console.log(`SimplyStylo server running on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error('SimplyStylo server error:', err);
});

process.on('SIGTERM', () => {
  server.close();
});

process.on('SIGINT', () => {
  server.close();
});

