/**
 * server/supabaseAdmin.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cliente Supabase con SERVICE_ROLE para uso EXCLUSIVO del servidor.
 *
 * ⚠️  SEGURIDAD CRÍTICA:
 *   - Este módulo NUNCA debe importarse desde src/ (código del navegador).
 *   - La SERVICE_ROLE key ignora todas las políticas RLS.
 *   - Solo úsala para operaciones administrativas legítimas:
 *       • Crear/eliminar usuarios
 *       • Leer datos sin restricciones de RLS (reportes, auditoría)
 *       • Actualizar metadata de usuarios
 *
 * VARIABLE DE ENTORNO REQUERIDA (sin prefijo VITE_ — nunca llega al browser):
 *   SUPABASE_SERVICE_ROLE_KEY → Project Settings → API → service_role (secret)
 * ─────────────────────────────────────────────────────────────────────────────
 */

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

/**
 * Cliente Supabase con privilegios de service_role.
 * Bypassa todas las políticas RLS — usar con extremo cuidado.
 *
 * Disponible ÚNICAMENTE en el servidor (server/).
 * NUNCA importar desde src/ (código del navegador).
 */
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // En el servidor no necesitamos persistir sesiones del service_role
    persistSession: false,
    autoRefreshToken: false,
  },
});
