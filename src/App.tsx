import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  Room,
  Reservation,
  TaskItem,
  Guest,
  Invoice,
  UserProfile,
  UserRole,
  Employee,
  AuditLogEntry,
  PromoCode,
} from './types';
import { supabase } from './lib/supabase';
import {
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_TASKS,
  INITIAL_GUESTS,
  POS_PRODUCTS,
  INITIAL_INVOICES,
  ADMIN_PROFILE,
  RECEPTIONIST_PROFILE,
  INITIAL_EMPLOYEES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PROMOS,
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { RoomRackScreen } from './screens/RoomRackScreen';
import { ReservasScreen } from './screens/ReservasScreen';
import { NuevaReservaWizard } from './screens/NuevaReservaWizard';
import { HabitacionesScreen } from './screens/HabitacionesScreen';
import { HuespedesScreen } from './screens/HuespedesScreen';
import { PosScreen } from './screens/PosScreen';
import { FacturacionScreen } from './screens/FacturacionScreen';
import { ReportesScreen } from './screens/ReportesScreen';
import { AdminConsoleScreen } from './screens/AdminConsoleScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(RECEPTIONIST_PROFILE);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [guests] = useState<Guest[]>(INITIAL_GUESTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isElevatingPrivileges, setIsElevatingPrivileges] = useState<boolean>(false);
  const [targetDestinationAfterLogin, setTargetDestinationAfterLogin] = useState<ScreenId | null>(null);
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('admin');

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {

        setCurrentScreen('login');
      } else {

        const role: UserRole = session.user.email === ADMIN_EMAIL ? 'admin' : 'receptionist';
        setCurrentUser(role === 'admin' ? ADMIN_PROFILE : RECEPTIONIST_PROFILE);
        setCurrentScreen('dashboard');
      }
      setIsCheckingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentScreen('login');
        setIsElevatingPrivileges(false);
        setAuthNotice(null);
      } else {
        const role: UserRole = session.user.email === ADMIN_EMAIL ? 'admin' : 'receptionist';
        setCurrentUser(role === 'admin' ? ADMIN_PROFILE : RECEPTIONIST_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRequestAdminAccess = (destination: ScreenId = 'dashboard') => {
    setAuthNotice(
      'Has solicitado activar el Modo Administrador desde la sesión de Recepción. Por seguridad, ingresa el usuario y contraseña del Administrador.'
    );
    setIsElevatingPrivileges(true);
    setLoginInitialRole('admin');
    setTargetDestinationAfterLogin(destination);
    setCurrentScreen('login');
    showToast('Ingresa usuario y contraseña de Administrador para continuar.');
  };

  const handleToggleRole = () => {
    if (currentUser.role === 'admin') {

      setCurrentUser(RECEPTIONIST_PROFILE);
      showToast('Cambiado a Modo Recepcionista (Sofía Ramírez • Turno Mañana)');
    } else {

      handleRequestAdminAccess('dashboard');
    }
  };

  const handleCancelElevation = () => {
    setIsElevatingPrivileges(false);
    setAuthNotice(null);
    setTargetDestinationAfterLogin(null);
    setCurrentScreen('dashboard');
    showToast('Elevación cancelada. Continuando en Modo Recepción.');
  };

  const handleLoginSuccess = (role: UserRole, destination?: ScreenId) => {
    const isNewAdmin = role === 'admin';
    setCurrentUser(isNewAdmin ? ADMIN_PROFILE : RECEPTIONIST_PROFILE);
    const nextScreen = destination || targetDestinationAfterLogin || 'dashboard';
    setCurrentScreen(nextScreen);
    setIsElevatingPrivileges(false);
    setAuthNotice(null);
    setTargetDestinationAfterLogin(null);

    showToast(
      isNewAdmin
        ? '¡Bienvenido Ing. Roberto Mendoza! Modo Administrador activado con privilegios totales.'
        : '¡Bienvenida Sofía Ramírez! Turno de Recepción iniciado.'
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsElevatingPrivileges(false);
    setAuthNotice(null);
    setTargetDestinationAfterLogin(null);
    setLoginInitialRole('receptionist');
    setCurrentScreen('login');
  };

  const handleProtectedNavigate = (screen: ScreenId) => {
    if (screen === 'panel-admin' && currentUser.role !== 'admin') {
      handleRequestAdminAccess('panel-admin');
    } else {
      setCurrentScreen(screen);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, subtitle: string, priority?: 'Alta' | 'Media' | 'Baja') => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      subtitle,
      completed: false,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Tarea agregada: "${title}"`);
  };

  const handleCompleteReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setCurrentScreen('reservas');
    showToast(`¡Reserva ${newRes.code} confirmada para ${newRes.guestName}!`);
  };

  const handleUpdateReservationStatus = (id: string, newStatus: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Estado de reserva actualizado a "${newStatus}"`);
  };

  const handleApplyCourtesyDiscount = (id: string, discountPercent: number) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newTotal = r.total * (1 - discountPercent / 100);
          return { ...r, total: newTotal };
        }
        return r;
      })
    );
    handleAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      action: `Descuento Gerencial ${discountPercent}%`,
      category: 'Reservas',
      details: `Descuento de cortesía aplicado por Administración a reserva ${id}`,
      severity: 'alerta',
    });
    showToast(`Descuento de cortesía (${discountPercent}%) aplicado por Gerencia`);
  };

  const handleUpdateRoomStatus = (roomId: string, status: Room['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
    showToast(`Habitación ${roomId} marcada como "${status.toUpperCase()}"`);
  };

  const handleAddInvoice = (inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);
    showToast(`Comprobante ${inv.folio} generado por $${inv.total.toFixed(2)}`);
  };

  const handleVoidInvoice = (id: string, reason: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Anulada' as const } : inv))
    );
    handleAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      action: 'Anulación Fiscal de Folio',
      category: 'Facturación',
      details: `Folio anulado bajo supervisión de Gerencia. Motivo: ${reason}`,
      severity: 'critica',
    });
    showToast('Comprobante anulado formalmente bajo supervisión fiscal.');
  };

  const handleUpdateRoomRate = (roomId: string, newRate: number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, rate: newRate } : r))
    );
    handleAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      action: `Ajuste de Tarifa Hab ${roomId}`,
      category: 'Tarifas',
      details: `Tarifa ajustada a $${newRate.toFixed(2)} por Yield Management`,
      severity: 'alerta',
    });
    showToast(`Tarifa de habitación ${roomId} actualizada a $${newRate}`);
  };

  const handleTriggerNightAudit = () => {
    handleAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      action: 'Cierre de Día y Auditoría Nocturna Ejecutada',
      category: 'Facturación',
      details: 'Día fiscal cerrado, cargos automáticos aplicados y balance consolidado.',
      severity: 'critica',
    });
    showToast('¡Auditoría Nocturna completada exitosamente!');
  };

  const handleAddAuditLog = (log: Omit<AuditLogEntry, 'id'>) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...log,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen w-full bg-[#f7f9fb] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
          <span className="material-symbols-outlined text-3xl">spa</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-black text-[#191c1e] tracking-tight">
            HOTEL <span className="text-[#004ac6] font-light">GEMA</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <svg className="animate-spin h-4 w-4 text-[#004ac6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Verificando sesión...</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="relative">

        {isElevatingPrivileges && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={handleCancelElevation}
              className="px-3 py-1.5 bg-white/90 backdrop-blur-xs hover:bg-white text-[#004ac6] border border-blue-200 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Volver a Recepción</span>
            </button>
          </div>
        )}
        <LoginScreen
          initialRole={loginInitialRole}
          authNotice={authNotice}
          isElevating={isElevatingPrivileges}
          targetDestination={targetDestinationAfterLogin}
          onCancelElevation={handleCancelElevation}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-row antialiased text-[#191c1e]">

      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleProtectedNavigate}
        onLogout={handleLogout}
        reservationCount={reservations.length}
        currentUser={currentUser}
        onToggleRole={handleToggleRole}
        onRequestAdminAccess={handleRequestAdminAccess}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentScreen={currentScreen}
          onNavigate={handleProtectedNavigate}
          onOpenNewBooking={() => setCurrentScreen('nueva-reserva')}
          currentUser={currentUser}
          onToggleRole={handleToggleRole}
          onRequestAdminAccess={handleRequestAdminAccess}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto pb-12">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'room-rack' && (
            <RoomRackScreen
              rooms={rooms}
              onNavigate={setCurrentScreen}
              onOpenNewBooking={() => setCurrentScreen('nueva-reserva')}
            />
          )}

          {currentScreen === 'reservas' && (
            <ReservasScreen
              reservations={reservations}
              currentUser={currentUser}
              onOpenNewBooking={() => setCurrentScreen('nueva-reserva')}
              onNavigate={setCurrentScreen}
              onUpdateStatus={handleUpdateReservationStatus}
              onApplyCourtesyDiscount={handleApplyCourtesyDiscount}
            />
          )}

          {currentScreen === 'nueva-reserva' && (
            <NuevaReservaWizard
              rooms={rooms}
              onComplete={handleCompleteReservation}
              onCancel={() => setCurrentScreen('reservas')}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'habitaciones' && (
            <HabitacionesScreen
              rooms={rooms}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'huespedes' && (
            <HuespedesScreen
              guests={guests}
              onOpenNewBooking={() => setCurrentScreen('nueva-reserva')}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'pos' && (
            <PosScreen
              products={POS_PRODUCTS}
              onAddInvoice={handleAddInvoice}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'facturacion' && (
            <FacturacionScreen
              invoices={invoices}
              currentUser={currentUser}
              onNavigate={setCurrentScreen}
              onVoidInvoice={handleVoidInvoice}
            />
          )}

          {currentScreen === 'reportes' && (
            <ReportesScreen
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'panel-admin' && (
            <AdminConsoleScreen
              rooms={rooms}
              employees={employees}
              auditLogs={auditLogs}
              promos={promos}
              onUpdateRoomRate={handleUpdateRoomRate}
              onTriggerNightAudit={handleTriggerNightAudit}
              onAddAuditLog={handleAddAuditLog}
              onNavigate={setCurrentScreen}
            />
          )}
        </main>
      </div>
    </div>
  );
}
