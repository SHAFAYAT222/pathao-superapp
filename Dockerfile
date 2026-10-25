# =============================================================================
# Stage 1: Build Dependencies & Production Bundle
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with layer caching
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Copy application source code
COPY . .

# Run automated tests and lint validation
RUN npm test
RUN npm run lint

# Build optimized production bundle
RUN npm run build

# Remove development dependencies to keep production footprint minimal
RUN npm prune --omit=dev

# =============================================================================
# Stage 2: Production Runner Container
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Install dumb-init or wget for reliable process signal forwarding and health check
RUN apk add --no-cache dumb-init

# Copy production dependencies and built assets from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist

# Security Hardening: Run as built-in unprivileged 'node' user (UID 1000)
USER node

# Expose internal service port
EXPOSE 5000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Execute server with signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server/index.js"]
