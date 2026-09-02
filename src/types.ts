export type ScreenId =
  | 'login'
  | 'dashboard'
  | 'room-rack'
  | 'reservas'
  | 'nueva-reserva'
  | 'habitaciones'
  | 'huespedes'
  | 'pos'
  | 'facturacion'
  | 'reportes'
  | 'panel-admin';

export type UserRole = 'admin' | 'receptionist';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  shift: string;
  avatar: string;
  accessLevel: 'Super Admin / Acceso Total' | 'Recepción Operativa';
}

export interface Employee {
  id: string;
  name: string;
  role: 'Recepcionista' | 'Housekeeping' | 'Mantenimiento' | 'Auditor Nocturno' | 'Gerente Alimentos';
  shift: 'Mañana (06:00 - 14:00)' | 'Tarde (14:00 - 22:00)' | 'Noche (22:00 - 06:00)';
  status: 'Activo' | 'Descanso' | 'Vacaciones';
  avatar: string;
  phone: string;
  pin: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Seguridad' | 'Tarifas' | 'Facturación' | 'Habitaciones' | 'Reservas';
  details: string;
  severity: 'normal' | 'alerta' | 'critica';
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  usageCount: number;
  active: boolean;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: 'limpia' | 'sucia' | 'mantenimiento';
  rate: number;
  capacity: string;
  image?: string;
  description?: string;
}

export interface Reservation {
  id: string;
  code: string;
  guestName: string;
  guestInitials: string;
  adults: number;
  children: number;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'In-House' | 'Confirmada' | 'Pendiente' | 'Cancelada';
  origin: 'Web Directa' | 'Booking.com' | 'Expedia' | 'Walk-in' | 'Directo';
  total: number;
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  priority?: 'Alta' | 'Media' | 'Baja';
}

export interface Guest {
  id: string;
  name: string;
  country: string;
  stays: number;
  lastVisit: string;
  status: 'VIP' | 'Regular' | 'Atención' | 'Familia' | 'Retorno' | 'Lista Negra';
  photo?: string;
  initials?: string;
  email: string;
  phone: string;
  documentId: string;
  notes?: string;
}

export interface PosProduct {
  id: string;
  name: string;
  price: number;
  category: 'Restaurante' | 'Minibar' | 'Spa & Relax' | 'In-Room Dining';
  image?: string;
  icon?: string;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
}

export interface Invoice {
  id: string;
  folio: string;
  time: string;
  client: string;
  room?: string;
  method: 'Tarjeta' | 'Efectivo' | '-';
  total: number;
  status: 'Emitida' | 'Anulada';
  category: 'Alojamiento' | 'Alimentos y Bebidas' | 'Otros Servicios';
}
