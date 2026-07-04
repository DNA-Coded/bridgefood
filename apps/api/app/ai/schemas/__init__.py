"""
FoodBridge AI - Gemma Orchestration Schemas

Pydantic models for all structured inputs and outputs that flow through
the Gemma AI coordination pipeline. Kept separate from API schemas to
allow independent evolution.
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from enum import Enum


class UrgencyLevel(str, Enum):
    CRITICAL = "CRITICAL"   # Must be collected within 2 hours
    HIGH = "HIGH"           # Collect within 4 hours
    MEDIUM = "MEDIUM"       # Collect within 8 hours
    LOW = "LOW"             # Shelf-stable, flexible pickup


class PreparationState(str, Enum):
    HOT = "hot"
    WARM = "warm"
    AMBIENT = "ambient"
    CHILLED = "chilled"
    FROZEN = "frozen"
    UNKNOWN = "unknown"


# ── Input schemas ─────────────────────────────────────────────────────────────

class FoodAnalysisInput(BaseModel):
    """Input payload sent to the food analysis pipeline."""
    listing_id: Optional[str] = None
    donor_description: str = Field(..., min_length=5)
    food_category: Optional[str] = None    # cooked, raw, packaged
    declared_quantity: Optional[float] = None
    declared_unit: Optional[str] = None
    best_before_hint: Optional[str] = None   # ISO datetime string
    donor_location_city: Optional[str] = None
    image_count: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# ── Structured output sub-models ──────────────────────────────────────────────

class MultilingualSummary(BaseModel):
    en: str
    hi: str
    bn: str


class RecommendedOrgType(BaseModel):
    org_type: str                          # e.g., "community_kitchen", "shelter"
    reason: str                            # Gemma's reasoning


class EmailDraft(BaseModel):
    subject: str
    body_en: str
    body_hi: str
    body_bn: str


class OrgRecommendation(BaseModel):
    org_id: str
    org_name: str
    is_recommended: bool
    matching_score: float                  # 0.0 - 1.0
    expected_success: str                  # e.g., "High", "Medium", "Low"
    pickup_priority: str                  # e.g., "Critical", "High", "Medium", "Low"
    reason: str                           # Gemma's explanation of recommendations/omissions


# ── Full analysis output ───────────────────────────────────────────────────────

class FoodAnalysisResult(BaseModel):
    """
    Structured output from Gemma's food analysis pipeline.
    All fields match the frontend AIAnalysisCard component props.
    """
    food_name: str
    food_category: str                          # cooked | raw | packaged
    food_type: str                              # e.g., "Rice and curry"
    estimated_quantity_kg: float
    estimated_servings: int
    preparation_state: PreparationState
    estimated_shelf_life_hours: float
    urgency_level: UrgencyLevel
    confidence_score: float                     # 0.0 – 1.0
    allergens_detected: List[str]
    recommended_org_types: List[RecommendedOrgType]
    food_safety_notes: str
    reasoning: str                              # Gemma's explanation
    multilingual_summary: MultilingualSummary
    email_draft: Optional[EmailDraft] = None
    safety_flagged: bool = False
    recommendations: List[OrgRecommendation] = Field(default_factory=list)

