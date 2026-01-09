import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias');
}

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const timeoutMs = 15000;
  const controller = new AbortController();
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const mergedInit: RequestInit = { ...(init || {}) };

    if (mergedInit.signal) {
      const signal = mergedInit.signal;
      if (signal.aborted) throw new DOMException('The operation was aborted.', 'AbortError');
      signal.addEventListener('abort', () => controller.abort(), { once: true });
      delete mergedInit.signal;
    }

    return await fetch(input, { ...mergedInit, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: fetchWithTimeout,
    headers: {
      apikey: supabaseKey,
    },
  },
});
