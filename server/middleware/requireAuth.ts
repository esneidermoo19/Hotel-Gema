import type { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '../supabaseAdmin';

declare global {
  namespace Express {
    interface Request {
      supabaseUser?: User;
    }
  }
}

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

  req.supabaseUser = user;
  next();
}

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
