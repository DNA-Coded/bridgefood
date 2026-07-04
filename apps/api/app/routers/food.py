from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.food import FoodListingCreate, FoodListingUpdate, FoodListingResponse
from app.services.food import food_service

router = APIRouter()

@router.post("", response_model=FoodListingResponse, status_code=status.HTTP_201_CREATED)
async def create_food_listing(listing: FoodListingCreate):
    """
    Submits a surplus food listing from a donor.
    """
    mock_donor_id = "usr_donor101"
    return await food_service.create_listing(mock_donor_id, listing)

@router.get("", response_model=List[FoodListingResponse])
async def list_listings():
    """
    Lists all active surplus listings on the network.
    """
    return await food_service.list_listings()

@router.get("/{id}", response_model=FoodListingResponse)
async def get_listing(id: str):
    """
    Retrieves detailed specifications of a surplus listing.
    """
    record = await food_service.get_listing(id)
    if not record:
        raise HTTPException(status_code=404, detail="Surplus listing not found.")
    return record

@router.put("/{id}", response_model=FoodListingResponse)
async def update_listing(id: str, updates: FoodListingUpdate):
    """
    Edits active listing details.
    """
    record = await food_service.update_listing(id, updates.dict(exclude_unset=True))
    if not record:
        raise HTTPException(status_code=404, detail="Surplus listing not found.")
    return record

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(id: str):
    """
    Deletes listing from active map.
    """
    success = await food_service.delete_listing(id)
    if not success:
        raise HTTPException(status_code=404, detail="Surplus listing not found.")
