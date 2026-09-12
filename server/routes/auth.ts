/**
 * server/routes/auth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Router de autenticación para Hotel Gema PMS.
 *
 * ENDPOINTS:
 *   POST /api/auth/login   → Autenticar con email + contraseña
 *   POST /api/auth/logout  → Cerrar sesión del usuario actual
 *   GET  /api/auth/me      → Obtener perfil del usuario autenticado
 *
 * NOTAS DE SEGURIDAD:
 *   - El login delega la autenticación a Supabase Auth (no manejamos contraseñas)
 *   - El servidor verifica que el rol del email corresponda al solicitado
 *   - En producción, considera rate limiting por IP en /api/auth/login
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router, type Request, type Response } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';
import { requireAuth } from '../middleware/requireAuth';

export const authRouter = Router();

// ── POST /api/auth/login ──────────────────────────────────────────────────────
/**
 * Autentica un usuario con email y contraseña.
 *
 * Body esperado:
 *   { email: string, password: string, role: 'admin' | 'receptionist' }
 *
 * Respuesta exitosa:
 *   { access_token, refresh_token, user: { id, email, role } }
 *
 * El servidor verifica que el email pertenezca al rol solicitado
 * antes de intentar el login — capa extra de seguridad sobre el frontend.
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as {
    email?: string;
    password?: string;
    role?: 'admin' | 'receptionist';
  };

  // ── Validación de entrada ───────────────────────────────────────────────────
  if (!email || !password) {
    res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
    return;
  }

  if (!role || !['admin', 'receptionist'].includes(role)) {
    res.status(400).json({
      error: 'El campo "role" es obligatorio y debe ser "admin" o "receptionist".',
    });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();

  // ── Verificación de rol vs email en el servidor ─────────────────────────────
  const adminEmail = (process.env.VITE_ADMIN_EMAIL ?? '').toLowerCase();
  const receptionistEmail = (process.env.VITE_RECEPTIONIST_EMAIL ?? '').toLowerCase();

  if (role === 'admin' && cleanEmail !== adminEmail) {
    res.status(403).json({
      error: 'El correo no corresponde al perfil de Administrador registrado en el sistema.',
    });
    return;
  }

  if (role === 'receptionist' && cleanEmail !== receptionistEmail) {
    res.status(403).json({
      error: 'El correo no corresponde al perfil de Recepcionista registrado en el sistema.',
    });
    return;
  }

  // ── Llamada a Supabase Auth con la ANON KEY (para signIn de usuarios) ───────
  // Nota: signInWithPassword NO requiere service_role — usamos supabaseAdmin
  // solo para la verificación, el sign-in real es un flujo estándar de auth.
  // Aquí lo hacemos server-side para evitar exponer credenciales en el browser.
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error || !data.session) {
    // Mapear errores de Supabase a mensajes en español
    const msg = error?.message ?? '';

    if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
      res.status(401).json({
        error:
          role === 'admin'
            ? 'Contraseña de Administrador incorrecta.'
            : 'Contraseña de Recepcionista incorrecta.',
      });
    } else if (msg.includes('Email not confirmed')) {
      res.status(401).json({
        error: 'La cuenta no ha sido confirmada. Revisa el correo de invitación de Supabase.',
      });
    } else if (msg.includes('rate limit') || msg.includes('too many')) {
      res.status(429).json({
        error: 'Demasiados intentos. Espera unos minutos antes de intentarlo nuevamente.',
      });
    } else {
      res.status(401).json({ error: `Error de autenticación: ${msg || 'Error desconocido.'}` });
    }
    return;
  }

  const { session, user } = data;

  // ── Responder con los tokens y datos del usuario ────────────────────────────
  res.json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    user: {
      id: user.id,
      email: user.email,
      role,
      created_at: user.created_at,
    },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
/**
 * Cierra la sesión del usuario actual.
 * Requiere el Bearer token en Authorization header.
 *
 * Invalida el token en Supabase para que no pueda reutilizarse.
 */
authRouter.post('/logout', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization!.split(' ')[1];

  // signOut con el scope 'local' invalida solo este token (no todos los dispositivos)
  const { error } = await supabaseAdmin.auth.admin.signOut(token);

  if (error) {
    // El logout falla silenciosamente en el cliente de todas formas
    console.warn('[Hotel Gema API] Warning en logout:', error.message);
  }

  res.json({ message: 'Sesión cerrada correctamente.' });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
/**
 * Retorna el perfil completo del usuario autenticado.
 * Requiere el Bearer token en Authorization header.
 *
 * Respuesta:
 *   { id, email, role, created_at, last_sign_in_at }
 */
authRouter.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const user = req.supabaseUser!;

  const adminEmail = (process.env.VITE_ADMIN_EMAIL ?? '').toLowerCase();
  const role = user.email?.toLowerCase() === adminEmail ? 'admin' : 'receptionist';

  res.json({
    id: user.id,
    email: user.email,
    role,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    app_metadata: user.app_metadata,
  });
});
