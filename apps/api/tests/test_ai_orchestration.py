import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.ai.coordinator import GemmaCoordinator
from app.ai.schemas import FoodAnalysisInput, UrgencyLevel, PreparationState

MOCK_INITIAL_AI_RESPONSE = {
    "food_name": "Paneer Butter Masala",
    "food_category": "cooked",
    "food_type": "Catering-grade paneer dish",
    "estimated_quantity_kg": 10.0,
    "estimated_servings": 25,
    "preparation_state": "warm",
    "estimated_shelf_life_hours": 3.0,
    "urgency_level": "HIGH",
    "confidence_score": 0.95,
    "allergens_detected": ["dairy"],
    "recommended_org_types": [
        {"org_type": "community_kitchen", "reason": "Accepts large cooked batches."}
    ],
    "food_safety_notes": "Contains dairy. Keep warm.",
    "reasoning": "Paneer curry leftover from a buffet.",
    "safety_flagged": False,
    "multilingual_summary": {
        "en": "10 kg of warm paneer curry available.",
        "hi": "10 किलो गर्म पनीर करी उपलब्ध है।",
        "bn": "10 কেজি গরম পনির কারি পাওয়া যাচ্ছে।"
    },
    "email_draft": {
        "subject": "Food Pickup Available",
        "body_en": "10 kg paneer is ready for collection.",
        "body_hi": "10 किलो पनीर संग्रह के लिए तैयार है।",
        "body_bn": "10 কেজি পনির সংগ্রহের জন্য প্রস্তুত।"
    }
}

MOCK_RANKING_AI_RESPONSE = [
    {
        "org_id": "org_recv_002",
        "org_name": "Snehalaya Community Kitchen",
        "is_recommended": True,
        "matching_score": 0.96,
        "expected_success": "High",
        "pickup_priority": "High",
        "reason": "Perfect match: accepts cooked food, has capacity, and matches vegetarian tags."
    }
]

@pytest.mark.asyncio
async def test_coordinator_orchestration_loop():
    # 1. Setup Mock Gemini Client
    mock_client = MagicMock()
    
    # We want client.generate to return MOCK_INITIAL_AI_RESPONSE first, then MOCK_RANKING_AI_RESPONSE
    async def mock_generate(prompt, images=None, prompt_id=None):
        if prompt_id == "coordinator_ranking":
            return MOCK_RANKING_AI_RESPONSE
        return MOCK_INITIAL_AI_RESPONSE
        
    mock_client.generate = AsyncMock(side_effect=mock_generate)

    # 2. Setup Mock Org Search Results (MongoDB candidates)
    mock_candidates = [
        {
            "id": "org_recv_002",
            "name": "Snehalaya Community Kitchen",
            "category": "community_kitchen",
            "capacity_kg_per_day": 800,
            "operating_hours": "07:00-21:00",
            "dietary_preferences": ["vegetarian", "non-vegetarian"],
            "address": {"street": "Dharavi", "city": "Mumbai"},
            "description": "Provides meals to street workers."
        }
    ]

    coordinator = GemmaCoordinator(client=mock_client)
    
    # Patch the search tool to return mock candidates directly
    coordinator._tools.organization_search = AsyncMock(return_value=mock_candidates)

    input_data = FoodAnalysisInput(
        donor_description="Leftover warm paneer curry from corporate party. Serves 25 people.",
        food_category="cooked",
        declared_quantity=10.0,
        declared_unit="kg",
        donor_location_city="Mumbai",
        latitude=19.082,
        longitude=72.855
    )

    # 3. Execute
    result = await coordinator.analyze_food(input_data=input_data)

    # 4. Verify
    assert result.food_name == "Paneer Butter Masala"
    assert result.estimated_quantity_kg == 10.0
    assert result.urgency_level == UrgencyLevel.HIGH
    assert len(result.recommendations) == 1
    assert result.recommendations[0].org_name == "Snehalaya Community Kitchen"
    assert result.recommendations[0].matching_score == 0.96
    assert result.recommendations[0].is_recommended is True
    assert "Paneer curry leftover from a buffet." in result.reasoning
    assert "Rescuing 10.0 kg of cooked food serves approximately" in result.reasoning
