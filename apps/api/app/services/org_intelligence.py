from typing import List, Optional
from app.repositories.org import org_repository

class OrganizationIntelligenceService:
    async def find_candidates(
        self,
        longitude: Optional[float] = None,
        latitude: Optional[float] = None,
        radius_km: float = 15.0,
        categories: Optional[List[str]] = None,
        dietary_preferences: Optional[List[str]] = None,
    ) -> List[dict]:
        """
        Queries MongoDB for candidate receiver organizations matching criteria.
        Returns candidates without ranking them.
        """
        # Map Gemma org types to DB categories
        # Gemma uses: community_kitchen, shelter, food_bank, orphanage, animal_shelter
        # DB categories are: ngo, community_kitchen, food_bank, shelter
        db_categories = []
        if categories:
            for cat in categories:
                c = cat.lower().strip()
                if c == "community_kitchen":
                    db_categories.append("community_kitchen")
                elif c == "shelter":
                    db_categories.append("shelter")
                elif c == "food_bank":
                    db_categories.append("food_bank")
                elif c in ["ngo", "orphanage"]:
                    db_categories.append("ngo")
                else:
                    # Fallback to appending directly if it matches DB categories
                    db_categories.append(c)
        
        # Ensure we unique the mapped categories
        db_categories = list(set(db_categories))

        # Call repository search
        candidates = await org_repository.search(
            longitude=longitude,
            latitude=latitude,
            radius_km=radius_km,
            categories=db_categories if db_categories else None,
            dietary_preferences=dietary_preferences,
        )
        return candidates

org_intelligence_service = OrganizationIntelligenceService()
