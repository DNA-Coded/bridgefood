import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.database.client import get_db

logger = logging.getLogger("foodbridge.repositories.ai_trace")

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

def _doc_to_dict(doc: dict) -> dict:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc

class AiTraceRepository:
    @property
    def _col(self):
        return get_db()["ai_traces"]

    async def create(
        self,
        listing_id: str,
        recommendation: List[Dict[str, Any]],
        confidence: float,
        reasoning: str,
        prompt_version: str = "v4",
    ) -> dict:
        new_id = f"ait_{uuid.uuid4().hex[:8]}"
        record = {
            "_id": new_id,
            "listing_id": listing_id,
            "recommendation": recommendation,
            "confidence": confidence,
            "reasoning": reasoning,
            "prompt_version": prompt_version,
            "execution_timestamp": _utcnow(),
        }
        await self._col.insert_one(record)
        logger.info(f"ai_trace.create: logged trace {new_id} for listing {listing_id}")
        return _doc_to_dict(record)

    async def get_by_listing(self, listing_id: str) -> Optional[dict]:
        doc = await self._col.find_one({"listing_id": listing_id})
        return _doc_to_dict(doc)

ai_trace_repository = AiTraceRepository()
