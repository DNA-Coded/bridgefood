from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    recipient: str
    status: str  # unread | read
    delivery_status: str  # PENDING | SENT | FAILED
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

