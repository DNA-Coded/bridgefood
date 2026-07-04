"""
FoodBridge - MongoDB Repository Tests

All Motor collection calls are patched via `get_db()` so no real
MongoDB connection is required during test runs.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone


# ── Helpers ────────────────────────────────────────────────────────────────────

def utcnow():
    return datetime.now(timezone.utc)


def make_food_doc(id="list_abc", donor_id="donor_001"):
    return {
        "_id": id,
        "donor_id": donor_id,
        "title": "Test Rice",
        "category": "cooked",
        "food_type": "Rice",
        "description": "Cooked rice for testing.",
        "is_vegetarian": "vegetarian",
        "allergens": None,
        "quantity": 10.0,
        "unit": "kg",
        "servings": 25,
        "best_before": datetime(2026, 7, 5, 12, 0, 0, tzinfo=timezone.utc),
        "pickup_address": "123 Test Street",
        "contact_person": "Test Person",
        "contact_number": "+91-99999-00000",
        "state": "ACTIVE",
        "created_at": utcnow(),
    }


def make_appeal_doc(id="app_abc", listing_id="list_abc", receiver_id="recv_001"):
    return {
        "_id": id,
        "listing_id": listing_id,
        "receiver_id": receiver_id,
        "message": "We can collect this.",
        "status": "PENDING",
        "requested_at": utcnow(),
    }


def make_donation_doc(id="don_abc", listing_id="list_abc"):
    return {
        "_id": id,
        "listing_id": listing_id,
        "accepted_request_id": "app_abc",
        "pickup_code": "FB-A1B2",
        "status": "PENDING_PICKUP",
        "completed_at": None,
        "impact": {"co2_saved_kg": 37.5, "meals_served": 30},
        "created_at": utcnow(),
    }


def make_org_doc(id="org_abc", category="ngo", role="receiver"):
    return {
        "_id": id,
        "name": "Test NGO",
        "category": category,
        "role": role,
        "city": "Mumbai",
        "is_approved": True,
        "created_at": utcnow(),
    }


async def async_iter(items):
    """Helper: make a list async-iterable (mimics Motor cursor)."""
    for item in items:
        yield item


def make_mock_db(collection_name: str) -> MagicMock:
    """Returns a mock DB object whose [collection_name] is a MagicMock."""
    mock_db = MagicMock()
    mock_db.__getitem__ = MagicMock(return_value=MagicMock())
    return mock_db


# ── Food Repository ────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_food_get_by_id_found():
    from app.repositories.food import FoodRepository
    doc = make_food_doc()
    mock_col = MagicMock()
    mock_col.find_one = AsyncMock(return_value=doc)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.get_by_id("list_abc")

    assert result["id"] == "list_abc"
    assert "_id" not in result
    assert result["title"] == "Test Rice"


@pytest.mark.asyncio
async def test_food_get_by_id_not_found():
    from app.repositories.food import FoodRepository
    mock_col = MagicMock()
    mock_col.find_one = AsyncMock(return_value=None)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.get_by_id("nonexistent")

    assert result is None


@pytest.mark.asyncio
async def test_food_list_listings_returns_docs():
    from app.repositories.food import FoodRepository
    docs = [make_food_doc("list_1"), make_food_doc("list_2")]
    mock_col = MagicMock()
    mock_col.find.return_value.sort.return_value.limit.return_value = async_iter(docs)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.list_listings()

    assert len(result) == 2
    assert result[0]["id"] == "list_1"
    assert all("_id" not in r for r in result)


@pytest.mark.asyncio
async def test_food_delete_existing():
    from app.repositories.food import FoodRepository
    mock_col = MagicMock()
    delete_result = MagicMock()
    delete_result.deleted_count = 1
    mock_col.delete_one = AsyncMock(return_value=delete_result)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.delete("list_abc")

    assert result is True


@pytest.mark.asyncio
async def test_food_delete_not_found():
    from app.repositories.food import FoodRepository
    mock_col = MagicMock()
    delete_result = MagicMock()
    delete_result.deleted_count = 0
    mock_col.delete_one = AsyncMock(return_value=delete_result)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.delete("nonexistent")

    assert result is False


@pytest.mark.asyncio
async def test_food_update_returns_updated_doc():
    from app.repositories.food import FoodRepository
    updated = {**make_food_doc(), "state": "COMPLETED"}
    mock_col = MagicMock()
    mock_col.find_one_and_update = AsyncMock(return_value=updated)

    repo = FoodRepository()
    with patch("app.repositories.food.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.update("list_abc", {"state": "COMPLETED"})

    assert result["id"] == "list_abc"
    assert result["state"] == "COMPLETED"


# ── Appeal Repository ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_appeal_update_status_to_accepted():
    from app.repositories.appeal import AppealRepository
    updated_doc = {**make_appeal_doc(), "status": "ACCEPTED"}
    mock_col = MagicMock()
    mock_col.find_one_and_update = AsyncMock(return_value=updated_doc)

    repo = AppealRepository()
    with patch("app.repositories.appeal.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.update_status("app_abc", "ACCEPTED")

    assert result["status"] == "ACCEPTED"
    assert result["id"] == "app_abc"


@pytest.mark.asyncio
async def test_appeal_list_all():
    from app.repositories.appeal import AppealRepository
    docs = [make_appeal_doc("app_1"), make_appeal_doc("app_2")]
    mock_col = MagicMock()
    mock_col.find.return_value.sort.return_value = async_iter(docs)

    repo = AppealRepository()
    with patch("app.repositories.appeal.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.list_appeals()

    assert len(result) == 2


# ── Donation Repository ────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_donation_get_by_id():
    from app.repositories.donation import DonationRepository
    doc = make_donation_doc()
    mock_col = MagicMock()
    mock_col.find_one = AsyncMock(return_value=doc)

    repo = DonationRepository()
    with patch("app.repositories.donation.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.get_by_id("don_abc")

    assert result["id"] == "don_abc"
    assert result["pickup_code"] == "FB-A1B2"


@pytest.mark.asyncio
async def test_donation_mark_completed():
    from app.repositories.donation import DonationRepository
    completed = {**make_donation_doc(), "status": "COMPLETED"}
    mock_col = MagicMock()
    mock_col.find_one_and_update = AsyncMock(return_value=completed)

    repo = DonationRepository()
    with patch("app.repositories.donation.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.mark_completed("don_abc")

    assert result["status"] == "COMPLETED"


# ── Org Repository ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_org_get_by_id():
    from app.repositories.org import OrgRepository
    doc = make_org_doc()
    mock_col = MagicMock()
    mock_col.find_one = AsyncMock(return_value=doc)

    repo = OrgRepository()
    with patch("app.repositories.org.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.get_by_id("org_abc")

    assert result["id"] == "org_abc"
    assert result["category"] == "ngo"


@pytest.mark.asyncio
async def test_org_list_approved_only():
    from app.repositories.org import OrgRepository
    docs = [make_org_doc("org_1"), make_org_doc("org_2")]
    mock_col = MagicMock()
    mock_col.find.return_value.sort.return_value.limit.return_value = async_iter(docs)

    repo = OrgRepository()
    with patch("app.repositories.org.get_db") as mock_get_db:
        mock_get_db.return_value.__getitem__ = MagicMock(return_value=mock_col)
        result = await repo.list_organizations(approved_only=True)

    assert len(result) == 2
    # Verify approved_only filter was passed
    call_args = mock_col.find.call_args[0][0]
    assert call_args.get("is_approved") is True
