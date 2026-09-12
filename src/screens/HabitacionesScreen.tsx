import React, { useState } from 'react';
import { Room, ScreenId } from '../types';

interface HabitacionesScreenProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, status: Room['status']) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HabitacionesScreen: React.FC<HabitacionesScreenProps> = ({
  rooms,
  onUpdateRoomStatus
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Room['status']>('all');

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const countClean = rooms.filter((r) => r.status === 'limpia').length;
  const countDirty = rooms.filter((r) => r.status === 'sucia').length;
  const countMaint = rooms.filter((r) => r.status === 'mantenimiento').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Estado de Habitaciones y Housekeeping</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control de limpieza, inspección y bloqueo por mantenimiento</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Notificación enviada al equipo de Housekeeping en pisos.")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">notifications_active</span>
            <span>Alertar a Camaristas</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Habitaciones</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900 font-data-mono">120</span>
            <span className="text-xs font-semibold text-slate-500">100%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Limpias / Listas</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600 font-data-mono">45</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {Math.round((45 / 120) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Sucias / En Limpieza</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600 font-data-mono">62</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {Math.round((62 / 120) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Mantenimiento</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-rose-600 font-data-mono">13</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {Math.round((13 / 120) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Piso:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['all', 1, 2, 3, 4] as const).map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedFloor === floor ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
                }`}
              >
                {floor === 'all' ? 'Todos' : `Piso ${floor}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Estado:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                statusFilter === 'all' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
              }`}
            >
              Todos ({rooms.length})
            </button>
            <button
              onClick={() => setStatusFilter('limpia')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                statusFilter === 'limpia' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Limpias ({countClean})
            </button>
            <button
              onClick={() => setStatusFilter('sucia')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                statusFilter === 'sucia' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Sucias ({countDirty})
            </button>
            <button
              onClick={() => setStatusFilter('mantenimiento')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                statusFilter === 'mantenimiento' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Mant. ({countMaint})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isClean = room.status === 'limpia';
          const isDirty = room.status === 'sucia';
          const isMaint = room.status === 'mantenimiento';

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
            >

              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={`Hab ${room.number}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl">bed</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                  Hab {room.number}
                </div>

                <div className="absolute top-3 right-3">
                  {isClean && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Limpia
                    </span>
                  )}
                  {isDirty && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Sucia
                    </span>
                  )}
                  {isMaint && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Mant.
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{room.type}</h3>
                    <span className="text-xs font-extrabold text-[#004ac6] font-data-mono">
                      ${room.rate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Piso {room.floor} • Capacidad: {room.capacity}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'limpia')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                      isClean
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
                    }`}
                    title="Marcar como limpia y lista para check-in"
                  >
                    <span>Limpia</span>
                  </button>

                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'sucia')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                      isDirty
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600'
                    }`}
                    title="Enviar a camaristas para aseo"
                  >
                    <span>Sucia</span>
                  </button>

                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'mantenimiento')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                      isMaint
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600'
                    }`}
                    title="Bloquear por mantenimiento técnico"
                  >
                    <span>Mant.</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
