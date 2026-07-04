"""
FoodBridge AI - Food Analysis Pipeline

Orchestrates the complete multimodal food analysis flow:
  1. Build prompt from input
  2. Call Gemini client (text + optional images)
  3. Parse JSON response
  4. Validate result
  5. Return typed FoodAnalysisResult
"""
import logging
import uuid
from typing import List, Optional

from app.ai.client import GeminiClient, GeminiClientError
from app.ai.parsers.food_parser import parse_food_analysis, ParserError
from app.ai.validators.food_validator import validate_food_analysis, ValidationError
from app.ai.prompts.food_prompts import food_analysis_prompt
from app.ai.schemas import FoodAnalysisInput, FoodAnalysisResult, UrgencyLevel, PreparationState, MultilingualSummary

logger = logging.getLogger("foodbridge.ai.pipelines.food_analysis")


class FoodAnalysisPipeline:
    """
    Executes the end-to-end food analysis task.
    Keeps the coordinator clean by encapsulating all pipeline logic here.
    """

    def __init__(self, client: GeminiClient):
        self.client = client

    async def run(
        self,
        input_data: FoodAnalysisInput,
        images: Optional[List[bytes]] = None,
    ) -> FoodAnalysisResult:
        """
        Runs the multimodal food analysis pipeline.

        Args:
            input_data: Structured donor submission fields.
            images: Optional list of raw image bytes.

        Returns:
            Validated FoodAnalysisResult with all structured fields.
        """
        prompt_id = f"food_analysis_{uuid.uuid4().hex[:8]}"
        has_images = bool(images)

        logger.info(
            f"[{prompt_id}] Starting food analysis pipeline — "
            f"city={input_data.donor_location_city}, images={len(images or [])}"
        )

        prompt = food_analysis_prompt(
            description=input_data.donor_description,
            category=input_data.food_category,
            declared_quantity=input_data.declared_quantity,
            declared_unit=input_data.declared_unit,
            best_before_hint=input_data.best_before_hint,
            city=input_data.donor_location_city,
            has_images=has_images,
        )

        try:
            raw_response = await self.client.generate(
                prompt=prompt,
                images=images,
                prompt_id=prompt_id,
            )
        except GeminiClientError as e:
            logger.error(f"[{prompt_id}] Gemini client error: {e}")
            return self._fallback_result(input_data, str(e))

        try:
            parsed = parse_food_analysis(raw_response)
        except ParserError as e:
            logger.error(f"[{prompt_id}] Parser error: {e}")
            return self._fallback_result(input_data, str(e))

        try:
            validated = validate_food_analysis(parsed)
        except ValidationError as e:
            logger.error(f"[{prompt_id}] Validation error: {e}")
            return self._fallback_result(input_data, str(e))

        logger.info(
            f"[{prompt_id}] Pipeline complete — "
            f"urgency={validated.urgency_level}, confidence={validated.confidence_score:.2f}"
        )
        return validated

    def _fallback_result(self, input_data: FoodAnalysisInput, error_msg: str) -> FoodAnalysisResult:
        """
        Returns a safe, conservative fallback result when the pipeline fails.
        Prevents the entire donation flow from breaking due to an AI error.
        """
        logger.warning(f"Using fallback result due to: {error_msg}")
        return FoodAnalysisResult(
            food_name=input_data.donor_description[:60] or "Surplus Food",
            food_category=input_data.food_category or "unknown",
            food_type="Unclassified",
            estimated_quantity_kg=input_data.declared_quantity or 0.0,
            estimated_servings=0,
            preparation_state=PreparationState.UNKNOWN,
            estimated_shelf_life_hours=4.0,
            urgency_level=UrgencyLevel.MEDIUM,
            confidence_score=0.0,
            allergens_detected=[],
            recommended_org_types=[],
            food_safety_notes="Automatic analysis unavailable. Please have a coordinator review manually.",
            reasoning=f"AI analysis pipeline encountered an error: {error_msg}",
            multilingual_summary=MultilingualSummary(
                en="Food available for pickup — manual review required.",
                hi="खाद्य सामग्री उठाने के लिए उपलब्ध है — कृपया समीक्षा करें।",
                bn="খাবার সংগ্রহের জন্য উপলব্ধ — অনুগ্রহ করে পর্যালোচনা করুন।",
            ),
            safety_flagged=False,
        )
