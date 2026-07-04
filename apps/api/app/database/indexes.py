"""
FoodBridge - MongoDB Index Definitions

Creates all production indexes for performance and uniqueness enforcement.
Called once on application startup; safe to re-run (indexes are idempotent).
"""
import logging
from pymongo import ASCENDING, DESCENDING, GEOSPHERE
from app.database.client import get_db

logger = logging.getLogger("foodbridge.database.indexes")


async def ensure_indexes() -> None:
    """Create all collection indexes. Idempotent — safe to call on every startup."""
    db = get_db()
    logger.info("Ensuring MongoDB indexes...")

    # ── food_listings ──────────────────────────────────────────────────────────
    food = db["food_listings"]
    await food.create_index([("state", ASCENDING)])
    await food.create_index([("best_before", ASCENDING)])
    await food.create_index([("created_at", DESCENDING)])
    await food.create_index([("donor_id", ASCENDING)])
    await food.create_index([("category", ASCENDING)])
    await food.create_index([("location", GEOSPHERE)], sparse=True)

    # ── organizations ──────────────────────────────────────────────────────────
    orgs = db["organizations"]
    await orgs.create_index([("location", GEOSPHERE)], sparse=True)
    await orgs.create_index([("category", ASCENDING)])
    await orgs.create_index([("is_approved", ASCENDING)])
    await orgs.create_index([("user_id", ASCENDING)], unique=True)

    # ── appeals ────────────────────────────────────────────────────────────────
    appeals = db["appeals"]
    await appeals.create_index([("listing_id", ASCENDING)])
    await appeals.create_index([("receiver_id", ASCENDING)])
    await appeals.create_index([("status", ASCENDING)])
    await appeals.create_index([("requested_at", DESCENDING)])

    # ── donations ──────────────────────────────────────────────────────────────
    donations = db["donations"]
    await donations.create_index([("listing_id", ASCENDING)])
    await donations.create_index([("status", ASCENDING)])
    await donations.create_index([("created_at", DESCENDING)])

    # ── users ──────────────────────────────────────────────────────────────────
    users = db["users"]
    await users.create_index([("email", ASCENDING)], unique=True)
    await users.create_index([("role", ASCENDING)])

    # ── notifications ──────────────────────────────────────────────────────────
    notifications = db["notifications"]
    await notifications.create_index([("user_id", ASCENDING)])
    await notifications.create_index([("status", ASCENDING)])
    await notifications.create_index([("sent_at", DESCENDING)])

    # ── ai_analysis ────────────────────────────────────────────────────────────
    ai_analysis = db["ai_analysis"]
    await ai_analysis.create_index([("listing_id", ASCENDING)])
    await ai_analysis.create_index([("created_at", DESCENDING)])

    logger.info("All MongoDB indexes verified/created successfully")
