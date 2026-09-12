import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    '[Hotel Gema Server] Faltan variables de entorno del servidor:\n' +
    '  VITE_SUPABASE_URL           → URL del proyecto Supabase\n' +
    '  SUPABASE_SERVICE_ROLE_KEY   → Clave service_role (Dashboard → API)'
  );
}

export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {

    persistSession: false,
    autoRefreshToken: false,
  },
});
