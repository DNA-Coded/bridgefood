"""
FoodBridge - Database Lifecycle Connection Handlers

Provides startup and shutdown coroutines for use in FastAPI's lifespan context manager.
After connect(), all repositories can call get_db() to access collections.
"""
import logging
from app.core.config import settings
from app.database.client import connect, disconnect
from app.database.indexes import ensure_indexes

logger = logging.getLogger("foodbridge.database.connection")


async def startup() -> None:
    """Called on application startup. Connects to MongoDB and ensures indexes."""
    await connect(uri=settings.MONGODB_URI, db_name=settings.DATABASE_NAME)
    await ensure_indexes()
    logger.info("Database startup complete")


async def shutdown() -> None:
    """Called on application shutdown. Closes the MongoDB connection."""
    await disconnect()
    logger.info("Database shutdown complete")
