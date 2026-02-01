FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/

WORKDIR /app/frontend

RUN npm ci

COPY frontend ./

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]