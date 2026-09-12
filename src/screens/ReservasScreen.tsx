import React, { useState } from 'react';
import { Reservation, ScreenId, UserProfile } from '../types';

interface ReservasScreenProps {
  reservations: Reservation[];
  currentUser?: UserProfile;
  onOpenNewBooking: () => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateStatus: (id: string, newStatus: Reservation['status']) => void;
  onApplyCourtesyDiscount?: (id: string, discountPercent: number) => void;
}

export const ReservasScreen: React.FC<ReservasScreenProps> = ({
  reservations,
  currentUser,
  onOpenNewBooking,
  onUpdateStatus,
  onApplyCourtesyDiscount,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [statusFilter, setStatusFilter] = useState<'Todas' | Reservation['status']>('Todas');
  const [originFilter, setOriginFilter] = useState<'Todos' | string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter((res) => {
    if (statusFilter !== 'Todas' && res.status !== statusFilter) return false;
    if (originFilter !== 'Todos' && res.origin !== originFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.code.toLowerCase().includes(q) ||
        res.guestName.toLowerCase().includes(q) ||
        res.roomNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'In-House':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Confirmada':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pendiente':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelada':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const counts = {
    Todas: reservations.length,
    'In-House': reservations.filter((r) => r.status === 'In-House').length,
    Confirmada: reservations.filter((r) => r.status === 'Confirmada').length,
    Pendiente: reservations.filter((r) => r.status === 'Pendiente').length,
    Cancelada: reservations.filter((r) => r.status === 'Cancelada').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Listado de Reservas</span>
            <span className="text-xs bg-blue-50 text-[#004ac6] font-semibold px-2.5 py-1 rounded-full border border-blue-200">
              {reservations.length} Totales
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Control de ingresos, salidas y canales de distribución</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Generando reporte exportable de reservas en formato CSV/Excel...")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewBooking}
            className="px-4 py-2 rounded-xl bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Nueva Reserva</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="relative w-full lg:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por huésped, código o habitación..."
              className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['Todas', 'In-House', 'Confirmada', 'Pendiente', 'Cancelada'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-[#004ac6] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === st ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {counts[st]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Canal de origen:</span>
            <div className="flex flex-wrap gap-1">
              {['Todos', 'Web Directa', 'Booking.com', 'Expedia', 'Directo'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setOriginFilter(ch)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    originFilter === ch
                      ? 'bg-blue-100 text-[#004ac6] font-bold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {(statusFilter !== 'Todas' || originFilter !== 'Todos' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('Todas');
                setOriginFilter('Todos');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">CÓDIGO</th>
                <th className="p-4">HUÉSPED</th>
                <th className="p-4">HABITACIÓN</th>
                <th className="p-4">FECHAS</th>
                <th className="p-4">ESTADO</th>
                <th className="p-4">ORIGEN</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No se encontraron reservas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-bold font-data-mono text-[#004ac6]">{res.code}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#004ac6] font-bold flex items-center justify-center text-xs shrink-0">
                          {res.guestInitials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{res.guestName}</p>
                          <p className="text-[10px] text-slate-400">
                            {res.adults} adultos {res.children > 0 ? `• ${res.children} niños` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">
                        {res.roomNumber === '-' || res.roomNumber.includes('Asignando') ? (
                          <span className="text-amber-600 italic font-medium">{res.roomNumber}</span>
                        ) : (
                          `Hab ${res.roomNumber}`
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">{res.roomType}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{res.checkIn} → {res.checkOut}</p>
                      <p className="text-[10px] text-slate-400">Estadía regular</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{res.origin}</td>
                    <td className="p-4 font-data-mono font-bold text-slate-900">
                      ${res.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedRes(res)}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#004ac6] rounded-lg text-slate-700 font-semibold transition"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#004ac6] font-data-mono">{selectedRes.code}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedRes.guestName}</h3>
              </div>
              <button onClick={() => setSelectedRes(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Habitación:</span>
                  <span className="font-bold text-slate-800">{selectedRes.roomNumber} ({selectedRes.roomType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estadía:</span>
                  <span className="font-semibold text-slate-800">{selectedRes.checkIn} al {selectedRes.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Origen de reserva:</span>
                  <span className="font-semibold text-slate-800">{selectedRes.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total reservado:</span>
                  <span className="font-bold text-slate-900 font-data-mono">${selectedRes.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cambiar Estado de Reserva</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['In-House', 'Confirmada', 'Pendiente', 'Cancelada'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedRes.id, st);
                        setSelectedRes({ ...selectedRes, status: st });
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                        selectedRes.status === st
                          ? 'bg-[#004ac6] text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-amber-600">
                      verified_user
                    </span>
                    <label className="text-xs font-bold text-slate-800">
                      Privilegio Gerencial: Tarifas & Cortesías
                    </label>
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      isAdmin
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isAdmin ? 'Autorizado' : 'Bloqueado'}
                  </span>
                </div>

                {isAdmin ? (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5 space-y-2">
                    <p className="text-[11px] text-amber-900 font-medium">
                      Como Administrador, puedes autorizar cortesías VIP inmediatas o exonerar tarifas:
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyCourtesyDiscount) {
                            onApplyCourtesyDiscount(selectedRes.id, 100);
                            setSelectedRes({ ...selectedRes, total: 0 });
                          }
                        }}
                        className="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                        title="Aplicar 100% descuento de cortesía gerencial"
                      >
                        Cortesía 100% Free
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyCourtesyDiscount) {
                            onApplyCourtesyDiscount(selectedRes.id, 50);
                            setSelectedRes({ ...selectedRes, total: selectedRes.total * 0.5 });
                          }
                        }}
                        className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold transition"
                        title="Aplicar 50% de descuento gerencial"
                      >
                        50% Gerencial
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyCourtesyDiscount) {
                            onApplyCourtesyDiscount(selectedRes.id, 25);
                            setSelectedRes({ ...selectedRes, total: selectedRes.total * 0.75 });
                          }
                        }}
                        className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold transition"
                        title="Aplicar 25% descuento corporativo"
                      >
                        25% Corporativo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-base">lock</span>
                    <p className="text-[10px] text-slate-500">
                      La aplicación de tarifas de cortesía y descuentos directos mayores al 10% requiere el perfil de <strong className="text-slate-700">Administrador</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRes(null)}
                className="w-full py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
