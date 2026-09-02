import { Room, Reservation, TaskItem, Guest, PosProduct, Invoice, Employee, AuditLogEntry, PromoCode, UserProfile } from '../types';

export const ADMIN_PROFILE: UserProfile = {
  id: 'usr-admin',
  name: 'Ing. Roberto Mendoza',
  role: 'admin',
  roleTitle: 'Gerente General & Administrador',
  shift: 'Dirección General (24/7)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  accessLevel: 'Super Admin / Acceso Total',
};

export const RECEPTIONIST_PROFILE: UserProfile = {
  id: 'usr-reception',
  name: 'Sofía Ramírez',
  role: 'receptionist',
  roleTitle: 'Recepcionista • T. Mañana',
  shift: 'Turno Mañana (06:00 - 14:00)',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  accessLevel: 'Recepción Operativa',
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sofía Ramírez',
    role: 'Recepcionista',
    shift: 'Mañana (06:00 - 14:00)',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+34 611 234 567',
    pin: '1234'
  },
  {
    id: 'emp-2',
    name: 'Marcos Toledo',
    role: 'Housekeeping',
    shift: 'Mañana (06:00 - 14:00)',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+34 622 345 678',
    pin: '2234'
  },
  {
    id: 'emp-3',
    name: 'Andrea Chen',
    role: 'Auditor Nocturno',
    shift: 'Noche (22:00 - 06:00)',
    status: 'Descanso',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+34 633 456 789',
    pin: '3345'
  },
  {
    id: 'emp-4',
    name: 'Carlos Soler',
    role: 'Mantenimiento',
    shift: 'Tarde (14:00 - 22:00)',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+34 644 567 890',
    pin: '4456'
  },
  {
    id: 'emp-5',
    name: 'Valeria Ramos',
    role: 'Gerente Alimentos',
    shift: 'Tarde (14:00 - 22:00)',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+34 655 678 901',
    pin: '5567'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '14:22:10 - Hoy',
    user: 'Sofía Ramírez (Recepcionista)',
    action: 'Creación de Reserva',
    category: 'Reservas',
    details: 'Reserva #R-89025 para Eleanor Shellstrop confirmada (Hab 204).',
    severity: 'normal'
  },
  {
    id: 'aud-2',
    timestamp: '13:50:45 - Hoy',
    user: 'Ing. Roberto Mendoza (Admin)',
    action: 'Ajuste de Tarifa Dinámica',
    category: 'Tarifas',
    details: 'Activado multiplicador de alta demanda (+15%) para Suite Presidencial y Deluxe King.',
    severity: 'alerta'
  },
  {
    id: 'aud-3',
    timestamp: '12:15:02 - Hoy',
    user: 'Ing. Roberto Mendoza (Admin)',
    action: 'Anulación de Comprobante Fiscal',
    category: 'Facturación',
    details: 'Comprobante FAC-1021 anulado por error tipográfico en razón social cliente.',
    severity: 'critica'
  },
  {
    id: 'aud-4',
    timestamp: '10:05:18 - Hoy',
    user: 'Andrea Chen (Auditor Nocturno)',
    action: 'Cierre de Auditoría Nocturna',
    category: 'Seguridad',
    details: 'Cierre contable completado. Balances cuadrados con 0.00 de discrepancia.',
    severity: 'normal'
  },
  {
    id: 'aud-5',
    timestamp: '08:30:00 - Hoy',
    user: 'Carlos Soler (Mantenimiento)',
    action: 'Bloqueo Fuera de Servicio (OOS)',
    category: 'Habitaciones',
    details: 'Habitación 202 bloqueada por orden de mantenimiento HVAC hasta el 16 de Octubre.',
    severity: 'alerta'
  }
];

