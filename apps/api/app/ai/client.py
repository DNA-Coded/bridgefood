"""
FoodBridge AI - Google AI Studio API Client

Uses the modern `google.genai` SDK (v1.x).
Supports Gemma, Gemini, and other models via Google AI Studio.

Provides:
- Async-compatible execution (thread pool)
- Automatic retry with exponential backoff
- JSON extraction from model response
- Multimodal (text + image bytes) support
- Token usage and latency logging
"""
import asyncio
import json
import logging
import time
import uuid
from typing import Any, Dict, List, Optional

from google import genai
from google.genai import types as genai_types

from app.core.config import settings

logger = logging.getLogger("foodbridge.ai.client")


class GeminiClientError(Exception):
    """Raised when all retry attempts for a Gemini request fail."""
    pass


class GeminiClient:
    """
    Async-compatible wrapper around the google.genai SDK.
    Configured for FoodBridge's structured JSON coordination workflows.
    Supports any model available via Google AI Studio (Gemini, Gemma, etc.).
    """

    MAX_RETRIES = 3
    RETRY_DELAY_SECONDS = 1.5

    def __init__(self, api_key: str, model_id: str = None):
        self._sdk_client = genai.Client(api_key=api_key)
        self.MODEL_ID = model_id or settings.AI_MODEL
        logger.info(f"GeminiClient initialized — model: {self.MODEL_ID}")

    async def generate(
        self,
        prompt: str,
        images: Optional[List[bytes]] = None,
        prompt_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Sends a prompt (optionally with image bytes) to Gemini.
        Returns a parsed JSON dict. Retries up to MAX_RETRIES times.

        Args:
            prompt: The text prompt string.
            images: Optional list of raw image bytes (JPEG).
            prompt_id: Correlation ID for logging.

        Returns:
            Parsed dict from Gemini structured JSON response.

        Raises:
            GeminiClientError: After all retries are exhausted.
        """
        run_id = prompt_id or f"req_{uuid.uuid4().hex[:8]}"
        start_time = time.time()
        last_error: Optional[Exception] = None

        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                # Build the content parts list
                parts: List[Any] = [prompt]
                if images:
                    for img_bytes in images:
                        parts.append(
                            genai_types.Part.from_bytes(
                                data=img_bytes,
                                mime_type="image/jpeg",
                            )
                        )

                logger.info(
                    f"[{run_id}] Calling Gemini (attempt {attempt}/{self.MAX_RETRIES}, "
                    f"images={len(images or [])})"
                )

                # Run the blocking SDK call in a thread pool
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: self._sdk_client.models.generate_content(
                        model=self.MODEL_ID,
                        contents=parts,
                        config=genai_types.GenerateContentConfig(
                            temperature=0.1,
                            top_p=0.95,
                            response_mime_type="application/json",
                        ),
                    ),
                )

                elapsed_ms = int((time.time() - start_time) * 1000)

                # Log token usage if available
                if response.usage_metadata:
                    u = response.usage_metadata
                    logger.info(
                        f"[{run_id}] Tokens — "
                        f"in={u.prompt_token_count}, "
                        f"out={u.candidates_token_count}, "
                        f"total={u.total_token_count} | "
                        f"elapsed={elapsed_ms}ms"
                    )

                raw_text = response.text
                parsed = self._parse_json(raw_text, run_id)
                parsed["_meta"] = {
                    "run_id": run_id,
                    "model": self.MODEL_ID,
                    "elapsed_ms": elapsed_ms,
                    "attempt": attempt,
                }
                return parsed

            except json.JSONDecodeError as e:
                logger.warning(f"[{run_id}] JSON parse failed (attempt {attempt}): {e}")
                last_error = e
            except Exception as e:
                logger.warning(
                    f"[{run_id}] Gemini call failed (attempt {attempt}): "
                    f"{type(e).__name__}: {e}"
                )
                last_error = e

            if attempt < self.MAX_RETRIES:
                await asyncio.sleep(self.RETRY_DELAY_SECONDS * attempt)

        elapsed_ms = int((time.time() - start_time) * 1000)
        logger.error(
            f"[{run_id}] All {self.MAX_RETRIES} attempts failed "
            f"after {elapsed_ms}ms. Last: {last_error}"
        )
        raise GeminiClientError(
            f"Gemini request failed after {self.MAX_RETRIES} retries: {last_error}"
        ) from last_error

    def _parse_json(self, raw_text: str, run_id: str) -> Dict[str, Any]:
        """Extracts and parses JSON from the model response text."""
        text = raw_text.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback: find first JSON object
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                return json.loads(text[start : end + 1])
            logger.error(
                f"[{run_id}] Cannot extract JSON from response: {text[:200]}"
            )
            raise


# ── Module-level singleton ─────────────────────────────────────────────────────

_client_instance: Optional[GeminiClient] = None


def get_gemini_client(api_key: str) -> GeminiClient:
    """Returns (or creates) the singleton GeminiClient with configured model."""
    global _client_instance
    if _client_instance is None:
        _client_instance = GeminiClient(api_key=api_key, model_id=settings.AI_MODEL)
    return _client_instance
