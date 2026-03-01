/**
 * Cloudflare Worker — Supabase Reverse Proxy
 *
 * Forwards all requests to your Supabase project so users whose ISP
 * blocks supabase.co can still reach the API through this worker URL.
 *
 * Deploy with:
 *   npm install -g wrangler
 *   wrangler login
 *   wrangler deploy
 */

const SUPABASE_URL = 'https://aycqooqlvlfgwwngmlyy.supabase.co';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, apikey, content-type, x-client-info, prefer, ' +
    'range, range-unit, accept-profile, content-profile, x-supabase-api-version',
  'Access-Control-Expose-Headers':
    'Content-Encoding, Content-Location, Content-Range, Content-Type, ' +
    'Date, Location, Server, Transfer-Encoding, Range-Unit',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const targetUrl = SUPABASE_URL + url.pathname + url.search;

    // Forward request to Supabase, preserving all headers and body
    const supabaseRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    });

    try {
      const response = await fetch(supabaseRequest);

      // Copy response headers and override CORS headers
      const newHeaders = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Proxy error', message: err.message }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        }
      );
    }
  },
};