export const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'pro-1',
    code: 'ORCHIDVIP25',
    discountPercent: 25,
    validUntil: '31 Dic 2023',
    usageCount: 42,
    active: true
  },
  {
    id: 'pro-2',
    code: 'CORP_DIRECT',
    discountPercent: 15,
    validUntil: '15 Nov 2023',
    usageCount: 18,
    active: true
  },
  {
    id: 'pro-3',
    code: 'WEEKEND_ESCAPE',
    discountPercent: 10,
    validUntil: '30 Oct 2023',
    usageCount: 65,
    active: true
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: '101',
    number: '101',
    type: 'Deluxe King',
    floor: 1,
    status: 'limpia',
    rate: 140,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    description: 'Cama King, balcón privado, vista a jardines interiores.'
  },
  {
    id: '102',
    number: '102',
    type: 'Standard Double',
    floor: 1,
    status: 'sucia',
    rate: 110,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80',
    description: 'Dos camas confortables, baño completo y escritorio de trabajo.'
  },
  {
    id: '103',
    number: '103',
    type: 'Suite Ejecutivo',
    floor: 1,
    status: 'mantenimiento',
    rate: 165,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    description: 'Espaciosa suite con sala de estar, minibar premium y cafetera Nespresso.'
  },
  {
    id: '201',
    number: '201',
    type: 'Deluxe King',
    floor: 2,
    status: 'limpia',
    rate: 145,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
    description: 'Habitación en piso alto, decoración contemporánea y ducha con hidromasaje.'
  },
  {
    id: '202',
    number: '202',
    type: 'Standard King (OOS)',
    floor: 2,
    status: 'mantenimiento',
    rate: 120,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop&q=80',
    description: 'Fuera de servicio por renovación de sistema de climatización.'
  },
  {
    id: '203',
    number: '203',
    type: 'Superior Queen',
    floor: 2,
    status: 'limpia',
    rate: 130,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80',
    description: 'Cama Queen de lujo con sábanas de 400 hilos y luz natural.'
  },
  {
    id: '205',
    number: '205',
    type: 'Standard Twin',
    floor: 2,
    status: 'sucia',
    rate: 115,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
    description: 'Dos camas individuales, ideal para colegas o amigos.'
  },
  {
    id: '214',
    number: '214',
    type: 'Doble Superior',
    floor: 2,
    status: 'limpia',
    rate: 120,
    capacity: '4 Adultos',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    description: 'Ideal para familias o grupos pequeños. Dos camas queen y amplio espacio.'
  },
  {
    id: '301',
    number: '301',
    type: 'Deluxe King',
    floor: 3,
    status: 'limpia',
    rate: 155,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    description: 'Piso silencioso con vista panorámica y cafetera italiana.'
  },
  {
    id: '302',
    number: '302',
    type: 'Ocean Suite',
    floor: 3,
    status: 'limpia',
    rate: 210,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80',
    description: 'Suite con ventanal panorámico, tina de hidromasaje y minibar de cortesía.'
  },
  {
    id: '305',
    number: '305',
    type: 'Ejecutiva Simple',
    floor: 3,
    status: 'limpia',
    rate: 95,
    capacity: '1 Adulto',
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop&q=80',
    description: 'Perfecta para viajeros de negocios. Espacio de trabajo dedicado y cama confortable.'
  },
  {
    id: '401',
    number: '401',
    type: 'Suite Presidencial',
    floor: 4,
    status: 'limpia',
    rate: 180,
    capacity: '2 Adultos',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    description: 'Amplia suite con vista panorámica, cama king y baño de mármol con jacuzzi.'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    code: '#R-89021',
    guestName: 'Alexander Smith',
    guestInitials: 'AS',
    adults: 2,
    children: 0,
    roomNumber: '304',
    roomType: 'Deluxe King',
    checkIn: '12 Oct',
    checkOut: '16 Oct',
    status: 'In-House',
    origin: 'Web Directa',
    total: 1250.0
  },
  {
    id: 'res-2',
    code: '#R-89022',
    guestName: 'Maria Garcia',
    guestInitials: 'MG',
    adults: 1,
    children: 1,
    roomNumber: '212',
    roomType: 'Standard Twin',
    checkIn: '15 Oct',
    checkOut: '18 Oct',
    status: 'Confirmada',
    origin: 'Booking.com',
    total: 480.0
  },
  {
    id: 'res-3',
    code: '#R-89023',
    guestName: 'James Taylor',
    guestInitials: 'JT',
    adults: 2,
    children: 0,
    roomNumber: 'Asignando...',
    roomType: 'Ocean Suite',
    checkIn: '16 Oct',
    checkOut: '21 Oct',
    status: 'Pendiente',
    origin: 'Directo',
    total: 2100.0
  },
  {
    id: 'res-4',
    code: '#R-89020',
    guestName: 'Elena Petrova',
    guestInitials: 'EP',
    adults: 1,
    children: 0,
    roomNumber: '-',
    roomType: 'Standard Single',
    checkIn: '14 Oct',
    checkOut: '15 Oct',
    status: 'Cancelada',
    origin: 'Expedia',
    total: 120.0
  },
  {
    id: 'res-5',
    code: '#R-89025',
    guestName: 'Eleanor Shellstrop',
    guestInitials: 'ES',
    adults: 1,
    children: 0,
    roomNumber: '204',
    roomType: 'Deluxe King',
    checkIn: '13 Oct',
    checkOut: '17 Oct',
    status: 'In-House',
    origin: 'Web Directa',
    total: 890.0
  },
  {
    id: 'res-6',
    code: '#R-89026',
    guestName: 'Carlos Mendoza',
    guestInitials: 'CM',
    adults: 2,
    children: 2,
    roomNumber: '214',
    roomType: 'Doble Superior',
    checkIn: '18 Oct',
    checkOut: '22 Oct',
    status: 'Confirmada',
    origin: 'Booking.com',
    total: 720.0
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Revisar discrepancias Housekeeping',
    subtitle: 'Habitaciones 204, 312, 405',
    completed: false
  },
  {
    id: 'task-2',
    title: 'VIP Arrival: Mr. Johnson',
    subtitle: 'Asegurar amenity en Hab 501 (14:00)',
    completed: false,
    priority: 'Alta'
  },
  {
    id: 'task-3',
    title: 'Cierre de turno Mantenimiento',
    subtitle: 'Reporte diario',
    completed: true
  },
  {
    id: 'task-4',
    title: 'Contactar grupo "Tech Summit"',
    subtitle: 'Confirmar rooming list final',
    completed: false
  }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g-1',
    name: 'Alexander Sterling',
    country: 'Reino Unido',
    stays: 14,
    lastVisit: 'Oct 2023',
    status: 'VIP',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    email: 'a.sterling@londonventures.co.uk',
    phone: '+44 20 7946 0912',
    documentId: 'PAS-GB8829104',
    notes: 'Huésped corporativo de alta frecuencia. Prefiere piso alto, almohadas de pluma y periódicos financieros en la mañana.'
  },
  {
    id: 'g-2',
    name: 'Maria Rossi',
    country: 'Italia',
    stays: 3,
    lastVisit: 'Ago 2023',
    status: 'Regular',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'm.rossi@milanoart.it',
    phone: '+39 02 555 3190',
    documentId: 'ID-IT994102',
    notes: 'Viajera cultural. Aprecia recomendaciones de galerías de arte y vino tinto italiano en su habitación.'
  },
  {
    id: 'g-3',
    name: 'John Doe',
    country: 'Estados Unidos',
    stays: 1,
    lastVisit: 'Ene 2022',
    status: 'Atención',
    initials: 'JD',
    email: 'johndoe.inquiries@corp.net',
    phone: '+1 415 892 0184',
    documentId: 'DL-CA9923812',
    notes: 'Registró queja anterior por ruido exterior en piso 1. Asignar siempre piso 3 o superior alejado de elevadores.'
  },
  {
    id: 'g-4',
    name: 'Familia Gómez',
    country: 'España',
    stays: 8,
    lastVisit: 'Sep 2023',
    status: 'Familia',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    email: 'contacto.gomez@madridmail.es',
    phone: '+34 91 234 5678',
    documentId: 'DNI-ES54321980',
    notes: 'Familia recurrente de vacaciones escolares. Solicita cuna adicional o camas dobles conectadas.'
  }
];

