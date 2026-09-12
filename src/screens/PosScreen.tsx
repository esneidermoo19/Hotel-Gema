import React, { useState } from 'react';
import { PosProduct, CartItem, Invoice, ScreenId } from '../types';

interface PosScreenProps {
  products: PosProduct[];
  onAddInvoice: (inv: Invoice) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const PosScreen: React.FC<PosScreenProps> = ({
  products,
  onAddInvoice
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Restaurante');
  const [selectedGuestRoom, setSelectedGuestRoom] = useState<{ room: string; name: string }>({
    room: '204',
    name: 'Eleanor Shellstrop',
  });

  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 1 },
  ]);

  const [notes, setNotes] = useState('Sin cebolla en sándwich, entregar caliente a habitación.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chargeSuccessMessage, setChargeSuccessMessage] = useState<string | null>(null);

  const categories = ['Restaurante', 'Minibar', 'Spa & Relax', 'In-Room Dining'];

  const handleAddToCart = (product: PosProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const serviceTax = subtotal * 0.1;
  const total = subtotal + serviceTax;

  const handleChargeToRoom = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const invoiceNumber = Math.floor(1025 + Math.random() * 50);
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        folio: `FAC-${invoiceNumber}`,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        client: selectedGuestRoom.name,
        room: `Hab ${selectedGuestRoom.room}`,
        method: 'Tarjeta',
        total: total,
        status: 'Emitida',
        category: selectedCategory === 'Spa & Relax' ? 'Otros Servicios' : 'Alimentos y Bebidas',
      };

      onAddInvoice(newInvoice);
      setChargeSuccessMessage(`¡Cargo de $${total.toFixed(2)} procesado exitosamente a Habitación ${selectedGuestRoom.room}!`);
      setCart([]);
      setTimeout(() => setChargeSuccessMessage(null), 5000);
    }, 900);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Punto de Venta (POS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Cargos a habitación, consumos de restaurante, minibar y spa</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <span className="material-symbols-outlined text-blue-600 text-lg">room_service</span>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cargar a Folio de:</span>
            <select
              value={`${selectedGuestRoom.room}-${selectedGuestRoom.name}`}
              onChange={(e) => {
                const [r, n] = e.target.value.split('-');
                setSelectedGuestRoom({ room: r, name: n });
              }}
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="204-Eleanor Shellstrop">Hab 204 - Eleanor Shellstrop (In-House)</option>
              <option value="101-Alexander Smith">Hab 101 - Alexander Smith (VIP)</option>
              <option value="304-Maria Garcia">Hab 304 - María García (In-House)</option>
              <option value="Restaurante-Cliente Walk-in">Venta Directa - Cliente Externo</option>
            </select>
          </div>
        </div>
      </div>

      {chargeSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span>{chargeSuccessMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Registrado en Facturación</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-5">

          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#004ac6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products
              .filter((p) => selectedCategory === 'Restaurante' || p.category === selectedCategory)
              .map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 mb-3 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#004ac6] flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">{product.icon || 'fastfood'}</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md font-data-mono">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#004ac6] transition">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{product.category}</p>
                  </div>

                  <button
                    type="button"
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 group-hover:bg-[#004ac6] group-hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Agregar</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Comanda de Consumo</h3>
              <p className="text-[11px] text-blue-600 font-semibold">Hab. {selectedGuestRoom.room} • {selectedGuestRoom.name}</p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                El carrito está vacío. Haz clic en un producto para agregarlo a la comanda.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400 font-data-mono">${item.product.price.toFixed(2)} c/u</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-red-600 font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-800 font-data-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-blue-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-slate-900 font-data-mono w-14 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Notas de Servicio</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones para cocina o servicio..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-data-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Servicio & Tasa (10%):</span>
              <span className="font-data-mono font-medium">${serviceTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-900">Total a Cargar:</span>
              <span className="text-xl font-black text-[#004ac6] font-data-mono">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleChargeToRoom}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 transition ${
              cart.length === 0 || isProcessing
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#004ac6] hover:bg-[#2563eb] active:scale-[0.99]'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Procesando Cargo a Habitación...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>Cargar a Habitación {selectedGuestRoom.room}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
