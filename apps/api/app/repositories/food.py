"""
FoodBridge - Food Listings MongoDB Repository

Replaces the in-memory FoodRepository with Motor async operations.
The interface is identical — no service layer changes required.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from app.database.client import get_db
from app.schemas.food import FoodListingCreate

logger = logging.getLogger("foodbridge.repositories.food")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _doc_to_dict(doc: dict) -> dict:
    """Normalise a MongoDB document to a clean dict (rename _id → id)."""
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


class FoodRepository:
    """
    Async MongoDB repository for food listings.
    Interface preserved from the in-memory version.
    """

    @property
    def _col(self):
        return get_db()["food_listings"]

    async def get_by_id(self, id: str) -> Optional[dict]:
        logger.debug(f"food.get_by_id: {id}")
        doc = await self._col.find_one({"_id": id})
        return _doc_to_dict(doc)

    async def list_listings(
        self,
        state: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50,
    ) -> List[dict]:
        query: Dict = {}
        if state:
            query["state"] = state
        if category:
            query["category"] = category
        cursor = self._col.find(query).sort("created_at", -1).limit(limit)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def create(self, donor_id: str, listing: FoodListingCreate) -> dict:
        new_id = f"list_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            "donor_id": donor_id,
            "title": listing.title,
            "category": listing.category,
            "food_type": listing.food_type,
            "description": listing.description,
            "is_vegetarian": listing.is_vegetarian,
            "allergens": listing.allergens,
            "quantity": listing.quantity,
            "unit": listing.unit,
            "servings": listing.servings,
            "prep_date": listing.prep_date,
            "best_before": listing.best_before,
            "pickup_address": listing.pickup_address,
            "contact_person": listing.contact_person,
            "contact_number": listing.contact_number,
            "special_instructions": listing.special_instructions,
            "state": "ACTIVE",
            "timeline": [],
            "created_at": _utcnow(),
        }
        if listing.location:
            record["location"] = {
                "type": "Point",
                "coordinates": listing.location.coordinates,
            }
        await self._col.insert_one(record)
        logger.info(f"food.create: inserted listing {new_id}")
        return _doc_to_dict(record)

    async def add_timeline_event(self, id: str, event_type: str, description: str) -> Optional[dict]:
        """Appends a new lifecycle state event into the listing's timeline list."""
        event = {
            "type": event_type,
            "description": description,
            "timestamp": _utcnow().isoformat(),
        }
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$push": {"timeline": event}},
            return_document=True,
        )
        if result:
            logger.info(f"food.add_timeline_event: appended {event_type} to listing {id}")
        return _doc_to_dict(result)


    async def update(self, id: str, updates: dict) -> Optional[dict]:
        updates["updated_at"] = _utcnow()
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": updates},
            return_document=True,
        )
        if result:
            logger.info(f"food.update: updated listing {id}")
        return _doc_to_dict(result)

    async def delete(self, id: str) -> bool:
        result = await self._col.delete_one({"_id": id})
        deleted = result.deleted_count > 0
        if deleted:
            logger.info(f"food.delete: deleted listing {id}")
        return deleted


# Singleton
food_repository = FoodRepository()
