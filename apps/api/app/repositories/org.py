"""
FoodBridge - Organizations MongoDB Repository

Replaces the in-memory OrgRepository with Motor async operations.
Supports geospatial proximity queries via 2dsphere index.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from app.database.client import get_db

logger = logging.getLogger("foodbridge.repositories.org")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _doc_to_dict(doc: dict) -> dict:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


class OrgRepository:
    """
    Async MongoDB repository for organizations.
    Supports geospatial proximity search.
    """

    @property
    def _col(self):
        return get_db()["organizations"]

    async def get_by_id(self, id: str) -> Optional[dict]:
        logger.debug(f"org.get_by_id: {id}")
        doc = await self._col.find_one({"_id": id})
        return _doc_to_dict(doc)

    async def list_organizations(
        self,
        category: Optional[str] = None,
        role: Optional[str] = None,
        approved_only: bool = True,
        limit: int = 50,
    ) -> List[dict]:
        query: Dict = {}
        if approved_only:
            query["is_approved"] = True
        if category:
            query["category"] = category
        if role:
            query["role"] = role
        cursor = self._col.find(query).sort("name", 1).limit(limit)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def find_nearby(
        self,
        longitude: float,
        latitude: float,
        radius_km: float = 10.0,
        category: Optional[str] = None,
    ) -> List[dict]:
        """Geospatial $nearSphere query — requires 2dsphere index on location."""
        query: Dict = {
            "location": {
                "$nearSphere": {
                    "$geometry": {"type": "Point", "coordinates": [longitude, latitude]},
                    "$maxDistance": int(radius_km * 1000),  # metres
                }
            },
            "is_approved": True,
        }
        if category:
            query["category"] = category
        cursor = self._col.find(query).limit(20)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def search(
        self,
        longitude: Optional[float] = None,
        latitude: Optional[float] = None,
        radius_km: float = 15.0,
        categories: Optional[List[str]] = None,
        dietary_preferences: Optional[List[str]] = None,
        approved_only: bool = True,
        limit: int = 20,
    ) -> List[dict]:
        """MongoDB query matching categories, dietary preferences, and proximity."""
        query: Dict = {}
        if approved_only:
            query["is_approved"] = True
        
        if longitude is not None and latitude is not None:
            query["location"] = {
                "$nearSphere": {
                    "$geometry": {"type": "Point", "coordinates": [longitude, latitude]},
                    "$maxDistance": int(radius_km * 1000),  # metres
                }
            }
        
        if categories:
            query["category"] = {"$in": categories}
            
        if dietary_preferences:
            query["dietary_preferences"] = {"$in": dietary_preferences}

        cursor = self._col.find(query).limit(limit)
        return [_doc_to_dict(doc) async for doc in cursor]


    async def create(self, data: dict) -> dict:
        new_id = f"org_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            **data,
            "is_approved": False,
            "created_at": _utcnow(),
        }
        await self._col.insert_one(record)
        logger.info(f"org.create: inserted organization {new_id}")
        return _doc_to_dict(record)

    async def update(self, id: str, updates: dict) -> Optional[dict]:
        updates["updated_at"] = _utcnow()
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": updates},
            return_document=True,
        )
        if result:
            logger.info(f"org.update: updated organization {id}")
        return _doc_to_dict(result)


# Singleton
org_repository = OrgRepository()
