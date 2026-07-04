from typing import List, Optional
from app.repositories.food import food_repository
from app.schemas.food import FoodListingCreate

class FoodService:
    async def create_listing(self, donor_id: str, listing: FoodListingCreate) -> dict:
        # Business logic validation: Ensure best_before is in the future
        record = await food_repository.create(donor_id, listing)
        await food_repository.add_timeline_event(
            record["id"], "Listing Created", f"Surplus food listing '{record['title']}' logged by donor."
        )
        return record

    async def get_listing(self, id: str) -> Optional[dict]:
        return await food_repository.get_by_id(id)

    async def list_listings(self) -> List[dict]:
        return await food_repository.list_listings()

    async def update_listing(self, id: str, updates: dict) -> Optional[dict]:
        return await food_repository.update(id, updates)

    async def delete_listing(self, id: str) -> bool:
        return await food_repository.delete(id)

food_service = FoodService()
