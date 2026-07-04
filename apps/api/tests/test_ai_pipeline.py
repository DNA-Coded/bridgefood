"""
FoodBridge AI - AI Pipeline Tests

Tests the Gemma client, prompts, parser, validator, and pipeline
using mocked Google AI responses (no real API calls during tests).
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


# ── Fixtures ───────────────────────────────────────────────────────────────────

MOCK_GEMMA_RESPONSE = {
    "food_name": "Vegetable Biryani",
    "food_category": "cooked",
    "food_type": "Catering-grade rice dish",
    "estimated_quantity_kg": 12.0,
    "estimated_servings": 30,
    "preparation_state": "warm",
    "estimated_shelf_life_hours": 3.0,
    "urgency_level": "HIGH",
    "confidence_score": 0.91,
    "allergens_detected": ["gluten"],
    "recommended_org_types": [
        {"org_type": "community_kitchen", "reason": "Accepts large cooked batches."}
    ],
    "food_safety_notes": "Keep warm above 60°C during transport.",
    "reasoning": "Donor described a large warm catering batch after an event.",
    "safety_flagged": False,
    "multilingual_summary": {
        "en": "12 kg of warm biryani available for pickup.",
        "hi": "12 किलो गर्म बिरयानी उपलब्ध है।",
        "bn": "12 কেজি গরম বিরিয়ানি পাওয়া যাচ্ছে।"
    },
    "email_draft": {
        "subject": "Food Pickup Available",
        "body_en": "12 kg biryani is ready for collection.",
        "body_hi": "12 किलो बिरयानी संग्रह के लिए तैयार है।",
        "body_bn": "12 কেজি বিরিয়ানি সংগ্রহের জন্য প্রস্তুত।"
    }
}


# ── Parser Tests ───────────────────────────────────────────────────────────────

def test_food_parser_success():
    from app.ai.parsers.food_parser import parse_food_analysis
    result = parse_food_analysis(MOCK_GEMMA_RESPONSE)
    assert result.food_name == "Vegetable Biryani"
    assert result.estimated_quantity_kg == 12.0
    assert result.urgency_level.value == "HIGH"
    assert result.confidence_score == 0.91
    assert "gluten" in result.allergens_detected
    assert result.multilingual_summary.hi == "12 किलो गर्म बिरयानी उपलब्ध है।"
    assert result.email_draft is not None


def test_food_parser_missing_fields_uses_defaults():
    from app.ai.parsers.food_parser import parse_food_analysis
    minimal = {"food_name": "Rice", "estimated_quantity_kg": 5.0}
    result = parse_food_analysis(minimal)
    assert result.food_name == "Rice"
    assert result.allergens_detected == []
    assert result.confidence_score == 0.5  # default


def test_food_parser_invalid_urgency_falls_back_to_medium():
    from app.ai.parsers.food_parser import parse_food_analysis
    bad = {**MOCK_GEMMA_RESPONSE, "urgency_level": "SUPER_URGENT"}
    result = parse_food_analysis(bad)
    assert result.urgency_level.value == "MEDIUM"


# ── Validator Tests ────────────────────────────────────────────────────────────

def test_validator_rejects_zero_quantity():
    from app.ai.parsers.food_parser import parse_food_analysis
    from app.ai.validators.food_validator import validate_food_analysis, ValidationError
    bad = {**MOCK_GEMMA_RESPONSE, "estimated_quantity_kg": 0.0, "food_name": "Unidentified Food Item"}
    result = parse_food_analysis(bad)
    with pytest.raises(ValidationError):
        validate_food_analysis(result)


def test_validator_clamps_out_of_range_confidence():
    from app.ai.parsers.food_parser import parse_food_analysis
    from app.ai.validators.food_validator import validate_food_analysis
    clamped = {**MOCK_GEMMA_RESPONSE, "confidence_score": 1.5}
    result = parse_food_analysis(clamped)
    validated = validate_food_analysis(result)
    assert validated.confidence_score == 1.0


# ── Pipeline Integration Test (mocked client) ──────────────────────────────────

@pytest.mark.asyncio
async def test_food_pipeline_success():
    from app.ai.pipelines.food_analysis import FoodAnalysisPipeline
    from app.ai.schemas import FoodAnalysisInput

    mock_client = MagicMock()
    mock_client.generate = AsyncMock(return_value={**MOCK_GEMMA_RESPONSE, "_meta": {}})

    pipeline = FoodAnalysisPipeline(client=mock_client)
    result = await pipeline.run(
        FoodAnalysisInput(donor_description="Three warm trays of biryani from a wedding.")
    )

    assert result.food_name == "Vegetable Biryani"
    assert result.urgency_level.value == "HIGH"
    mock_client.generate.assert_awaited_once()


@pytest.mark.asyncio
async def test_food_pipeline_returns_fallback_on_client_error():
    from app.ai.pipelines.food_analysis import FoodAnalysisPipeline
    from app.ai.schemas import FoodAnalysisInput
    from app.ai.client import GeminiClientError

    mock_client = MagicMock()
    mock_client.generate = AsyncMock(side_effect=GeminiClientError("API timeout"))

    pipeline = FoodAnalysisPipeline(client=mock_client)
    result = await pipeline.run(
        FoodAnalysisInput(donor_description="Leftover rice from canteen.")
    )

    # Should return a safe fallback, not raise
    assert result.confidence_score == 0.0
    assert result.food_safety_notes != ""
    assert "error" in result.reasoning.lower()
