import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Custom fetch: adds an 8-second timeout and converts the generic
// "Failed to fetch" network error into a descriptive message so
// callers can show a useful UI state instead of a silent failure.
const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
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
        'Cannot reach the database. The Supabase project may be paused — visit app.supabase.com to restore it.'
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: fetchWithTimeout },
})