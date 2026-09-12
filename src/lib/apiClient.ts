/**
 * src/lib/apiClient.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cliente HTTP para comunicarse con la API Express de Hotel Gema.
 *
 * El navegador NUNCA usa la service_role key directamente.
 * En su lugar, envía el access_token de Supabase al backend Express,
 * quien lo verifica y ejecuta operaciones privilegiadas de forma segura.
 *
 * USO:
 *   import { apiClient } from '../lib/apiClient';
 *
 *   // Login a través del backend (el server valida el rol)
 *   const result = await apiClient.auth.login(email, password, 'admin');
 *
 *   // Operaciones de admin (requieren token JWT en Authorization header)
 *   const users = await apiClient.admin.listUsers(accessToken);
 *   await apiClient.admin.createUser(accessToken, { email, password, role });
 *   await apiClient.admin.deleteUser(accessToken, uid);
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { UserRole } from '../types';

// ── URL base del servidor Express ─────────────────────────────────────────────
// En desarrollo: http://localhost:4000
// En producción: la misma URL de la app (el servidor sirve /api/*)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// ── Tipos de respuesta de la API ──────────────────────────────────────────────

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
  };
}

export interface ApiUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  app_metadata: Record<string, unknown>;
}

export interface ApiError {
  error: string;
  detail?: string;
}

// ── Helper interno: fetch con manejo de errores ───────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Adjuntar el JWT del usuario si se proporciona
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanzar el mensaje de error del servidor para que el componente lo muestre
    const apiError = data as ApiError;
    throw new Error(apiError.error ?? `Error HTTP ${response.status}`);
  }

  return data as T;
}

// ── Módulo de autenticación ───────────────────────────────────────────────────

const auth = {
  /**
   * Autentica un usuario a través del backend Express.
   * El servidor valida el rol y retorna los tokens de sesión.
   *
   * @param email    - Correo del usuario
   * @param password - Contraseña del usuario
   * @param role     - Rol solicitado: 'admin' | 'receptionist'
   * @returns Tokens de sesión + datos básicos del usuario
   * @throws Error con mensaje en español si falla
   */
  login: (email: string, password: string, role: UserRole): Promise<LoginResponse> =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  /**
   * Cierra la sesión del usuario actual e invalida el token en Supabase.
   *
   * @param accessToken - JWT activo del usuario
   */
  logout: (accessToken: string): Promise<{ message: string }> =>
    apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' }, accessToken),

  /**
   * Obtiene el perfil completo del usuario autenticado.
   *
   * @param accessToken - JWT activo del usuario
   */
  me: (accessToken: string): Promise<ApiUser> =>
    apiFetch<ApiUser>('/api/auth/me', { method: 'GET' }, accessToken),

  /**
   * Verifica si el servidor API está disponible.
   */
  healthCheck: (): Promise<{ status: string; service: string }> =>
    apiFetch('/api/health'),
};

// ── Módulo de administración de usuarios ─────────────────────────────────────

const admin = {
  /**
   * Lista todos los usuarios registrados en el sistema.
   * Requiere token de Administrador.
   *
   * @param accessToken - JWT activo del Administrador
   */
  listUsers: (accessToken: string): Promise<{ users: ApiUser[]; total: number }> =>
    apiFetch<{ users: ApiUser[]; total: number }>('/api/admin/users', { method: 'GET' }, accessToken),

  /**
   * Crea un nuevo usuario en Supabase Auth.
   * La cuenta se crea confirmada (sin enviar email de verificación).
   *
   * @param accessToken - JWT activo del Administrador
   * @param userData    - Datos del nuevo usuario
   */
  createUser: (
    accessToken: string,
    userData: { email: string; password: string; role: UserRole; name?: string }
  ): Promise<{ message: string; user: Pick<ApiUser, 'id' | 'email' | 'role' | 'created_at'> }> =>
    apiFetch(
      '/api/admin/users/create',
      { method: 'POST', body: JSON.stringify(userData) },
      accessToken
    ),

  /**
   * Actualiza datos de un usuario existente.
   * Campos opcionales: email, password, name, role.
   *
   * @param accessToken - JWT activo del Administrador
   * @param uid         - ID del usuario en Supabase Auth
   * @param updates     - Campos a actualizar
   */
  updateUser: (
    accessToken: string,
    uid: string,
    updates: { email?: string; password?: string; name?: string; role?: UserRole }
  ): Promise<{ message: string; user: Partial<ApiUser> }> =>
    apiFetch(
      `/api/admin/users/${uid}`,
      { method: 'PATCH', body: JSON.stringify(updates) },
      accessToken
    ),

  /**
   * Elimina permanentemente un usuario del sistema.
   * ⚠️  Operación irreversible.
   *
   * @param accessToken - JWT activo del Administrador
   * @param uid         - ID del usuario en Supabase Auth
   */
  deleteUser: (
    accessToken: string,
    uid: string
  ): Promise<{ message: string }> =>
    apiFetch(`/api/admin/users/${uid}`, { method: 'DELETE' }, accessToken),
};

// ── Exportación del cliente ───────────────────────────────────────────────────

export const apiClient = { auth, admin };
