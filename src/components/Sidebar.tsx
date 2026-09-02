import React from 'react';
import { ScreenId, UserProfile } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  currentUser: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  onToggleRole: () => void;
  onRequestAdminAccess?: (destination?: ScreenId) => void;
  reservationCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  currentUser,
  onNavigate,
  onLogout,
  onToggleRole,
  onRequestAdminAccess,
  reservationCount = 12
}) => {
  const isAdmin = currentUser.role === 'admin';

  const navItems: { id: ScreenId; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'room-rack', label: 'Room Rack', icon: 'grid_view' },
    { id: 'reservas', label: 'Reservas', icon: 'calendar_month', badge: reservationCount },
    { id: 'habitaciones', label: 'Habitaciones', icon: 'hotel' },
    { id: 'huespedes', label: 'Huéspedes', icon: 'group' },
    { id: 'pos', label: 'Punto de Venta', icon: 'point_of_sale' },
    { id: 'facturacion', label: 'Facturación y Cierre', icon: 'receipt_long' },
    { id: 'reportes', label: 'Reportes y KPI', icon: 'analytics' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none transition-all duration-200"
    >
      {/* Top Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="material-symbols-outlined text-[24px]">spa</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-wide flex items-center gap-1.5">
              ORCHID <span className="text-blue-400 font-light">HOTEL</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">Operations Portal</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 mt-2">
          {/* Executive Section Header for Admin */}
          <div className="px-3 flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              {isAdmin ? 'Dirección y Gerencia' : 'Módulos Operativos'}
            </p>
            {isAdmin && (
              <span className="text-[9px] bg-amber-400/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-400/30">
                SUPER ADMIN
              </span>
            )}
          </div>

          {/* Special Admin Exclusive Tab */}
          <button
            id="nav-item-panel-admin"
            onClick={() => {
              if (isAdmin) {
                onNavigate('panel-admin');
              } else {
                if (onRequestAdminAccess) {
                  onRequestAdminAccess('panel-admin');
                } else {
                  onToggleRole();
                }
              }
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentScreen === 'panel-admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : isAdmin
                ? 'text-amber-300 hover:text-white hover:bg-slate-800/90 border border-amber-500/30 bg-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-amber-400">
                admin_panel_settings
              </span>
              <span>Consola Gerencia</span>
            </div>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                currentScreen === 'panel-admin'
                  ? 'bg-slate-950 text-amber-400'
                  : isAdmin
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {isAdmin ? 'ADMIN' : 'BLOQUEADO'}
            </span>
          </button>

          <div className="pt-2 pb-1">
            <p className="px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Operación General
            </p>
          </div>

          {navItems.map((item) => {
            const isActive = currentScreen === item.id || (item.id === 'reservas' && currentScreen === 'nueva-reserva');
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom area */}
      <div className="p-3 border-t border-slate-700/60 space-y-2">
        {/* Quick Role Switcher Button */}
        <button
          id="btn-toggle-role"
          onClick={() => {
            if (isAdmin) {
              onToggleRole();
            } else {
              if (onRequestAdminAccess) {
                onRequestAdminAccess('dashboard');
              } else {
                onToggleRole();
              }
            }
          }}
          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
            isAdmin
              ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
              : 'bg-blue-500/15 border-blue-400/30 text-blue-300 hover:bg-blue-500/25'
          }`}
          title="Alternar entre Administrador y Recepcionista para comparar ventajas"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">
              {isAdmin ? 'switch_account' : 'manage_accounts'}
            </span>
            <span>{isAdmin ? 'Ver como Recepción' : 'Activar Modo Administrador'}</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase">
            {isAdmin ? 'ADMIN' : 'RECEPCIÓN'}
          </span>
        </button>

        {/* Quick jump to Login Screen */}
        <button
          id="btn-quick-login-view"
          onClick={() => onNavigate('login')}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          title="Ver pantalla de inicio de sesión"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Pantalla de Login</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">Acceso</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-600"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#1E293B] ${
                  isAdmin ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
              />
            </div>
            <div className="truncate text-left">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                {isAdmin && (
                  <span className="text-amber-400 material-symbols-outlined text-[14px]">
                    verified
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.roleTitle}</p>
            </div>
          </div>
          <button
            id="btn-logout"
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-lg transition"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

