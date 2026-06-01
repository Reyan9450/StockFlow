#!/bin/sh
set -e

echo "Starting StockFlow Backend..."

# Run seed in background after a short delay
(sleep 3 && python -m app.seed) &

# Start the server
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
