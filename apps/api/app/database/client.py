"""
FoodBridge - MongoDB Async Client

Wraps the Motor async driver.
Returns the single shared AsyncIOMotorClient and Database instances.
All collections are accessed through this module.

Note: If running Python 3.14 with OpenSSL 3.0, there is a known TLS
compatibility issue with some MongoDB Atlas clusters. Use Python 3.11/3.12
for production, or connect via mongosh/MongoDB Compass for seeding.
"""
import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

logger = logging.getLogger("foodbridge.database.client")

_client: Optional[AsyncIOMotorClient] = None
_client_loop = None
_db: Optional[AsyncIOMotorDatabase] = None


def get_client() -> AsyncIOMotorClient:
    global _client, _db, _client_loop
    import asyncio
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        current_loop = None

    if _client is None or _client_loop is not current_loop:
        from app.core.config import settings
        logger.info("Initializing MongoDB Client on demand...")
        _client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
        )
        _db = _client[settings.DATABASE_NAME]
        _client_loop = current_loop
    return _client


def get_db() -> AsyncIOMotorDatabase:
    get_client()
    return _db





async def connect(uri: str, db_name: str) -> None:
    """Open the Motor connection and store the client + db singletons."""
    global _client, _db
    logger.info(f"Connecting to MongoDB Atlas — database: {db_name}")
    _client = AsyncIOMotorClient(
        uri,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
    )
    # Trigger an actual ping to verify connectivity
    await _client.admin.command("ping")
    _db = _client[db_name]
    logger.info("MongoDB connection established successfully")


async def disconnect() -> None:
    """Cleanly close the Motor connection on shutdown."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed")
