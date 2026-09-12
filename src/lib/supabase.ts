import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
  throw new Error(
    '[Hotel Gema] Falta la variable de entorno VITE_SUPABASE_URL.\n' +
    'Asegúrate de que existe en tu archivo .env y reinicia el servidor de desarrollo.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    '[Hotel Gema] Falta la variable de entorno VITE_SUPABASE_ANON_KEY.\n' +
    'Cópiala desde: Supabase Dashboard → Project Settings → API → anon / public.'
  );
}

if (import.meta.env.DEV && supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
  const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
  if (payload?.role === 'service_role') {
    console.error(
      '[Hotel Gema] ⚠️  ADVERTENCIA DE SEGURIDAD: Estás usando la SERVICE_ROLE key en el frontend.\n' +
      'Esto expone acceso sin restricciones a tu base de datos. Usa la ANON key en su lugar.'
    );
  }
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {

    persistSession: true,

    autoRefreshToken: true,

    detectSessionInUrl: true,
  },
});

export async function signInWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getActiveSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}
