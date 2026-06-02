# ── Stockify Frontend ─────────────────────────────────────────────────────────
# Build:   docker build --build-arg VITE_API_URL=https://your-api.com -t stockify-frontend .
# Run:     docker run -p 3001:80 stockify-frontend
# ─────────────────────────────────────────────────────────────────────────────

# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source
COPY . .

# Inject API URL at build time (Vite bakes it into the bundle)
ARG VITE_API_URL=http://localhost:8001
ENV VITE_API_URL=$VITE_API_URL

# Build the React app
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM nginx:alpine

LABEL maintainer="Stockify"
LABEL org.opencontainers.image.title="Stockify Frontend"
LABEL org.opencontainers.image.description="React frontend for Stockify Inventory Management System"
LABEL org.opencontainers.image.source="https://github.com/Reyan9450/StockFlow"
LABEL org.opencontainers.image.version="1.0.0"

# Copy built files and nginx config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
