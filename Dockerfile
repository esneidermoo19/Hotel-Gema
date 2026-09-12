# ═══════════════════════════════════════════════════════════════
# Dockerfile — Hotel Gema PMS (contenedor único para Coolify)
#
# Etapa 1: Build del frontend con Vite
# Etapa 2: Servidor Node.js que sirve el API Y el frontend
#
# Un solo servicio en Coolify. Express maneja:
#   - GET  /*         → archivos estáticos del build (dist/)
#   - POST /api/*     → lógica del servidor con service_role key
# ═══════════════════════════════════════════════════════════════

# ── Etapa 1: Build del frontend (Vite) ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Variables VITE_* se hornean en el bundle en tiempo de BUILD.
# Configúralas como Build Args en Coolify antes de hacer deploy.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_ADMIN_EMAIL
ARG VITE_RECEPTIONIST_EMAIL
# VITE_API_URL no es necesario: el frontend usa URL relativa /api/*
# y Express (mismo proceso) lo resuelve directamente.
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL
ENV VITE_RECEPTIONIST_EMAIL=$VITE_RECEPTIONIST_EMAIL

RUN npm run build

# ── Etapa 2: Servidor Express (API + frontend estático) ──────────
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm install tsx

# Código del servidor
COPY server/ ./server/
COPY tsconfig.json ./

# Build del frontend generado en la etapa anterior
COPY --from=builder /app/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["npx", "tsx", "server/index.ts"]