export const POS_PRODUCTS: PosProduct[] = [
  {
    id: 'p-1',
    name: 'Desayuno Continental',
    price: 25.0,
    category: 'Restaurante',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-2',
    name: 'Club Sandwich',
    price: 18.5,
    category: 'Restaurante',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-3',
    name: 'Agua Mineral Premium',
    price: 6.0,
    category: 'Minibar',
    icon: 'water_drop'
  },
  {
    id: 'p-4',
    name: 'Botella Vino Tinto Reserva',
    price: 45.0,
    category: 'Minibar',
    icon: 'wine_bar'
  },
  {
    id: 'p-5',
    name: 'Masaje Relajante 60min',
    price: 75.0,
    category: 'Spa & Relax',
    icon: 'spa'
  },
  {
    id: 'p-6',
    name: 'Cena Gourmet 3 Tiempos',
    price: 52.0,
    category: 'In-Room Dining',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    folio: 'FAC-1024',
    time: '13:45',
    client: 'Empresa XYZ S.A.',
    room: 'Hab 302',
    method: 'Tarjeta',
    total: 1250.0,
    status: 'Emitida',
    category: 'Alojamiento'
  },
  {
    id: 'inv-2',
    folio: 'FAC-1023',
    time: '12:10',
    client: 'Juan Pérez',
    room: 'Restaurante',
    method: 'Efectivo',
    total: 450.0,
    status: 'Emitida',
    category: 'Alimentos y Bebidas'
  },
  {
    id: 'inv-3',
    folio: 'FAC-1022',
    time: '10:30',
    client: 'María Gómez',
    room: 'Hab 105',
    method: 'Tarjeta',
    total: 3800.0,
    status: 'Emitida',
    category: 'Alojamiento'
  },
  {
    id: 'inv-4',
    folio: 'FAC-1021',
    time: '09:15',
    client: 'Carlos Ruiz',
    room: 'Error en datos',
    method: '-',
    total: 850.0,
    status: 'Anulada',
    category: 'Otros Servicios'
  },
  {
    id: 'inv-5',
    folio: 'FAC-1020',
    time: '08:00',
    client: 'Ana Silva',
    room: 'Desayuno',
    method: 'Efectivo',
    total: 120.0,
    status: 'Emitida',
    category: 'Alimentos y Bebidas'
  }
];
