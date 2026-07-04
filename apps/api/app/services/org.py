from typing import List, Optional
from app.repositories.org import org_repository

class OrganizationService:
    async def get_org(self, id: str) -> Optional[dict]:
        return await org_repository.get_by_id(id)

    async def list_organizations(self) -> List[dict]:
        return await org_repository.list_organizations()

org_service = OrganizationService()
