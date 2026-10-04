# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Optimize build caching by copying package files first
COPY package*.json ./
RUN npm install

# Copy source code and build TypeScript to dist
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ==========================================
# Stage 2: Production runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Security: Run as non-privileged 'node' user instead of root
USER node

# Expose API port
EXPOSE 5000

# Docker healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production server
CMD ["node", "dist/index.js"]
