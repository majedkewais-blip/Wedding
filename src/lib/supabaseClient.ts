'use client';
import { createClient } from '@supabase/supabase-js';

// Fallbacks keep the build's prerender from throwing when env is absent.
// At runtime on your deployment, the real NEXT_PUBLIC_* values are used.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true }
});
