import logging
import time
from typing import Dict, List, Optional
from app.services.org_intelligence import org_intelligence_service
from app.ai.client import GeminiClient

logger = logging.getLogger("foodbridge.ai.tools.registry")

class ToolRegistry:
    def __init__(self, client: GeminiClient):
        self._client = client

    async def organization_search(
        self,
        longitude: Optional[float] = None,
        latitude: Optional[float] = None,
        radius_km: float = 15.0,
        categories: Optional[List[str]] = None,
        dietary_preferences: Optional[List[str]] = None,
    ) -> List[Dict]:
        """Tool: Search MongoDB for receivers matching criteria."""
        start = time.time()
        try:
            candidates = await org_intelligence_service.find_candidates(
                longitude=longitude,
                latitude=latitude,
                radius_km=radius_km,
                categories=categories,
                dietary_preferences=dietary_preferences,
            )
            elapsed = int((time.time() - start) * 1000)
            logger.info(f"[TOOL] organization_search: found {len(candidates)} candidates in {elapsed}ms")
            return candidates
        except Exception as e:
            logger.error(f"[TOOL] organization_search failed: {e}")
            return []

    def impact_calculator(self, quantity_kg: float, category: str) -> Dict:
        """Tool: Compute environmental and social impact statistics."""
        start = time.time()
        meals = int(quantity_kg / 0.4)
        co2 = round(quantity_kg * 2.5, 1)
        water = int(quantity_kg * 1000)

        summary = (
            f"Rescuing {quantity_kg} kg of {category} food serves approximately {meals} meals, "
            f"saves {co2} kg of greenhouse gas emissions, and conserves {water} L of embedded water."
        )

        elapsed = int((time.time() - start) * 1000)
        logger.info(f"[TOOL] impact_calculator completed in {elapsed}ms")
        return {
            "meals_served": meals,
            "co2_saved_kg": co2,
            "water_saved_liters": water,
            "summary_en": summary,
        }

    async def email_generation(
        self,
        food_name: str,
        quantity_kg: float,
        urgency: str,
        pickup_address: str,
    ) -> Dict:
        """Tool: Draft professional pickup notifications using Gemma."""
        start = time.time()
        prompt = f"""
        You are the AI Operations Coordinator for FoodBridge.
        Draft a professional 3-sentence pickup notification email for:
        - Food Item: {food_name}
        - Quantity: {quantity_kg} kg
        - Urgency: {urgency}
        - Pickup Address: {pickup_address}

        Return ONLY a JSON object with this exact structure:
        {{
          "subject": "Email subject line",
          "body_en": "Draft in English",
          "body_hi": "Draft in Hindi",
          "body_bn": "Draft in Bengali"
        }}
        """.strip()

        try:
            response = await self._client.generate(prompt=prompt, prompt_id="tool_email_gen")
            elapsed = int((time.time() - start) * 1000)
            logger.info(f"[TOOL] email_generation completed in {elapsed}ms")
            return response
        except Exception as e:
            logger.error(f"[TOOL] email_generation failed: {e}")
            return {
                "subject": f"Food Donation Available: {food_name}",
                "body_en": f"A donation of {quantity_kg} kg of {food_name} is available at {pickup_address}. Urgency: {urgency}.",
                "body_hi": f"{pickup_address} पर {quantity_kg} किलो {food_name} उपलब्ध है। तत्काल: {urgency}।",
                "body_bn": f"{pickup_address} এ {quantity_kg} কেজি {food_name} পাওয়া যাচ্ছে। জরুরি অবস্থা: {urgency}।",
            }

    async def translation(self, text: str, target_langs: List[str]) -> Dict[str, str]:
        """Tool: Translate summary alerts to target languages."""
        start = time.time()
        prompt = f"""
        Translate this text alert into the requested languages:
        "{text}"
        Target languages: {', '.join(target_langs)}

        Return ONLY a JSON object mapping language code (e.g. "hi", "bn") to translated text:
        {{
          "hi": "Hindi translation",
          "bn": "Bengali translation"
        }}
        """.strip()

        try:
            response = await self._client.generate(prompt=prompt, prompt_id="tool_translation")
            elapsed = int((time.time() - start) * 1000)
            logger.info(f"[TOOL] translation completed in {elapsed}ms")
            return response
        except Exception as e:
            logger.error(f"[TOOL] translation failed: {e}")
            return {
                "hi": "अनुवाद अनुपलब्ध है।",
                "bn": "অনুবাদ উপলব্ধ নয়।",
            }
