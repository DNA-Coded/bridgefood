import logging
from typing import List, Optional

from app.ai.coordinator import GemmaCoordinator
from app.ai.schemas import FoodAnalysisInput, FoodAnalysisResult, UrgencyLevel, PreparationState, MultilingualSummary, RecommendedOrgType, EmailDraft
from app.core.config import settings
from app.repositories.food import food_repository
from app.repositories.ai_trace import ai_trace_repository
from app.repositories.org import org_repository
from app.services.email import email_service

logger = logging.getLogger("foodbridge.services.analysis")


class AnalysisService:

    def __init__(self, coordinator: GemmaCoordinator):
        self._coordinator = coordinator

    def _get_mock_result(self) -> FoodAnalysisResult:
        """Returns instant mock analysis result for testing."""
        return FoodAnalysisResult(
            food_name="Nutritious Mixed Vegetables & Rice",
            food_category="cooked",
            food_type="Catered meals - rice base with seasonal vegetables",
            estimated_quantity_kg=12.0,
            estimated_servings=30,
            preparation_state=PreparationState.WARM,
            estimated_shelf_life_hours=4.0,
            urgency_level=UrgencyLevel.HIGH,
            confidence_score=0.92,
            allergens_detected=["dairy"],
            recommended_org_types=[
                RecommendedOrgType(
                    org_type="community_kitchen",
                    reason="Accepts hot cooked meals with refrigeration"
                ),
                RecommendedOrgType(
                    org_type="shelter",
                    reason="High-volume shelters benefit from nutritious prepared meals"
                ),
            ],
            food_safety_notes="Keep above 60°C during transport. Safe for 4 hours from preparation.",
            reasoning="Based on donor description, fresh prepared meal with high nutritional value.",
            multilingual_summary=MultilingualSummary(
                en="12 kg of warm nutritious meal ready for pickup",
                hi="12 किलो गर्म पौष्टिक भोजन संग्रह के लिए तैयार",
                bn="12 কেজি গরম পুষ্টিকর খাবার সংগ্রহের জন্য প্রস্তুত",
            ),
            email_draft=EmailDraft(
                subject="[FoodBridge] High-Urgency: 12kg Nutritious Meal Available Now",
                body_en="A nutritious cooked meal donation of 12kg is available for immediate pickup.",
                body_hi="12 किलो का पौष्टिक खाना दान के लिए तत्काल संग्रह के लिए उपलब्ध है।",
                body_bn="12 কেজি পুষ্টিকর রান্না করা খাবার অবিলম্বে পিকআপের জন্য উপলব্ধ।",
            ),
            recommendations=[]
        )

    async def analyze_food_listing(
        self,
        description: str,
        category: Optional[str] = None,
        declared_quantity: Optional[float] = None,
        declared_unit: Optional[str] = None,
        best_before: Optional[str] = None,
        city: Optional[str] = None,
        listing_id: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        images: Optional[List[bytes]] = None,
    ) -> FoodAnalysisResult:
        """
        Invokes Gemma analysis for a food listing submission.
        Traces recommendations, sends alerts, and updates listing timelines.
        """
        logger.info(f"AnalysisService.analyze_food_listing — listing_id={listing_id}, use_mock={settings.USE_MOCK_ANALYSIS}")

        # ✅ MOCK MODE - Return instant response for faster development/testing
        if settings.USE_MOCK_ANALYSIS:
            logger.info(f"[MOCK] Returning instant mock analysis")
            return self._get_mock_result()

        # 🤖 REAL MODE - Use Gemini/Gemma for actual analysis
        input_data = FoodAnalysisInput(
            listing_id=listing_id,
            donor_description=description,
            food_category=category,
            declared_quantity=declared_quantity,
            declared_unit=declared_unit,
            best_before_hint=best_before,
            donor_location_city=city,
            image_count=len(images or []),
            latitude=latitude,
            longitude=longitude,
        )

        result = await self._coordinator.analyze_food(input_data=input_data, images=images)

        # Tracing and event notifications only if a real listing ID is associated
        if listing_id:
            try:
                # 1. Timeline event: Gemma Analysis
                await food_repository.add_timeline_event(
                    listing_id,
                    "Gemma Analysis",
                    "Gemma coordinator completed shelf-life extraction and safety risk scan."
                )

                # 2. Timeline event: Organizations Recommended & AI Trace Logging
                orgs_list = [r.org_name for r in result.recommendations if r.is_recommended]
                if orgs_list:
                    await food_repository.add_timeline_event(
                        listing_id,
                        "Organizations Recommended",
                        f"Gemma matched {len(orgs_list)} nearby organizations: {', '.join(orgs_list)}."
                    )

                recommendation_dicts = [
                    {
                        "org_id": r.org_id,
                        "org_name": r.org_name,
                        "is_recommended": r.is_recommended,
                        "matching_score": r.matching_score,
                        "expected_success": r.expected_success,
                        "pickup_priority": r.pickup_priority,
                        "reason": r.reason
                    }
                    for r in result.recommendations
                ]
                await ai_trace_repository.create(
                    listing_id=listing_id,
                    recommendation=recommendation_dicts,
                    confidence=result.confidence_score,
                    reasoning=result.reasoning,
                    prompt_version="v4"
                )

                # 3. Email Alert Dispatch to recommended organizations
                sent_any = False
                for r in result.recommendations:
                    if r.is_recommended:
                        org = await org_repository.get_by_id(r.org_id)
                        recipient_email = (org.get("email") if org else None) or f"contact@{r.org_name.lower().replace(' ', '')}.org"
                        context = {
                            "ngo_name": r.org_name,
                            "food_name": result.food_name,
                            "quantity": result.estimated_quantity_kg,
                            "unit": "kg",
                            "urgency": result.urgency_level.value,
                        }
                        await email_service.send_email(
                            recipient=recipient_email,
                            template_type="DONATION_ALERT",
                            context=context,
                            gemma_body=r.reason
                        )
                        sent_any = True

                if sent_any:
                    await food_repository.add_timeline_event(
                        listing_id,
                        "Emails Sent",
                        "Intelligent alerts dispatched to recommended local receivers."
                    )

            except Exception as ex:
                logger.error(f"Failed to process analysis timeline tracking: {ex}")

        return result


