# ==========================================
# Stage 1: Build React static assets with Vite
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependency layer
COPY package*.json ./
RUN npm install

# Copy client source files
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build static bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Reverse Proxy
# ==========================================
FROM nginx:alpine AS runner

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check against Nginx health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/nginx-health || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
