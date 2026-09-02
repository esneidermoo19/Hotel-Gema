import React, { useState, useEffect } from 'react';
import { UserRole, ScreenId } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, destination?: ScreenId) => void;
  initialRole?: UserRole;
  authNotice?: string | null;
  isElevating?: boolean;
  onCancelElevation?: () => void;
  targetDestination?: ScreenId | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  initialRole = 'admin',
  authNotice,
  isElevating = false,
  onCancelElevation,
  targetDestination,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [tab, setTab] = useState<'standard' | 'pin'>('standard');
  const [email, setEmail] = useState(
    initialRole === 'admin'
      ? (isElevating ? '' : 'gerencia@orchidhotel.com')
      : 'reception.desk@orchidhotel.com'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
      if (initialRole === 'admin') {
        setEmail(isElevating ? '' : 'gerencia@orchidhotel.com');
        setPassword('');
      } else {
        setEmail('reception.desk@orchidhotel.com');
        setPassword('reception123');
      }
    }
  }, [initialRole, isElevating]);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'admin') {
      setEmail('gerencia@orchidhotel.com');
      setPassword('');
      setPin('');
    } else {
      setEmail('reception.desk@orchidhotel.com');
      setPassword('reception123');
      setPin('');
    }
  };

  const handlePinClick = (num: string) => {
    setErrorMessage(null);
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
          if (selectedRole === 'admin' && nextPin !== '9999') {
            setErrorMessage('PIN de Administrador inválido. Use el código 9999 o sus credenciales.');
            setPin('');
            return;
          }
          onLoginSuccess(selectedRole, targetDestination || undefined);
        }, 300);
      }
    }
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMessage(null);
  };

  const handleDeletePin = () => {
    setPin(pin.slice(0, -1));
    setErrorMessage(null);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Por favor ingresa el usuario o correo del Administrador.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Por favor ingresa la contraseña para autorizar el acceso.');
      return;
    }

    // Validation for admin credentials
    if (selectedRole === 'admin') {
      const isAdminEmail =
        cleanEmail.includes('gerencia') ||
        cleanEmail.includes('admin') ||
        cleanEmail.includes('mendoza') ||
        cleanEmail.includes('@orchidhotel.com');

      if (!isAdminEmail) {
        setErrorMessage(
          'El usuario ingresado no corresponde al perfil de Gerencia / Administrador.'
        );
        return;
      }

      if (cleanPass.length < 3) {
        setErrorMessage('La contraseña ingresada es demasiado corta.');
        return;
      }
    }

    onLoginSuccess(selectedRole, targetDestination || undefined);
  };

  const fillAdminDemo = () => {
    setSelectedRole('admin');
    setTab('standard');
    setEmail('gerencia@orchidhotel.com');
    setPassword('admin123');
    setErrorMessage(null);
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
            ORCHID <span className="text-[#004ac6] font-light">HOTEL</span>
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-[#545f73] font-semibold mt-0.5">
            Operations Portal & Executive PMS
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

        {/* Tab Toggle: Standard / Quick PIN */}
        <div className="flex bg-[#f2f4f6] p-1 rounded-2xl mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setTab('standard');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'standard'
                ? 'bg-white text-[#004ac6] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">key</span>
            <span>Usuario y Contraseña</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('pin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'pin'
                ? 'bg-white text-[#004ac6] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dialpad</span>
            <span>PIN Rápido</span>
          </button>
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

        {/* Tab 1: Standard Login */}
        {tab === 'standard' && (
          <form onSubmit={handleStandardSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Usuario o Correo ({selectedRole === 'admin' ? 'Administrador' : 'Recepción'})
                </label>
                {selectedRole === 'admin' && (
                  <button
                    type="button"
                    onClick={fillAdminDemo}
                    className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Rellenar Demo Admin</span>
                    <span className="material-symbols-outlined text-xs">bolt</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  account_circle
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'gerencia@orchidhotel.com'
                      : 'reception.desk@orchidhotel.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition"
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
                  placeholder={selectedRole === 'admin' ? 'Ingresa la contraseña de admin' : 'Contraseña'}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition"
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
              {selectedRole === 'admin' && (
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-amber-500">info</span>
                  <span>Demo: usuario <strong className="text-slate-600">gerencia@orchidhotel.com</strong> / clave <strong className="text-slate-600">admin123</strong></span>
                </p>
              )}
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
              className={`w-full mt-2 font-bold py-3 px-4 rounded-xl text-xs shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-white ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/20'
                  : 'bg-[#004ac6] hover:bg-[#2563eb] shadow-blue-600/20'
              }`}
            >
              <span>
                {selectedRole === 'admin'
                  ? (isElevating ? 'Verificar y Activar Modo Administrador' : 'Entrar con Privilegios de Administrador')
                  : 'Iniciar Turno como Recepcionista'}
              </span>
              <span className="material-symbols-outlined text-base">
                {isElevating ? 'verified_user' : 'login'}
              </span>
            </button>
          </form>
        )}

        {/* Tab 2: Quick PIN Pad */}
        {tab === 'pin' && (
          <div className="flex flex-col items-center">
            <p className="text-xs text-slate-500 mb-2">
              Código PIN para {selectedRole === 'admin' ? 'Ing. Mendoza (9999)' : 'Sofía Ramírez (1234)'}
            </p>
            {/* PIN indicators */}
            <div className="flex items-center gap-4 mb-5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pin.length > i
                      ? selectedRole === 'admin'
                        ? 'bg-amber-500 scale-110 shadow-sm'
                        : 'bg-[#004ac6] scale-110 shadow-sm'
                      : 'bg-slate-200 border border-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinClick(digit)}
                  className="w-full py-3.5 rounded-2xl bg-[#f8fafc] hover:bg-blue-50 text-[#191c1e] text-lg font-bold border border-slate-200 hover:border-blue-300 transition active:scale-95 shadow-xs cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="w-full py-3.5 rounded-2xl bg-[#f8fafc] hover:bg-slate-200 text-xs font-bold text-slate-500 border border-slate-200 transition active:scale-95 cursor-pointer"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handlePinClick('0')}
                className="w-full py-3.5 rounded-2xl bg-[#f8fafc] hover:bg-blue-50 text-[#191c1e] text-lg font-bold border border-slate-200 hover:border-blue-300 transition active:scale-95 shadow-xs cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeletePin}
                className="w-full py-3.5 rounded-2xl bg-[#f8fafc] hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center justify-center transition active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">backspace</span>
              </button>
            </div>

            {onCancelElevation && isElevating && (
              <button
                type="button"
                onClick={onCancelElevation}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold mb-2"
              >
                ← Cancelar y volver a Recepción
              </button>
            )}

            <button
              type="button"
              onClick={() => onLoginSuccess(selectedRole, targetDestination || undefined)}
              className="text-xs text-[#004ac6] font-bold hover:underline mt-1 cursor-pointer"
            >
              Autenticar y entrar directo →
            </button>
          </div>
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


