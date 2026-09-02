import React, { useState } from 'react';
import { Invoice, ScreenId, UserProfile } from '../types';

interface FacturacionScreenProps {
  invoices: Invoice[];
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onVoidInvoice?: (id: string, reason: string) => void;
}

export const FacturacionScreen: React.FC<FacturacionScreenProps> = ({
  invoices,
  currentUser,
  onVoidInvoice,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [countedCash, setCountedCash] = useState<string>('3150.00');
  const [cashierNotes, setCashierNotes] = useState('Turno cerrado sin novedades. Cuadratura exacta de caja.');
  const [shiftClosedSuccess, setShiftClosedSuccess] = useState(false);
  const [initialCashFund, setInitialCashFund] = useState<number>(500.0);
  const [showFundModal, setShowFundModal] = useState(false);
  const [newFundInput, setNewFundInput] = useState<string>('500.00');

  // Void modal state
  const [invoiceToVoid, setInvoiceToVoid] = useState<Invoice | null>(null);
  const [voidReason, setVoidReason] = useState('Error de digitación en sistema POS');

  const totalSales = invoices
    .filter((inv) => inv.status === 'Emitida')
    .reduce((sum, inv) => sum + inv.total, 0);

  const cardSales = invoices
    .filter((inv) => inv.status === 'Emitida' && inv.method === 'Tarjeta')
    .reduce((sum, inv) => sum + inv.total, 0);

  const cashSales = invoices
    .filter((inv) => inv.status === 'Emitida' && inv.method === 'Efectivo')
    .reduce((sum, inv) => sum + inv.total, 0);

  const expectedTotalCash = initialCashFund + cashSales;
  const cashDifference = parseFloat(countedCash || '0') - expectedTotalCash;

  const handleConfirmShiftClosure = (e: React.FormEvent) => {
    e.preventDefault();
    setShiftClosedSuccess(true);
    setTimeout(() => {
      setShowCloseShiftModal(false);
      setShiftClosedSuccess(false);
      alert("¡Turno Mañana cerrado exitosamente! Reporte Z enviado a Contabilidad.");
    }, 1200);
  };


  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#004ac6] text-xs font-bold">
              Turno Mañana (06:00 - 14:00)
            </span>
            <span className="text-xs text-slate-500">
              Operador: {currentUser ? currentUser.name : 'Sofía Ramírez'}
            </span>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shield</span>
                SUPERVISIÓN FISCAL ADMIN
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">Facturación y Cierre de Turno</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Imprimiendo resumen previo de caja (Reporte X)...")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Reporte X Previo</span>
          </button>
          <button
            onClick={() => setShowCloseShiftModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">lock_clock</span>
            <span>Cerrar Turno de Caja</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ventas Totales</span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 font-data-mono">
              ${(totalSales + 8500).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">45 transacciones registradas</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Cash in Drawer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Efectivo en Caja</span>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-600 font-data-mono">
              ${expectedTotalCash.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Incluye fondo inicial de $500.00</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* POS Cards */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Tarjetas POS</span>
          <div className="my-2">
            <span className="text-2xl font-black text-blue-600 font-data-mono">
              ${(cardSales + 6000).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">32 operaciones electrónicas</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Taxes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Impuestos IVA (19%)</span>
          <div className="my-2">
            <span className="text-2xl font-black text-purple-600 font-data-mono">$2,273.94</span>
            <p className="text-[11px] text-slate-500 mt-1">Desglose fiscal del turno</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Invoices Table on Left (2 cols), Breakdown on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Invoices Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Últimos Comprobantes Emitidos</h2>
              <p className="text-xs text-slate-500">Facturas, boletas de servicio y cargos a folios</p>
            </div>
            <span className="text-xs text-[#004ac6] font-semibold bg-blue-50 px-2.5 py-1 rounded-full">
              {invoices.length} Comprobantes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">FOLIO</th>
                  <th className="p-3.5">HORA</th>
                  <th className="p-3.5">CLIENTE / HAB</th>
                  <th className="p-3.5">MÉTODO</th>
                  <th className="p-3.5">TOTAL</th>
                  <th className="p-3.5">ESTADO</th>
                  <th className="p-3.5 text-right">DETALLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold font-data-mono text-[#004ac6]">{inv.folio}</td>
                    <td className="p-3.5 text-slate-500 font-data-mono">{inv.time}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{inv.client}</p>
                      {inv.room && <p className="text-[10px] text-slate-400">{inv.room}</p>}
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-700 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-slate-400">
                          {inv.method === 'Tarjeta' ? 'credit_card' : inv.method === 'Efectivo' ? 'payments' : 'cancel'}
                        </span>
                        {inv.method}
                      </span>
                    </td>
                    <td className="p-3.5 font-data-mono font-bold text-slate-900">
                      ${inv.total.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          inv.status === 'Emitida'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Imprimiendo comprobante fiscal ${inv.folio} para ${inv.client}`)}
                        className="text-slate-400 hover:text-[#004ac6] p-1 rounded transition"
                        title="Reimprimir Comprobante"
                      >
                        <span className="material-symbols-outlined text-sm">print</span>
                      </button>

                      {/* Void Button (Admin Superpower) */}
                      {inv.status === 'Emitida' && (
                        <button
                          onClick={() => {
                            if (isAdmin) {
                              setInvoiceToVoid(inv);
                            } else {
                              alert("ACCESO DENEGADO: La anulación de comprobantes fiscales requiere autorización y perfil de Administrador.");
                            }
                          }}
                          className={`p-1 rounded transition flex items-center ${
                            isAdmin
                              ? 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                              : 'text-slate-300 hover:text-slate-400 cursor-not-allowed'
                          }`}
                          title={isAdmin ? "Anular Comprobante (Supervisión Fiscal)" : "Anulación bloqueada para Recepción"}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isAdmin ? 'cancel' : 'lock'}
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Breakdown & Cash Drawer */}
        <div className="space-y-6">
          {/* Income Breakdown Donut SVG Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Desglose de Ingresos</h3>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center py-2 relative">
              <svg width="140" height="140" viewBox="0 0 42 42" className="rotate-[-90deg]">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                {/* Alojamiento 75% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#004ac6"
                  strokeWidth="6"
                  strokeDasharray="75 25"
                  strokeDashoffset="0"
                />
                {/* Alimentos 18% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeDasharray="18 82"
                  strokeDashoffset="-75"
                />
                {/* Otros 7% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#60a5fa"
                  strokeWidth="6"
                  strokeDasharray="7 93"
                  strokeDashoffset="-93"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400">Total</span>
                <span className="text-sm font-black text-slate-900 font-data-mono">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]" />
                  Alojamiento
                </span>
                <span className="font-bold text-slate-900">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  Alimentos y Bebidas
                </span>
                <span className="font-bold text-slate-900">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                  Otros Servicios / Spa
                </span>
                <span className="font-bold text-slate-900">7%</span>
              </div>
            </div>
          </div>

          {/* Cash Drawer Reconciliation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Fondo de Caja</h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowFundModal(true)}
                  className="text-[10px] font-bold text-[#004ac6] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">tune</span>
                  Ajustar Fondo
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Fondo Inicial Asignado:</span>
                <span className="font-data-mono font-medium">${initialCashFund.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Efectivo Recaudado:</span>
                <span className="font-data-mono font-medium">${cashSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">Total Efectivo Físico:</span>
                <span className="text-base font-extrabold text-emerald-600 font-data-mono">
                  ${expectedTotalCash.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Initial Cash Fund Modal (Admin only) */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">tune</span>
                <h3 className="text-sm font-bold text-slate-900">Ajustar Fondo Fijo de Caja</h3>
              </div>
              <button onClick={() => setShowFundModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="my-4 space-y-3 text-xs">
              <p className="text-slate-500">
                Define el monto base entregado al cajero para dar vuelto al inicio de turno.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto de Fondo ($)</label>
                <input
                  type="number"
                  step="50"
                  value={newFundInput}
                  onChange={(e) => setNewFundInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-data-mono text-slate-900 font-bold"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowFundModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(newFundInput);
                  if (!isNaN(val) && val >= 0) {
                    setInitialCashFund(val);
                    setShowFundModal(false);
                  }
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#004ac6] hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                Guardar Fondo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Void Invoice Confirmation Modal (Admin Superpower) */}
      {invoiceToVoid && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">warning</span>
                <h3 className="text-sm font-bold text-slate-900">Anulación Fiscal de Folio (Admin)</h3>
              </div>
              <button onClick={() => setInvoiceToVoid(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-rose-900">Folio: {invoiceToVoid.folio}</span>
                  <span className="font-data-mono text-rose-900">${invoiceToVoid.total.toFixed(2)}</span>
                </div>
                <p className="text-rose-700 text-[11px]">Cliente: {invoiceToVoid.client} {invoiceToVoid.room ? `• ${invoiceToVoid.room}` : ''}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo de Anulación Oficial</label>
                <select
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <option value="Error de digitación en sistema POS">Error de digitación en sistema POS</option>
                  <option value="Cancelación de consumo por cliente antes de entrega">Cancelación de consumo por cliente antes de entrega</option>
                  <option value="Facturación duplicada por fallo de terminal">Facturación duplicada por fallo de terminal</option>
                  <option value="Cortesía de Gerencia General autorizada a posteriori">Cortesía de Gerencia General autorizada a posteriori</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-400">
                Esta acción generará un asiento contable de reversa y se registrará en la bitácora de auditoría con la firma del Administrador.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInvoiceToVoid(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onVoidInvoice) {
                    onVoidInvoice(invoiceToVoid.id, voidReason);
                  }
                  setInvoiceToVoid(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirmar Anulación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Shift Reconciliation Modal */}
      {showCloseShiftModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Cierre de Turno de Recepción</h3>
              <button onClick={() => setShowCloseShiftModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmShiftClosure} className="my-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cajero en turno:</span>
                  <span className="font-bold text-slate-800">Sofía Ramírez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Efectivo Sistema Esperado:</span>
                  <span className="font-bold text-slate-900 font-data-mono">${expectedTotalCash.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Efectivo Físico Contado en Caja ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-data-mono text-slate-900 font-bold focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-blue-50/60 text-slate-700">
                <span>Diferencia de Cuadratura:</span>
                <span className={`font-data-mono font-bold ${cashDifference === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {cashDifference >= 0 ? `+$${cashDifference.toFixed(2)}` : `-$${Math.abs(cashDifference).toFixed(2)}`}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones de Cierre</label>
                <textarea
                  rows={2}
                  value={cashierNotes}
                  onChange={(e) => setCashierNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCloseShiftModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={shiftClosedSuccess}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  {shiftClosedSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      <span>Generando Reporte Z...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Confirmar Cierre y Emitir Z</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
