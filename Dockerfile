# Etapa 1: Build de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Las variables VITE_* deben estar presentes en tiempo de BUILD (Vite las incrusta en el bundle)
# En Coolify: configúralas como Build Args en el panel de tu servicio web
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_ADMIN_EMAIL
ARG VITE_RECEPTIONIST_EMAIL
# VITE_API_URL ya NO es necesario: Nginx hace proxy interno de /api/* -> api:4000
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL
ENV VITE_RECEPTIONIST_EMAIL=$VITE_RECEPTIONIST_EMAIL

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servidor Nginx — sirve estáticos Y hace proxy del API
FROM nginx:alpine

# Copiar el build generado
COPY --from=builder /app/dist /usr/share/nginx/html

# Config Nginx:
#   - Sirve los archivos estáticos del frontend (SPA con fallback a index.html)
#   - Hace proxy de /api/* hacia el contenedor 'api' en el puerto 4000
#     (comunicación interna de Docker — nunca pasa por internet)
RUN echo 'server {
    listen 80;

    # Proxy del API — reenvía /api/* al servidor Express interno
    location /api/ {
        proxy_pass         http://api:4000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # Frontend SPA
    location / {
        root       /usr/share/nginx/html;
        index      index.html index.htm;
        try_files  $uri $uri/ /index.html;
    }
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
