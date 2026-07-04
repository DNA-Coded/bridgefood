"""
FoodBridge AI - Response Parsers

Converts raw Gemma JSON output dicts into validated Pydantic schema objects.
Parsers are the boundary between untyped AI output and typed application state.
"""
import logging
from typing import Any, Dict

from app.ai.schemas import (
    FoodAnalysisResult,
    MultilingualSummary,
    RecommendedOrgType,
    EmailDraft,
    UrgencyLevel,
    PreparationState,
    OrgRecommendation,
)

logger = logging.getLogger("foodbridge.ai.parsers")


class ParserError(Exception):
    """Raised when the AI response cannot be parsed into the expected schema."""
    pass


def parse_food_analysis(raw: Dict[str, Any]) -> FoodAnalysisResult:
    """
    Parses and validates a raw Gemma dict into a FoodAnalysisResult.
    Applies safe defaults for optional/nullable fields.
    """
    try:
        multilingual_raw = raw.get("multilingual_summary", {})
        multilingual = MultilingualSummary(
            en=multilingual_raw.get("en", "Food available for pickup."),
            hi=multilingual_raw.get("hi", "भोजन संग्रह के लिए उपलब्ध है।"),
            bn=multilingual_raw.get("bn", "খাবার সংগ্রহের জন্য উপলব্ধ।"),
        )

        org_types = [
            RecommendedOrgType(
                org_type=item.get("org_type", "shelter"),
                reason=item.get("reason", "Suitable for this food type.")
            )
            for item in raw.get("recommended_org_types", [])
        ]

        email_raw = raw.get("email_draft")
        email_draft = None
        if email_raw:
            email_draft = EmailDraft(
                subject=email_raw.get("subject", "Food Donation Available"),
                body_en=email_raw.get("body_en", ""),
                body_hi=email_raw.get("body_hi", ""),
                body_bn=email_raw.get("body_bn", ""),
            )

        recommendations_raw = raw.get("recommendations", [])
        recommendations = [
            OrgRecommendation(
                org_id=item.get("org_id", ""),
                org_name=item.get("org_name", ""),
                is_recommended=bool(item.get("is_recommended", True)),
                matching_score=float(item.get("matching_score", 0.5)),
                expected_success=item.get("expected_success", "Medium"),
                pickup_priority=item.get("pickup_priority", "Medium"),
                reason=item.get("reason", "")
            )
            for item in recommendations_raw
        ]

        # Normalise enums safely
        urgency_str = str(raw.get("urgency_level", "MEDIUM")).upper()
        urgency = UrgencyLevel(urgency_str) if urgency_str in UrgencyLevel.__members__ else UrgencyLevel.MEDIUM

        prep_str = str(raw.get("preparation_state", "unknown")).lower()
        prep = PreparationState(prep_str) if prep_str in PreparationState.__members__ else PreparationState.UNKNOWN

        return FoodAnalysisResult(
            food_name=raw.get("food_name", "Unidentified Food Item"),
            food_category=raw.get("food_category", "unknown"),
            food_type=raw.get("food_type", ""),
            estimated_quantity_kg=float(raw.get("estimated_quantity_kg", 0.0)),
            estimated_servings=int(raw.get("estimated_servings", 0)),
            preparation_state=prep,
            estimated_shelf_life_hours=float(raw.get("estimated_shelf_life_hours", 0.0)),
            urgency_level=urgency,
            confidence_score=min(1.0, max(0.0, float(raw.get("confidence_score", 0.5)))),
            allergens_detected=raw.get("allergens_detected", []),
            recommended_org_types=org_types,
            food_safety_notes=raw.get("food_safety_notes", ""),
            reasoning=raw.get("reasoning", ""),
            multilingual_summary=multilingual,
            email_draft=email_draft,
            safety_flagged=bool(raw.get("safety_flagged", False)),
            recommendations=recommendations,
        )

    except Exception as e:
        logger.error(f"Failed to parse food analysis response: {e}. Raw: {raw}")
        raise ParserError(f"Could not parse Gemma food analysis response: {e}") from e

