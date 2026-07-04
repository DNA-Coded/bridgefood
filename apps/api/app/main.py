"""
FoodBridge AI - FastAPI Application Entry Point

Startup lifecycle:
  1. Connect to MongoDB Atlas
  2. Ensure collection indexes
  3. Register all API routers
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import startup as db_startup, shutdown as db_shutdown
from app.routers import food, donations, organizations, users, admin, notifications, analysis

logger = logging.getLogger("foodbridge.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context — handles startup and graceful shutdown."""
    logger.info("FoodBridge API starting up...")
    await db_startup()
    logger.info("FoodBridge API ready")
    yield
    logger.info("FoodBridge API shutting down...")
    await db_shutdown()


app = FastAPI(
    title="FoodBridge AI API",
    description="Intelligent Surplus Food Coordination Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Middleware ─────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ── Routers ────────────────────────────────────────────────────────────────────

app.include_router(food.router,          prefix="/api/v1/food",          tags=["Food Listings"])
app.include_router(donations.router,     prefix="/api/v1/donations",     tags=["Donations"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(analysis.router,      prefix="/api/v1/analysis",      tags=["AI Analysis"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(users.router,         prefix="/api/v1/users",         tags=["Users"])
app.include_router(admin.router,         prefix="/api/v1/admin",         tags=["Admin"])


# ── Health endpoints ───────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "foodbridge-api"}


@app.get("/version", tags=["Health"])
async def version_check():
    return {"version": "1.0.0", "environment": settings.ENVIRONMENT}
