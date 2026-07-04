from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ExtractedData(BaseModel):
    item_name: str
    quantity_kg: float
    urgency: str
    allergens: List[str]
    categories: List[str]

class GemmaAnalysisResponse(BaseModel):
    id: str
    listing_id: Optional[str] = None
    raw_input_text: str
    extracted_data: ExtractedData
    safety_flagged: bool = False
    execution_duration_ms: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "ana_mock101",
                "raw_input_text": "3 large warm vegetable rice trays.",
                "extracted_data": {
                    "item_name": "Vegetable Rice",
                    "quantity_kg": 15.0,
                    "urgency": "HIGH",
                    "allergens": ["dairy"],
                    "categories": ["cooked"]
                },
                "safety_flagged": False,
                "execution_duration_ms": 340
            }
        }
