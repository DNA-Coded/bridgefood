from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class AddressSchema(BaseModel):
    street: str
    city: str
    zip: str

class LocationSchema(BaseModel):
    type: str = "Point"
    coordinates: List[float] # [longitude, latitude]

class OrganizationResponse(BaseModel):
    id: str
    user_id: str
    name: str
    category: str
    location: LocationSchema
    address: AddressSchema
    dietary_preferences: List[str]
    is_approved: bool = Field(default=True)

    class Config:
        from_attributes = True
