import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Optional Cloudflare Worker proxy — set VITE_SUPABASE_PROXY_URL after
// deploying cloudflare-worker/ to route traffic around ISP blocks.
const proxyUrl: string | undefined = import.meta.env.VITE_SUPABASE_PROXY_URL || undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/** Perform a single fetch attempt with an 8-second timeout. */
const timedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Custom fetch that:
 * 1. Tries the Cloudflare Worker proxy first (when VITE_SUPABASE_PROXY_URL is set).
 * 2. Automatically falls back to direct Supabase if the proxy fails
 *    (SSL error, network block, timeout, etc.).
 * 3. Converts the generic "Failed to fetch" into a human-readable error.
 */
const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const rawUrl = input instanceof Request ? input.url : input.toString();

  // --- Try proxy first ---
  if (proxyUrl && rawUrl.startsWith(supabaseUrl)) {
    const proxied = proxyUrl.replace(/\/$/, '') + rawUrl.slice(supabaseUrl.length);
    const proxiedInput = input instanceof Request ? new Request(proxied, input) : proxied;
    try {
      const res = await timedFetch(proxiedInput, init);
      return res;
    } catch {
      // Proxy failed (SSL mismatch, ISP block, timeout) — fall through to direct
      console.warn('[supabase] Proxy unreachable, retrying direct…');
    }
  }

  // --- Direct Supabase (fallback or no proxy configured) ---
  try {
    return await timedFetch(input, init);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your internet connection.');
    }
    if (
      err.message === 'Failed to fetch' ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('network')
    ) {
      throw new Error(
        'Cannot reach the database. Your network may be blocking the connection.'
      );
    }
    throw err;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: fetchWithTimeout },
})