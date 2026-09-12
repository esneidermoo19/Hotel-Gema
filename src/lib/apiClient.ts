import type { UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

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

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {

    const apiError = data as ApiError;
    throw new Error(apiError.error ?? `Error HTTP ${response.status}`);
  }

  return data as T;
}

const auth = {

  login: (email: string, password: string, role: UserRole): Promise<LoginResponse> =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  logout: (accessToken: string): Promise<{ message: string }> =>
    apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' }, accessToken),

  me: (accessToken: string): Promise<ApiUser> =>
    apiFetch<ApiUser>('/api/auth/me', { method: 'GET' }, accessToken),

  healthCheck: (): Promise<{ status: string; service: string }> =>
    apiFetch('/api/health'),
};

const admin = {

  listUsers: (accessToken: string): Promise<{ users: ApiUser[]; total: number }> =>
    apiFetch<{ users: ApiUser[]; total: number }>('/api/admin/users', { method: 'GET' }, accessToken),

  createUser: (
    accessToken: string,
    userData: { email: string; password: string; role: UserRole; name?: string }
  ): Promise<{ message: string; user: Pick<ApiUser, 'id' | 'email' | 'role' | 'created_at'> }> =>
    apiFetch(
      '/api/admin/users/create',
      { method: 'POST', body: JSON.stringify(userData) },
      accessToken
    ),

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

  deleteUser: (
    accessToken: string,
    uid: string
  ): Promise<{ message: string }> =>
    apiFetch(`/api/admin/users/${uid}`, { method: 'DELETE' }, accessToken),
};

export const apiClient = { auth, admin };
