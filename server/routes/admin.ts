import { Router, type Request, type Response } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';
import { requireAuth, requireAdmin } from '../middleware/requireAuth';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/users', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (error) {
    res.status(500).json({ error: `Error al obtener usuarios: ${error.message}` });
    return;
  }

  const adminEmail = (process.env.VITE_ADMIN_EMAIL ?? '').toLowerCase();

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.email?.toLowerCase() === adminEmail ? 'admin' : 'receptionist',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    email_confirmed: !!u.email_confirmed_at,
    app_metadata: u.app_metadata,
  }));

  res.json({ users, total: users.length });
});

adminRouter.post('/users/create', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role, name } = req.body as {
    email?: string;
    password?: string;
    role?: 'admin' | 'receptionist';
    name?: string;
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

  if (password.length < 8) {
    res.status(400).json({
      error: 'La contraseña debe tener al menos 8 caracteres.',
    });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: {
      name: name ?? '',
      role,
    },
    app_metadata: {
      role,
    },
  });

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      res.status(409).json({
        error: `Ya existe un usuario con el correo ${email}. Usa un correo diferente.`,
      });
    } else {
      res.status(500).json({ error: `Error al crear usuario: ${error.message}` });
    }
    return;
  }

  res.status(201).json({
    message: `Usuario ${role === 'admin' ? 'Administrador' : 'Recepcionista'} creado exitosamente.`,
    user: {
      id: data.user.id,
      email: data.user.email,
      role,
      created_at: data.user.created_at,
    },
  });
});

adminRouter.patch('/users/:uid', async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const { email, password, name, role } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    role?: 'admin' | 'receptionist';
  };

  if (!uid) {
    res.status(400).json({ error: 'El ID del usuario (uid) es obligatorio.' });
    return;
  }

  const updatePayload: Parameters<typeof supabaseAdmin.auth.admin.updateUserById>[1] = {};

  if (email) updatePayload.email = email.trim().toLowerCase();
  if (password) {
    if (password.length < 8) {
      res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    updatePayload.password = password;
  }
  if (name || role) {
    updatePayload.user_metadata = { ...(name && { name }), ...(role && { role }) };
    if (role) {
      updatePayload.app_metadata = { role };
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    res.status(400).json({
      error: 'Debes enviar al menos un campo para actualizar (email, password, name o role).',
    });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(uid, updatePayload);

  if (error) {
    res.status(500).json({ error: `Error al actualizar usuario: ${error.message}` });
    return;
  }

  res.json({
    message: 'Usuario actualizado correctamente.',
    user: {
      id: data.user.id,
      email: data.user.email,
      app_metadata: data.user.app_metadata,
      updated_at: data.user.updated_at,
    },
  });
});

adminRouter.delete('/users/:uid', async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const requestingUser = req.supabaseUser!;

  if (!uid) {
    res.status(400).json({ error: 'El ID del usuario (uid) es obligatorio.' });
    return;
  }

  if (uid === requestingUser.id) {
    res.status(400).json({
      error: 'No puedes eliminar tu propia cuenta de Administrador desde esta interfaz.',
    });
    return;
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);

  if (error) {
    res.status(500).json({ error: `Error al eliminar usuario: ${error.message}` });
    return;
  }

  res.json({ message: `Usuario ${uid} eliminado correctamente del sistema.` });
});
