"""
FoodBridge AI - Response Validators

Guards against malformed, incomplete, or unsafe AI responses before they
reach the application layer. Applied after parsing.
"""
import logging
from app.ai.schemas import FoodAnalysisResult

logger = logging.getLogger("foodbridge.ai.validators")


class ValidationError(Exception):
    pass


def validate_food_analysis(result: FoodAnalysisResult) -> FoodAnalysisResult:
    """
    Validates a parsed FoodAnalysisResult for business-rule compliance.
    Raises ValidationError if the result is unusable.
    Returns the (possibly corrected) result if issues are minor.
    """
    errors = []

    if not result.food_name or result.food_name == "Unidentified Food Item":
        errors.append("food_name is missing or generic")

    if result.estimated_quantity_kg <= 0:
        errors.append(f"estimated_quantity_kg must be > 0, got {result.estimated_quantity_kg}")

    if result.estimated_shelf_life_hours < 0:
        errors.append(f"estimated_shelf_life_hours cannot be negative, got {result.estimated_shelf_life_hours}")

    if not (0.0 <= result.confidence_score <= 1.0):
        logger.warning(f"confidence_score out of range ({result.confidence_score}), clamping")
        result.confidence_score = max(0.0, min(1.0, result.confidence_score))

    if len(errors) >= 2:
        raise ValidationError(
            f"Gemma response failed validation with {len(errors)} errors: {'; '.join(errors)}"
        )

    if errors:
        logger.warning(f"Minor validation issues (non-blocking): {errors}")

    return result
