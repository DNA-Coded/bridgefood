from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.donation import DonationCreate, DonationResponse
from app.schemas.appeal import AppealCreate, AppealResponse
from app.services.donation import donation_service
from app.services.appeal import appeal_service

router = APIRouter()

# 1. Donations Enpoints
@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
async def create_donation(donation: DonationCreate):
    return await donation_service.create_donation(donation)

@router.get("", response_model=List[DonationResponse])
async def list_donations():
    return await donation_service.list_donations()

# 2. Appeals Endpoints
@router.post("/appeals", response_model=AppealResponse, status_code=status.HTTP_201_CREATED)
async def create_appeal(appeal: AppealCreate):
    mock_receiver_id = "usr_receiver102"
    return await appeal_service.create_appeal(mock_receiver_id, appeal)

@router.get("/appeals", response_model=List[AppealResponse])
async def list_appeals(listing_id: str = None):
    return await appeal_service.list_appeals(listing_id=listing_id)

@router.post("/appeals/{id}/accept", response_model=DonationResponse)
async def accept_appeal(id: str):
    """
    Accepts an appeal, locking the listing and creating a donation.
    """
    try:
        return await appeal_service.accept_appeal(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{id}/complete", response_model=DonationResponse)
async def complete_donation(id: str):
    """
    Marks a donation as completed.
    """
    record = await donation_service.complete_donation(id)
    if not record:
        raise HTTPException(status_code=404, detail="Donation not found.")
    return record

