# Etapa 1: Build de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Las variables de entorno en Vite deben estar presentes en tiempo de build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servidor web ligero (Nginx) para servir los estáticos
FROM nginx:alpine

# Copiar el build generado en la etapa anterior a la carpeta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración básica de Nginx para aplicaciones de una sola página (SPA)
RUN echo -e "server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
