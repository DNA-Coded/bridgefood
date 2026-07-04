from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.notification import NotificationResponse
from app.repositories.notification import notification_repository

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(recipient: Optional[str] = None):
    """
    Retrieves all dispatched transactional alerts.
    """
    return await notification_repository.list_notifications(recipient=recipient)

@router.post("/{id}/read", response_model=NotificationResponse)
async def mark_as_read(id: str):
    """
    Marks a notification as read.
    """
    record = await notification_repository.mark_as_read(id)
    if not record:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return record

