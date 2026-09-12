import React, { useState } from 'react';
import { Room, Reservation, ScreenId } from '../types';

interface NuevaReservaWizardProps {
  rooms: Room[];
  onComplete: (newRes: Reservation) => void;
  onCancel: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const NuevaReservaWizard: React.FC<NuevaReservaWizardProps> = ({
  rooms,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkIn, setCheckIn] = useState('2023-10-18');
  const [checkOut, setCheckOut] = useState('2023-10-22');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState<'Todas' | 'Suite' | 'Doble' | 'Simple'>('Todas');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('214');

  const [guestName, setGuestName] = useState('Carlos Mendoza');
  const [guestEmail, setGuestEmail] = useState('carlos.mendoza@email.com');
  const [guestPhone, setGuestPhone] = useState('+34 612 345 678');
  const [documentId, setDocumentId] = useState('DNI-ES8729104');
  const [specialRequests, setSpecialRequests] = useState('Llegada estimada a las 15:00. Solicita piso alto y cuna adicional.');

  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Transferencia' | 'Efectivo'>('Tarjeta');
  const [advancePayment, setAdvancePayment] = useState(true);

  const roomCards = [
    {
      id: '214',
      number: '214',
      title: 'Habitación 214 - Doble Superior',
      type: 'Doble Superior',
      category: 'Doble',
      capacity: '4 Adultos',
      rate: 120,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
      description: 'Ideal para familias o grupos pequeños. Dos camas queen y amplio espacio.',
      badge: 'Más Popular'
    },
    {
      id: '305',
      number: '305',
      title: 'Habitación 305 - Ejecutiva Simple',
      type: 'Ejecutiva Simple',
      category: 'Simple',
      capacity: '1 Adulto',
      rate: 95,
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&auto=format&fit=crop&q=80',
      description: 'Perfecta para estancias de negocios. Escritorio ergonómico y cafetera.',
    },
    {
      id: '401',
      number: '401',
      title: 'Habitación 401 - Suite Presidencial',
      type: 'Suite Presidencial',
      category: 'Suite',
      capacity: '2 Adultos',
      rate: 180,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
      description: 'Amplia suite con vista panorámica, cama king y baño de mármol con jacuzzi.',
      badge: 'Lujo VIP'
    },
  ];

  const selectedRoom = roomCards.find((r) => r.id === selectedRoomId) || roomCards[0];
  const nights = 4;
  const subtotal = selectedRoom.rate * nights;
  const taxes = subtotal * 0.1;
  const webDiscount = 20;
  const estimatedTotal = subtotal + taxes - webDiscount;
  const deposit = estimatedTotal * 0.5;

  const handleFinishBooking = () => {
    const initials = guestName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: `#R-${Math.floor(89000 + Math.random() * 1000)}`,
      guestName: guestName.trim() || 'Huésped Registrado',
      guestInitials: initials || 'HR',
      adults,
      children: childrenCount,
      roomNumber: selectedRoom.number,
      roomType: selectedRoom.type,
      checkIn: '18 Oct',
      checkOut: '22 Oct',
      status: 'Confirmada',
      origin: 'Web Directa',
      total: estimatedTotal
    };

    onComplete(newReservation);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-[#004ac6] flex items-center gap-1 mb-1 font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Volver a Reservas</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Crear Nueva Reserva</h1>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1 ? 'bg-[#004ac6] text-white' : 'bg-emerald-500 text-white'
            }`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-[#004ac6]' : 'text-slate-600'}`}>
              Estadía & Habitación
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#004ac6] text-white' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-[#004ac6]' : 'text-slate-400'}`}>
              Huésped
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-[#004ac6] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </span>
            <span className={`text-xs font-semibold ${step === 3 ? 'text-[#004ac6]' : 'text-slate-400'}`}>
              Confirmación
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">

          {step === 1 && (
            <div className="space-y-6">

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">calendar_month</span>
                  <span>1. Seleccionar Fechas y Ocupación</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Adultos</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#004ac6]"
                    >
                      <option value={1}>1 Adulto</option>
                      <option value={2}>2 Adultos</option>
                      <option value={3}>3 Adultos</option>
                      <option value={4}>4 Adultos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Niños</label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#004ac6]"
                    >
                      <option value={0}>0 Niños</option>
                      <option value={1}>1 Niño</option>
                      <option value={2}>2 Niños</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Habitaciones Disponibles para estas fechas</h2>
                    <p className="text-xs text-slate-500">Selecciona la habitación para ver amenidades y tarifa</p>
                  </div>
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                    {(['Todas', 'Suite', 'Doble', 'Simple'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedRoomCategory(cat)}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          selectedRoomCategory === cat ? 'bg-white text-[#004ac6] shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {roomCards
                    .filter((r) => selectedRoomCategory === 'Todas' || r.category === selectedRoomCategory)
                    .map((room) => {
                      const isSelected = selectedRoomId === room.id;
                      return (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`flex flex-col sm:flex-row rounded-2xl border p-4 gap-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#004ac6] bg-blue-50/40 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={room.image}
                              alt={room.title}
                              className="w-full h-full object-cover"
                            />
                            {room.badge && (
                              <span className="absolute top-2 left-2 bg-[#004ac6] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                {room.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">{room.title}</h3>
                                <div className="text-right">
                                  <span className="text-base font-extrabold text-[#004ac6] font-data-mono">
                                    ${room.rate}
                                  </span>
                                  <span className="text-[10px] text-slate-400"> / noche</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{room.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 mt-2 text-xs">
                              <span className="text-slate-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                                {room.capacity}
                              </span>
                              <span className={`font-semibold ${isSelected ? 'text-[#004ac6]' : 'text-slate-400'}`}>
                                {isSelected ? '✓ Seleccionada' : 'Click para elegir'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">person</span>
                <span>2. Información del Huésped Principal</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="ej. Carlos Mendoza"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    placeholder="carlos@ejemplo.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Documento / Pasaporte</label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="DNI / Pasaporte"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Peticiones Especiales u Observaciones</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Detalles sobre cuna, dieta, hora de llegada..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">credit_card</span>
                <span>3. Garantía y Modalidad de Pago</span>
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Tarjeta', label: 'Tarjeta de Crédito / POS', icon: 'credit_card' },
                  { id: 'Transferencia', label: 'Transferencia Bancaria', icon: 'account_balance' },
                  { id: 'Efectivo', label: 'Pago en Recepción', icon: 'payments' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                      paymentMethod === item.id
                        ? 'border-[#004ac6] bg-blue-50/50 text-[#004ac6] ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Requerir depósito anticipado (50%)</span>
                  <input
                    type="checkbox"
                    checked={advancePayment}
                    onChange={(e) => setAdvancePayment(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004ac6] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {advancePayment
                    ? `Se cargará un anticipo de $${deposit.toFixed(2)} y el resto se abonará durante el check-in.`
                    : 'La reserva quedará garantizada con tarjeta de crédito sin cargo inmediato.'}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Paso Anterior</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <span>Continuar</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishBooking}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
              >
                <span>Confirmar y Registrar Reserva</span>
                <span className="material-symbols-outlined text-sm">check_circle</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Resumen de la Reserva</h3>
            <span className="text-[10px] font-bold text-[#004ac6] bg-blue-50 px-2 py-0.5 rounded-full">
              4 Noches
            </span>
          </div>

          <div>
            <img
              src={selectedRoom.image}
              alt={selectedRoom.title}
              className="w-full h-32 object-cover rounded-xl mb-2"
            />
            <h4 className="text-sm font-bold text-slate-900">{selectedRoom.title}</h4>
            <p className="text-xs text-slate-500">Ocupación: {adults} Adultos {childrenCount > 0 ? `, ${childrenCount} Niños` : ''}</p>
          </div>

          <div className="space-y-2 text-xs py-3 border-y border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Fechas de estadía:</span>
              <span className="font-semibold text-slate-800">18 Oct - 22 Oct 2023</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tarifa ({nights} noches @ ${selectedRoom.rate}):</span>
              <span className="font-data-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Impuestos y tasas (10%):</span>
              <span className="font-data-mono font-medium">${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Descuento Web Directa:</span>
              <span className="font-data-mono font-semibold">-${webDiscount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-slate-800">Total Estimado</span>
              <span className="text-2xl font-black text-[#004ac6] font-data-mono">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Anticipo requerido (50%): <strong className="text-slate-700">${deposit.toFixed(2)}</strong>
            </p>
          </div>

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Continuar a Datos de Huésped →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
