import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Startup validation ---
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[Supabase] ❌ MISSING ENVIRONMENT VARIABLES!\n' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
} else if (!supabaseAnonKey.startsWith('eyJ')) {
    console.error(
        '[Supabase] ❌ WRONG KEY FORMAT!\n' +
        'VITE_SUPABASE_ANON_KEY looks incorrect. It should start with "eyJ..." (a JWT token).\n' +
        'Current value starts with: "' + supabaseAnonKey.substring(0, 12) + '..."\n\n' +
        'Fix: Go to https://supabase.com/dashboard → Your Project → Settings → API\n' +
        'Copy the "anon public" key (NOT the service_role key) and paste it into .env'
    );
} else {
    console.log('[Supabase] ✅ Client initialized successfully.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
