/**
 * server/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Punto de entrada del servidor Express para Hotel Gema PMS.
 *
 * ARQUITECTURA:
 *   En DESARROLLO: Express maneja solo /api/*, Vite corre aparte (port 3000).
 *   En PRODUCCIÓN: Express sirve el frontend estático (dist/) Y el API.
 *     → El frontend llama a /api/* (URL relativa) → Express lo maneja.
 *     → Un solo contenedor Docker, compatible con Coolify.
 *
 * ENDPOINTS:
 *   POST /api/auth/login          → Autenticar usuario
 *   POST /api/auth/logout         → Cerrar sesión
 *   GET  /api/auth/me             → Perfil del usuario autenticado
 *   POST /api/admin/users/create  → [Admin] Crear usuario
 *   DELETE /api/admin/users/:uid  → [Admin] Eliminar usuario
 *   GET  /api/admin/users         → [Admin] Listar usuarios
 *   PATCH /api/admin/users/:uid   → [Admin] Actualizar metadata
 *   GET  /api/health              → Health check
 * ─────────────────────────────────────────────────────────────────────────────
 */

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { validateEnv } from './middleware/validateEnv.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';

// ── Validar variables de entorno al arrancar ─────────────────────────────────
validateEnv();

// ── Crear aplicación Express ─────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// En producción, frontend y API comparten el mismo origen → no hay CORS.
// Solo se habilita en desarrollo para localhost.
if (!isProd) {
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
}

// ── Parseo de JSON ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true, limit: '256kb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Hotel Gema PMS',
    version: '1.0.0',
    mode: isProd ? 'production' : 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// ── Frontend estático en producción ──────────────────────────────────────────
// Express sirve el build de Vite (dist/) que el Dockerfile copia junto al server/.
// Cualquier ruta no-API devuelve index.html (SPA fallback).
if (isProd) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado.' });
  });
}

// ── Error handler global ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Hotel Gema] Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏨  Hotel Gema PMS corriendo en http://localhost:${PORT}`);
  console.log(`   Modo: ${isProd ? 'PRODUCCIÓN (API + frontend estático)' : 'DESARROLLO (solo API)'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
