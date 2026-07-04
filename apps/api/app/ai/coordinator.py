"""
FoodBridge AI - Gemma Operations Coordinator

The single entry point for all AI tasks in FoodBridge.
The coordinator:
  - Holds the Gemini client
  - Instantiates and routes to the correct pipeline
  - Determines when external tools are needed (tool interfaces only — no execution yet)
  - Never exposes model internals to routers or services
"""
import logging
from typing import Any, Dict, List, Optional

from app.ai.client import get_gemini_client, GeminiClient
from app.ai.pipelines.food_analysis import FoodAnalysisPipeline
from app.ai.schemas import FoodAnalysisInput, FoodAnalysisResult
from app.core.config import settings

logger = logging.getLogger("foodbridge.ai.coordinator")


# ── Coordinator ────────────────────────────────────────────────────────────────

from app.ai.tools.registry import ToolRegistry
from app.ai.prompts.food_prompts import organization_ranking_prompt
from app.ai.schemas import OrgRecommendation

class GemmaCoordinator:
    """
    Central AI Operations Coordinator for FoodBridge.

    Routes tasks to specialized pipelines. Orchestrates tools (MongoDB search,
    impact calculations, drafts) to produce structured reports.
    """

    def __init__(self, client: GeminiClient):
        self._client = client
        self._tools = ToolRegistry(client=self._client)
        self._food_pipeline = FoodAnalysisPipeline(client=self._client)
        logger.info("GemmaCoordinator initialized")

    # ── Public task methods ────────────────────────────────────────────────────

    async def analyze_food(
        self,
        input_data: FoodAnalysisInput,
        images: Optional[List[bytes]] = None,
    ) -> FoodAnalysisResult:
        """
        Runs the full multimodal food analysis and matching orchestration pipeline.
        Returns a structured FoodAnalysisResult with live matching recommendations.
        """
        logger.info(f"Coordinator dispatching: analyze_food — '{input_data.donor_description[:50]}...'")
        
        # 1. Base Food Assessment
        result = await self._food_pipeline.run(input_data=input_data, images=images)
        
        # 2. Decide if we search nearby organizations
        if not result.safety_flagged and result.recommended_org_types:
            categories = [o.org_type for o in result.recommended_org_types]
            
            # Call organization search tool from registry
            candidates = await self._tools.organization_search(
                longitude=input_data.longitude,
                latitude=input_data.latitude,
                radius_km=15.0,
                categories=categories,
                dietary_preferences=result.allergens_detected if result.allergens_detected else None
            )
            
            if candidates:
                # 3. Call Gemma to Rank & Explain
                prompt = organization_ranking_prompt(
                    food_name=result.food_name,
                    urgency_level=result.urgency_level.value,
                    preparation_state=result.preparation_state.value,
                    dietary_preferences=result.allergens_detected,
                    candidates=candidates
                )
                
                try:
                    ranked_raw = await self._client.generate(prompt=prompt, prompt_id="coordinator_ranking")
                    recommendations = []
                    # Handle raw response list or dict
                    items_list = ranked_raw if isinstance(ranked_raw, list) else ranked_raw.get("recommendations", [])
                    for item in items_list:
                        recommendations.append(
                            OrgRecommendation(
                                org_id=item.get("org_id", ""),
                                org_name=item.get("org_name", ""),
                                is_recommended=bool(item.get("is_recommended", True)),
                                matching_score=float(item.get("matching_score", 0.5)),
                                expected_success=item.get("expected_success", "Medium"),
                                pickup_priority=item.get("pickup_priority", "Medium"),
                                reason=item.get("reason", "")
                            )
                        )
                    result.recommendations = recommendations
                except Exception as e:
                    logger.error(f"Failed to rank candidate organizations: {e}")
                    # Fallback recommendations from candidate lists
                    result.recommendations = [
                        OrgRecommendation(
                            org_id=c.get("id"),
                            org_name=c.get("name"),
                            is_recommended=True,
                            matching_score=0.8,
                            expected_success="Medium",
                            pickup_priority=result.urgency_level.value,
                            reason="Automatically matched due to close location."
                        )
                        for c in candidates[:3]
                    ]
        
        # 4. Call Impact Calculator tool
        impact = self._tools.impact_calculator(result.estimated_quantity_kg, result.food_category)
        
        # Add impact summaries to result reasoning for observability
        impact_summary = impact.get("summary_en", "")
        result.reasoning = f"{result.reasoning} [Trace: {impact_summary}]"
        
        logger.info(f"AI Coordination complete. Recommendations count: {len(result.recommendations)}")
        return result


# ── Dependency factory ─────────────────────────────────────────────────────────

_coordinator_instance: Optional[GemmaCoordinator] = None


def get_coordinator() -> GemmaCoordinator:
    """
    FastAPI dependency-injectable factory.
    Returns the singleton GemmaCoordinator, initializing it on first call.
    """
    global _coordinator_instance
    if _coordinator_instance is None:
        client = get_gemini_client(api_key=settings.GEMINI_API_KEY)
        _coordinator_instance = GemmaCoordinator(client=client)
        logger.info("GemmaCoordinator singleton created")
    return _coordinator_instance

