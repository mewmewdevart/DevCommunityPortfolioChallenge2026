# Usa Node 20 Slim (Mais compatível)
FROM node:20-slim as build
WORKDIR /app

# Aumenta memória do Node para 4GB (Evita travamento do Vite)
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Garante que instale as ferramentas de desenvolvimento (como o Vite)
ENV NODE_ENV=development

# Copia dependências
COPY frontend/package.json ./

# Instala TUDO (forçando, para ignorar conflitos de versão)
RUN npm install --force

# Copia o código fonte
COPY frontend/ .

# Roda o build
RUN npx vite build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração Anti-Erro 404
RUN echo 'server {     listen 80;     location / {         root /usr/share/nginx/html;         index index.html index.htm;         try_files $uri $uri/ /index.html;     } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
