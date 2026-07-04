"""
FoodBridge - Appeals MongoDB Repository

Replaces the in-memory AppealRepository with Motor async operations.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from app.database.client import get_db
from app.schemas.appeal import AppealCreate

logger = logging.getLogger("foodbridge.repositories.appeal")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _doc_to_dict(doc: dict) -> dict:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


class AppealRepository:
    """
    Async MongoDB repository for pickup appeals.
    Interface preserved from the in-memory version.
    """

    @property
    def _col(self):
        return get_db()["appeals"]

    async def create(self, receiver_id: str, appeal: AppealCreate) -> dict:
        new_id = f"app_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            "listing_id": appeal.listing_id,
            "receiver_id": receiver_id,
            "message": appeal.message,
            "status": "PENDING",
            "requested_at": _utcnow(),
        }
        await self._col.insert_one(record)
        logger.info(f"appeal.create: inserted appeal {new_id} for listing {appeal.listing_id}")
        return _doc_to_dict(record)

    async def list_appeals(
        self,
        listing_id: Optional[str] = None,
        receiver_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[dict]:
        query = {}
        if listing_id:
            query["listing_id"] = listing_id
        if receiver_id:
            query["receiver_id"] = receiver_id
        if status:
            query["status"] = status
        cursor = self._col.find(query).sort("requested_at", -1)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def get_by_id(self, id: str) -> Optional[dict]:
        logger.debug(f"appeal.get_by_id: {id}")
        doc = await self._col.find_one({"_id": id})
        return _doc_to_dict(doc)

    async def update_status(self, id: str, status: str) -> Optional[dict]:
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": {"status": status, "updated_at": _utcnow()}},
            return_document=True,
        )
        if result:
            logger.info(f"appeal.update_status: appeal {id} → {status}")
        return _doc_to_dict(result)


# Singleton
appeal_repository = AppealRepository()
