import pytest
from datetime import datetime, timezone
from app.repositories.food import food_repository
from app.repositories.appeal import appeal_repository
from app.repositories.donation import donation_repository
from app.services.food import food_service
from app.services.appeal import appeal_service
from app.services.donation import donation_service
from app.schemas.food import FoodListingCreate
from app.schemas.appeal import AppealCreate

@pytest.mark.asyncio
async def test_complete_appeal_and_donation_lifecycle():
    # 1. Create a surplus food listing
    listing_in = FoodListingCreate(
        title="Leftover Saffron Rice",
        category="cooked",
        food_type="Catering leftovers",
        description="Fresh saffron pulao and curry. Feeds 25 people.",
        is_vegetarian="vegetarian",
        allergens="dairy",
        quantity=15.0,
        unit="kg",
        servings=25,
        best_before=datetime.now(timezone.utc),
        pickup_address="14A, Park Street, Kolkata",
        contact_person="Deep Saha",
        contact_number="9876543210"
    )
    
    listing = await food_service.create_listing(donor_id="usr_donor_999", listing=listing_in)
    listing_id = listing["id"]
    
    # Verify initial timeline
    updated_listing = await food_repository.get_by_id(listing_id)
    assert len(updated_listing["timeline"]) == 1
    assert updated_listing["timeline"][0]["type"] == "Listing Created"

    # 2. Submit appeals from two receivers
    appeal_1_in = AppealCreate(listing_id=listing_id, message="Can collect in 15 mins.")
    appeal_2_in = AppealCreate(listing_id=listing_id, message="Can collect in 30 mins.")
    
    appeal_1 = await appeal_service.create_appeal(receiver_id="ngo_rec_1", appeal=appeal_1_in)
    appeal_2 = await appeal_service.create_appeal(receiver_id="ngo_rec_2", appeal=appeal_2_in)
    
    assert appeal_1["status"] == "PENDING"
    assert appeal_2["status"] == "PENDING"
    
    # Verify timeline updated with appeal notices
    updated_listing = await food_repository.get_by_id(listing_id)
    assert len(updated_listing["timeline"]) == 3
    assert updated_listing["timeline"][1]["type"] == "Appeal Received"
    assert updated_listing["timeline"][2]["type"] == "Appeal Received"

    # 3. Donor accepts appeal 1
    donation = await appeal_service.accept_appeal(appeal_1["id"])
    assert donation["status"] == "PENDING_PICKUP"
    assert donation["pickup_code"].startswith("FB-")
    
    # Verify appeal states
    app_1_updated = await appeal_repository.get_by_id(appeal_1["id"])
    app_2_updated = await appeal_repository.get_by_id(appeal_2["id"])
    assert app_1_updated["status"] == "ACCEPTED"
    assert app_2_updated["status"] == "CLOSED"
    
    # Verify listing state and timeline
    listing_locked = await food_repository.get_by_id(listing_id)
    assert listing_locked["state"] == "LOCKED"
    assert len(listing_locked["timeline"]) == 5
    assert listing_locked["timeline"][3]["type"] == "Appeal Accepted"
    assert listing_locked["timeline"][4]["type"] == "Pickup Scheduled"

    # 4. Mark pickup completed
    completed_donation = await donation_service.complete_donation(donation["id"])
    assert completed_donation["status"] == "COMPLETED"
    assert completed_donation["completed_at"] is not None
    
    # Verify listing state is COMPLETED and timeline is updated
    listing_completed = await food_repository.get_by_id(listing_id)
    assert listing_completed["state"] == "COMPLETED"
    assert len(listing_completed["timeline"]) == 6
    assert listing_completed["timeline"][5]["type"] == "Donation Completed"
