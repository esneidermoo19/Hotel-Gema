/**
 * supabaseClient.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo cliente de Supabase para Hotel Gema PMS.
 *
 * SEGURIDAD:
 *   - Solo utiliza la ANON_KEY pública (sb_publishable_*).
 *   - Nunca exponer la SERVICE_ROLE key en el frontend.
 *   - Las políticas de Row Level Security (RLS) en Supabase son la única
 *     barrera de acceso real a los datos — mantenlas activas.
 *
 * VARIABLES DE ENTORNO REQUERIDAS (prefijo VITE_ para Vite):
 *   VITE_SUPABASE_URL      → URL del proyecto Supabase
 *   VITE_SUPABASE_ANON_KEY → Clave anónima pública (sb_publishable_...)
 *
 * ROLES SOPORTADOS:
 *   VITE_ADMIN_EMAIL        → Email del perfil Administrador en Supabase Auth
 *   VITE_RECEPTIONIST_EMAIL → Email del perfil Recepcionista en Supabase Auth
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── Validación de variables de entorno ──────────────────────────────────────

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

// Aviso en desarrollo si se detecta una service_role key por error
if (import.meta.env.DEV && supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
  const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
  if (payload?.role === 'service_role') {
    console.error(
      '[Hotel Gema] ⚠️  ADVERTENCIA DE SEGURIDAD: Estás usando la SERVICE_ROLE key en el frontend.\n' +
      'Esto expone acceso sin restricciones a tu base de datos. Usa la ANON key en su lugar.'
    );
  }
}

// ── Creación del cliente ─────────────────────────────────────────────────────

/**
 * Cliente Supabase singleton para toda la aplicación.
 *
 * Usa `supabase.auth.signInWithPassword()` para autenticar usuarios.
 * Usa `supabase.auth.signOut()` para cerrar sesión.
 * Usa `supabase.auth.getSession()` para verificar la sesión activa.
 *
 * @example
 *   import { supabase } from './supabase';
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste la sesión en localStorage (el usuario no cierra sesión al recargar)
    persistSession: true,
    // Refresca el token automáticamente antes de que expire
    autoRefreshToken: true,
    // Detecta el token de la URL después de flujos OAuth o magic links
    detectSessionInUrl: true,
  },
});

// ── Helpers de autenticación ─────────────────────────────────────────────────

/**
 * Inicia sesión con correo y contraseña usando Supabase Auth.
 * Retorna `{ session, user }` en éxito o `error` con mensaje descriptivo.
 *
 * @param email    - Correo registrado en Supabase Auth
 * @param password - Contraseña del usuario
 */
export async function signInWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/**
 * Cierra la sesión activa del usuario actual.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Obtiene la sesión activa actual (si existe).
 * Útil para verificar autenticación al montar la aplicación.
 */
export async function getActiveSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

