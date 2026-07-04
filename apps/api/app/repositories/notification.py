import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.database.client import get_db

logger = logging.getLogger("foodbridge.repositories.notification")

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

def _doc_to_dict(doc: dict) -> dict:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc

class NotificationRepository:
    @property
    def _col(self):
        return get_db()["notifications"]

    async def create(self, recipient: str, title: str, message: str) -> dict:
        new_id = f"not_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            "title": title,
            "message": message,
            "recipient": recipient,
            "status": "unread",
            "delivery_status": "PENDING",
            "created_at": _utcnow(),
            "read_at": None,
        }
        await self._col.insert_one(record)
        logger.info(f"notification.create: inserted notification {new_id} to {recipient}")
        return _doc_to_dict(record)

    async def get_by_id(self, id: str) -> Optional[dict]:
        doc = await self._col.find_one({"_id": id})
        return _doc_to_dict(doc)


    async def list_notifications(self, recipient: Optional[str] = None) -> List[dict]:
        query = {}
        if recipient:
            query["recipient"] = recipient
        cursor = self._col.find(query).sort("created_at", -1)
        return [_doc_to_dict(doc) async for doc in cursor]

    async def mark_as_read(self, id: str) -> Optional[dict]:
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": {"status": "read", "read_at": _utcnow()}},
            return_document=True,
        )
        return _doc_to_dict(result)

    async def update_delivery_status(self, id: str, status: str) -> Optional[dict]:
        result = await self._col.find_one_and_update(
            {"_id": id},
            {"$set": {"delivery_status": status}},
            return_document=True,
        )
        return _doc_to_dict(result)

notification_repository = NotificationRepository()
