// src/lib/supabase.ts
// Single source of truth for the Supabase client.
//
// - Creates the real client synchronously when BOTH env vars are present.
//   (Previously this used an async dynamic import that never resolved before
//   export, so "supabase" was always the mock even when credentials existed —
//   that is fixed here.)
// - When credentials are missing we export `null` and `isSupabaseConfigured =
//   false`, so every service can degrade gracefully (explicit error logging +
//   a friendly return) instead of silently failing.
//
// Required env vars (see .env.example):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

if (!isSupabaseConfigured) {
  console.error(
    "Supabase Error: missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Running without persistence — bookings will NOT be saved or synced to /admin."
  );
}
