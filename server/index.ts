/**
 * server/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Punto de entrada del servidor API Express para Hotel Gema PMS.
 *
 * ARQUITECTURA DE SEGURIDAD:
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  NAVEGADOR (React)                                              │
 *   │   └── usa ANON_KEY pública → supabase.ts                       │
 *   │   └── llama a /api/* con las credenciales del usuario           │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │  ESTE SERVIDOR (Express / Node.js)                              │
 *   │   └── tiene la SERVICE_ROLE key → NUNCA llega al navegador     │
 *   │   └── valida JWTs de Supabase en cada request protegido        │
 *   │   └── ejecuta operaciones privilegiadas (crear/eliminar users)  │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │  SUPABASE (Backend-as-a-Service)                                │
 *   │   └── Auth, Database, RLS policies                              │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * ENDPOINTS DISPONIBLES:
 *   POST /api/auth/login          → Autenticar usuario (admin o recepcionista)
 *   POST /api/auth/logout         → Cerrar sesión
 *   GET  /api/auth/me             → Obtener perfil del usuario autenticado
 *   POST /api/admin/users/create  → [Admin only] Crear nuevo usuario
 *   DELETE /api/admin/users/:uid  → [Admin only] Eliminar usuario
 *   GET  /api/admin/users         → [Admin only] Listar todos los usuarios
 *   PATCH /api/admin/users/:uid   → [Admin only] Actualizar metadata de usuario
 *   GET  /api/health              → Health check del servidor
 * ─────────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { validateEnv } from './middleware/validateEnv';

// ── Validar variables de entorno al arrancar ─────────────────────────────────
validateEnv();

// ── Crear aplicación Express ─────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares globales ──────────────────────────────────────────────────────

// CORS: solo permite requests del origen del frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.APP_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqueado: origen no permitido → ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parseo de JSON con límite de tamaño
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true, limit: '256kb' }));

// ── Health check (sin autenticación) ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Hotel Gema PMS API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' });
});

// ── Error handler global ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Hotel Gema API] Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor. Intenta nuevamente.' });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏨  Hotel Gema PMS API corriendo en http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Entorno: ${process.env.NODE_ENV ?? 'development'}\n`);
});

export default app;
