"""
FoodBridge AI - Analysis Router

Replaces the /analysis/mock endpoint with a real Gemma 4 orchestration endpoint.
Maintains schema compatibility with the frontend.
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.ai.coordinator import GemmaCoordinator, get_coordinator
from app.ai.schemas import FoodAnalysisResult, UrgencyLevel, PreparationState, MultilingualSummary, RecommendedOrgType, EmailDraft
from app.services.analysis import AnalysisService
from app.core.config import settings

logger = logging.getLogger("foodbridge.routers.analysis")

router = APIRouter()


def get_analysis_service(coordinator: GemmaCoordinator = Depends(get_coordinator)) -> AnalysisService:
    return AnalysisService(coordinator=coordinator)


@router.post(
    "",
    response_model=FoodAnalysisResult,
    status_code=status.HTTP_200_OK,
    summary="Analyze a food listing with Gemma 4",
    description=(
        "Submits a donor description (and optional images) to the Gemma AI "
        "Operations Coordinator. Returns a fully structured food safety and "
        "matching report. The frontend renders this without modification."
    ),
    tags=["AI Analysis"],
)
async def analyze_food(
    description: str = Form(..., example="Three trays of cooked pulao from today's wedding"),
    category: Optional[str] = Form(None, example="cooked"),
    declared_quantity: Optional[float] = Form(None, example=15.0),
    declared_unit: Optional[str] = Form(None, example="kg"),
    best_before: Optional[str] = Form(None, example="2026-07-04T22:00:00Z"),
    city: Optional[str] = Form(None, example="Mumbai"),
    listing_id: Optional[str] = Form(None, example="list_abc123"),
    latitude: Optional[float] = Form(None, example=19.082),
    longitude: Optional[float] = Form(None, example=72.855),
    images: Optional[List[UploadFile]] = File(None),
    service: AnalysisService = Depends(get_analysis_service),
):
    """
    POST /api/v1/analysis

    Accepts multipart form data with:
    - Food description text (required)
    - Food category, quantity, unit (optional)
    - Best-before hint as ISO datetime string (optional)
    - Donor city for proximity hints (optional)
    - Listing ID for tracking (optional)
    - Latitude and Longitude for proximity matches (optional)
    - Up to 3 food images (optional, multipart)

    Returns: FoodAnalysisResult (structured JSON, no free text)
    """
    logger.info(f"[ANALYSIS] Request received — description: {description[:50]}, images: {len(images or [])}")
    
    image_bytes: List[bytes] = []
    if images:
        for img in images[:3]:  # Cap at 3 images
            content = await img.read()
            if len(content) > 5 * 1024 * 1024:  # 5MB limit per image
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Image '{img.filename}' exceeds 5MB limit."
                )
            image_bytes.append(content)

    try:
        logger.info(f"[ANALYSIS] Calling service.analyze_food_listing...")
        result = await service.analyze_food_listing(
            description=description,
            category=category,
            declared_quantity=declared_quantity,
            declared_unit=declared_unit,
            best_before=best_before,
            city=city,
            listing_id=listing_id,
            latitude=latitude,
            longitude=longitude,
            images=image_bytes if image_bytes else None,
        )
        logger.info(f"[ANALYSIS] Success! Returning result")
        return result


    except Exception as e:
        logger.error(f"Analysis endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI analysis pipeline encountered an unexpected error. Please retry."
        )


@router.get(
    "/mock",
    response_model=FoodAnalysisResult,
    summary="[Testing] Returns a static mock Gemma analysis report",
    description="Use this endpoint during frontend development or when the AI key is unavailable.",
)
async def get_mock_analysis():
    """Returns a static hardcoded analysis result for frontend testing."""
    from app.ai.schemas import (
        UrgencyLevel, PreparationState, MultilingualSummary,
        RecommendedOrgType, EmailDraft
    )
    return FoodAnalysisResult(
        food_name="Saffron Vegetable Rice",
        food_category="cooked",
        food_type="Catering-grade rice and dal (pulao)",
        estimated_quantity_kg=15.0,
        estimated_servings=37,
        preparation_state=PreparationState.WARM,
        estimated_shelf_life_hours=3.5,
        urgency_level=UrgencyLevel.HIGH,
        confidence_score=0.94,
        allergens_detected=["dairy"],
        recommended_org_types=[
            RecommendedOrgType(
                org_type="community_kitchen",
                reason="Accepts hot cooked meals and has refrigerated storage for extended holding."
            ),
            RecommendedOrgType(
                org_type="shelter",
                reason="High occupancy shelters benefit from calorie-dense rice dishes."
            ),
        ],
        food_safety_notes="Maintain temperature above 60°C during transport. Consume within 3.5 hours of prep.",
        reasoning=(
            "Donor description indicates freshly prepared catering-grade rice. "
            "Warm preparation state and high quantity suggest recent event leftovers. "
            "Urgency set HIGH given 3.5-hour safe holding window."
        ),
        multilingual_summary=MultilingualSummary(
            en="15 kg of warm vegetable rice available for immediate pickup.",
            hi="15 किलो गर्म सब्जी चावल तत्काल संग्रह के लिए उपलब्ध है।",
            bn="15 কেজি গরম সবজি ভাত এখনই সংগ্রহের জন্য উপলব্ধ।",
        ),
        email_draft=EmailDraft(
            subject="[FoodBridge] Urgent Pickup: 15kg Vegetable Rice Available Now",
            body_en=(
                "Dear Coordinator, a donation of 15 kg warm vegetable rice is available for immediate pickup. "
                "Please confirm your ETA to the donor within 30 minutes. "
                "Contact: see listing details on the FoodBridge platform."
            ),
            body_hi=(
                "प्रिय समन्वयक, 15 किलो गर्म सब्जी चावल तत्काल संग्रह के लिए उपलब्ध है। "
                "कृपया 30 मिनट के भीतर अपनी अनुमानित समय की पुष्टि करें।"
            ),
            body_bn=(
                "প্রিয় সমন্বয়কারী, 15 কেজি গরম সবজি ভাত এখনই সংগ্রহের জন্য উপলব্ধ। "
                "অনুগ্রহ করে 30 মিনিটের মধ্যে আপনার ETA নিশ্চিত করুন।"
            ),
        ),
        safety_flagged=False,
    )
