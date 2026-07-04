from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.org import OrganizationResponse
from app.services.org import org_service

router = APIRouter()

@router.get("", response_model=List[OrganizationResponse])
async def list_organizations():
    return await org_service.list_organizations()

@router.get("/{id}", response_model=OrganizationResponse)
async def get_organization(id: str):
    record = await org_service.get_org(id)
    if not record:
        raise HTTPException(status_code=404, detail="Organization not found.")
    return record
