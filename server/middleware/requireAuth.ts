/**
 * server/middleware/requireAuth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Middleware que protege rutas verificando el JWT de Supabase Auth.
 *
 * El cliente (navegador) debe enviar en cada request protegido:
 *   Authorization: Bearer <access_token>
 *
 * Este middleware:
 *   1. Extrae el Bearer token del header Authorization
 *   2. Lo verifica con supabaseAdmin.auth.getUser(token) — server-side
 *   3. Si es válido, adjunta `req.supabaseUser` para uso en los handlers
 *   4. Si no es válido o falta, responde 401
 *
 * FLUJO:
 *   Frontend → obtiene access_token de supabase.auth.getSession()
 *   Frontend → lo envía en Authorization: Bearer <token>
 *   Servidor → verifica el JWT con Supabase (firma, expiración, revocación)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '../supabaseAdmin';

// Extiende el tipo de Request para incluir el usuario verificado
declare global {
  namespace Express {
    interface Request {
      supabaseUser?: User;
    }
  }
}

/**
 * Middleware: requiere JWT válido de Supabase Auth.
 * Protege cualquier ruta en la que se monte.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'No autorizado.',
      detail: 'Debes incluir un token de sesión válido en el header Authorization: Bearer <token>.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    res.status(401).json({ error: 'Token de sesión vacío o inválido.' });
    return;
  }

  // Verificar el token con Supabase (valida firma + expiración + revocación)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    const isExpired =
      error?.message?.includes('expired') || error?.message?.includes('JWT expired');
    res.status(401).json({
      error: isExpired
        ? 'La sesión ha expirado. Por favor inicia sesión nuevamente.'
        : 'Token de sesión inválido o revocado.',
      detail: error?.message,
    });
    return;
  }

  // Adjuntar el usuario verificado al request para uso en los handlers
  req.supabaseUser = user;
  next();
}

/**
 * Middleware: requiere que el usuario autenticado sea Administrador.
 * Debe usarse DESPUÉS de requireAuth.
 *
 * La detección de rol se hace comparando el email con VITE_ADMIN_EMAIL.
 * En un sistema más avanzado, usar `user.app_metadata.role` configurado
 * desde el panel de Supabase o mediante esta misma API.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.supabaseUser;
  const adminEmail = process.env.VITE_ADMIN_EMAIL;

  if (!user) {
    res.status(401).json({ error: 'Usuario no autenticado.' });
    return;
  }

  // Verificar por app_metadata.role (preferido) o por email como fallback
  const roleFromMetadata = user.app_metadata?.role;
  const isAdminByMetadata = roleFromMetadata === 'admin';
  const isAdminByEmail = adminEmail && user.email === adminEmail;

  if (!isAdminByMetadata && !isAdminByEmail) {
    res.status(403).json({
      error: 'Acceso denegado.',
      detail: 'Esta operación requiere privilegios de Administrador (Gerencia).',
    });
    return;
  }

  next();
}
