import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Startup validation: fail fast so misconfiguration is obvious ---
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '[Supabase] FATAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
        'Set both in your .env file before starting the app.'
    );
}

if (!supabaseAnonKey.startsWith('eyJ')) {
    throw new Error(
        '[Supabase] FATAL: VITE_SUPABASE_ANON_KEY looks incorrect — it should start with "eyJ..." (a JWT).\n' +
        'Go to https://supabase.com/dashboard → Project → Settings → API and copy the "anon public" key.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
