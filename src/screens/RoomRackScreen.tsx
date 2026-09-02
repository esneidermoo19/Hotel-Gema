import React, { useState } from 'react';
import { Room, ScreenId } from '../types';

interface RoomRackScreenProps {
  rooms: Room[];
  onNavigate: (screen: ScreenId) => void;
  onOpenNewBooking: () => void;
}

interface RackBooking {
  id: string;
  code: string;
  roomNumber: string;
  guestName: string;
  startDayIndex: number; // 0 to 7
  durationDays: number;
  status: 'In-House' | 'Confirmada' | 'Hold' | 'Mantenimiento';
  color: string;
  total: number;
}

export const RoomRackScreen: React.FC<RoomRackScreenProps> = ({
  rooms,
  onOpenNewBooking
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<RackBooking | null>(null);

  const days = [
    { dayNumber: '14', dayName: 'LUN', isToday: true },
    { dayNumber: '15', dayName: 'MAR', isToday: false },
    { dayNumber: '16', dayName: 'MIÉ', isToday: false },
    { dayNumber: '17', dayName: 'JUE', isToday: false },
    { dayNumber: '18', dayName: 'VIE', isToday: false },
    { dayNumber: '19', dayName: 'SÁB', isToday: false },
    { dayNumber: '20', dayName: 'DOM', isToday: false },
    { dayNumber: '21', dayName: 'LUN', isToday: false },
  ];

  const bookings: RackBooking[] = [
    {
      id: 'b-1',
      code: '#R-4912',
      roomNumber: '101',
      guestName: 'A. Smith (VIP)',
      startDayIndex: 0,
      durationDays: 3,
      status: 'In-House',
      color: 'bg-[#004ac6] text-white border-blue-700',
      total: 420.0
    },
    {
      id: 'b-2',
      code: '#R-4915',
      roomNumber: '102',
      guestName: 'J. Taylor',
      startDayIndex: 0,
      durationDays: 2,
      status: 'In-House',
      color: 'bg-emerald-600 text-white border-emerald-700',
      total: 220.0
    },
    {
      id: 'b-3',
      code: 'HOLD-88',
      roomNumber: '102',
      guestName: 'Bloqueo Web (Hold)',
      startDayIndex: 3,
      durationDays: 2,
      status: 'Hold',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      total: 220.0
    },
    {
      id: 'b-4',
      code: '#R-4918',
      roomNumber: '103',
      guestName: 'Corporate Group X',
      startDayIndex: 1,
      durationDays: 4,
      status: 'Confirmada',
      color: 'bg-blue-500 text-white border-blue-600',
      total: 660.0
    },
    {
      id: 'b-5',
      code: '#R-4919',
      roomNumber: '201',
      guestName: 'Long Stay VIP (Elena)',
      startDayIndex: 0,
      durationDays: 6,
      status: 'In-House',
      color: 'bg-indigo-600 text-white border-indigo-700',
      total: 870.0
    },
    {
      id: 'b-6',
      code: 'MTTO-202',
      roomNumber: '202',
      guestName: 'Mantenimiento Climatización',
      startDayIndex: 0,
      durationDays: 8,
      status: 'Mantenimiento',
      color: 'bg-rose-100 text-rose-800 border-rose-300 font-medium',
      total: 0
    },
    {
      id: 'b-7',
      code: '#R-4922',
      roomNumber: '203',
      guestName: 'M. Johnson',
      startDayIndex: 2,
      durationDays: 4,
      status: 'Confirmada',
      color: 'bg-blue-600 text-white border-blue-700',
      total: 520.0
    },
    {
      id: 'b-8',
      code: '#R-4925',
      roomNumber: '301',
      guestName: 'Walk-in Guest',
      startDayIndex: 0,
      durationDays: 2,
      status: 'In-House',
      color: 'bg-emerald-600 text-white border-emerald-700',
      total: 310.0
    },
    {
      id: 'b-9',
      code: '#R-4930',
      roomNumber: '302',
      guestName: 'Ocean VIP Suite (Familia Gómez)',
      startDayIndex: 4,
      durationDays: 3,
      status: 'Confirmada',
      color: 'bg-violet-600 text-white border-violet-700',
      total: 630.0
    },
  ];

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor === 'all') return true;
    return r.floor === selectedFloor;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'timeline' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">calendar_view_week</span>
              <span>Línea de Tiempo</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">format_list_bulleted</span>
              <span>Lista de Ocupación</span>
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700">
            <button className="hover:text-blue-600 p-0.5">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span>Semana: 14 Oct - 21 Oct 2023</span>
            <button className="hover:text-blue-600 p-0.5">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Floor Filter & New Booking */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Piso:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['all', 1, 2, 3] as const).map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedFloor === floor ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {floor === 'all' ? 'Todos' : `Piso ${floor}`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenNewBooking}
            className="px-4 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* Timeline Rack Table */}
      {viewMode === 'timeline' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[950px]">
              {/* Table Header: Days of the week */}
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-600">
                  <th className="w-56 p-4 text-left font-bold text-slate-800 sticky left-0 bg-slate-50/95 z-10 border-r border-slate-200">
                    Habitación
                  </th>
                  {days.map((day, idx) => (
                    <th
                      key={idx}
                      className={`p-3 text-center font-semibold w-24 border-r border-slate-200/80 ${
                        day.isToday ? 'bg-blue-50/80 text-[#004ac6]' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] tracking-wider uppercase text-slate-400">{day.dayName}</span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                            day.isToday ? 'bg-[#004ac6] text-white shadow-xs' : 'text-slate-800'
                          }`}
                        >
                          {day.dayNumber}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body: Rooms & Booking Gantt Bars */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRooms.map((room) => {
                  const roomBookings = bookings.filter((b) => b.roomNumber === room.number);

                  return (
                    <tr key={room.id} className="h-16 hover:bg-slate-50/50 transition">
                      {/* Room Column */}
                      <td className="p-3 sticky left-0 bg-white z-10 border-r border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-sm">{room.number}</span>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  room.status === 'limpia'
                                    ? 'bg-emerald-500'
                                    : room.status === 'sucia'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                title={`Estado: ${room.status}`}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[130px]">{room.type}</p>
                          </div>
                          <span className="text-[11px] font-data-mono font-semibold text-slate-400">
                            ${room.rate}
                          </span>
                        </div>
                      </td>

                      {/* 8 Day Slots (relative container for Gantt bars) */}
                      <td colSpan={8} className="p-0 relative">
                        <div className="grid grid-cols-8 h-16 relative">
                          {/* Grid Column lines */}
                          {days.map((d, colIdx) => (
                            <div
                              key={colIdx}
                              className={`h-full border-r border-slate-100 ${
                                d.isToday ? 'bg-blue-50/20' : ''
                              }`}
                            />
                          ))}

                          {/* Render Bookings on this Room */}
                          {roomBookings.map((b) => {
                            const leftPercent = (b.startDayIndex / 8) * 100;
                            const widthPercent = (b.durationDays / 8) * 100;

                            return (
                              <div
                                key={b.id}
                                onClick={() => setSelectedBooking(b)}
                                className={`absolute top-2.5 bottom-2.5 rounded-xl px-2.5 py-1 text-xs font-medium border shadow-xs cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-between overflow-hidden z-2 ${b.color}`}
                                style={{
                                  left: `calc(${leftPercent}% + 3px)`,
                                  width: `calc(${widthPercent}% - 6px)`,
                                }}
                              >
                                <div className="truncate min-w-0 pr-1">
                                  <p className="font-bold text-[11px] leading-tight truncate">{b.guestName}</p>
                                  <p className="text-[9px] opacity-90 truncate">{b.code}</p>
                                </div>
                                <span className="text-[10px] font-data-mono font-semibold shrink-0 opacity-80">
                                  {b.total > 0 ? `$${b.total}` : ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Habitación</th>
                  <th className="p-3">Huésped</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Total Estancia</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold font-data-mono text-[#004ac6]">{b.code}</td>
                    <td className="p-3 font-semibold text-slate-800">Hab {b.roomNumber}</td>
                    <td className="p-3 text-slate-700 font-medium">{b.guestName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 font-data-mono font-bold text-slate-800">${b.total}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs text-[#004ac6] hover:underline font-semibold"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#004ac6] font-data-mono">{selectedBooking.code}</span>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="my-4 space-y-2">
              <h3 className="text-base font-bold text-slate-900">{selectedBooking.guestName}</h3>
              <p className="text-xs text-slate-600">Habitación: <span className="font-bold">Hab {selectedBooking.roomNumber}</span></p>
              <p className="text-xs text-slate-600">Estado: <span className="font-semibold text-blue-600">{selectedBooking.status}</span></p>
              <p className="text-xs text-slate-600">Duración: <span className="font-semibold">{selectedBooking.durationDays} noches</span></p>
              <p className="text-xs text-slate-600">Total Reservado: <span className="font-bold text-slate-900 font-data-mono">${selectedBooking.total}</span></p>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  alert(`Check-in procesado para ${selectedBooking.guestName} en Hab ${selectedBooking.roomNumber}`);
                  setSelectedBooking(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#004ac6] hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                Registrar Check-In
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
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
