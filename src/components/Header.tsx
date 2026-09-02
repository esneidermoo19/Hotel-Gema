import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  currentUser: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenNewBooking: () => void;
  onToggleRole: () => void;
  onRequestAdminAccess?: (destination?: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  currentUser,
  onNavigate,
  onOpenNewBooking,
  onToggleRole,
  onRequestAdminAccess,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = currentUser.role === 'admin';

  const screenTitles: Record<ScreenId, { title: string; subtitle: string }> = {
    'login': { title: 'Acceso Seguro', subtitle: 'Portal de autenticación de personal' },
    'dashboard': { title: 'Dashboard General', subtitle: 'Resumen operativo en tiempo real' },
    'room-rack': { title: 'Room Rack', subtitle: 'Matriz visual de ocupación semanal' },
    'reservas': { title: 'Gestión de Reservas', subtitle: 'Control de check-ins, check-outs y solicitudes' },
    'nueva-reserva': { title: 'Nueva Reserva', subtitle: 'Asistente de registro paso a paso' },
    'habitaciones': { title: 'Estado de Habitaciones', subtitle: 'Monitoreo de limpieza, ocupación y mantenimiento' },
    'huespedes': { title: 'Directorio de Huéspedes', subtitle: 'Fichas de clientes, historial de visitas y perfiles VIP' },
    'pos': { title: 'Punto de Venta (POS)', subtitle: 'Cargos directos a habitaciones y consumos' },
    'facturacion': { title: 'Facturación y Cierre de Turno', subtitle: 'Corte de caja, comprobantes fiscales e ingresos' },
    'reportes': { title: 'Reportes y Métricas KPI', subtitle: 'Análisis de RevPAR, ADR y ocupación histórica' },
    'panel-admin': { title: 'Consola de Gerencia y Control Estratégico', subtitle: 'Ventajas exclusivas: Yield management, auditoría, personal y P&L' },
  };

  const currentInfo = screenTitles[currentScreen] || { title: 'Orchid Hotel', subtitle: 'PMS' };

  return (
    <header
      id="main-header"
      className="h-16 bg-white border-b border-[#e0e3e5] px-6 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Title & context */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-[#191c1e] leading-tight flex items-center gap-2">
            {currentInfo.title}
            {currentScreen === 'panel-admin' && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300 uppercase">
                Admin Only
              </span>
            )}
          </h2>
          <p className="text-xs text-[#545f73] hidden sm:block">{currentInfo.subtitle}</p>
        </div>
      </div>

      {/* Center Search bar */}
      <div className="relative hidden md:flex items-center w-64 lg:w-80">
        <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar reserva, habitación o huésped..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#f2f4f6] border border-[#e0e3e5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white text-[#191c1e] placeholder-slate-400 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Mode Badge & Switcher Pill */}
        <button
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs cursor-pointer ${
            isAdmin
              ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300 text-amber-900 hover:bg-amber-100'
              : 'bg-blue-50 border-blue-200 text-[#004ac6] hover:bg-blue-100'
          }`}
          title={isAdmin ? "Haz clic para cambiar a Modo Recepción" : "Haz clic para autenticarte y activar Modo Administrador"}
        >
          <span className="material-symbols-outlined text-sm">
            {isAdmin ? 'admin_panel_settings' : 'badge'}
          </span>
          <span className="hidden sm:inline">
            {isAdmin ? 'Modo Gerente General' : 'Modo Recepción'}
          </span>
          <span className="text-[10px] uppercase font-black bg-white px-1.5 py-0.5 rounded shadow-2xs">
            {isAdmin ? 'Super Admin' : 'Operativo'}
          </span>
        </button>

        {/* Quick Screen Switcher Pill Dropdown */}
        <div className="flex items-center bg-[#f2f4f6] p-1 rounded-xl border border-[#e0e3e5]">
          <select
            value={currentScreen}
            onChange={(e) => {
              const target = e.target.value as ScreenId;
              if (target === 'panel-admin' && !isAdmin) {
                if (onRequestAdminAccess) {
                  onRequestAdminAccess('panel-admin');
                } else {
                  onNavigate(target);
                }
              } else {
                onNavigate(target);
              }
            }}
            className="text-xs bg-white text-[#191c1e] font-medium py-1 px-2.5 rounded-lg border border-slate-200 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="dashboard">Dashboard</option>
            <option value="panel-admin">👑 Consola Gerencia (ADMIN)</option>
            <option value="room-rack">Room Rack</option>
            <option value="reservas">Reservas</option>
            <option value="nueva-reserva">Nueva Reserva</option>
            <option value="habitaciones">Habitaciones</option>
            <option value="huespedes">Huéspedes</option>
            <option value="pos">POS (Punto de Venta)</option>
            <option value="facturacion">Facturación y Cierre</option>
            <option value="reportes">Reportes y KPIs</option>
            <option value="login">Login Screen</option>
          </select>
        </div>

        {/* New Booking CTA */}
        <button
          id="btn-header-new-booking"
          onClick={onOpenNewBooking}
          className="hidden lg:flex items-center gap-1.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Nueva Reserva</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-[#f2f4f6] rounded-xl transition"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Notificaciones Operativas</p>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">3 Nuevas</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="py-2.5 text-xs">
                  <p className="font-semibold text-slate-800">Check-in VIP Pendiente</p>
                  <p className="text-slate-500 text-[11px]">Mr. Alexander Sterling llega en 45 min (Hab 304).</p>
                  <span className="text-[10px] text-slate-400">Hace 12 min</span>
                </div>
                <div className="py-2.5 text-xs">
                  <p className="font-semibold text-slate-800">Housekeeping Report</p>
                  <p className="text-slate-500 text-[11px]">Habitación 102 lista para inspección.</p>
                  <span className="text-[10px] text-slate-400">Hace 28 min</span>
                </div>
                <div className="py-2.5 text-xs">
                  <p className="font-semibold text-slate-800">Alerta de Mantenimiento</p>
                  <p className="text-slate-500 text-[11px]">Habitación 202 HVAC en revisión técnica.</p>
                  <span className="text-[10px] text-slate-400">Hace 1 hora</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

