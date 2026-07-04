"""
FoodBridge AI - Dedicated Prompt Templates

Each function returns a fully-engineered prompt string.
Prompts are separated by concern; never use one monolithic prompt.
"""
from typing import Optional


def food_analysis_prompt(
    description: str,
    category: Optional[str],
    declared_quantity: Optional[float],
    declared_unit: Optional[str],
    best_before_hint: Optional[str],
    city: Optional[str],
    has_images: bool,
) -> str:
    """
    Master food analysis prompt. Instructs Gemma to act as an
    operations coordinator — not a chatbot — and return strict JSON only.
    """
    image_clause = (
        "Additionally, carefully examine the provided food images and incorporate "
        "visual observations (container count, portion size, packaging, visible spoilage indicators) "
        "into your assessment."
        if has_images else
        "No images were provided. Base your analysis on the text description only."
    )

    quantity_clause = (
        f"The donor has declared approximately {declared_quantity} {declared_unit or 'kg'}. "
        "Use this as a reference when estimating."
        if declared_quantity else
        "No quantity was declared. Estimate based on context clues in the description."
    )

    return f"""
You are the AI Operations Coordinator for FoodBridge — a humanitarian food surplus coordination platform.
Your role is NOT to answer questions. Your role is to analyze surplus food data and produce structured operational reports.

---
DONOR DESCRIPTION:
"{description}"

DECLARED FOOD CATEGORY: {category or "unknown"}
{quantity_clause}
BEST BEFORE HINT: {best_before_hint or "not provided"}
DONOR CITY: {city or "not specified"}
{image_clause}
---

Produce a SINGLE JSON object (no markdown, no explanation text) with EXACTLY these fields:

{{
  "food_name": "Short, specific name of the food item",
  "food_category": "cooked|raw|packaged",
  "food_type": "Detailed type, e.g. 'Catering-grade rice and dal'",
  "estimated_quantity_kg": <float — estimated total kilograms>,
  "estimated_servings": <integer — approximate number of adult servings>,
  "preparation_state": "hot|warm|ambient|chilled|frozen|unknown",
  "estimated_shelf_life_hours": <float — hours from now it remains safe>,
  "urgency_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "confidence_score": <float 0.0–1.0 — your confidence in this analysis>,
  "allergens_detected": ["list", "of", "allergens"],
  "recommended_org_types": [
    {{
      "org_type": "community_kitchen|shelter|food_bank|orphanage|animal_shelter",
      "reason": "Single sentence explaining why this org type suits this food"
    }}
  ],
  "food_safety_notes": "Critical safety guidance for handlers and transport",
  "reasoning": "2–4 sentences explaining your analysis decisions",
  "safety_flagged": <boolean — true only if food is potentially unsafe>,
  "multilingual_summary": {{
    "en": "One-sentence pickup alert in English",
    "hi": "Same alert in Hindi",
    "bn": "Same alert in Bengali"
  }},
  "email_draft": {{
    "subject": "Short email subject line",
    "body_en": "Professional 3-sentence pickup notification email in English",
    "body_hi": "Same email in Hindi",
    "body_bn": "Same email in Bengali"
  }}
}}

RULES:
- Return ONLY the JSON. No preamble, no explanation.
- Be conservative: if uncertain, lower confidence_score and use urgency MEDIUM.
- Never hallucinate specific allergens without evidence. Use empty list if none detected.
- Urgency CRITICAL = <2 hrs. HIGH = <4 hrs. MEDIUM = <8 hrs. LOW = shelf-stable.
- animal_shelter should only appear in recommended_org_types for non-human-grade food.
""".strip()


def image_analysis_prompt() -> str:
    """
    Standalone image-only analysis prompt used when images are the primary input.
    """
    return """
You are a food safety inspector reviewing images of surplus food for a humanitarian donation platform.

Examine the provided images and return ONLY this JSON:

{
  "visible_food_items": ["list of identified items"],
  "estimated_container_count": <integer>,
  "packaging_type": "open_tray|sealed_container|loose|bagged|unknown",
  "estimated_quantity_kg": <float>,
  "visible_spoilage": <boolean>,
  "spoilage_indicators": ["list of any observed spoilage signs"],
  "preparation_state": "hot|warm|ambient|chilled|frozen|unknown",
  "confidence": <float 0.0–1.0>,
  "image_notes": "Brief objective description of what is visible"
}

RULES:
- Do NOT make medical or safety guarantees.
- If you cannot determine a field, use null.
- Return ONLY JSON. No commentary.
""".strip()


def impact_estimation_prompt(quantity_kg: float, org_type: str) -> str:
    """Estimates the social and environmental impact of a donation."""
    return f"""
You are an impact analyst for a food rescue platform.

A donation of {quantity_kg} kg of food is being matched to a {org_type}.

Return ONLY this JSON:

{{
  "estimated_meals_served": <integer>,
  "estimated_people_fed": <integer>,
  "co2_saved_kg": <float — kg of CO2 emissions avoided vs landfill>,
  "water_saved_liters": <float — water embedded in the food saved>,
  "impact_summary_en": "One sentence impact summary"
}}

Use standard food rescue conversion factors:
- 1 meal ≈ 0.4 kg
- 1 kg food waste → ~2.5 kg CO2 equivalent avoided
- Return ONLY JSON.
""".strip()


def organization_ranking_prompt(
    food_name: str,
    urgency_level: str,
    preparation_state: str,
    dietary_preferences: list,
    candidates: list,
) -> str:
    """
    Prompt to rank candidate organizations for a surplus food listing.
    """
    candidates_str = ""
    for idx, c in enumerate(candidates):
        candidates_str += f"""
Candidate {idx + 1}:
- ID: {c.get("id")}
- Name: {c.get("name")}
- Category: {c.get("category")}
- Capacity (kg/day): {c.get("capacity_kg_per_day")}
- Operating Hours: {c.get("operating_hours")}
- Dietary Preferences Accepted: {', '.join(c.get("dietary_preferences", []))}
- Location: {c.get("address", {}).get("street", "")}, {c.get("address", {}).get("city", "")}
- Description: {c.get("description")}
"""

    return f"""
You are the AI Operations Coordinator for FoodBridge.
Your task is to rank candidate organizations for matching a surplus food listing.

FOOD LISTING DETAILS:
- Item: {food_name}
- Urgency: {urgency_level}
- Prep State: {preparation_state}
- Dietary Tags: {', '.join(dietary_preferences)}

CANDIDATES:
{candidates_str}

Evaluate the candidates and rank them. For each candidate, specify whether they are recommended (is_recommended: true/false), why or why not, a confidence score between 0.0 and 1.0, expected success, and pickup priority.

Return a JSON array with EXACTLY this structure (no markdown code blocks, no text around it):
[
  {{
    "org_id": "candidate_id",
    "org_name": "Candidate Name",
    "is_recommended": true,
    "matching_score": 0.95,
    "expected_success": "High|Medium|Low",
    "pickup_priority": "Critical|High|Medium|Low",
    "reason": "Single sentence explaining why recommended or why not."
  }}
]
""".strip()

