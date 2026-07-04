"""
FoodBridge - Donations MongoDB Repository

Replaces the in-memory DonationRepository with Motor async operations.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from app.database.client import get_db
from app.schemas.donation import DonationCreate

logger = logging.getLogger("foodbridge.repositories.donation")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _doc_to_dict(doc: dict) -> dict:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


class DonationRepository:
    """
    Async MongoDB repository for confirmed donations.
    Interface preserved from the in-memory version.
    """

    @property
    def _col(self):
        return get_db()["donations"]

    async def create(self, donation: DonationCreate) -> dict:
        new_id = f"don_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            "listing_id": donation.listing_id,
            "accepted_request_id": donation.accepted_request_id,
            "pickup_code": f"FB-{uuid.uuid4().hex[:4].upper()}",
            "status": "PENDING_PICKUP",
            "completed_at": None,
            "impact": {
                "co2_saved_kg": 37.5,
                "meals_served": 30,
            },
            "created_at": _utcnow(),
        }
        await self._col.insert_one(record)
        logger.info(f"donation.create: inserted donation {new_id}")
        return _doc_to_dict(record)

    async def list_donations(
        self,
        listing_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[dict]:
        query = {}
        if listing_id:
            query["listing_id"] = listing_id
        if status:
            query["status"] = status
        cursor = self._col.find(query).sort("created_at", -1)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def get_by_id(self, id: str) -> Optional[dict]:
        logger.debug(f"donation.get_by_id: {id}")
        doc = await self._col.find_one({"_id": id})
        return _doc_to_dict(doc)

    async def mark_completed(self, id: str) -> Optional[dict]:
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": {"status": "COMPLETED", "completed_at": _utcnow()}},
            return_document=True,
        )
        if result:
            logger.info(f"donation.mark_completed: donation {id} completed")
        return _doc_to_dict(result)


# Singleton
donation_repository = DonationRepository()
