const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in mock mode.');
}

// Mock Supabase client for when credentials are not available
const mockSupabase = {
  from: (_table: string) => {
    return {
      select: () => ({
        eq: () => ({
          neq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Mock mode - no Supabase credentials' } })
        })
      })
    };
  }
};

// Try to load the real Supabase client dynamically
let realSupabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  // @ts-ignore
  import('@supabase/supabase-js').then((module) => {
    realSupabase = module.createClient(supabaseUrl, supabaseAnonKey);
  }).catch((err) => {
    console.error('Failed to load Supabase client:', err);
  });
}

export const supabase = realSupabase || mockSupabase;
