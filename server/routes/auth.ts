import { Router, type Request, type Response } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';
import { requireAuth } from '../middleware/requireAuth';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as {
    email?: string;
    password?: string;
    role?: 'admin' | 'receptionist';
  };

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

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error || !data.session) {

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

authRouter.post('/logout', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization!.split(' ')[1];

  const { error } = await supabaseAdmin.auth.admin.signOut(token);

  if (error) {

    console.warn('[Hotel Gema API] Warning en logout:', error.message);
  }

  res.json({ message: 'Sesión cerrada correctamente.' });
});

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
