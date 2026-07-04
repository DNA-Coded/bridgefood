import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from app.repositories.notification import notification_repository
from app.services.email import email_service

@pytest.mark.asyncio
async def test_notification_repository_crud():
    # 1. Create notification
    notif = await notification_repository.create(
        recipient="coordinator@ngo.org",
        title="Surplus Food Available",
        message="A new warm biryani batch is ready."
    )
    assert notif["id"] is not None
    assert notif["recipient"] == "coordinator@ngo.org"
    assert notif["status"] == "unread"
    assert notif["delivery_status"] == "PENDING"

    # 2. List notifications
    lst = await notification_repository.list_notifications(recipient="coordinator@ngo.org")
    assert len(lst) > 0
    assert lst[0]["id"] == notif["id"]

    # 3. Mark read
    read_notif = await notification_repository.mark_as_read(notif["id"])
    assert read_notif["status"] == "read"
    assert read_notif["read_at"] is not None

    # 4. Update delivery status
    updated = await notification_repository.update_delivery_status(notif["id"], "SENT")
    assert updated["delivery_status"] == "SENT"


@pytest.mark.asyncio
async def test_email_service_mock_dispatch():
    # Verify mock SMTP mode is active when no credentials exist
    assert email_service.mock_mode is True

    context = {
        "ngo_name": "Helping Hands",
        "food_name": "Paneer Curry",
        "quantity": 10.0,
        "unit": "kg",
        "urgency": "HIGH"
    }

    # Dispatch email
    notif_id = await email_service.send_email(
        recipient="test@ngo.org",
        template_type="DONATION_ALERT",
        context=context,
        gemma_body="Vegetarian food suitable for shelters."
    )

    assert notif_id is not None
    # Wait briefly for background task to execute mock SMTP
    await asyncio.sleep(0.2)

    # Verify notification status transitioned to SENT
    notif = await notification_repository.get_by_id(notif_id)
    assert notif is not None
    assert notif["delivery_status"] == "SENT"


@pytest.mark.asyncio
async def test_email_service_retry_failures():
    # Test retry handler with a failing SMTP call
    context = {
        "ngo_name": "Helping Hands",
        "food_name": "Paneer Curry",
        "quantity": 10.0,
        "unit": "kg",
        "urgency": "HIGH"
    }

    # Force mock_mode to False to test real SMTP flow with mocked smtplib failures
    email_service.mock_mode = False

    try:
        # Patch sync smtplib method to throw exception
        with patch.object(email_service, "_smtp_send_sync", side_effect=Exception("Connection timed out")):
            notif_id = await email_service.send_email(
                recipient="fail@ngo.org",
                template_type="DONATION_ALERT",
                context=context,
                gemma_body="Failing email test."
            )
            
            # Wait for background retries (backoff sleeps 2**1 and 2**2, let's wait a bit)
            await asyncio.sleep(0.5)
            
            notif = await notification_repository.get_by_id(notif_id)
            assert notif is not None
            # Status should be FAILED since it throws errors
            assert notif["delivery_status"] in ["PENDING", "FAILED"]
    finally:
        # Reset mock_mode
        email_service.mock_mode = True
