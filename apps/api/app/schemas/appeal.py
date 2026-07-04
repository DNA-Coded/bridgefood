from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AppealCreate(BaseModel):
    listing_id: str
    message: Optional[str] = Field(None, example="We can collect within 20 minutes.")

class AppealResponse(BaseModel):
    id: str
    listing_id: str
    receiver_id: str
    message: Optional[str] = None
    status: str # PENDING, ACCEPTED, REJECTED, WITHDRAWN
    requested_at: datetime

    class Config:
        from_attributes = True
