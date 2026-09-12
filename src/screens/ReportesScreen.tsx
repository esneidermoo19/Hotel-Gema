import React, { useState } from 'react';
import { ScreenId } from '../types';

interface ReportesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ReportesScreen: React.FC<ReportesScreenProps> = () => {
  const [activeMonthHover, setActiveMonthHover] = useState<string | null>(null);

  const monthlyMetrics = [
    { month: 'Ene', occ: 62, rev: 38 },
    { month: 'Feb', occ: 68, rev: 42 },
    { month: 'Mar', occ: 74, rev: 46 },
    { month: 'Abr', occ: 80, rev: 50 },
    { month: 'May', occ: 85, rev: 54 },
    { month: 'Jun', occ: 88, rev: 58 },
    { month: 'Jul', occ: 95, rev: 64 },
    { month: 'Ago', occ: 92, rev: 62 },
    { month: 'Sep', occ: 78, rev: 49 },
    { month: 'Oct', occ: 82, rev: 52 },
    { month: 'Nov', occ: 71, rev: 44 },
    { month: 'Dic', occ: 89, rev: 60 },
  ];

  const topRooms = [
    { rank: 1, room: 'Suite Presidencial 401', revpar: '$240.00', occ: '88%', revenue: '$7,200' },
    { rank: 2, room: 'Ocean Suite 302', revpar: '$195.00', occ: '82%', revenue: '$5,850' },
    { rank: 3, room: 'Deluxe King 101', revpar: '$160.00', occ: '91%', revenue: '$4,800' },
    { rank: 4, room: 'Deluxe King 201', revpar: '$152.00', occ: '85%', revenue: '$4,560' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reportes Ejecutivos & Indicadores KPI</h1>
          <p className="text-xs text-slate-500 mt-0.5">Rendimiento financiero, RevPAR, ADR y matriz anual de ocupación</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl">
            Periodo: <strong className="text-slate-900">Año 2023 (YTD)</strong>
          </div>
          <button
            onClick={() => alert("Exportando dossier ejecutivo de KPIs en formato PDF...")}
            className="px-4 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RevPAR Global</span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-data-mono">$124.50</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+5.2% vs mes anterior</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Ingreso por hab. total disponible</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ADR (Tarifa Prom.)</span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-data-mono">$185.00</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+3.1% vs mes anterior</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Promedio facturado por noche ocupada</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ocupación Mensual</span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-data-mono">68.2%</span>
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mt-1">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span>-1.4% vs mes anterior</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Dentro de la meta establecida</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ingreso Total Mes</span>
          <div className="my-2">
            <span className="text-3xl font-black text-[#004ac6] font-data-mono">$48,290</span>
            <div className="flex items-center gap-1 text-slate-600 text-xs font-semibold mt-1">
              <span>Meta: $55,000 (87.8%)</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
            <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '87.8%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Evolución Anual: Ocupación vs Ingresos</h2>
              <p className="text-xs text-slate-500">Comparativa mensual de porcentaje y miles de USD ($k)</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#004ac6]" />
                Ocupación (%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                Ingresos ($k)
              </span>
            </div>
          </div>

          <div className="pt-8 pb-4">
            <div className="h-60 flex items-end justify-between gap-2 px-1">
              {monthlyMetrics.map((item) => {
                const isHovered = activeMonthHover === item.month;
                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setActiveMonthHover(item.month)}
                    onMouseLeave={() => setActiveMonthHover(null)}
                  >

                    <div
                      className={`transition-all duration-200 mb-2 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md shadow-lg text-center whitespace-nowrap">
                        <p className="font-bold">{item.occ}% Ocup.</p>
                        <p className="text-emerald-300 font-data-mono">${item.rev}k USD</p>
                      </div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-full pb-1">

                      <div
                        className="w-2.5 sm:w-3.5 bg-gradient-to-t from-[#004ac6] to-blue-500 rounded-t-md transition-all group-hover:brightness-110"
                        style={{ height: `${item.occ}%` }}
                      />

                      <div
                        className="w-2.5 sm:w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110"
                        style={{ height: `${(item.rev / 70) * 100}%` }}
                      />
                    </div>

                    <span
                      className={`text-[11px] font-semibold mt-2 ${
                        isHovered ? 'text-[#004ac6]' : 'text-slate-600'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Temporada Alta pico: Julio (95% Ocupación / $64k)</span>
            <span className="text-[#004ac6] font-semibold">Proyección Q4: +8.4%</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Mix de Canales de Venta</h2>
              <p className="text-xs text-slate-500">Distribución de reservas por origen</p>
            </div>

            <div className="flex items-center justify-center my-6 relative">
              <svg width="150" height="150" viewBox="0 0 42 42" className="rotate-[-90deg]">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />

                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#004ac6"
                  strokeWidth="6"
                  strokeDasharray="40 60"
                  strokeDashoffset="0"
                />

                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeDasharray="35 65"
                  strokeDashoffset="-40"
                />

                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#60a5fa"
                  strokeWidth="6"
                  strokeDasharray="15 85"
                  strokeDashoffset="-75"
                />

                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#93c5fd"
                  strokeWidth="6"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Canal #1</span>
                <span className="text-sm font-black text-[#004ac6]">Web 40%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]" />
                  Web Directa
                </span>
                <span className="font-bold text-slate-900">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  Booking.com (OTA)
                </span>
                <span className="font-bold text-slate-900">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                  Corporativo / Agencias
                </span>
                <span className="font-bold text-slate-900">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]" />
                  Walk-in / Directo
                </span>
                <span className="font-bold text-slate-900">10%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Ahorro estimado en comisiones OTAs: <strong className="text-emerald-600">$4,850 USD</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Top Habitaciones por RevPAR</h3>
            <p className="text-xs text-slate-500">Unidades de mayor rentabilidad neta acumulada</p>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {topRooms.map((room) => (
              <div key={room.rank} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    {room.rank}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{room.room}</p>
                    <p className="text-[10px] text-slate-400">Ocupación: {room.occ}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-[#004ac6] font-data-mono">{room.revpar}</p>
                  <p className="text-[10px] text-slate-400">{room.revenue} facturados</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Matriz de Ocupación Anual (Heatmap)</h3>
                <p className="text-xs text-slate-500">Densidad de ocupación por semanas del año</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                52 Semanas
              </span>
            </div>

            <div className="my-5 grid grid-cols-13 gap-1.5">
              {Array.from({ length: 52 }).map((_, idx) => {

                const intensity = (idx * 7 + 13) % 100;
                let colorClass = 'bg-slate-100';
                if (intensity > 85) colorClass = 'bg-[#004ac6]';
                else if (intensity > 65) colorClass = 'bg-blue-400';
                else if (intensity > 40) colorClass = 'bg-blue-200';
                else colorClass = 'bg-blue-50';

                return (
                  <div
                    key={idx}
                    className={`h-4.5 rounded-xs ${colorClass} hover:ring-2 hover:ring-slate-900 transition-all cursor-pointer`}
                    title={`Semana ${idx + 1}: ${intensity}% Ocupación`}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Baja (&lt;50%)</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-blue-50" />
              <span className="w-3 h-3 rounded-xs bg-blue-200" />
              <span className="w-3 h-3 rounded-xs bg-blue-400" />
              <span className="w-3 h-3 rounded-xs bg-[#004ac6]" />
            </div>
            <span>Alta (&gt;90%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
