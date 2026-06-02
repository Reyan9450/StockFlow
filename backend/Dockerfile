# ── Stockify Backend ──────────────────────────────────────────────────────────
# Docker Hub: https://hub.docker.com/r/reyan9450/stockify-backend
#
# Build:   docker build -t reyan9450/stockify-backend .
# Run:     docker run -p 8000:8000 \
#            -e DATABASE_URL=postgresql://user:pass@host:5432/db \
#            -e SECRET_KEY=your-secret \
#            -e CORS_ORIGINS=http://localhost:3001 \
#            reyan9450/stockify-backend
# Pull:    docker pull reyan9450/stockify-backend
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

LABEL maintainer="Stockify"
LABEL org.opencontainers.image.title="Stockify Backend"
LABEL org.opencontainers.image.description="FastAPI backend for Stockify Inventory Management System"
LABEL org.opencontainers.image.source="https://github.com/Reyan9450/StockFlow"
LABEL org.opencontainers.image.url="https://hub.docker.com/r/reyan9450/stockify-backend"
LABEL org.opencontainers.image.version="1.0.0"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy and set permissions for startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["/start.sh"]
