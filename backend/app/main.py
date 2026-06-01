import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import engine, Base
from app.routers import products, customers, orders, dashboard

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tables_with_retry(retries: int = 5, delay: int = 3):
    for attempt in range(retries):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("✅ Database tables created successfully")
            return
        except Exception as e:
            logger.warning(f"⚠️  DB not ready (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                logger.error("❌ Could not connect to database after retries")


create_tables_with_retry()

app = FastAPI(
    title="Stockify API",
    description="Production-ready Inventory & Order Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Supports multiple origins via comma-separated CORS_ORIGINS env var
# e.g. CORS_ORIGINS=https://app.vercel.app,https://staging.vercel.app
# Set CORS_ORIGINS=* to allow all origins (development/demo)

raw_origins = settings.CORS_ORIGINS.strip()

if raw_origins == "*":
    # Allow all origins — used for development and demo deployments
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("🌐 CORS: allowing all origins (*)")
else:
    # Parse comma-separated list of allowed origins
    origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"🌐 CORS: allowing {len(origins)} origin(s): {origins}")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "Stockify API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )
