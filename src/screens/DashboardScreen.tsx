import React, { useState } from 'react';
import { TaskItem, ScreenId } from '../types';

interface DashboardScreenProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, subtitle: string, priority?: 'Alta' | 'Media' | 'Baja') => void;
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onNavigate
}) => {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubtitle, setTaskSubtitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [activeDayHover, setActiveDayHover] = useState<string | null>(null);

  const weeklyData = [
    { day: 'Lun', rate: 74, guests: 92 },
    { day: 'Mar', rate: 78, guests: 96 },
    { day: 'Mié', rate: 85, guests: 104 },
    { day: 'Jue', rate: 88, guests: 108 },
    { day: 'Vie', rate: 94, guests: 115 },
    { day: 'Sáb', rate: 98, guests: 120 },
    { day: 'Dom', rate: 82, guests: 101 },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(taskTitle.trim(), taskSubtitle.trim() || 'Sin detalles', taskPriority);
    setTaskTitle('');
    setTaskSubtitle('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#004ac6] to-[#2563eb] rounded-3xl p-6 text-white shadow-lg shadow-blue-700/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              Turno Mañana • Recepción
            </span>
            <span className="text-xs text-blue-100">Lunes, 14 Octubre 2023</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">¡Buen día, Equipo Orchid!</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            La ocupación actual del hotel se mantiene sólida en 82%. Tenemos 24 check-ins programados para el día y 2 llegadas VIP.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('room-rack')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            <span>Ver Room Rack</span>
          </button>
          <button
            onClick={() => onNavigate('nueva-reserva')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#004ac6] hover:bg-blue-50 text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Nueva Reserva</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ocupación Actual</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">hotel</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-data-mono">82%</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +4.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">98 de 120 habitaciones ocupadas</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RevPAR</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-data-mono">$145.90</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Ingreso por hab. disponible</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ADR (Tarifa Prom.)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">sell</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-data-mono">$178.00</span>
              <span className="text-xs font-bold text-amber-600 flex items-center">
                <span className="material-symbols-outlined text-sm">trending_flat</span>
                ±0.5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Precio promedio por noche</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flujo Diario (Hoy)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">sync_alt</span>
            </div>
          </div>
          <div className="my-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Check-ins
              </span>
              <span className="font-bold text-slate-900 font-data-mono">24 / 30</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Check-outs
              </span>
              <span className="font-bold text-slate-900 font-data-mono">12 / 15</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Restan 6 llegadas</span>
            <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => onNavigate('reservas')}>
              Ver lista →
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ocupación Semanal Proyectada</h2>
              <p className="text-xs text-slate-500">Histórico de la semana actual con meta fijada en 80%</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#004ac6]" />
                Ocupación
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-500" />
                Meta (80%)
              </span>
            </div>
          </div>

          <div className="pt-8 pb-4">
            <div className="relative h-56 flex items-end justify-between gap-3 px-2">

              <div
                className="absolute w-full border-b-2 border-dashed border-emerald-400/80 pointer-events-none z-10"
                style={{ bottom: '80%' }}
              >
                <span className="absolute right-0 -top-5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Target 80%
                </span>
              </div>

              {weeklyData.map((item) => {
                const isHovered = activeDayHover === item.day;
                const isAboveTarget = item.rate >= 80;
                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setActiveDayHover(item.day)}
                    onMouseLeave={() => setActiveDayHover(null)}
                  >

                    <div
                      className={`transition-all duration-200 mb-2 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="bg-slate-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg text-center whitespace-nowrap">
                        <p className="font-bold">{item.rate}% Ocupación</p>
                        <p className="text-slate-300">{item.guests} huéspedes</p>
                      </div>
                    </div>

                    <div className="w-full max-w-[48px] bg-slate-100 rounded-xl overflow-hidden flex flex-col justify-end p-1 transition">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isAboveTarget
                            ? 'bg-gradient-to-t from-[#004ac6] to-blue-500 group-hover:from-blue-700 group-hover:to-blue-400 shadow-md shadow-blue-500/20'
                            : 'bg-gradient-to-t from-slate-400 to-slate-300 group-hover:from-slate-500'
                        }`}
                        style={{ height: `${item.rate}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-semibold mt-3 ${
                        isHovered ? 'text-[#004ac6]' : 'text-slate-600'
                      }`}
                    >
                      {item.day}
                    </span>
                    <span className="text-[11px] font-data-mono text-slate-400">{item.rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Máximo semanal: Sábado (98%)</span>
            <span className="text-[#004ac6] font-semibold cursor-pointer" onClick={() => onNavigate('reportes')}>
              Ver reporte detallado de ingresos →
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tareas Pendientes</h2>
                <p className="text-xs text-slate-500">
                  {tasks.filter((t) => !t.completed).length} pendientes de {tasks.length}
                </p>
              </div>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="w-8 h-8 rounded-xl bg-blue-50 text-[#004ac6] hover:bg-blue-100 flex items-center justify-center transition"
                title="Agregar Tarea"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[310px] overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="py-3 flex items-start gap-3 group hover:bg-slate-50/70 p-2 rounded-xl transition"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="mt-1 w-4 h-4 rounded text-[#004ac6] border-slate-300 focus:ring-[#004ac6] cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.priority === 'Alta' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">
                          Alta
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        task.completed ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {task.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:text-[#004ac6] hover:border-blue-300 hover:bg-blue-50/50 transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Nueva Asignación de Turno</span>
            </button>
          </div>
        </div>
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Agregar Nueva Tarea de Turno</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la tarea</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="ej. Confirmar cuna en Hab 214"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle / Habitación</label>
                <input
                  type="text"
                  value={taskSubtitle}
                  onChange={(e) => setTaskSubtitle(e.target.value)}
                  placeholder="ej. Habitación 214, Familia Gómez"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridad</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl shadow-xs"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
