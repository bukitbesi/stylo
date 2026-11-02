// Cloudflare Worker entry. Only /api/* reaches this script (assets.run_worker_first in wrangler.jsonc); every other
// request is served straight from the static assets, which stay free and unlimited.
import { EmailMessage } from 'cloudflare:email';
import { handle } from './contact.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handle(request, env, EmailMessage);
    return new Response('Not found', { status: 404 });
  }
};
