import React, { useState, useEffect } from 'react';
import { UserRole, ScreenId } from '../types';
import { supabase } from '../supabase';

// Backend API URL — falls back to localhost in development
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, destination?: ScreenId) => void;
  initialRole?: UserRole;
  authNotice?: string | null;
  isElevating?: boolean;
  onCancelElevation?: () => void;
  targetDestination?: ScreenId | null;
}

// Emails configured in Supabase Auth (must match exactly)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;
const RECEPTIONIST_EMAIL = import.meta.env.VITE_RECEPTIONIST_EMAIL as string;

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  initialRole = 'admin',
  authNotice,
  isElevating = false,
  onCancelElevation,
  targetDestination,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
      setEmail('');
      setPassword('');
      setErrorMessage(null);
    }
  }, [initialRole, isElevating]);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setErrorMessage(null);
  };

  // --- Login via Express API (server-side Supabase auth — no secret keys in browser) ---
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Por favor completa el usuario y la contraseña.');
      setIsLoading(false);
      return;
    }

    // Verify the entered email matches the selected role (client-side pre-check)
    const expectedEmail = selectedRole === 'admin' ? ADMIN_EMAIL : RECEPTIONIST_EMAIL;
    if (cleanEmail !== expectedEmail?.toLowerCase()) {
      setErrorMessage(
        selectedRole === 'admin'
          ? 'El correo ingresado no corresponde al perfil de Administrador.'
          : 'El correo ingresado no corresponde al perfil de Recepcionista.'
      );
      setIsLoading(false);
      return;
    }

    // ── Llamada al backend Express (/api/auth/login) ────────────────────────
    // La autenticación real ocurre en el servidor — nunca exponemos la service_role
    // key en el navegador. El servidor retorna los tokens JWT que usamos para
    // inicializar la sesión local del cliente Supabase.
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPass,
          role: selectedRole,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        // The server returns a localised error message in payload.error
        const serverMsg: string = payload?.error ?? '';
        const isAdmin = selectedRole === 'admin';

        if (response.status === 429) {
          setErrorMessage(
            'Demasiados intentos de inicio de sesión. Espera unos minutos antes de intentarlo nuevamente.'
          );
        } else if (response.status === 403) {
          setErrorMessage(
            isAdmin
              ? 'El correo ingresado no corresponde al perfil de Administrador.'
              : 'El correo ingresado no corresponde al perfil de Recepcionista.'
          );
        } else if (serverMsg.includes('Email not confirmed') || serverMsg.includes('confirmada')) {
          setErrorMessage(
            'La cuenta aún no ha sido confirmada. Revisa el correo de invitación enviado por Supabase y haz clic en el enlace de activación.'
          );
        } else if (
          serverMsg.includes('incorrecta') ||
          serverMsg.includes('Invalid') ||
          serverMsg.includes('invalid_credentials') ||
          response.status === 401
        ) {
          setErrorMessage(
            isAdmin
              ? 'Credenciales de Administrador incorrectas. Verifica el correo y la contraseña de Gerencia.'
              : 'Credenciales de Recepcionista incorrectas. Verifica tu correo y contraseña de turno.'
          );
        } else {
          setErrorMessage(serverMsg || 'Error de autenticación. Intenta nuevamente.');
        }
        setIsLoading(false);
        return;
      }

      // ── Éxito: hidratamos la sesión en el cliente Supabase ──────────────
      // Esto permite que supabase.auth.getSession() funcione normalmente
      // y que onAuthStateChange dispare el evento SIGNED_IN.
      const { access_token, refresh_token } = payload as {
        access_token: string;
        refresh_token: string;
      };

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
      }

      setIsLoading(false);
      onLoginSuccess(selectedRole, targetDestination || undefined);

    } catch (networkErr) {
      // El servidor Express no está disponible (CORS, red, etc.)
      setIsLoading(false);
      const errMsg = networkErr instanceof Error ? networkErr.message : '';
      if (
        errMsg.includes('Failed to fetch') ||
        errMsg.includes('NetworkError') ||
        errMsg.includes('fetch')
      ) {
        setErrorMessage(
          `Sin conexión al servidor API (${API_URL}). Asegúrate de que el servidor Express esté corriendo con: npm run server:dev`
        );
      } else {
        setErrorMessage('Error de conexión desconocido. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000" />

      {/* Main Login Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-7 sm:p-8 z-10 transition-all">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-600/30 mb-2.5">
            <span className="material-symbols-outlined text-[30px]">spa</span>
          </div>
          <h1 className="text-2xl font-black text-[#191c1e] tracking-tight">
            HOTEL <span className="text-[#004ac6] font-light">GEMA</span>
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-[#545f73] font-semibold mt-0.5">
            Portal Operativo • Sistema PMS
          </p>
        </div>

        {/* Security Alert Banner when elevating from Reception */}
        {isElevating && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    Autenticación de Administrador Requerida
                  </h3>
                  <span className="text-[9px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full uppercase">
                    Seguridad
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  {authNotice ||
                    'Has solicitado activar el Modo Administrador desde la sesión de Recepción. Ingresa el usuario y contraseña del Gerente General para autorizar la elevación de privilegios.'}
                </p>
              </div>
            </div>

            {onCancelElevation && (
              <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-800">
                  ¿Acceso por error?
                </span>
                <button
                  type="button"
                  onClick={onCancelElevation}
                  className="text-xs font-bold text-amber-950 hover:text-black flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Cancelar y volver a Recepción</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Selection Tabs with Distinct Advantage Previews */}
        <div className="mb-5 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">
            {isElevating ? 'Rol a Autenticar' : 'Selecciona Perfil de Acceso'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Admin Profile Choice */}
            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`p-3 rounded-2xl border text-left transition relative cursor-pointer ${
                selectedRole === 'admin'
                  ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-base text-amber-600">
                  admin_panel_settings
                </span>
                <span className="text-xs font-black text-slate-900">Administrador</span>
                {selectedRole === 'admin' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <p className="text-[11px] font-bold text-amber-900">Ing. Roberto Mendoza</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                Yield, tarifas, P&L, auditoría y control total.
              </p>
              <span className="inline-block mt-1.5 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                + VENTAJAS TOTALES
              </span>
            </button>

            {/* Receptionist Profile Choice */}
            <button
              type="button"
              onClick={() => handleSelectRole('receptionist')}
              className={`p-3 rounded-2xl border text-left transition relative cursor-pointer ${
                selectedRole === 'receptionist'
                  ? 'border-blue-400 bg-blue-50/70 shadow-sm ring-2 ring-blue-400/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-base text-[#004ac6]">
                  badge
                </span>
                <span className="text-xs font-black text-slate-900">Recepcionista</span>
                {selectedRole === 'receptionist' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <p className="text-[11px] font-bold text-blue-900">Sofía Ramírez</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                Check-in, Check-out, Room Rack y caja POS.
              </p>
              <span className="inline-block mt-1.5 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900">
                NIVEL OPERATIVO
              </span>
            </button>
          </div>
        </div>


        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 animate-in fade-in">
            <span className="material-symbols-outlined text-base text-rose-600 shrink-0">
              error
            </span>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Standard Login */}
        {(
          <form onSubmit={handleStandardSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Correo Electrónico ({selectedRole === 'admin' ? 'Administrador' : 'Recepción'})
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  account_circle
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'correo@dominio.com'
                      : 'correo@dominio.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Contraseña</label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {selectedRole === 'admin' ? 'Clave de Gerencia' : 'Clave de Turno'}
                </span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder={selectedRole === 'admin' ? 'Contraseña de Administrador' : 'Contraseña de Recepcionista'}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004ac6] border-slate-300 focus:ring-[#004ac6]"
                />
                <span>Recordar este equipo</span>
              </label>

              {onCancelElevation && isElevating && (
                <button
                  type="button"
                  onClick={onCancelElevation}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Volver a Recepción
                </button>
              )}
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              disabled={isLoading}
              className={`w-full mt-2 font-bold py-3 px-4 rounded-xl text-xs shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-white disabled:opacity-70 disabled:cursor-not-allowed ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/20'
                  : 'bg-[#004ac6] hover:bg-[#2563eb] shadow-blue-600/20'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedRole === 'admin'
                      ? (isElevating ? 'Verificar y Activar Modo Administrador' : 'Entrar con Privilegios de Administrador')
                      : 'Iniciar Turno como Recepcionista'}
                  </span>
                  <span className="material-symbols-outlined text-base">
                    {isElevating ? 'verified_user' : 'login'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info & server sync */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 font-medium">Servidor PMS Sincronizado</span>
          </div>
          <span>PMS v4.5 Enterprise • Multi-Role</span>
        </div>
      </div>
    </div>
  );
};


