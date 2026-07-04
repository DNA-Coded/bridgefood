from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ImpactMetrics(BaseModel):
    co2_saved_kg: float = 0.0
    meals_served: int = 0

class DonationCreate(BaseModel):
    listing_id: str
    accepted_request_id: str

class DonationResponse(BaseModel):
    id: str
    listing_id: str
    accepted_request_id: str
    pickup_code: str
    completed_at: Optional[datetime] = None
    impact: ImpactMetrics

    class Config:
        from_attributes = True
