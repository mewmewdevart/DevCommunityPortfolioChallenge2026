# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend ./

# Build the application
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy the built artifacts from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
