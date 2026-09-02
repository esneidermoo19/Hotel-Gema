import React, { useState } from 'react';
import { Guest, ScreenId } from '../types';

interface HuespedesScreenProps {
  guests: Guest[];
  onOpenNewBooking: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HuespedesScreen: React.FC<HuespedesScreenProps> = ({
  guests,
  onOpenNewBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | Guest['status']>('Todos');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter((g) => {
    if (statusFilter !== 'Todos' && g.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.documentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Guest['status']) => {
    switch (status) {
      case 'VIP':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Regular':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Atención':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Familia':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Directorio de Huéspedes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Historial de perfiles, estancias y preferencias de atención</p>
        </div>
        <button
          onClick={onOpenNewBooking}
          className="px-4 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>+ Registrar Reserva de Huésped</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono, documento..."
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(['Todos', 'VIP', 'Regular', 'Atención', 'Familia'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setStatusFilter(tag)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                statusFilter === tag
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {/* Avatar & Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="relative">
                  {guest.photo ? (
                    <img
                      src={guest.photo}
                      alt={guest.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#004ac6] font-extrabold flex items-center justify-center text-lg shadow-inner">
                      {guest.initials || guest.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {guest.status === 'VIP' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                      ★
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(guest.status)}`}>
                  {guest.status}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{guest.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs text-slate-400">public</span>
                {guest.country}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Estancias</span>
                  <p className="font-extrabold text-slate-900 font-data-mono">{guest.stays}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Última Visita</span>
                  <p className="font-semibold text-slate-700 text-[11px]">{guest.lastVisit}</p>
                </div>
              </div>
            </div>

            {/* Profile Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedGuest(guest)}
                className="w-full py-2 bg-slate-100 hover:bg-blue-50 hover:text-[#004ac6] rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Ver Perfil Completo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Detail Dossier Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedGuest.photo ? (
                  <img
                    src={selectedGuest.photo}
                    alt={selectedGuest.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#004ac6] font-extrabold flex items-center justify-center text-lg">
                    {selectedGuest.initials || selectedGuest.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedGuest.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedGuest.status)}`}>
                      {selectedGuest.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedGuest.country} • {selectedGuest.stays} estancias históricas</p>
                </div>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Datos de Contacto</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-semibold text-slate-800 break-all">{selectedGuest.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Teléfono:</span>
                    <p className="font-semibold text-slate-800">{selectedGuest.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Documento:</span>
                    <p className="font-semibold text-slate-800">{selectedGuest.documentId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Última estancia:</span>
                    <p className="font-semibold text-slate-800">{selectedGuest.lastVisit}</p>
                  </div>
                </div>
              </div>

              {selectedGuest.notes && (
                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                  <p className="font-bold text-[#004ac6] uppercase tracking-wider text-[10px] mb-1">
                    Preferencias y Notas del Huésped
                  </p>
                  <p className="text-slate-700 leading-relaxed">{selectedGuest.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedGuest(null);
                  onOpenNewBooking();
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>Crear Reserva para {selectedGuest.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
