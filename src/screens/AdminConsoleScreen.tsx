import React, { useState } from 'react';
import { Employee, AuditLogEntry, PromoCode, Room, ScreenId } from '../types';

interface AdminConsoleScreenProps {
  rooms: Room[];
  employees: Employee[];
  auditLogs: AuditLogEntry[];
  promos: PromoCode[];
  onUpdateRoomRate: (roomId: string, newRate: number) => void;
  onNavigate: (screen: ScreenId) => void;
  onTriggerNightAudit: () => void;
  onAddAuditLog: (log: Omit<AuditLogEntry, 'id'>) => void;
}

export const AdminConsoleScreen: React.FC<AdminConsoleScreenProps> = ({
  rooms,
  employees: initialEmployees,
  auditLogs: initialAuditLogs,
  promos: initialPromos,
  onUpdateRoomRate,
  onNavigate,
  onTriggerNightAudit,
  onAddAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'yield' | 'staff' | 'audit' | 'finance'>('yield');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [promos, setPromos] = useState<PromoCode[]>(initialPromos);

  const [surgeActive, setSurgeActive] = useState(true);
  const [weekendSurcharge, setWeekendSurcharge] = useState(true);
  const [lastMinuteDiscount, setLastMinuteDiscount] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(15);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const [showNightAuditModal, setShowNightAuditModal] = useState(false);
  const [nightAuditProgress, setNightAuditProgress] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  const [showNewStaffModal, setShowNewStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<Employee['role']>('Recepcionista');
  const [newStaffShift, setNewStaffShift] = useState<Employee['shift']>('Mañana (06:00 - 14:00)');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  const [selectedRoomForRate, setSelectedRoomForRate] = useState<Room | null>(null);
  const [customRateInput, setCustomRateInput] = useState<number>(150);

  const handleTogglePromo = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    onAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      user: 'Ing. Roberto Mendoza (Admin)',
      action: 'Modificación de Código Promocional',
      category: 'Tarifas',
      details: `Estado del cupón promocional modificado por Gerencia.`,
      severity: 'normal',
    });
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const newP: PromoCode = {
      id: `pro-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: Number(newPromoDiscount),
      validUntil: '31 Dic 2023',
      usageCount: 0,
      active: true,
    };
    setPromos([newP, ...promos]);
    setNewPromoCode('');
    setShowPromoModal(false);
    onAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      user: 'Ing. Roberto Mendoza (Admin)',
      action: 'Creación de Código de Descuento',
      category: 'Tarifas',
      details: `Cupón ${newP.code} creado con ${newP.discountPercent}% de descuento.`,
      severity: 'alerta',
    });
  };

  const handleSaveRoomRate = () => {
    if (!selectedRoomForRate) return;
    onUpdateRoomRate(selectedRoomForRate.id, Number(customRateInput));
    onAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      user: 'Ing. Roberto Mendoza (Admin)',
      action: 'Ajuste Manual de Tarifa Base',
      category: 'Tarifas',
      details: `Tarifa de Habitación ${selectedRoomForRate.number} modificada a $${customRateInput}/noche.`,
      severity: 'alerta',
    });
    setSelectedRoomForRate(null);
  };

  const handleExecuteNightAudit = () => {
    setIsAuditing(true);
    setNightAuditProgress(10);
    const interval = setInterval(() => {
      setNightAuditProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAuditing(false);
            setAuditSuccess(true);
            onTriggerNightAudit();
            onAddAuditLog({
              timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
              user: 'Ing. Roberto Mendoza (Admin)',
              action: 'Ejecución Forzada de Auditoría Nocturna',
              category: 'Seguridad',
              details: 'Cierre del día hotelero ejecutado exitosamente. Cargos de habitación posteados.',
              severity: 'critica',
            });
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      shift: newStaffShift,
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: newStaffPhone || '+34 600 000 000',
      pin: `${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setEmployees([...employees, newEmp]);
    setShowNewStaffModal(false);
    setNewStaffName('');
    setNewStaffPhone('');
    onAddAuditLog({
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      user: 'Ing. Roberto Mendoza (Admin)',
      action: 'Alta de Nuevo Empleado',
      category: 'Seguridad',
      details: `${newEmp.name} registrado en rol de ${newEmp.role} con PIN asignado.`,
      severity: 'alerta',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-lg border border-slate-700/60">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
            <span className="material-symbols-outlined text-3xl font-black">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                Consola Exclusiva de Gerencia
              </span>
              <span className="text-xs text-slate-300">• Nivel: Super Admin</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
              Panel de Administración y Control Estratégico
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Supervisión de rentabilidad, yield management dinámico, control de personal, trazabilidad de auditoría y cierre contable global.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setAuditSuccess(false);
              setNightAuditProgress(0);
              setShowNightAuditModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">nightlight</span>
            <span>Auditoría Nocturna (Night Audit)</span>
          </button>
          <button
            onClick={() => onNavigate('reportes')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/10 transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">finance</span>
            <span>Ver KPIs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Margen EBITDA Hotel</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-base">savings</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-600 font-data-mono">$38,450.00</span>
            <p className="text-[11px] text-slate-500 mt-1">Margen operativo neto: <strong>38.2%</strong></p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Impacto Yield Pricing</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-base">trending_up</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-[#004ac6] font-data-mono">+$6,420</span>
            <p className="text-[11px] text-slate-500 mt-1">Generado por recargo dinámico (+15%)</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ahorro Comisiones OTAs</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <span className="material-symbols-outlined text-base">hub</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-purple-700 font-data-mono">$4,850.00</span>
            <p className="text-[11px] text-slate-500 mt-1">Por 40% de venta web directa (0% fee)</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '62%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Personal en Turno</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <span className="material-symbols-outlined text-base">badge</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 font-data-mono">4 / 5 Activos</span>
            <p className="text-[11px] text-slate-500 mt-1">Costo Nómina hoy: $420.00</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('yield')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'yield'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">price_change</span>
          <span>Yield & Tarifas Dinámicas</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'staff'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">badge</span>
          <span>Personal & Turnos ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">security</span>
          <span>Auditoría de Seguridad ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'finance'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">account_balance</span>
          <span>P&L Financiero Hotelero</span>
        </button>
      </div>

      {activeTab === 'yield' && (
        <div className="space-y-6">

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Motor de Tarifación Dinámica (Yield Management)</h3>
                <p className="text-xs text-slate-500">Reglas automatizadas para maximizar el RevPAR según oferta y demanda en tiempo real</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 text-[#004ac6] text-xs font-bold">
                <span className="material-symbols-outlined text-base animate-pulse">auto_mode</span>
                <span>Motor Activo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className={`p-4 rounded-2xl border transition ${surgeActive ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Surge de Alta Ocupación</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Si ocupación supera el 80%, aumentar tarifas automáticamente.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={surgeActive}
                    onChange={(e) => setSurgeActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004ac6] focus:ring-[#004ac6] cursor-pointer"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#004ac6]">Recargo:</span>
                  <select
                    value={selectedMultiplier}
                    onChange={(e) => setSelectedMultiplier(Number(e.target.value))}
                    disabled={!surgeActive}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value={10}>+10% sobre base</option>
                    <option value={15}>+15% sobre base</option>
                    <option value={20}>+20% sobre base</option>
                    <option value={25}>+25% sobre base</option>
                  </select>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border transition ${weekendSurcharge ? 'bg-purple-50/50 border-purple-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Tarifa Fin de Semana</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Aplicar recargo de viernes a domingo para reservas de ocio.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weekendSurcharge}
                    onChange={(e) => setWeekendSurcharge(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600 cursor-pointer"
                  />
                </div>
                <div className="mt-3 text-xs font-semibold text-purple-700">
                  +18% en Noches de Fin de Semana
                </div>
              </div>

              <div className={`p-4 rounded-2xl border transition ${lastMinuteDiscount ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Liquidación Last-Minute</h4>
                    <p className="text-[11px] text-slate-500 mt-1">A partir de las 18:00, si quedan más de 5 habs, ofrecer descuento flash.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={lastMinuteDiscount}
                    onChange={(e) => setLastMinuteDiscount(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                  />
                </div>
                <div className="mt-3 text-xs font-semibold text-emerald-700">
                  -12% en Web Directa (evitar vacantes)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Control de Tarifas Base por Habitación</h3>
                <p className="text-xs text-slate-500">Solo el Administrador tiene permiso para alterar las tarifas oficiales del hotel</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {rooms.length} Unidades en Catálogo
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">HABITACIÓN</th>
                    <th className="p-3.5">TIPO</th>
                    <th className="p-3.5">PISO</th>
                    <th className="p-3.5">ESTADO</th>
                    <th className="p-3.5">TARIFA BASE</th>
                    <th className="p-3.5">TARIFA CON SURGE ({surgeActive ? `+${selectedMultiplier}%` : 'Normal'})</th>
                    <th className="p-3.5 text-right">ACCIÓN GERENCIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => {
                    const dynamicRate = surgeActive
                      ? Math.round(room.rate * (1 + selectedMultiplier / 100))
                      : room.rate;
                    return (
                      <tr key={room.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-bold text-slate-900 font-data-mono">Hab {room.number}</td>
                        <td className="p-3.5 font-medium text-slate-700">{room.type}</td>
                        <td className="p-3.5 text-slate-500">Piso {room.floor}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              room.status === 'limpia'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : room.status === 'sucia'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {room.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 font-data-mono font-bold text-slate-700">
                          ${room.rate.toFixed(2)}/noche
                        </td>
                        <td className="p-3.5 font-data-mono font-black text-[#004ac6]">
                          ${dynamicRate.toFixed(2)}/noche
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedRoomForRate(room);
                              setCustomRateInput(room.rate);
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#004ac6] rounded-lg font-bold transition inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">tune</span>
                            <span>Editar Tarifa</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cupones y Descuentos Exclusivos</h3>
                  <p className="text-xs text-slate-500">Campañas promocionales gestionadas por Dirección</p>
                </div>
                <button
                  onClick={() => setShowPromoModal(true)}
                  className="px-3 py-1.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Nuevo Cupón</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {promos.map((promo) => (
                  <div key={promo.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-data-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {promo.code}
                        </span>
                        <span className="text-emerald-600 font-bold">-{promo.discountPercent}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Usado {promo.usageCount} veces • Expira: {promo.validUntil}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTogglePromo(promo.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        promo.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {promo.active ? 'Activo' : 'Pausado'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Estrategia de Canales y Comisiones OTA</h3>
                <p className="text-xs text-slate-500">Paridad tarifaria y margen de distribución por canal</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#004ac6] text-white font-bold flex items-center justify-center text-xs">
                      WEB
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Motor Web Directo</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">0% Comisión • Canal más rentable</p>
                    </div>
                  </div>
                  <span className="font-data-mono font-extrabold text-emerald-600 text-sm">100% Margen</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                      B.
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Booking.com (OTA)</p>
                      <p className="text-[10px] text-slate-400">18.0% Comisión por reserva confirmada</p>
                    </div>
                  </div>
                  <span className="font-data-mono font-bold text-slate-700 text-sm">82% Margen</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                      EXP
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Expedia Partner Central</p>
                      <p className="text-[10px] text-slate-400">20.0% Comisión estándar</p>
                    </div>
                  </div>
                  <span className="font-data-mono font-bold text-slate-700 text-sm">80% Margen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Directorio de Empleados y Turnos</h3>
              <p className="text-xs text-slate-500">Gestión de roles de acceso, claves PIN y cuadrante de horarios</p>
            </div>
            <button
              onClick={() => setShowNewStaffModal(true)}
              className="px-4 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>+ Registrar Empleado</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                        <span className="text-[11px] text-blue-600 font-semibold">{emp.role}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        emp.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="my-3 py-3 border-y border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Turno actual:</span>
                      <span className="font-semibold text-slate-800">{emp.shift}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Teléfono:</span>
                      <span className="font-semibold text-slate-800">{emp.phone}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>PIN Estación:</span>
                      <span className="font-data-mono font-bold text-blue-600">****</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEmployees((prev) =>
                        prev.map((e) =>
                          e.id === emp.id
                            ? { ...e, status: e.status === 'Activo' ? 'Descanso' : 'Activo' }
                            : e
                        )
                      );
                    }}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    {emp.status === 'Activo' ? 'Pausar Turno' : 'Activar Turno'}
                  </button>
                  <button
                    onClick={() => alert(`El PIN actual de ${emp.name} es ${emp.pin}. Para resetearlo, solicita una nueva clave de 4 dígitos.`)}
                    className="p-1.5 text-slate-400 hover:text-[#004ac6] hover:bg-blue-50 rounded-xl transition"
                    title="Ver PIN de Operador"
                  >
                    <span className="material-symbols-outlined text-lg">dialpad</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registro de Auditoría en Tiempo Real (Audit Trail)</h3>
              <p className="text-xs text-slate-500">Trazabilidad inmutable de acciones críticas realizadas por el personal</p>
            </div>
            <button
              onClick={() => alert("Exportando registro inmutable de auditoría forense a formato CSV...")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Exportar Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">HORA</th>
                  <th className="p-3.5">USUARIO / OPERADOR</th>
                  <th className="p-3.5">CATEGORÍA</th>
                  <th className="p-3.5">ACCIÓN</th>
                  <th className="p-3.5">DETALLE DE OPERACIÓN</th>
                  <th className="p-3.5 text-right">SEVERIDAD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 text-slate-500 font-data-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3.5 font-bold text-slate-800">{log.user}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{log.action}</td>
                    <td className="p-3.5 text-slate-600 max-w-md">{log.details}</td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.severity === 'critica'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : log.severity === 'alerta'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-6">

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Estado de Resultados Operativo (P&L Hotelero)</h3>
                <p className="text-xs text-slate-500">Ingresos brutos vs desglose de costes operativos del mes en curso</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Ingresos Brutos Acumulados</span>
                <p className="text-xl font-black text-slate-900 font-data-mono">$68,490.00</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="font-bold text-slate-900">Nómina y Salarios del Personal</p>
                    <p className="text-[11px] text-slate-500">Recepcionistas, mucamas, mantenimiento, seguridad y chefs</p>
                  </div>
                </div>
                <div className="text-right font-data-mono">
                  <span className="font-bold text-rose-600">-$19,177.20</span>
                  <p className="text-[10px] text-slate-400">28.0% del total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="font-bold text-slate-900">Comisiones de Distribución OTAs</p>
                    <p className="text-[11px] text-slate-500">Booking.com, Expedia y comisiones de pasarela POS</p>
                  </div>
                </div>
                <div className="text-right font-data-mono">
                  <span className="font-bold text-rose-600">-$9,725.60</span>
                  <p className="text-[10px] text-slate-400">14.2% del total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="font-bold text-slate-900">Insumos Alimentos y Bebidas (F&B)</p>
                    <p className="text-[11px] text-slate-500">Cocina restaurante, minibar, desayunos y amenities de bienvenida</p>
                  </div>
                </div>
                <div className="text-right font-data-mono">
                  <span className="font-bold text-rose-600">-$8,218.80</span>
                  <p className="text-[10px] text-slate-400">12.0% del total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">4</span>
                  <div>
                    <p className="font-bold text-slate-900">Energía, Agua y Servicios Básicos</p>
                    <p className="text-[11px] text-slate-500">Climatización HVAC, suministro hídrico, internet fibra óptica</p>
                  </div>
                </div>
                <div className="text-right font-data-mono">
                  <span className="font-bold text-rose-600">-$6,164.10</span>
                  <p className="text-[10px] text-slate-400">9.0% del total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center">5</span>
                  <div>
                    <p className="font-bold text-slate-900">Lavandería, Limpieza y Mantenimiento Técnico</p>
                    <p className="text-[11px] text-slate-500">Servicio industrial de lencería, químicos y repuestos</p>
                  </div>
                </div>
                <div className="text-right font-data-mono">
                  <span className="font-bold text-rose-600">-$3,424.50</span>
                  <p className="text-[10px] text-slate-400">5.0% del total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Resultado Neto Operativo</span>
                  <h4 className="text-xl font-black">EBITDA Disponible para Gerencia</h4>
                </div>
                <div className="text-right font-data-mono">
                  <span className="text-2xl font-black">+$21,779.80</span>
                  <p className="text-xs text-emerald-100 font-semibold">Margen Neto: 31.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNightAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">nightlight</span>
                <h3 className="text-base font-bold text-slate-900">Proceso de Auditoría Nocturna (Night Audit)</h3>
              </div>
              <button
                disabled={isAuditing}
                onClick={() => setShowNightAuditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="my-5 space-y-3 text-xs">
              <p className="text-slate-600">
                La auditoría nocturna es la operación más crítica del hotel:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                <li>Postea automáticamente los cargos de alojamiento de todas las habitaciones in-house.</li>
                <li>Verifica y cuadra todos los cobros de terminales POS y cajas de turno.</li>
                <li>Pasa la fecha del PMS al siguiente día contable (15 Octubre 2023).</li>
                <li>Genera los reportes oficiales para Dirección y Contabilidad.</li>
              </ul>

              {isAuditing && (
                <div className="my-4 space-y-2">
                  <div className="flex justify-between font-bold text-blue-600 text-xs">
                    <span>Ejecutando balance contable...</span>
                    <span>{nightAuditProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#004ac6] h-full rounded-full transition-all duration-300"
                      style={{ width: `${nightAuditProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {auditSuccess && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
                    <span>¡Auditoría Nocturna Finalizada con Éxito!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Cargos de habitación posteados. Fecha contable actualizada a 15 de Octubre. Reporte Z transmitido a Gerencia.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isAuditing}
                onClick={() => setShowNightAuditModal(false)}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
              >
                {auditSuccess ? 'Cerrar' : 'Cancelar'}
              </button>
              {!auditSuccess && (
                <button
                  type="button"
                  disabled={isAuditing}
                  onClick={handleExecuteNightAudit}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-md text-xs flex items-center justify-center gap-2 transition"
                >
                  {isAuditing ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      <span>Procesando Auditoría...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">play_arrow</span>
                      <span>Confirmar y Ejecutar Auditoría Nocturna</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedRoomForRate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Modificar Tarifa Base</h3>
            <p className="text-xs text-slate-500 mt-0.5">Habitación {selectedRoomForRate.number} ({selectedRoomForRate.type})</p>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nueva Tarifa Oficial ($/noche) *</label>
                <input
                  type="number"
                  value={customRateInput}
                  onChange={(e) => setCustomRateInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-data-mono text-slate-900 font-bold focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Esta tarifa base será el valor de referencia antes de aplicar cualquier multiplicador o regla de Yield Management.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRoomForRate(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveRoomRate}
                className="flex-1 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-xl shadow-xs text-xs"
              >
                Guardar Tarifa
              </button>
            </div>
          </div>
        </div>
      )}

      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Crear Código de Descuento</h3>
            <p className="text-xs text-slate-500 mt-0.5">Autorizado exclusivamente por Gerencia General</p>

            <form onSubmit={handleCreatePromo} className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código Promocional *</label>
                <input
                  type="text"
                  required
                  placeholder="EJ: VERANO2024"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-data-mono text-slate-900 font-bold focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Porcentaje de Descuento (%) *</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  required
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-data-mono text-slate-900 font-bold focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-xl shadow-xs text-xs"
                >
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Empleado</h3>
            <p className="text-xs text-slate-500 mt-0.5">Asignación de rol y estación de trabajo</p>

            <form onSubmit={handleAddEmployee} className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Morales"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rol Operativo *</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as Employee['role'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Auditor Nocturno">Auditor Nocturno</option>
                  <option value="Gerente Alimentos">Gerente Alimentos</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Turno Asignado *</label>
                <select
                  value={newStaffShift}
                  onChange={(e) => setNewStaffShift(e.target.value as Employee['shift'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Mañana (06:00 - 14:00)">Mañana (06:00 - 14:00)</option>
                  <option value="Tarde (14:00 - 22:00)">Tarde (14:00 - 22:00)</option>
                  <option value="Noche (22:00 - 06:00)">Noche (22:00 - 06:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil</label>
                <input
                  type="tel"
                  placeholder="+34 600 123 456"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewStaffModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-xl shadow-xs text-xs"
                >
                  Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
