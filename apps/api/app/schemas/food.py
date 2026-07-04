from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class LocationPoint(BaseModel):
    type: str = Field(default="Point")
    coordinates: List[float] = Field(..., min_items=2, max_items=2, example=[-122.4194, 37.7749])

class PickupWindow(BaseModel):
    start_time: datetime
    end_time: datetime

class FoodListingCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100, example="Cooked Vegetable Biryani")
    category: str = Field(..., example="cooked")  # cooked, packaged, raw
    food_type: Optional[str] = Field(None, example="Catering leftover")
    description: str = Field(..., min_length=10, max_length=1000)
    is_vegetarian: str = Field(default="vegetarian", example="vegetarian")
    allergens: Optional[str] = Field(None, example="Dairy, Gluten")
    quantity: float = Field(..., gt=0)
    unit: str = Field(default="kg", example="kg")
    servings: Optional[int] = Field(None, ge=0)
    prep_date: Optional[datetime] = None
    best_before: datetime
    pickup_address: str = Field(..., min_length=5)
    contact_person: str = Field(..., min_length=2)
    contact_number: str = Field(..., min_length=7)
    special_instructions: Optional[str] = None
    location: Optional[LocationPoint] = None

class FoodListingUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    best_before: Optional[datetime] = None
    pickup_address: Optional[str] = None

class TimelineEvent(BaseModel):
    type: str
    description: str
    timestamp: str

class FoodListingResponse(BaseModel):
    id: str
    donor_id: str
    title: str
    category: str
    food_type: Optional[str] = None
    description: str
    is_vegetarian: str
    allergens: Optional[str] = None
    quantity: float
    unit: str
    servings: Optional[int] = None
    prep_date: Optional[datetime] = None
    best_before: datetime
    pickup_address: str
    contact_person: str
    contact_number: str
    special_instructions: Optional[str] = None
    state: str
    timeline: List[TimelineEvent] = []
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

